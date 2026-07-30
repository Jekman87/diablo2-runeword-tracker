import type { Strings } from "@/i18n";

// Russian display copy, typed as `Strings` so an omitted key is a typecheck
// failure rather than a stray English word in the middle of a Russian page.
//
// Two kinds of words live here, and they are sourced differently:
//
// - **Game-derived terms** — anything the official Russian client of
//   Diablo II: Resurrected has its own word for — take the client's term, never
//   a translation of ours. Each carries a source note naming where the term
//   appears. A term marked `[REVIEW]` could not be verified against the client
//   and is the maintainer's to confirm before it is trusted.
// - **Project-authored prose** — help text, hints, empty states, accessible
//   names — is written as natural Russian, not as a word-for-word rendering of
//   the English record.
//
// Dataset text never appears here, exactly as in `en.ts`: runeword names, rune
// names, base item categories, property lines, restrictions and notes render
// in their canonical English form inside the Russian page.
//
// Russian grammar that English does not need — the three plural forms a count
// selects — lives inside this record's own value functions, as plain code in
// the one place that needs it. No ICU, no message syntax, no library.

export const ru: Strings = {
  app: {
    // The site's name, translated: `Diablo II` stays as the game's proper name
    // (the Russian client does not transliterate its own title), and "трекер"
    // is the loanword Russian gaming vocabulary actually uses.
    title: "Трекер рунных слов Diablo II",
  },

  header: {
    // "Рунное слово" — the official client's term: Blizzard's Russian D2R
    // patch notes and the in-game tooltips both use «рунное слово», not the
    // machine-translation «руническое слово».
    //
    // "Патч" rather than the news site's «обновление»: the sentence names a
    // version number the player looks up, and «патч» is what the audience
    // calls one. [REVIEW] — the client itself may prefer «обновление».
    patchLine: "Список рунных слов по состоянию на",
    patchLink: (patch: string) => `патч ${patch}`,
    patchNotesName: (patch: string) =>
      `Описание изменений патча ${patch}, откроется в новой вкладке`,

    feedback: "Обратная связь",
    feedbackName: "Обратная связь, откроется в новой вкладке",

    help: "Справка",
    helpIntro:
      "Все рунные слова игры — с рунами, которые для них нужны, и основами, в которые их можно вставить. Патч выше указывает, какой версии игры соответствует список.",
    helpPoints: [
      "Отметьте ячейку в столбце «Создано», чтобы записать собранное рунное слово. Полоса вверху страницы считает, сколько из всех 99 уже готово, а если отметили не то — уведомление предложит отмену.",
      "Поле поиска ищет по названию рунного слова, его основам и ограничениям по классу или типу предмета. Две группы кнопок рядом сужают список по готовности и по слоту экипировки, а каждый заголовок столбца сортирует таблицу.",
      "«Оставшиеся руны и основы» складывают всё, что ещё нужно несобранным рунным словам, — список покупок на оставшиеся, а не на всю игру.",
      "Наведите указатель на название рунного слова, чтобы увидеть его свойства, руны по порядку, число гнёзд и требуемый уровень.",
      "Прогресс хранится в этом браузере и больше нигде. Ничего не отправляется в сеть, ничего не передаётся между устройствами, а очистка данных сайта стирает и его.",
    ],
  },

  table: {
    caption:
      "Все рунные слова — с рунами, которые для них нужны, основами, в которые их можно вставить, и требуемым уровнем персонажа",
    // "Создано" is project copy: the game has no word for "I have made this
    // runeword" — its crafting vocabulary («изготовление») names cube recipes,
    // which this is not.
    columnCrafted: "Создано",
    columnName: "Рунное слово",
    // "Руна" — the client's own word, everywhere runes appear.
    columnRunes: "Руны",
    // "Основа" is the Russian community's word for a base item (the client has
    // no term — "base item" is itself community vocabulary in English).
    // Deliberately not «базовый предмет», which is longer in a column heading
    // and no more official. [REVIEW]
    columnItemTypes: "Основы",
    // "Требуемый уровень" — the client's item tooltips state exactly this line.
    columnRequiredLevel: "Требуемый уровень",
  },

  controls: {
    searchLabel: "Поиск рунных слов",
    searchHint: "Название, основа или ограничение",

    craftedLegend: "Готовность",
    craftedAll: "Все",
    craftedCrafted: "Созданные",
    craftedRemaining: "Оставшиеся",

    // The slot names. «Шлем» is the client's slot; «ближний бой» and «дальний
    // бой» are how the client's Chronicle separates melee from missile
    // weapons; «левая рука» is the offhand slot's Russian name. «Броня» for
    // the body slot follows the client's armour vocabulary rather than the
    // English record's British spelling, which has no Russian counterpart to
    // disambiguate against. [REVIEW] — the Chronicle wordings especially.
    slotLegend: "Слот экипировки",
    slotAll: "Все",
    slotHelm: "Шлем",
    slotMelee: "Ближний бой",
    slotMissile: "Дальний бой",
    slotOffhand: "Левая рука",
    slotBodyArmour: "Броня",

    // Unlike the English "Showing 5 of 99", the Russian sentence needs the
    // noun — and with the noun come the three plural forms.
    count: (shown: number, total: number) =>
      `Показано ${shown} ${plural(shown, "рунное слово", "рунных слова", "рунных слов")} из ${total}`,

    // «Очистить», not «Сбросить»: the control leaves the sort alone, and
    // Russian «сбросить» promises the reset the English deliberately does not.
    reset: "Очистить поиск и фильтры",

    empty: "Ни одно рунное слово не подходит под текущий поиск и фильтры",
  },

  sort: {
    // The column name arrives already translated — it is `table`'s copy — so
    // only the sentence around it is built here.
    by: (column: string) => `Сортировать по столбцу «${column}»`,
    ascending: (column: string) =>
      `${column} — сортировка по возрастанию. Нажмите, чтобы отсортировать по убыванию`,
    descending: (column: string) =>
      `${column} — сортировка по убыванию. Нажмите, чтобы отсортировать по возрастанию`,
  },

  itemTypes: {
    separator: ", ",
    restriction: (restriction: string) => `(${restriction})`,
  },

  availability: {
    // The marker stays Latin `L`: it abbreviates the mode's name, and the
    // Russian client keeps «ладдер» — Blizzard's Russian D2R announcements use
    // the loanword for ranked seasons. A Cyrillic «Л» would abbreviate a word
    // the game does not use. [REVIEW]
    ladderMarker: "L",
    ladderMeaning: "Только в ладдере",
    noteMarker: "Примечание",
    patchMeaning: (patch: string) => `Добавлено в патче ${patch}`,
  },

  crafted: {
    // The runeword's name stays canonical English inside the Russian sentence,
    // and «созданное» agrees with «рунное слово» (neuter), which the sentence
    // names so the agreement has a visible referent.
    mark: (name: string) => `Отметить рунное слово ${name} как созданное`,
    unmark: (name: string) =>
      `Снять с рунного слова ${name} отметку о создании`,
  },

  progress: {
    label: "Прогресс по рунным словам",
    // Bare numerals, as in English — no noun, so no plural form to select.
    count: (crafted: number, total: number) =>
      `${total === 0 ? 0 : Math.round((crafted / total) * 100)}% (${crafted} из ${total})`,
  },

  undo: {
    marked: (name: string) => `Рунное слово ${name} отмечено как созданное`,
    unmarked: (name: string) => `Отметка с рунного слова ${name} снята`,
    action: "Отменить",
  },

  remaining: {
    title: "Оставшиеся руны и основы",
    runesSection: "Руны",
    basesSection: "Основы",

    // Project copy, as the English labels are: the dataset's tier identifiers
    // are not the game's words, so there is no client term to source.
    tier: {
      common: "Обычные",
      semirare: "Нечастые",
      rare: "Редкие",
    },

    runeCount: (count: number) => `×${count}`,
    // "Гнездо" — the client's word for a socket, on items and in Larzuk's
    // reward alike. Three forms: 1 гнездо, 2 гнезда, 5 гнёзд.
    baseSockets: (sockets: number) =>
      `${sockets} ${plural(sockets, "гнездо", "гнезда", "гнёзд")}`,
    // Governed by «для», so the noun is genitive and only the one-form differs:
    // «для 1 рунного слова», «для 2 рунных слов», «для 21 рунного слова».
    baseCount: (count: number) =>
      `подойдёт для ${count} ${plural(count, "рунного слова", "рунных слов", "рунных слов")}`,

    runesDone: "Руны не нужны — все рунные слова созданы",
    basesDone: "Основы не нужны — все рунные слова созданы",
  },

  detail: {
    runes: "Руны",
    sockets: "Гнёзда",
    itemTypes: "Основы",
    requiredLevel: "Требуемый уровень",
    availability: "Доступность",
    note: "Примечание",
    properties: "Свойства",
  },

  // Identical in both records — see the note on `en.language`: a language's
  // own name does not translate, so a reader lost in the wrong language can
  // always read the way out.
  language: {
    label: "Язык",
    en: "EN",
    enName: "English",
    ru: "RU",
    ruName: "Русский",
  },
};

/**
 * The standard Russian three-form plural rule, as plain code.
 *
 * `one` for counts ending in 1 but not 11 (1, 21, 101), `few` for counts
 * ending in 2–4 but not 12–14 (2, 23, 104), `many` for the rest (0, 5–20,
 * 111). Local to this record, deliberately: English needs a ternary, Russian
 * needs this, and shared machinery for a rule only one locale has would be the
 * i18n library the spec forbids in miniature.
 */
function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;

  return many;
}
