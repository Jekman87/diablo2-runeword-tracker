# Data sources

## Licence finding — this matters, and it is good news

The reference project `fabd/diablo2-runewizard` is **MIT licensed**
(Copyright © 2014-present, Fabrice Denis). Reuse, modification and
redistribution are permitted provided the copyright notice and licence text
travel with the copied portions.

So the data files and the rune sprite **can** be reused. The obligation is
attribution: keep a `NOTICE` or a credit in the README naming Fabrice Denis
and the MIT licence, and link back to the original repository.

Separate and unchanged: the rune artwork itself derives from Blizzard's game
assets. Blizzard's ownership is not affected by the MIT licence on the
wrapper project. Every Diablo II fan tool sits in this position; the point is
to be there knowingly.

---

## The files we want

Source: <https://github.com/fabd/diablo2-runewizard>, branch `main`.

| File                                 | Size    | What it holds                                |
| ------------------------------------ | ------- | -------------------------------------------- |
| `src/data/runewords.ts`              | 14.0 KB | name, runes, level, item types, restrictions |
| `src/data/runewords-descriptions.ts` | 31.4 KB | the granted properties for all 99 runewords  |
| `src/data/item-types.ts`             | 1.2 KB  | base item categories                         |
| `src/data/runes.ts`                  | 1.1 KB  | the 33 runes and their tier                  |
| `src/assets/images/runes-sprite.png` | 98.4 KB | all 33 rune icons in one sprite              |
| `src/assets/css/runes.css`           | 2.6 KB  | sprite offset rules                          |

Also worth reading rather than copying, for interaction ideas:
`src/components/RunewordsTable.vue`, `src/components/RunewordPopup.vue`,
`src/store.ts`.

### Vendor them with these commands

Run from the repository root. This copies the files verbatim, with no risk of
transcription error — which is why it beats having an agent retype 45 KB of
game data.

```bash
mkdir -p vendor/runewizard/data vendor/runewizard/assets

BASE=https://raw.githubusercontent.com/fabd/diablo2-runewizard/main

curl -sSL $BASE/src/data/runewords.ts              -o vendor/runewizard/data/runewords.ts
curl -sSL $BASE/src/data/runewords-descriptions.ts -o vendor/runewizard/data/runewords-descriptions.ts
curl -sSL $BASE/src/data/item-types.ts             -o vendor/runewizard/data/item-types.ts
curl -sSL $BASE/src/data/runes.ts                  -o vendor/runewizard/data/runes.ts
curl -sSL $BASE/src/assets/images/runes-sprite.png  -o vendor/runewizard/assets/runes-sprite.png
curl -sSL $BASE/src/assets/css/runes.css            -o vendor/runewizard/assets/runes.css
curl -sSL $BASE/LICENSE                             -o vendor/runewizard/LICENSE
```

### If curl fails on Windows with error 35

```
schannel: next InitializeSecurityContext failed: Unknown error (0x80092012)
```

That is `CRYPT_E_NO_REVOCATION_CHECK`. Windows `curl.exe` uses schannel, the
OS TLS stack, which insists on checking the certificate revocation list and
treats "could not reach the CRL server" as a hard failure. Nothing is wrong
with the certificate — the revocation check itself could not complete, usually
because a VPN, corporate proxy or firewall is blocking the CRL endpoint.

**Preferred fix — clone instead of downloading seven files.** Git for Windows
ships its own TLS stack and does not go through schannel:

```bash
git clone --depth 1 https://github.com/fabd/diablo2-runewizard.git /tmp/runewizard
mkdir -p vendor/runewizard/data vendor/runewizard/assets
cp /tmp/runewizard/src/data/{runewords.ts,runewords-descriptions.ts,item-types.ts,runes.ts} vendor/runewizard/data/
cp /tmp/runewizard/src/assets/images/runes-sprite.png vendor/runewizard/assets/
cp /tmp/runewizard/src/assets/css/runes.css          vendor/runewizard/assets/
cp /tmp/runewizard/LICENSE                            vendor/runewizard/
rm -rf /tmp/runewizard
```

