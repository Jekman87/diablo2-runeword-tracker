import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { format, resolveConfig } from "prettier";
import ts from "typescript";
import { z } from "zod";

import { itemTypeTranslations } from "../data/ru/item-types.ts";
import { runeTranslations } from "../data/ru/runes.ts";
import { runewordTranslations } from "../data/ru/runewords.ts";
import {
  type ItemType,
  type Rune,
  type Runeword,
  itemTypesSchema,
  runesSchema,
  runewordsSchema,
} from "../src/data/schema.ts";

// Generates `src/data/*.json` from the read-only vendor snapshot. Run it with
// `pnpm data:build`.
//
// The dataset is generated rather than transcribed because a wrong value in
// game data is invisible to every check this repository has: a required level
// of 62 where the game says 65 type-checks, lints and renders perfectly, and
// fails only when a player farms the wrong runes. Generating removes the error
// class instead of trying to detect it.
//
// `scripts/generate-dataset.test.ts` proves the committed JSON still equals
// what `buildDataset` produces, so the two cannot silently diverge.
//
// Russian labels enter here too, from the authored modules under `data/ru/`.
// They are the one part of the dataset that cannot be generated — no machine
// translation, and the official Russian client is not accessible — so they are
// transcribed by hand and this file is what keeps that safe: each translation
// is validated, matched to a key the vendored data defines, and merged into
// the record it belongs to. A key the snapshot does not know fails the build
// rather than leaving a record quietly untranslated, and the per-entry
// `source` notes stay behind: they exist for review, and the JSON ships in the
// bundle.

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const VENDOR_DATA_DIR = path.join(REPO_ROOT, "vendor", "runewizard", "data");
const OUTPUT_DIR = path.join(REPO_ROOT, "src", "data");

export interface Dataset {
  runewords: Runeword[];
  runes: Rune[];
  itemTypes: ItemType[];
}

/**
 * Transforms the vendor snapshot into our own schema. Pure — no I/O — so the
 * drift test can call it directly instead of spawning `pnpm data:build`.
 *
 * The output is parsed against the same schemas the application loads with, so
 * the generator cannot emit data its own consumers would reject.
 */
export function buildDataset(
  vendor: VendorData,
  translations: Translations = REPO_TRANSLATIONS,
): Dataset {
  // Known upstream errors the read-only vendor snapshot still carries. Applied
  // here rather than by editing `vendor/`, so a refresh keeps the corrections
  // until upstream catches up — and so the drift test still owns the JSON.
  vendor = applyVendorCorrections(vendor);

  assertDescriptionKeysAgree(vendor);

  const runeword = validatedTranslations(
    runewordTranslationsSchema,
    translations.runewords,
    vendor.runewords.map((record) => record.title),
    "runeword",
  );
  const rune = validatedTranslations(
    nameTranslationsSchema,
    translations.runes,
    vendor.runes.map((entry) => entry.name),
    "rune",
  );
  const itemType = validatedTranslations(
    nameTranslationsSchema,
    translations.itemTypes,
    Object.keys(vendor.itemTypes),
    "item category",
  );

  const runewords = vendor.runewords.map((record) =>
    buildRuneword(
      record,
      vendor.descriptions[record.title] ?? "",
      runeword[record.title],
    ),
  );

  const runes = vendor.runes.map((entry) => ({
    name: entry.name,
    tier: RUNE_TIERS[entry.tier],
    ...requiredRu(rune[entry.name], entry.name, "rune"),
  }));

  const itemTypes = Object.entries(vendor.itemTypes).map(([name, { url }]) => ({
    name,
    ...(url !== undefined && { url }),
    ...requiredRu(itemType[name], name, "item category"),
  }));

  return {
    // Vendor array order is preserved throughout: the records stay in
    // patch-grouped chronological order, and the runes stay in the canonical
    // in-game progression. Neither is depended on, but both keep a diff after
    // a vendor refresh readable.
    runewords: runewordsSchema.parse(runewords),
    runes: runesSchema.parse(runes),
    itemTypes: itemTypesSchema.parse(itemTypes),
  };
}

/**
 * Reads, evaluates and validates the four vendor data files.
 *
 * The files are read as text rather than imported. They annotate with types
 * they never declare (`TRuneword`, `TItemTypeId`, `TRunewordMeta`), `runes.ts`
 * declares an `export const enum` that Node's type stripping cannot read, and a
 * static import would pull `vendor/` into `pnpm typecheck`, which the
 * build-toolchain spec forbids.
 */
