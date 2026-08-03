import { useSyncExternalStore } from "react";

import { en } from "./en";
import { ru } from "./ru";
import { type Locale, loadLocale, locales, saveLocale } from "./storage";

export type { Locale };
export { locales } from "./storage";

/**
 * The shape of a locale, derived from the English record rather than declared
 * alongside it. Every other locale is therefore typed *against* English: omit a
 * key and `pnpm typecheck` names it, instead of the interface rendering an
 * English word in the middle of a Russian sentence.
 */
export type Strings = typeof en;

/**
 * The locale store: which language the interface speaks, held as module state
 * with a subscriber set and read through `useSyncExternalStore`.
 *
 * Module state rather than props or context, and that is the seam paying for
 * itself: fourteen components call `useStrings()`, and a locale prop threaded
 * through them — or a provider wrapped around them — is exactly the edit the
 * `ui-strings` contract forbids. The hook's signature is unchanged from the
 * single-locale days; the switch reaches `setLocale` by import rather than by
 * hook; and a switch re-renders every consumer because every consumer is
 * subscribed, not because any of them was edited.
 *
 * **Initialisation is lazy and resolves to the stored preference, else the
 * entry document's own language, else English.** Lazy, so the first paint is
 * already in the restored language — an effect would render English and then
 * correct it, a visible frame of a language the player left. The document's
 * `lang` is the publisher's declaration, not a guess about the reader: the
 * root entry ships `lang="en"` and `/ru/` ships `lang="ru"`, so each front
 * door opens in its own language while `navigator.language` stays deliberately
 * unconsulted — a first visit to a given entry is the same in every
 * environment, and the stored choice outranks whichever door it came through.
 * Loading never writes — the first switch is the first write.
 *
 * `document.documentElement.lang` follows the active locale, set on
 * initialisation as well as on every switch, so a restored Russian session
 * declares `ru` from the first paint and screen readers apply the right
 * pronunciation rules. The static `lang="en"` in `index.html` remains the
 * pre-script truth.
 *
 * Still no third-party internationalisation dependency: two records, one
 * variable and a `Set` are the whole mechanism, and grammar a locale needs
 * lives inside that locale's own value functions.
 */
let activeLocale: Locale | null = null;

const subscribers = new Set<() => void>();

// `ru.ts` imports this module for the `Strings` type only, and a type-only
// import is erased at compile time — so this is not a runtime cycle.
const records: Record<Locale, Strings> = { en, ru };

/** The active locale's display copy. Subscribes the caller to switches. */
export function useStrings(): Strings {
  return useSyncExternalStore(subscribe, () => records[currentLocale()]);
}

/** The active locale itself, for the one control that renders which is on. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, currentLocale);
}

/**
 * Switches the interface language: updates the store, persists the choice,
 * restates the document language and notifies every subscribed component.
 *
 * The write happens here and never in an effect, so it is always the
 * consequence of an interaction — which is also what lets an unusable stored
 * value be replaced by the next explicit switch rather than repaired on load.
 */
export function setLocale(locale: Locale): void {
  activeLocale = locale;
  saveLocale(locale);
  document.documentElement.lang = locale;

  for (const notify of subscribers) notify();
}

function currentLocale(): Locale {
  if (activeLocale === null) {
    activeLocale = loadLocale() ?? documentLocale() ?? "en";
    // Stated on first read as well as on switch, so a restored `ru` is
    // declared before anything is painted in it.
    document.documentElement.lang = activeLocale;
  }

  return activeLocale;
}

/**
 * The entry document's declared language, when it names a locale this version
 * offers. Read from the static `lang` attribute rather than the address, so
 * the app never parses URLs and a rehosted document keeps working; anything
 * unrecognised is no declaration at all rather than an error.
 */
function documentLocale(): Locale | undefined {
  const lang = document.documentElement.lang;

  return locales.find((locale) => locale === lang);
}

function subscribe(notify: () => void): () => void {
  subscribers.add(notify);

  return () => subscribers.delete(notify);
}

/**
 * Returns the store to "never initialised", for tests only. Module state is
 * shared across a test file; this is the `beforeEach` that makes each test
 * start where a fresh page load would.
 */
export function resetLocaleForTests(): void {
  activeLocale = null;
  subscribers.clear();
}