One command instead of seven, and a shallow clone also leaves the Vue
components readable for a while, which is useful for the interaction details.

**Alternative — skip the revocation check for that call only:**

```bash
curl -sSL --ssl-no-revoke $BASE/src/data/runewords.ts -o vendor/runewizard/data/runewords.ts
```

This is a real if small reduction in checking: the certificate is still
validated, only its revocation status goes unverified. Acceptable for pulling
a public repository over a one-off command. Do not put it in a global curl
config, where it would silently apply to everything.

**Alternative — PowerShell**, which uses a different TLS path entirely:

```powershell
Invoke-WebRequest "$BASE/src/data/runewords.ts" -OutFile vendor/runewizard/data/runewords.ts
```

If this machine is the work laptop with a VPN, that is the most likely culprit
and disconnecting it will make plain curl work again.

---

## TLS interception on this machine — fix this once, properly

Two errors seen in sequence:

```
curl: schannel: ... (0x80092012) revocation check could not be performed
git:  SSL certificate problem: unable to get local issuer certificate
```

Together these are diagnostic rather than mysterious. Something is
intercepting HTTPS and re-signing it with its own certificate — a corporate
VPN, proxy, or antivirus with TLS inspection. `curl` failed because it could
not reach the revocation list for that substituted certificate. `git` failed
because its bundled OpenSSL CA list does not contain the interceptor's root,
while Chrome works fine because Chrome trusts the Windows certificate store,
where the corporate root _is_ installed.

This will not stay confined to `git clone`. `npm install` will fail the same
way with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, and so will every other tool
with its own CA bundle. Worth fixing before scaffolding the project.

### In order of preference

**1. Get off the intercepting network.** Disconnect the VPN and retry. Free,
instant, and it confirms the diagnosis.

**2. Point git at the Windows certificate store.** This is the correct setting
on a managed Windows machine — it makes git trust exactly what the browser
trusts, and weakens nothing:

```bash
git config --global http.sslBackend schannel
```

If the revocation error from step one reappears, because the CRL endpoint is
also blocked:

```bash
git config --global http.schannelCheckRevoke false
```

**3. For npm and Node**, export the corporate root certificate from
_certmgr.msc → Trusted Root Certification Authorities_ as Base-64 `.cer`, then:

```bash
npm config set cafile "C:/certs/corporate-root.pem"
setx NODE_EXTRA_CA_CERTS "C:/certs/corporate-root.pem"
```

### What not to do

```bash
git config --global http.sslVerify false     # do not
```

That disables certificate verification altogether. On a network already
performing TLS interception it removes the only signal that would distinguish
the sanctioned interceptor from anything else. The schannel setting above
achieves the same convenience while still verifying.

Keeping them under `vendor/` rather than dropping them straight into `src/`
makes the provenance obvious to anyone reading the repository, keeps the MIT
licence text next to the code it covers, and leaves us free to transform the
data into our own schema without losing the original.

---

## Known shapes

### `runes.ts`

```ts
const runes: TRuneDef[] = [
  { name: "El",  tier: 1 },
  …
  { name: "Zod", tier: 3 },
];
```

`tier` is 1 = common, 2 = semirare, 3 = rare, eleven runes in each. Useful
beyond display: the remaining-runes panel can group by tier, which turns a
flat list of 33 into three meaningful bands.

### `runewords.ts`

```ts
{ title: "Leaf", runes: ["Tir","Ral"], level: 19,
  ttypes: ["Staves"], tinfos: "(Not Orbs/Wands)" }
```

- `runes` is ordered and may repeat — `Infinity` is `Ber Mal Ber Ist`
- socket count is not stored; it equals `runes.length`
- `ttypes` is a list of base categories, `tinfos` an optional restriction
  string. Class restrictions appear the same way: `(Assassin)`, `(Druid)`.
