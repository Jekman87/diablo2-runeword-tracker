## Why

The page's content is invisible to a crawler that does not run JavaScript. Four
things are indexable static text today: the `<title>`, the `<meta>` description,
one `<noscript>` paragraph and an inert JSON-LD block. Everything else — 99
runeword names, 33 rune names, the base item types, required levels, granted
properties, the usefulness labels and the crafting advice, in two languages — is
rendered by React after the bundle loads.

Google does render JavaScript, but late, on a budget, and it weights what it
finds there less. The queries that find a tool like this are long-tail and
per-runeword — "enigma runeword", "Jah Ith Ber", «рунное слово загадка», «какие
руны нужны для infinity» — and not one of those words exists in the served HTML.
The Russian entry was built so a Russian query has a Russian document to match;
right now that document says one sentence in Russian and leaves the rest to a
bundle.

Rendering the app to HTML at build time is the largest indexing improvement
available without turning the page into a site. One URL per runeword would have a
higher ceiling and was rejected as too large.

Second, smaller item: the Russian entry has no Yandex property. Russian-language
search mostly happens on Yandex, `docs/SITE.md` already records the property as
worth having, and verification is one inert meta tag — the same shape the Google
one already has.

## What Changes

- **Both entry documents ship the rendered application in their HTML.** A build
  step renders `App` to a string twice — English into `index.html`, Russian into
  `ru/index.html` — and injects each into that document's `#root`. The two
  documents are already separate Vite inputs with their own heads, so this
  extends the existing two-entry arrangement rather than adding a third thing.
- **The locale store gains an explicit seed for the render pass.** It currently
  resolves the locale from the stored preference, else the entry document's
  `lang` attribute — and reading that attribute is a `document` access that a
  Node render does not have. The renderer will state the locale outright instead
  of the store inferring it, which is also more honest: at build time there is no
  reader and no document, only a decision about which language this file is.
- **`useStrings` and `useLocale` gain a server snapshot.**
  `useSyncExternalStore` throws during a server render when its third argument is
  absent, so both call sites must supply one. This is a requirement of the API,
  not a choice.
- **The client keeps rendering exactly as it does now.** `createRoot`, not
  `hydrateRoot`: the prerendered markup is content for crawlers, and React
  replaces it on mount. Hydration is rejected for this change because the
  locale, the crafted progress and the view settings all come from
  `localStorage`, which the prerender cannot know — a returning visitor's first
  client render differs from the server markup by construction, so hydration
  would mismatch every time.
- **The `<noscript>` paragraph is reworded, not removed.** It stops being the
  only thing a scriptless fetch gets and becomes what it always should have
  said: the list is readable without JavaScript, but nothing on it can be
  ticked.
- **A Yandex Webmaster verification tag joins the Google one** in `index.html`,
  with the sitemap submission documented beside the Search Console steps.

## Capabilities

### New Capabilities

- `prerendered-entries`: what each served document must contain before any
  script runs — the rendered list in the document's own language — and what the
  render pass may and may not assume.

### Modified Capabilities

- `search-indexing`: the requirement that only three fields are indexable static
  text is superseded; the served HTML now carries the content itself, and what
  the `<noscript>` paragraph is for changes with it.
- `ui-strings`: the locale store must be initialisable by a renderer that has no
  document to read a declaration from, and must survive a server render.
- `build-toolchain`: the build gains a render pass, and its output — not just its
  input — becomes something the repository checks.
- `static-site-deployment`: what deploys is now a build product that contains
  rendered HTML, so "the build published the files" is no longer the whole
  guarantee.

## Impact

Code: a new build script beside `scripts/generate-dataset.ts`, `vite.config.ts`
(an SSR build or a second config), `src/i18n/index.ts` (the seed and the server
snapshot), `index.html` and `ru/index.html` (the `#root` injection point, the
reworded `<noscript>`, the Yandex tag), and `src/header/site.ts` if the Yandex
token is held as a constant the way the analytics token is.

Tests: `scripts/crawl-files.test.ts` holds what the shipped files must say, and
its contract changes — the documents it must now check are the built ones, which
means the check depends on `pnpm build` having run. Whether that belongs there or
in a new build-output test is a design decision.

Risks concentrated in one place: anything that touches `window`, `document`,
`matchMedia` or an observer during render rather than in an effect breaks the
render pass. Audited already — the locale store is the only render-path offender;
`ScrollToTop`, `SiteFooter`'s clipboard and `App`'s scroll restoration all touch
the browser inside effects or handlers.

Not in this change, and deliberately: rewriting the title and description (the
owner will read the Search Console query report first), code-splitting the
677 kB bundle, and one URL per runeword.
