// The shapes of the authored translation modules. Keys of the translation
// records are canonical English names; the generator validates them against
// the vendored data and fails on any key it does not define.

/** A runeword's Russian labels plus the sourcing note the JSON never ships. */
export interface RunewordTranslation {
  name: string;
  /** Present exactly when the English record carries one. */
  itemTypeRestriction?: string;
  /** Present exactly when the English record carries one. */
  note?: string;
  /** Mirrors the English groups: same count, one line per English line. */
  propertyGroups: { properties: string[] }[];
  /** Where the wording came from — for review, never emitted. */
  source: string;
}

/** A reference-data Russian name plus its sourcing note. */
export interface NameTranslation {
  ru: string;
  /** Where the wording came from — for review, never emitted. */
  source: string;
}
