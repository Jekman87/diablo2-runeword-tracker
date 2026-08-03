import { act, renderHook } from "@testing-library/react";

import { itemTypes, runes, runewords } from "@/data";
import {
  type Strings,
  resetLocaleForTests,
  setLocale,
  useLocale,
  useStrings,
} from "@/i18n";
import { en } from "@/i18n/en";
import { ru } from "@/i18n/ru";
import { LOCALE_STORAGE_KEY } from "@/i18n/storage";

// Three boundaries are under test: the store (which record is active, what a
// switch does, what loading may and may not do), the locale shape (a record
// cannot be incomplete, Russian grammar picks the right form), and the layer's
// border with the dataset (no dataset value has leaked into either record).

beforeEach(() => {
  window.localStorage.clear();
  // The pre-script truth `index.html` declares, so every test starts where a
  // fresh page load would.
  document.documentElement.lang = "en";
  resetLocaleForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("the default locale", () => {
  it("is English when nothing is stored", () => {
    const { result } = renderHook(useStrings);

    expect(result.current).toBe(en);
  });

  it("ignores the browser's language", () => {
    // The store never consults `navigator.language` — a first visit is English
    // in every environment, and Russian is only ever an explicit choice. The
    // override proves the resolution does not quietly depend on it.
    Object.defineProperty(window.navigator, "language", {
      value: "ru-RU",
      configurable: true,
    });

    try {
      const { result } = renderHook(useStrings);

      expect(result.current).toBe(en);
    } finally {
      delete (window.navigator as { language?: string }).language;
    }
  });

  it("writes nothing to storage", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderHook(useStrings);

    expect(setItem).not.toHaveBeenCalled();
    expect(window.localStorage.length).toBe(0);
  });

  it("is Russian when the entry document declares Russian", () => {
    // The `/ru/` entry ships `lang="ru"` in its static HTML — the publisher's
    // declaration, unlike the browser language the test above proves ignored.
    document.documentElement.lang = "ru";

    const { result } = renderHook(useStrings);

    expect(result.current).toBe(ru);
  });

  it("treats an unrecognised document language as no declaration", () => {
    document.documentElement.lang = "de";

    const { result } = renderHook(useStrings);

    expect(result.current).toBe(en);
  });

  it("still writes nothing when the entry set the language", () => {
    document.documentElement.lang = "ru";
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderHook(useStrings);

    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("a stored preference", () => {
  it("is in effect on the first read, with no English frame before it", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, '"ru"');

    const { result } = renderHook(useStrings);

    expect(result.current).toBe(ru);
    expect(document.documentElement.lang).toBe("ru");
  });

  it("outranks the entry document's own language", () => {
    // A player with English stored opening the /ru/ link a friend sent: the
    // explicit choice wins over the door it came through.
    document.documentElement.lang = "ru";
    window.localStorage.setItem(LOCALE_STORAGE_KEY, '"en"');

    const { result } = renderHook(useStrings);

    expect(result.current).toBe(en);
  });

  it("falls back to English when it is unusable, and is left in place", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, '"klingon"');

    const { result } = renderHook(useStrings);

    expect(result.current).toBe(en);
    // Loading never writes — the wreckage waits for the next explicit switch.
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('"klingon"');
  });
});

describe("setLocale", () => {
  it("re-renders a subscribed consumer with the other record", () => {
    const { result } = renderHook(useStrings);

    act(() => setLocale("ru"));
    expect(result.current).toBe(ru);

    act(() => setLocale("en"));
    expect(result.current).toBe(en);
  });

  it("reports the active locale through useLocale", () => {
    const { result } = renderHook(useLocale);

    expect(result.current).toBe("en");

    act(() => setLocale("ru"));
    expect(result.current).toBe("ru");
  });

  it("persists the choice under the locale key", () => {
    renderHook(useStrings);

    act(() => setLocale("ru"));

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('"ru"');
  });

  it("keeps the document language attribute truthful", () => {
    renderHook(useStrings);
    expect(document.documentElement.lang).toBe("en");

    act(() => setLocale("ru"));
    expect(document.documentElement.lang).toBe("ru");

    act(() => setLocale("en"));
    expect(document.documentElement.lang).toBe("en");
  });

  it("overwrites an unusable stored value on the next switch", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "not json");

    renderHook(useStrings);
    act(() => setLocale("ru"));

    // Nothing of the old value carried forward.
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('"ru"');
  });

  it("keeps working when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    const { result } = renderHook(useStrings);

    // The switch still switches; the choice is simply not remembered.
    expect(() => act(() => setLocale("ru"))).not.toThrow();
    expect(result.current).toBe(ru);
  });
});

