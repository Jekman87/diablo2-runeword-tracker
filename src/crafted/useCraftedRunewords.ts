import { useCallback, useState } from "react";

import {
  type StoredProgress,
  loadCrafted,
  saveCrafted,
} from "@/crafted/storage";
import { runewordNameAliases } from "@/data";

export interface CraftedRunewords {
  /** The marked runewords, by canonical name. */
  crafted: ReadonlySet<string>;
  /** Marks or unmarks one runeword. Called only from a confirmed dialog. */
  toggle: (name: string) => void;
  /** Makes an imported file the whole of the player's progress. */
  replace: (next: StoredProgress) => void;
}

/**
 * The crafted set and its persistence.
 *
 * Lives in `App`, the nearest common ancestor of the progress bar, the table and
 * the confirmation, and reaches the rows as props. Two levels of prop drilling
 * for one value is not a context and is certainly not a store library.
 *
 * Keyed by canonical name throughout — never by index. The dataset is generated,
 * so an index is a property of the file: regenerate it against a new patch and
 * every stored index points at a different runeword, silently.
 *
 * **There is no undo here, and there used to be.** A one-deep undo behind a
 * transient notice was the answer to the enlarged row hit target; a modal
 * confirmation in front of every mark and unmark is the answer now, and keeping
 * both would be the same protection twice — the second one arriving after the
 * change it protects against, on a timer. Which is exactly the argument import
 * made when it shipped a confirmation and no notice. What this hook holds is
 * therefore the write itself: whoever calls `toggle` has already asked.
 */
export function useCraftedRunewords(): CraftedRunewords {
  // Lazily, so the very first render already has the player's progress. An
  // effect would render an empty table first and then correct it.
  const [progress, setProgress] = useState<StoredProgress>(() =>
    loadCrafted(runewordNameAliases),
  );

  // Stable: every presented row receives it through `App`, and a fresh identity
  // on every render — which typing in the search field used to cause —
  // re-renders all 99 of them for a change that has nothing to do with crafted
  // state. The functional update means it closes over nothing that changes per
  // render.
  const toggle = useCallback((name: string) => {
    setProgress((prev) => {
      const crafted = new Set(prev.crafted);

      if (crafted.has(name)) crafted.delete(name);
      else crafted.add(name);

      const next = { crafted, unknown: prev.unknown };
      // Saved here, from the player's confirmed action, and **never from an
      // effect**. An effect fires on mount, which would write this empty set
      // over the value that failed to parse and take the evidence with it.
      saveCrafted(next);
      return next;
    });
  }, []);

  /**
   * The import's write: the value handed in becomes the whole of progress.
   *
   * **Deliberately not the toggle's path.** That path carries `unknown`
   * forward, which is right for a toggle and wrong for this: a replacement
   * defines the entire stored value, the unknown names in it included. The
   * ones the imported file brought are already inside `next`, put there by the
   * same `splitStoredNames` that splits a stored list; the ones held before it
   * go with everything else the import replaced.
   *
   * Takes the whole `StoredProgress` rather than a list of names because the
   * confirmation has already split the file in order to count what it would
   * mark. Re-splitting here would be a second answer to a question already
   * answered, and the count the player agreed to and the progress they get
   * could then differ.
   */
  const replace = useCallback((next: StoredProgress) => {
    setProgress(next);
    saveCrafted(next);
  }, []);

  return { crafted: progress.crafted, toggle, replace };
}
