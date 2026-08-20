# Site constants

Language-invariant values the page states about itself — patch number, URLs,
site name, donation receive address — live in `src/header/site.ts`. They are
constants rather than copy: a URL is not translated, a patch number is the same
word in every locale, and a receive address is the same string whichever language
names the coin beside it.

## Address

The site is live at **<https://jekman87.github.io/diablo2-runeword-tracker/>**,
a GitHub Pages project page, with a second entry at
**<https://jekman87.github.io/diablo2-runeword-tracker/ru/>** — the same
application behind a Russian document head, built as a second Vite input from
`ru/index.html`. The URLs are `SITE_URL` and `SITE_URL_RU` in
`src/header/site.ts`, and the sub-path is the same one Vite's `base` carries —
change one and the other is wrong. The social card's address is `OG_IMAGE_URL`
beside them.

Nothing the browser runs reads the constants; the page is already at those
addresses. They exist because the static files state them and none of the files
can import a constant:

| File                 | Where it says the URL                        | Deployed at                              |
| -------------------- | -------------------------------------------- | ---------------------------------------- |
| `index.html`         | canonical, `og:url`, hreflang trio, og:image | `…/diablo2-runeword-tracker/`            |
| `ru/index.html`      | canonical, `og:url`, hreflang trio, og:image | `…/diablo2-runeword-tracker/ru/`         |
| `public/sitemap.xml` | two `<loc>` entries                          | `…/diablo2-runeword-tracker/sitemap.xml` |
| `public/robots.txt`  | the `Sitemap:` line                          | `…/diablo2-runeword-tracker/robots.txt`  |

`scripts/crawl-files.test.ts` compares every copy against the constants, so a
URL corrected in one place cannot stay wrong in the others, and CI asserts that
the build actually copied the `public/` files into `dist/`.

## The two languages

The Russian entry exists for search: the root shell is English and the locale
switch happens after React mounts, so before `/ru/` existed a query like
«трекер рунных слов» had no Russian document to match. Each entry declares its
own language (`lang="en"` / `lang="ru"`), carries its own title and
description, and both carry the same hreflang trio (`en`, `ru`, `x-default` →
root). **No redirects and no browser-language detection**: a first visit opens
in the entry's language, and a stored language preference outranks whichever
door it came through.

## The social card

`public/og-image.png` is the 1200×630 card `og:image` and `twitter:card` point
at — committed, unhashed, so the URL in static HTML stays true. It was rendered
once from the project's own themed assets (black ground, Bellefair, the rune
sprite's Jah Ith Ber, the ornamental divider) via a throwaway headless-Chrome
screenshot; regenerating it is a manual step, not part of the build.

## Search indexing

Each document head carries a title and one-sentence description in its own
language (repeated as Open Graph), the canonical link, an `og:locale` pair, and
one JSON-LD `WebApplication` block — inert data, not a script. "D2R" appears in
both titles because it is the term players search, and both descriptions name
the **Chronicle** («История (Хроники)» in Russian) because that is the in-game
log the tracker fills and the word a player looking for exactly this tool would
type.

**The head used to be the only indexable text, and is not any more.** Until the
entries were prerendered, the title, the description and a fallback paragraph
were the whole of what a non-rendering crawler could read — which is why the
description was written to carry the terms players search, and why "Chronicle"
was put there at all. Now `pnpm build` renders the list into the body of both
documents: every runeword, its runes, its bases, its level and its properties, in
that document's language, before any script runs. The description still should
not be stuffed with names — the names are in the list, and a description crowded
with them describes nothing. See **The render pass** below.

The `<noscript>` paragraph remains, saying what it should have said all along:
the list is readable without JavaScript, and marking, search, sorting and
progress transfer are what need it.

Meta tags and static files only — **no verification script and no tag manager**,
per the own-origin rule as it now stands: verification is available as inert
markup, and the third-party script this page loads is the page-view counter under
**Counting visits** below. That counter narrows the rule; it does not repeal it.
The one other script in each document is our own, inline, six lines, and
explained under the render pass.

**`robots.txt` on a project page is advisory.** Crawlers read
`https://jekman87.github.io/robots.txt`, which belongs to the user account, not
to this repository; ours is served one level down and states intent and names
the sitemap. The sitemap therefore has to be submitted directly.

**`sitemap.xml` holds two `<loc>` entries and nothing else** — no `<lastmod>`,
because a date written by hand stops being true on the next deploy, and no XML
comments, because the file's only reader is a third-party parser reporting a
pass/fail we cannot debug from here. Its two URLs are the two front doors to the
one page, pinned in `src/header/site.ts` and compared against this file by
`scripts/crawl-files.test.ts`. Keep the explanations here rather than in the
served bytes.

After a deploy that includes these files, the owner does this once, by hand:

