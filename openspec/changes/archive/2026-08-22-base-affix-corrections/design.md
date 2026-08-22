## Context

The crafting advice tells a reader which base to hunt for a given runeword. Those
claims came from a "base-affix pass": take a completed Traderie listing, subtract
what the runeword grants, and the remainder is the base's own contribution. The
method is recorded in `IDEAS.md` and it produced most of what the advice knows
about bases.

It has one blind spot, and this is the failure: **a listing is a seller's prose,
not the game's data.** Where a seller wrote "+3 to Warcries (Barbarian Only)",
the pass concluded the base rolls a Warcries tab. It cannot. The audit that
followed the reader's correction established the rule the pass was missing.

**The rule.** A white item can carry only staffmods (automods); prefixes and
suffixes require magic quality, and a magic item cannot hold a runeword. Staffmods
on class items grant **individual skills**, with one exception:

| Item type                                                     | What its staffmods grant                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------- |
| Barbarian helms                                               | 1–3 individual barbarian skills at +1-3, from any of the three trees |
| Druid pelts                                                   | individual druid skills; tab bonuses exist only on unique pelts      |
| Assassin claws                                                | 1–3 individual assassin skills at +1-3                               |
| Necromancer wands and heads, sorceress orbs, scepters, staves | individual skills (plus poison / mana / life mods)                   |
| Paladin shields                                               | resistances and enhanced damage, not skills                          |
| **Amazon bows**                                               | **+1-3 to the whole Bow and Crossbow Skills tab** — the exception    |

## Goals / Non-Goals

**Goals:**

- Correct the four impossible claims in both languages, keeping the true half of
  each.
- Record the rule where the method that broke it lives, so the next base-affix
  pass has the constraint in front of it.
- State the rule as a requirement, so a future entry making the same claim is a
  spec violation rather than a matter of taste.

**Non-Goals:**

- Re-running the base-affix pass over all 99 entries. The audit checked every
  claim that exists; there is no reason to re-derive the ones that are right.
- Touching the amazon bow claims. They are correct and they are load-bearing in
  seven entries.
- Adding a test that validates game mechanics. There is no machine-readable
  source of staffmod tables in this repository, and inventing one to guard four
  sentences would be a second dataset to maintain and to get wrong.

## Decisions

### Keep the true half, and do not teach the mechanic

The removed claims sit next to correct ones — a barbarian helm really is worth
hunting, just for Battle Orders rather than for the Warcries tab. So each fix
narrows the claim instead of deleting the advice.

A first attempt also explained _why_ a tab is unusable — the prefix makes the item
magic, and a magic item holds no runeword. **Cut on the owner's call, and he is
right.** Anyone reading crafting advice for a runeword already knows a runeword
needs a white base; spending three lines of a hover panel on it teaches nothing
and crowds out what the reader came for. It is also precisely what the help
panel's own rule throws out: "an explanation of something the player already knows
from the game itself is noise in the one place a reader goes when lost".

So the mechanic is recorded in `docs/DATA-SOURCES.md` instead, next to the method
that got it wrong, addressed to whoever does the next base-affix pass. That is
the reader who needs it — not the player hunting a helm.

### The amazon bow exception stays, and here is the evidence

Seven entries rely on white amazon bows rolling the Bow and Crossbow tab. That
survived the audit on two independent grounds: a source that states nonmagic
amazon bows can have that automod, and the dataset's own market evidence — 28 of
50 completed `Faith` copies advertise the tab, and `Faith` can only exist in a
white base, so white bows demonstrably carry it.

Recorded because it is the fact that makes the whole area confusing: the rule is
not "tabs never appear on white bases", it is "tabs appear only where that item
type's staffmods include one", and amazon missile weapons are where they do.

### A requirement rather than a test

The natural instinct is to guard this with a check. There is nothing to check
against: staffmod tables are game data this project does not vendor, and encoding
them here to validate four sentences would create a second source of truth about
the game — exactly what the project refuses elsewhere. So the guard is a stated
rule plus the constraint written beside the method in `docs/DATA-SOURCES.md`,
which is where someone doing the next pass will be reading.

## Risks / Trade-offs

- **More of the same error may exist in claims the audit read as fine** → The
  audit covered every base-affix claim in the file, classified each as tab or
  individual skill, and checked the item type for each tab claim. The residual
  risk is a claim whose wording hides a tab; low, and the new rule gives the
  next reviewer something to check against.
- **The amazon bow exception rests on a source I could not open directly** →
  Three of the obvious references (fandom, purediablo, diablowiki) refuse
  automated requests. The claim stands on a quoted statement plus the internal
  market evidence above, which is strong but not the same as reading the table.
  Stated here so a future doubt starts from what was actually established.
- **Grimoires are unverifiable** → `Obsession` mentions a rare grimoire rolling
  "+ to Warlock Skills". Reign of the Warlock has no published staffmod tables,
  but the claim is about a **rare** item, where affixes are allowed, so it is not
  an instance of this error. Left as it is, deliberately.

## Migration Plan

Edit the authored module, run `pnpm data:build`, run the suite. Nothing
persisted, nothing structural, and the advice fields are decoration by
requirement — so a wrong word here has never been able to affect progress,
filters or counts.

## Open Questions

None. The mechanic is settled and the audit is complete.
