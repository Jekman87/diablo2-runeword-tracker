import { act, renderHook } from "@testing-library/react";

import { VIEW_STORAGE_KEY } from "@/view/storage";
import { DEFAULT_VIEW_SETTINGS } from "@/view/types";
import { useViewSettings } from "@/view/useViewSettings";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("the initial view", () => {
  it("is the defaults on a first visit", () => {
    const { result } = renderHook(() => useViewSettings());

    expect(result.current.settings).toEqual(DEFAULT_VIEW_SETTINGS);
    expect(result.current.query).toBe("");
    expect(result.current.narrowed).toBe(false);
  });

  it("is what an earlier session left behind, on the first render", () => {
    plant({
      sortKey: "name",
      sortDirection: "descending",
      craftedFilter: "remaining",
      slotFilter: "offhand",
    });

    const { result } = renderHook(() => useViewSettings());

    // Read in the initialiser rather than in an effect, so this is true of the
    // *first* render and there is no frame of the default view before it.
    expect(result.current.settings.sortKey).toBe("name");
    expect(result.current.settings.slotFilter).toBe("offhand");
    expect(result.current.narrowed).toBe(true);
  });
});

describe("the setters", () => {
  it("sets the crafted filter and persists it", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setCraftedFilter("crafted"));

    expect(result.current.settings.craftedFilter).toBe("crafted");
    expect(stored().craftedFilter).toBe("crafted");
  });

  it("sets the slot filter and persists it", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setSlotFilter("helm"));

    expect(result.current.settings.slotFilter).toBe("helm");
    expect(stored().slotFilter).toBe("helm");
  });

  it("leaves the other controls alone", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setQuery("spirit"));
    act(() => result.current.setCraftedFilter("remaining"));
    act(() => result.current.setSlotFilter("offhand"));

    expect(result.current.query).toBe("spirit");
    expect(result.current.settings.craftedFilter).toBe("remaining");
    expect(result.current.settings.sortKey).toBe(DEFAULT_VIEW_SETTINGS.sortKey);
  });

  it("keeps its identity across renders", () => {
    const { result, rerender } = renderHook(() => useViewSettings());
    const before = {
      sortBy: result.current.sortBy,
      setCraftedFilter: result.current.setCraftedFilter,
      setSlotFilter: result.current.setSlotFilter,
      reset: result.current.reset,
    };

    act(() => result.current.setQuery("spirit"));
    rerender();

    // A fresh callback on every keystroke would rebuild all 99 memoised rows.
    expect(result.current.sortBy).toBe(before.sortBy);
    expect(result.current.setCraftedFilter).toBe(before.setCraftedFilter);
    expect(result.current.setSlotFilter).toBe(before.setSlotFilter);
    expect(result.current.reset).toBe(before.reset);
  });
});

describe("the query", () => {
  it("is not persisted", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setQuery("spirit"));

    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBeNull();
  });

  it("does not survive a remount, while the filters do", () => {
    const first = renderHook(() => useViewSettings());

    act(() => first.result.current.setQuery("spirit"));
    act(() => first.result.current.setSlotFilter("offhand"));
    first.unmount();

    const { result } = renderHook(() => useViewSettings());

    expect(result.current.query).toBe("");
    expect(result.current.settings.slotFilter).toBe("offhand");
  });
});