export function loadVendorData(dataDir: string = VENDOR_DATA_DIR): VendorData {
  // Parsed immediately after evaluation. The vendor snapshot is the one input
  // that can change without us changing anything, so a refresh that renames
  // `ttypes` or retypes `level` has to fail on the field that moved rather than
  // produce plausible-looking JSON full of `undefined`.
  return {
    runewords: vendorRunewordsSchema.parse(
      evaluateVendorModule(path.join(dataDir, "runewords.ts")),
    ),
    descriptions: vendorDescriptionsSchema.parse(
      evaluateVendorModule(path.join(dataDir, "runewords-descriptions.ts")),
    ),
    runes: vendorRunesSchema.parse(
      evaluateVendorModule(path.join(dataDir, "runes.ts")),
    ),
    itemTypes: vendorItemTypesSchema.parse(
      evaluateVendorModule(path.join(dataDir, "item-types.ts")),
    ),
  };
}

// --- translation shape ------------------------------------------------------

// Validated with the same posture as the vendor snapshot: strict objects, so a
// field renamed in `data/ru/` fails here rather than being dropped from the
// output. `source` is required on every entry — the sourcing rule says each
// translation names where its wording came from, and a required field is how
// that stays true of entries added later.
const runewordTranslationSchema = z.strictObject({
  name: z.string().min(1),
  itemTypeRestriction: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
  propertyGroups: z
    .array(z.strictObject({ properties: z.array(z.string().min(1)).min(1) }))
    .min(1),
  source: z.string().min(1),
});

const runewordTranslationsSchema = z.record(
  z.string().min(1),
  runewordTranslationSchema,
);

const nameTranslationsSchema = z.record(
  z.string().min(1),
  z.strictObject({ ru: z.string().min(1), source: z.string().min(1) }),
);

export interface Translations {
  runewords: unknown;
  runes: unknown;
  itemTypes: unknown;
}

/** The repository's own authored translations — the default input. */
const REPO_TRANSLATIONS: Translations = {
  runewords: runewordTranslations,
  runes: runeTranslations,
  itemTypes: itemTypeTranslations,
};

/**
 * Validates a translation record and asserts every key names something the
 * vendored data defines.
 *
 * The unknown-key check is the half that cannot be a schema: zod can say a
 * value is a string, but only the snapshot knows whether `"Ancients Pledge"` is
 * a runeword. Without it a mistyped key would validate perfectly and leave the
 * record it meant to translate rendering in English — a silent hole in a
 * dataset the coverage test says is complete.
 */
function validatedTranslations<T>(
  schema: z.ZodType<Record<string, T>>,
  source: unknown,
  knownKeys: string[],
  subject: string,
): Record<string, T> {
  const parsed = schema.parse(source);
  const known = new Set(knownKeys);
  const unknown = Object.keys(parsed).filter((key) => !known.has(key));

  if (unknown.length > 0) {
    throw new Error(
      `Russian translations name ${subject} keys the vendor snapshot does ` +
        `not define: ${unknown.join(", ")}. Fix the key in data/ru/ — a typo ` +
        `here would leave the intended record untranslated.`,
    );
  }

  return parsed;
}

/**
 * The Russian name of a rune or category, which the schema requires. Both
 * lists are small, closed and fully translated, so a missing entry is a
 * mistake rather than a state to render around.
 */
function requiredRu(
  translation: { ru: string } | undefined,
  name: string,
  subject: string,
): { ru: string } {
  if (translation === undefined) {
    throw new Error(
      `No Russian name for ${subject} "${name}". Every ${subject} needs one — ` +
        `add it to data/ru/.`,
    );
  }

  return { ru: translation.ru };
}

// --- vendor shape -----------------------------------------------------------

// Strict about what it knows: exactly the eight observed keys, so a new
// upstream field is a visible failure rather than silently dropped data.
const vendorRunewordSchema = z.strictObject({
  title: z.string().min(1),
  runes: z.array(z.string().min(1)).min(1),
  level: z.int().positive(),
  ttypes: z.array(z.string().min(1)).min(1),
  tinfos: z.string().min(1).optional(),
  version: z.string().min(1).optional(),
  ladder: z.boolean().optional(),
  note: z.string().min(1).optional(),
});

const vendorRunewordsSchema = z.array(vendorRunewordSchema).min(1);

