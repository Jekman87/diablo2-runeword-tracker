import clsx from "clsx";

import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { RuneIcon } from "@/components/RuneIcon";
import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";
import { itemTypesLabel } from "@/runewords/format";

export interface RunewordRowProps {
  runeword: Runeword;
  /** Opens the detail view. The table owns the one dialog every row shares. */
  onSelect: (runeword: Runeword) => void;
}

/**
 * One runeword's row: its name, its runes, the bases it can be socketed into
 * and the level it requires. Read-only — crafted state is `crafted-tracking`'s
 * column, not this one's.
 *
 * The name is a real `<button>` inside the cell rather than a click handler on
 * the cell, which is what makes it focusable and operable by Space and Enter.
 * It is also the seam `crafted-tracking` inherits: when the whole row becomes a
 * toggle, the name has to stay a nested control whose activation does not also
 * toggle the row.
 */
export function RunewordRow({ runeword, onSelect }: RunewordRowProps) {
  const strings = useStrings();

  return (
    <tr className="border-t border-row-line hover:bg-row-hover">
      <td className="p-2 align-top">
        <span className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onSelect(runeword)}
            className="cursor-pointer text-gold-mid hover:text-gold-light"
          >
            {runeword.name}
          </button>

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
            perceivable at any width. Against 99 rows of table markup that is
            not the expensive part of the page, and the alternative — a
            `useMediaQuery` hook driving a single copy — makes layout depend on
            script having run and introduces a flash where CSS has none. */}
        <RuneSequence runeword={runeword} className="mt-1 flex md:hidden" />
      </td>

      <td className="hidden p-2 align-top md:table-cell">
        <RuneSequence runeword={runeword} className="flex" />
      </td>

      <td className="p-2 align-top">{itemTypesLabel(runeword, strings)}</td>

      <td className="p-2 text-right align-top tabular-nums">
        {runeword.requiredLevel}
      </td>
    </tr>
  );
}

interface RuneSequenceProps {
  runeword: Runeword;
  className?: string;
}

/**
 * A runeword's runes, in dataset order and with repeats intact — `Infinity` is
 * four icons with `Ber` twice.
 *
 * `--rune-size` is set here and nowhere else in the row: the icons resolve
 * their own sprite cell from the shared derivation, and the row simply asks for
 * a smaller edge length than the detail view's default. No offset is restated
 * and there is no second icon implementation.
 *
 * The key carries the index because the sequence is not a set. Five runewords
 * repeat a rune, so a name alone would collide.
 */
function RuneSequence({ runeword, className }: RuneSequenceProps) {
  return (
    <span className={clsx("gap-0.5 [--rune-size:1.5rem]", className)}>
      {runeword.runes.map((rune, index) => (
        <RuneIcon key={`${rune}-${index}`} name={rune} />
      ))}
    </span>
  );
}
