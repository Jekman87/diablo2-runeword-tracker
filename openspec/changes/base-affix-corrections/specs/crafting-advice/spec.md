## ADDED Requirements

### Requirement: Advice claims no base affix the item cannot roll

Authored advice SHALL NOT tell a reader to look for a base property that the item
type cannot actually have. In particular it SHALL NOT attribute a whole skill tab
to a white class item unless that item type's staffmods really include one —
amazon missile weapons being the case where they do, and barbarian helms, druid
pelts, assassin claws, orbs, wands and scepters being cases where they do not.

The mechanic that makes such a claim impossible rather than merely imprecise: a
runeword can only be made in a non-magical item, a skill tab comes from a prefix,
and a prefix makes the item magic. Advice naming a tab on a runeword base
therefore describes an item nobody can ever socket.

**That mechanic SHALL NOT be explained in the advice itself.** A reader who is
crafting runewords knows that a runeword needs a white base, and the panel's
budget is for what they cannot look up in the game — which base to hunt, what it
rolls, whether it sells. The reasoning belongs in `docs/DATA-SOURCES.md`, beside
the method that got it wrong, where the next reviewer will be reading. The same
rule the help panel already carries applies here: an explanation of something the
player knows from the game itself is dropped.

**Trade listings are prose, not data.** Where a base-affix claim is inferred from
completed trades — the method this project uses — the inference SHALL be checked
against what the item type can carry before it is written as fact. A seller
writing "+3 to Warcries" is describing their item in their own words, and the
first pass over this data read one such phrase as a base roll and shipped it in
two languages.

Where a claim about game mechanics cannot be verified, the entry's `source` note
SHALL say so rather than the prose stating it confidently.

#### Scenario: No entry names a tab on a base that cannot roll one

- **WHEN** every advice entry is read for claims about what a base rolls
- **THEN** none attributes a skill tab to a class item whose staffmods grant only
  individual skills

#### Scenario: The mechanic is not taught in the advice

- **WHEN** the advice for a runeword whose market listings advertise a skill tab
  is read
- **THEN** it names the base property worth hunting and says nothing about item
  quality, prefixes or why a magic item cannot be socketed

#### Scenario: A correction reaches the review note as well as the prose

- **WHEN** a base-affix claim is corrected
- **THEN** the entry's `source` note records what was wrong with the earlier
  reasoning, so the next pass does not repeat it from the same evidence
