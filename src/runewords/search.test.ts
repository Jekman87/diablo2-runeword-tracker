import { runes, runewords } from "@/data";
import { matchesQuery } from "@/runewords/search";

// The three fields are asserted separately, because "it searches text" is a
// claim about three different code paths and only one of them is the name.

describe("the name", () => {
  it("matches a partial name", () => {
    expect(matching("lea")).toContain("Leaf");
  });

  it("does not present a runeword whose three fields all lack the query", () => {
    // `lea` also occurs inside `Melee Weapons`, so the useful assertion is not a
    // count but that everything absent really lacks the text everywhere.
    const missed = runewords.filter(
      (runeword) =>
        !matchesQuery(runeword, "lea") &&
        [
          runeword.name,
          ...runeword.itemTypes,
          runeword.itemTypeRestriction ?? "",
        ].some((field) => field.toLowerCase().includes("lea")),
    );

    expect(missed).toEqual([]);
  });

  it("matches a whole name", () => {
    expect(matching("Spirit")).toEqual(["Spirit"]);
  });
});

describe("the base item categories", () => {
  it("matches a fragment mid-word rather than only at the start", () => {
    // `armor` is inside `Body Armors`, not at its start. All 22 runewords naming
    // that category are found, which is what makes the matcher a substring one.
    const found = matching("armor");
    const naming = runewords
      .filter((runeword) => runeword.itemTypes.includes("Body Armors"))
      .map((runeword) => runeword.name);

    expect(found).toHaveLength(22);
    expect(found.sort()).toEqual(naming.sort());
  });

  it("matches a category that is not the first one named", () => {
    // `Ancient's Pledge` names `Shields` then `Grimoire`.
    expect(matching("grimoire")).toContain("Ancient's Pledge");
  });
});

describe("the item-type restriction", () => {
  it("matches on the restriction alone", () => {
    // No category contains `assassin`, and the restriction is nonetheless
    // rendered in the column being searched.
    expect(matching("assassin").sort()).toEqual([
      "Chaos",
      "Mosaic",
      "Pattern",
      "Treachery",
    ]);
  });

  it("matches a restriction that excludes rather than names a class", () => {
    expect(matching("orbs")).toContain("Leaf");
  });

  it("survives a runeword with no restriction at all", () => {
    const enigma = named("Enigma");

    expect(enigma.itemTypeRestriction).toBeUndefined();
    expect(matchesQuery(enigma, "assassin")).toBe(false);
  });
});

describe("what the query is not", () => {
  it("does not match a runeword on account of its runes", () => {
    // Twenty-three of the 33 rune names occur in no name, category or
    // restriction, so they are the ones that can prove a rune is not a search
    // term. The other ten — `El` inside `Delirium`, `Mal` inside `Malice` — match
    // as substrings of visible text, which is the name column working rather than
    // rune search returning.
    const absent = runes
      .map((rune) => rune.name)
      .filter((name) =>
        runewords.every(
          (runeword) =>
            ![
              runeword.name,
              ...runeword.itemTypes,
              runeword.itemTypeRestriction ?? "",
            ].some((field) => field.toLowerCase().includes(name.toLowerCase())),
        ),
      );

    expect(absent).toContain("Shael");
    expect(absent.length).toBeGreaterThan(20);

    for (const rune of absent) {
      // `Shael` is in twenty runewords' rune sequences and matches none of them.
      expect(matching(rune)).toEqual([]);
    }
  });

  it("does not match on the patch that introduced a runeword", () => {
    expect(runewords.some((runeword) => runeword.patch === "2.6")).toBe(true);
    expect(matching("2.6")).toEqual([]);
  });

  it("does not match on a note", () => {
    const mosaic = named("Mosaic");

    expect(mosaic.note).toBeDefined();
    expect(matchesQuery(mosaic, mosaic.note ?? "")).toBe(false);
  });

  it("does not match on a granted property", () => {
    expect(matching("Enhanced Defense")).toEqual([]);
  });
});

describe("how the query is read", () => {
  it("ignores case in either direction", () => {
    expect(matching("SPIRIT")).toEqual(matching("spirit"));
    expect(matching("Spirit")).toEqual(matching("spirit"));
    expect(matching("bOdY aRmOrS")).toHaveLength(22);
  });

  it("behaves as its trimmed form", () => {
    expect(matching("  spirit  ")).toEqual(matching("spirit"));
    expect(matching("\tarmor\n")).toEqual(matching("armor"));
  });

  it("removes no row when empty", () => {
    expect(matching("")).toHaveLength(99);
    expect(matching("   ")).toHaveLength(99);
  });

  it("removes every row when it occurs nowhere", () => {
    expect(matching("qzx")).toEqual([]);
  });
});

/** The names of the runewords a query matches, in the dataset's own order. */
function matching(query: string) {
  return runewords
    .filter((runeword) => matchesQuery(runeword, query))
    .map((runeword) => runeword.name);
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
