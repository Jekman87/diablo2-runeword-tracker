// English display copy: the record every other locale is typed against.
// `ru.ts` is the second, declared as `Strings`, so a key added here without a
// Russian counterpart is a typecheck failure rather than an English word in
// the middle of a Russian page.
//
// Not declared `as const`. Widening every value to `string` is deliberate: a
// second locale has to match the *shape* of this record, not its words, and
// literal types would demand it repeat the English text.
//
// The boundary of this file is copy the project authors. Runeword names, rune
// names, item categories, property lines, restrictions and notes are dataset
// values and stay out — a locale that restated them would be a second copy of
// 99 records, and the canonical-identifier rule would have nothing left to
// mean. Punctuation *around* those values is copy, which is why the item-type
// separator and its parentheses live here and the categories themselves do not.
//
// That boundary is what `dataset-localisation` had to respect rather than
// breach: dataset text is localised too now, but its Russian labels ship inside
// the generated JSON and render through `src/runewords/display.ts`. So this
// layer holds exactly what it always held, and there is no locale in which a
// runeword's name comes from here.

export const en = {
  app: {
    title: "Diablo II Runeword Tracker",
  },

  // The site header: the sentence under the title, the two links, and the whole
  // of the help disclosure's prose.
  //
  // `patchLink` and `patchNotesName` take the patch number as a parameter for the
  // reason `patchMeaning` and `mark` do: `3.1.1` is the same string in every
  // locale, so it is a value this layer receives and only the words around it are
  // copy. The value itself lives in `src/header/site.ts`, beside the patch-notes
  // URL it has to move with. No URL appears here at all — a link's destination is
  // not copy.
  //
  // **The two `…Name` entries are accessible names, not visible labels.** Both
  // links leave the site in a new tab, and a link that does that without saying so
  // is one whose behaviour a screen-reader user meets only after it has happened.
  // Each name is written out whole here rather than stitched together in the
  // component from a label and a shared suffix, because the comma joining the two
  // halves is punctuation, and punctuation around a value is this layer's business.
  // Each contains its own visible label, so the two never disagree about what the
  // control is called.
  header: {
    // Says which list the page is showing rather than which game the reference is
    // for: the header's own job is to state what the 99 rows below it reflect. It
    // ends where the link begins, so the words and the pressable patch are two
    // strings rather than one sentence with a hole in it.
    patchLine: "Runeword list as of",
    patchLink: (patch: string) => `patch ${patch}`,
    patchNotesName: (patch: string) =>
      `Update notes for patch ${patch}, opens in a new tab`,

    feedback: "Feedback",
    feedbackName: "Feedback, opens in a new tab",

    // The disclosure that replaced a link to the repository. Everything a reader
    // needs in order to use the page is in these strings, in the order the
    // page presents the features: what the list is, how a runeword is marked,
    // what the two sticky answers above the table mean, how the table is
    // narrowed, what the two panels add up, where a runeword's properties are,
    // where the progress is kept, and how it is carried to another browser.
    //
    // **A feature that ships adds its point here.** The transfer point is the
    // second half of that rule working: import and export did not only need
    // describing, they made the sentence before them wrong, because progress
    // that can be exported is no longer progress that never leaves the browser.
    //
    // Prose, not a manual. A tracker whose whole interface is one screen does not
    // need sections, and a reader who opened a disclosure labelled Help wants the
    // answer in the first sentence.
    help: "Help",
    helpIntro:
      "Every runeword in the game, with the runes it takes and the base items it can go into. The patch above says which version of the list this is.",
    helpPoints: [
      // No count here on purpose: the number of runewords is the dataset's to
      // state, and a sentence pinning it goes stale the day a patch adds one.
      "Tick the box in the Crafted column to record a runeword you have made — clicking anywhere on its row does the same. Either way the page asks you to confirm first, so a stray click costs nothing, and the bar at the top counts what you have made out of the full list.",
      "The search field matches a runeword's name, its base items and any class or item restriction. The two groups of buttons beside it narrow the list by crafted state and by equipment slot, and every column heading sorts the table.",
      "Remaining Runes and Remaining Bases add up everything the runewords you have not made yet still need — the shopping list for the rest of them, not for the whole game.",
      "Rest the pointer on a runeword's name — or tap it on a phone — to see the properties it grants, its runes in order, the sockets it needs and the level it requires.",
      // The advice surfaces, with the caveat the change that added them owes:
      // the season and collection date are stated so a reader a year later can
      // tell how stale the judgements are, and "approximate" is the word doing
      // the work — the page makes claims about worth nowhere else.
      "The small line under a runeword's name says how useful it is — meta, situational, or Chronicle only — and pointing at (or tapping) its base items opens crafting advice: which base and affixes to look for, who uses it, and whether it sells. Both are approximate editorial estimates, drawn from community tier lists and trade history during the Reign of the Warlock season (August 2026); the game's economy moves, so read them as a guide, not a price list.",
      // Amended when import and export shipped. It used to end "nothing is
      // shared between devices", which the file below now makes false — the
      // point is that nothing leaves the browser *by itself*, not that nothing
      // can leave it at all.
      "Your progress is kept in this browser and nowhere else. Nothing is uploaded and nothing travels between devices on its own, and clearing this site's data clears it.",
      "Export progress saves your ticked runewords to a small CSV file, and Import progress reads one back — that is how you carry a list to another browser or keep a backup. Importing replaces everything you have ticked rather than adding to it, so it asks first and tells you how many runewords the file will tick; there is no undo once it is done. A spreadsheet works too, as long as it is saved as CSV with the names in the first column.",
    ],

    // Badge legend: each sample is rendered by the table's own Badge component;
    // the words below are what a reader who cannot see the sample still gets.
    // Four patch colours for five values — `1.10` stands for the classic era
    // that `1.11` shares.
    helpBadgesIntro:
      "Coloured tags beside a runeword's name are decoration — they mark when it was added, whether it is ladder-only, and whether it carries a caveat:",
    helpBadgePatch: (patch: string) =>
      patch === "1.10" || patch === "1.11"
        ? "Classic era (patches 1.10 and 1.11), before Diablo II Resurrected"
        : `Added in Diablo II Resurrected patch ${patch}`,
    helpBadgeLadder: "Ladder only — available in ladder seasons",
    helpBadgeNote:
      "Note! — the runeword carries a caveat; open its details to read it",
    helpRuneTiers:
      "Remaining Runes groups runes into three tiers from common to rare, following the Horadric Cube's upgrade ratios (for example, three Tal make one Ral). That is why the rarest runes carry the smallest counts.",
  },

  footer: {
    copyright: (siteName: string, year: number) => `© ${year} ${siteName}`,
    // Act-boss taunts plus one site line. Combat VO is English in-client;
    // Russian mirrors the wording players recognise from D2R documentation.
    easterEggs: [
      "Andariel: Die, maggot!",
      "Duriel: Looking for Baal?",
      "Mephisto: My brothers have escaped you!",
      "Diablo: Not even death can save you from me!",
      "Baal: My brothers will not have died in vain!",
      "Chronicle: You will not find Tyrael's Might!",
    ],
    donationHeading: "Support the author",
    donationInstrument: (coin: string, network: string) =>
      `${coin} on ${network}`,
    donationClose: "Close",
    copyAddress: "Copy address",
    copySuccess: "Address copied.",
    copyFailure: "Could not copy — select the address and copy it yourself.",
  },

  scrollToTop: {
    label: "Back to top",
  },

  table: {
    // Visually hidden, so it is the whole description of the table rather than
    // a heading above one.
    caption:
      "Every runeword, with the runes it takes, the bases it can be socketed into and the character level it requires",
    columnCrafted: "Crafted",
    columnName: "Runeword",
    columnRunes: "Runes",
    columnItemTypes: "Base Items",
    columnRequiredLevel: "Required Level",
  },

  // The browsing controls: the search field, the two filters, the count, the
  // reset and the message a narrowed table shows when nothing is left.
  //
  // **The four slot names are copy, and the base item categories are not.** A
  // slot is this project's grouping — `Body Armour` here against the dataset's
  // `Body Armors` — so it is a word we chose and a Russian locale translates it.
  // A category is a dataset identifier and stays out, exactly as runeword and
  // rune names do.
  controls: {
    // A real label, not a placeholder standing in for one. A placeholder
    // disappears the moment anything is typed, which is when a reader most needs
    // to know what the field searches.
    searchLabel: "Search runewords",
    // What the field matches, said once. The reference promises "Runeword name or
    // item type" in its placeholder; ours says it in the label's own hint.
    searchHint: "Name, base item or restriction",

    craftedLegend: "Crafted state",
    craftedAll: "All",
    craftedCrafted: "Crafted",
    craftedRemaining: "Remaining",

    // Three of these five are the game's own words for its own slots — the
    // Chronicle calls the shield slot the offhand and separates melee from missile
    // weapons — because the player's vocabulary beats ours where the game has one.
    // `Helm` and `Body Armour` stay as this project wrote them: the Chronicle says
    // `Helmet` and `Body Armor`, and the second of those is one letter from the
    // dataset's own `Body Armors`, which is exactly the confusion the British
    // spelling avoids.
    slotLegend: "Equipment slot",
    slotAll: "All",
    slotHelm: "Helm",
    slotMelee: "Melee",
    slotMissile: "Missile",
    slotOffhand: "Offhand",
    slotBodyArmour: "Body Armour",

    // Presented out of the dataset's total, never out of the crafted count.
    // Announced politely, so a reader who cannot see 99 rows become eleven is
    // told that they did.
    count: (shown: number, total: number) => `Showing ${shown} of ${total}`,

    // Names both halves of what it clears, because it clears both. It leaves the
    // sort alone, which is why it does not say "reset".
    reset: "Clear search and filters",

    // Rendered inside the table's own body rather than beside it, so a reader
    // navigating by row arrives at the explanation instead of at nothing.
    empty: "No runeword matches the current search and filters",
  },

  // Moving progress between browsers as a file: the two controls, and the
  // confirmation standing in front of every import.
  //
  // The exported file's own name is **not** here. It is never rendered, and it
  // must be the same file whichever language wrote it — see `EXPORT_FILENAME`
  // in `src/transfer/format.ts`, which says so at the declaration.
  transfer: {
    // There is deliberately no label over the pair. The two buttons sit at the
    // end of the count's row rather than among the filters, so there is no
    // column of legends for one to line up with, and "Export progress" and
    // "Import progress" already say what a heading would.
    //
    // "Progress" rather than "runewords": the file is the player's marks, and
    // the export is the thing they reach for when they are about to lose them.
    exportAction: "Export progress",
    importAction: "Import progress",

    // The confirmation. It is the whole safety mechanism — an import cannot be
    // undone — so the heading asks the destructive question outright rather
    // than announcing a feature.
    confirmTitle: "Replace your progress?",

    // Says erased and says permanent. Both halves are load-bearing: a player
    // who reads "import" expects a merge, and one who has learned that a mark
    // can be cancelled from its own dialog would be wrong about this one — the
    // question is asked once and there is nothing behind it.
    confirmWarning:
      "Importing replaces everything you have marked. Your current progress will be erased, and this cannot be undone.",

    // The number the file is judged by. It counts what will actually be marked,
    // so a file of typos offers to import nothing and says so — which is the
    // signal that replaced the unmatched-name report.
    confirmCount: (count: number) =>
      `This file will mark ${count} ${count === 1 ? "runeword" : "runewords"} as crafted.`,

    // Named for what it does rather than "OK", because the thing it does is the
    // thing the heading warned about.
    confirmAccept: "Replace",
    confirmCancel: "Cancel",
  },

  // A column header's sort control. Three functions rather than one, because the
  // accessible name has to say what the column *is* as well as what pressing it
  // will do — the direction indicator is a glyph, and a glyph may never be the
  // only thing carrying the direction.
  //
  // Each takes the column's own heading, which is already copy in `table` above,
  // so the sentence is built here and the column names are not repeated.
  sort: {
    by: (column: string) => `Sort by ${column}`,
    ascending: (column: string) =>
      `${column}, sorted ascending. Activate to sort descending`,
    descending: (column: string) =>
      `${column}, sorted descending. Activate to sort ascending`,
  },

  itemTypes: {
    separator: ", ",
    // The restriction's brackets alone, not a sentence joining it to the
    // categories. It renders on its own line and in its own colour now, so the
    // two halves are two elements and there is nothing left for a function
    // taking both of them to build.
    //
    // The words inside are dataset content — `Not Orbs/Wands`, `Assassin` — and
    // stay out of this file. Only the punctuation around them is copy.
    restriction: (restriction: string) => `(${restriction})`,
  },

  // The two advice surfaces. The three usefulness *values* are dataset
  // identifiers (`meta`, `situational`, `chronicle`); the words below are what
  // a reader sees for them, exactly as the slot names work. The advice panel's
  // prose itself is dataset text and stays out of this file — only its frame
  // (the trigger's accessible name, the heading, the sources line) is copy.
  advice: {
    // One word each, deliberately: the value renders as a coloured badge under
    // the name, and a badge is a glance, not a sentence. The full explanation
    // of the three lives in Help.
    usefulness: {
      meta: "Meta",
      situational: "Situational",
      chronicle: "Chronicle",
    },

    // The trigger is the item-types cell's own text; the name says what opens
    // so a reader who cannot see the panel appear is told what it was.
    label: (name: string) => `Crafting advice for ${name}`,
    heading: "Crafting advice",
    sources: "Sources:",
    // Every source link leaves the site in a new tab, and the accessible name
    // says so — the same rule the header's links follow.
    sourceName: (label: string) => `${label}, opens in a new tab`,
  },

  availability: {
    // What the badge draws, and what it means. The marker is short enough to
    // sit beside a name; the meaning is what assistive technology and a
    // pointer tooltip get, because a lone `L` explains nothing.
    ladderMarker: "L",
    ladderMeaning: "Ladder only",
    noteMarker: "Note!",
    patchMeaning: (patch: string) => `Introduced in patch ${patch}`,
  },

  crafted: {
    // Both directions, and both name the runeword. The control is a socket with
    // no text of its own, so its accessible name is the only thing that says
    // which row it belongs to — and a screen reader can reach it out of the
    // context of that row. The name comes in as a parameter for the same reason
    // `patchMeaning` takes one: it is a dataset identifier, and only the
    // sentence around it is copy.
    mark: (name: string) => `Mark ${name} as crafted`,
    unmark: (name: string) => `Mark ${name} as not crafted`,

    // The confirmation standing in front of every mark and unmark, in both
    // directions. It replaced the undo notice: a dialog that asks first and a
    // notice that offers to take it back are the same protection twice, and the
    // import confirmation had already settled which of the two this page uses.
    //
    // The heading asks the question and the body names the runeword, on the
    // shape the import confirmation set. The name is a `{name}` placeholder
    // rather than an interpolated argument: the component splits on it and
    // wraps the projected label in gold, so the styling layer never has to
    // parse a finished sentence.
    //
    // Each action is named for what it does rather than "Yes" or "OK", so the
    // green and the red are the second signal of the direction and never the
    // only one. "Add" rather than "Mark as crafted": the title already asked
    // the question, and the button only needs to name the short answer.
    confirmMarkTitle: "Mark as crafted?",
    confirmMarkBody: "{name} will be counted towards your progress.",
    confirmMarkAction: "Add",

    confirmUnmarkTitle: "Remove from crafted?",
    confirmUnmarkBody: "{name} will no longer count towards your progress.",
    confirmUnmarkAction: "Remove",

    confirmCancel: "Cancel",
  },

  progress: {
    label: "Runeword progress",
    // The percentage first, then the counts in brackets — the shape the in-game
    // Chronicle uses, which states a percentage over its own bar and nothing else.
    // The counts stay because the Chronicle goal is a number of runewords, not a
    // proportion: "37 of 99" is what a player is working through, and 37% alone
    // cannot be checked against the list.
    //
    // Also the bar's `aria-valuetext`, so it is announced as this sentence rather
    // than as the bare percentage a `<progress>` reports by default.
    //
    // The rounding lives here rather than at the call site because it is a
    // formatting decision, and formatting is what this layer is for. `Math.round`
    // and not a fixed decimal: 99 runewords put every step about one percent apart,
    // so a decimal place would add a digit that changes on every toggle and says
    // nothing. A total of zero is not a state the dataset can be in, but the guard
    // costs a character and beats rendering `NaN%` if it ever were.
    count: (crafted: number, total: number) =>
      `${total === 0 ? 0 : Math.round((crafted / total) * 100)}% (${crafted} of ${total})`,

    // The one sentence the page says only once. It follows the counts on the
    // same line rather than taking a banner of its own: the progress line is
    // where a player watches the number climb, so it is where the number
    // arriving deserves to be answered.
    //
    // Not in `aria-valuetext`, which stays the counts alone — a value is a
    // value, and a progress indicator that announces a congratulation as its
    // value would be worse for the reader who most depends on it.
    //
    // The reward is the in-game one the Chronicle grants for the same list, so
    // the sentence points back at the game rather than at this page.
    complete:
      "Congratulations, you have collected every runeword! Claim your reward in the game!",
  },

  // The two remaining panels: their titles, the tier bands' labels, the row
  // formats and one completion message each.
  //
  // The tier labels are our copy where the slot names were: the dataset's
  // `common` / `semirare` / `rare` are identifiers, and a Russian locale
  // translates the words below without touching them. Rune names and base
  // categories stay out, as everywhere.
  //
  // Formatting lives here, as the progress percentage already does. The base
  // row's count deliberately says what it counts — runewords the base would
  // serve — because a runeword allowing three categories is counted under all
  // three, so the counts do not sum to the uncrafted total and a bare number
  // would invite adding them up.
  remaining: {
    // One panel holds both lists, so the title names both and each section takes
    // the short word. "Remaining Runes" as a heading inside a panel called
    // "Remaining Runes and Bases" would say "remaining" twice in two lines: the
    // band has already told the reader what they are looking at, and the section
    // only has to say which half this is.
    title: "Remaining Runes and Bases",
    runesSection: "Runes",
    basesSection: "Bases",

    tier: {
      common: "Common",
      semirare: "Semi-rare",
      rare: "Rare",
    },

    runeCount: (count: number) => `×${count}`,
    baseSockets: (sockets: number) =>
      `${sockets} ${sockets === 1 ? "socket" : "sockets"}`,
    baseCount: (count: number) =>
      count === 1 ? "serves 1 runeword" : `serves ${count} runewords`,

    // Present rather than an absent panel, for the reason progress shows
    // `0 of 99`: a block that vanished reads as a defect, one with an answer
    // reads as done.
    runesDone: "No runes needed — every runeword is crafted",
    basesDone: "No bases needed — every runeword is crafted",
  },

  detail: {
    runes: "Runes",
    sockets: "Sockets",
    itemTypes: "Base Items",
    requiredLevel: "Required Level",
    availability: "Availability",
    note: "Note",
    properties: "Granted Properties",
    // No `close`. The panel had a close button while it was a modal `<dialog>`,
    // which needed a focusable element to put focus on; a panel that opens when
    // the pointer rests on a name is left rather than closed. Copy with nothing
    // rendering it is the same defect as a colour token with no use site, so it
    // went out with the button.
  },

  // The language switch's five strings — and the four option strings are
  // **identical in every record, deliberately**. A language's own name does not
  // translate: a reader facing an interface they cannot read must be able to
  // read the way out of it, so each option is written in the language it
  // selects, whatever language the page is in. Only the group's label speaks
  // the active language. The visible labels are the two-letter codes; the
  // `…Name` entries are the accessible names behind them, whole words because
  // `EN` read aloud says less than "English".
  language: {
    label: "Language",
    en: "EN",
    enName: "English",
    ru: "RU",
    ruName: "Русский",
  },
};
