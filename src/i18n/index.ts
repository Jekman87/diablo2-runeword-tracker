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
 * **The store also runs where there is no browser.** `pnpm build` renders both
 * entry documents to HTML strings in Node, with no `document` and no storage —
 * so every document access here is guarded, and the build states the locale
 * outright through `seedLocale` instead of the store inferring it. Detection
 * stays the browser's path; at build time the language is an input, decided by
 * which file is being written, and there is no document yet to declare anything.
 *
 * None of that involves a server: the site is static files on GitHub Pages, and
 * nothing runs when one is requested.
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

// The third argument is React's `getServerSnapshot`, and it is not redundant:
// without it `useSyncExternalStore` throws when the tree is rendered to a string
// rather than into DOM nodes. That happens at build time here — `renderToString`
// needs no server, and this project has none; the name is React's, inherited
// from the days when rendering to a string only happened in one place.
//
// It is the same function as the client snapshot because the store is module
// state that the build seeds before rendering, so both readers derive the value
// the same way — which is exactly what the API is asking about.

/** The active locale's display copy. Subscribes the caller to switches. */
export function useStrings(): Strings {
  const snapshot = () => records[currentLocale()];

  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** The active locale itself, for the one control that renders which is on. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, currentLocale, currentLocale);
}

/**
 * States the locale for a render that cannot detect one: the build's prerender
 * pass, which has no stored preference to read and no document to ask.
 *
 * Writes nothing and touches no document — it is not a language switch, it is
 * the renderer saying which of the two documents it is producing. `setLocale`
 * remains the only path that persists a choice, because persistence is the
 * consequence of an interaction and a build is not one.
 */
export function seedLocale(locale: Locale): void {
  activeLocale = locale;
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
  declareLanguage(locale);

  for (const notify of subscribers) notify();
}

function currentLocale(): Locale {
  if (activeLocale === null) {
    activeLocale = loadLocale() ?? documentLocale() ?? "en";
    // Stated on first read as well as on switch, so a restored `ru` is
    // declared before anything is painted in it.
    declareLanguage(activeLocale);
  }

  return activeLocale;
}

/**
 * The entry document's declared language, when it names a locale this version
 * offers. Read from the static `lang` attribute rather than the address, so
 * the app never parses URLs and a rehosted document keeps working; anything
 * unrecognised is no declaration at all rather than an error.
 *
 * Absent where there is no document — the prerender pass — rather than throwing:
 * a render that has no document has no declaration to read, which is not an
 * error but the reason `seedLocale` exists.
 */
function documentLocale(): Locale | undefined {
  if (typeof document === "undefined") return undefined;

  const lang = document.documentElement.lang;

  return locales.find((locale) => locale === lang);
}

/**
 * Restates the document's language, where there is a document to restate it on.
 *
 * Guarded for the same reason `documentLocale` is: the build renders these
 * components in Node. Guarding here rather than at both call sites keeps the two
 * paths — first read and explicit switch — saying the same thing about when the
 * attribute is written.
 */
function declareLanguage(locale: Locale): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
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
