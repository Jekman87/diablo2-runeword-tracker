import { runewords } from "@/data";
import type { Locale } from "@/i18n";
import { orderedRunewords } from "@/runewords/order";
import { DEFAULT_VIEW_SETTINGS, type ViewSettings } from "@/view/types";
import { visibleRunewords } from "@/view/visible";

// No component is rendered in this file, which is the point of the narrowing
// being one plain function: "why is this row present" is a question about the
// dataset, the crafted set and four settings, and none of those needs a DOM.

const NOTHING_CRAFTED: ReadonlySet<string> = new Set();

describe("nothing narrowing", () => {
  it("presents all 99 in the default order", () => {
    expect(visible()).toEqual(orderedRunewords.map((r) => r.name));
  });
});

describe("each control on its own", () => {
  it("narrows by search", () => {
    expect(visible({}, "assassin").sort()).toEqual([
      "Chaos",
      "Mosaic",
      "Pattern",
      "Treachery",
    ]);
  });

  it("narrows by crafted state", () => {
    const crafted = new Set(["Enigma", "Spirit", "Leaf"]);

    expect(visible({ craftedFilter: "crafted" }, "", crafted).sort()).toEqual([
      "Enigma",
      "Leaf",
      "Spirit",
    ]);
    expect(visible({ craftedFilter: "remaining" }, "", crafted)).toHaveLength(
      96,
    );
  });

  it("narrows by slot", () => {
    expect(visible({ slotFilter: "helm" })).toHaveLength(14);
    expect(visible({ slotFilter: "melee" })).toHaveLength(49);
    expect(visible({ slotFilter: "missile" })).toHaveLength(19);
    expect(visible({ slotFilter: "offhand" })).toHaveLength(10);
    expect(visible({ slotFilter: "bodyArmour" })).toHaveLength(22);
  });

  it("presents a two-slot runeword under both of its slots", () => {
    expect(visible({ slotFilter: "melee" })).toContain("Fortitude");
    expect(visible({ slotFilter: "bodyArmour" })).toContain("Fortitude");
  });
});

describe("the three as a conjunction", () => {
  it("presents only the runewords satisfying all three", () => {
    const crafted = new Set(["Spirit"]);
    const settings = {
      slotFilter: "offhand",
      craftedFilter: "remaining",
    } as const;

    // `Spirit` is a shield runeword and matches the query, and is excluded by
    // the crafted filter alone.
    expect(visible({ slotFilter: "offhand" }, "spirit", crafted)).toEqual([
      "Spirit",
    ]);
    expect(visible(settings, "spirit", crafted)).toEqual([]);
  });

  it("narrows to the intersection rather than the union", () => {
    const bySlot = visible({ slotFilter: "bodyArmour" });
    const byQuery = visible({}, "enigma");
    const both = visible({ slotFilter: "bodyArmour" }, "enigma");

    expect(bySlot.length).toBeGreaterThan(1);
    expect(byQuery).toEqual(["Enigma"]);
    expect(both).toEqual(["Enigma"]);
  });

  it("leaves each control independent of the others", () => {
    const crafted = new Set(["Dream"]);

    // Changing the slot does not disturb what the other two are doing: `Dream`
    // is a helm and a shield, is crafted, and matches `dream`.
    expect(
      visible(
        { slotFilter: "helm", craftedFilter: "crafted" },
        "dream",
        crafted,
      ),
    ).toEqual(["Dream"]);
    expect(
      visible(
        { slotFilter: "offhand", craftedFilter: "crafted" },
        "dream",
        crafted,
      ),
    ).toEqual(["Dream"]);
    expect(
      visible(
        { slotFilter: "melee", craftedFilter: "crafted" },
        "dream",
        crafted,
      ),
    ).toEqual([]);
  });

  it("does not depend on the sequence the settings were reached by", () => {
    // Two interaction sequences, one destination. The function has no memory of
    // either, which is exactly the property being asserted.
    const crafted = new Set(["Enigma"]);
    const reached: ViewSettings = {
      ...DEFAULT_VIEW_SETTINGS,
      slotFilter: "bodyArmour",
      craftedFilter: "remaining",
      sortKey: "name",
      sortDirection: "descending",
    };

    const first = visibleRunewords(runewords, reached, "ar", crafted, "en");
    const second = visibleRunewords(
      runewords,
      {
        craftedFilter: reached.craftedFilter,
        sortDirection: reached.sortDirection,
        slotFilter: reached.slotFilter,
        sortKey: reached.sortKey,
      },
      "ar",
      crafted,
      "en",
    );

    expect(first.map((r) => r.name)).toEqual(second.map((r) => r.name));
    expect(first.length).toBeGreaterThan(0);
  });

  it("presents nothing where the settings match nothing", () => {
    expect(visible({ slotFilter: "helm" }, "assassin")).toEqual([]);
  });
});

