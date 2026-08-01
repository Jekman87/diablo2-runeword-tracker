import { act, renderHook } from "@testing-library/react";

import { CRAFTED_STORAGE_KEY } from "@/crafted/storage";
import { useCraftedRunewords } from "@/crafted/useCraftedRunewords";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("toggling", () => {
  it("marks and unmarks a runeword", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma"));
    expect(result.current.crafted.has("Enigma")).toBe(true);

    act(() => result.current.toggle("Enigma"));
    expect(result.current.crafted.has("Enigma")).toBe(false);
  });

  it("replaces the set rather than mutating it, so React re-renders", () => {
    const { result } = renderHook(() => useCraftedRunewords());
    const before = result.current.crafted;

    act(() => result.current.toggle("Enigma"));

    expect(result.current.crafted).not.toBe(before);
  });

  it("persists the mark", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma"));

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Enigma"]');
  });

  it("loads what an earlier session wrote", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma","Spirit"]');

    const { result } = renderHook(() => useCraftedRunewords());

    expect([...result.current.crafted]).toEqual(["Enigma", "Spirit"]);
  });
});

// There is no undo here to test any more. The confirmation dialog in front of
// every mark and unmark is the protection now, and it is `App`'s to prove: this
// hook is the write that a confirmed answer performs.

describe("what mounting must not do", () => {
  it("writes nothing", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderHook(() => useCraftedRunewords());

    expect(setItem).not.toHaveBeenCalled();
  });

  it("leaves a value it could not parse in place", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, "not json");

    const { result } = renderHook(() => useCraftedRunewords());

    expect(result.current.crafted.size).toBe(0);
    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe("not json");
  });

  it("still tracks in memory when storage is unusable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma"));

    expect(result.current.crafted.has("Enigma")).toBe(true);
  });
});

describe("names the dataset does not know", () => {
  it("are neither marked nor lost", () => {
    window.localStorage.setItem(
      CRAFTED_STORAGE_KEY,
      '["Enigma","Ondal\'s Wisdom"]',
    );

    const { result } = renderHook(() => useCraftedRunewords());

    expect([...result.current.crafted]).toEqual(["Enigma"]);

    act(() => result.current.toggle("Spirit"));

    expect(
      JSON.parse(window.localStorage.getItem(CRAFTED_STORAGE_KEY) ?? "[]"),
    ).toContain("Ondal's Wisdom");
  });
});

describe("replacing progress with an imported file", () => {
  it("makes the imported value the whole of the crafted set", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma"));
    act(() => result.current.toggle("Spirit"));

    act(() =>
      result.current.replace({ crafted: new Set(["Grief"]), unknown: [] }),
    );

    // Replacement, not a merge: the two marks made before it are gone even
    // though the imported value said nothing about them.
    expect([...result.current.crafted]).toEqual(["Grief"]);
  });

  it("writes the replacement to storage", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() =>
      result.current.replace({
        crafted: new Set(["Grief", "Enigma"]),
        unknown: [],
      }),
    );

    expect(
      JSON.parse(window.localStorage.getItem(CRAFTED_STORAGE_KEY) ?? "[]"),
    ).toEqual(["Enigma", "Grief"]);
  });

  it("clears progress when the imported file listed nothing", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma"));
    act(() => result.current.replace({ crafted: new Set(), unknown: [] }));

    expect(result.current.crafted.size).toBe(0);
    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe("[]");
  });

  it("drops the unknown names it replaced and keeps the ones it brought", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Ondal\'s Wisdom"]');

    const { result } = renderHook(() => useCraftedRunewords());

    act(() =>
      result.current.replace({
        crafted: new Set(["Enigma"]),
        unknown: ["Plague"],
      }),
    );

    // The one case where a preserved unknown name is allowed to go — and the
    // only way one ever can, since nothing in the interface renders it.
    expect(
      JSON.parse(window.localStorage.getItem(CRAFTED_STORAGE_KEY) ?? "[]"),
    ).toEqual(["Enigma", "Plague"]);
  });

  it("still replaces in memory when storage is unusable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    const { result } = renderHook(() => useCraftedRunewords());

    act(() =>
      result.current.replace({ crafted: new Set(["Grief"]), unknown: [] }),
    );

    expect(result.current.crafted.has("Grief")).toBe(true);
  });
});

describe("callback identity", () => {
  it("keeps toggle stable across renders", () => {
    const { result, rerender } = renderHook(() => useCraftedRunewords());
    const before = result.current.toggle;

    rerender();

    expect(result.current.toggle).toBe(before);
  });
});
