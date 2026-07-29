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
    // Also the bar's `aria-valuetext`, so it is announced as "3 of 99 crafted"
    // rather than as the percentage a bare `<progress>` reports.
    count: (crafted: number, total: number) => `${crafted} of ${total} crafted`,
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
    close: "Close",
  },
};