const vendorDescriptionsSchema = z.record(z.string().min(1), z.string().min(1));

const vendorRunesSchema = z
  .array(
    z.strictObject({
      name: z.string().min(1),
      tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    }),
  )
  .min(1);

const vendorItemTypesSchema = z.record(
  z.string().min(1),
  z.strictObject({ url: z.url().optional() }),
);

export interface VendorData {
  runewords: z.infer<typeof vendorRunewordsSchema>;
  descriptions: z.infer<typeof vendorDescriptionsSchema>;
  runes: z.infer<typeof vendorRunesSchema>;
  itemTypes: z.infer<typeof vendorItemTypesSchema>;
}

/**
 * Patches confirmed game-data mistakes in the vendored snapshot without editing
 * `vendor/` itself. Only touches records that exist, so one-runeword fakes used
 * by the generator tests stay unaffected.
 *
 * Sources for each correction: diablo2.io, Maxroll, D2Runewizard (2026 audit).
 */
export function applyVendorCorrections(vendor: VendorData): VendorData {
  const descriptions = { ...vendor.descriptions };

  if (descriptions.Void !== undefined) {
    descriptions.Void = descriptions.Void.replaceAll(
      "+1 to Abyss (Level 3)",
      "+1-3 to Abyss",
    );
  }

  if (descriptions["Breath of the Dying"] !== undefined) {
    descriptions["Breath of the Dying"] = descriptions[
      "Breath of the Dying"
    ].replaceAll(/<\/?U>/g, "");
  }

  if (descriptions.Hysteria !== undefined) {
    descriptions.Hysteria = descriptions.Hysteria.replaceAll(
      "+All Resistances +10",
      "All Resistances +10",
    );
  }

  if (descriptions["Call to Arms"] !== undefined) {
    descriptions["Call to Arms"] = descriptions["Call to Arms"].replaceAll(
      "(varies)*",
      "(varies)",
    );
  }

  const runewords = vendor.runewords.map((record) => {
    if (record.title !== "Vigilance") return record;
    if (record.ttypes.includes("Voodoo Heads")) return record;
    return { ...record, ttypes: [...record.ttypes, "Voodoo Heads"] };
  });

  const vigilanceNeedsVoodoo = runewords.some(
    (record) =>
      record.title === "Vigilance" && record.ttypes.includes("Voodoo Heads"),
  );

  let itemTypes = vendor.itemTypes;
  if (vigilanceNeedsVoodoo && vendor.itemTypes["Voodoo Heads"] === undefined) {
    itemTypes = {};
    for (const [name, value] of Object.entries(vendor.itemTypes)) {
      itemTypes[name] = value;
      // Beside the other class-specific off-hands, so a diff stays readable.
      if (name === "Paladin Shields") {
        itemTypes["Voodoo Heads"] = {};
      }
    }
    if (itemTypes["Voodoo Heads"] === undefined) {
      itemTypes["Voodoo Heads"] = {};
    }
  }

  return { runewords, descriptions, runes: vendor.runes, itemTypes };
}

// --- transformation ---------------------------------------------------------

const RUNE_TIERS = {
  1: "common",
  2: "semirare",
  3: "rare",
} as const;

type VendorRuneword = z.infer<typeof vendorRunewordSchema>;

/**
 * Corrections to vendor editorial notes that age out between seasons.
 *
 * The vendor snapshot named Season 13; Mosaic stayed disabled into Season 14
 * and the number became a lie. The restriction is "not on ladder", and that is
 * what the shipped note says. Kept here rather than in `vendor/`, which is
 * read-only.
 */
const NOTE_OVERRIDES: Readonly<Record<string, string>> = {
  Mosaic: "Disabled on ladder! Can be crafted offline non-ladder.",
};

/**
 * Corrections to the vendor's ladder flag when it contradicts the note.
 *
 * Mosaic shipped as ladder-only, then became craftable only offline /
 * non-ladder while disabled on ladder. Showing an "L" badge next to that
 * note is a contradiction, so the shipped flag is cleared. `vendor/` stays
 * untouched.
 */
const LADDER_OVERRIDES: Readonly<Record<string, boolean>> = {
  Mosaic: false,
};

