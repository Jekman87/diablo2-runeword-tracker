import type { Strings } from "@/i18n";

// Russian display copy, typed as `Strings` so an omitted key is a typecheck
// failure rather than a stray English word in the middle of a Russian page.
//
// Two kinds of words live here, and they are sourced differently:
//
// - **Game-derived terms** — anything that names a game concept — come from the
//   game's own official Russian localisation, in two forms. noob-club.ru
//   transcribes the client's runeword and rune text in full (topics 70236,
//   70237 and 73463), and a reader with the game open checked the terms that
//   transcription left doubtful. The client's answer wins where the two
//   disagree; diablo2-resurrected.ru, duskworld.ru and landofgames.ru are
//   cross-checks for what neither covers. Machine translation stays forbidden.
//   Each term names where it was verified, and where the sources disagree the
//   note records the disagreement and the choice made. Nothing is flagged
//   `[REVIEW]` any more: every term that was has been checked, and three of them
//   turned out to be wrong.
// - **Project-authored prose** — help text, hints, empty states, accessible
//   names — is written as natural Russian, not as a word-for-word rendering of
//   the English record. A game concept the client itself does not name is
//   authored too, and says so: the off-hand and missile-weapon slots are the
//   two, because this project's slots are its own grouping rather than the
//   game's, and the client has no collective word for either.
//
// **Dataset text still never appears here, and now it is localised elsewhere.**
// Runeword names, rune names, base item categories, property lines,
// restrictions and notes are data: their Russian labels ship inside the
// generated JSON (authored under `data/ru/`, sourced the same way) and render
// through the dataset's own locale projection in `src/runewords/display.ts`.
// So neither locale restates the dataset inside this layer, and this layer is
// not what makes the Russian page speak Russian about the runewords — the
// projection is. What this record does hold is the punctuation and the
// sentences *around* dataset text: `itemTypes.restriction` brackets a Russian
// restriction it never authored, and `crafted.mark` names a runeword the
// caller has already projected.
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
    // "Рунное слово" — the official localisation's own term, which its guide
    // uses throughout («Рунное слово – могущественное свойство, которым можно
    // наделить любой предмет…»), and never the machine-translation «руническое
    // слово».
    //
    // "Патч" — verified: duskworld.ru writes «обновите игру до последнего
    // патча» and landofgames.ru «с патчем 2.4», so the audience's own word for
    // a version is «патч». duskworld.ru also uses «версия» and «обновление» in
    // its own version column; «патч» is kept because the sentence names a
    // version number the player looks up rather than a release announcement.
    patchLine: "Список рунных слов по состоянию на",
    patchLink: (patch: string) => `патч ${patch}`,
    patchNotesName: (patch: string) =>
      `Описание изменений патча ${patch}, откроется в новой вкладке`,

    feedback: "Обратная связь",
    feedbackName: "Обратная связь, откроется в новой вкладке",

    help: "Справка",
    helpIntro:
      "Все рунные слова игры — с рунами, которые для них нужны, и базами, в которые их можно вставить. Патч выше указывает, какой версии игры соответствует список.",
    helpPoints: [
      "Отметьте ячейку в столбце «Создано», чтобы записать собранное рунное слово. Полоса вверху страницы считает, сколько из всех 99 уже готово, а если отметили не то — уведомление предложит отмену.",
      "Поле поиска ищет по названию рунного слова, его базам и ограничениям по классу или типу предмета. Две группы кнопок рядом сужают список по готовности и по слоту экипировки, а каждый заголовок столбца сортирует таблицу.",
      "«Оставшиеся руны и базы» складывают всё, что ещё нужно несобранным рунным словам, — список покупок на оставшиеся, а не на всю игру.",
      "Наведите указатель на название рунного слова, чтобы увидеть его свойства, руны по порядку, число гнёзд и требуемый уровень.",
      // Amended when import and export shipped, as the English point was: the
      // claim is that nothing leaves the browser on its own, not that nothing
      // can be taken out of it.
      "Прогресс хранится в этом браузере и больше нигде. Ничего не отправляется в сеть и ничего не переносится между устройствами само по себе, а очистка данных сайта стирает и его.",
      "«Экспорт прогресса» сохраняет отмеченные рунные слова в небольшой текстовый файл, а «Импорт прогресса» читает его обратно — так список переносится в другой браузер или сохраняется про запас. Импорт заменяет все ваши отметки, а не добавляет к ним, поэтому сначала спрашивает и показывает, сколько рунных слов будет отмечено из файла; отменить его потом нельзя. Таблица тоже подойдёт, если сохранить её в CSV с названиями в первом столбце.",
    ],
  },

  table: {
    caption:
      "Все рунные слова — с рунами, которые для них нужны, базами, в которые их можно вставить, и требуемым уровнем персонажа",
    // "Создано" is project copy: the game has no word for "I have made this
    // runeword" — its crafting vocabulary («изготовление») names cube recipes,
    // which this is not.
    columnCrafted: "Создано",
    columnName: "Рунное слово",
    // "Руна" — the official localisation's word, everywhere runes appear.
    columnRunes: "Руны",
    // **Corrected on review.** This read «Основы», on the belief that it was
    // the Russian community's word for a base item. No source uses it that way:
    // diablo2-resurrected.ru heads every recipe's base list «Требуемые
    // предметные базы» — 104 times, once per entry — and duskworld.ru writes
    // «базовые предметы». "Base item" is community vocabulary in English too, so
    // the official localisation has no term to take and this heading is
    // project copy; it takes the community's own noun phrase.
    columnItemTypes: "Предметные базы",
    // "Требуемый уровень" — the official localisation's own line, stated on
    // every item that has one and on every entry of its runeword guide.
    columnRequiredLevel: "Требуемый уровень",
  },

  controls: {
    searchLabel: "Поиск рунных слов",
    searchHint: "Название, база или ограничение",

    craftedLegend: "Готовность",
    craftedAll: "Все",
    craftedCrafted: "Созданные",
    craftedRemaining: "Оставшиеся",

    // The slot names. A slot is this project's own grouping of the dataset's
    // categories, so these are only partly game terms — and checking them
    // against the official localisation is what separates the two halves.
    //
    // «Шлемы» and «Доспех» are the client's own class names, and they are also
    // what the base-items column now renders from the dataset, so a chip and
    // the column beside it say the same word. «Доспех» took two corrections to
    // arrive at: «Доспехи» from diablo2-resurrected.ru, then «Броня» from the
    // noob-club transcription's base lists, then the client's own singular.
    //
    // «Ближний бой» is the official «Оружие ближнего боя» shortened for a chip
    // — the chips sit under a legend that already says these are equipment
    // slots, so the «оружие» is the legend's job.
    //
    // **«Дальний бой» is ours**, and the client is why: it has no collective
    // term for missile weapons, naming bows and crossbows separately. The
    // dataset's label enumerates them; a chip cannot, both because it would be
    // too long and because this slot also holds `Weapons`. So it is written as
    // the symmetric counterpart of «Ближний бой» — a decision, not a source.
    //
    // **«Левая рука» is ours too, and that is the finding rather than a gap in
    // the search.** No source names an off-hand slot — not the client, not the
    // noob-club transcription, not diablo2-resurrected.ru, duskworld.ru or
    // landofgames.ru. They all name *bases* (`Щиты`, `Головы некроманта`) and
    // never slots, because a runeword guide has no reason to. So this is our
    // own name for a grouping this project invented, written as natural
    // Russian, and it says so rather than claiming a source it does not have.
    slotLegend: "Слот экипировки",
    slotAll: "Все",
    slotHelm: "Шлемы",
    slotMelee: "Ближний бой",
    slotMissile: "Дальний бой",
    slotOffhand: "Левая рука",
    slotBodyArmour: "Доспех",

    // Unlike the English "Showing 5 of 99", the Russian sentence needs the
    // noun — and with the noun come the three plural forms.
    count: (shown: number, total: number) =>
      `Показано ${shown} ${plural(shown, "рунное слово", "рунных слова", "рунных слов")} из ${total}`,

    // «Очистить», not «Сбросить»: the control leaves the sort alone, and
    // Russian «сбросить» promises the reset the English deliberately does not.
    reset: "Очистить поиск и фильтры",

    empty: "Ни одно рунное слово не подходит под текущий поиск и фильтры",
  },

  // Project-authored Russian throughout, and it says so rather than claiming a
  // source: the client has no file export, so it has no words for one.
  // «Экспорт» and «импорт» are the ordinary Russian computing loanwords, not a
  // translation of anything in the game.
  transfer: {
    exportAction: "Экспорт прогресса",
    importAction: "Импорт прогресса",

    confirmTitle: "Заменить прогресс?",

    // «Заменит», not «добавит» — the same expectation the English warning
    // corrects, and the one a Russian reader of «импорт» brings too.
    confirmWarning:
      "Импорт заменит все ваши отметки. Текущий прогресс будет стёрт, и отменить это будет нельзя.",

    // Three plural forms, as every count-bearing Russian string in this record
    // has: 1 рунное слово, 2 рунных слова, 5 рунных слов. Zero takes the many
    // form — «будет отмечено 0 рунных слов» — which is the reading a player
    // gets when the file was wrong, and it has to be grammatical.
    confirmCount: (count: number) =>
      `Из файла будет отмечено ${count} ${plural(count, "рунное слово", "рунных слова", "рунных слов")}.`,

    confirmAccept: "Заменить",
    confirmCancel: "Отмена",
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
    // **Corrected on review: the marker is now Cyrillic «Л».** It was Latin
    // `L` on the reasoning that a Cyrillic letter would abbreviate a word the
    // game does not use. Every source contradicts that: the official
    // localisation's guide speaks of «рейтингового сезона ладдера» and
    // «ладдерные слова», diablo2-resurrected.ru marks these records «Только для
    // сезонных (ладдерных) персонажей», and duskworld.ru writes «в рейтинговом
    // режиме (ладдере)». «Ладдер» is the audience's own loanword, so «Л»
    // abbreviates a word that is genuinely used — and it stops one Latin letter
    // sitting in a page that is otherwise entirely Russian.
    //
    // The meaning is the item text as diablo2-resurrected.ru transcribes it,
    // which glosses the loanword with «сезонных» rather than assuming it:
    // the sources between them use both words, and stating both is what a
    // tooltip is for.
    ladderMarker: "Л",
    ladderMeaning: "Только для сезонных (ладдерных) персонажей",
    noteMarker: "Примечание",
    patchMeaning: (patch: string) => `Добавлено в патче ${patch}`,
  },

  crafted: {
    // The name arrives already projected — `CraftedToggle` reads it from the
    // dataset's locale projection, so a Russian sentence names a runeword in
    // Russian while storage keeps the canonical English name it toggles by.
    // «Созданное» agrees with «рунное слово» (neuter), which the sentence names
    // so the agreement has a visible referent whatever the name inside it is.
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
    title: "Оставшиеся руны и базы",
    runesSection: "Руны",
    basesSection: "Предметные базы",

    // Project copy, as the English labels are: the dataset's tier identifiers
    // are not the game's words, so there is no client term to source.
    tier: {
      common: "Обычные",
      semirare: "Нечастые",
      rare: "Редкие",
    },

    runeCount: (count: number) => `×${count}`,
    // "Гнездо" — the official localisation's word for a socket, on items and
    // in Larzuk's reward alike, and the word its runeword guide counts recipes
    // in («{2 гнезда}»). Three forms: 1 гнездо, 2 гнезда, 5 гнёзд.
    baseSockets: (sockets: number) =>
      `${sockets} ${plural(sockets, "гнездо", "гнезда", "гнёзд")}`,
    // Governed by «для», so the noun is genitive and only the one-form differs:
    // «для 1 рунного слова», «для 2 рунных слов», «для 21 рунного слова».
    baseCount: (count: number) =>
      `подойдёт для ${count} ${plural(count, "рунного слова", "рунных слов", "рунных слов")}`,

    runesDone: "Руны не нужны — все рунные слова созданы",
    basesDone: "Базы не нужны — все рунные слова созданы",
  },

  detail: {
    runes: "Руны",
    sockets: "Гнёзда",
    itemTypes: "Предметные базы",
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
