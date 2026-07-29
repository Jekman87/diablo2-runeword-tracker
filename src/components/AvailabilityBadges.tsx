import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";
import { patchColour } from "@/runewords/patch-colour";

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
          // The one badge whose colour is not fixed by its kind. Which era it
          // came from is the thing worth reading at a glance, and the mapping
          // that decides it is `patch-colour.ts` rather than a variant here,
          // because the dataset types this field as an open string.
          colour={patchColour(runeword.patch)}
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
  /**
   * A background class the kind does not fix, for the patch badge alone. Empty
   * where the patch has no colour decided, which leaves the badge plain.
   */
  colour?: string;
}

/**
 * `role="img"` with `aria-label` rather than a bare `<span>`: it is what makes
 * the full meaning the element's accessible name instead of the letter drawn
 * inside it, and it stops a screen reader announcing `L` on its own.
 *
 * The accessible name and the `title` are unchanged by the colour-coding, which
 * is the point of it being colour-coding: the era is an additional channel laid
 * over a meaning that is already stated in words, so it is never the only way to
 * read the badge. A reader who cannot distinguish `#513B2C` from `#7B3FE4` — or
 * cannot see either — loses nothing, and the detail view restates all three
 * fields in full sentences besides.
 */
function Badge({ kind, marker, meaning, colour }: BadgeProps) {
  return (
    <span
      className={twMerge(badge({ kind }), colour)}
      role="img"
      aria-label={meaning}
      title={meaning}
    >
      {marker}
    </span>
  );
}

// `cva` rather than a conditional class string, per the code rules — three
// variants of one shape is exactly what it is for. Not extended to the patch
// colours: those are keyed by a dataset value rather than by a kind, and the
// dataset types that value as an open string, so they live in
// `patch-colour.ts` and arrive as a class this merges over the variant.
//
// Geometry from the reference, which an audit found we differed from in six
// ways. Patch and note take `2px 4px` on a 4px radius; the ladder marker takes
// `1px 5px` and is round, which it always should have been — the round shape was
// never a deliberate departure, it was simply never implemented. All three are
// 12px, which they already were. `5px` is written as a length because Tailwind's
// scale steps from 4px to 6px and the reference's value is between them; a
// colour would not be allowed this and is not written anywhere here.
//
// Every colour is a theme token. The patch badge's own `bg-patch` is gone,
// replaced by the four era tokens; `Note!` stops borrowing `--color-danger` for
// a red the reference does not use, and takes `--color-note`, which is the one
// badge this change makes *more* legible — 4.44:1 today against 10.3:1 for
// white on the darker red.
const badge = cva("inline-block align-middle text-xs leading-normal", {
  variants: {
    kind: {
      patch: "rounded px-1 py-0.5 text-patch-label",
      ladder: "rounded-full px-[5px] py-px bg-ladder text-ladder-label",
      note: "rounded px-1 py-0.5 bg-note text-note-label",
    },
  },
});
