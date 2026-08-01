import {
  CRAFTED_STORAGE_KEY,
  type NameAliases,
  loadCrafted,
  saveCrafted,
  splitStoredNames,
} from "@/crafted/storage";
import { foldLabel } from "@/runewords/fold";

// No component is rendered anywhere in this file, which is the point of the
// module being plain functions: the failure modes that matter here — corrupt
// JSON, the wrong shape, a name the dataset lost, a store that throws — are
// awkward to provoke through a rendered table and trivial to provoke directly.

// Four runewords with their shipped Russian labels, `Ice` among them for its
// `ё`. A handful rather than the dataset, because this module takes the names
// it matches against as a parameter precisely so that it can be tested without
// one — and `src/data/index.test.ts` is where the real 99 are checked.
const KNOWN_RUNEWORDS = [
  { name: "Enigma", ru: "Тайна" },
  { name: "Spirit", ru: "Дух" },
  { name: "Infinity", ru: "Бесконечность" },
  { name: "Ice", ru: "Лёд" },
];

const KNOWN = aliases(KNOWN_RUNEWORDS);

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loading and saving", () => {
  it("round-trips a set of marks", () => {
    saveCrafted({ crafted: new Set(["Enigma", "Spirit"]), unknown: [] });

    expect([...loadCrafted(KNOWN).crafted]).toEqual(["Enigma", "Spirit"]);
  });

  it("stores canonical names rather than positions", () => {
    saveCrafted({ crafted: new Set(["Enigma"]), unknown: [] });

    expect(stored()).toBe('["Enigma"]');
  });

  it("reads nothing as no progress", () => {
    expect(loadCrafted(KNOWN)).toEqual({ crafted: new Set(), unknown: [] });
  });

  it("uses a key that is namespaced to the project and carries a version", () => {
    // The origin is shared with every other GitHub Pages project under the
    // account, so a bare `crafted` would collide; the version segment is what
    // lets a v2 write elsewhere instead of destroying this one in place.
    expect(CRAFTED_STORAGE_KEY).toContain("diablo2-runeword-tracker");
    expect(CRAFTED_STORAGE_KEY).toMatch(/:v\d+$/);
  });

  it("writes the same bytes whatever order the marks were made in", () => {
    saveCrafted({ crafted: new Set(["Spirit", "Enigma"]), unknown: [] });
    const first = stored();

    window.localStorage.clear();
    saveCrafted({ crafted: new Set(["Enigma", "Spirit"]), unknown: [] });

    expect(stored()).toBe(first);
  });
});

describe("data it should not trust", () => {
  it("survives a value that is not JSON", () => {
    plant("not json");

    expect(loadCrafted(KNOWN).crafted.size).toBe(0);
  });

  it("survives valid JSON of the wrong shape", () => {
    for (const value of ['{"a":1}', "[1,2,3]", "null", '"Enigma"', "[[]]"]) {
      plant(value);

      expect(loadCrafted(KNOWN).crafted.size).toBe(0);
    }
  });

  it("marks a duplicated name once", () => {
    plant('["Enigma","Enigma","Enigma"]');

    expect([...loadCrafted(KNOWN).crafted]).toEqual(["Enigma"]);
  });

  it("never reports more progress than the dataset has runewords", () => {
    plant(JSON.stringify(["Enigma", "Spirit", "Infinity", "Ondal's Wisdom"]));

    expect(loadCrafted(KNOWN).crafted.size).toBeLessThanOrEqual(
      KNOWN_RUNEWORDS.length,
    );
  });
});

describe("a name the dataset does not know", () => {
  it("is kept out of the crafted set", () => {
    plant('["Enigma","Ondal\'s Wisdom"]');

    const { crafted, unknown } = loadCrafted(KNOWN);

    expect([...crafted]).toEqual(["Enigma"]);
    expect(unknown).toEqual(["Ondal's Wisdom"]);
  });

  it("is written back out on the next save", () => {
    plant('["Ondal\'s Wisdom"]');

    const loaded = loadCrafted(KNOWN);
    saveCrafted({ crafted: new Set(["Enigma"]), unknown: loaded.unknown });

    expect(JSON.parse(stored() ?? "[]")).toEqual(["Enigma", "Ondal's Wisdom"]);
  });

  it("recovers its mark once the dataset has the name again", () => {
    plant('["Ondal\'s Wisdom"]');

    const restored = aliases([
      ...KNOWN_RUNEWORDS,
      { name: "Ondal's Wisdom", ru: "Мудрость Ондала" },
    ]);

    expect(loadCrafted(restored).crafted.has("Ondal's Wisdom")).toBe(true);
    expect(loadCrafted(restored).unknown).toEqual([]);
  });
});

