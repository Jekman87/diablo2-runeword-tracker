import { RemainingBases } from "@/components/RemainingBases";
import { RemainingRunes } from "@/components/RemainingRunes";
import { useStrings } from "@/i18n";
import type { RemainingBase } from "@/remaining/bases";
import type { RemainingRune } from "@/remaining/runes";

export interface RemainingNeedsProps {
  /** The rune aggregation's result, in canonical — and so tier — order. */
  runes: readonly RemainingRune[];
  /** The base aggregation's result, in category-then-sockets order. */
  bases: readonly RemainingBase[];
}

/**
 * What the rest of the Chronicle still costs: the runes still needed and the
 * socketed bases still needed, as two sections of one panel.
 *
 * One panel where there were two, and the reason is the closed state. Two
 * identical 44px bands with a 24px gap between them spent 160px above the table
 * to offer one press each, and a closed band carries no information beyond its own
 * title — on a 390px viewport that pushed the first runeword row to y=722 of a
 * 900px screen. The two lists also answer one question from two sides and are
 * consulted together, which is what `remaining-needs` already treats them as.
 *
 * **Two columns from `md`, stacked below it.** Open and stacked, a roughly 25-row
 * bases list sits under a three-band rune list and the panel runs to about 830px;
 * side by side it is as tall as the taller half. Below `md` they stack, because a
 * rune entry is a 40px icon with its name and count beside it and two columns of
 * those do not fit in 342px.
 *
 * Runes first, in the order these two have always been in: a runeword is runes in
 * a base, and the runes are what the reader collects.
 *
 * The headings are `h3`, one level below the panel's own `h2` in `RemainingPanel`'s
 * summary — which is why the tier labels inside the runes list are `h4`. A heading
 * order that skips or repeats a level is a defect for exactly the reader who
 * navigates by headings, and it is invisible to everyone else, so the test asserts
 * it rather than the review.
 *
 * This takes both results rather than deriving either. The memos stay in `App.tsx`
 * beside the crafted set they depend on, and this file is presentation.
 */
export function RemainingNeeds({ runes, bases }: RemainingNeedsProps) {
  const strings = useStrings();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section>
        <h3 className="mb-2 text-xl">{strings.remaining.runesSection}</h3>
        <RemainingRunes runes={runes} />
      </section>

      <section>
        <h3 className="mb-2 text-xl">{strings.remaining.basesSection}</h3>
        <RemainingBases bases={bases} />
      </section>
    </div>
  );
}
