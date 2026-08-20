## Context

The application is a single client-rendered page served as two static documents:
`index.html` in English and `ru/index.html` in Russian, both Vite inputs, both
loading the same bundle. Progress, locale and view settings live in
`localStorage`. There is no backend and no framework beyond React and Vite.

Everything a search engine could match on — 99 runeword names, 33 rune names,
base item types, levels, granted properties, advice prose — exists only after the
bundle runs. Two of the four static fields in each head were written specifically
to compensate: the description names "D2R" and "Chronicle" because those words
appeared in no static text at all. That compensation is the shape of the problem.

Three facts from an audit of the source, which set the size of this change:

1. **Storage is already render-safe.** All three storage modules wrap
   `window.localStorage` in `try/catch`. In Node the missing `window` raises a
   `ReferenceError`, which those handlers already catch, so `loadCrafted`,
   `loadLocale` and `loadViewSettings` return their empty values without a line
   of new guarding. The crafted set and the view settings are `useState` lazy
   initialisers over those loaders, so they need nothing.
2. **The locale store is the one render-path offender.** `currentLocale()` falls
   back to `documentLocale()`, which reads
   `document.documentElement.lang` — and then writes that attribute back. Neither
   is guarded, and `document` does not exist in Node.
3. **`useSyncExternalStore` throws in a server render without its third
   argument.** `useStrings` and `useLocale` both call it with two. This is an API
   requirement, not a stylistic gap.

Everything else that touches the browser does so in an effect or a handler:
`ScrollToTop`'s sentinel and `matchMedia`, `SiteFooter`'s clipboard, `App`'s
scroll restoration, `RunewordRow`'s selection check, and Floating UI's
positioning. None runs during render.

## Goals / Non-Goals

**Goals:**

- Put the whole list, in the right language, into the HTML of both entry
  documents, produced by the same components the browser renders.
- Make it impossible to build without the render pass, and impossible for a lost
  render to pass unnoticed.
- Leave the client's behaviour, its state handling and its performance profile
  where they are.
- Claim the Yandex property for the Russian entry with inert markup.

**Non-Goals:**

- Hydration. Explicitly rejected below.
- Any change to how progress, locale or view settings are stored or restored.
- Rewriting the title or description. The owner reads the Search Console query
  report first; copy written before that is guesswork.
- Code-splitting the 677 kB bundle, and one URL per runeword.
- Prerendering anything interactive into a working state. The served list is
  readable, not operable.

## Decisions

### Render at build time with `renderToString`, into the existing two documents

**Chosen:** a build step that produces an SSR bundle of `App`, renders it twice —
English and Russian — and injects each result into that document's `#root`.

The two entries already differ by exactly the thing that must differ: their
declared language, their head copy and their canonical URL. Rendering into each
of them keeps one architecture instead of introducing a third document kind. The
alternatives were a prerender plugin that drives a headless browser over the dev
server (slower, one more heavyweight dependency, and a browser in CI for
something `react-dom/server` does directly) and hand-written static HTML beside
the app (a second copy of the content, guaranteed to rot — rejected on the same
grounds the project rejects any second representation of a fact).

The step belongs to `pnpm build` rather than beside it. A separate command is a
command someone forgets, and forgetting it produces a site that works perfectly
for every reader while giving crawlers nothing.

### `createRoot`, not `hydrateRoot`

**Chosen:** the client keeps rendering as it does today; React discards the
prerendered markup on mount.

Hydration requires the first client render to match the served markup. Three
inputs make that impossible here: the locale, the crafted set and the view
settings all come from `localStorage`, which the build cannot know. A returning
reader — the reader this tracker is for — would mismatch on every load.

Hydrating and then applying stored state in an effect after mount is the
mainstream answer (it is what the Next.js, Astro and Remix documentation
recommends for storage-dependent UI) and it is rejected here, because it
guarantees the very thing this project has refused three times in writing. The
lazy initialisers in `useCraftedRunewords`, `useViewSettings` and the locale
store all exist for one stated reason: _"an effect would render the full table
and then narrow it, which is a visible frame of a page the player did not leave
behind."_ A two-phase hydration is that effect, promoted to architecture.

### A reader with saved state never sees the snapshot

**Chosen:** an inline script, generated by the build and placed between the
prerendered markup and the module bundle, hides the snapshot when this browser
holds any of the three storage keys.

