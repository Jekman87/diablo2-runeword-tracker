import { runewords } from "@/data";
import {
  displayItemType,
  displayRune,
  displayRuneword,
} from "@/runewords/display";

// The projection is what rendering, search and sort all read, so these cases
// are the acceptance evidence for "one language on screen" — a claim about
// every field of a record at once rather than about any one component.

describe("the English projection", () => {
  it("is the canonical record's own text", () => {
    const projected = displayRuneword(runeword("Ancient's Pledge"), "en");

    expect(projected.name).toBe("Ancient's Pledge");
    expect(projected.itemTypes).toEqual(["Shields", "Grimoire"]);
    expect(projected.runes).toEqual(["Ral", "Ort", "Tal"]);
    expect(projected.propertyGroups[0].properties[0]).toBe(
      "+50% Enhanced Defense",
    );
  });

  it("carries the canonical restriction and note", () => {
    expect(displayRuneword(runeword("Leaf"), "en").itemTypeRestriction).toBe(
      "Not Orbs/Wands",
    );
    expect(displayRuneword(runeword("Mosaic"), "en").note).toContain("ladder");
    expect(displayRuneword(runeword("Mosaic"), "en").note).not.toMatch(
      /Season \d+/,
    );
  });

  it("holds no Cyrillic anywhere, for any record", () => {
    for (const record of runewords) {
      expect(textOf(displayRuneword(record, "en"))).not.toMatch(CYRILLIC);
    }
  });
});

describe("the Russian projection", () => {
  it("is the record's Russian variant plus Russian reference labels", () => {
    const projected = displayRuneword(runeword("Ancient's Pledge"), "ru");

    expect(projected.name).toBe("Клятва Древних");
    expect(projected.itemTypes).toEqual(["Щиты", "Гримуар"]);
    expect(projected.runes).toEqual(["Рал", "Орт", "Тал"]);
    expect(projected.propertyGroups[0].properties[0]).toBe("+50% к защите");
  });

  it("carries the Russian restriction and note", () => {
    expect(displayRuneword(runeword("Leaf"), "ru").itemTypeRestriction).toBe(
      "кроме сфер и жезлов",
    );
    expect(displayRuneword(runeword("Mosaic"), "ru").note).toContain("сезоне");
  });

  it("mirrors the English property structure line for line", () => {
    const record = runeword("Fortitude");
    const projected = displayRuneword(record, "ru");

    expect(projected.propertyGroups).toHaveLength(2);
    expect(projected.propertyGroups[0].properties).toHaveLength(12);
    expect(projected.propertyGroups[1].properties).toHaveLength(12);
  });

  it("shows no English word beside the Russian, for any shipped record", () => {
    // The requirement is "strictly one language on screen", and a stray Latin
    // letter is exactly how that breaks. Digits and punctuation are not words,
    // so the check is for letters — and there is no exemption: not one Latin
    // letter renders under this locale, on any of the 99 records.
    for (const record of runewords) {
      expect(textOf(displayRuneword(record, "ru"))).not.toMatch(/[A-Za-z]/);
    }
  });

  it("writes the per-level formulas in Cyrillic, unlike the client", () => {
    // The one place the project declines to quote the official localisation,
    // and the assertion above is why: the client writes «+(2*clvl) к защите»,
    // leaving the character-level variable in Latin inside Russian item text,
    // and quoting it would put the only Latin token on the page. «*ур» is
    // diablo2-resurrected.ru's own rendering rather than our invention, and «ур»
    // abbreviates the «уровня» the same line already spells out.
    //
    // Pinned in both directions so the decision is a thing the suite states,
    // not a hole a later pass could quietly close by "fixing" it to the
    // client's wording.
    const leaf = displayRuneword(runeword("Leaf"), "ru");

    expect(leaf.propertyGroups[0].properties).toContain(
      "+2*ур к защите (зависит от уровня персонажа)",
    );

    const perLevel = runewords
      .flatMap((record) =>
        displayRuneword(record, "ru").propertyGroups.flatMap(
          (group) => group.properties,
        ),
      )
      .filter((line) => /зависит от уровня персонажа/.test(line));

    expect(perLevel).toHaveLength(15);
    expect(perLevel.filter((line) => line.includes("clvl"))).toEqual([]);
    expect(perLevel.every((line) => line.includes("*ур"))).toBe(true);
  });
});

