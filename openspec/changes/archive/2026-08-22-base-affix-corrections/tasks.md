## 1. Correct the four impossible claims

- [x] 1.1 `Delirium`, English and Russian: drop the Warcries tab and the druid
      skill-tab claims, keep the individual-skill advice. **No explanation of the
      mechanic in the panel** — a first attempt added one and the owner cut it: a
      reader crafting runewords knows a runeword needs a white base, and the
      hover panel's room is for what they cannot look up in the game
- [x] 1.2 `Plague`, English and Russian: the claw claim becomes up to three
      individual assassin skills, with no skill tree
- [x] 1.3 `Flickering Flame`, English and Russian: the pelt claim becomes
      individual druid skills, naming Fissure and Armageddon as the rolls a fire
      druid wants
- [x] 1.4 Correct the three `source` notes behind those entries, so the wrong
      reasoning does not outlive the wrong prose

## 2. Regenerate and check

- [x] 2.1 `pnpm data:build`
- [x] 2.2 `pnpm lint`, `pnpm typecheck`, `pnpm test` — the Russian paragraph
      parity the schema enforces is what would catch a botched edit
- [x] 2.3 Read the four paragraphs in the running app, both languages, in the
      advice panel where a reader meets them

## 3. Record the constraint where the method lives

- [x] 3.1 `docs/DATA-SOURCES.md`: beside the base-affix method, state the rule
      the method was missing — this is where the mechanic lives, deliberately,
      rather than in the advice or the help panel — white items carry only staffmods, staffmods grant
      individual skills, amazon missile weapons are the exception with a tab —
      and that a trade listing is a seller's prose rather than game data
- [x] 3.2 Record the audit result itself: every base-affix claim in the advice
      was classified and checked, four were impossible, the amazon bow claims in
      seven entries are correct, and `Obsession`'s grimoire line is about a rare
      item and so outside this rule

## 4. Owner review, then the rest

- [x] 4.1 Nothing committed until the owner has read the four corrected
      paragraphs — that was the condition on this change. Read and approved, then
      committed in three parts on the `base-affix-corrections` branch
- [ ] 4.2 Owner action, outside the repository: reply to the reader on diablo2.io: confirm, name both halves of the
      Delirium mistake, say where it came from, and that the other claims were
      audited
