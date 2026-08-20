## 1. Make the locale store survive a render with no browser

- [ ] 1.1 Add an explicit way to initialise the locale store with a stated locale,
      for the renderer only: it sets the active locale, persists nothing, and
      touches no document attribute
- [ ] 1.2 Guard the two `document.documentElement.lang` writes in
      `src/i18n/index.ts` on a document existing, and make `documentLocale()`
      return nothing where there is no document instead of throwing
- [ ] 1.3 Give `useStrings` and `useLocale` a server snapshot as
      `useSyncExternalStore`'s third argument, with a comment saying why the API
      requires it rather than leaving it looking redundant
- [ ] 1.4 Unit-test the new behaviour in `src/i18n/index.test.ts`: a stated
      locale resolves with no `document` present and without throwing; the
      browser's resolution order (stored → document `lang` → English) is
      unchanged; and `resetLocaleForTests` still returns the store to a fresh
      load
- [ ] 1.5 `pnpm test` and `pnpm typecheck` green before any render pass exists

## 2. Render the application to HTML

- [ ] 2.1 Decide how the SSR bundle is produced — a Vite SSR build of a small
      render entry, or running the script through a loader that resolves the `@/`
      alias — choosing whichever keeps `pnpm build` one command and adds no
      dependency. Record the choice and the reason in the script's own comment
- [ ] 2.2 Write the render script beside `scripts/generate-dataset.ts`: seed the
      locale, render `App` with `renderToString`, and return the markup. Run it
      for both locales
- [ ] 2.3 Inject each result into that document's `#root` in the built output —
      English into `index.html`, Russian into `ru/index.html` — leaving every
      head field, the beacon and the JSON-LD block untouched
- [ ] 2.4 Run it and read the output by eye: the English document contains
      English rune and base names, the Russian one the Russian ones, both contain
      all 99 runeword names, and the progress band reports nothing crafted
- [ ] 2.5 Confirm nothing else reached for the browser during render. If
      something did, fix it at the site rather than by shimming a global, and
      record what it was — the audit expected only the locale store

## 3. Make the build own the render, and fail without it

- [ ] 3.1 Wire the render pass into `pnpm build` so there is no way to produce
      `dist/` without it
- [ ] 3.2 Make a failing render fail the build, emitting no document with an
      empty root
- [ ] 3.3 Add the build-output check: both built documents carry runeword
      content, each in its own language. Assert language, not just presence — a
      Russian document full of English content is the failure a presence check
      would pass
- [ ] 3.4 Leave `scripts/crawl-files.test.ts` reading the source templates as it
      does today; the head fields, the URLs and the beacon are still template
      facts. Note in its docblock that body content is checked elsewhere and why
- [ ] 3.5 Check the quality gate still runs everything it did: the output check
      must not be a step CI can skip, and `pnpm build` must not have become
      optional to it

## 4. Correct the scriptless fallback

- [ ] 4.1 Reword the `<noscript>` paragraph in both documents: the list is
      readable without JavaScript; marking a runeword, searching, sorting and
      carrying progress as a file are what need it
- [ ] 4.2 Keep it in project prose in each document's own language, and keep it
      unstyled for the reason its comment already gives — the stylesheet arrives
      with the bundle it is standing in for

## 5. Claim the Yandex property

- [ ] 5.1 Owner action, outside the repository: add the site in Yandex Webmaster
      and take the verification meta tag's value
- [ ] 5.2 Hold that value where the other site constants are, documented as
      public-by-nature the way the analytics token is
- [ ] 5.3 Add the tag to `index.html` beside the Google one, with a comment
      saying it is inert markup, why it stays after verification, and that
      Yandex re-checks it
- [ ] 5.4 Extend `scripts/crawl-files.test.ts` to hold the document copy against
      the constant, so a deleted tag fails a test
- [ ] 5.5 `docs/SITE.md`: document the Yandex steps beside the Search Console
      ones — add the site, verify by meta tag, submit the same sitemap — as an
      account action, and note that the sitemap covers both entries so `/ru/`
      needs no second submission

## 6. Verify the round

- [ ] 6.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — all green
- [ ] 6.2 `pnpm preview` and drive both entries in a real browser: the page still
      behaves as it did, stored progress still appears after mount, the language
      switch still works, and the console reports no hydration warning
- [ ] 6.3 Measure what changed: the served size of each document before and
      after, so the trade is recorded rather than assumed
- [ ] 6.4 After deploy, fetch both public URLs without executing scripts and
      confirm each carries its own language's content
- [ ] 6.5 Work on a branch, one commit per task group, and stop for the owner's
      review before anything reaches `main`
- [ ] 6.6 After the deploy is indexed, worth a look but not a gate: whether
      Search Console's coverage and query reports change. Recorded so the next
      round can compare rather than guess
