import { useState } from "react";

import { RunewordDialog } from "@/components/RunewordDialog";
import { RunewordRow } from "@/components/RunewordRow";
import type { Runeword } from "@/data";
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
 */
export function RunewordTable({ crafted, onToggle }: RunewordTableProps) {
  const strings = useStrings();
  const [selected, setSelected] = useState<Runeword | null>(null);

  return (
    <>
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
            <th scope="col" className="p-2 text-right font-normal">
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
              onSelect={setSelected}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>

      <RunewordDialog runeword={selected} onClose={() => setSelected(null)} />
    </>
  );
}