describe("splitting a list against the dataset", () => {
  // The same split the load path uses, reached directly because it is also what
  // an imported file goes through. One implementation, two callers — the point
  // of extracting it.

  it("is what the load path produces", () => {
    plant('["Enigma","Ondal\'s Wisdom"]');

    expect(loadCrafted(KNOWN)).toEqual(
      splitStoredNames(["Enigma", "Ondal's Wisdom"], KNOWN),
    );
  });

  it("matches a name whatever case it is written in", () => {
    const { crafted } = splitStoredNames(["enigma", "SPIRIT"], KNOWN);

    // Stored in the dataset's own spelling, so nothing downstream folds again.
    expect([...crafted]).toEqual(["Enigma", "Spirit"]);
  });

  it("matches a name padded with whitespace", () => {
    expect([...splitStoredNames(["  Enigma  "], KNOWN).crafted]).toEqual([
      "Enigma",
    ]);
  });

  it("counts one runeword once however many spellings name it", () => {
    const { crafted } = splitStoredNames(["Enigma", "enigma", "ENIGMA"], KNOWN);

    expect(crafted.size).toBe(1);
  });

  it("keeps an unmatched name in the order it arrived, as it was written", () => {
    const { unknown } = splitStoredNames(
      ["Ondal's Wisdom", "Enigma", "Plague"],
      KNOWN,
    );

    expect(unknown).toEqual(["Ondal's Wisdom", "Plague"]);
  });

  it("splits an empty list into empty halves", () => {
    expect(splitStoredNames([], KNOWN)).toEqual({
      crafted: new Set(),
      unknown: [],
    });
  });
});

describe("a list written in Russian", () => {
  // A player's hand-written list is in the language they read the page in. What
  // comes back out of a match is the canonical English name regardless, which
  // is what keeps storage, the export file and progress identity in one
  // language whatever the file was in.

  it("marks the runeword its Russian label names", () => {
    const { crafted, unknown } = splitStoredNames(["Тайна"], KNOWN);

    expect([...crafted]).toEqual(["Enigma"]);
    expect(unknown).toEqual([]);
  });

  it("marks both halves of a file that mixes the two languages", () => {
    const { crafted, unknown } = splitStoredNames(
      ["Enigma", "Дух", "Бесконечность", "Ondal's Wisdom"],
      KNOWN,
    );

    expect([...crafted]).toEqual(["Enigma", "Spirit", "Infinity"]);
    expect(unknown).toEqual(["Ondal's Wisdom"]);
  });

  it("matches a Russian label whatever case and padding it carries", () => {
    expect([...splitStoredNames(["  дух  "], KNOWN).crafted]).toEqual([
      "Spirit",
    ]);
  });

  it("matches across the ё and е a Russian typist uses interchangeably", () => {
    expect([...splitStoredNames(["Лед"], KNOWN).crafted]).toEqual(["Ice"]);
    expect([...splitStoredNames(["Лёд"], KNOWN).crafted]).toEqual(["Ice"]);
  });

  it("marks a runeword once when the file names it in both languages", () => {
    const { crafted } = splitStoredNames(["Enigma", "Тайна"], KNOWN);

    expect([...crafted]).toEqual(["Enigma"]);
  });

  it("leaves a Russian word that names no runeword unmatched", () => {
    const { crafted, unknown } = splitStoredNames(["Энигма"], KNOWN);

    // The dataset's label for `Enigma` is `Тайна`. A transliteration is a
    // near-miss like any other: the fold is case, padding and `ё`, and nothing
    // beyond it gets to decide what a file meant.
    expect(crafted.size).toBe(0);
    expect(unknown).toEqual(["Энигма"]);
  });
});

describe("a store that will not cooperate", () => {
  it("loads as empty when reading throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    expect(() => loadCrafted(KNOWN)).not.toThrow();
    expect(loadCrafted(KNOWN).crafted.size).toBe(0);
  });

  it("does not throw when writing throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    expect(() =>
      saveCrafted({ crafted: new Set(["Enigma"]), unknown: [] }),
    ).not.toThrow();
  });
});

describe("reading never writes", () => {
  it("leaves an unparseable value in place", () => {
    plant("not json");

    loadCrafted(KNOWN);

    // Still there to be inspected or repaired by hand. This is what the
    // save-on-toggle rule buys: an effect that saved on mount would have
    // replaced it with `[]` before the player did anything at all.
    expect(stored()).toBe("not json");
  });

  it("leaves an absent key absent", () => {
    loadCrafted(KNOWN);

    expect(stored()).toBeNull();
  });
});

/**
 * The alias map `@/data` builds for the real dataset, over a fixture.
 *
 * Folded with the same `foldLabel` the matcher uses, because a fixture that
 * folded its keys its own way would be testing a map no caller ever passes.
 */
function aliases(runewords: { name: string; ru: string }[]): NameAliases {
  return new Map(
    runewords.flatMap(({ name, ru }): [string, string][] => [
      [foldLabel(name), name],
      [foldLabel(ru), name],
    ]),
  );
}

function plant(value: string) {
  window.localStorage.setItem(CRAFTED_STORAGE_KEY, value);
}

function stored() {
  return window.localStorage.getItem(CRAFTED_STORAGE_KEY);
}
