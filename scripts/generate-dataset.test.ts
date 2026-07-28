import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildDataset, loadVendorData } from "./generate-dataset.ts";

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

function readCommitted(fileName: string): unknown {
  return JSON.parse(readFileSync(path.join(DATA_DIR, fileName), "utf8"));
}
