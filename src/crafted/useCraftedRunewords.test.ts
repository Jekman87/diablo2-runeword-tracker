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

    act(() => result.current.toggle("Enigma", null));
    expect(result.current.crafted.has("Enigma")).toBe(true);

    act(() => result.current.toggle("Enigma", null));
    expect(result.current.crafted.has("Enigma")).toBe(false);
  });

  it("replaces the set rather than mutating it, so React re-renders", () => {
    const { result } = renderHook(() => useCraftedRunewords());
    const before = result.current.crafted;

    act(() => result.current.toggle("Enigma", null));

    expect(result.current.crafted).not.toBe(before);
  });

  it("persists the mark", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Enigma"]');
  });

  it("loads what an earlier session wrote", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma","Spirit"]');

    const { result } = renderHook(() => useCraftedRunewords());

    expect([...result.current.crafted]).toEqual(["Enigma", "Spirit"]);
  });
});

describe("the pending undo", () => {
  it("records what the toggle did", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));

    expect(result.current.pendingUndo).toMatchObject({
      name: "Enigma",
      marked: true,
    });
  });

  it("reverses exactly that toggle", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));
    act(() => result.current.undo());

    expect(result.current.crafted.has("Enigma")).toBe(false);
    expect(result.current.pendingUndo).toBeNull();
  });

  it("reverses an unmark as readily as a mark", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma"]');
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));
    act(() => result.current.undo());

    expect(result.current.crafted.has("Enigma")).toBe(true);
  });

  it("is replaced by a second toggle rather than queued behind it", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));
    act(() => result.current.toggle("Spirit", null));
    act(() => result.current.undo());

    // Only the most recent one comes back. There is no history stack.
    expect(result.current.crafted.has("Spirit")).toBe(false);
    expect(result.current.crafted.has("Enigma")).toBe(true);
  });

  it("returns focus to the control it was given", () => {
    const control = document.createElement("button");
    document.body.append(control);

    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", control));
    act(() => result.current.undo());

    expect(document.activeElement).toBe(control);

    control.remove();
  });

  it("does nothing when there is nothing to undo", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    expect(() => act(() => result.current.undo())).not.toThrow();
    expect(result.current.crafted.size).toBe(0);
  });

  it("clears on dismissal without reversing the toggle", () => {
    const { result } = renderHook(() => useCraftedRunewords());

    act(() => result.current.toggle("Enigma", null));
    act(() => result.current.dismissUndo());

    expect(result.current.pendingUndo).toBeNull();
    expect(result.current.crafted.has("Enigma")).toBe(true);
  });
});

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

    act(() => result.current.toggle("Enigma", null));

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

    act(() => result.current.toggle("Spirit", null));

    expect(
      JSON.parse(window.localStorage.getItem(CRAFTED_STORAGE_KEY) ?? "[]"),
    ).toContain("Ondal's Wisdom");
  });
});
