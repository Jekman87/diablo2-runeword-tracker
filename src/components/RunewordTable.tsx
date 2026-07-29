import { useCallback, useRef, useState } from "react";

import type { OpenChangeReason } from "@floating-ui/react";

import { RunewordRow } from "@/components/RunewordRow";
import { useStrings } from "@/i18n";
import { orderedRunewords } from "@/runewords/order";

export interface RunewordTableProps {
  /** The marked runewords, by canonical name. */
  crafted: ReadonlySet<string>;
  onToggle: (name: string, control: HTMLElement | null) => void;
}

/**
 * All 99 runewords, in required-level order with the name breaking a tie.
 *
 * A real `<table>` rather than a grid of `<div>`s with ARIA roles. Ninety-nine
 * rows of five columns is tabular data, and this is where the semantics pay:
 * row-and-column navigation, header association, and `<th scope="col">`
 * elements that `search-sort-filter` can turn into sort controls without
 * inventing `aria-sort` on something that is not a column header.
 *
 * No pagination, no windowing, no truncation. Ninety-nine rows is not a
 * windowing problem, and windowing would cost the table semantics above.
 *
 * No sticky header either. It earns its keep once the header row is
 * interactive, so it belongs to the change that makes it interactive.
 *
 * The crafted set arrives as a prop and is not read from a hook here. It is
 * owned by `App`, because the progress bar and the undo notice are this table's
 * siblings and need the same value — two levels of prop drilling for one piece
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
export function RunewordTable({ crafted, onToggle }: RunewordTableProps) {
  const strings = useStrings();
  const [openDetails, setOpenDetails] = useState<string | null>(null);

  // What is open, mirrored into a ref so the handler below can read it
  // synchronously. Two requests can arrive in a single tick — the second panel
  // opening, and the first one's focus coming home — and state read from the
  // closure would still be showing the value from before the first of them.
  const open = useRef<string | null>(null);

  // The row whose panel was just replaced, and whose next focus request is
  // therefore its panel's farewell rather than a reader arriving.
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

  // Stable, and takes the name rather than closing over it, so the 99 rows share
  // one function instead of each being handed a freshly built one. That is what
  // lets `RunewordRow` be memoised, which is what keeps opening one panel from
  // re-rendering the 97 rows it has nothing to do with.
  const handleDetailsOpenChange = useCallback(
    (name: string, next: boolean, reason: OpenChangeReason | undefined) => {
      // Good for exactly one request, whether or not it turns out to be the one
      // it was set for — so a row cannot be left unable to open later.
      const farewell = farewellFrom.current;
      farewellFrom.current = null;

      if (next && reason === "focus" && farewell === name) return;

      if (next) {
        if (open.current !== null && open.current !== name) {
          farewellFrom.current = open.current;
        }

        open.current = name;
      } else if (open.current === name) {
        open.current = null;
      }

      setOpenDetails(open.current);
    },
    [],
  );

  return (
    <table className="w-full text-left">
      <caption className="sr-only">{strings.table.caption}</caption>

      <thead className="bg-blood text-gold-light">
        <tr>
          {/* A column proper, with a header of its own, rather than a control
                floated into the name cell. `IDEAS.md` settles that crafted
                state is sortable, and `search-sort-filter` needs somewhere to
                hang `aria-sort` that is really a column header. */}
          <th scope="col" className="p-2 font-normal">
            {strings.table.columnCrafted}
          </th>
          <th scope="col" className="p-2 font-normal">
            {strings.table.columnName}
          </th>
          {/* Collapses with the cells it heads. */}
          <th scope="col" className="hidden p-2 font-normal md:table-cell">
            {strings.table.columnRunes}
          </th>
          <th scope="col" className="p-2 font-normal">
            {strings.table.columnItemTypes}
          </th>
          {/* `whitespace-nowrap` rather than a width: "Required Level" broke
              across two lines and made the header row taller than any of the
              cells needed. Letting the text set the column's width keeps it one
              line in every locale, where a fixed width would be measured against
              English and then wrap again in Russian. */}
          <th
            scope="col"
            className="p-2 text-right font-normal whitespace-nowrap"
          >
            {strings.table.columnRequiredLevel}
          </th>
        </tr>
      </thead>

      <tbody>
        {orderedRunewords.map((runeword) => (
          <RunewordRow
            key={runeword.name}
            runeword={runeword}
            crafted={crafted.has(runeword.name)}
            detailsOpen={openDetails === runeword.name}
            onDetailsOpenChange={handleDetailsOpenChange}
            onToggle={onToggle}
          />
        ))}
      </tbody>
    </table>
  );
}
