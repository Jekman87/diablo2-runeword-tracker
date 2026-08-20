import { useCallback, useRef, useState } from "react";

import type { OpenChangeReason } from "@floating-ui/react";

import { RunewordRow } from "@/components/RunewordRow";
import { SortableHeader } from "@/components/SortableHeader";
import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";
import type { SortDirection, SortKey } from "@/runewords/sort";

export interface RunewordTableProps {
  /**
   * The rows to present, in the order to present them.
   *
   * A prop rather than a module constant, because which runewords are presented
   * and in what order is now a question about the player's settings. `App` derives
   * the array; this renders whatever it is given, in full.
   */
  runewords: readonly Runeword[];
  /** The marked runewords, by canonical name. */
  crafted: ReadonlySet<string>;
  /** The sorted column, so exactly one header can say so. */
  sortKey: SortKey;
  sortDirection: SortDirection;
  /** Must be stable: all five headers share it, and the rows are memoised. */
  onSort: (key: SortKey) => void;
  onToggle: (name: string, control: HTMLElement | null) => void;
}

/**
 * The runeword table: whatever rows it is handed, in the order it is handed them.
 *
 * A real `<table>` rather than a grid of `<div>`s with ARIA roles. Ninety-nine
 * rows of five columns is tabular data, and this is where the semantics pay:
 * row-and-column navigation, header association, and `<th scope="col">`
 * elements that `search-sort-filter` can turn into sort controls without
 * inventing `aria-sort` on something that is not a column header.
 *
 * No pagination, no windowing, no truncation. Ninety-nine rows is not a
 * windowing problem, and windowing would cost the table semantics above. A row
 * withheld by a search query or a filter is a different thing entirely: it is a
 * narrowing the player asked for, reversible by the control that caused it,
 * and the table still renders in full whatever set it is given.
 *
 * The header is sticky now, which is the half `runeword-table` deferred to this
 * change: it declined one on the grounds that the row was inert, and a sort
 * control 7 000px above the row being read is not a control. The stacking against
 * the detail panel is settled in `src/index.css` beside the utility, because it is
 * one decision about two components and neither of them owns it.
 *
 * The crafted set arrives as a prop and is not read from a hook here. It is
 * owned by `App`, because the progress bar and the mark/unmark confirmation are
 * this table's siblings and need the same value — two levels of prop drilling for one piece
 * of state, which is not a context and is certainly not a store library.
 *
 * The one `<dialog>` every row used to share is gone — a panel that opens on
 * hover has to be positioned against the name the pointer is over, and `useHover`
 * binds to a single reference element, so each row owns its own floating context
 * and its own panel. Only the open one is ever rendered, which is what keeps that
 * from becoming 99 panels of markup.
 *
 * **Which** row's panel is open stays here, though, because "only one at a time"
 * is a fact about the whole table and no single row can enforce it. Ninety-nine
 * independent open flags let a panel pinned by a click sit underneath a second one
 * opened by hover, since nothing told the first that the second had appeared. One
 * value cannot express two open panels, so the overlap is gone by construction.
 */
