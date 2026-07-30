import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { format, resolveConfig } from "prettier";
import ts from "typescript";
import { z } from "zod";

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
export function buildDataset(vendor: VendorData): Dataset {
  assertDescriptionKeysAgree(vendor);

  const runewords = vendor.runewords.map((record) =>
    buildRuneword(record, vendor.descriptions[record.title] ?? ""),
  );

  const runes = vendor.runes.map((rune) => ({
    name: rune.name,
    tier: RUNE_TIERS[rune.tier],
  }));

  const itemTypes = Object.entries(vendor.itemTypes).map(([name, { url }]) => ({
    name,
    ...(url !== undefined && { url }),
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

// --- transformation ---------------------------------------------------------

const RUNE_TIERS = {
  1: "common",
  2: "semirare",
  3: "rare",
} as const;

type VendorRuneword = z.infer<typeof vendorRunewordSchema>;

function buildRuneword(record: VendorRuneword, description: string): Runeword {
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
    ladderOnly: record.ladder === true,
    ...(record.version !== undefined && { patch: record.version }),
    ...(record.note !== undefined && { note: record.note }),
    propertyGroups: splitPropertyGroups(
      description,
      record.title,
      record.ttypes,
    ),
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
