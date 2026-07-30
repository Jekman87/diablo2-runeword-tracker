// Russian names for all 33 runes, keyed by canonical English name.
//
// From the official Russian localisation, as transcribed at
// https://www.noob-club.ru/index.php?topic=70237.0
// — all 33 are attested there — and cross-checked against
// diablo2-resurrected.ru, duskworld.ru and landofgames.ru.
//
// The sources disagree on three, and `Shael` is the one that mattered: the
// transcription writes «Шаэл» where the client writes «Шаэль». A reader with the
// game open settled it, which is why a transcription stands in for the client
// rather than replacing it. No machine translation. `source` records the
// sourcing per entry and stays out of the emitted JSON.
import type { NameTranslation } from "./types.ts";

export const runeTranslations: Record<string, NameTranslation> = {
  El: {
    ru: "Эл",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names; duskworld.ru writes «Эль»; the noob-club transcription and landofgames.ru both write «Эл»",
  },
  Eld: {
    ru: "Элд",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Tir: {
    ru: "Тир",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Nef: {
    ru: "Неф",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Eth: {
    ru: "Эт",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ith: {
    ru: "Ит",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Tal: {
    ru: "Тал",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ral: {
    ru: "Рал",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ort: {
    ru: "Орт",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Thul: {
    ru: "Тул",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Amn: {
    ru: "Амн",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Sol: {
    ru: "Сол",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Shael: {
    ru: "Шаэль",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names; «Шаэль» in the client, checked there directly. The noob-club transcription writes «Шаэл» and so does landofgames.ru; diablo2-resurrected.ru and duskworld.ru agree with the client, and the client settles it",
  },
  Dol: {
    ru: "Дол",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Hel: {
    ru: "Хел",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Io: {
    ru: "Ио",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Lum: {
    ru: "Лум",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ko: {
    ru: "Ко",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Fal: {
    ru: "Фал",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Lem: {
    ru: "Лем",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Pul: {
    ru: "Пул",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Um: {
    ru: "Ум",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Mal: {
    ru: "Мал",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ist: {
    ru: "Ист",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Gul: {
    ru: "Гул",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Vex: {
    ru: "Векс",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ohm: {
    ru: "Ом",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Lo: {
    ru: "Ло",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Sur: {
    ru: "Сур",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Ber: {
    ru: "Бер",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Jah: {
    ru: "Джа",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names; landofgames.ru writes «Жа»; the noob-club transcription and duskworld.ru write «Джа»",
  },
  Cham: {
    ru: "Чам",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
  Zod: {
    ru: "Зод",
    source:
      "https://www.noob-club.ru/index.php?topic=70237.0 — the official localisation's rune names, which all three community sites agree with",
  },
};
