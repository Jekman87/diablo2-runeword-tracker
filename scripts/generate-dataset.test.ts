import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  type Translations,
  type VendorData,
  buildDataset,
  loadVendorData,
} from "./generate-dataset.ts";

// The generator is a second way to produce `src/data/`, so someone can edit the
// JSON directly and skip it. This test turns that into a failure that names the
// diverging file, which is the earliest honest signal available.
//
// It compares **parsed objects**, not file text. That way a formatting change
// can never fail the data test, and the data test can never be satisfied by
// reformatting — each check owns exactly one concern.
//
// Vitest's default include picks this file up with no config change, and it
// needs nothing from the `jsdom` environment the project configures globally.

const DATA_DIR = path.resolve(import.meta.dirname, "..", "src", "data");

const generated = buildDataset(loadVendorData());

describe("the committed dataset matches the generator", () => {
  // Russian labels are inside these comparisons rather than beside them: the
  // merged output is what the application loads, so the drift check has to
  // cover the whole record or the half it skipped is the half that can drift.

  it("runewords.json is what the generator produces", () => {
    expect(readCommitted("runewords.json")).toEqual(generated.runewords);
  });

  it("runes.json is what the generator produces", () => {
    expect(readCommitted("runes.json")).toEqual(generated.runes);
  });

  it("item-types.json is what the generator produces", () => {
    expect(readCommitted("item-types.json")).toEqual(generated.itemTypes);
  });
});

describe("Russian translations are merged in full", () => {
  // The coverage assertion the design asks for. Without it an omitted variant
  // would render its English fallback — coherent, and therefore invisible.

  it("translates all 99 runewords, all 33 runes and all 20 categories", () => {
    expect(
      generated.runewords.filter((record) => record.ru !== undefined),
    ).toHaveLength(99);
    expect(generated.runes).toHaveLength(33);
    expect(generated.itemTypes).toHaveLength(20);
    // `ru` is required on both reference schemas, so parsing already proved
    // every entry carries one; these two assert the lists are whole.
  });

  it("mirrors every English property line with a Russian one", () => {
    for (const record of generated.runewords) {
      expect(record.ru?.propertyGroups).toHaveLength(
        record.propertyGroups.length,
      );

      record.propertyGroups.forEach((group, index) => {
        expect(record.ru?.propertyGroups[index].properties).toHaveLength(
          group.properties.length,
        );
      });
    }
  });

  it("keeps source notes out of the emitted data", () => {
    // The notes name community pages and record disagreements — review
    // material for the repository, not payload for the bundle.
    expect(JSON.stringify(generated)).not.toContain("diablo2-resurrected.ru");
    expect(JSON.stringify(generated)).not.toContain("source");
  });

  it("fails naming a translation key the vendor snapshot does not define", () => {
    const vendor = vendorWith("+10 To Strength");
    const translations = translationsFor(vendor, {
      "Tset Word": {
        name: "Опечатка",
        propertyGroups: [{ properties: ["+10 к силе"] }],
        source: "test",
      },
    });

    expect(() => buildDataset(vendor, translations)).toThrow(/Tset Word/);
    expect(() => buildDataset(vendor, translations)).toThrow(/not define/);
  });

  it("fails naming a rune with no Russian name", () => {
    const vendor = vendorWith("+10 To Strength");
    const translations = translationsFor(vendor);
    translations.runes = {};

    expect(() => buildDataset(vendor, translations)).toThrow(/"El"/);
  });

  it("leaves a runeword with no translation untranslated rather than failing", () => {
    // The whole-record fallback's build-time half: a vendor refresh that adds
    // a runeword must still produce a loadable dataset.
    const vendor = vendorWith("+10 To Strength");
    const translations = translationsFor(vendor);
    translations.runewords = {};

    expect(buildDataset(vendor, translations).runewords[0].ru).toBeUndefined();
  });
});

describe("property sub-headings become group labels", () => {
  it("splits a headed block into labelled groups, mapping the singular heading", () => {
    const built = buildFake(
      vendorWith(`
        #### Weapons
        +10 To Strength

        #### Body Armor
        +20 To Vitality
      `),
    );

    // `#### Body Armor` is the one heading the source writes in the singular;
    // the explicit mapping resolves it to the record's `Body Armors` category.
    expect(built.runewords[0].propertyGroups).toEqual([
      { itemTypes: ["Weapons"], properties: ["+10 To Strength"] },
      { itemTypes: ["Body Armors"], properties: ["+20 To Vitality"] },
    ]);
  });

  it("keeps a block with no headings as one unlabelled group", () => {
    const built = buildFake(
      vendorWith(`
        +10 To Strength
        +20 To Vitality
      `),
    );

    expect(built.runewords[0].propertyGroups).toEqual([
      { properties: ["+10 To Strength", "+20 To Vitality"] },
    ]);
  });

  it("throws naming the runeword and an unknown heading", () => {
    const vendor = vendorWith(`
      #### Helms
      +10 To Strength
    `);

    expect(() => buildFake(vendor)).toThrow(/Helms/);
    expect(() => buildFake(vendor)).toThrow(/Test Word/);
  });

  it("throws when a heading resolves outside the record's categories", () => {
    const vendor = vendorWith(
      `
        #### Weapons
        +10 To Strength
      `,
      ["Shields"],
    );

    expect(() => buildFake(vendor)).toThrow(/Weapons/);
    expect(() => buildFake(vendor)).toThrow(/Test Word/);
  });

  it("throws on property lines before the first heading", () => {
    const vendor = vendorWith(`
      +5 Defense

      #### Weapons
      +10 To Strength
    `);

    expect(() => buildFake(vendor)).toThrow(/before its first/);
    expect(() => buildFake(vendor)).toThrow(/Test Word/);
  });
});

function readCommitted(fileName: string): unknown {
  return JSON.parse(readFileSync(path.join(DATA_DIR, fileName), "utf8"));
}

/**
 * Builds a fake snapshot with translations shaped to it, so a case about the
 * property-block split states only the block. The repository's own
 * translations name the 99 real runewords and would fail the unknown-key check
 * against a one-record fake — correctly, which is why these cases supply their
 * own instead of turning that check off.
 */
function buildFake(vendor: VendorData) {
  return buildDataset(vendor, translationsFor(vendor));
}

/**
 * A one-runeword vendor snapshot around a single property block, so each case
 * states only the block it is about. The default categories match the two the
 * headed-block cases label.
 */
function vendorWith(
  description: string,
  ttypes: string[] = ["Weapons", "Body Armors"],
): VendorData {
  return {
    runewords: [{ title: "Test Word", runes: ["El"], level: 11, ttypes }],
    descriptions: { "Test Word": description },
    runes: [{ name: "El", tier: 1 }],
    itemTypes: Object.fromEntries(ttypes.map((name) => [name, {}])),
  };
}

/**
 * Translations shaped to a fake snapshot, so a case about the property-block
 * split does not also have to state a Russian variant. The runeword's variant
 * is omitted by default — those cases assert English structure, and a variant
 * mirroring a block the case is about would have to be maintained twice.
 */
function translationsFor(
  vendor: VendorData,
  runewords: Record<string, unknown> = {},
): Translations {
  return {
    runewords,
    runes: Object.fromEntries(
      vendor.runes.map((rune) => [
        rune.name,
        { ru: rune.name, source: "test" },
      ]),
    ),
    itemTypes: Object.fromEntries(
      Object.keys(vendor.itemTypes).map((name) => [
        name,
        { ru: name, source: "test" },
      ]),
    ),
  };
}