describe("what the filters may not influence", () => {
  it("does not change the order rows appear in", () => {
    const filtered = visible({ slotFilter: "offhand", sortKey: "name" });
    const unfiltered = visible({ sortKey: "name" });

    // Every row present under the filter is in the position the sort gives it
    // with the filter cleared — the presented order is a property of the data,
    // not of which rows were removed.
    expect(filtered).toEqual(
      unfiltered.filter((name) => filtered.includes(name)),
    );
  });

  it("orders a filtered set by the tiebreak, not by the dataset's order", () => {
    const shields = visible({ slotFilter: "offhand", sortKey: "runes" });

    // Two sockets by level, then three by level, then four — never the vendor's
    // patch-grouped order, and never the order the filter happened to leave.
    expect(shields).toEqual([
      "Rhyme",
      "Splendor",
      "Vigilance",
      "Ancient's Pledge",
      "Sanctuary",
      "Dragon",
      "Dream",
      "Spirit",
      "Exile",
      "Phoenix",
    ]);
  });

  it("leaves the dataset in the order `@/data` hands it out", () => {
    visible({ sortKey: "name", sortDirection: "descending" });

    expect(runewords[0].name).toBe("Ancient's Pledge");
    expect(runewords).toHaveLength(99);
  });

  it("returns a fresh array rather than the one it was given", () => {
    const result = visibleRunewords(
      runewords,
      DEFAULT_VIEW_SETTINGS,
      "",
      NOTHING_CRAFTED,
      "en",
    );

    expect(result).not.toBe(runewords);
    // The records themselves are the dataset's own, which is what keeps the row
    // memoisation in the table working across a re-derivation.
    expect(result).toContain(runewords[0]);
  });

  it("does not write to the crafted set", () => {
    const crafted = new Set(["Enigma"]);

    visible({ craftedFilter: "remaining", sortKey: "crafted" }, "", crafted);

    expect([...crafted]).toEqual(["Enigma"]);
  });
});

describe("what the locale may not influence", () => {
  // Search and sort read the language; the other two filters read identifiers.
  // These are the cases that pin the second half of that split, because it is
  // the half a reader would never notice breaking until their progress moved.

  it("presents the same rows for a slot in either locale", () => {
    // The slot mapping keys on canonical category names, so the set a slot
    // narrows to is a fact about the dataset rather than about the language.
    for (const slotFilter of [
      "helm",
      "melee",
      "offhand",
      "bodyArmour",
    ] as const) {
      const en = visible({ slotFilter });
      const ru = visible({ slotFilter }, "", NOTHING_CRAFTED, "ru");

      expect([...ru].sort()).toEqual([...en].sort());
    }
  });

  it("narrows by crafted state on canonical names under the Russian locale", () => {
    // The stored name is English; the row is presented in Russian. The filter
    // has to keep reading the identifier, or a Russian session would show every
    // runeword as uncrafted.
    const crafted = new Set(["Enigma", "Fortitude"]);

    expect(
      visible({ craftedFilter: "crafted" }, "", crafted, "ru").sort(),
    ).toEqual(["Enigma", "Fortitude"]);
  });

  it("returns records carrying their canonical names, whatever the locale", () => {
    // What a caller gets back is the dataset's own records. Progress, the undo
    // notice and the open-panel flag all key on `name`, so the projection must
    // never replace it.
    const rows = visibleRunewords(
      runewords,
      DEFAULT_VIEW_SETTINGS,
      "",
      NOTHING_CRAFTED,
      "ru",
    );

    expect(rows).toHaveLength(99);
    expect(rows.map((runeword) => runeword.name)).toContain("Ancient's Pledge");
  });

  it("presents the same 99 rows in either locale, ordered differently", () => {
    const en = visible({ sortKey: "name" });
    const ru = visible({ sortKey: "name" }, "", NOTHING_CRAFTED, "ru");

    // The same set — localisation narrows nothing — in a different order,
    // because each locale sorts the text it presents.
    expect([...ru].sort()).toEqual([...en].sort());
    expect(ru).not.toEqual(en);
  });
});

/** The names presented for a partial set of settings, in the presented order. */
function visible(
  settings: Partial<ViewSettings> = {},
  query = "",
  crafted: ReadonlySet<string> = NOTHING_CRAFTED,
  locale: Locale = "en",
) {
  return visibleRunewords(
    runewords,
    { ...DEFAULT_VIEW_SETTINGS, ...settings },
    query,
    crafted,
    locale,
  ).map((runeword) => runeword.name);
}
