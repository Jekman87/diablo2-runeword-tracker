import { useStrings } from "@/i18n";
import type { RemainingBase } from "@/remaining/bases";

export interface RemainingBasesProps {
  /** The aggregation's result, already in category-then-sockets order. */
  bases: readonly RemainingBase[];
}

/**
 * The socketed bases still needed, one row per (category, socket count), in
 * the order the aggregation hands them over.
 *
 * A flat list, deliberately: it is bounded well under the 99-row table this
 * page already asks the reader to scan, it sits behind a closed disclosure,
 * and per-category sub-headings inside a panel inside a page would be more
 * structure than the content earns. If real use shows otherwise, regrouping
 * is presentation only and touches nothing here but this file.
 *
 * The count's copy says what it counts — runewords the base would serve.
 * That is load-bearing rather than decorative: a runeword allowing three
 * categories is counted under all three, because they are alternatives the
 * player can farm toward, so the counts do not sum to the uncrafted total
 * and must not read as though they should.
 *
 * Category names are dataset identifiers and bypass the strings layer; the
 * socket and count sentences are copy and come through it.
 */
export function RemainingBases({ bases }: RemainingBasesProps) {
  const strings = useStrings();

  if (bases.length === 0) {
    return <p>{strings.remaining.basesDone}</p>;
  }

  return (
    <ul className="grid gap-1.5">
      {bases.map((base) => (
        <li
          // Unique by construction: the aggregation emits one row per
          // (category, sockets) pair.
          key={`${base.category} ${base.sockets}`}
          className="flex flex-wrap items-baseline gap-x-3"
        >
          <span className="text-gold-mid">{base.category}</span>
          <span>{strings.remaining.baseSockets(base.sockets)}</span>
          <span className="text-muted">
            {strings.remaining.baseCount(base.count)}
          </span>
        </li>
      ))}
    </ul>
  );
}
