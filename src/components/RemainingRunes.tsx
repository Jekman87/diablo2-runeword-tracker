import { RuneIcon } from "@/components/RuneIcon";
import { useStrings } from "@/i18n";
import type { RemainingRune } from "@/remaining/runes";

export interface RemainingRunesProps {
  /** The aggregation's result, already in canonical — and so tier — order. */
  runes: readonly RemainingRune[];
}

/**
 * The three tier bands, in tier order. Written out rather than derived from
 * the data, because the order of the bands is a decision about presentation
 * and an empty band's position could not be derived from a result it is
 * absent from.
 */
const TIERS = ["common", "semirare", "rare"] as const;

/**
 * Every rune still needed, banded by tier.
 *
 * A flat list of up to 33 entries reads as three meaningful groups this way,
 * and the bands cost no sorting: the aggregation's canonical order is also
 * tier order — the sprite's rows are the tiers — so each band is a filter
 * over a result already in its order.
 *
 * The icon passes `decorative` because the canonical name is text beside it;
 * announcing both would say every rune twice, which is the exact case that
 * mode was built for. The name does not pass through the strings layer and
 * the tier labels do, on the identifier-versus-copy rule the slot names
 * settled.
 *
 * A band whose runes are all satisfied disappears with them, and a panel with
 * nothing left says so rather than vanishing — the same reason progress
 * shows `0 of 99`.
 *
 * No `--rune-size` is set, for `RuneSequence`'s reason: the theme's default
 * is the sprite's native cell, and restating it here would put the one value
 * in two places.
 */
export function RemainingRunes({ runes }: RemainingRunesProps) {
  const strings = useStrings();

  if (runes.length === 0) {
    return <p>{strings.remaining.runesDone}</p>;
  }

  return (
    <div className="grid gap-4">
      {TIERS.map((tier) => {
        const band = runes.filter((rune) => rune.tier === tier);

        if (band.length === 0) return null;

        return (
          <section key={tier}>
            <h3 className="mb-2 text-lg">{strings.remaining.tier[tier]}</h3>

            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {band.map((rune) => (
                <li key={rune.name} className="flex items-center gap-1.5">
                  <RuneIcon name={rune.name} decorative />
                  <span className="text-gold-mid">{rune.name}</span>
                  <span>{strings.remaining.runeCount(rune.count)}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
