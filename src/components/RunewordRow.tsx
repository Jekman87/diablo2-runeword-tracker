import { memo, useCallback, useRef } from "react";

import type { OpenChangeReason } from "@floating-ui/react";
import clsx from "clsx";

import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { CraftedToggle } from "@/components/CraftedToggle";
import { RuneSequence } from "@/components/RuneSequence";
import { RunewordAdvice } from "@/components/RunewordAdvice";
import { RunewordDetails } from "@/components/RunewordDetails";
import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";

export interface RunewordRowProps {
  runeword: Runeword;
  crafted: boolean;
  /** Whether this row's detail panel is the open one. Passed straight through. */
  detailsOpen: boolean;
  /** Whether this row's advice panel is the open one. Same ownership. */
  adviceOpen: boolean;
  /**
   * Reports a panel opening or closing under its `kind:name` key. One callback
   * for both kinds, because the table holds one open-panel value for both.
   */
  onPanelOpenChange: (
    key: string,
    open: boolean,
    reason: OpenChangeReason | undefined,
  ) => void;
  /**
   * Asks to mark or unmark the runeword, which opens the confirmation rather
   * than changing anything. The control is handed over so that the dialog can
   * return focus to it however it closes.
   */
  onToggle: (name: string, control: HTMLElement | null) => void;
}

/**
 * One runeword's row: whether it is crafted, its name, its runes, the bases it
 * can be socketed into and the level it requires.
 *
 * The name and its detail panel are `RunewordDetails`, which owns both because
 * the two share one floating context. The name is still a real `<button>`, which
 * is what makes it focusable and operable by Space and Enter. It is also the seam
 * this row inherited: the row-level handler below must not fire for a click that
 * landed on the name, or opening the detail view would also ask whether to mark
 * the runeword crafted.
 *
 * The row is a pointer target and **not** a second keyboard stop — no
 * `role="button"`, no `tabindex`. Ninety-nine focusable rows would double every
 * tab stop on the page and cost the table the row and column semantics it is
 * built on. The keyboard path is the socket, which is already in the tab order
 * and is already the right control.
 *
 * **Memoised, and it is load-bearing rather than a flourish.** Which panel is
 * open lives on the table, so every open and close re-renders it — and without
 * this, all 99 rows with it. Measured in Chromium: 37–50ms from click to painted
 * panel and long tasks up to 127ms, for a change that affects two rows. Every
 * prop here is stable across that re-render — `runeword` comes from the dataset,
 * `onDetailsOpenChange` is the table's one callback, `onToggle` belongs to `App`
 * which does not re-render — and `detailsOpen` differs for exactly the row
 * opening and the row closing. So the comparison is cheap and it skips 97 rows.
 *
 * This is why `RunewordDetails` takes a `boolean` rather than the open
 * runeword's name: the name would differ for all 99 and defeat the whole thing.
 */
