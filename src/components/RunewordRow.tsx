import { useRef } from "react";

import clsx from "clsx";

import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { CraftedToggle } from "@/components/CraftedToggle";
import { ItemTypes } from "@/components/ItemTypes";
import { RuneSequence } from "@/components/RuneSequence";
import { RunewordDetails } from "@/components/RunewordDetails";
import type { Runeword } from "@/data";

export interface RunewordRowProps {
  runeword: Runeword;
  crafted: boolean;
  /**
   * Marks or unmarks the runeword. The control is handed over so that an undo
   * taken later can return focus to it.
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
 * landed on the name, or opening the detail view would silently mark the runeword
 * crafted.
 *
 * The row is a pointer target and **not** a second keyboard stop — no
 * `role="button"`, no `tabindex`. Ninety-nine focusable rows would double every
 * tab stop on the page and cost the table the row and column semantics it is
 * built on. The keyboard path is the socket, which is already in the tab order
 * and is already the right control.
 */
export function RunewordRow({ runeword, crafted, onToggle }: RunewordRowProps) {
  const control = useRef<HTMLButtonElement>(null);

  // Both paths hand over the same node, so a row click and a press on the
  // socket record the same place for focus to come back to.
  const toggle = () => onToggle(runeword.name, control.current);

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
          <RunewordDetails runeword={runeword} />

          <AvailabilityBadges runeword={runeword} />
        </span>

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
        <ItemTypes runeword={runeword} />
      </td>

      <td className="p-2 text-right align-top tabular-nums">
        {runeword.requiredLevel}
      </td>
    </tr>
  );
}

/**
 * Whether this click was already somebody else's, and so is not a toggle.
 *
 * Two exclusions, and the first is the one that matters. Without it, clicking a
 * runeword's name would open the detail view **and** mark it crafted — the
 * collision `runeword-table` recorded when it made the name a button. It is
 * written as a selector matched with `closest()` rather than as a comparison
 * against the two controls that exist today, so a control added inside a row
 * later is excluded without this function being revisited.
 *
 * The second: a drag that ends inside the row has selected text, and finishing
 * a selection is not a request to mark anything.
 */
function handledElsewhere(event: React.MouseEvent<HTMLTableRowElement>) {
  if (event.target instanceof Element && event.target.closest(INTERACTIVE)) {
    return true;
  }

  return window.getSelection()?.isCollapsed === false;
}

const INTERACTIVE = "button, a, input, select, textarea, [role='button']";
