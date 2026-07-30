// What the site header states about itself, and where its links go. Four
// constants rather than four literals in a component, and none of them copy: a
// URL is not translated, and the patch number is the same word in every locale.
//
// The patch value is deliberately not a dataset field. The vendored source
// carries per-runeword `version` values but nothing site-level (see
// `docs/DATA-SOURCES.md`), so a generated field would have no source behind it —
// which is the defect the dataset rules exist to prevent. It was read off the
// reference site's own header on 2026-07-28, and `docs/REFERENCE.md` records
// where.

/**
 * The game patch the tracked runeword list reflects.
 *
 * Moves together with `UPDATE_NOTES_URL` below — they are on adjacent lines for
 * that reason. When the game patches, both change or neither does: a patch line
 * pointing at last patch's notes is worse than either alone.
 */
export const GAME_PATCH = "3.1.1";

/**
 * The official patch notes for `GAME_PATCH`, the href the reference site's own
 * Update Notes link carries. Re-read it there if this ever goes dead; the
 * failure is a cosmetic dead link, not wrong data.
 *
 * Reached from the patch number in the header's own patch line rather than from a
 * separate link labelled "Update Notes", which is where the reference puts it: the
 * sentence already names the patch, so the name of the patch is the thing to
 * press.
 */
export const UPDATE_NOTES_URL =
  "https://news.blizzard.com/en-us/article/24244884/reign-of-the-warlock-3-1-1-patch-notes";

/**
 * Where to report that the list is wrong. GitHub Discussions is off by default
 * on a new repository and was enabled before this link shipped, so it resolves
 * to a page rather than a 404.
 *
 * The only URL the header holds besides the patch notes. Help used to be a third
 * — the repository README — and is now an in-page disclosure instead: a reader
 * asking how the page works is not asking to be sent to a repository written for
 * whoever maintains it.
 */
export const FEEDBACK_URL =
  "https://github.com/Jekman87/diablo2-runeword-tracker/discussions";
