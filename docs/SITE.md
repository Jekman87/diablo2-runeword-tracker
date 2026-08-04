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
type. Only three fields are indexable static text — the title, the description
and the `<noscript>` paragraph — so anything search should match has to be in
one of them; everything else waits on Google rendering the bundle. A `<noscript>` paragraph
says the same thing in each body, so a fetch without JavaScript is not an empty
`#root`. Meta tags and static files only — no analytics and no verification
script, per the own-origin rule.

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

## Donation

The footer offers **USDT on TON** (a Jetton receive address). That instrument was
chosen over USDT-TRC20 for fees and over on-chain BTC, where the fee can exceed
the donation. Card processors and hosted "buy me a coffee" services do not reach
the author in Belarus, so a crypto address is the route that works.

The address is a **receive address only** — public and permanent by nature. No
key or seed belongs in this repository. Coin and network are stated beside it in
the donation dialog, because an address alone is ambiguous between chains and a
sender who picks the wrong one loses the money.
