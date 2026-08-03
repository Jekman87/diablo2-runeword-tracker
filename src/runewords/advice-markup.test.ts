import { runewords } from "@/data";
import { markUpAdvice } from "@/runewords/advice-markup";

const kinds = (paragraph: string) =>
  markUpAdvice(paragraph)
    .filter((segment) => segment.kind !== "text")
    .map((segment) => `${segment.kind}:${segment.text}`);

describe("what gets marked", () => {
  it("marks a number the reader has to hit", () => {
    expect(kinds("look for +3 to Abyss")).toContain("value:+3");
  });

  it("marks a range", () => {
    expect(kinds("rolls +40-45 all resistances")).toContain("value:+40-45");
    expect(kinds("gives 25-35% faster cast rate")).toContain("value:25-35%");
  });

  it("leaves a socket count and a patch number alone", () => {
    expect(kinds("a 3-socket base since patch 2.4")).toEqual([]);
  });

  it("marks a base item as a base", () => {
    expect(kinds("built on Grand Matron Bow")).toContain(
      "base:Grand Matron Bow",
    );
    expect(kinds("почти все сделки — Phase Blade")).toContain(
      "base:Phase Blade",
    );
  });

  it("marks a Russian base together with its English gloss", () => {
    expect(kinds("возьмите Латы мага (Mage Plate) с 3 гнёздами")).toContain(
      "base:Латы мага (Mage Plate)",
    );
  });

  it("marks a stat as a skill, in either language", () => {
    // A stat is a property of the finished item, which is what the skill
    // colour means here — the detail panel draws both the same way.
    expect(kinds("high all resistances")).toContain("skill:all resistances");
    expect(kinds("с высокими сопротивлениями")).toContain(
      "skill:сопротивлениями",
    );
  });

  it("marks a skill as a skill", () => {
    expect(kinds("a base with +3 to Phoenix Strike")).toContain(
      "skill:Phoenix Strike",
    );
  });

  it("finds an inflected Russian skill name", () => {
    // Doom's opening sentence: the aura is «Святая стужа» in the client and
    // «Святой стужи» here, and a dictionary of exact forms would miss it.
    expect(kinds('Оружие с аурой "Священный холод": аура 12 уровня')).toContain(
      "skill:Священный холод",
    );
  });

  it("does not mark a base category used as an ordinary noun", () => {
    // The same sentence: `Оружие` opens it as the word "weapon", not as the
    // category. Categories are deliberately out of the base list.
    expect(
      kinds('Оружие с аурой "Священный холод": аура 12 уровня'),
    ).not.toContain("base:Оружие");
  });

  it("marks runes and runeword names as runes", () => {
    // Both are gold in the table, and both are gold here.
    expect(kinds("руны дорогие (Cham, Lo, Ohm)")).toContain("rune:Cham");
    expect(kinds("лучше, чем Тайна")).toContain("rune:Тайна");
    expect(kinds("outclassed by Enigma")).toContain("rune:Enigma");
  });

  it("does not mark the two source sites", () => {
    expect(kinds("as Maxroll and Traderie record")).toEqual([]);
  });
});

describe("boundaries and coverage", () => {
  it("does not find a rune inside a longer word", () => {
    // `Ист` is a rune and the first three letters of «Историю». Matching it
    // there left the word half-coloured — the bug that `\b` cannot fix,
    // because it is defined over ASCII and treats Cyrillic as a boundary.
    expect(kinds("чтобы закрыть Историю, и сдайте торговцу")).toEqual([]);
  });

  it("reads a rune sequence as runes, not as a skill", () => {
    // One gold span for the recipe rather than three, because the phrase rule
    // matches it whole — and every word being a rune is what makes it gold.
    expect(kinds("из дешёвых рун (Hel Shael Ral)")).toEqual([
      "rune:Hel Shael Ral",
    ]);
  });

  it("keeps a longer skill name from splitting into its parts", () => {
    // `Bone` and `Spirit` are both runeword names; `Bone Spirit` is a skill,
    // and the phrase has to beat the two names inside it.
    expect(kinds("a wand with +3 Bone Spirit")).toContain("skill:Bone Spirit");
    expect(kinds("+3 to Claws of Thunder")).toContain("skill:Claws of Thunder");
  });

  it("draws ethereal as a base property, not a skill", () => {
    // "Make it ethereal" says which item to find, like naming a Monarch does,
    // so it takes the base colour rather than the property blue.
    expect(kinds("an ethereal base for the mercenary")).toContain(
      "base:ethereal",
    );
    expect(kinds("эфирная база строго лучше")).toContain("base:эфирная");
    expect(kinds("делайте его эфирным")).toContain("base:эфирным");
  });

  it("keeps the sign on a negative number", () => {
    expect(kinds("-20% to enemy fire resistance")).toContain("value:-20%");
  });

  it("marks a bare percentage", () => {
    expect(kinds("25% сокрушающего удара")).toContain("value:25%");
  });

  it("still keeps a socket count and a patch number unmarked", () => {
    expect(kinds("a 3-socket base since patch 2.4")).toEqual([]);
  });
});

describe("across every shipped paragraph", () => {
  const paragraphs = runewords.flatMap((record) => [
    ...(record.advice?.paragraphs ?? []),
    ...(record.ru?.advice?.paragraphs ?? []),
  ]);

  it("reproduces the paragraph exactly", () => {
    // The guarantee that matters: a highlighter is allowed to miss a term, and
    // is never allowed to alter the sentence it is highlighting.
    for (const paragraph of paragraphs) {
      expect(
        markUpAdvice(paragraph)
          .map((segment) => segment.text)
          .join(""),
      ).toBe(paragraph);
    }
  });

  it("marks something in most paragraphs, and not everything", () => {
    const marked = paragraphs.map(
      (paragraph) =>
        markUpAdvice(paragraph).filter((segment) => segment.kind !== "text")
          .length,
    );

    expect(paragraphs.length).toBeGreaterThan(300);
    // Every paragraph names at least one base, skill or stat by construction.
    expect(
      marked.filter((count) => count === 0).length / paragraphs.length,
    ).toBeLessThan(0.1);
    // And none is so speckled that the emphasis stops meaning anything.
    expect(Math.max(...marked)).toBeLessThan(20);
  });
});
