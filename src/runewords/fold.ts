/**
 * The form both sides of a text comparison are reduced to: trimmed, case-folded,
 * with `ё` treated as `е`.
 *
 * **One fold, two callers, and that is the point.** Search matches what a player
 * types against what a row shows; import matches what a file lists against what
 * the dataset holds. Two implementations would agree on the day they were
 * written and drift on the day one of them learns a new tolerance — and the
 * failure that produces is the worst kind, because `ё` matching in the search
 * field and not in an import looks like the file is wrong.
 *
 * `toLowerCase()` and **never** `toLocaleLowerCase()`: the mapping must not
 * depend on the runtime's locale, and under `tr` the locale-aware form maps `I`
 * to `ı`, which would stop `Infinity` matching itself. Cyrillic case folds
 * correctly without a collator — `ЩИТЫ` and `щиты` fold to the same string — so
 * nothing about Russian text needs `Intl`. Ordering is the part that does, and
 * that is `sort.ts`'s.
 *
 * The `ё` rule is a deliberate inexactness. Russian typists routinely write `е`
 * for `ё`, and an exact-match miss on that distinction reads as a bug rather
 * than as precision. Applied to both sides, which is the only way the
 * interchange can be symmetric — text written `ё` has to find text written `е`
 * as readily as the reverse. It is scoped to matching; displayed text keeps its
 * own spelling.
 *
 * Trimming is here rather than at each call site so that a padded cell out of a
 * spreadsheet and a padded query are the same non-problem.
 */
export function foldLabel(text: string): string {
  return text.trim().toLowerCase().replaceAll("ё", "е");
}
