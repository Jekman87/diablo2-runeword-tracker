import { cva } from "class-variance-authority";
import clsx from "clsx";

import { type Strings, useStrings } from "@/i18n";
import type { SortDirection, SortKey } from "@/runewords/sort";

export interface SortableHeaderProps {
  /** The key this column sorts on, handed back to the callback. */
  sortKey: SortKey;
  /** The column's own heading, from the copy layer. */
  label: string;
  /**
   * The heading a narrow viewport presents instead, where the full one does not
   * fit. From the copy layer too, and beside `label` rather than replacing it:
   * the wide layout still shows the full form and the accessible name is still
   * built from it at every width.
   *
   * Optional, because most headings fit and a short form nothing needs is a
   * second name for the same column.
   */
  shortLabel?: string;
  /**
   * The direction this column is sorted in, or `undefined` when it is not the
   * sorted one. One value rather than a boolean and a direction, so "sorted
   * ascending" and "not sorted" cannot both be true.
   */
  direction?: SortDirection;
  /** Stable and shared by all five headers. Takes the key rather than closing over it. */
  onSort: (key: SortKey) => void;
  /**
   * Which edge the heading sits against.
   *
   * A prop rather than `text-right` in `className`, because the control fills the
   * cell: a full-width flex button ignores its parent's `text-align`, so the
   * alignment has to reach the button rather than the `<th>`.
   */
  align?: "start" | "end";
  /** The cell's own classes — wrapping, the responsive collapse, its corner. */
  className?: string;
}

/**
 * One column header, and the control that sorts by it.
 *
 * **A real `<button>` inside the `<th scope="col">`**, not a click handler on the
 * cell. That is what makes it reachable and operable by keyboard, and it is the
 * hand-off `crafted-tracking` set up when it built the crafted column as a proper
 * column header specifically so `aria-sort` would have somewhere honest to live.
 *
 * **`aria-sort` goes on the sorted column only, and is absent rather than `"none"`
 * on the other four.** Assistive technology then reports one sorted column instead
 * of five columns with opinions. The attribute's own values are this project's
 * direction names, so it is the value rather than a mapping of it.
 *
 * The header holds no state. `App` owns the sort, this receives it, and one
 * callback goes back — activating the sorted column reverses it, activating another
 * adopts ascending, and there is no third state to cycle into.
 *
 * **The direction is carried three times over, and never by the glyph alone.**
 * `aria-sort` says it, the button's accessible name says it in words, and the arrow
 * draws it. That is the same rule the crafted socket follows: colour and shape are
 * the last carriers, not the only ones.
 *
 * The sorted column is marked by its band rather than by tinting the arrow.
 * `--color-blood-light` on `--color-blood` is a visible step between two adjacent
 * surfaces, where the same value as *text* on that band scores about 1.7:1 and
 * would be a glyph nobody can see — so the token renders the surface it is right
 * for and the arrow stays in the band's own gold.
 */
