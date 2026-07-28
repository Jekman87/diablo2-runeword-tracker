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
- ladder-only and patch-of-introduction flags exist in the UI as badges; where
  they live in the data still needs checking

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

**Ladder-only runewords: 9 of 99.** From the reference badges:

| Runeword                              | Patch |
| ------------------------------------- | ----- |
| Bulwark, Cure, Ground, Hearth, Temper | 2.6   |
| Mosaic                                | 2.6   |
| Metamorphosis                         | 2.6   |
| Mania, Hysteria                       | 3.0   |

**Availability is season-dependent and must live in data.** The reference
renders three separate badges per row, each with a tooltip:

| Badge   | Tooltip          | Class                             |
| ------- | ---------------- | --------------------------------- |
| `L`     | `Ladder Only`    | `rw-Md-ladder`                    |
| `2.6`   | `Patch version`  | `rw-Table-tdTitlePatch patch-2-6` |
| `Note!` | free-form caveat | `rw-Md-note`                      |

Mosaic carries all three, and its note reads:

> Disabled in Season 13! Can be crafted offline non-ladder.

So a runeword flagged ladder-only is currently impossible to craft _on_
ladder and possible only outside it. Availability flips between seasons, which
means any availability rule expressed as code will be wrong within a season or
two. Model it as `ladderOnly`, `patch` and a free-text `note`, and edit the
data rather than the logic.

Decided consequence: the progress bar always shows all 99. Denominators
derived from ladder status would be built on shifting ground.

## Verified after vendoring

All seven files match the sizes reported by the GitHub API byte for byte, and
the contents cross-check against what the live site renders:

| Check                                  | Result                                     |
| -------------------------------------- | ------------------------------------------ |
| Entries in `runewords.ts`              | 99                                         |
| Entries in `runewords-descriptions.ts` | 99 — matches                               |
| `ladder:` occurrences                  | 9 — matches the nine badges seen in the UI |
| `note:` occurrences                    | 1 — Mosaic, as expected                    |

### Confirmed record schema

```ts
{
  title:   string       // "Mosaic"
  runes:   string[]     // ["Mal","Gul","Amn"] — ordered, may repeat
  level:   number       // 53
  ttypes:  string[]     // ["Claws"]
  tinfos?: string       // "(Assassin)"      — 15 entries have it
  version?: string      // patch badge       — 74 entries have it
  ladder?: true         // ladder-only badge —  9 entries have it
  note?:   string       // caveat badge      —  1 entry has it
}
```

The three badge fields are all optional, which lines up exactly with treating
them as decoration: a record without them simply renders no badges. `version`
is absent on the original pre-1.10 runewords, which is why only 74 of 99 carry
it — not a data gap.

`item-types.ts` maps each of the 19 base categories to a wiki URL, so item
types can link out for free.

**Socket count is not stored** — it equals `runes.length`. Compute it; do not
add a second field that can drift.
