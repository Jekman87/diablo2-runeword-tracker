## Why

A reader on the diablo2.io thread pointed out an error in the crafting advice, and
he was right:

> you cannot get prefixes or suffixes to roll on White items, only staff mods.
> Thus, +3 Warcries (Echoing) prefix is exclusive to blue items. +3 War Cry on
> the other hand is possible as a staff mod for a barbarian Helm.

The advice for `Delirium` told a reader to look for "a barbarian helm that rolls
+3 to Warcries". That base cannot exist for this purpose: Warcries is a skill
**tab**, it comes from the `Echoing` prefix, a prefix makes the item magic, and a
magic item cannot hold a runeword at all. The advice pointed at an item nobody
can ever socket.

An audit of every base-affix claim in the advice found four instances of the same
confusion — a whole skill tab attributed to a white class base — and confirmed
the rest are sound. The reader also guessed the text came from ChatGPT, which is
a fair inference from a confidently wrong claim, and the reason to fix the class
of error rather than the one sentence.

## What Changes

- **Four corrections, each in both languages.** `Delirium` (barbarian helm tab
  _and_ druid pelt tab in one sentence), `Plague` (assassin claw tab), and
  `Flickering Flame` (druid pelt Elemental tab). Each keeps the useful half of
  the advice — individual-skill staffmods are real and worth hunting — and drops
  the impossible half.
- **The mechanic is not taught in the panel.** A first attempt explained why a tab
  is unusable — the prefix makes the item magic, and a runeword needs a white base
  — and it came out on review: a reader crafting runewords already knows that, and
  the hover panel's room is for what they cannot look up in the game. The
  reasoning goes to `docs/DATA-SOURCES.md`, addressed to whoever does the next
  base-affix pass.
- **Three review notes are corrected too.** They are not shipped, but they record
  why an entry says what it says, and the wrong reasoning would survive the fixed
  prose and mislead the next pass.
- **A new rule for the capability**, so this class of error cannot come back
  quietly: authored advice may not claim a base affix the item type cannot
  actually roll, and skill-tab claims are restricted to the item types whose
  staffmods really include a tab.

## Capabilities

### Modified Capabilities

- `crafting-advice`: a stated rule that base-affix claims must be possible for
  the item type, alongside the existing rule that prose states no availability
  the record does not carry.

## Impact

Data: `data/advice/runewords.ts` — four paragraphs in English, four in Russian,
three `source` notes. Regenerated into `src/data/runewords.json` by
`pnpm data:build`.

No code, no schema, no tests beyond what the dataset tests already assert. The
advice fields are decoration by requirement, so nothing downstream reads them.

Documentation: the audit's findings — which class items get tab staffmods and
which do not — belong in `docs/DATA-SOURCES.md` beside the base-affix method,
because the method is what produced the error and the next person using it needs
the constraint.