1. Open [Google Search Console](https://search.google.com/search-console) and
   add a **URL-prefix** property for
   `https://jekman87.github.io/diablo2-runeword-tracker/` — not a Domain
   property, which needs DNS we do not own.
2. Verify it with the **HTML tag** method: Search Console gives a
   `<meta name="google-site-verification" …>` line; add it to `index.html`,
   merge, wait for the Pages deploy, then press Verify. The tag is inert markup,
   not a third-party script, so it is allowed here.
3. Under **Sitemaps**, submit `sitemap.xml`. The field is prefixed with the
   property URL, so it takes the bare `sitemap.xml` — **not** a leading slash
   and not the full URL. The submitted row must read
   `…/diablo2-runeword-tracker/sitemap.xml`; a row reading `/sitemap.xml`
   resolves to the account root, which is a 404 and reports «Couldn't fetch»
   forever. The sitemap lists both entries, so `/ru/` needs no second
   submission.
4. Optionally use **URL Inspection → Request indexing** on the page itself to
   skip the wait for the first crawl — worth doing once for `/ru/` too, since
   it is a new URL. Inspect the URL **with its trailing slash**: `/ru` is a 301
   to `/ru/`, and Search Console will not index a redirect, reporting it as a
   redirect error instead.

**Yandex Webmaster is claimed too, and it is not optional any more.** The `/ru/`
entry exists so a Russian query has a Russian document to match, and
Russian-language search mostly happens on Yandex — a Google-only property leaves
exactly the audience that entry was built for unmeasured. The steps, once, by
hand:

1. Open [Yandex Webmaster](https://webmaster.yandex.ru/) and add the site
   `https://jekman87.github.io/diablo2-runeword-tracker/`.
2. Verify by **meta tag**. Yandex gives a `<meta name="yandex-verification" …>`
   line; it is already in `index.html`, with its value pinned as
   `YANDEX_VERIFICATION` in `src/header/site.ts` and held against the document by
   `scripts/crawl-files.test.ts`. Press Verify after a deploy that carries it.
3. Under **Файлы Sitemap**, submit the same
   `…/diablo2-runeword-tracker/sitemap.xml`. It lists both entries, so `/ru/`
   needs no second submission — and no tag of its own, because verification is
   per site.

**Leave the tag in place.** Yandex re-checks it and drops the property when the
proof disappears, which fails silently: the site keeps working and the reports
quietly stop.

### After a deploy that touches the render pass or either entry document

Fetch both public URLs **without executing scripts** and confirm each carries its
own language's list — `curl` is enough, since the point is precisely what arrives
before any JavaScript runs:

```bash
curl -s https://jekman87.github.io/diablo2-runeword-tracker/ | grep -c "Body Armors"
curl -s https://jekman87.github.io/diablo2-runeword-tracker/ru/ | grep -c "Доспехи"
```

Both must print a non-zero count, and each word must appear only in its own
document — those two labels are the same item type in the two locale
projections, so they prove the render happened _and_ happened in the right
language.

`pnpm build` asserts the same thing about `dist/`, and one CI step asserts the
build step still exists. This is the third check because the first two cannot see
a deploy: the build can be right and the artifact still not be what a crawler
receives. And the failure is silent — the page works for every reader while
crawlers get an empty container — so the only way to notice is to look.

None of this is a CI gate. The build publishes the files; indexing is an account
action outside the repository.

### The sitemap that «Couldn't fetch» — verified sound, ignore it

Search Console reported «Не получено» against the sitemap for weeks. Verified
from outside on 2026-08-20, and **nothing in this repository is wrong**:

| Checked                                  | Result                                 |
| ---------------------------------------- | -------------------------------------- |
| `…/diablo2-runeword-tracker/sitemap.xml` | `200`, `Content-Type: application/xml` |
| Its contents                             | well-formed XML, both `<loc>` entries  |
| `https://jekman87.github.io/robots.txt`  | `404` — the host disallows nothing     |
| Both entry URLs in Search Console        | indexed                                |

So the status is a condition to ignore, not a defect to chase. A sitemap exists
to help a crawler find pages it would otherwise miss; this site has two and both
are already indexed. **Do not change these files in response to that status.**

Two things worth knowing if it comes up again. Junk rows accumulate easily,
because the submit field silently accepts a path outside the property — a row
reading `/sitemap.xml` resolves to the account root and fails forever. A row is
removed by clicking it, then the three-dot menu on its details page, then
**Remove sitemap**; Google's own documentation notes that removal clears the
report but does not make Google forget the sitemap or the URLs in it, so the rows
are cosmetic either way. And `/ru` without its trailing slash reports as a
redirect error, which is correct and harmless: it is a 301 to `/ru/`, and `/ru/`
is the indexed URL.

The one real fix is out of scope and parked: an account-root repository
(`jekman87.github.io`) would give the host a real `robots.txt`, a host-level
favicon for search results, and a Search Console property where `/sitemap.xml`
means what the field implies.

## The render pass

`pnpm build` renders the application to a string twice — English into
`index.html`, Russian into `ru/index.html` — and injects each into that
document's `#root`. **No server is involved:** `renderToString` runs on the build
machine, and GitHub Pages serves the same static files it always did. The name
is React's, inherited from the days when rendering to a string only happened in
one place.

`src/prerender/entry.tsx` is the half Vite compiles (TSX, `@/` imports);
`scripts/prerender.ts` is the half that reads and writes `dist/`, with its pure
string work and assertions in `scripts/prerender-document.ts` so they can be
unit-tested without a build. The language is stated by the build through
`seedLocale`, not detected: at build time there is no reader and no document, only
a decision about which file is being written.

**A reader who has progress never sees the rendered snapshot.** It shows the
default state — nothing crafted, the default sort — so showing it to someone with
forty runewords marked would be a page they never left, which is the one thing
the three storage-backed stores load eagerly to avoid. So the build also writes a
six-line inline script, with the stores' own key constants interpolated into it,
that hides `#root` before the first paint when this browser holds any of those
keys. `src/main.tsx` reveals it again inside `flushSync`, after React has
committed the real state and before a frame is painted — a `useEffect` there
would run _after_ paint and produce exactly the flash this prevents.

Measured at 50 KB/s with the cache disabled: a returning reader had 239 blank
frames and **zero** frames showing content that was not theirs; a fresh profile
had the full styled table painted from the first frame, while the bundle was
still downloading. Test it that way or not at all — on a warm cache the bundle
arrives before the gap it fills.

**Why the build fails rather than warns.** A missing prerender breaks nothing a
reader would notice: the page works, the bundle mounts, and the only casualty is
everything a crawler was given. So the build asserts its own output — each
document must carry its language's item-type label and not the other's — one CI
step asserts the build step still exists, and the deploy check above asserts what
the site actually serves. Three checks because each sees something the others
cannot.

## Counting visits

The page carries **Cloudflare Web Analytics** — one deferred beacon at the end of
the body of each entry document, in Cloudflare's own `type="module"` snippet
form. It sets no cookie, writes no persistent identifier, reads nothing the
reader has stored, and therefore needs no consent dialog; the page has none and
must not acquire one. If the provider ever requires a cookie or a dialog to keep
working, remove the counter rather than add the dialog.

The token lives beside the other constants as `ANALYTICS_TOKEN` in
`src/header/site.ts` and is stated in both documents, which cannot import it —
the same arrangement as the URLs, and `scripts/crawl-files.test.ts` holds every
copy against the constant and rejects a value that is not a real token. The
token is public by nature: it ships in the page, it names a dashboard rather than
opening one.

**One owner action, once, after the first deploy that carries the beacon:** open
the Web Analytics dashboard and confirm it is receiving anything at all — a load
from a browser with no blocker should appear within a few minutes, under
`/diablo2-runeword-tracker/`. Nothing in the repository can check this, and a
counter that silently reports nowhere looks exactly like a counter with no
visitors.

**What the numbers are worth.** Cloudflare keys on hostname, so the dashboard
shows `/diablo2-runeword-tracker/` and `/diablo2-runeword-tracker/ru/` as
separate paths — which is how the English/Russian split is read. Anything else
ever published under `jekman87.github.io` would appear in the same dashboard.
And ad blockers commonly block `cloudflareinsights.com`, while GitHub Pages
serves no logs to measure the shortfall against, so the figures are a trend and
an order of magnitude, never a census. A low number is not evidence of a traffic
collapse.

Chosen over Google Analytics 4, which would have brought cookies, a consent
banner for EU readers, ~50 KB of `gtag.js` and data landing in an advertising
ecosystem — a steep price for a visit count. GoatCounter's no-JavaScript pixel
was the closest fit to the stricter rule but records no referrer, and referrer is
half of what the counter is for, since Search Console already covers Google
search and nothing else.

## Donation

The footer offers **USDT on TON** (a Jetton receive address). That instrument was
chosen over USDT-TRC20 for fees and over on-chain BTC, where the fee can exceed
the donation. Card processors and hosted "buy me a coffee" services do not reach
the author in Belarus, so a crypto address is the route that works.

The address is a **receive address only** — public and permanent by nature. No
key or seed belongs in this repository. Coin and network are stated beside it in
the donation dialog, because an address alone is ambiguous between chains and a
sender who picks the wrong one loses the money.

No hosted donation widget, iframe or third-party image is used for this, and the
page-view counter is not a precedent for one. A counter reports a number; a
donation widget would load an identified third party's interface onto the one
surface where a reader is about to move money and has to be able to see who is
asking.
