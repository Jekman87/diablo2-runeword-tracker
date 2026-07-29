import clsx from "clsx";

import { runeCell } from "@/theme/rune-sprite";

export interface RuneIconProps {
  /** A rune's canonical English name — `El` through `Zod`. */
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
 * The name is a canonical identifier rather than display copy, so it is safe to
 * use as the accessible label without going through the i18n layer.
 *
 * Labelled by default and decorative on request. The label was right while the
 * icon was the only thing carrying the rune's identity; a use site that renders
 * the name as text beside it would have a screen reader announce every rune
 * twice — 686 announcements for a table of 343 runes — so those pass
 * `decorative` and let the visible text do the work. Either way the name comes
 * from the dataset and never through the strings layer.
 */
export function RuneIcon({ name, className, decorative }: RuneIconProps) {
  const { col, row } = runeCell(name);

  return (
    <span
      className={clsx("rune-icon", className)}
      // Spread rather than four conditional attributes, so a decorative icon
      // carries no `role` at all instead of a role with an empty label.
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": name })}
      style={{ "--rune-col": col, "--rune-row": row } as React.CSSProperties}
    />
  );
}