- `version` is the patch of introduction, which the UI renders as a badge.
  `ladder` is in the snapshot too but is read by nothing since patch 3.3 — see
  the ladder paragraph under **Resolved**

### `runewords-descriptions.ts`

An object keyed by runeword name, each value a multi-line template string of
properties, one per line. Verified live for a sample:

```
Nadir → +50% Enhanced Defense
        +10 Defense
        +30 Defense vs. Missile
        Level 13 Cloak of Shadows (9 Charges)
        +2 To Mana After Each Kill
        +5 To Strength
        -33% Extra Gold From Monsters
        -3 To Light Radius
```

---

## Resolved

**Count: 99.** Confirmed against a second source — the Chronicle tracks 99
runewords. The "~89" figure in older secondary write-ups predates the recent
patches that added runewords.

**Chronicle scope: the full set, not a subset.** Chronicle progress is
account-wide and shared between ladder and non-ladder, so a runeword crafted
on ladder still counts. The tracker therefore mirrors all 99.

**Ladder-only runewords shipped: none, since patch 3.3.** Eight of the 99 used
to carry the flag — Bulwark, Cure, Ground, Hearth, Temper and Metamorphosis from
patch 2.6, Mania and Hysteria from 3.0 — and patch 3.3 released all eight into
Non-Ladder on 2026-08-18. What survived the patch is a Lord of Destruction
restriction, which the reference now words as "Still Ladder only in LoD / Can be
made in Non-Ladder on RotW"; this tracker mirrors Reign of the Warlock, whose
Chronicle is a RotW feature, so it is not our restriction to model. The
`ladderOnly` field left the schema, the generated JSON and the badge with it.

**Where to start if a future patch brings ladder-only runewords back.** The
vendor snapshot still carries its own `ladder: true` on those records —
`vendor/runewizard/data/runewords.ts`, untouched, as `vendor/` always is. The
generator reads the flag from nowhere today; re-deriving one boolean from a field
that is still there is an afternoon, which is why the field was removed rather
than shipped as a uniform `false` nothing could render.

**Availability is season-dependent and must live in data.** The reference
renders these badges per row, each with a tooltip:

| Badge   | Tooltip          | Class                             |
| ------- | ---------------- | --------------------------------- |
| `2.6`   | `Patch version`  | `rw-Table-tdTitlePatch patch-2-6` |
| `Note!` | free-form caveat | `rw-Md-note`                      |

The reference also draws an `L` / `Ladder Only` marker (`rw-Md-ladder`); we no
longer do, per the paragraph above.

Mosaic carries patch and note. Its note reads:

> Disabled on ladder! Can be crafted in non-ladder or offline.

The vendor's own wording was "Can be crafted offline non-ladder", with no
conjunction between the two words — which reads as offline-only, and that is
wrong: non-ladder online and offline both work. Corrected in the shipped note
and in the Russian variant, which named only the offline case.

That note is now the only place a ladder restriction is stated anywhere in the
dataset — free text the owner edits, not a field logic reads. Patch 3.3 said
nothing about Mosaic, so it stands. Availability flips between seasons, which
means any availability rule expressed as code will be wrong within a season or
two. Model it as `patch` and a free-text `note`, and edit the data rather than
the logic.

**Not a missing runeword: `Hustle`.** The reference lists it and this dataset
does not. Patch 3.0 renamed and split it into Mania (weapons) and Hysteria (body
armor), both `Shael Ko Eld` at level 39, and the vendor snapshot records the
split in a comment beside those two records. `Hustle` is the Lord of Destruction
name for what RotW calls two runewords. The count stays 99.

Decided consequence: the progress bar always shows all 99. Denominators
derived from ladder status would be built on shifting ground.

## Verified after vendoring

All seven files match the sizes reported by the GitHub API byte for byte, and
the contents cross-check against what the live site renders:

