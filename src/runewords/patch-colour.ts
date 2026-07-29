/**
 * The colour classes a patch badge takes, by the patch it names.
 *
 * An explicit enumeration of full literal class strings, and every word of that
 * is load-bearing.
 *
 * **Literal, because Tailwind scans source text.** The class this would
 * otherwise be built from — `` `bg-patch-${patch.replace(".", "-")}` `` — never
 * appears anywhere as `bg-patch-3-0`, so the utility is never generated and the
 * badge renders with no background at all. That failure happens at build time,
 * only in the production stylesheet, and only for the patches nobody looked at,
 * which is the worst combination available. Written out, every class is text the
 * build can see.
 *
 * **Enumerated, because the set is a decision rather than a pattern.** `1.10`
 * and `1.11` deliberately resolve to the same class: the project treats them as
 * one classic era, which is a judgement no transformation of the string could
 * express.
 *
 * **Not `cva`.** Its variants would have to be keyed by these five literals
 * while the dataset types `patch` as `string | undefined`, so every call site
 * would need a narrowing cast to hand it a value. A record with a fallback says
 * "unknown values are expected here" outright, which is the truth about a field
 * whose next value is a patch Blizzard has not shipped yet.
 */
export function patchColour(patch: string): string {
  return PATCH_COLOURS[patch] ?? "";
}

/**
 * The five values the dataset holds, in four colours — 46 records at `1.10`,
 * seven each at `1.11`, `2.4`, `2.6` and `3.0`, and 25 carrying no patch at all.
 *
 * A patch not named here falls through to no colour class, on purpose: a `3.1`
 * badge should look visibly plain and obviously unfinished, so that the missing
 * entry reads as a missing decision rather than as a styling bug. Inheriting
 * whichever colour happened to be nearest would hide it.
 */
const PATCH_COLOURS: Record<string, string> = {
  "1.10": "bg-patch-classic",
  "1.11": "bg-patch-classic",
  "2.4": "bg-patch-2-4",
  "2.6": "bg-patch-2-6",
  "3.0": "bg-patch-3-0",
};