describe("the locale shape", () => {
  it("rejects a locale that omits a key", () => {
    // The assertion here is the directive, not the expectation below it. If
    // `Strings` ever stopped requiring every key, this line would compile and
    // `pnpm typecheck` would fail for an unused `@ts-expect-error` — which is
    // what keeps a missing translation a build failure rather than a habit.
    // @ts-expect-error `table` is missing its four column headers
    const incomplete: Strings = { ...en, table: partialTable };

    expect(incomplete.table.caption).toBe(en.table.caption);
  });

  it("types the Russian record against the English shape", () => {
    expect(ru satisfies Strings).toBe(ru);
  });

  it.each(records)(
    "defines a non-empty value for every key in %s",
    (_, record) => {
      const blank = copy(record).filter(([, value]) => value.trim() === "");

      expect(blank).toEqual([]);
    },
  );

  it("keeps the language options identical across records", () => {
    // A language's own name does not translate — only the group's label does.
    expect(ru.language.en).toBe(en.language.en);
    expect(ru.language.enName).toBe(en.language.enName);
    expect(ru.language.ru).toBe(en.language.ru);
    expect(ru.language.ruName).toBe(en.language.ruName);
  });
});

describe("Russian plural forms", () => {
  it("declines the socket count", () => {
    expect(ru.remaining.baseSockets(1)).toBe("1 гнездо");
    expect(ru.remaining.baseSockets(2)).toBe("2 гнезда");
    expect(ru.remaining.baseSockets(5)).toBe("5 гнёзд");
    expect(ru.remaining.baseSockets(11)).toBe("11 гнёзд");
    expect(ru.remaining.baseSockets(21)).toBe("21 гнездо");
  });

  it("declines the visible-row count", () => {
    expect(ru.controls.count(1, 99)).toBe("Показано 1 рунное слово из 99");
    expect(ru.controls.count(2, 99)).toBe("Показано 2 рунных слова из 99");
    expect(ru.controls.count(5, 99)).toBe("Показано 5 рунных слов из 99");
    expect(ru.controls.count(12, 99)).toBe("Показано 12 рунных слов из 99");
    expect(ru.controls.count(21, 99)).toBe("Показано 21 рунное слово из 99");
  });

  it("declines the served-runeword count in the genitive", () => {
    expect(ru.remaining.baseCount(1)).toBe("подойдёт для 1 рунного слова");
    expect(ru.remaining.baseCount(2)).toBe("подойдёт для 2 рунных слов");
    expect(ru.remaining.baseCount(5)).toBe("подойдёт для 5 рунных слов");
    expect(ru.remaining.baseCount(21)).toBe("подойдёт для 21 рунного слова");
  });
});

describe("the layer's boundary with the dataset", () => {
  it.each(records)(
    "%s holds no runeword name, rune name or item category",
    (_, record) => {
      const identifiers = new Set([
        ...runewords.map((runeword) => runeword.name),
        ...runes.map((rune) => rune.name),
        ...itemTypes.map((itemType) => itemType.name),
      ]);

      const leaked = copy(record).filter(([, value]) => identifiers.has(value));

      expect(leaked).toEqual([]);
    },
  );

  it.each(records)(
    "%s holds no property line, restriction or note",
    (_, record) => {
      const gameText = new Set([
        ...runewords.flatMap((runeword) =>
          runeword.propertyGroups.flatMap((group) => group.properties),
        ),
        ...runewords.map((runeword) => runeword.itemTypeRestriction),
        ...runewords.map((runeword) => runeword.note),
      ]);

      const leaked = copy(record).filter(([, value]) => gameText.has(value));

      expect(leaked).toEqual([]);
    },
  );
});

const records: [string, Strings][] = [
  ["en", en],
  ["ru", ru],
];

const partialTable = { caption: en.table.caption };

/**
 * Every string the layer holds, as `dotted.key` / value pairs. Functions are
 * called with a marker argument so their template text is inspected too — an
 * interpolated string is display copy like any other. (A count-taking function
 * receives the marker as well; `NaN` lands in the many-form branch, which is a
 * form like any other for this purpose.)
 */
function copy(record: object, prefix = ""): [string, string][] {
  return Object.entries(record).flatMap(([key, value]) => {
    const path = prefix === "" ? key : `${prefix}.${key}`;

    if (typeof value === "string") return [[path, value]];
    if (typeof value === "function") {
      const arity = (value as (...args: string[]) => string).length;
      const args = Array.from({ length: arity }, () => MARKER);

      return [[path, (value as (...args: string[]) => string)(...args)]];
    }

    return copy(value as object, path);
  });
}

// Not a value the dataset holds, so a call site's interpolated arguments can
// never look like leaked game text.
const MARKER = " ";
