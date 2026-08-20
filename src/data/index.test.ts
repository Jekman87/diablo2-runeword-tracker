import {
  itemTypes,
  itemTypesByName,
  runes,
  runesByName,
  runewordNameAliases,
  runewords,
  runewordsByName,
} from "@/data";
import { runewordsSchema } from "@/data/schema";
import { foldLabel } from "@/runewords/fold";

// This change ships no visible surface, so these tests are its acceptance
// evidence. They target counts and cross-references rather than spot-checking
// values, because a wrong value is what the generator exists to prevent and a
// test comparing against a hand-typed expectation would only re-introduce the
// transcription risk one layer up.

describe("dataset counts and identity", () => {
  it("holds exactly 99 runewords, 33 runes and 21 item categories", () => {
    expect(runewords).toHaveLength(99);
    expect(runes).toHaveLength(33);
    expect(itemTypes).toHaveLength(21);
  });

  it("gives every runeword a distinct name", () => {
    const names = runewords.map((runeword) => runeword.name);

    expect(new Set(names).size).toBe(names.length);
  });
});

describe("the names progress matching answers to", () => {
  // A collision here would not throw: `new Map` keeps the last writer, so one
  // runeword would quietly lose its name to another and an import would mark
  // the wrong row. These are the tests that turn that into a build failure.

  it("indexes both the English name and the Russian label of every runeword", () => {
    const translated = runewords.filter(
      (runeword) => runeword.ru !== undefined,
    );

    expect(runewordNameAliases.size).toBe(runewords.length + translated.length);
  });

  it("resolves every alias to a canonical name the dataset has", () => {
    const unresolved = [...runewordNameAliases.values()].filter(
      (canonical) => !runewordsByName.has(canonical),
    );

    expect(unresolved).toEqual([]);
  });

  it("resolves each name in the language it was written in", () => {
    const pledge = runeword("Ancient's Pledge");
    const russian = pledge.ru?.name;

    expect(russian).toBeDefined();
    expect(runewordNameAliases.get(foldLabel(pledge.name))).toBe(pledge.name);
    expect(runewordNameAliases.get(foldLabel(russian ?? ""))).toBe(pledge.name);
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
      "Voodoo Heads",
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
  it("carries no ladder-only field on any record", () => {
    // Patch 3.3 released the last eight into Non-Ladder, so the flag would be
    // false on all 99 and render nothing. Asserted on the shipped records rather
    // than on the schema, because a stray key in the generated JSON would type
    // as `unknown` and pass a schema check silently.
    const withLadderKey = runewords.filter((entry) =>
      Object.hasOwn(entry, "ladderOnly"),
    );

    expect(withLadderKey).toEqual([]);
  });

  it("carries a patch on 74 records and none on the 25 that predate tracking", () => {
    const withPatch = runewords.filter((entry) => entry.patch !== undefined);

    expect(withPatch).toHaveLength(74);
    expect(runewords.length - withPatch.length).toBe(25);
  });

  it("carries a note only on Mosaic, with its patch", () => {
    const noted = runewords.filter((entry) => entry.note !== undefined);

    expect(noted.map((entry) => entry.name)).toEqual(["Mosaic"]);

    const mosaic = runeword("Mosaic");

    // The note is the only place any ladder restriction is stated anywhere in
    // the dataset, and it is free text the owner edits rather than a flag logic
    // reads. The season number the vendor pinned is what must not come back.
    expect(mosaic.patch).toBe("2.6");
    expect(mosaic.note).toContain("ladder");
    expect(mosaic.note).not.toMatch(/Season \d+/);
  });

  it("does not reduce the progress denominator", () => {
    // The denominator is the whole dataset. Asserted rather than merely stated
    // in a document, because availability flips between ladder seasons and any
    // rule expressed as logic would silently miscount progress.
    expect(runewords.length).toBe(99);
    expect(
      runewords.filter((entry) => entry.note !== undefined).length,
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

describe("malformed Russian variants", () => {
  // A variant is complete or absent — the schema guarantee the Russian
  // locale's whole-record fallback stands on. Each case breaks one clause of
  // that completeness and expects the load to fail on it.

  it("throws when a variant omits its name", () => {
    const record = { ...validRecord(), ru: ruVariantFor(validRecord()) };
    delete (record.ru as Record<string, unknown>).name;

    expect(() => runewordsSchema.parse([record])).toThrow(/ru/);
  });

  it("throws naming the record when a variant invents a restriction", () => {
    // `Ancient's Pledge` carries no English restriction, so a Russian one
    // breaks parity in the only direction a complete variant could.
    const ru = { ...ruVariantFor(validRecord()), itemTypeRestriction: "жезлы" };
    const record = { ...validRecord(), ru };

    expect(() => runewordsSchema.parse([record])).toThrow(
      /Ancient's Pledge.*itemTypeRestriction exactly when/s,
    );
  });

  it("throws naming the record when a variant drops the restriction", () => {
    const source = structuredClone(runeword("Leaf"));
    const ru = ruVariantFor(source);
    delete (ru as Record<string, unknown>).itemTypeRestriction;

    expect(() => runewordsSchema.parse([{ ...source, ru }])).toThrow(
      /Leaf.*itemTypeRestriction exactly when/s,
    );
  });

  it("throws naming the record when a variant drops the note", () => {
    const source = structuredClone(runeword("Mosaic"));
    const ru = ruVariantFor(source);
    delete (ru as Record<string, unknown>).note;

    expect(() => runewordsSchema.parse([{ ...source, ru }])).toThrow(
      /Mosaic.*note exactly when/s,
    );
  });

  it("throws naming the record on a group-count mismatch", () => {
    const source = varyingRecord();
    const ru = ruVariantFor(source);
    ru.propertyGroups = ru.propertyGroups.slice(0, 1);

    expect(() => runewordsSchema.parse([{ ...source, ru }])).toThrow(
      /Fortitude.*1 property groups where the record carries 2/s,
    );
  });

  it("throws naming the record on a line-count mismatch", () => {
    const source = validRecord();
    const ru = ruVariantFor(source);
    ru.propertyGroups[0].properties.push("лишняя строка");

    expect(() => runewordsSchema.parse([{ ...source, ru }])).toThrow(
      /Ancient's Pledge.*group 0 carries \d+ lines where the English group/s,
    );
  });

  it("accepts a record with a complete variant, and one with none", () => {
    const translated = { ...validRecord(), ru: ruVariantFor(validRecord()) };
    const untranslated = { ...validRecord() };
    delete (untranslated as Record<string, unknown>).ru;

    expect(() =>
      runewordsSchema.parse([translated, untranslated]),
    ).not.toThrow();
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

/**
 * A structurally complete Russian variant built from a record's own English
 * shape, so each malformed-variant case starts from validity and breaks
 * exactly one clause. Built rather than cloned from the record's shipped
 * variant, so the cases do not depend on which record happens to carry what.
 */
function ruVariantFor(record: ReturnType<typeof validRecord>) {
  return {
    name: `«${record.name}»`,
    ...(record.itemTypeRestriction !== undefined && {
      itemTypeRestriction: "ограничение",
    }),
    ...(record.note !== undefined && { note: "примечание" }),
    propertyGroups: record.propertyGroups.map((group) => ({
      properties: group.properties.map((_, index) => `строка ${index + 1}`),
    })),
    // Present exactly when the record carries advice — the parity the schema
    // enforces — mirroring the paragraphs count-for-count.
    ...(record.advice !== undefined && {
      advice: {
        paragraphs: record.advice.paragraphs.map(
          (_, index) => `абзац ${index + 1}`,
        ),
      },
    }),
  };
}