describe("the direction flip", () => {
  it("adopts ascending on a column that was not sorted", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("name"));

    expect(result.current.settings).toMatchObject({
      sortKey: "name",
      sortDirection: "ascending",
    });
  });

  it("reverses the sorted column", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("name"));
    act(() => result.current.sortBy("name"));

    expect(result.current.settings.sortDirection).toBe("descending");
  });

  it("never reaches a third state", () => {
    const { result } = renderHook(() => useViewSettings());
    const seen: string[] = [];

    for (let press = 0; press < 5; press += 1) {
      act(() => result.current.sortBy("runes"));
      seen.push(result.current.settings.sortDirection);
    }

    expect(result.current.settings.sortKey).toBe("runes");
    expect(seen).toEqual([
      "ascending",
      "descending",
      "ascending",
      "descending",
      "ascending",
    ]);
  });

  it("starts a different column ascending rather than carrying the direction over", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("name"));
    act(() => result.current.sortBy("name"));
    act(() => result.current.sortBy("runes"));

    expect(result.current.settings).toMatchObject({
      sortKey: "runes",
      sortDirection: "ascending",
    });
  });

  it("persists the direction as well as the column", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("crafted"));
    act(() => result.current.sortBy("crafted"));

    expect(stored()).toMatchObject({
      sortKey: "crafted",
      sortDirection: "ascending",
    });
  });

  it("starts the crafted column descending, so one press shows what is done", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("crafted"));

    // The only column with a first direction of its own. The arithmetic is
    // unchanged — ascending still puts the un-crafted first — and this is about
    // which direction one press lands on.
    expect(result.current.settings).toMatchObject({
      sortKey: "crafted",
      sortDirection: "descending",
    });

    act(() => result.current.sortBy("crafted"));

    expect(result.current.settings.sortDirection).toBe("ascending");
  });

  it("starts every other column ascending", () => {
    const { result } = renderHook(() => useViewSettings());

    for (const key of [
      "name",
      "runes",
      "itemTypes",
      "requiredLevel",
    ] as const) {
      act(() => result.current.sortBy(key));

      expect(result.current.settings).toMatchObject({
        sortKey: key,
        sortDirection: "ascending",
      });
    }
  });
});

describe("narrowed", () => {
  it("is true for a query, either filter, or a combination", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setQuery("spirit"));
    expect(result.current.narrowed).toBe(true);

    act(() => result.current.setQuery(""));
    expect(result.current.narrowed).toBe(false);

    act(() => result.current.setCraftedFilter("crafted"));
    expect(result.current.narrowed).toBe(true);

    act(() => result.current.setCraftedFilter("all"));
    act(() => result.current.setSlotFilter("helm"));
    expect(result.current.narrowed).toBe(true);
  });

  it("ignores a query that is only whitespace", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setQuery("   "));

    // It hides nothing, so there is nothing for a reset to do.
    expect(result.current.narrowed).toBe(false);
  });

  it("is not affected by the sort", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("name"));

    expect(result.current.narrowed).toBe(false);
  });
});

describe("the reset", () => {
  it("clears the query and both filters", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setQuery("spirit"));
    act(() => result.current.setCraftedFilter("crafted"));
    act(() => result.current.setSlotFilter("offhand"));
    act(() => result.current.reset());

    expect(result.current.query).toBe("");
    expect(result.current.settings.craftedFilter).toBe("all");
    expect(result.current.settings.slotFilter).toBe("all");
    expect(result.current.narrowed).toBe(false);
  });

  it("leaves the sort alone", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.sortBy("name"));
    act(() => result.current.sortBy("name"));
    act(() => result.current.setSlotFilter("offhand"));
    act(() => result.current.reset());

    expect(result.current.settings).toMatchObject({
      sortKey: "name",
      sortDirection: "descending",
    });
  });

  it("persists the cleared filters", () => {
    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setSlotFilter("offhand"));
    act(() => result.current.reset());

    expect(stored().slotFilter).toBe("all");
  });
});

describe("what mounting must not do", () => {
  it("writes nothing", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderHook(() => useViewSettings());

    expect(setItem).not.toHaveBeenCalled();
  });

  it("leaves a value it could not parse in place until the player acts", () => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, "not json");

    const { result } = renderHook(() => useViewSettings());

    expect(result.current.settings).toEqual(DEFAULT_VIEW_SETTINGS);
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe("not json");

    act(() => result.current.setSlotFilter("helm"));

    // The first change is the first write, and nothing of the old value survives.
    expect(stored()).toEqual({ ...DEFAULT_VIEW_SETTINGS, slotFilter: "helm" });
  });

  it("keeps every control working when storage is unusable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    const { result } = renderHook(() => useViewSettings());

    act(() => result.current.setSlotFilter("helm"));
    act(() => result.current.sortBy("name"));
    act(() => result.current.setQuery("spirit"));

    expect(result.current.settings).toMatchObject({
      slotFilter: "helm",
      sortKey: "name",
    });
    expect(result.current.query).toBe("spirit");
  });
});

function plant(settings: unknown) {
  window.localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(settings));
}

function stored(): Record<string, unknown> {
  return JSON.parse(window.localStorage.getItem(VIEW_STORAGE_KEY) ?? "{}");
}
