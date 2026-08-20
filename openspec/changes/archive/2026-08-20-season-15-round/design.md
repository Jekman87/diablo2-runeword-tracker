## Context

The tracker mirrors the 99 runewords the D2R Chronicle counts. Availability —
the ladder-only flag, the patch that introduced a runeword, a free-text note —
has always been modelled as decoration: badges with tooltips, read by no filter,
no counter and no branch, precisely because availability flips between ladder
seasons and logic built on it would silently miscount progress. That decision
now pays out. Patch 3.3 released the eight ladder-only runewords into
Non-Ladder, and the correction is data and copy, not logic.

Three facts shape the design:

1. **Verified scope of the patch.** Patch 3.3 adds no runewords (99 stands),
   changes no rune sequence, socket count, base type or required level, and
   touches no cube recipe. The intermediate patches this project skipped —
   3.1.2 and 3.2 — contained no runeword, rune or cube changes either. The item
   changes in 3.3 are uniques and sets, which this dataset does not hold. So
   the only content change is availability.
2. **The nuance the reference site records.** diablo2.io has already updated to
   v3.3 and now marks the eight "Still Ladder only in LoD" / "Can be made in
   Non-Ladder on RotW". The restriction that survives belongs to Lord of
   Destruction. This tracker's subject is Reign of the Warlock — the Chronicle
   itself is a RotW feature — so the surviving restriction is out of frame.
3. **A near-miss worth recording.** The reference site still lists a runeword
   named `Hustle` that this dataset does not carry. That is not a gap:
   `vendor/runewizard/data/runewords.ts` records that patch 3.0 renamed and
   split Hustle into Mania (weapons) and Hysteria (body armor), both
   `Shael Ko Eld` at level 39. `Hustle` is the Lord of Destruction name for
   what RotW calls two runewords. The count stays 99.

The second half of the change is unrelated in mechanism and identical in kind:
both halves are about what the page states about itself. The owner wants visit
counts, and the repository currently documents — in three places — that the
page makes no third-party request at all.

## Goals / Non-Goals

**Goals:**

- Leave no surface stating that any runeword is ladder-only: dataset field,
  badge, legend entry, theme token, advice prose, review notes.
- Make the header state patch 3.3 and link to the notes for patch 3.3.
- Make the advice caveat say what a reader needs before trusting a price
  judgement, without adding a second caveat paragraph.
- Give the owner visit counts, in both languages separately, without a consent
  banner, without cookies, and without weakening the promise that progress
  never leaves the browser.
- Leave the documents describing the code truthfully, including the principle
  the counter narrows.

**Non-Goals:**

- Modelling the Lord of Destruction ladder restriction. Not this site's game
  mode; see Context.
- Re-collecting trade data for Season 15. The methodology already states that
  the market moves while the shape of what it wants does not; the fix the owner
  asked for is a better caveat, not fresher numbers.
- Any change to progress, its denominator, its storage or its transfer.
- The Search Console sitemap status and the account-root repository. Verified
  and parked in the proposal.
- A dashboard, a chart or any in-page display of the visit counts. The counts
  are read in Cloudflare's dashboard, not on the site.

## Decisions

### Remove the `ladderOnly` field rather than set it to `false`

**Chosen:** delete the field from the schema, the emitted JSON, the generator
and the three components that read it.

Setting all 99 to `false` would leave a boolean that nothing reads and a badge
that cannot render — dead weight that reads as a live feature to the next person
who opens the file, and a legend entry in the help panel promising a marker the
page never shows. The alternative was keeping the field against a future patch
that introduces ladder-only runewords again. Rejected: the vendor snapshot still
carries its own `ladder:` flags, so the signal is not lost, and re-deriving one
boolean is an afternoon. `docs/DATA-SOURCES.md` records where the vendor flag
lives so that afternoon starts from a note rather than from an excavation.

The generator's `LADDER_OVERRIDES` map goes with the field. Its whole purpose
was overriding a vendor flag that is no longer read.

`Mosaic` keeps its note. Patch 3.3 said nothing about Mosaic; it remains
disabled on ladder and craftable offline or non-ladder, and the note is the
right shape for that — free text, decoration, no badge semantics to go stale.
That the note badge survives is also what keeps the badge legend meaningful
after the ladder entry leaves it.

### Correct the advice prose by hand, in the authored module

The eight runewords state their ladder restriction in three places each: the
English paragraph, the Russian paragraph, and the `source` review note. All 24
are authored content in `data/advice/runewords.ts` with no vendor source, so
they are edited there and folded in by `pnpm data:build`. Russian is the
project's own prose, cross-checked against the official Russian game vocabulary
for the game terms inside it — never machine-translated, per the standing rule.

Three of the eight — Ground, Hearth, Temper — open their paragraph with the
phrase ("A ladder-only 3-socket helm with…"), so those need a rewritten opening
rather than a deleted parenthesis. The `source` notes are review artefacts that
never ship, but they are the record of why an entry says what it says; leaving
`ladder-only` in them would misinform the next review.

A new spec rule follows from the defect rather than from the fix: **authored
advice prose does not state availability.** Availability is dataset decoration
precisely because it flips between seasons; prose that repeats it acquires the
staleness the badge design was built to avoid, in two languages, where no test
can see it.

### The advice caveat is amended in place, not supplemented

The existing help sentence already carries "approximate", the season and the
collection date. Three additions land in the same sentence: prices move from
season to season, they differ between ladder and non-ladder, and the auction
sites linked in each advice card are where to check what things sell for now.

A second caveat paragraph was the alternative and is worse: help is where a
reader goes when lost, and a warning split across two paragraphs is read as two
different warnings. The date stays — it is what lets a reader a year from now
judge the staleness for themselves, which no wording can do for them.

