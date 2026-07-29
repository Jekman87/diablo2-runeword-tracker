// English display copy. The only locale that exists; `russian-locale` adds the
// second and types it against this record.
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

export const en = {
  app: {
    title: "Diablo II Runeword Tracker",
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
  },

  undo: {
    marked: (name: string) => `Marked ${name} as crafted`,
    unmarked: (name: string) => `Unmarked ${name}`,
    action: "Undo",
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
};
