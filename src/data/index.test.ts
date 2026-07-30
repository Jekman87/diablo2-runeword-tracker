import {
  itemTypes,
  itemTypesByName,
  runes,
  runesByName,
  runewords,
} from "@/data";
import { runewordsSchema } from "@/data/schema";

// This change ships no visible surface, so these tests are its acceptance
// evidence. They target counts and cross-references rather than spot-checking
// values, because a wrong value is what the generator exists to prevent and a
// test comparing against a hand-typed expectation would only re-introduce the
// transcription risk one layer up.

describe("dataset counts and identity", () => {
  it("holds exactly 99 runewords, 33 runes and 20 item categories", () => {
    expect(runewords).toHaveLength(99);
    expect(runes).toHaveLength(33);
    expect(itemTypes).toHaveLength(20);
  });

  it("gives every runeword a distinct name", () => {
    const names = runewords.map((runeword) => runeword.name);

    expect(new Set(names).size).toBe(names.length);
  });
});

describe("rune references", () => {
  it("resolves every rune named by every runeword", () => {
    const unresolved = [
      ...new Set(runewords.flatMap((runeword) => runeword.runes)),
    ].filter((name) => !runesByName.has(name));

    expect(unresolved).toEqual([]);
  });

  it("holds 343 rune slots across the dataset", () => {
    const slots = runewords.reduce(
      (total, runeword) => total + runeword.runes.length,
      0,
    );

    expect(slots).toBe(343);
  });

  it("preserves rune order", () => {
    expect(runeword("Ancient's Pledge").runes).toEqual(["Ral", "Ort", "Tal"]);
  });

  it("preserves repeated runes rather than collapsing them", () => {
    expect(runeword("Infinity").runes).toEqual(["Ber", "Mal", "Ber", "Ist"]);
  });

  it("keeps a repeat on exactly the five runewords that have one", () => {
    const repeating = runewords
      .filter(
        ({ runes: sequence }) => new Set(sequence).size !== sequence.length,
      )
      .map((entry) => entry.name);

    expect(repeating).toEqual([
      "Sanctuary",
      "Infinity",
      "Last Wish",
      "Phoenix",
      "Bone",
    ]);
  });
});

describe("rune reference data", () => {
  it("runs from El to Zod in the canonical order", () => {
    expect(runes.at(0)?.name).toBe("El");
    expect(runes.at(-1)?.name).toBe("Zod");
  });

  it("bands the tiers into three named groups of 11", () => {
    const bands = { common: 0, semirare: 0, rare: 0 };

    for (const rune of runes) bands[rune.tier] += 1;

    expect(bands).toEqual({ common: 11, semirare: 11, rare: 11 });
  });
});

describe("item type references", () => {
  it("resolves every category named by every runeword", () => {
    const unresolved = [
      ...new Set(runewords.flatMap((runeword) => runeword.itemTypes)),
    ].filter((name) => !itemTypesByName.has(name));

    expect(unresolved).toEqual([]);
  });

  it("validates the four categories that have no reference URL", () => {
    const withoutUrl = itemTypes
      .filter((itemType) => itemType.url === undefined)
      .map((itemType) => itemType.name);

    expect(withoutUrl).toEqual([
      "Grimoire",
      "Melee Weapons",
      "Missile Weapons",
      "Weapons",
    ]);
  });

  it("stores restrictions without surrounding parentheses", () => {
    expect(runeword("Leaf").itemTypeRestriction).toBe("Not Orbs/Wands");
    expect(runeword("Mosaic").itemTypeRestriction).toBe("Assassin");

    const bracketed = runewords.filter(
      ({ itemTypeRestriction }) =>
        itemTypeRestriction !== undefined &&
        (itemTypeRestriction.startsWith("(") ||
          itemTypeRestriction.endsWith(")")),
    );

    expect(bracketed).toEqual([]);
  });

  it("exposes no restriction on a runeword that needs no narrowing", () => {
    expect(runeword("Ancient's Pledge").itemTypeRestriction).toBeUndefined();
  });
});

