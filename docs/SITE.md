# Site constants

Language-invariant values the page states about itself — patch number, URLs,
site name, donation receive address — live in `src/header/site.ts`. They are
constants rather than copy: a URL is not translated, a patch number is the same
word in every locale, and a receive address is the same string whichever language
names the coin beside it.

## Address

The site is live at **<https://jekman87.github.io/diablo2-runeword-tracker/>**,
a GitHub Pages project page. That URL is `SITE_URL` in `src/header/site.ts`, and
the sub-path in it is the same one Vite's `base` carries — change one and the
other is wrong.

Nothing the browser runs reads `SITE_URL`; the page is already at that address.
It exists because three static files state it and none of them can import a
constant:

| File                 | Where it says the URL              | Deployed at                              |
| -------------------- | ---------------------------------- | ---------------------------------------- |
| `index.html`         | `<link rel="canonical">`, `og:url` | `…/diablo2-runeword-tracker/`            |
| `public/sitemap.xml` | the single `<loc>`                 | `…/diablo2-runeword-tracker/sitemap.xml` |
| `public/robots.txt`  | the `Sitemap:` line                | `…/diablo2-runeword-tracker/robots.txt`  |

`scripts/crawl-files.test.ts` compares all three against the constant, so a URL
corrected in one place cannot stay wrong in the others, and CI asserts that the
build actually copied the two `public/` files into `dist/`.

## Search indexing

The document head carries a title, a one-sentence English description (repeated
as Open Graph) and the canonical link. A `<noscript>` paragraph says the same
thing in the body, so a fetch without JavaScript is not an empty `#root`. Meta
tags and static files only — no analytics and no verification script, per the
own-origin rule.

**`robots.txt` on a project page is advisory.** Crawlers read
`https://jekman87.github.io/robots.txt`, which belongs to the user account, not
to this repository; ours is served one level down and states intent and names
the sitemap. The sitemap therefore has to be submitted directly.

After a deploy that includes these files, the owner does this once, by hand:

1. Open [Google Search Console](https://search.google.com/search-console) and
   add a **URL-prefix** property for
   `https://jekman87.github.io/diablo2-runeword-tracker/` — not a Domain
   property, which needs DNS we do not own.
2. Verify it with the **HTML tag** method: Search Console gives a
   `<meta name="google-site-verification" …>` line; add it to `index.html`,
   merge, wait for the Pages deploy, then press Verify. The tag is inert markup,
   not a third-party script, so it is allowed here.
3. Under **Sitemaps**, submit `sitemap.xml` (the path is relative to the
   property, so the field takes `sitemap.xml`).
4. Optionally use **URL Inspection → Request indexing** on the page itself to
   skip the wait for the first crawl.

Yandex Webmaster is optional and works the same way: add the site, verify with
its meta tag, submit the same sitemap URL. Do it only if Russian-language
traffic matters enough to maintain a second property.

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
