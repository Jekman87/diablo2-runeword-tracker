import { useCallback, useState } from "react";

import {
  type StoredProgress,
  loadCrafted,
  saveCrafted,
} from "@/crafted/storage";
import { runewordNames } from "@/data";

/** What the last toggle did, and how to put it back. */
export interface PendingUndo {
  /** The runeword that was toggled. */
  name: string;
  /** `true` if the toggle marked it, `false` if it unmarked it. */
  marked: boolean;
  /**
   * The control to hand focus back to if the undo is taken.
   *
   * A DOM node rather than a name, because the alternative is minting an id for
   * every row out of names that contain apostrophes and spaces. Today no row
   * ever unmounts, so the node is always live; once `search-sort-filter` can
   * hide a row between the toggle and the undo, this can be detached — and
   * `focus()` on a detached node is a no-op, not a throw, so the worst case is
   * that focus does not move.
   */
  control: HTMLElement | null;
}

export interface CraftedRunewords {
  /** The marked runewords, by canonical name. */
  crafted: ReadonlySet<string>;
  /** The last toggle, or `null` once it has been undone or dismissed. */
  pendingUndo: PendingUndo | null;
  toggle: (name: string, control: HTMLElement | null) => void;
  /** Makes an imported file the whole of the player's progress. */
  replace: (next: StoredProgress) => void;
  undo: () => void;
  dismissUndo: () => void;
}

/**
 * The crafted set, its persistence and the one-deep undo behind it.
 *
 * Lives in `App`, the nearest common ancestor of the progress bar, the table and
 * the notice, and reaches the rows as props. Two levels of prop drilling for one
 * value is not a context and is certainly not a store library.
 *
 * Keyed by canonical name throughout — never by index. The dataset is generated,
 * so an index is a property of the file: regenerate it against a new patch and
 * every stored index points at a different runeword, silently.
 */
export function useCraftedRunewords(): CraftedRunewords {
  // Lazily, so the very first render already has the player's progress. An
  // effect would render an empty table first and then correct it.
  const [progress, setProgress] = useState<StoredProgress>(() =>
    loadCrafted(runewordNames),
  );
  const [pendingUndo, setPendingUndo] = useState<PendingUndo | null>(null);

  // The one member of this API with a stable identity, because it is the one
  // the notice uses as an effect dependency: its auto-dismissal timer restarts
  // whenever this function changes, and a fresh closure on every render would
  // mean the dismissal interval never elapsed.
  const dismissUndo = useCallback(() => setPendingUndo(null), []);

  function write(crafted: ReadonlySet<string>) {
    const next = { crafted, unknown: progress.unknown };

    setProgress(next);

    // Saved here, from the player's action, and **never from an effect**. An
    // effect fires on mount, which would write this empty set over the value
    // that failed to parse and take the evidence with it.
    saveCrafted(next);
  }

  return {
    crafted: progress.crafted,
    pendingUndo,
    dismissUndo,

    toggle(name, control) {
      // Copy-on-write. Mutating the set in place does not change its identity,
      // and React would not re-render.
      const crafted = new Set(progress.crafted);
      const marked = !crafted.has(name);

      if (marked) crafted.add(name);
      else crafted.delete(name);

      write(crafted);
      setPendingUndo({ name, marked, control });
    },

    /**
     * The import's write: the value handed in becomes the whole of progress.
     *
     * **Deliberately not `write()`.** That helper carries `progress.unknown`
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
     *
     * Clearing the notice is the small load-bearing line. Left in place, a
     * notice raised by a toggle seconds before the import would sit there
     * offering to reverse it against a set that no longer exists — and its
     * `control` would still focus a row whose state the undo just contradicted.
     */
    replace(next) {
      setProgress(next);
      saveCrafted(next);
      setPendingUndo(null);
    },

    undo() {
      if (!pendingUndo) return;

      const crafted = new Set(progress.crafted);

      if (pendingUndo.marked) crafted.delete(pendingUndo.name);
      else crafted.add(pendingUndo.name);

      write(crafted);
      setPendingUndo(null);

      // Somewhere deliberate rather than nowhere. Without this, removing the
      // notice drops focus to `<body>` and a keyboard reader loses their place
      // in a 99-row table.
      pendingUndo.control?.focus();
    },
  };
}
