// Russian names for the 20 base item categories, keyed by canonical English
// name.
//
// From the official Russian localisation. The transcription at
// https://www.noob-club.ru/index.php?topic=70236.0
// names the base classes in the requirement list of every runeword entry, and a
// reader with the client open checked the four this project had either got wrong
// or could not find at all.
//
// Eighteen of the twenty are the game's own words. Two are not, and cannot be:
// the client has no collective name for missile weapons — it names bows and
// crossbows separately — and none for polearms either, so those two labels
// enumerate and describe respectively. Each note says which case it is. No
// machine translation. `source` records the sourcing per entry and stays out of
// the emitted JSON.
import type { NameTranslation } from "./types.ts";

export const itemTypeTranslations: Record<string, NameTranslation> = {
  Axes: {
    ru: "Топоры",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  "Body Armors": {
    ru: "Доспех",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries; the client's own word, checked there directly: «Доспех», singular among the plural category names because that is how the game writes it. Two earlier values were wrong — «Доспехи» from diablo2-resurrected.ru, then «Броня» from the noob-club transcription's base lists",
  },
  Claws: {
    ru: "Когти",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Clubs: {
    ru: "Дубины",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Daggers: {
    ru: "Кинжалы",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Grimoire: {
    ru: "Гримуар",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries; the client's own word, checked there directly: grimoires are a Reign of the Warlock item class (a Warlock-only off-hand) that the noob-club transcription predates, so the guide has no term and the client is the only source for this one",
  },
  Hammers: {
    ru: "Молоты",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Helms: {
    ru: "Шлемы",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Maces: {
    ru: "Булавы",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  "Melee Weapons": {
    ru: "Оружие ближнего боя",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  "Missile Weapons": {
    ru: "Луки и арбалеты",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries; project-authored: the client has no collective name for missile weapons, it names bows and crossbows separately, so this label enumerates the two classes it does name rather than quoting one it does not",
  },
  "Paladin Shields": {
    ru: "Щиты паладина",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Polearms: {
    ru: "Древковое оружие",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries; project-authored: the client has no collective name for polearms either — its classes there are several — so this describes the group. The noob-club transcription writes the bare adjective «Древковое»; the noun is added because a category label reads as a noun phrase",
  },
  Scepters: {
    ru: "Скипетры",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Shields: {
    ru: "Щиты",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Spears: {
    ru: "Копья",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Staves: {
    ru: "Посохи",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Swords: {
    ru: "Мечи",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Wands: {
    ru: "Жезлы",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
  Weapons: {
    ru: "Оружие",
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — the base lists of the official localisation's runeword entries, which names this class in exactly these words",
  },
};
