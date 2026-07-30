import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
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

describe("property sub-headings become group labels", () => {
  it("splits a headed block into labelled groups, mapping the singular heading", () => {
    const built = buildDataset(
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
    const built = buildDataset(
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

    expect(() => buildDataset(vendor)).toThrow(/Helms/);
    expect(() => buildDataset(vendor)).toThrow(/Test Word/);
  });

  it("throws when a heading resolves outside the record's categories", () => {
    const vendor = vendorWith(
      `
        #### Weapons
        +10 To Strength
      `,
      ["Shields"],
    );

    expect(() => buildDataset(vendor)).toThrow(/Weapons/);
    expect(() => buildDataset(vendor)).toThrow(/Test Word/);
  });

  it("throws on property lines before the first heading", () => {
    const vendor = vendorWith(`
      +5 Defense

      #### Weapons
      +10 To Strength
    `);

    expect(() => buildDataset(vendor)).toThrow(/before its first/);
    expect(() => buildDataset(vendor)).toThrow(/Test Word/);
  });
});

function readCommitted(fileName: string): unknown {
  return JSON.parse(readFileSync(path.join(DATA_DIR, fileName), "utf8"));
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
