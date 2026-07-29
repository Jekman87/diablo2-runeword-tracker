import { useCallback, useRef, useState } from "react";

import { type SortKey, firstDirectionFor } from "@/runewords/sort";
import { loadViewSettings, saveViewSettings } from "@/view/storage";
import {
  type CraftedFilter,
  DEFAULT_VIEW_SETTINGS,
  type SlotFilter,
  type ViewSettings,
} from "@/view/types";

export interface ViewControls {
  /** The persisted half: the sorted column, its direction and the two filters. */
  settings: ViewSettings;
  /** The session half. Never stored, and empty on every arrival. */
  query: string;
  /**
   * Whether anything is currently hiding rows.
   *
   * The sort is not part of it: an ordering hides nothing, so a table sorted by
   * name with both filters open and an empty field has nothing to reset.
   */
  narrowed: boolean;
  setQuery: (query: string) => void;
  /** Sorts by a column, or reverses it when it is already the sorted one. */
  sortBy: (key: SortKey) => void;
  setCraftedFilter: (filter: CraftedFilter) => void;
  setSlotFilter: (filter: SlotFilter) => void;
  /** Clears the query and both filters, and leaves the sort alone. */
  reset: () => void;
}

/**
 * How the player is looking at the list: the sort, the two filters, the search
 * query, and the persistence behind the first three.
 *
 * Lives in `App`, beside `useCraftedRunewords`, because the control bar and the
 * table are siblings and read the same values. No context and no store library —
 * two levels of prop drilling, as the crafted set already is.
 *
 * **Loaded in a lazy `useState` initialiser rather than an effect**, so the very
 * first paint is already the restored view. An effect would render the full table
 * and then narrow it, which is a visible frame of a page the player did not leave
 * behind.
 *
 * **The query is separate state and always starts empty.** It is deliberately not
 * persisted: sort and filters are how a player has chosen to look at the list,
 * while a search string is a lookup in progress, and a page reloading into `zeal`
 * showing one row reads as broken rather than as a preference.
 *
 * **Every write happens in a setter and never in an effect.** An effect fires on
 * mount and would write the defaults over a value that failed to parse before the
 * player had touched anything — the same rule and the same reason as stored
 * progress.
 *
 * All five setters are stable across renders. That is not tidiness: the rows are
 * memoised, the visible array is derived from these settings, and a fresh callback
 * on every render would rebuild the table on every keystroke in the search field.
 */
export function useViewSettings(): ViewControls {
  const [settings, setSettings] = useState<ViewSettings>(loadViewSettings);
  const [query, setQuery] = useState("");

  // The settings mirrored into a ref, so the setters below can read the current
  // value without closing over it — which is what lets them be stable and still
  // compute the direction flip from what is on screen rather than from what was
  // there on the first render. The same shape the table uses for which panel is
  // open, and updated in the one place settings change.
  const current = useRef(settings);

  // One write path. Deliberately not inside the `useState` updater: saving is a
  // side effect, an updater may be invoked more than once for a single change,
  // and a write is a consequence of the player's action rather than of React
  // reconciling.
  const change = useCallback((next: Partial<ViewSettings>) => {
    const merged = { ...current.current, ...next };

    current.current = merged;
    setSettings(merged);

    // Written from the change the player made, and **never from an effect**.
    saveViewSettings(merged);
  }, []);

  const sortBy = useCallback(
    (key: SortKey) => {
      // Activating the sorted column reverses it; activating another adopts that
      // column's own first direction — ascending for four of the five, descending
      // for crafted state, so one press on it shows what is done. Two states and no
      // third: required level ascending *is* the default, so "unsorted" is not a
      // state to cycle back into.
      if (current.current.sortKey !== key) {
        change({ sortKey: key, sortDirection: firstDirectionFor(key) });

        return;
      }

      change({
        sortDirection:
          current.current.sortDirection === "ascending"
            ? "descending"
            : "ascending",
      });
    },
    [change],
  );

  const setCraftedFilter = useCallback(
    (craftedFilter: CraftedFilter) => change({ craftedFilter }),
    [change],
  );

  const setSlotFilter = useCallback(
    (slotFilter: SlotFilter) => change({ slotFilter }),
    [change],
  );

  // Resetting is about what is hidden, not about the order. A player who sorted
  // by name and then filtered to shields wants their 99 rows back in the order
  // they chose, not in the order the page opened with.
  const reset = useCallback(() => {
    setQuery("");
    change({
      craftedFilter: DEFAULT_VIEW_SETTINGS.craftedFilter,
      slotFilter: DEFAULT_VIEW_SETTINGS.slotFilter,
    });
  }, [change]);

  return {
    settings,
    query,
    setQuery,
    sortBy,
    setCraftedFilter,
    setSlotFilter,
    reset,

    narrowed:
      query.trim() !== "" ||
      settings.craftedFilter !== DEFAULT_VIEW_SETTINGS.craftedFilter ||
      settings.slotFilter !== DEFAULT_VIEW_SETTINGS.slotFilter,
  };
}
