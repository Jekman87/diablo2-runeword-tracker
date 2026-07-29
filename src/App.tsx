import { useMemo } from "react";

import { CraftedProgress } from "@/components/CraftedProgress";
import { RunewordControls } from "@/components/RunewordControls";
import { RunewordTable } from "@/components/RunewordTable";
import { UndoToast } from "@/components/UndoToast";
import { useCraftedRunewords } from "@/crafted/useCraftedRunewords";
import { runewords } from "@/data";
import { useStrings } from "@/i18n";
import { useViewSettings } from "@/view/useViewSettings";
import { visibleRunewords } from "@/view/visible";

// The page: a title, the divider, overall progress, the browsing controls, the
// table, and the undo notice.
//
// Crafted state is owned here rather than in the table, because the progress
// bar and the notice are the table's siblings and read the same value. That is
// two levels of prop drilling for one `Set`, which is not a context and is
// certainly not a store library.
//
// The view settings are owned here for the same reason: the control bar and the
// table are siblings, one renders the settings and the other renders their
// result. Nothing between them holds state.
//
// The progress bar sits directly under the divider, and the controls between it
// and the table — which is where `IDEAS.md` puts search and filters in the Phase
// 1 layout, below a patch line and the Help, Feedback and Update Notes links
// that no change in its list builds. `site-header` slots those in above this
// without moving anything.
//
// Still no header. Inventing one inside a browsing change is how a change stops
// being one feature; the gap is recorded in `IDEAS.md` for the proposal that
// picks it up.

export function App() {
  const strings = useStrings();
  const { crafted, pendingUndo, toggle, undo, dismissUndo } =
    useCraftedRunewords();
  const {
    settings,
    query,
    narrowed,
    setQuery,
    sortBy,
    setCraftedFilter,
    setSlotFilter,
    reset,
  } = useViewSettings();

  // One memo over the three things the narrowing depends on, and the dataset is
  // not one of them — it is a module constant that cannot change at runtime.
  //
  // **What the memo saves is not the rows.** The `runeword` objects inside the
  // array are the dataset's own and their identities never change, so
  // `RunewordRow`'s comparison holds whether this array is fresh or not. What it
  // saves is the filtering and the sort on every render that had nothing to do
  // with either, and it keeps the array's identity stable so the table's own
  // reconciliation is a no-op when this component re-renders for another reason.
  //
  // The crafted set is a dependency because both the crafted filter and the
  // crafted sort key read it. Toggling a runeword therefore re-derives the array,
  // which is correct: under either of those the row must move or leave.
  const visible = useMemo(
    () => visibleRunewords(runewords, settings, query, crafted),
    [settings, query, crafted],
  );

  return (
    /* Wider than the 4xl it started at, so the search field and both filter
       groups sit on one line at desktop width — six slot options do not fit in
       896px beside a search field, and a control bar that wraps at every width
       reads as three separate bars. */
    <main className="mx-auto grid min-h-dvh max-w-6xl content-start gap-6 p-6">
      <h1 className="text-3xl font-normal tracking-wide">
        {strings.app.title}
      </h1>

      <div className="gold-divider" />

      {/* Nothing about the visible count reaches this. Its maximum is the
          dataset's length, read there rather than passed in — written that way by
          `crafted-tracking` specifically so that a filter could not move it, and
          this is the change it was defending against. */}
      <CraftedProgress crafted={crafted.size} />

      <RunewordControls
        query={query}
        craftedFilter={settings.craftedFilter}
        slotFilter={settings.slotFilter}
        visibleCount={visible.length}
        narrowed={narrowed}
        onQueryChange={setQuery}
        onCraftedFilterChange={setCraftedFilter}
        onSlotFilterChange={setSlotFilter}
        onReset={reset}
      />

      <RunewordTable
        runewords={visible}
        crafted={crafted}
        sortKey={settings.sortKey}
        sortDirection={settings.sortDirection}
        onSort={sortBy}
        onToggle={toggle}
      />

      <UndoToast pending={pendingUndo} onUndo={undo} onDismiss={dismissUndo} />
    </main>
  );
}
