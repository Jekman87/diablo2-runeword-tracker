## Why

Patch 3.3 shipped on 2026-08-18 and Ladder Season 15 started on 2026-08-21. It
released all eight previously ladder-only runewords into Non-Ladder — Mania,
Hysteria, Metamorphosis, Ground, Temper, Hearth, Cure, Bulwark — which is
exactly the set this dataset flags. Every one of them now carries a badge that
lies, prose in both languages that says a player needs a ladder character, and
a header pointing at patch notes two releases old. The patch number in the
header was never right either: `3.1.1` was read off the reference site's stale
header on 2026-07-28 while 3.2 was already live.

The owner also wants to know how often the site is visited. Search Console
reports Google-search clicks and nothing else — not direct visits, not
referrers, not the split between the English and Russian entries.

## What Changes

- **The dataset stops modelling ladder availability at all.** Patch 3.3 leaves
  no record ladder-only, and the reference site now expresses the remainder as
  "still Ladder only in LoD, can be made in Non-Ladder on RotW" — a Lord of
  Destruction restriction. This is a Reign of the Warlock tracker, so that
  restriction is not this site's subject. **BREAKING** for the dataset shape:
  the `ladderOnly` field leaves the schema and the emitted JSON.
- **The ladder marker badge and everything that exists only for it are
  removed** — the badge, its two locale strings, its legend entry in the help
  panel, its theme token, and the field the dataset carried for it. The patch
  badge and the note badge stay; `Mosaic` keeps its note, because patch 3.3
  said nothing about Mosaic and it is still disabled on ladder.
- **The site constants move to patch 3.3**, with the header's patch link
  pointing at the Season 15 announcement — that article _is_ the 3.3 patch
  notes; Blizzard published no separate one.
- **Crafting advice stops stating availability.** Twenty-four authored strings
  across the eight runewords say "ladder-only this season" in English, in
  Russian, or in the review note. They are corrected, and a new rule keeps
  prose out of the business of availability for good: availability flips
  between seasons, and prose that states it goes stale silently where a badge
  fed by the dataset does not.
- **The help panel's advice caveat says what it needs to say.** It already
  states that the judgements are approximate and names the season and the
  collection date. It gains what the owner asked for: that prices move from
  season to season, that they differ between ladder and non-ladder, and that a
  reader should check the auction sites already linked in each advice card for
  what things sell for now. The date stays.
- **A cookieless page-view counter is added** — Cloudflare Web Analytics, a
  deferred beacon in both entry documents. It sets no cookies, needs no consent
  banner and collects no personal data, which is why it can ship without the
  page acquiring a consent dialog. The help panel states that the page counts
  anonymous views.
- **The documented no-third-party principle is restated rather than deleted.**
  `docs/SITE.md` currently says the page carries no analytics; `IDEAS.md` says
  it makes no third-party request. After this change the true rule is narrower
  and still worth holding: no cookies, no consent, no third-party script beyond
  one cookieless counter, and nothing that reads or transmits a reader's
  progress.

Parked deliberately, recorded here so the next round does not rediscover them:
the Search Console sitemap status (verified sound from outside — 200,
`application/xml`, valid, nothing disallowed, both URLs indexed — so the fix is
an account action and not a code change), and the account-root repository that
would give Google a host-level favicon.

## Capabilities

### New Capabilities

- `usage-analytics`: a cookieless page-view counter on both entry documents —
  what it may collect, what it may never collect, where its public token lives,
  and what the page tells the reader about it.

### Modified Capabilities

- `runeword-dataset`: availability metadata no longer includes a ladder-only
  flag, and the `Mosaic` scenario stands on the note alone.
- `runeword-table`: the badge set loses the ladder marker.
- `runeword-browsing`: the requirements that keep search, sort, filters and
  counters away from availability no longer name a field that does not exist.
- `site-header`: the badge legend loses the ladder marker; the help panel gains
  a stated obligation for the advice caveat and one sentence about the counter.
- `crafting-advice`: authored advice prose SHALL NOT claim an availability
  restriction that the runeword's own note does not carry.
- `search-indexing`: the "no third-party script on the page" rule is restated
  to admit one cookieless counter without admitting anything else.
- `site-footer`: the donation rule's justification stops citing a
  no-third-party-requests requirement that no longer reads that way; the rule
  itself — no third-party widget for donations — stands unchanged.
- `d2-theme`: the palette token list loses the ladder badge role.

## Impact

Code: `src/data/schema.ts`, `src/data/runewords.json` (regenerated),
`scripts/generate-dataset.ts` (`LADDER_OVERRIDES`), `src/header/site.ts`
(patch, notes URL, analytics token), `src/components/AvailabilityBadges.tsx`,
`src/components/RunewordDialog.tsx`, `src/i18n/en.ts`, `src/i18n/ru.ts`,
`data/advice/runewords.ts` (24 strings across 8 entries), `index.html` and
`ru/index.html`, the theme token declaration, and comments in
`src/runewords/{search,sort,display}.ts` that name the removed field.

Tests: `src/data/index.test.ts` (the "exactly 8" assertion),
`src/components/AvailabilityBadges.test.tsx`,
`src/components/RunewordDialog.test.tsx`, `src/components/SiteHeader.test.tsx`,
and `scripts/crawl-files.test.ts`, which gains the beacon-in-both-documents
check on the same terms it already holds the URL constants.

Docs: `docs/SITE.md`, `docs/DATA-SOURCES.md`, `IDEAS.md`.

Dependencies: none added. Third-party surface: one deferred script from
`static.cloudflareinsights.com`.

Owner actions outside the repository: create the Web Analytics site for
hostname `jekman87.github.io` in the Cloudflare dashboard and hand over the
beacon token; tidy the Search Console sitemap rows.
