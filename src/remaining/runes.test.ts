import { runes, runewords } from "@/data";
import { remainingRunes } from "@/remaining/runes";

// Asserted over the whole dataset rather than a fixture, on the same grounds
// as the ordering tests: the anchors — 343 slots, `Shael` at twenty, `Zod` at
// three — are properties of the real data, and a fixture would only prove the
// function agrees with itself.

const NOTHING_CRAFTED: ReadonlySet<string> = new Set();

describe("remainingRunes with nothing crafted", () => {
  const remaining = remainingRunes(runewords, runes, NOTHING_CRAFTED);

  it("needs all 33 runes, 343 slots in total", () => {
    expect(remaining).toHaveLength(33);
    expect(remaining.reduce((sum, rune) => sum + rune.count, 0)).toBe(343);
  });

  it("matches the dataset's known counts at both ends", () => {
    expect(countOf(remaining, "Shael")).toBe(20);
    expect(countOf(remaining, "Zod")).toBe(3);
  });

  it("follows canonical rune order, which is also tier order", () => {
    expect(remaining.map((rune) => rune.name)).toEqual(
      runes.map((rune) => rune.name),
    );
    expect(remaining.map((rune) => rune.tier)).toEqual(
      runes.map((rune) => rune.tier),
    );
  });
});

describe("crafting a runeword", () => {
  it("subtracts exactly its sequence and nothing else", () => {
    const before = remainingRunes(runewords, runes, NOTHING_CRAFTED);
    const after = remainingRunes(runewords, runes, new Set(["Spirit"]));

    const spirit = named("Spirit");

    for (const rune of runes) {
      const spent = spirit.runes.filter((name) => name === rune.name).length;

      expect(countOf(after, rune.name)).toBe(
        countOf(before, rune.name) - spent,
      );
    }
  });

  it("counts a repeated rune once per occurrence", () => {
    const before = remainingRunes(runewords, runes, NOTHING_CRAFTED);
    const after = remainingRunes(runewords, runes, new Set(["Infinity"]));

    // `Infinity` is Ber Mal Ber Ist — crafting it takes two Ber, not one.
    expect(named("Infinity").runes).toEqual(["Ber", "Mal", "Ber", "Ist"]);
    expect(countOf(after, "Ber")).toBe(countOf(before, "Ber") - 2);
  });
});

describe("a satisfied rune", () => {
  it("is absent rather than present at zero", () => {
    // Craft everything that needs Zod; the rune leaves the result entirely.
    const needsZod = runewords
      .filter((runeword) => runeword.runes.includes("Zod"))
      .map((runeword) => runeword.name);

    const remaining = remainingRunes(runewords, runes, new Set(needsZod));

    expect(needsZod).toHaveLength(3);
    expect(remaining.find((rune) => rune.name === "Zod")).toBeUndefined();
    expect(remaining.every((rune) => rune.count > 0)).toBe(true);
  });
});

describe("everything crafted", () => {
  it("needs nothing", () => {
    const all = new Set(runewords.map((runeword) => runeword.name));

    expect(remainingRunes(runewords, runes, all)).toEqual([]);
  });
});

function countOf(
  remaining: { name: string; count: number }[],
  name: string,
): number {
  return remaining.find((rune) => rune.name === name)?.count ?? 0;
}

function named(name: string) {
  const found = runewords.find((runeword) => runeword.name === name);

  if (!found) throw new Error(`No runeword named ${name}`);

  return found;
}