export function RunewordTable({
  runewords,
  crafted,
  sortKey,
  sortDirection,
  onSort,
  onToggle,
}: RunewordTableProps) {
  const strings = useStrings();

  // Which panel is open, as a `kind:name` key — a row has two panels now, the
  // details on its name and the advice on its item-types cell, and "only one
  // at a time" is a property of the page that has to span both kinds. A pair
  // of values, one per kind, would let a pinned detail panel sit under a
  // hovered advice panel; one key cannot express two open panels.
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  // What is open, mirrored into a ref so the handler below can read it
  // synchronously. Two requests can arrive in a single tick — the second panel
  // opening, and the first one's focus coming home — and state read from the
  // closure would still be showing the value from before the first of them.
  const open = useRef<string | null>(null);

  // The panel that was just replaced, and whose next focus request is
  // therefore its farewell rather than a reader arriving.
  //
  // When a panel is replaced, `FloatingFocusManager` hands focus back to the name
  // that opened it — right in itself, since the element focus was inside is
  // disappearing — and `useFocus` cannot tell that focus from a reader tabbing in.
  // So the replaced panel reopened at once and won, and the panel actually asked
  // for lost. Watched in a browser: pin one name with Space, hover another, and
  // the pinned one stays.
  //
  // Arbitrated here rather than in the row, and that is not a matter of taste.
  // The row cannot be told in time: React unmounts the panel *before* it updates
  // the sibling name button's props, so a flag passed down arrives one commit too
  // late — the focus event has already been delivered under the old props. That
  // was tried, and the timeline showed the reopen landing between the two. The
  // table sees both requests, in order, in the same tick, and can simply decline
  // the second.
  const farewellFrom = useRef<string | null>(null);

  // Stable, and takes the key rather than closing over it, so the 99 rows share
  // one function instead of each being handed a freshly built one. That is what
  // lets `RunewordRow` be memoised, which is what keeps opening one panel from
  // re-rendering the 97 rows it has nothing to do with.
  const handlePanelOpenChange = useCallback(
    (key: string, next: boolean, reason: OpenChangeReason | undefined) => {
      // Good for exactly one request, whether or not it turns out to be the one
      // it was set for — so a row cannot be left unable to open later.
      const farewell = farewellFrom.current;
      farewellFrom.current = null;

      if (next && reason === "focus" && farewell === key) return;

      if (next) {
        if (open.current !== null && open.current !== key) {
          farewellFrom.current = open.current;
        }

        open.current = key;
      } else if (open.current === key) {
        open.current = null;
      }

      setOpenPanel(open.current);
    },
    [],
  );

  return (
    /* `table-fixed`, with the widths declared on the header cells below.

       Auto layout sizes a column by the widest thing in it, which means the columns
       are a function of whichever rows the filters happened to leave: narrow to the
       helm slot and `Base Items` shrinks, empty the table entirely and all five
       redistribute — measured going from `[101,227,334,276,164]` to
       `[183,227,163,235,296]`, so the crafted column nearly doubled because its 99
       checkboxes stopped being there to size it. Every one of those is the page
       moving under the reader for a reason that has nothing to do with what they
       asked for.

       Fixed layout takes the widths from the first row — the header row — and ignores
       the body, so the table looks the same with 99 rows, with eleven, and with the
       empty state. It is also what makes the sticky header line up with the rows
       beneath it at every filter.

       **From `md` up only, and that is not timidity.** Below the breakpoint the runes
       collapse into the name cell, so a row carries up to six 40px icons in a column
       that a percentage would hold to about 124px, and the `Required Level` heading
       alone wants more than its share of a 327px table. Measured at 390px: fixed
       widths clipped the `Crafted` heading by 37px and spilled name cells over their
       neighbours. Auto layout there does what it has always done — the table
       gets as wide as it needs and the page scrolls sideways, which `IDEAS.md` records
       as a pre-existing decision nobody owns. Making it worse to buy stability at a
       width where nothing was complaining is the wrong trade; the phone layout gets
       fixed by deciding what to do about the icons, not by five percentages. */
    <table className="w-full table-auto text-left md:table-fixed">
      <caption className="sr-only">{strings.table.caption}</caption>

      {/* The band is on the `<thead>` rather than the `<tr>`, because a sticky
          element with a transparent background reveals the rows travelling
          underneath it. */}
      <thead className="table-header-band bg-blood text-gold-light">
        <tr>
          {/* A column proper, with a header of its own, rather than a control
              floated into the name cell. `crafted-tracking` built it this way so
              that `aria-sort` would have a real column header to sit on, and this
              is the change that hangs it there. */}
          {/* `rounded-tl-xs` here and `rounded-tr-xs` on the last column match the
              band's own corners in `table-header-band`. It only shows when one of
              these two is the sorted column — its lighter background would
              otherwise paint a square corner over the rounded one.

              **Below `md` this column is withdrawn, and the cell stays.** The
              runes column above hides its `<th>` and its `<td>` together, which is
              what a column may do; this one cannot, because its cells still hold
              the only keyboard path to marking a runeword. So the header keeps its
              place in the table's column count — a header row and a body row that
              declare different numbers of cells misalign every column after the
              difference — and gives up its width and its control instead. The
              control goes because there is no crafted column to sort on screen;
              `src/index.css` explains what happens to the box in the rows. */}
          <SortableHeader
            sortKey="crafted"
            label={strings.table.columnCrafted}
            direction={directionOf("crafted", sortKey, sortDirection)}
            onSort={onSort}
            className="w-0 rounded-tl-xs md:w-[9%] [&>button]:hidden md:[&>button]:flex"
          />
          {/* The band's left corner belongs to whichever column is first on
              screen, so below `md` it is this one and from `md` up it is the
              crafted column above. Stated on both rather than moved, because the
              corner is a property of the band's edge and both cells can be the
              edge. */}
          <SortableHeader
            sortKey="name"
            label={strings.table.columnName}
            direction={directionOf("name", sortKey, sortDirection)}
            onSort={onSort}
            className="rounded-tl-xs md:w-[20%] md:rounded-tl-none"
          />
          {/* Collapses with the cells it heads. Sorts on socket count, which is
              this column's readable magnitude — sorting the sequence as text
              orders `Ber Mal Ber Ist` before `El El El`. */}
          <SortableHeader
            sortKey="runes"
            label={strings.table.columnRunes}
            direction={directionOf("runes", sortKey, sortDirection)}
            onSort={onSort}
            className="hidden md:table-cell md:w-[29%]"
          />
          <SortableHeader
            sortKey="itemTypes"
            label={strings.table.columnItemTypes}
            direction={directionOf("itemTypes", sortKey, sortDirection)}
            onSort={onSort}
            className="md:w-[24%]"
          />
          {/* `whitespace-nowrap` rather than a width: "Required Level" broke
              across two lines and made the header row taller than any of the
              cells needed. Letting the text set the column's width keeps it one
              line in every locale, where a fixed width would be measured against
              English and then wrap again in Russian. */}
          <SortableHeader
            sortKey="requiredLevel"
            label={strings.table.columnRequiredLevel}
            shortLabel={strings.table.columnRequiredLevelShort}
            direction={directionOf("requiredLevel", sortKey, sortDirection)}
            onSort={onSort}
            align="end"
            className="rounded-tr-xs whitespace-nowrap md:w-[18%]"
          />
        </tr>
      </thead>

      <tbody>
        {runewords.length === 0 ? (
          /* Inside the `<tbody>` as one full-width cell, not a paragraph after
             the table. The table keeps its shape, the column headers stay, and a
             reader navigating by row arrives at the explanation rather than at
             nothing. `colSpan` counts the declared columns, including the one
             hidden below `md`.

             It carries a runeword row's own borders, transparent, and that is not
             decoration. A data row has `border-l-4` for the crafted accent; a
             message row without it made the collapsed table 2px narrower on that
             edge, so every column shifted sideways the moment a filter emptied the
             table. Matching the border is what makes the two states line up. */
          <tr className="border-t border-l-4 border-t-row-line border-l-transparent">
            <td colSpan={5} className="p-6 text-center text-muted">
              {strings.controls.empty}
            </td>
          </tr>
        ) : (
          runewords.map((runeword) => (
            <RunewordRow
              key={runeword.name}
              runeword={runeword}
              crafted={crafted.has(runeword.name)}
              detailsOpen={openPanel === `details:${runeword.name}`}
              adviceOpen={openPanel === `advice:${runeword.name}`}
              onPanelOpenChange={handlePanelOpenChange}
              onToggle={onToggle}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

/**
 * The direction a column is sorted in, or `undefined` when it is not the sorted
 * one.
 *
 * The `undefined` is what keeps `aria-sort` off the other four headers: absent
 * rather than `"none"`, so assistive technology reports one sorted column instead
 * of five columns with opinions.
 */
function directionOf(
  column: SortKey,
  sortKey: SortKey,
  sortDirection: SortDirection,
): SortDirection | undefined {
  return column === sortKey ? sortDirection : undefined;
}