This is the decision that makes prerendering compatible with the rule above,
rather than an exception to it. Without it, prerendering forces a choice between
indexable content and the project's own promise about intermediate states. With
it, each audience gets the right thing:

| Client             | Storage               | Sees                                             |
| ------------------ | --------------------- | ------------------------------------------------ |
| Any crawler        | empty, always         | the list immediately                             |
| A first visit      | empty                 | the list immediately — better than today's blank |
| A returning reader | keys present          | blank, then their own state — exactly today      |
| Scripting disabled | the script never runs | the list, readable                               |

The last row is a free consequence worth naming: with JavaScript off, nothing
hides the snapshot, so the scriptless reader gets the best outcome available
without a single line written for them.

Five details decide whether this works, three of them verified against the build:

1. **Timing.** A classic `<script>` blocks parsing and runs before first paint;
   the bundle is `type="module"` and therefore deferred. The decision lands in
   between, which is the whole reason it is inline and not part of the bundle.
2. **Styling.** Verified: Vite's build extracts the CSS and injects a real
   `<link rel="stylesheet">` into each document, so the snapshot renders styled
   rather than as unstyled text. Had the stylesheet arrived with the bundle, the
   snapshot would have been worthless to a reader and this design would need a
   different answer.
3. **How it hides.** An inline `style.display = "none"`, not the `hidden`
   attribute: `[hidden] { display: none }` is a user-agent rule that any Tailwind
   `display` utility outranks.
4. **Who unhides, and when.** React, after it has committed the real state and
   _before_ the browser paints — otherwise the fix introduces the flash it
   exists to prevent. `useLayoutEffect` after mount, or `flushSync` around the
   initial render; the implementation picks one, and the requirement is only that
   no frame is painted between unhiding and the correct content existing.
5. **The storage keys are generated, not copied.** They are exported constants
   (`CRAFTED_STORAGE_KEY`, `VIEW_STORAGE_KEY`, `LOCALE_STORAGE_KEY`), and the
   build step that writes the HTML interpolates them into the script. Retyping
   them would create a second representation of one fact — the defect this
   project refuses elsewhere — and its failure mode is silent: rename a key to
   `v2`, the script stops matching, and returning readers start seeing the flash
   with nothing to report it.

The script is wrapped in `try/catch`, because a private-browsing mode can throw
on the first storage access and this is the earliest code on the page.

**On cloaking.** The discriminator is whether the client holds this site's saved
data — not who the client is. A crawler and a first-time reader receive byte-for-
byte the same document, and Googlebot arrives with a clean profile every time, so
it is always in the first row of that table. What is hidden from a returning
reader is a stale snapshot, not content. This is a defensible reading rather than
a quoted rule, and the residual risk is stated rather than dismissed.

**On the inline script itself.** Until now no document carried executable code
except the bundle. Six lines of own-origin script is a small thing, but it is a
first, so it is a decision recorded here rather than a detail that appeared in a
diff.

**Withdrawal condition, at the owner's request.** If flicker is visible in
practice, this mechanism — or prerendering altogether — comes out. That makes the
visual check a gate rather than a formality, and it has to be run where the
window is wide: a throttled connection and a browser profile that already holds
progress. A warm localhost load proves nothing, because there the bundle arrives
faster than a reader can perceive the gap it was supposed to fill.

### Seed the locale instead of detecting it

The locale store resolves stored preference → document `lang` → English. The
render pass has no storage and no document, so it must be told. The store gains
an explicit way to be initialised with a locale, used only by the renderer; the
browser's resolution order is untouched.

This is the more honest model, not merely the working one. Reading
`document.documentElement.lang` asks "what does the document say it is?" — a
question with no meaning while the document is still being written. At build time
the language is an input, decided by which file is being produced.

The two document writes in that module become conditional on a document existing.
That is guarding a browser API at a browser-only site, not spreading `typeof
window` checks through the app — the audit found this is the only place needing
it.

### Give `useSyncExternalStore` a server snapshot

Both accessors gain a third argument returning the same value the client snapshot
would for a freshly seeded store. Without it React throws during
`renderToString`. Since the store is module state seeded before the render, the
server snapshot is the same function as the client one — but it must be passed
explicitly, and the reason is worth a comment: this is not redundancy, it is the
API's way of asking whether the value is stable across the render.

### Check the built documents, not the templates