| Check                                  | Result                                 |
| -------------------------------------- | -------------------------------------- |
| Entries in `runewords.ts`              | 99                                     |
| Entries in `runewords-descriptions.ts` | 99 — matches                           |
| `ladder:` occurrences                  | 9 in vendor; none read since patch 3.3 |
| `note:` occurrences                    | 1 — Mosaic, as expected                |

### Confirmed record schema

```ts
{
  title:   string       // "Mosaic"
  runes:   string[]     // ["Mal","Gul","Amn"] — ordered, may repeat
  level:   number       // 53
  ttypes:  string[]     // ["Claws"]
  tinfos?: string       // "(Assassin)"      — 15 entries have it
  version?: string      // patch badge       — 74 entries have it
  ladder?: true         // read by nothing    —  9 entries have it
  note?:   string       // caveat badge      —  1 entry has it
}
```

The three badge fields are all optional, which lines up exactly with treating
them as decoration: a record without them simply renders no badges. `version`
is absent on the original pre-1.10 runewords, which is why only 74 of 99 carry
it — not a data gap.

`item-types.ts` maps 20 base categories to a wiki URL, so item types can link
out for free — except for the four that have no URL at all: `Grimoire`,
`Melee Weapons`, `Missile Weapons` and `Weapons`.

**Socket count is not stored** — it equals `runes.length`. Compute it; do not
add a second field that can drift.

---

## Generating the dataset

`vendor/` is never imported by application code. `src/data/*.json` is generated
from it by a committed script:

```bash
pnpm data:build      # node scripts/generate-dataset.ts
```

The generator reads the four vendor files as **text**, transpiles each in memory
with `typescript`'s `transpileModule` and evaluates it — the files annotate with
types they never declare and `runes.ts` holds an `export const enum`, so neither
a static import nor Node's type stripping can read them, and importing them
would pull `vendor/` into `pnpm typecheck`.

It validates the vendor shape before transforming and its own output afterwards,
then formats through Prettier's API with this repository's config, so
`pnpm data:build` leaves a tree `format:check` already accepts.
`scripts/generate-dataset.test.ts` proves the committed JSON still equals what
the generator produces, so a hand-edit to the JSON fails the suite.

**After a vendor refresh, run `pnpm data:build` and then the full gate.** The
vendor-side schema is strict about the eight keys it knows, so a renamed or
retyped upstream field fails naming that field rather than emitting records full
of `undefined`.

### Confirmed field mapping

| Vendor           | Ours                  | Note                                                         |
| ---------------- | --------------------- | ------------------------------------------------------------ |
| `title`          | `name`                | unique; the canonical identifier                             |
| `runes`          | `runes`               | order significant, repeats preserved                         |
| `level`          | `requiredLevel`       | 13–69                                                        |
| `ttypes`         | `itemTypes`           | each resolves to `item-types.json`                           |
| `tinfos`         | `itemTypeRestriction` | parentheses stripped: `Assassin`, not `(…)`                  |
| `version`        | `patch`               | omitted on the 25 pre-1.10 runewords                         |
| `ladder`         | _(dropped)_           | not emitted since patch 3.3; the vendor flag stays for later |
| `note`           | `note`                | omitted unless present; only `Mosaic` has one                |
| _(descriptions)_ | `propertyGroups`      | merged in, one entry per line, grouped                       |
| `tier: 1\|2\|3`  | `tier`                | `common` / `semirare` / `rare`                               |
| _(none)_         | —                     | socket count stays derived                                   |

The description blocks of `Fortitude`, `Phoenix` and `Spirit` carry `####`
sub-headings because those three grant different properties per base type. The
generator turns each sub-heading into a labelled property group rather than a
property line; the other 96 records carry a single unlabelled group. Heading
text resolves to the record's own item categories through an explicit mapping —
the source writes `#### Body Armor` singular where `Fortitude`'s category is
`Body Armors` plural — and an unknown heading fails the build.