The ladder-versus-non-ladder half is newly pointed rather than generic: patch
3.3 just released those eight runewords into non-ladder, where prices differ
from the ladder trades the judgements were drawn from.

### Cloudflare Web Analytics, and only the beacon

**Chosen:** Cloudflare Web Analytics — the provider's own beacon snippet from
`static.cloudflareinsights.com` before the closing body tag of both entry
documents.

The snippet Cloudflare issues is a `type="module"` script carrying the token as
a `data-cf-beacon` attribute. It ships in that form rather than rewritten to
`defer`: a module script is deferred by definition, so the no-blocking rule is
already satisfied, and an equivalent the provider does not test buys nothing.

The site was registered by **hostname** — `jekman87.github.io` — which is the
only thing Cloudflare's "Add a site" accepts; there is no path-scoped
registration. Our two documents are what carry the beacon, so they are what
reports, and the dashboard separates them by path.

It is free, sets no cookies, stores no persistent identifier and collects no
personal data, so no consent dialog is required and none is added. It reports
page views, referrers, countries and Core Web Vitals, and because it keys on
hostname while our documents sit under a sub-path, the dashboard separates
`/diablo2-runeword-tracker/` from `/diablo2-runeword-tracker/ru/` — which is
exactly how the owner learns the English/Russian split.

Alternatives considered:

- **Google Analytics 4.** Rejected by the owner: cookies, therefore a consent
  banner for EU readers, ~50 KB of `gtag.js`, and data landing in an
  advertising ecosystem — a large price for a visit count.
- **GoatCounter, script or no-JavaScript pixel.** The pixel was the closest fit
  to the standing principle — one `<img>`, no script at all — but it records
  neither referrer nor screen size, and referrer is half of what the owner
  wants to know, since Search Console already covers Google search and nothing
  else. Rejected for that, not for privacy.
- **A self-hosted counter behind an own endpoint.** Most principled and least
  proportionate: something to build, host and maintain, for a number read once
  a week.

### The token lives beside the other site constants

The beacon token is public by nature — it ships in the page — so it is a
constant, not a secret. Both entry documents are static files that cannot
import a module, which is the situation `SITE_URL` already solved: the value
lives in `src/header/site.ts`, the documents state it, and
`scripts/crawl-files.test.ts` compares every copy against the constant so they
cannot drift. The beacon joins that arrangement exactly, which also means a
document that loses its beacon fails a test rather than silently stopping
counting.

### The principle is narrowed, not deleted

`docs/SITE.md` says the page carries no analytics and no third-party script;
`IDEAS.md` says it makes no third-party request, and `site-footer`'s donation
rule cites that as settled ground. All three become false the moment the beacon
ships, and a document that contradicts the code is worse than one that admits a
trade-off. The rule is restated as what it now is: **no cookies, no consent
dialog, no reading or transmitting of a reader's progress, and no third-party
script beyond one cookieless counter.** The donation rule — no third-party
widget, iframe or image for the donation control — stands on its own merits and
keeps its force; it just stops resting on a claim about the whole page.

The help panel gains one sentence: the page counts anonymous page views and
sets no cookies. The existing sentence about progress staying in the browser is
not touched, because it stays true — the beacon reads no storage.

## Risks / Trade-offs

- **Ad blockers block `cloudflareinsights.com`** → Unfixable and accepted. The
  audience for a Diablo tool blocks heavily, so the counts are a trend and an
  order of magnitude, not a census. Recorded here so a low number is not later
  read as a traffic collapse. GitHub Pages serves no logs, so no server-side
  alternative exists.
- **A placeholder token ships and the counter silently reports nowhere** → The
  token is in hand before implementation starts, so this is a guard rather than
  a live risk: the test asserts the constant is an identifier of the shape
  Cloudflare issues, not merely that something is present. A counter that
  appears installed and counts nothing is worse than no counter, because nobody
  goes looking for it.
- **Removing a schema field is a breaking dataset change** → Contained: the
  dataset is generated and shipped from this repository, consumed only by this
  application, and validated at load. Nothing outside reads it. `pnpm data:build`
  and the dataset tests are the whole surface.
- **Twenty-four hand-edited strings in two languages, none of them
  test-covered** → Mitigated by making it a spec rule (prose states no
  availability) and by a repository-wide search for the phrase in both
  languages as an implementation step, rather than trusting the line numbers
  gathered while scoping.
- **The help panel grows** → Two additions, both amendments to existing points
  rather than new paragraphs. The panel's standing rule is that an explanation
  of something the player already knows is noise; neither addition is that.

## Migration Plan

No data migration: nothing persisted references the removed field. Stored
progress is a set of runeword names in `localStorage` and is untouched, so a
returning reader sees their marks exactly as they left them.

Order that keeps the tree green at every step: correct the advice prose and
regenerate, then remove the field from the generator, the schema and the
components together with their tests, then the constants and the documents,
then the beacon and its test.

Rollback is a revert. The one step outside the repository — registering the
Cloudflare Web Analytics site — is already done and costs nothing to leave
behind if the counter is later removed.

## Open Questions

- **Resolved: the beacon token and the registration scope.** The owner
  registered hostname `jekman87.github.io` — the only scope Cloudflare offers —
  and the token is in hand, so no task waits on it.
- **What happens to this dashboard if the account root is ever published.**
  Cloudflare keys on hostname, and `jekman87.github.io` currently serves
  nothing, so our two documents are the only sources of beacons today. Should
  the parked account-root repository ever ship, its page views would land in the
  same dashboard alongside ours, separated only by path. Worth knowing before
  that repository is built; nothing to decide before this change ships.