export function SortableHeader({
  sortKey,
  label,
  shortLabel,
  direction,
  onSort,
  align = "start",
  className,
}: SortableHeaderProps) {
  const strings = useStrings();

  return (
    <th
      scope="col"
      aria-sort={direction}
      className={clsx(
        headerCell({ sorted: direction !== undefined }),
        className,
      )}
    >
      {/* The padding is on the button and not on the cell, so the control *is* the
          cell: a press anywhere in the header sorts, rather than only a press on
          the few pixels the text occupies. Still a real button and not a handler on
          the `<th>` — which is what keeps it in the tab order and operable by Space
          and Enter. */}
      <button
        type="button"
        aria-label={accessibleName(strings, label, direction)}
        onClick={() => onSort(sortKey)}
        className={trigger({ align })}
      >
        {/* One heading where there is only one, and both forms where there are
            two — each `hidden` on the other side of the breakpoint, so the
            stylesheet makes the choice and exactly one of them is in the
            accessibility tree. The same mechanism the rune sequence collapses by,
            and for the same reason: a heading chosen in script depends on script
            having run and paints the wrong one first.

            **The breakpoint is `lg`, not `md`, and that is measured rather than
            symmetrical.** The point of the short form is the width at which the
            full one stops fitting, and that is not the width at which the layout
            changes: from `md` the table is `table-fixed`, so a heading too wide
            for its percentage cannot widen its column and paints over the
            neighbour instead. Measured in Russian, where the headings are longest:
            `Требуемый уровень` needs 164px and its 18% column gives it 127px at
            768 and 161px at 960 — it only fits from about 1000px, which is `lg`.
            English fits from `md`, and follows the same rule rather than a rule of
            its own; one breakpoint for a column is what keeps the two locales from
            being two layouts.

            The accessible name is built from the full heading either way. A
            screen reader hears "required level, sorted ascending" at every width
            rather than "ур., sorted ascending" on a phone. */}
        {shortLabel === undefined ? (
          label
        ) : (
          <>
            <span className="lg:hidden">{shortLabel}</span>
            <span className="hidden lg:block">{label}</span>
          </>
        )}

        {/* **Always rendered, glyph or no glyph, and that is the point.** Drawn only
            on the sorted column, the arrow made that column 12px wider than the other
            four — so sorting by `Required Level`, whose header is `whitespace-nowrap`
            and sets its own column's width, resized the column and shifted every row
            beside it. Reserving the space costs the same 12px in all five headers and
            nothing moves. It also costs nothing against what the page already
            renders, because required level ascending is the default sort and that
            column was already carrying the arrow on arrival.

            A non-breaking space rather than an empty span: the row is aligned on the
            baseline, and a box with no text in it has none to align to.

            Decoration by construction — the accessible name and `aria-sort` already
            carry the direction in words, so this is hidden rather than announced. */}
        {/* **Withdrawn below `md`, and not made conditional there.** Below the
            breakpoint the table has 390px to hold four columns and the arrow is
            the third carrier of something two others already carry: `aria-sort`
            names the sorted column and the accessible name states the direction
            in words. Withdrawing it by width keeps the reservation
            unconditional wherever it is drawn, which is the property the
            paragraph above is about — making it conditional on being the sorted
            column is what shifted every row beside it. */}
        <span
          aria-hidden="true"
          className="hidden w-3 shrink-0 text-center md:block"
        >
          {direction === undefined ? NO_INDICATOR : INDICATOR[direction]}
        </span>
      </button>
    </th>
  );
}

/**
 * What the button is called: the column, and what activating it will do.
 *
 * Three forms rather than one, because an unsorted column has nothing to report
 * and a sorted one has to report both its state and the effect of the next press.
 * The sentences live in the copy layer; only the choice between them is here.
 */
function accessibleName(
  strings: Strings,
  label: string,
  direction: SortDirection | undefined,
): string {
  if (direction === undefined) return strings.sort.by(label);

  return direction === "ascending"
    ? strings.sort.ascending(label)
    : strings.sort.descending(label);
}

/**
 * The header cell's two states, as a `cva` variant rather than a conditional
 * string.
 *
 * The sorted band is `--color-blood-light`, one of the two tokens `IDEAS.md`
 * recorded as declared with nothing rendering them. Rendering it is the fix
 * `d2-theme` asks for; a sixth colour family beside it would have been the defect.
 */
const headerCell = cva("p-0 font-normal", {
  variants: {
    sorted: {
      true: "bg-blood-light",
      false: "",
    },
  },
});

/**
 * The control that fills the cell.
 *
 * `w-full` plus the cell's padding, so the whole header is the hit target. `flex`
 * rather than `inline-flex` for the same reason — an inline box would only be as
 * wide as its text, which is the behaviour this replaces.
 *
 * The alignment is a variant rather than inherited `text-align`, because a
 * full-width flex container does not honour its parent's.
 */
const trigger = cva(
  "flex w-full cursor-pointer items-baseline gap-1 p-2 hover:text-gold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-light",
  {
    variants: {
      align: {
        start: "justify-start text-left",
        end: "justify-end text-right",
      },
    },
  },
);

/**
 * The arrow each direction draws.
 *
 * Text rather than an SVG or a background image: one glyph, inheriting the band's
 * colour and scaling with the text beside it.
 *
 * Arrows rather than triangles, and the reason is the font. `U+2191` and `U+2193`
 * are both named in the `unicode-range` of the Bellefair subset `src/index.css`
 * vendors, so they draw in the display face; `▲` and `▼` are outside it and would
 * fall through to the fallback serif for two characters in the middle of a word.
 */
const INDICATOR: Record<SortDirection, string> = {
  ascending: "↑",
  descending: "↓",
};

/**
 * What an unsorted column draws in the space the arrow reserves.
 *
 * A non-breaking space, and written as an escape rather than as the character
 * itself. The space is needed because the row is baseline-aligned and a box with no
 * text in it has no baseline to align to. The escape is needed because the
 * character, typed literally, is invisible in the source: a reader cannot tell it
 * from an ordinary space, and nothing stops a later edit or a formatter from
 * replacing it with one and quietly breaking the alignment.
 */
const NO_INDICATOR = "\u00A0";
