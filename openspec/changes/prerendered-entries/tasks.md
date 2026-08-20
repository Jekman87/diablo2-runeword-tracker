## 1. Make the locale store survive a render with no browser

- [x] 1.1 Add an explicit way to initialise the locale store with a stated locale,
      for the renderer only: it sets the active locale, persists nothing, and
      touches no document attribute
- [x] 1.2 Guard the two `document.documentElement.lang` writes in
      `src/i18n/index.ts` on a document existing, and make `documentLocale()`
      return nothing where there is no document instead of throwing
- [x] 1.3 Give `useStrings` and `useLocale` a server snapshot as
      `useSyncExternalStore`'s third argument, with a comment saying why the API
      requires it rather than leaving it looking redundant
- [x] 1.4 Unit-test the new behaviour in `src/i18n/index.test.ts`: a stated
      locale resolves with no `document` present and without throwing; the
      browser's resolution order (stored → document `lang` → English) is
      unchanged; and `resetLocaleForTests` still returns the store to a fresh
      load
- [x] 1.5 `pnpm test` and `pnpm typecheck` green before any render pass exists

## 2. Render the application to HTML

- [x] 2.1 Decide how the SSR bundle is produced — a Vite SSR build of a small
      render entry, or running the script through a loader that resolves the `@/`
      alias — choosing whichever keeps `pnpm build` one command and adds no
      dependency. Record the choice and the reason in the script's own comment
- [x] 2.2 Write the render script beside `scripts/generate-dataset.ts`: seed the
      locale, render `App` with `renderToString`, and return the markup. Run it
      for both locales
- [x] 2.3 Inject each result into that document's `#root` in the built output —
      English into `index.html`, Russian into `ru/index.html` — leaving every
      head field, the beacon and the JSON-LD block untouched
- [x] 2.4 Run it and read the output by eye: the English document contains
      English rune and base names, the Russian one the Russian ones, both contain
      all 99 runeword names, and the progress band reports nothing crafted
- [x] 2.5 Confirm nothing else reached for the browser during render. Nothing
      did — the audit was right that the locale store was the only offender.
      Noted for whoever comes next: the pass renders the **default tree only**,
      so closed panels, dialogs and Floating UI positioning are never exercised
      by it, and a browser API added on one of those paths will not be caught by
      the build

## 3. Keep the snapshot away from readers who have their own state

- [x] 3.1 Have the render step generate the inline decision script, interpolating
      `CRAFTED_STORAGE_KEY`, `VIEW_STORAGE_KEY` and `LOCALE_STORAGE_KEY` from the
      constants rather than writing the strings out again
- [x] 3.2 Place it between the prerendered markup and the module bundle, as a
      classic `<script>` so it runs before first paint while the bundle stays
      deferred. Hide with an inline `style.display = "none"`, not the `hidden`
      attribute, and wrap the whole thing in `try/catch`
- [x] 3.3 Reveal the root once React has committed the reader's real state and
      **before** a frame is painted — a layout effect or a synchronous flush,
      never `useEffect`. Comment why at the site: the difference is invisible in
      review and obvious on a slow connection
- [x] 3.4 Verify each audience, with the network throttled hard enough that the
      bundle takes seconds to arrive. Measured rather than eyeballed: a sampler
      installed before any page script records,on every animation frame, whether `#root`
      is displayed, whether it has children, and how many crafted sockets in the
      table are pressed. At 50 KB/s with the cache disabled —
      **fresh profile:** 0 of 666 frames hidden, the full styled table painted
      from the first frame while the bundle was still downloading;
      **returning reader (3 crafted, a stored sort):** 239 frames blank, then 422
      with content, and **0 frames showed content without their marks** — the
      snapshot was never painted;
      **storage throwing:** the page loaded and mounted normally.
      The first attempt at this measured nothing because an earlier navigation
      had warmed the cache — `Network.setCacheDisabled` is what made the throttle
      real, and that trap is worth knowing about for the next time
- [ ] 3.5 Test what can be tested automatically: that both built documents carry
      the script, that it names the real key values, and that the reveal is not
      wired to a post-paint effect
- [ ] 3.6 **Gate.** Show the owner the throttled returning-reader case before
      going further. They have reserved the right to withdraw the snapshot
      mechanism, or prerendering altogether, if flicker is visible — so keep the
      render pass and this group as separate commits and do not squash the branch

## 4. Make the build own the render, and fail without it

- [ ] 4.1 Wire the render pass into `pnpm build` so there is no way to produce
      `dist/` without it
- [ ] 4.2 Make a failing render fail the build, emitting no document with an
      empty root
- [ ] 4.3 Add the build-output check: both built documents carry runeword
      content, each in its own language. Assert language, not just presence — a
      Russian document full of English content is the failure a presence check
      would pass
- [ ] 4.4 Leave `scripts/crawl-files.test.ts` reading the source templates as it
      does today; the head fields, the URLs and the beacon are still template
      facts. Note in its docblock that body content is checked elsewhere and why
- [ ] 4.5 Check the quality gate still runs everything it did: the output check
      must not be a step CI can skip, and `pnpm build` must not have become
      optional to it

## 5. Correct the scriptless fallback

- [ ] 5.1 Reword the `<noscript>` paragraph in both documents: the list is
      readable without JavaScript; marking a runeword, searching, sorting and
      carrying progress as a file are what need it
- [ ] 5.2 Keep it in project prose in each document's own language, and keep it
      unstyled for the reason its comment already gives — the stylesheet arrives
      with the bundle it is standing in for

## 6. Claim the Yandex property

- [x] 6.1 Owner action, outside the repository: add the site in Yandex Webmaster
      and take the verification meta tag's value. Done — the tag reads
      `<meta name="yandex-verification" content="fb2c212fd42a88fb" />`
- [ ] 6.2 Hold `fb2c212fd42a88fb` where the other site constants are, documented
      as public-by-nature the way the analytics token is. Sixteen hexadecimal
      characters, which is the shape the check in 6.4 should demand
- [ ] 6.3 Add the tag to `index.html` beside the Google one, with a comment
      saying it is inert markup, why it stays after verification, and that
      Yandex re-checks it
- [ ] 6.4 Extend `scripts/crawl-files.test.ts` to hold the document copy against
      the constant, so a deleted tag fails a test
- [ ] 6.5 `docs/SITE.md`: document the Yandex steps beside the Search Console
      ones — add the site, verify by meta tag, submit the same sitemap — as an
      account action, and note that the sitemap covers both entries so `/ru/`
      needs no second submission

## 7. Verify the round

- [ ] 7.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — all green
- [ ] 7.2 `pnpm preview` and drive both entries in a real browser: the page still
      behaves as it did, stored progress still appears after mount, the language
      switch still works, and the console reports no hydration warning
- [ ] 7.3 Measure what changed: the served size of each document before and
      after, so the trade is recorded rather than assumed
- [ ] 7.4 After deploy, fetch both public URLs without executing scripts and
      confirm each carries its own language's content
- [ ] 7.5 Work on a branch, one commit per task group, and stop for the owner's
      review before anything reaches `main`
- [ ] 7.6 After the deploy is indexed, worth a look but not a gate: whether
      Search Console's coverage and query reports change. Recorded so the next
      round can compare rather than guess
