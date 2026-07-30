import { CRAFTED_STORAGE_KEY } from "@/crafted/storage";
import { LOCALE_STORAGE_KEY, loadLocale, saveLocale } from "@/i18n/storage";
import { VIEW_STORAGE_KEY } from "@/view/storage";

// No component is rendered anywhere in this file, which is the point of the
// module being plain functions: the failure modes that matter — corrupt JSON,
// a language this version does not offer, a store that throws — are awkward to
// provoke through a rendered page and trivial here.

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loading and saving", () => {
  it("round-trips a chosen language", () => {
    saveLocale("ru");

    expect(loadLocale()).toBe("ru");
  });

  it("reads nothing as no preference, not as a default", () => {
    // `null`, deliberately: "no preference" is what lets the store apply
    // English without a write, so a first visit leaves storage untouched.
    expect(loadLocale()).toBeNull();
  });

  it("uses a key that is namespaced to the project and carries a version", () => {
    expect(LOCALE_STORAGE_KEY).toContain("diablo2-runeword-tracker");
    expect(LOCALE_STORAGE_KEY).toMatch(/:v\d+$/);
    expect(LOCALE_STORAGE_KEY).not.toBe("locale");
  });

  it("keeps its own key, separate from progress and the view", () => {
    expect(LOCALE_STORAGE_KEY).not.toBe(CRAFTED_STORAGE_KEY);
    expect(LOCALE_STORAGE_KEY).not.toBe(VIEW_STORAGE_KEY);
  });

  it("does not rewrite progress or the view when it writes", () => {
    window.localStorage.setItem(CRAFTED_STORAGE_KEY, '["Enigma"]');
    window.localStorage.setItem(VIEW_STORAGE_KEY, '{"sortKey":"name"}');

    saveLocale("ru");

    expect(window.localStorage.getItem(CRAFTED_STORAGE_KEY)).toBe('["Enigma"]');
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe(
      '{"sortKey":"name"}',
    );
  });
});

describe("data it should not trust", () => {
  it("survives a value that is not JSON", () => {
    plant("not json");

    expect(loadLocale()).toBeNull();
  });

  it("survives valid JSON of the wrong shape", () => {
    for (const value of ["[]", "{}", "null", "42", "true", '["ru"]']) {
      plant(value);

      expect(loadLocale()).toBeNull();
    }
  });

  it("rejects a language this version does not offer", () => {
    plant('"de"');

    expect(loadLocale()).toBeNull();
  });

  it("parses rather than asserts", () => {
    // A cast would have accepted every value above. The proof that it does not
    // is that each of them loads as no preference rather than as itself.
    plant('"RU"');

    expect(loadLocale()).toBeNull();
  });
});

describe("a store that will not cooperate", () => {
  it("loads no preference when reading throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    expect(() => loadLocale()).not.toThrow();
    expect(loadLocale()).toBeNull();
  });

  it("does not throw when writing throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    expect(() => saveLocale("ru")).not.toThrow();
  });
});

describe("loading never writes", () => {
  it("leaves an unparseable value in place", () => {
    plant("not json");

    loadLocale();

    expect(stored()).toBe("not json");
  });

  it("leaves an absent key absent", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    loadLocale();

    expect(stored()).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
  });

  it("is overwritten by the next save rather than repaired in place", () => {
    plant('"klingon"');

    loadLocale();
    saveLocale("en");

    // Nothing of the old value carried forward.
    expect(stored()).toBe('"en"');
  });
});

function plant(value: string) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
}

function stored() {
  return window.localStorage.getItem(LOCALE_STORAGE_KEY);
}