function buildRuneword(
  record: VendorRuneword,
  description: string,
  translation: z.infer<typeof runewordTranslationSchema> | undefined,
): Runeword {
  // A project-owned override wins over the vendor's editorial note: the
  // snapshot pins a season number that goes stale, and `vendor/` is
  // read-only. Only Mosaic has a note today; the map is the place a future
  // one would be corrected the same way.
  const note = NOTE_OVERRIDES[record.title] ?? record.note;
  const ladderOnly = LADDER_OVERRIDES[record.title] ?? record.ladder === true;

  return {
    name: record.title,
    runes: record.runes,
    requiredLevel: record.level,
    itemTypes: record.ttypes,
    ...(record.tinfos !== undefined && {
      itemTypeRestriction: stripParentheses(record.tinfos, record.title),
    }),
    // Normalised to a real boolean on all 99 records, unlike the other three
    // optional fields, so consumers read a boolean instead of testing a key.
    ladderOnly,
    ...(record.version !== undefined && { patch: record.version }),
    ...(note !== undefined && { note }),
    propertyGroups: splitPropertyGroups(
      description,
      record.title,
      record.ttypes,
    ),
    // The variant minus its `source`. Dropping the note is the point: it names
    // the community page a wording came from, which is review material, and
    // this JSON is shipped in the bundle. The schema then checks the variant
    // mirrors the record it has just been merged into.
    ...(translation !== undefined && { ru: withoutSource(translation) }),
  };
}

/**
 * The variant as the JSON should hold it: every field the schema names, and not
 * the `source` note. Built field by field rather than by spreading and deleting,
 * so a field added to the translation shape has to be added here on purpose —
 * the alternative silently ships whatever `data/ru/` starts carrying.
 */
function withoutSource(
  translation: z.infer<typeof runewordTranslationSchema>,
): NonNullable<Runeword["ru"]> {
  return {
    name: translation.name,
    ...(translation.itemTypeRestriction !== undefined && {
      itemTypeRestriction: translation.itemTypeRestriction,
    }),
    ...(translation.note !== undefined && { note: translation.note }),
    propertyGroups: translation.propertyGroups.map((group) => ({
      properties: group.properties,
    })),
  };
}

/**
 * The source writes `#### Body Armor` singular where `Fortitude`'s category is
 * `Body Armors` plural, so string equality alone misresolves one of the six
 * headings. An enumerated mapping instead of automatic normalisation, because
 * implicit pluralisation is wrong the first time a future heading pluralises
 * differently — an unknown heading must fail loudly, matching the strict
 * posture of the vendor schemas above.
 */
const HEADING_CATEGORIES: Record<string, string> = {
  Weapons: "Weapons",
  Swords: "Swords",
  Shields: "Shields",
  "Body Armor": "Body Armors",
};

interface PropertyGroup {
  itemTypes?: string[];
  properties: string[];
}

/**
 * The vendor property blocks are template literals, not clean lines: across the
 * 99 blocks there are 201 blank lines and 974 indented ones, so neither the
 * trim nor the blank-drop is optional.
 *
 * A `#### <text>` line starts a new labelled group — three runewords grant
 * different properties per base type and the source expresses that with these
 * sub-headings. Headings partition a block completely or not at all: a block
 * with no headings becomes one unlabelled group, and a property line before the
 * first heading fails the build, because lines outside every group have no
 * determinable base types.
 */
function splitPropertyGroups(
  description: string,
  runewordName: string,
  itemTypes: string[],
): PropertyGroup[] {
  const lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!lines.some((line) => line.startsWith("####"))) {
    return [{ properties: lines }];
  }

  const groups: PropertyGroup[] = [];
  let current: PropertyGroup | undefined;

  for (const line of lines) {
    const heading = /^####\s+(.*)$/.exec(line);

    if (heading) {
      current = {
        itemTypes: [resolveHeading(heading[1], runewordName, itemTypes)],
        properties: [],
      };
      groups.push(current);
    } else if (current === undefined) {
      throw new Error(
        `Property block of "${runewordName}" places lines before its first ` +
          `#### heading, so their base types are unknowable. Check the ` +
          `vendor snapshot.`,
      );
    } else {
      current.properties.push(line);
    }
  }

  return groups;
}

/**
 * Resolves a `####` heading to one of the record's own item categories, so a
 * group label is always vocabulary the dataset already speaks. Failing here
 * names the runeword and the heading, rather than letting the heading survive
 * as a property line or ship as an unresolvable label.
 */
