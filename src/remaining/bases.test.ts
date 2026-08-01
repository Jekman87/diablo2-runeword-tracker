import { itemTypes, runewords } from "@/data";
import { remainingBases } from "@/remaining/bases";

// Asserted over the whole dataset, as the rune aggregation's tests are. The
// interesting cases — a multi-category runeword, a group with exactly one
// member, a category spread over several socket counts — all occur in the
// real data, and their numbers are the anchors a regression would move.

const NOTHING_CRAFTED: ReadonlySet<string> = new Set();

describe("remainingBases with nothing crafted", () => {
  const remaining = remainingBases(runewords, itemTypes, NOTHING_CRAFTED);

  it("counts every category membership, not every runeword", () => {
    // 145 memberships across 99 runewords, in 56 (category, sockets) groups —
    // a runeword allowing three categories counts in all three, on the
    // precedent the slot filter set. Vigilance's Voodoo Heads base is the
    // membership that pushed the group count from 55 to 56.
    expect(remaining).toHaveLength(56);
    expect(remaining.reduce((sum, group) => sum + group.count, 0)).toBe(145);
  });

  it("counts the runewords a group would serve", () => {
    // Four uncrafted four-rune runewords allow Polearms.
    expect(countOf(remaining, "Polearms", 4)).toBe(4);
  });

  it("orders by category reference position, then ascending sockets", () => {
    const categoryOrder = itemTypes.map((itemType) => itemType.name);

    const positions = remaining.map((group) => ({
      category: categoryOrder.indexOf(group.category),
      sockets: group.sockets,
    }));

    const sorted = [...positions].sort(
      (a, b) => a.category - b.category || a.sockets - b.sockets,
    );

    expect(positions).toEqual(sorted);
  });

  it("ascends through a category's socket counts", () => {
    // Body armours are wanted at two, three and four sockets — the one
    // category whose groups would expose a wrong inner sort at a glance.
    const bodyArmours = remaining
      .filter((group) => group.category === "Body Armors")
      .map((group) => group.sockets);

    expect(bodyArmours).toEqual([2, 3, 4]);
  });
});

describe("a multi-category runeword", () => {
  it("appears under every alternative at its socket count", () => {
    const remaining = remainingBases(runewords, itemTypes, NOTHING_CRAFTED);

    // Black goes into clubs, hammers or maces, three runes deep — the player
    // can farm toward any of the three, so all three count it.
    const black = named("Black");

    expect(black.itemTypes).toEqual(["Clubs", "Hammers", "Maces"]);

    for (const category of black.itemTypes) {
      expect(countOf(remaining, category, black.runes.length)).toBeGreaterThan(
        0,
      );
    }
  });

  it("leaves every group it was counted in when crafted", () => {
    const before = remainingBases(runewords, itemTypes, NOTHING_CRAFTED);
    const after = remainingBases(runewords, itemTypes, new Set(["Black"]));

    // Black is the only three-rune runeword allowing clubs, so that group
    // reaches zero and is absent rather than present at zero; the other two
    // categories keep their groups, each one lighter.
    expect(countOf(before, "Clubs", 3)).toBe(1);
    expect(groupOf(after, "Clubs", 3)).toBeUndefined();
    expect(countOf(after, "Hammers", 3)).toBe(
      countOf(before, "Hammers", 3) - 1,
    );
    expect(countOf(after, "Maces", 3)).toBe(countOf(before, "Maces", 3) - 1);
  });
});

describe("everything crafted", () => {
  it("needs no bases", () => {
    const all = new Set(runewords.map((runeword) => runeword.name));

    expect(remainingBases(runewords, itemTypes, all)).toEqual([]);
  });
});

function groupOf(
  remaining: { category: string; sockets: number; count: number }[],
  category: string,
  sockets: number,
) {
  return remaining.find(
    (group) => group.category === category && group.sockets === sockets,
  );
}

function countOf(
  remaining: { category: string; sockets: number; count: number }[],
  category: string,
  sockets: number,
): number {
  return groupOf(remaining, category, sockets)?.count ?? 0;
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