describe("the terms checked against the game client", () => {
  // These eight were read in the running client by a reader the maintainer
  // asked, after two of them had already been "corrected" twice from community
  // sources and landed wrong both times. Pinning them is not ceremony: the
  // churn is the evidence that they are the values a future edit is most likely
  // to get wrong again, and the client is the one source that outranks
  // everything a later reader could cite against them.

  it("names the base categories in the plural where the page groups them", () => {
    expect(displayItemType("Body Armors", "ru")).toBe("Доспехи");
    expect(displayItemType("Grimoire", "ru")).toBe("Гримуар");
    expect(displayItemType("Helms", "ru")).toBe("Шлемы");
    expect(displayItemType("Shields", "ru")).toBe("Щиты");
  });

  it("keeps «Доспехи» plural, matching neighbouring category names", () => {
    expect(displayItemType("Body Armors", "ru")).not.toBe("Доспех");
    expect(displayItemType("Body Armors", "ru")).not.toBe("Броня");
  });

  it("spells Shael «Шаэль», against the transcription that says otherwise", () => {
    expect(displayRune("Shael", "ru")).toBe("Шаэль");
  });

  it("capitalises the two names the client capitalises", () => {
    expect(displayRuneword(runeword("Ancient's Pledge"), "ru").name).toBe(
      "Клятва Древних",
    );
    expect(displayRuneword(runeword("Hand of Justice"), "ru").name).toBe(
      "Длань Правосудия",
    );
  });

  it("labels the two classes the client has no collective name for", () => {
    // Project-authored, because there is nothing to quote: the client names
    // bows and crossbows separately and its polearm classes are several.
    expect(displayItemType("Missile Weapons", "ru")).toBe("Луки и арбалеты");
    expect(displayItemType("Polearms", "ru")).toBe("Древковое оружие");
  });
});

describe("an untranslated record", () => {
  // The whole-record fallback. No shipped record takes this path — the coverage
  // test pins that — so the case is built by removing a variant, which is
  // exactly the state a vendor refresh would produce.

  it("projects entirely in English under the Russian locale", () => {
    const projected = displayRuneword(withoutVariant("Ancient's Pledge"), "ru");

    expect(projected.name).toBe("Ancient's Pledge");
    // The categories and runes are translated in the reference data, and are
    // still English here: the fallback is per record, not per field.
    expect(projected.itemTypes).toEqual(["Shields", "Grimoire"]);
    expect(projected.runes).toEqual(["Ral", "Ort", "Tal"]);
    expect(textOf(projected)).not.toMatch(CYRILLIC);
  });

  it("keeps its English restriction rather than dropping it", () => {
    expect(
      displayRuneword(withoutVariant("Leaf"), "ru").itemTypeRestriction,
    ).toBe("Not Orbs/Wands");
  });
});

describe("reference labels", () => {
  it("give a rune its canonical name under English and its label under Russian", () => {
    expect(displayRune("Ber", "en")).toBe("Ber");
    expect(displayRune("Ber", "ru")).toBe("Бер");
  });

  it("give a category its canonical name under English and its label under Russian", () => {
    expect(displayItemType("Body Armors", "en")).toBe("Body Armors");
    expect(displayItemType("Body Armors", "ru")).toBe("Доспехи");
  });

  it("fall back to the canonical name for an unknown reference", () => {
    // A broken cross-reference is what `src/data`'s tests assert against;
    // rendering the name it asked for beats blanking the page over a label.
    expect(displayRune("Nonesuch", "ru")).toBe("Nonesuch");
    expect(displayItemType("Nonesuch", "ru")).toBe("Nonesuch");
  });
});

const CYRILLIC = /[Ѐ-ӿ]/;

/** Every piece of text a projection carries, for the one-language assertions. */
function textOf(projected: ReturnType<typeof displayRuneword>): string {
  return [
    projected.name,
    ...projected.itemTypes,
    projected.itemTypeRestriction ?? "",
    projected.note ?? "",
    ...projected.runes,
    ...projected.propertyGroups.flatMap((group) => group.properties),
  ].join(" ");
}

function runeword(name: string) {
  const found = runewords.find((entry) => entry.name === name);

  if (!found) throw new Error(`No runeword named "${name}" in the dataset.`);

  return found;
}

/** A record as a pending vendor addition would arrive: no Russian variant. */
function withoutVariant(name: string) {
  const record = structuredClone(runeword(name));
  delete record.ru;

  return record;
}
