## 1. Correct the authored advice prose

- [x] 1.1 Search the repository for availability claims in both languages
      rather than trusting the line numbers gathered while scoping: grep
      `data/advice/runewords.ts` for `ladder` and for `ладдер`, and list every
      hit with the runeword it belongs to
- [x] 1.2 Rewrite the English paragraph of each of the eight — Bulwark, Cure,
      Ground, Hearth, Temper, Metamorphosis, Mania, Hysteria — so it states no
      availability. Ground, Hearth and Temper open with the phrase, so those
      openings are rewritten rather than trimmed
- [x] 1.3 Rewrite the Russian paragraph of the same eight, keeping the paragraph
      count parity the schema enforces. Project prose; official Russian game
      vocabulary for the game terms inside it; no machine translation
- [x] 1.4 Drop `ladder-only` from the `source` review note of the same eight,
      leaving the tier, the trade velocity and the judgement intact
- [x] 1.5 Leave `Mosaic` untouched — its restriction is carried by its own note,
      which is what the new rule permits
- [x] 1.6 Run `pnpm data:build` and confirm the regenerated JSON carries the new
      prose and still no `source` notes

## 2. Remove the ladder-only field from the data pipeline

- [ ] 2.1 Delete `LADDER_OVERRIDES` and the `ladderOnly` mapping from
      `scripts/generate-dataset.ts`, leaving the note override in place
- [ ] 2.2 Remove `ladderOnly` from `src/data/schema.ts`
- [ ] 2.3 Run `pnpm data:build` and confirm `src/data/runewords.json` has 99
      records and no ladder key
- [ ] 2.4 Update `src/data/index.test.ts`: replace the "set on exactly 8"
      assertion with one that no record carries the field, and restate the
      `Mosaic` assertions on patch and note alone
- [ ] 2.5 Reword the comments in `src/runewords/search.ts`, `sort.ts` and
      `display.ts` that name the removed field

## 3. Remove the badge and its copy

- [ ] 3.1 Remove the `ladder` variant and its branch from
      `src/components/AvailabilityBadges.tsx`
- [ ] 3.2 Remove the ladder line from the availability block in
      `src/components/RunewordDialog.tsx`, keeping patch and note
- [ ] 3.3 Delete `ladderMarker`, `ladderMeaning` and `helpBadgeLadder` from
      `src/i18n/en.ts` and `src/i18n/ru.ts`, and amend `helpBadgesIntro` in both
      so it no longer promises a ladder tag
- [ ] 3.4 Delete `--color-ladder` and `--color-ladder-label` from
      `src/index.css` with the comment that explains them, and confirm no
      utility class references either
- [ ] 3.5 Update `AvailabilityBadges.test.tsx` and `RunewordDialog.test.tsx`:
      drop the ladder cases, and add one asserting no row can render a ladder
      marker
- [ ] 3.6 Run `pnpm test` and `pnpm lint` — a leftover reference should surface
      here rather than in review

## 4. Amend the help panel

- [ ] 4.1 Amend the advice caveat in `src/i18n/en.ts` so the one sentence states
      approximate, the collection date (August 2026), that prices move from
      season to season, that ladder and non-ladder differ, and that the auction
      sites linked in each card are where to check current prices
- [ ] 4.2 Mirror that amendment in `src/i18n/ru.ts` as project prose
- [ ] 4.3 Add the counter disclosure to the help points in both languages — the
      page counts anonymous page views and sets no cookies — without editing the
      sentence about where progress is kept
- [ ] 4.4 Add or update the help tests so the four caveat claims and the counter
      disclosure are asserted rather than merely present

## 5. Move the site constants to patch 3.3

- [ ] 5.1 Set `GAME_PATCH` to `3.3` and `UPDATE_NOTES_URL` to the Season 15
      announcement in `src/header/site.ts`, and record in the file's comment
      that the previous `3.1.1` was read off the reference site's stale header on
      2026-07-28 while 3.2 was already live, so the value was wrong rather than
      merely old
- [ ] 5.2 Confirm `SiteHeader.test.tsx` still passes unchanged — it reads the
      constants, which is the arrangement working

## 6. Add the page-view counter

- [ ] 6.1 Add the beacon token `1f854178248c4131a1f8744b9e4121d7` to
      `src/header/site.ts` as a named constant beside the URLs, documented as
      public-by-nature and not a secret. The Cloudflare site is already
      registered by hostname `jekman87.github.io`
- [ ] 6.2 Add Cloudflare's own snippet to `index.html` and `ru/index.html` at
      the end of the body, in the form the provider issues — a `type="module"`
      script with the token in `data-cf-beacon`, which is deferred by definition
      and needs no rewriting to `defer`
- [ ] 6.3 Extend `scripts/crawl-files.test.ts` to compare the token in each
      document against the constant, to fail when a document has no beacon, and
      to reject a constant that is not a token of the shape Cloudflare issues
      (32 hexadecimal characters), so a leftover placeholder cannot ship
- [ ] 6.4 After a deploy, confirm the dashboard reports
      `/diablo2-runeword-tracker/` and `/diablo2-runeword-tracker/ru/`
      separately, and that a load from a browser without a blocker is counted

## 7. Bring the documents back in line with the code

- [ ] 7.1 `docs/DATA-SOURCES.md`: replace the "Ladder-only runewords shipped: 8
      of 99" table and the `ladder:` occurrence count with what is true now, and
      record where the vendor flag still lives so the field can be re-derived if
      a future patch needs it
- [ ] 7.2 `docs/DATA-SOURCES.md`: record that the reference site's `Hustle` is
      the Lord of Destruction name for what patch 3.0 split into Mania and
      Hysteria, so the next reader does not read it as a missing runeword
- [ ] 7.3 `docs/SITE.md`: restate the analytics and third-party rule as the
      narrower one that now holds, document the counter and what its numbers are
      worth, and record the verified sitemap findings — 200, `application/xml`,
      well-formed, nothing disallowed, both URLs indexed — with the Search
      Console status named as a known condition to ignore
- [ ] 7.4 `docs/SITE.md`: add the owner's Search Console tidy-up — a junk
      sitemap row is removed by opening the row, then the three-dot menu on its
      details page, then Remove sitemap; note that Google's own documentation
      says removal clears the report but does not make Google forget the sitemap
      or its URLs, so the rows are cosmetic either way and leaving them costs
      nothing
- [ ] 7.5 `IDEAS.md`: restate the "no third-party request" claims where they
      appear, and record the two parked items — the account-root repository and
      the sitemap status — so the next round does not rediscover them

## 8. Verify the whole round

- [ ] 8.1 `pnpm lint`, `pnpm typecheck`, `pnpm test` — all green
- [ ] 8.2 Grep the whole repository, `dist/` excluded, for `ladder` and
      `ладдер`, and account for every remaining hit: `Mosaic`'s note and prose,
      the vendor snapshot, the historical spec archive, and the rules that
      forbid reading availability
- [ ] 8.3 Run the app and check by eye: no badge beside the eight, patch line
      reads 3.3 and links to the Season 15 notes, help legend shows patch and
      note only, advice caveat and counter disclosure read correctly in both
      languages
- [ ] 8.4 Work on the `season-15-round` branch, one commit per task group, and
      stop for the owner's review before anything reaches `main`