`scripts/crawl-files.test.ts` reads the repository's source templates today,
which is right for the head fields and the crawl files. The rendered list exists
only in `dist/`, so asserting it there means the assertion depends on a build
having run — a real change in that test's contract.

**Chosen:** a separate build-output check rather than growing the existing test,
with the existing one left alone. Two tests with two preconditions are clearer
than one test whose failures mean either "the template drifted" or "you forgot to
build". The new check runs after `pnpm build`; wiring it so CI runs it at the
right point is part of the work, and the quality gate must not start passing by
skipping it.

The check asserts language, not just presence: a Russian document containing
English content is the failure mode a presence check would wave through, and it
is the plausible one, since the locale is the input most likely to be wrong.

### Yandex verification as a checked constant

The Google tag is inert markup in `index.html` with a comment explaining why it
stays. Yandex gets the same treatment, and the value joins the site constants so
the document copy can be checked against it — the arrangement the analytics token
already uses, for the same reason: a tag silently deleted is a property silently
unverified, and nobody notices until the property is gone.

## Risks / Trade-offs

- **A browser API reached during render breaks the build** → The audit found the
  locale store and nothing else, but the audit is a snapshot: any future
  component that touches `window` during render will fail `pnpm build` rather
  than fail in production. That is the trade this change makes, and it is the
  right way round. Worth stating in the build's own documentation so the failure
  is diagnosable by whoever meets it.
- **The served HTML doubles in size** → Ninety-nine rows of markup in each
  document, uncompressed in the file and gzipped on the wire. GitHub Pages serves
  compressed, and the bundle is already 677 kB, so this is a small addition to
  the total bytes and a large subtraction from time-to-first-content. Measure the
  before and after rather than asserting it.
- **A reader with progress sees the snapshot before their own state** → Prevented
  by the inline script above, not accepted. The risk that remains is the script
  failing quietly: a renamed storage key, a bundle that unhides too late, or an
  exception before the first line runs. The key generation and the `try/catch`
  address two of those; the third is what the throttled visual check is for.
- **The unhide happens after a painted frame** → This is the one way the fix
  becomes the defect. `useEffect` runs after paint and would produce exactly the
  flash being prevented; the unhide must be a layout effect or a synchronous
  flush. Worth a comment at the site, because the difference is invisible in
  review and obvious on a slow connection.
- **Two representations of the same page could drift** → They cannot, by
  construction: the same components render both. The failure that remains is the
  render silently not happening, which the build failure and the output check
  exist to catch.
- **Search results may not improve** → Honest statement of expectation: indexing
  the content is a precondition for ranking on long-tail queries, not a
  guarantee of it. For a fan tool, inbound links from communities remain the
  dominant factor. This change removes a reason not to rank; it does not create a
  reason to.

## Migration Plan

No data migration and no stored-state migration: nothing persisted is touched.

Order that keeps every step verifiable: make the locale store render-safe and
give the accessors their server snapshot first, with unit tests proving the store
resolves a stated locale with no `document`; then add the render pass and see it
produce markup; then the inline script and the unhide, which is where the flicker
question is settled; then wire it into `pnpm build` and add the output check;
then the Yandex tag, which is independent of all of it.

Rollback is a revert, and a partial rollback is safe: without the render pass the
documents serve exactly as they do today. That matters more than usual here,
because the owner has reserved the right to withdraw the snapshot mechanism after
seeing it — so the render pass and the inline script should land as separable
commits, and the branch should not be squashed into one.

## Open Questions

- **How the SSR bundle is produced.** Vite can emit one via an SSR build of an
  entry that imports `App`, or the script can be run through a loader that
  resolves the `@/` alias and Tailwind-free TSX. Either is fine; the deciding
  factor is which keeps `pnpm build` one command and does not add a dependency.
  Settle it in implementation and record what was chosen.
- **Where the output check runs.** It needs a built `dist/`, which the test suite
  currently never requires. Options: a script the deploy workflow runs after
  building, a vitest file that shells out to the build (slow), or a check inside
  the build step itself that fails it. The last is closest to the requirement
  that a failing render fails the build; then the "check" and the "build" are one
  thing, and the separate test only guards against the check being removed.
- **Resolved: the Yandex token.** The owner registered the site and the tag is
  `<meta name="yandex-verification" content="fb2c212fd42a88fb" />`. Sixteen
  hexadecimal characters, so the check has a shape to demand, as the analytics
  token's thirty-two do. Nothing in this change waits on it.
