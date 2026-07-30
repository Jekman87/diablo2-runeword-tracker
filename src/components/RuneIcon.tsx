import clsx from "clsx";

import { useLocale } from "@/i18n";
import { displayRune } from "@/runewords/display";
import { runeCell } from "@/theme/rune-sprite";

export interface RuneIconProps {
  /**
   * A rune's canonical English name — `El` through `Zod`. Stays canonical: it
   * is the sprite key, and the accessible label is projected from it.
   */
  name: string;
  className?: string;
  /**
   * Renders the icon as decoration, for a use site that already shows the
   * rune's name as text beside it. Announcing both would say the name twice.
   */
  decorative?: boolean;
}

/**
 * One rune's icon, drawn from the shared sprite.
 *
 * The component emits only the cell coordinates; every dimension and offset is
 * computed by the `rune-icon` utility in `src/index.css` from a single
 * `--rune-size`. Passing integers rather than pixel offsets is what lets a
 * caller resize the icon by setting that one variable, with no offset restated
 * here.
 *
 * **The sprite key and the accessible label part company here, and the split is
 * the point.** `runeCell` keys on the canonical name, because the sprite's grid
 * is indexed by the canonical rune order and a label can never be allowed to
 * move a sprite. The accessible label is the *projected* name — a label read
 * aloud is presentation, and a Russian page announcing `Ber` where it draws
 * `Бер` would be the one place the locale did not reach. Neither goes through
 * the strings layer: both come from the dataset.
 *
 * Labelled by default and decorative on request. The label was right while the
 * icon was the only thing carrying the rune's identity; a use site that renders
 * the name as text beside it would have a screen reader announce every rune
 * twice — 686 announcements for a table of 343 runes — so those pass
 * `decorative` and let the visible text do the work.
 */
export function RuneIcon({ name, className, decorative }: RuneIconProps) {
  const locale = useLocale();
  const { col, row } = runeCell(name);

  return (
    <span
      className={clsx("rune-icon", className)}
      // Spread rather than four conditional attributes, so a decorative icon
      // carries no `role` at all instead of a role with an empty label.
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": displayRune(name, locale) })}
      style={{ "--rune-col": col, "--rune-row": row } as React.CSSProperties}
    />
  );
}
