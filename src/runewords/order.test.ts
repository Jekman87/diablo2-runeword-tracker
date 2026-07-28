import { runewords } from "@/data";
import { byRequiredLevel, orderedRunewords } from "@/runewords/order";

// Asserted over the whole dataset rather than a fixture. The failure this
// guards against is a shared level leaving rows in an arbitrary order, and a
// fixture of three records would not contain one — the real data contains
// twenty-three shared levels, the largest of them ten runewords deep.

describe("orderedRunewords", () => {
  it("keeps all 99 records, none lost and none duplicated", () => {
    expect(orderedRunewords).toHaveLength(99);
    expect(new Set(orderedRunewords).size).toBe(99);
    expect([...orderedRunewords].sort(byName)).toEqual(
      [...runewords].sort(byName),
    );
  });

  it("never descends in required level", () => {
    const descents = orderedRunewords.filter(
      (runeword, index) =>
        index > 0 &&
        runeword.requiredLevel < orderedRunewords[index - 1].requiredLevel,
    );

    expect(descents).toEqual([]);
  });

  it("orders a shared level by name", () => {
    const outOfOrder = orderedRunewords.filter((runeword, index) => {
      const previous = orderedRunewords[index - 1];

      return (
        index > 0 &&
        runeword.requiredLevel === previous.requiredLevel &&
        runeword.name < previous.name
      );
    });

    expect(outOfOrder).toEqual([]);
  });

  it("orders the ten runewords sharing level 65 by name", () => {
    const shared = orderedRunewords
      .filter((runeword) => runeword.requiredLevel === 65)
      .map(nameOf);

    expect(shared).toEqual([
      "Brand",
      "Destruction",
      "Dream",
      "Enigma",
      "Faith",
      "Famine",
      "Fury",
      "Ice",
      "Last Wish",
      "Phoenix",
    ]);
  });

  it("is deterministic across sorts of the same dataset", () => {
    const again = [...runewords].sort(byRequiredLevel).map(nameOf);

    expect(orderedRunewords.map(nameOf)).toEqual(again);
  });

  it("is not the dataset's own storage order", () => {
    expect(orderedRunewords.map(nameOf)).not.toEqual(runewords.map(nameOf));
    expect(orderedRunewords[0].name).not.toBe(runewords[0].name);
  });

  it("leaves the dataset in the order `@/data` hands it out", () => {
    expect(runewords[0].name).toBe("Ancient's Pledge");
  });

  it("reads no availability field", () => {
    // Availability is decoration by requirement, and the row order is the one
    // piece of logic in this change that could have quietly started reading it.
    // Clear all three fields on every record and the order must not move.
    const blind = runewords
      .map((runeword) => ({
        ...runeword,
        ladderOnly: false,
        patch: undefined,
        note: undefined,
      }))
      .sort(byRequiredLevel);

    expect(blind.map(nameOf)).toEqual(orderedRunewords.map(nameOf));
  });
});

describe("byRequiredLevel", () => {
  it("puts the lower level first", () => {
    const lowest = atLevel(13);
    const highest = atLevel(69);

    expect(byRequiredLevel(lowest, highest)).toBeLessThan(0);
    expect(byRequiredLevel(highest, lowest)).toBeGreaterThan(0);
  });

  it("falls back to the name when levels match", () => {
    const brand = named("Brand");
    const phoenix = named("Phoenix");

    expect(brand.requiredLevel).toBe(phoenix.requiredLevel);
    expect(byRequiredLevel(brand, phoenix)).toBeLessThan(0);
    expect(byRequiredLevel(phoenix, brand)).toBeGreaterThan(0);
  });

  it("reports a runeword as equal to itself", () => {
    expect(byRequiredLevel(named("Enigma"), named("Enigma"))).toBe(0);
  });
});

function nameOf(runeword: { name: string }) {
  return runeword.name;
}

function byName(a: { name: string }, b: { name: string }) {
  return a.name < b.name ? -1 : 1;
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}

/** The first runeword in the dataset requiring a given level. */
function atLevel(requiredLevel: number) {
  const found = runewords.find(
    (runeword) => runeword.requiredLevel === requiredLevel,
  );

  if (!found) throw new Error(`No runeword requires level ${requiredLevel}`);

  return found;
}
