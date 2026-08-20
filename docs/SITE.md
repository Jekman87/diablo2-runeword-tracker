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
one JSON-LD `WebApplication` block — inert data, not a script.

"D2R" appears in
both titles because it is the term players search, and both descriptions name
the **Chronicle** («История (Хроники)» in Russian) because that is the in-game
log the tracker fills and the word a player looking for exactly this tool would
type. Only three fields are indexable static text — the title, the description
and the `<noscript>` paragraph — so anything search should match has to be in
one of them; everything else waits on Google rendering the bundle. A `<noscript>` paragraph
says the same thing in each body, so a fetch without JavaScript is not an empty
`#root`. Meta tags and static files only — **no verification script and no tag
manager**, per the own-origin rule as it now stands: verification is available
as inert markup, and the one third-party script this page loads is the page-view
counter under **Counting visits** below. That counter narrows the rule; it does
not repeal it.

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

Yandex Webmaster is optional and works the same way: add the site, verify with
its meta tag, submit the same sitemap URL. With the Russian entry live it is
worth the second property if Russian traffic matters — Yandex is where the
Russian-language queries mostly come from.

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