describe("socket count", () => {
  it("is not stored as a field", () => {
    for (const entry of runewords) {
      expect(Object.keys(entry)).not.toContain("sockets");
      expect(Object.keys(entry)).not.toContain("socketCount");
    }
  });

  it("derives from the rune sequence and ranges from 2 to 6", () => {
    const counts = runewords.map((entry) => entry.runes.length);

    expect(Math.min(...counts)).toBe(2);
    expect(Math.max(...counts)).toBe(6);
  });
});

describe("granted properties", () => {
  it("gives every runeword at least one group with at least one line", () => {
    const empty = runewords
      .filter(
        (entry) =>
          entry.propertyGroups.length === 0 ||
          entry.propertyGroups.some((group) => group.properties.length === 0),
      )
      .map((entry) => entry.name);

    expect(empty).toEqual([]);
  });

  it("carries no empty or whitespace-padded line in any group", () => {
    const malformed = runewords.flatMap((entry) =>
      entry.propertyGroups.flatMap((group) =>
        group.properties.filter((line) => line !== line.trim() || line === ""),
      ),
    );

    expect(malformed).toEqual([]);
  });

  it("splits a block into individual lines", () => {
    expect(
      runeword("Ancient's Pledge").propertyGroups[0].properties.at(0),
    ).toBe("+50% Enhanced Defense");
  });

  it("gives 96 runewords exactly one unlabelled group", () => {
    const uniform = runewords.filter(
      (entry) => entry.propertyGroups.length === 1,
    );

    expect(uniform).toHaveLength(96);
    expect(
      uniform.filter(
        (entry) => entry.propertyGroups[0].itemTypes !== undefined,
      ),
    ).toEqual([]);
  });

  it("gives the three varying runewords two labelled groups each", () => {
    const varying = runewords
      .filter((entry) => entry.propertyGroups.length > 1)
      .map((entry) => entry.name);

    expect(varying).toEqual(["Fortitude", "Phoenix", "Spirit"]);

    for (const name of varying) {
      const groups = runeword(name).propertyGroups;

      expect(groups).toHaveLength(2);
      expect(groups.filter((group) => group.itemTypes === undefined)).toEqual(
        [],
      );
    }
  });

  it("keeps Fortitude complete at 12 lines per base", () => {
    const [weapons, bodyArmors] = runeword("Fortitude").propertyGroups;

    expect(weapons.itemTypes).toEqual(["Weapons"]);
    expect(weapons.properties).toHaveLength(12);
    expect(bodyArmors.itemTypes).toEqual(["Body Armors"]);
    expect(bodyArmors.properties).toHaveLength(12);
  });

  it("labels every group with the record's own categories, each claimed once", () => {
    for (const entry of runewords.filter(
      (record) => record.propertyGroups.length > 1,
    )) {
      const claimed = entry.propertyGroups.flatMap(
        (group) => group.itemTypes ?? [],
      );

      expect([...claimed].sort()).toEqual([...entry.itemTypes].sort());
      expect(new Set(claimed).size).toBe(claimed.length);
    }
  });

  it("lets no heading survive as a property line, leaving 969 in total", () => {
    const lines = runewords.flatMap((entry) =>
      entry.propertyGroups.flatMap((group) => group.properties),
    );

    expect(lines.filter((line) => line.startsWith("####"))).toEqual([]);
    expect(lines).toHaveLength(969);
  });
});

describe("required levels", () => {
  it("are positive integers within the game's range of 13 to 69", () => {
    const levels = runewords.map((entry) => entry.requiredLevel);

    for (const level of levels) {
      expect(Number.isInteger(level)).toBe(true);
      expect(level).toBeGreaterThan(0);
    }

    expect(Math.min(...levels)).toBe(13);
    expect(Math.max(...levels)).toBe(69);
  });
});

