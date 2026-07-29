import { type Runeword, runewords } from "@/data";
import { byRequiredLevel, orderedRunewords } from "@/runewords/order";
import {
  type SortDirection,
  type SortKey,
  comparatorFor,
  sortDirections,
  sortKeys,
} from "@/runewords/sort";

// Over the whole dataset again, and for the same reason as `order.test.ts`: the
// defect these comparators exist to prevent is a group of rows the key cannot
// separate, and the real data is what has 45 of them sharing one socket count.

const NOTHING_CRAFTED: ReadonlySet<string> = new Set();

describe("the five keys", () => {
  it("is one per column", () => {
    expect(sortKeys).toEqual([
      "crafted",
      "name",
      "runes",
      "itemTypes",
      "requiredLevel",
    ]);
    expect(sortDirections).toEqual(["ascending", "descending"]);
  });

  it("orders by name from A to Z, and back again", () => {
    expect(sorted("name", "ascending")[0]).toBe("Ancient's Pledge");
    expect(sorted("name", "descending")[0]).toBe("Zephyr");
  });

  it("orders by socket count, fewest first", () => {
    const counts = sortedRunewords("runes", "ascending").map(
      (runeword) => runeword.runes.length,
    );

    expect(counts.slice(0, 14).every((count) => count === 2)).toBe(true);
    expect(counts.slice(14, 59).every((count) => count === 3)).toBe(true);
    expect(descents(counts)).toEqual([]);
  });

  it("orders by the first base category only", () => {
    const first = sortedRunewords("itemTypes", "ascending").map(
      (runeword) => runeword.itemTypes[0],
    );

    expect(first[0]).toBe("Axes");
    expect(descents(first.map(codePointRank))).toEqual([]);
  });

  it("orders by required level, lowest first", () => {
    const levels = sortedRunewords("requiredLevel", "ascending").map(
      (runeword) => runeword.requiredLevel,
    );

    expect(levels[0]).toBe(13);
    expect(descents(levels)).toEqual([]);
  });

  it("puts un-crafted rows first when ascending", () => {
    const crafted = new Set(["Enigma", "Spirit", "Leaf"]);
    const marked = sortedRunewords("crafted", "ascending", crafted).map(
      (runeword) => crafted.has(runeword.name),
    );

    // Ninety-six unmarked, then the three marked. The reason to order a tracker
    // by crafted state is to see what is left.
    expect(marked.slice(0, 96).every((isCrafted) => !isCrafted)).toBe(true);
    expect(marked.slice(96)).toEqual([true, true, true]);
  });

  it("puts crafted rows first when descending", () => {
    const crafted = new Set(["Enigma", "Spirit", "Leaf"]);

    expect(sorted("crafted", "descending", crafted).slice(0, 3)).toEqual([
      "Leaf",
      "Spirit",
      "Enigma",
    ]);
  });
});

describe("ascending required level is the default order", () => {
  it("is `orderedRunewords` exactly", () => {
    expect(sorted("requiredLevel", "ascending")).toEqual(
      orderedRunewords.map((runeword) => runeword.name),
    );
  });
});

