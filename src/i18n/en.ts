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
    columnName: "Runeword",
    columnRunes: "Runes",
    columnItemTypes: "Base Items",
    columnRequiredLevel: "Required Level",
  },

  itemTypes: {
    separator: ", ",
    withRestriction: (categories: string, restriction: string) =>
      `${categories} (${restriction})`,
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
