import clsx from "clsx";

import { runeCell } from "@/theme/rune-sprite";

export interface RuneIconProps {
  /** A rune's canonical English name — `El` through `Zod`. */
  name: string;
  className?: string;
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
 */
export function RuneIcon({ name, className }: RuneIconProps) {
  const { col, row } = runeCell(name);

  return (
    <span
      className={clsx("rune-icon", className)}
      role="img"
      aria-label={name}
      style={{ "--rune-col": col, "--rune-row": row } as React.CSSProperties}
    />
  );
}
