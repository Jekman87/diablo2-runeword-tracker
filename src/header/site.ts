// What the site states about itself, and where its links go. Constants rather
// than literals in a component, and none of them copy: a URL is not translated,
// a patch number is the same word in every locale, and a receive address is the
// same string whichever language named the coin beside it.
//
// The patch value is deliberately not a dataset field. The vendored source
// carries per-runeword `version` values but nothing site-level (see
// `docs/DATA-SOURCES.md`), so a generated field would have no source behind it —
// which is the defect the dataset rules exist to prevent. It was read off the
// reference site's own header on 2026-07-28, and `docs/REFERENCE.md` records
// where.
//
// The file used to be named for the header alone. The footer and the donation
// control share the same kind of value — site-level, language-invariant — so
// they live here rather than inventing a second constants module for the same
// role. The directory name still says `header`; renaming the folder for one
// more consumer is not worth the import churn.

/**
 * The site's own name, as it appears in the copyright line.
 *
 * Same string in every locale: it is a proper name, not a translation of the
 * `<h1>`. The display-copy layer wraps it; it does not invent it.
 */
export const SITE_NAME = "Diablo II Runeword Tracker";

/**
 * Where the site lives, as a crawler must see it: absolute, with the GitHub
 * Pages project sub-path, and with the trailing slash the canonical form has.
 *
 * Nothing in the running application reads it — the page is already at this
 * address by the time any of it executes. It is here because three static files
 * state the same URL and none of them can import a constant: the
 * `<link rel="canonical">` in `index.html`, the `<loc>` in
 * `public/sitemap.xml`, and the `Sitemap:` line in `public/robots.txt`. This is
 * the copy they are checked against, by `scripts/crawl-files.test.ts`, so a URL
 * corrected in one place cannot quietly stay wrong in the other three.
 *
 * It matches Vite's `base` by construction. Changing one without the other
 * deploys a canonical URL that points at a 404.
 */
export const SITE_URL = "https://jekman87.github.io/diablo2-runeword-tracker/";

/**
 * The Russian entry point — the second static document, same bundle, Russian
 * metadata and default locale. Derived rather than written out so the two can
 * never disagree about the host or the sub-path. Both entries appear in the
 * sitemap and name each other through `hreflang`; the crawl-files test holds
 * every copy of both together.
 */
export const SITE_URL_RU = `${SITE_URL}ru/`;

/**
 * The social card `og:image` both documents point at: a 1200×630 PNG committed
 * to `public/`, so the URL is stable and unhashed — a crawler reads it out of
 * static HTML that Vite does not rewrite, which is why the file cannot live in
 * `src/` the way the favicon does.
 */
export const OG_IMAGE_URL = `${SITE_URL}og-image.png`;

/**
 * The game patch the tracked runeword list reflects.
 *
 * Moves together with `UPDATE_NOTES_URL` below — they are on adjacent lines for
 * that reason. When the game patches, both change or neither does: a patch line
 * pointing at last patch's notes is worse than either alone.
 *
 * The first value here was `3.1.1`, and it was never right: it was read off the
 * reference site's own header on 2026-07-28, and the reference was two releases
 * behind — 3.1.2 had shipped in April and 3.2 with Season 14 in May. Reading a
 * version off a third party states what that party believes, which is a
 * different fact from the one this constant claims. Read it from Blizzard.
 */
export const GAME_PATCH = "3.3";

/**
 * The official patch notes for `GAME_PATCH`. Re-read it at Blizzard's news site
 * if this ever goes dead; the failure is a cosmetic dead link, not wrong data.
 *
 * For 3.3 the Season 15 announcement *is* the patch notes — Blizzard published
 * no separate "3.3 Patch Notes" article, and the item, terror-zone and bug-fix
 * lists are in that one. So this href is a season announcement where its
 * predecessors were patch-note pages; that is the source being faithful to what
 * Blizzard published, not a shortcut.
 *
 * Reached from the patch number in the header's own patch line rather than from a
 * separate link labelled "Update Notes", which is where the reference puts it: the
 * sentence already names the patch, so the name of the patch is the thing to
 * press.
 */
export const UPDATE_NOTES_URL =
  "https://news.blizzard.com/en-us/article/24296140/diablo-ii-resurrected-ladder-season-15-coming-soon";

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

/**
 * USDT (Jetton) receive address on The Open Network.
 *
 * **USDT on TON**, chosen over USDT-TRC20 for fees and over on-chain BTC, where
 * the fee can exceed the donation. Stated as coin + network beside the address
 * in the footer, because an address alone is ambiguous between chains and a
 * sender who picks the wrong one loses the money.
 *
 * A receive address only — public and permanent by nature. No key or seed
 * belongs in this repository. Verified against the owner's wallet by shape
 * (user-friendly non-bounceable `UQ…`, 48 characters, base64url alphabet) on
 * 2026-07-31; a wrong character sends money nowhere.
 */
export const DONATION_ADDRESS =
  "UQBal7YRJ8IkVxiFppY3O2_YvnYTnSAyqo88R8pmV6JWFIng";

/** The coin the donation address receives. Displayed beside the address. */
export const DONATION_COIN = "USDT";

/** The network the donation address belongs to. Displayed beside the address. */
export const DONATION_NETWORK = "TON";