describe("every order is total", () => {
  it("breaks a shared socket count by level and then by name", () => {
    const threes = sortedRunewords("runes", "ascending").filter(
      (runeword) => runeword.runes.length === 3,
    );

    expect(threes).toHaveLength(45);
    expect(threes.map((r) => r.name)).toEqual(
      [...threes].sort(byRequiredLevel).map((r) => r.name),
    );
  });

  it("breaks a shared first category by level and then by name", () => {
    const armours = sortedRunewords("itemTypes", "ascending").filter(
      (runeword) => runeword.itemTypes[0] === "Body Armors",
    );

    expect(armours).toHaveLength(21);
    expect(armours.map((r) => r.name)).toEqual(
      [...armours].sort(byRequiredLevel).map((r) => r.name),
    );
  });

  it("breaks a shared crafted state by level and then by name", () => {
    // Two values against 99 rows, which is the least separating key of the five.
    expect(sorted("crafted", "ascending")).toEqual(
      orderedRunewords.map((runeword) => runeword.name),
    );
  });

  it("breaks a shared level by name, ascending", () => {
    const atSixtyFive = sortedRunewords("requiredLevel", "ascending")
      .filter((runeword) => runeword.requiredLevel === 65)
      .map((runeword) => runeword.name);

    expect(atSixtyFive).toEqual([
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
});

describe("what reversing a direction does and does not reverse", () => {
  it("reverses the key", () => {
    const counts = sortedRunewords("runes", "descending").map(
      (runeword) => runeword.runes.length,
    );

    expect(counts.slice(0, 5).every((count) => count === 6)).toBe(true);
    expect(counts[98]).toBe(2);
  });

  it("leaves the tiebreak ascending", () => {
    const threes = sortedRunewords("runes", "descending").filter(
      (runeword) => runeword.runes.length === 3,
    );

    // Still level-then-name inside the group, so a descending presentation is
    // not the ascending one read backwards.
    expect(threes.map((r) => r.name)).toEqual(
      [...threes].sort(byRequiredLevel).map((r) => r.name),
    );
  });

  it("is not the ascending sequence reversed", () => {
    const ascending = sorted("runes", "ascending");
    const descending = sorted("runes", "descending");

    expect(descending).not.toEqual([...ascending].reverse());
  });

  it("reverses the level without reversing the names sharing one", () => {
    const atSixtyFive = sortedRunewords("requiredLevel", "descending")
      .filter((runeword) => runeword.requiredLevel === 65)
      .map((runeword) => runeword.name);

    expect(atSixtyFive[0]).toBe("Brand");
    expect(atSixtyFive[9]).toBe("Phoenix");
  });
});

describe("determinism", () => {
  it("produces the same sequence for the same inputs", () => {
    for (const key of sortKeys) {
      for (const direction of sortDirections) {
        expect(sorted(key, direction)).toEqual(sorted(key, direction));
      }
    }
  });

  it("does not depend on the order the input arrived in", () => {
    // A filtered array arrives in whatever order the filter left it. If the
    // comparator leant on `Array.prototype.sort`'s stability, the presented order
    // would be a property of the filter rather than of the data.
    const shuffled = [...runewords].reverse();

    for (const key of sortKeys) {
      for (const direction of sortDirections) {
        const comparator = comparatorFor(key, direction, NOTHING_CRAFTED);

        expect([...shuffled].sort(comparator).map(nameOf)).toEqual(
          sorted(key, direction),
        );
      }
    }
  });
});

describe("what no comparator may read", () => {
  it("orders the dataset identically with every availability field cleared", () => {
    const blind = runewords.map((runeword) => ({
      ...runeword,
      ladderOnly: false,
      patch: undefined,
      note: undefined,
    }));

    for (const key of sortKeys) {
      for (const direction of sortDirections) {
        const comparator = comparatorFor(key, direction, NOTHING_CRAFTED);

        expect(blind.sort(comparator).map(nameOf)).toEqual(
          sorted(key, direction),
        );
      }
    }
  });

  it("does not order the runes column by the rune names as text", () => {
    const byCount = sortedRunewords("runes", "ascending");
    const asText = [...runewords].sort((a, b) =>
      a.runes.join(" ") < b.runes.join(" ") ? -1 : 1,
    );

    // `Ber Mal Ber Ist` before `El El El` is what sorting the sequence as text
    // gives, and it answers no question anybody has.
    expect(byCount.map(nameOf)).not.toEqual(asText.map(nameOf));
    expect(byCount[0].runes.length).toBe(2);
  });
});

/** The names a key and direction present, over the whole dataset. */
function sorted(
  key: SortKey,
  direction: SortDirection,
  crafted: ReadonlySet<string> = NOTHING_CRAFTED,
) {
  return sortedRunewords(key, direction, crafted).map(nameOf);
}

function sortedRunewords(
  key: SortKey,
  direction: SortDirection,
  crafted: ReadonlySet<string> = NOTHING_CRAFTED,
) {
  return [...runewords].sort(comparatorFor(key, direction, crafted));
}

function nameOf(runeword: Runeword) {
  return runeword.name;
}

/** Where a value falls below the one before it, if anywhere. */
function descents(values: readonly number[]) {
  return values.filter(
    (value, index) => index > 0 && value < values[index - 1],
  );
}

/**
 * A category's position in the sorted set of categories, so a run of strings can
 * be checked for descents the same way a run of numbers is.
 */
function codePointRank(category: string) {
  return CATEGORY_RANK.indexOf(category);
}

const CATEGORY_RANK = [
  ...new Set(runewords.map((runeword) => runeword.itemTypes[0])),
].sort();