describe("availability metadata", () => {
  it("exposes a ladder-only boolean on all 99, set on exactly 9", () => {
    const missing = runewords.filter(
      (entry) => typeof entry.ladderOnly !== "boolean",
    );

    expect(missing).toEqual([]);
    expect(runewords.filter((entry) => entry.ladderOnly)).toHaveLength(9);
  });

  it("carries a patch on 74 records and none on the 25 that predate tracking", () => {
    const withPatch = runewords.filter((entry) => entry.patch !== undefined);

    expect(withPatch).toHaveLength(74);
    expect(runewords.length - withPatch.length).toBe(25);
  });

  it("carries a note only on Mosaic, alongside its other two badges", () => {
    const noted = runewords.filter((entry) => entry.note !== undefined);

    expect(noted.map((entry) => entry.name)).toEqual(["Mosaic"]);

    const mosaic = runeword("Mosaic");

    expect(mosaic.ladderOnly).toBe(true);
    expect(mosaic.patch).toBe("2.6");
    expect(mosaic.note).toContain("Season 13");
  });

  it("does not reduce the progress denominator", () => {
    // The denominator is the whole dataset. Asserted rather than merely stated
    // in a document, because availability flips between ladder seasons and any
    // rule expressed as logic would silently miscount progress.
    expect(runewords.length).toBe(99);
    expect(
      runewords.filter((entry) => entry.ladderOnly || entry.note !== undefined)
        .length,
    ).toBeLessThan(runewords.length);
  });
});

describe("malformed data", () => {
  it("throws naming a required field that has been removed", () => {
    const withoutLevel: Record<string, unknown> = { ...validRecord() };
    delete withoutLevel.requiredLevel;

    expect(() => runewordsSchema.parse([withoutLevel])).toThrow(
      /requiredLevel/,
    );
  });

  it("throws naming a field given the wrong type", () => {
    const wrongType = { ...validRecord(), runes: "Ral Ort Tal" };

    expect(() => runewordsSchema.parse([wrongType])).toThrow(/runes/);
  });

  it("throws when a record carries no group at all", () => {
    const noGroups = { ...validRecord(), propertyGroups: [] };

    expect(() => runewordsSchema.parse([noGroups])).toThrow(/propertyGroups/);
  });

  it("throws when a group carries no line", () => {
    const emptyGroup = {
      ...validRecord(),
      propertyGroups: [{ properties: [] }],
    };

    expect(() => runewordsSchema.parse([emptyGroup])).toThrow(/properties/);
  });

  it("throws when a single group carries a label", () => {
    const record = validRecord();
    const labelled = {
      ...record,
      propertyGroups: [
        { ...record.propertyGroups[0], itemTypes: [record.itemTypes[0]] },
      ],
    };

    expect(() => runewordsSchema.parse([labelled])).toThrow(
      /single property group/,
    );
  });

  it("throws when one of several groups is unlabelled", () => {
    const record = varyingRecord();
    delete record.propertyGroups[1].itemTypes;

    expect(() => runewordsSchema.parse([record])).toThrow(
      /every group must be labelled/,
    );
  });

  it("throws when two groups claim the same category", () => {
    const record = varyingRecord();
    record.propertyGroups[1].itemTypes = record.propertyGroups[0].itemTypes;

    expect(() => runewordsSchema.parse([record])).toThrow(/claimed by 2/);
  });

  it("accepts a valid single-unlabelled-group record", () => {
    expect(() => runewordsSchema.parse([validRecord()])).not.toThrow();
  });
});

function runeword(name: string) {
  const found = runewords.find((entry) => entry.name === name);

  if (!found) throw new Error(`No runeword named "${name}" in the dataset.`);

  return found;
}

function validRecord() {
  return structuredClone(runeword("Ancient's Pledge"));
}

/** A record with two labelled groups, for the partition-invariant cases. */
function varyingRecord() {
  return structuredClone(runeword("Fortitude"));
}