function resolveHeading(
  heading: string,
  runewordName: string,
  itemTypes: string[],
): string {
  const category = HEADING_CATEGORIES[heading.trim()];

  if (category === undefined) {
    throw new Error(
      `Unknown property sub-heading "${heading.trim()}" on "${runewordName}". ` +
        `Extend HEADING_CATEGORIES after checking the vendor snapshot.`,
    );
  }

  if (!itemTypes.includes(category)) {
    throw new Error(
      `Sub-heading "${heading.trim()}" on "${runewordName}" resolves to ` +
        `"${category}", which is not one of that record's item categories ` +
        `(${itemTypes.join(", ")}).`,
    );
  }

  return category;
}

/**
 * `(Assassin)` becomes `Assassin` — punctuation is presentation, and Phase 2
 * has to translate the word without the brackets getting in the way. Asserting
 * the source is bracket-wrapped keeps the rule from quietly mangling a value
 * that does not fit it.
 */
function stripParentheses(value: string, runewordName: string): string {
  const trimmed = value.trim();

  if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) {
    throw new Error(
      `Expected a parenthesis-wrapped restriction on "${runewordName}", ` +
        `got ${JSON.stringify(value)}. Strip the parentheses rule no longer ` +
        `fits the vendor data — check the snapshot before changing it.`,
    );
  }

  return trimmed.slice(1, -1).trim();
}

/**
 * Asserts the two vendor files agree on the same set of names in both
 * directions. They do today; the assertion is for after a vendor refresh, so a
 * mismatch is a build failure here rather than a runeword with no properties.
 */
function assertDescriptionKeysAgree(vendor: VendorData): void {
  const titles = new Set(vendor.runewords.map((record) => record.title));
  const described = new Set(Object.keys(vendor.descriptions));

  const missing = [...titles].filter((title) => !described.has(title));
  const orphaned = [...described].filter((key) => !titles.has(key));

  if (missing.length > 0 || orphaned.length > 0) {
    throw new Error(
      "Vendor runeword titles and description keys disagree.\n" +
        `  Runewords with no description: ${formatNames(missing)}\n` +
        `  Descriptions with no runeword: ${formatNames(orphaned)}`,
    );
  }
}

function formatNames(names: string[]): string {
  return names.length === 0 ? "(none)" : names.join(", ");
}

// --- vendor module loading --------------------------------------------------

function evaluateVendorModule(filePath: string): unknown {
  const source = readFileSync(filePath, "utf8");

  const { outputText } = ts.transpileModule(source, {
    fileName: filePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const moduleExports: { default?: unknown } = {};

  // Build-time only and never bundled. The vendor files are committed,
  // reviewed and read-only, and the injected `require` throws so an evaluated
  // module cannot reach beyond itself.
  const forbiddenRequire = (id: string): never => {
    throw new Error(
      `Vendor module ${path.basename(filePath)} tried to require "${id}". ` +
        `The snapshot is expected to be self-contained data.`,
    );
  };

  new Function("exports", "require", outputText)(
    moduleExports,
    forbiddenRequire,
  );

  if (moduleExports.default === undefined) {
    throw new Error(
      `Vendor module ${path.basename(filePath)} has no default export.`,
    );
  }

  return moduleExports.default;
}

// --- I/O entry point --------------------------------------------------------

async function main(): Promise<void> {
  const dataset = buildDataset(loadVendorData());

  await writeJson("runewords.json", dataset.runewords);
  await writeJson("runes.json", dataset.runes);
  await writeJson("item-types.json", dataset.itemTypes);

  console.log(
    `Wrote ${dataset.runewords.length} runewords, ${dataset.runes.length} runes ` +
      `and ${dataset.itemTypes.length} item categories to src/data/.`,
  );
}

/**
 * Formats through Prettier's API with the repository's own resolved config, so
 * `pnpm data:build` leaves a tree `format:check` already accepts. Without it
 * every regeneration would produce a formatting diff — `JSON.stringify`
 * expands `["Ral","Ort","Tal"]` across four lines where Prettier keeps it on
 * one — and would need a `pnpm format` chaser.
 */
async function writeJson(fileName: string, data: unknown): Promise<void> {
  const filePath = path.join(OUTPUT_DIR, fileName);
  const config = await resolveConfig(filePath);
  const formatted = await format(JSON.stringify(data), {
    ...config,
    filepath: filePath,
  });

  writeFileSync(filePath, formatted, "utf8");
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === import.meta.filename
) {
  await main();
}
