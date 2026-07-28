import { en } from "./en";

/**
 * The shape of a locale, derived from the English record rather than declared
 * alongside it. A second locale is therefore typed *against* English: omit a
 * key and `pnpm typecheck` names it, instead of the interface rendering an
 * English word in the middle of a Russian sentence.
 */
export type Strings = typeof en;

/**
 * The active locale's display copy.
 *
 * Today it returns English unconditionally, and that is the entire point of it
 * being a hook rather than an import. `russian-locale` adds a second record and
 * the state that selects between them; with a hook, that is a change to this
 * file, and every component that renders copy re-renders on a switch for free.
 * With a direct import it would be a change to every one of them.
 *
 * There is deliberately no provider, no context, no persisted preference, no
 * plural or gender machinery and no library. Nothing calls for any of it yet,
 * and unused mechanism is harder to remove than to add.
 */
export function useStrings(): Strings {
  return en;
}
