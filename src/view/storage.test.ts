import { CRAFTED_STORAGE_KEY } from "@/crafted/storage";
import {
  VIEW_STORAGE_KEY,
  loadViewSettings,
  saveViewSettings,
} from "@/view/storage";
import { DEFAULT_VIEW_SETTINGS, type ViewSettings } from "@/view/types";

// No component is rendered anywhere in this file, which is the point of the
// module being plain functions: the failure modes that matter — corrupt JSON, a
// shape that is not an object, a column this version does not have, a store that
// throws — are awkward to provoke through a rendered page and trivial here.

const NARROWED: ViewSettings = {
  sortKey: "name",
  sortDirection: "descending",
  craftedFilter: "remaining",
  slotFilter: "offhand",
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loading and saving", () => {
  it("round-trips a narrowed view", () => {
    saveViewSettings(NARROWED);

    expect(loadViewSettings()).toEqual(NARROWED);
  });

  it("reads nothing as the defaults", () => {
    expect(loadViewSettings()).toEqual({
      sortKey: "requiredLevel",
      sortDirection: "ascending",
      craftedFilter: "all",
      slotFilter: "all",
    });
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("hands out a fresh object, so no caller can edit the defaults", () => {
    const loaded = loadViewSettings();

    expect(loaded).not.toBe(DEFAULT_VIEW_SETTINGS);
  });

  it("uses a key that is namespaced to the project and carries a version", () => {
    expect(VIEW_STORAGE_KEY).toContain("diablo2-runeword-tracker");
    expect(VIEW_STORAGE_KEY).toMatch(/:v\d+$/);
    expect(VIEW_STORAGE_KEY).not.toBe("view");
  });

  it("keeps its own key, separate from progress", () => {
    expect(VIEW_STORAGE_KEY).not.toBe(CRAFTED_STORAGE_KEY);
  });

  it("does not rewrite progress when it writes", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma"]');

    saveViewSettings(NARROWED);

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Enigma"]');
  });
});

describe("the search query is not stored", () => {
  it("writes no field for it", () => {
    saveViewSettings(NARROWED);

    // Not an empty search field — no field at all.
    expect(Object.keys(JSON.parse(stored() ?? "{}")).sort()).toEqual([
      "craftedFilter",
      "slotFilter",
      "sortDirection",
      "sortKey",
    ]);
  });

  it("writes nothing a caller smuggled in beside the four", () => {
    saveViewSettings({
      ...NARROWED,
      query: "spirit",
    } as unknown as ViewSettings);

    expect(stored()).not.toContain("spirit");
  });
});

describe("data it should not trust", () => {
  it("survives a value that is not JSON", () => {
    plant("not json");

    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("survives valid JSON of the wrong shape", () => {
    for (const value of ["[]", '"name"', "null", "42", "true", "[[]]"]) {
      plant(value);

      expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
    }
  });

  it("survives a record missing a field", () => {
    plant('{"sortKey":"name","sortDirection":"descending"}');

    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("rejects the whole record for an unrecognised sort key", () => {
    plant(JSON.stringify({ ...NARROWED, sortKey: "ladderOnly" }));

    // Not merged field by field. Accepting the three valid members would leave
    // the view sorted by a column the interface cannot render.
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("rejects the whole record for an unrecognised filter", () => {
    plant(JSON.stringify({ ...NARROWED, slotFilter: "gloves" }));
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);

    plant(JSON.stringify({ ...NARROWED, craftedFilter: "maybe" }));
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("rejects a direction it does not offer", () => {
    plant(JSON.stringify({ ...NARROWED, sortDirection: "none" }));

    // There is no unsorted state, so `aria-sort`'s third value is not a stored
    // direction either.
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("parses rather than asserts", () => {
    // A cast would have accepted every value above. The proof that it does not
    // is that each of them loads as the defaults rather than as itself.
    plant('{"sortKey":1,"sortDirection":2,"craftedFilter":3,"slotFilter":4}');

    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });
});

describe("a store that will not cooperate", () => {
  it("loads the defaults when reading throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    expect(() => loadViewSettings()).not.toThrow();
    expect(loadViewSettings()).toEqual(DEFAULT_VIEW_SETTINGS);
  });

  it("does not throw when writing throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    expect(() => saveViewSettings(NARROWED)).not.toThrow();
  });
});

describe("loading never writes", () => {
  it("leaves an unparseable value in place", () => {
    plant("not json");

    loadViewSettings();

    expect(stored()).toBe("not json");
  });

  it("leaves an absent key absent", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    loadViewSettings();

    expect(stored()).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
  });

  it("is overwritten by the next save rather than merged with", () => {
    plant('{"sortKey":"ladderOnly"}');

    const loaded = loadViewSettings();
    saveViewSettings({ ...loaded, slotFilter: "helm" });

    // Nothing of the old record carried forward.
    expect(JSON.parse(stored() ?? "{}")).toEqual({
      ...DEFAULT_VIEW_SETTINGS,
      slotFilter: "helm",
    });
  });
});

function plant(value: string) {
  window.localStorage.setItem(VIEW_STORAGE_KEY, value);
}

function stored() {
  return window.localStorage.getItem(VIEW_STORAGE_KEY);
}