export const RunewordRow = memo(function RunewordRow({
  runeword,
  crafted,
  detailsOpen,
  adviceOpen,
  onPanelOpenChange,
  onToggle,
}: RunewordRowProps) {
  const strings = useStrings();
  const control = useRef<HTMLButtonElement>(null);

  // Both paths hand over the same node, so a row click and a press on the
  // socket raise the same question and come back to the same control.
  const toggle = () => onToggle(runeword.name, control.current);

  // The two panels report under their `kind:name` keys. Stable as long as the
  // table's callback is, which the memo above this row depends on.
  const handleDetailsOpenChange = useCallback(
    (name: string, open: boolean, reason: OpenChangeReason | undefined) =>
      onPanelOpenChange(`details:${name}`, open, reason),
    [onPanelOpenChange],
  );
  const handleAdviceOpenChange = useCallback(
    (name: string, open: boolean, reason: OpenChangeReason | undefined) =>
      onPanelOpenChange(`advice:${name}`, open, reason),
    [onPanelOpenChange],
  );

  return (
    <tr
      onClick={(event) => {
        if (!handledElsewhere(event)) toggle();
      }}
      className={clsx(
        "border-t border-l-4 border-t-row-line",
        crafted
          ? // No hover change on a crafted row: the tint is already a
            // background, and swapping it out under the pointer would read as
            // the state flickering. The pointer cursor, the accent border and
            // the filled socket are the affordance.
            "border-l-crafted bg-crafted-row"
          : // Transparent rather than absent, so the row does not shift
            // sideways by four pixels the moment it is marked.
            "border-l-transparent hover:bg-row-hover",
      )}
    >
      <td className="p-2 align-top">
        <CraftedToggle
          ref={control}
          name={runeword.name}
          crafted={crafted}
          onToggle={toggle}
        />
      </td>

      <td className="p-2 align-top">
        <span className="flex flex-wrap items-center gap-1">
          <RunewordDetails
            runeword={runeword}
            open={detailsOpen}
            onOpenChange={handleDetailsOpenChange}
          />

          <AvailabilityBadges runeword={runeword} />
        </span>

        {/* The usefulness line, under the name and visibly subordinate to it —
            the words from the copy layer, the value from the dataset. No
            element at all where the record carries none, so an unlabelled row
            does not gain an empty line. */}
        {runeword.usefulness === undefined ? null : (
          <span className="block text-[12px] text-muted">
            {strings.advice.usefulness[runeword.usefulness]}
          </span>
        )}

        {/* The rune sequence, a second time.

            CSS cannot move content between table cells, so a runes column that
            collapses into the name cell has to exist in both places with one of
            them hidden. This is the copy for narrow viewports; the `<td>` below
            is the copy for wide ones, and each is `hidden` on the other side of
            `md`.

            The cost is up to 686 icon spans in the document instead of 343,
            half of them `display: none` — which is also what keeps the inactive
            copy out of the accessibility tree, so exactly one sequence is
            perceivable at any width. It costs more than it did: each copy now
            carries a label as well as an icon, so the rune markup roughly
            doubles again. Against 99 rows of table markup that is still not the
            expensive part of the page, and the alternative — a `useMediaQuery`
            hook driving a single copy — makes layout depend on script having run
            and introduces a flash where CSS has none. */}
        <RuneSequence runeword={runeword} className="mt-1 flex md:hidden" />
      </td>

      <td className="hidden p-2 align-top md:table-cell">
        <RuneSequence runeword={runeword} className="flex" />
      </td>

      <td className="p-2 align-top">
        <RunewordAdvice
          runeword={runeword}
          open={adviceOpen}
          onOpenChange={handleAdviceOpenChange}
        />
      </td>

      <td className="p-2 text-right align-top tabular-nums">
        {runeword.requiredLevel}
      </td>
    </tr>
  );
});

/**
 * Whether this click was already somebody else's, and so is not a toggle.
 *
 * Three exclusions. The first is containment, and it exists because of portals:
 * the row's floating panels render at the end of the document through
 * `FloatingPortal`, but a React portal's events still bubble through the
 * *component* tree — so a click on plain text inside an open panel arrives
 * here, with a target the row does not contain in the DOM. That click belongs
 * to the panel, whatever the reader was doing in it (following a link,
 * selecting a base name to copy), and must not raise the crafted confirmation
 * underneath. Containment rather than naming the panels, so a panel added
 * later is excluded without this function being revisited.
 *
 * The second matters inside the row itself. Without it, clicking a runeword's
 * name would open the detail view **and** raise the crafted confirmation over
 * it — the collision `runeword-table` recorded when it made the name a button.
 * It is written as a selector matched with `closest()` rather than as a
 * comparison against the controls that exist today, for the same reason as
 * above.
 *
 * The third: a drag that ends inside the row has selected text, and finishing
 * a selection is not a request to mark anything.
 */
function handledElsewhere(event: React.MouseEvent<HTMLTableRowElement>) {
  if (event.target instanceof Element) {
    if (!event.currentTarget.contains(event.target)) return true;

    if (event.target.closest(INTERACTIVE)) return true;
  }

  return window.getSelection()?.isCollapsed === false;
}

const INTERACTIVE = "button, a, input, select, textarea, [role='button']";