Verified against the generated output: 99 runewords with distinct names, 343
rune slots, socket counts 2 to 6, 33 runes in 11/11/11 tier bands from `El` to
`Zod`, 20 item categories all of which are referenced, 15 restrictions, patches
`1.10`/`1.11`/`2.4`/`2.6`/`3.0` on 74 records.

## Open question inherited by the slot filter

`Grimoire` is one of the four categories with **no wiki URL**, and it appears on
`Ancient's Pledge` alongside `Shields`. Which of the four filter slots — helm,
weapon, shield, body armour — it belongs to is not resolvable from the data, and
the missing URL removes the obvious way to check.

The dataset carries categories verbatim and classifies nothing, so this blocks
nothing at the data layer. The change that introduces the slot filter has to
settle it against the game rather than rediscover the question.

## The base-affix method, and the rule it needs

The crafting advice tells a reader which base to hunt. Most of what it knows came
from completed Traderie listings: a listing advertises the finished item's whole
property set, so subtracting what the runeword grants leaves the **base's** own
contribution. That is how the advice can say most sold `Mosaic` claws already
rolled +3 Phoenix Strike.

**A listing is a seller's prose, not the game's data**, and that is where the
method broke. Fourteen of fifty `Delirium` listings advertised "+3 to Warcries
(Barbarian Only)", and the pass wrote it up as something the base rolls. It is
not, and it cannot be:

- A **white** item carries only **staffmods** (automods). Prefixes and suffixes
  need magic quality.
- A whole **skill tab** — `+3 to Warcries` — comes from a prefix (`Echoing`).
- A **runeword only goes into a non-magical item.** So a helm with the tab can
  never hold `Delirium`, and the advice was pointing at an item nobody can socket.

A reader on diablo2.io caught it. Four claims were wrong on this exact point:
`Delirium` twice in one sentence (barbarian helm tab, druid pelt tab), `Plague`
(assassin claw tree), `Flickering Flame` (druid pelt Elemental tree).

**What staffmods actually grant, by item type.** Individual skills everywhere,
with one exception — which is what makes the area easy to get wrong:

| Item type                                                     | Its staffmods                                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Barbarian helms                                               | up to three individual barbarian skills at +1-3, from any of the three trees |
| Druid pelts                                                   | individual druid skills; tab bonuses exist only on unique pelts              |
| Assassin claws                                                | 1–3 individual assassin skills at +1-3                                       |
| Necromancer wands and heads, sorceress orbs, scepters, staves | individual skills, plus poison / mana / life mods                            |
| Paladin shields                                               | resistances and enhanced damage, not skills                                  |
| **Amazon bows**                                               | **+1-3 to the whole Bow and Crossbow Skills tab — the exception**            |

The amazon bow tab is load-bearing: seven entries rely on it (`Melody`, `Brand`,
`Faith`, `Harmony`, `Ice`, `Mist`, `Mania`). It survived the audit on two
independent grounds — a source stating that nonmagic amazon bows can carry that
automod, and the dataset's own evidence that 28 of 50 completed `Faith` copies
advertise it while `Faith` can only exist in a white base. Noted because the rule
is not "no tabs on white bases", it is "tabs only where that item type's
staffmods include one".

**So, before writing a listing's remainder as a base property:** check the item
type can carry it. Where it cannot be checked — `Obsession` mentions a rare
grimoire, and Reign of the Warlock publishes no staffmod tables — say so in the
entry's `source` note instead of stating it in the prose. Rare items take affixes,
so that particular claim is outside this rule.

**Where this does not go.** Not into the advice panel and not into the help. A
reader crafting runewords knows a runeword needs a white base; the panel's room is
for what they cannot look up in the game, and the help panel's own rule already
drops explanations of what the game teaches. This page is the audience for the
mechanic — whoever runs the next base-affix pass.
