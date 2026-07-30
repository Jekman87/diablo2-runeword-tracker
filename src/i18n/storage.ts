import { z } from "zod";

/**
 * The two locales this version offers, in the order the switch presents them.
 *
 * A tuple, so the stored value's schema, the locale records and the switch all
 * read from one declaration — the same shape `sortKeys` gives the view. It
 * lives here rather than in `src/i18n/index.ts` because the store loads the
 * preference during initialisation: the tuple's owner has to sit below both.
 */
export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

/**
 * The key, namespaced and versioned, for the reasons `VIEW_STORAGE_KEY` spells
 * out: GitHub Pages serves every project under the account from one origin, so
 * an unprefixed key is a collision waiting for a second project, and the
 * version is in the key so a future format writes elsewhere instead of
 * destroying this value in place.
 *
 * **A different key from progress and from the view, deliberately.** The
 * language is how the whole interface speaks, not how the player is looking at
 * the list and not the player's work — a version bump of either must not be
 * able to touch it.
 *
 * Exported for the tests, which need to plant a raw value. Nothing else may
 * read it — a second module naming the key is a second definition of the format.
 */
export const LOCALE_STORAGE_KEY = "diablo2-runeword-tracker:locale:v1";

/**
 * Reads the stored language preference, or `null` where there is none to read.
 *
 * `null` rather than a default, because "no preference" is information the
 * store acts on — English applies, and nothing is written until the player
 * switches. Every failure lands there too: absent, unreadable, not JSON, the
 * wrong shape, a language this version does not offer. That is the
 * view-persistence recovery policy and not the progress one — a language
 * choice is a preference re-expressed in one click, so a bad record is
 * discarded and the next switch overwrites it. **Reading never writes**: a
 * failed load leaves the stored value alone, so a write is always the
 * consequence of an interaction.
 */
export function loadLocale(): Locale | null {
  const raw = read();

  if (raw === null) return null;

  const parsed = localeSchema.safeParse(parseJson(raw));

  if (!parsed.success) return null;

  return parsed.data;
}

/**
 * Writes the chosen language.
 *
 * Called from `setLocale` and **never from an effect** — an effect fires on
 * mount and would write a value the player never chose over one that merely
 * failed to parse.
 */
export function saveLocale(locale: Locale): void {
  write(JSON.stringify(locale));
}

/**
 * What a stored value has to look like: one enum over the languages *this*
 * version offers.
 *
 * Parsed, not asserted — `localStorage` is external input, user-editable in
 * two clicks and last written by a version of this application that may not be
 * this one. The enum reads from the `locales` tuple, so a locale added later
 * becomes storable without this file being touched.
 */
const localeSchema = z.enum(locales);

function read(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    // Storage disabled, or a privacy mode that throws on access. Caught here
    // rather than at the call site so that no component has to know storage
    // can fail at all.
    return null;
  }
}

function write(value: string): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
  } catch {
    // Disabled, full, or throwing in a private mode. The switch keeps working
    // for the session; the choice is simply not remembered.
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    // Not JSON at all. `undefined` fails the schema above, which is the same
    // path as JSON of the wrong shape — one recovery, not two.
    return undefined;
  }
}
