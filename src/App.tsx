import { useCallback, useMemo, useState } from "react";

import {
  CraftedConfirm,
  type PendingToggle,
} from "@/components/CraftedConfirm";
import { CraftedProgress } from "@/components/CraftedProgress";
import { ProgressTransfer } from "@/components/ProgressTransfer";
import { RemainingNeeds } from "@/components/RemainingNeeds";
import { RemainingPanel } from "@/components/RemainingPanel";
import { RunewordControls } from "@/components/RunewordControls";
import { RunewordTable } from "@/components/RunewordTable";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCraftedRunewords } from "@/crafted/useCraftedRunewords";
import { itemTypes, runes, runewords } from "@/data";
import { useLocale, useStrings } from "@/i18n";
import { remainingBases } from "@/remaining/bases";
import { remainingRunes } from "@/remaining/runes";
import { useViewSettings } from "@/view/useViewSettings";
import { visibleRunewords } from "@/view/visible";

// The page: the site header, overall progress, the remaining-needs panel, the
// browsing controls, the table, the footer, and the mark/unmark confirmation.
//
// Crafted state is owned here rather than in the table, because the progress
// bar and the confirmation are the table's siblings and read the same value.
// That is two levels of prop drilling for one `Set`, which is not a context and
// is certainly not a store library.
//
// The view settings are owned here for the same reason: the control bar and the
// table are siblings, one renders the settings and the other renders their
// result. Nothing between them holds state.
//
// The progress bar sits directly under the divider, and the controls between it
// and the table — which is where `IDEAS.md` puts search and filters in the Phase
// 1 layout. Items 1 and 2 of that layout, the patch line and the three links,
// are the header above, and slotting them in moved nothing below the divider.
//
// **The header and the footer are siblings of `<main>`, not grid items inside
// it**, because a `<header>` inside `main` exposes no `banner` landmark and a
// `<footer>` inside it exposes no `contentinfo`. The `<h1>` and the divider went
// with the header, so this grid now starts at the progress band. The cost is
// that the centring constraint appears on measure wrappers in each landmark; a
// wrapper `<div>` carrying the grid around all three would fix that by demoting
// the page's landmarks to children of a presentational box. Class lists that
// must agree is the smaller risk — the comments in `SiteHeader` and
// `SiteFooter` name this one, and this one names them.

export function App() {
  const strings = useStrings();
  const locale = useLocale();
  const { crafted, toggle, replace } = useCraftedRunewords();

  // The mark or unmark the player has asked for and not yet answered for. It
  // lives here rather than on the row for the same reason the crafted set does:
  // one dialog serves all 99 rows, and only one request can be open.
  const [pending, setPending] = useState<PendingToggle | null>(null);
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
  //
  // The locale is a dependency for the same kind of reason and it is
  // load-bearing: search matches the projected text and the two textual sort
  // keys order it, so a switch to Russian can change both which rows are
  // presented and the order they are in. Without it here the table would keep
  // English's answers while rendering Russian labels.
  const visible = useMemo(
    () => visibleRunewords(runewords, settings, query, crafted, locale),
    [settings, query, crafted, locale],
  );

  // The two shopping-list aggregates, keyed on the crafted set alone — the
  // search, the filters and the sort answer "what am I looking at" and these
  // answer "what does the whole Chronicle still cost", so typing in the search
  // field re-derives neither. A confirmed toggle re-derives both immediately;
  // each is one linear scan over 99 records.
  const stillNeededRunes = useMemo(
    () => remainingRunes(runewords, runes, crafted),
    [crafted],
  );

  const stillNeededBases = useMemo(
    () => remainingBases(runewords, itemTypes, crafted),
    [crafted],
  );

  // A row or its control asking to change state: the dialog opens and nothing
  // else happens. Stable, because every presented row receives it and a fresh
  // identity would re-render all 99 of them whenever anything else on the page
  // changed.
  //
  // The current state is read here rather than by the dialog, so the question
  // asked is the one the row was showing when it was clicked.
  const requestToggle = useCallback(
    (name: string, control: HTMLElement | null) => {
      setPending({ name, crafted: crafted.has(name), control });
    },
    [crafted],
  );

  // Row motion under a crafted-state sort used View Transitions, and was
  // withdrawn: scrolling mid-transition desyncs the snapshots from the table
  // and there is no clean fix. Instant reorder is enough.
  //
  // **Scroll stays put.** A confirmed toggle can move its row under a
  // crafted-state sort, or take it out of the list under a filter, and the
  // control focus returns to would otherwise drag the viewport along via
  // `scrollIntoView` for the focused node.
  const confirmToggle = useCallback(() => {
    if (pending === null) return;

    const scrollY = window.scrollY;
    toggle(pending.name);
    if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);

    setPending(null);
  }, [pending, toggle]);

  return (
    <>
      <SiteHeader />

      {/* Wider than the 4xl it started at, so the search field and both filter
          groups sit on one line at desktop width — six slot options do not fit in
          896px beside a search field, and a control bar that wraps at every width
          reads as three separate bars.

          The width and gutter classes are repeated on the measure wrappers inside
          the `<header>` and `<footer>` and have to stay in step. */}
      <main className="mx-auto grid min-h-dvh max-w-6xl content-start gap-6 p-6">
        {/* Nothing about the visible count reaches this. Its maximum is the
            dataset's length, read there rather than passed in — written that way
            by `crafted-tracking` specifically so that a filter could not move it,
            and this is the change it was defending against. */}
        <CraftedProgress crafted={crafted.size} />

        {/* The shopping list, between progress and the controls — item 4 of the
            Phase 1 layout. In normal flow, deliberately: the two sticky bands
            above are the page's constant answers, and reference material closed
            by default has no claim on permanent viewport height, so this scrolls
            away and takes no part in `--progress-band-height`.

            **One panel, where this was two.** Two identical bands spent 160px
            above the table to say two titles; the runes and the bases are two
            sections of one panel now, side by side from `md`. Both aggregates
            still live here, beside the crafted set they are memoised on. */}
        <RemainingPanel title={strings.remaining.title}>
          <RemainingNeeds runes={stillNeededRunes} bases={stillNeededBases} />
        </RemainingPanel>

        <RunewordControls
          query={query}
          craftedFilter={settings.craftedFilter}
          slotFilter={settings.slotFilter}
          visibleCount={visible.length}
          narrowed={narrowed}
          // Built here rather than inside the control bar, for the reason the
          // confirmation is built here: this is where the crafted set lives,
          // and the bar is about the view. It arrives as a slot so that the
          // component deciding *where* the two buttons sit is not also the one
          // that knows what they do — the whole crafted set goes to the export,
          // never the narrowed one.
          transfer={<ProgressTransfer crafted={crafted} onReplace={replace} />}
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
          onToggle={requestToggle}
        />

        <CraftedConfirm
          pending={pending}
          onConfirm={confirmToggle}
          onCancel={() => setPending(null)}
        />
      </main>

      <SiteFooter />
      <ScrollToTop />
    </>
  );
}
