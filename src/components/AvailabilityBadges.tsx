import { cva } from "class-variance-authority";

import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";

export interface AvailabilityBadgesProps {
  runeword: Runeword;
}

/**
 * The markers beside a runeword's name: the patch that introduced it, a ladder
 * marker, and a note marker where a caveat exists.
 *
 * These three fields are decoration by requirement — availability changes
 * between ladder seasons, so a stale badge is a cosmetic inaccuracy where stale
 * logic would miscount progress. Nothing in the application may order, count or
 * branch on them, and this component is the first thing in the project that
 * *could* have. They are read here and in the detail view, which restates the
 * same three facts in full words, and nowhere else.
 *
 * A runeword carrying none of the three renders nothing at all — no placeholder
 * and no empty slot, so the name of a runeword with no markers sits where the
 * name of one with three does.
 *
 * Nothing here is hover-only. Each badge draws a short marker, carries its full
 * meaning as its accessible name and repeats that meaning as a `title` for
 * pointer users — and the detail view restates all three in full words, which is
 * the path a touch user with no screen reader takes. The reference puts these
 * meanings in tooltips alone, which is unreachable on a phone.
 */
export function AvailabilityBadges({ runeword }: AvailabilityBadgesProps) {
  const strings = useStrings();

  return (
    <>
      {runeword.patch ? (
        <Badge
          kind="patch"
          marker={runeword.patch}
          meaning={strings.availability.patchMeaning(runeword.patch)}
        />
      ) : null}

      {runeword.ladderOnly ? (
        <Badge
          kind="ladder"
          marker={strings.availability.ladderMarker}
          meaning={strings.availability.ladderMeaning}
        />
      ) : null}

      {runeword.note ? (
        <Badge
          kind="note"
          marker={strings.availability.noteMarker}
          // The note itself, not a sentence about there being one. It is
          // dataset text rather than copy, so it does not go through the
          // strings layer — the same rule that makes a rune icon's label the
          // rune's own name.
          meaning={runeword.note}
        />
      ) : null}
    </>
  );
}

interface BadgeProps {
  kind: "patch" | "ladder" | "note";
  /** What the badge draws — short enough to sit beside a name. */
  marker: string;
  /** What it means, in full. The accessible name and the pointer tooltip. */
  meaning: string;
}

/**
 * `role="img"` with `aria-label` rather than a bare `<span>`: it is what makes
 * the full meaning the element's accessible name instead of the letter drawn
 * inside it, and it stops a screen reader announcing `L` on its own.
 */
function Badge({ kind, marker, meaning }: BadgeProps) {
  return (
    <span
      className={badge({ kind })}
      role="img"
      aria-label={meaning}
      title={meaning}
    >
      {marker}
    </span>
  );
}

// `cva` rather than a conditional class string, per the code rules — three
// variants of one shape is exactly what it is for. Every colour is a theme
// token: `patch` and `ladder` were declared by `d2-theme` for these two badges,
// and the note marker borrows the danger red rather than adding a fifth token
// for a marker one runeword carries.
const badge = cva(
  "inline-block rounded px-1 align-middle text-xs leading-normal",
  {
    variants: {
      kind: {
        patch: "bg-patch text-gold-light",
        ladder: "bg-ladder text-ladder-label",
        note: "bg-danger text-title",
      },
    },
  },
);
