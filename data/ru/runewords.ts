// Russian labels for all 99 runewords, keyed by canonical English name.
//
// **The source of record is the game's own official Russian localisation.**
// The project cannot read the client itself, but two things stand in for it:
// noob-club.ru transcribes its runeword text in full, and a reader with the game
// open checked the terms the transcription left doubtful. Where those two
// disagree the client wins — it caught a transcription typo on `Shael`. The
// transcription is what every line here is checked against:
//
//   https://www.noob-club.ru/index.php?topic=70236.0
//   https://www.noob-club.ru/index.php?topic=73463.0 (ladder seasons 1-3)
//
// 918 of the 969 property lines appear there verbatim and 11 more appear with
// different numbers, so 96% of this file is quoted rather than composed. Of the
// 40 that are not:
//
//   - 25 belong to records the guide predates — the Reign of the Warlock and
//     recent-season runewords — and are transcribed from
//     https://diablo2-resurrected.ru/runnie-slova-runi.htm
//     then rewritten onto the official localisation's own conventions.
//   - 15 are the per-level formulas, and those are a deliberate departure
//     rather than a gap. The client writes them as `+(2*clvl) к защите`, with
//     the character-level variable left in Latin; this ships
//     `+2*ур к защите` — diablo2-resurrected.ru's own rendering — because the
//     requirement this change exists to satisfy is strictly one language on
//     screen, and one Latin token on an otherwise entirely Russian page breaks
//     it. The maintainer chose this knowingly. It is the only place the project
//     declines to quote the client.
//
// Every entry's `source` says which case it is; the generator keeps the field
// out of the emitted JSON.
//
// Those conventions are worth stating, because they are not the community
// site's and the difference is visible on nearly a third of the lines:
//
//   - A range that rolls per item is bracketed — `+(200-260)% к урону` — and a
//     fixed damage span is not: `+5-30 урона от огня`.
//   - There are no editorial glosses: `Урон уменьшен на 8%`, never
//     `Урон [от получаемых физических атак] уменьшен на 8%`.
//   - Charges read `"Покров теней" 13-го уровня (9/9 зарядов)`, and per-level
//     formulas `+(2*clvl) к защите (зависит от уровня персонажа)`.
//   - A level is always written out: `15-го уровня`, never `15-го ур.`.
//
// No entry is machine-translated. Where the sources disagree the note records
// the disagreement and the choice made, and the official localisation wins —
// including where it contradicts itself, as it does on `Weaken`.
//
// Property lines are aligned one-to-one with the English lines of the same
// record, in the same group order; the schema enforces that parity.
import type { RunewordTranslation } from "./types.ts";

export const runewordTranslations: Record<string, RunewordTranslation> = {
  "Ancient's Pledge": {
    name: "Клятва Древних",
    propertyGroups: [
      {
        properties: [
          "+50% к защите",
          "+43% к сопротивлению льду",
          "+48% к сопротивлению огню",
          "+48% к сопротивлению молнии",
          "+48% к сопротивлению яду",
          "+10% к урону, приходящемуся на ману",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s1 — name: the official localisation spells this «Клятва Древних»; diablo2-resurrected.ru writes «Клятва древних»; name: landofgames.ru prefers «Присяга Древних»; the official localisation's name kept; site writes this line with and without an editorial «[получаемому]»; the plain form chosen",
  },
  Black: {
    name: "Мрак",
    propertyGroups: [
      {
        properties: [
          "+120% к урону",
          "+40% к вероятности нанести сокрушающий удар",
          "+200 к рейтингу атаки",
          "+3-14 урона от льда",
          "+10 к живучести",
          "+15% к скорости атаки",
          "Отбрасывает врагов",
          "-2 к магическому урону",
          '"Взрыв трупа" 4-го уровня (12/12 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#13 — name: landofgames.ru prefers «Тьма»; the official localisation's name kept; the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention; site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Fury: {
    name: "Неистовство",
    propertyGroups: [
      {
        properties: [
          "+209% к урону",
          "+40% к скорости атаки",
          "Запрещает монстрам лечиться",
          "+66% к вероятности нанести открытую рану",
          "+33% к вероятности нанести смертельный удар",
          "Игнорирует защиту цели",
          "-25% к защите цели",
          "+20% к рейтингу атаки",
          "Похищает 6% здоровья за удар",
          '+5 к умению "Берсерк" (только для варваров)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#43 — site's Fury entry writes «к рейтингу защиты» for this line — a transcription error; «к рейтингу атаки» per its other entries; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; site's runewords page names this skill «Берсерк», contradicting its own skill pages where Frenzy is «Ярость» and Berserk is «Берсерк»; the skill pages win; 1 of 10 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  "Holy Thunder": {
    name: "Божественный гром",
    propertyGroups: [
      {
        properties: [
          "+60% к урону",
          "-25% к защите цели",
          "+5-30 урона от огня",
          "+21-110 урона от молнии",
          "+75 урона от яда за 5 сек.",
          "+10 к максимальному урону",
          "+60% к сопротивлению молнии",
          "+5% к максимальному сопротивлению молнии",
          '+3 к умению "Священная молния" (только для паладинов)',
          '"Цепная молния" 7-го уровня (60/60 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#5 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); name corrected by the project owner from the sources' «Буря Света» to the official «Божественный гром»",
  },
  Honor: {
    name: "Честь",
    propertyGroups: [
      {
        properties: [
          "+160% к урону",
          "+9 к минимальному урону",
          "+9 к максимальному урону",
          "+25% к вероятности нанести смертельный удар",
          "+250 к рейтингу атаки",
          "+1 ко всем умениям",
          "Похищает 7% здоровья за удар",
          "Восполняет +10 здоровья",
          "+10 к силе",
          "+1 к радиусу обзора",
          "+2 к мане при убийстве",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#10 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  "King's Grace": {
    name: "Милость короля",
    propertyGroups: [
      {
        properties: [
          "+100% к урону",
          "+100% к урону по демонам",
          "+50% урона по нежити",
          "+5-30 урона от огня",
          "+3-14 урона от льда",
          "+150 к рейтингу атаки",
          "+100 к рейтингу атаки против демонов",
          "+100 к рейтингу атаки против нежити",
          "Похищает 7% здоровья за удар",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#8 — the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Leaf: {
    name: "Лист",
    itemTypeRestriction: "кроме сфер и жезлов",
    propertyGroups: [
      {
        properties: [
          "+5-30 урона от огня",
          "+3 к умениям огня",
          '+3 к умению "Стрела огня"',
          '+3 к умению "Инферно"',
          '+3 к умению "Тепло"',
          "+2 к мане при убийстве",
          "+2*ур к защите (зависит от уровня персонажа)",
          "+33% к сопротивлению льду",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#3 — per-level line transcribed from the primary source's «*ур» convention; 1 of 8 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Lionheart: {
    name: "Львиное сердце",
    propertyGroups: [
      {
        properties: [
          "+20% к урону",
          "Требования -15%",
          "+25 к силе",
          "+10 к энергии",
          "+20 к живучести",
          "+15 к ловкости",
          "+50 к здоровью",
          "+30 к сопротивлению всем видам урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a5 — site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  Lore: {
    name: "История",
    propertyGroups: [
      {
        properties: [
          "+1 ко всем умениям",
          "+10 к энергии",
          "+2 к мане при убийстве",
          "+30% к сопротивлению молнии",
          "-7 к урону",
          "+2 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h2",
  },
  Malice: {
    name: "Злоба",
    propertyGroups: [
      {
        properties: [
          "+33% к урону",
          "+9 к максимальному урону",
          "+100% к вероятности нанести открытую рану",
          "-25% к защите цели",
          "-100 к защите от монстров за удар",
          "Запрещает монстрам лечиться",
          "+50 к рейтингу атаки",
          "Похищает -5 здоровья",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#2",
  },
  Melody: {
    name: "Мелодия",
    propertyGroups: [
      {
        properties: [
          "+50% к урону",
          "+300% урона по нежити",
          "+3 к умениям обращения с луками и арбалетами (только для амазонок)",
          '+3 к умению "Критический удар" (только для амазонок)',
          '+3 к умению "Уклонение" (только для амазонок)',
          '+3 к умению "Замедление снарядов" (только для амазонок)',
          "+20% к скорости атаки",
          "+10 к ловкости",
          "Отбрасывает врагов",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#15",
  },
  Memory: {
    name: "Память",
    itemTypeRestriction: "кроме сфер и жезлов",
    propertyGroups: [
      {
        properties: [
          "+3 к умениям волшебницы",
          "+33% к скорости применения умений",
          "+20% к максимальному запасу маны",
          '+3 к умению "Энергетический щит" (только для волшебниц)',
          '+2 к умению "Статическое поле" (только для волшебниц)',
          "+10 к энергии",
          "+10 к живучести",
          "+9 к минимальному урону",
          "-25% к защите цели",
          "-7 к магическому урону",
          "+50% к защите",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#14 — site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen",
  },
  Nadir: {
    name: "Упадок",
    propertyGroups: [
      {
        properties: [
          "+50% к защите",
          "+10 к защите",
          "+30 к защите от снарядов",
          '"Покров теней" 13-го уровня (9/9 зарядов)',
          "+2 к мане при убийстве",
          "+5 к силе",
          "-33% к золоту за убийство монстров",
          "-3 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h1 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Radiance: {
    name: "Сияние",
    propertyGroups: [
      {
        properties: [
          "+75% к защите",
          "+30 к защите от снарядов",
          "+10 к энергии",
          "+10 к живучести",
          "+15% к урону, приходящемуся на ману",
          "-3 к магическому урону",
          "+33 к мане",
          "-7 к урону",
          "+5 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h3 — site writes this line with and without an editorial «[получаемому]»; the plain form chosen; site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen",
  },
  Rhyme: {
    name: "Рифма",
    propertyGroups: [
      {
        properties: [
          "Вероятность 20% заблокировать удар",
          "+40% к скорости блока",
          "+25 к сопротивлению всем видам урона",
          "Восполняет 15% маны",
          "Нельзя заморозить",
          "+50% к золоту за убийство монстров",
          "+25% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s3 — site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  Silence: {
    name: "Тишина",
    propertyGroups: [
      {
        properties: [
          "+200% к урону",
          "+75% урона по нежити",
          "Требования -20%",
          "+20% к скорости атаки",
          "+50 к рейтингу атаки против нежити",
          "+2 ко всем умениям",
          "+75 к сопротивлению всем видам урона",
          "+20% к ускоренному восстановлению от удара",
          "Похищает 11% маны за удар",
          "+25% к вероятности обратить монстра в бегство при ударе",
          "При ударе ослепляет цель +33",
          "+2 к мане при убийстве",
          "+30% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#29 — site alternates «видам»/«типам»; the dominant «видам» chosen; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Smoke: {
    name: "Дым",
    propertyGroups: [
      {
        properties: [
          "+75% к защите",
          "+280 к защите от снарядов",
          "+50 к сопротивлению всем видам урона",
          "+20% к ускоренному восстановлению от удара",
          '"Ослабить" 6-го уровня (18/18 зарядов)',
          "+10 к энергии",
          "-1 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a4 — site alternates «видам»/«типам»; the dominant «видам» chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Stealth: {
    name: "Незаметность",
    propertyGroups: [
      {
        properties: [
          "-3 к магическому урону",
          "+6 к ловкости",
          "+15 к максимальной выносливости",
          "+30% к сопротивлению яду",
          "Восполняет 15% маны",
          "+25% к скорости ходьбы и бега",
          "+25% к скорости применения умений",
          "+25% к ускоренному восстановлению от удара",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a1 — site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen; 1 of 8 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Steel: {
    name: "Сталь",
    propertyGroups: [
      {
        properties: [
          "+20% к урону",
          "+3 к минимальному урону",
          "+3 к максимальному урону",
          "+50 к рейтингу атаки",
          "+50% к вероятности нанести открытую рану",
          "+25% к скорости атаки",
          "+2 к мане при убийстве",
          "+1 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#1",
  },
  Strength: {
    name: "Сила",
    propertyGroups: [
      {
        properties: [
          "+35% к урону",
          "+25% к вероятности нанести сокрушающий удар",
          "Похищает 7% здоровья за удар",
          "+2 к мане при убийстве",
          "+20 к силе",
          "+10 к живучести",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#7 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Venom: {
    name: "Яд",
    propertyGroups: [
      {
        properties: [
          "+25% к вероятности обратить монстра в бегство при ударе",
          "Запрещает монстрам лечиться",
          "Игнорирует защиту цели",
          "Похищает 7% маны за удар",
          '"Ядовитый взрыв" 15-го уровня (27/27 зарядов)',
          '"Кольцо яда" 13-го уровня (11/11 зарядов)',
          "+273 урона от яда за 6 сек.",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#23 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Wealth: {
    name: "Изобилие",
    propertyGroups: [
      {
        properties: [
          "+300% к золоту за убийство монстров",
          "+100% к вероятности найти магический предмет",
          "+2 к мане при убийстве",
          "+10 к ловкости",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a6 — name: landofgames.ru prefers «Богатство»; the official localisation's name kept",
  },
  White: {
    name: "Белизна",
    itemTypeRestriction: "некромант",
    propertyGroups: [
      {
        properties: [
          "+25% к вероятности обратить монстра в бегство при ударе",
          "+10 к живучести",
          "+3 к умениям ядов и костей (только для некромантов)",
          '+3 к умению "Костяной доспех" (только для некромантов)',
          '+2 к умению "Костяное копье" (только для некромантов)',
          '+4 к умению "Мастер скелетов" (только для некромантов)',
          "-4 к магическому урону",
          "+20% к скорости применения умений",
          "+13 к мане",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#12 — site's «+4 у умению» typo corrected to «к умению»; site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen; 1 of 9 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Zephyr: {
    name: "Зефир",
    propertyGroups: [
      {
        properties: [
          "+33% к урону",
          "+66 к рейтингу атаки",
          "+1-50 урона от молнии",
          "-25% к защите цели",
          "+25 к защите",
          "+25% к скорости ходьбы и бега",
          "+25% к скорости атаки",
          'Вероятность 7% применить умение "Смерч" 1-го уровня при получении урона',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#4",
  },
  Beast: {
    name: "Зверь",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Фанатизм" 9-го уровня',
          "+40% к скорости атаки",
          "+(240-270)% к урону",
          "+20% к вероятности нанести сокрушающий удар",
          "+25% к вероятности нанести открытую рану",
          '+3 к умению "Облик медведя"',
          '+3 к умению "Ликантропия"',
          "Запрещает монстрам лечиться",
          "+(25-40) к силе",
          "+10 к энергии",
          "+2 к мане при убийстве",
          '"Гризли" 13-го уровня (5/5 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#35 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Bramble: {
    name: "Терновник",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Шипы" (15-21)-го уровня',
          "+50% к ускоренному восстановлению от удара",
          "+(25-50)% урона умениями от яда",
          "+300 к защите",
          "+5% к максимальному запасу маны",
          "Восполняет 15% маны",
          "+5% к максимальному сопротивлению льду",
          "+30% к сопротивлению огню",
          "+100% к сопротивлению яду",
          "+13 к здоровью при убийстве",
          '"Терновый дух" 13-го уровня (33/33 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a17 — site's dominant spelling chosen over two one-off variants; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  "Breath of the Dying": {
    name: "Вздох умирающего",
    propertyGroups: [
      {
        properties: [
          'Вероятность 50% применить умение "Кольцо яда" 20-го уровня при убийстве',
          "Не теряет прочности",
          "+60% к скорости атаки",
          "+(350-400)% к урону",
          "+200% урона по нежити",
          "-25% к защите цели",
          "+50 к рейтингу атаки",
          "+50 к рейтингу атаки против нежити",
          "Похищает 7% маны за удар",
          "Похищает (12-15)% здоровья за удар",
          "Запрещает монстрам лечиться",
          "+30 ко всем характеристикам",
          "+1 к радиусу обзора",
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#52 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  "Call to Arms": {
    name: "Призыв к оружию",
    propertyGroups: [
      {
        properties: [
          "+1 ко всем умениям",
          "+40% к скорости атаки",
          "+(250-290)% к урону",
          "+5-30 урона от огня",
          "Похищает 7% здоровья за удар",
          '+(2-6) к умению "Боевой призыв"',
          '+(1-6) к умению "Боевые приказы"',
          '+(1-4) к умению "Боевой клич"',
          "Запрещает монстрам лечиться",
          "Восполняет +12 здоровья",
          "+30% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#30 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; 1 of 11 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Chaos: {
    name: "Хаос",
    itemTypeRestriction: "ассасин",
    propertyGroups: [
      {
        properties: [
          'Вероятность 9% применить умение "Морозная сфера" 11-го уровня при ударе',
          'Вероятность 11% применить умение "Залп молний" 9-го уровня при ударе',
          "+35% к скорости атаки",
          "+(290-340)% к урону",
          "+216-471 магического урона",
          "+25% к вероятности нанести открытую рану",
          '+1 к умению "Вихрь"',
          "+10 к силе",
          "+15 к здоровью при убийстве демона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#31",
  },
  "Chains of Honor": {
    name: "Цепи чести",
    propertyGroups: [
      {
        properties: [
          "+2 ко всем умениям",
          "+200% к урону по демонам",
          "+100% урона по нежити",
          "Похищает 8% здоровья за удар",
          "+70% к защите",
          "+20 к силе",
          "Восполняет +7 здоровья",
          "+65 к сопротивлению всем видам урона",
          "Урон уменьшен на 8%",
          "+25% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a19 — name: landofgames.ru prefers «Оковы чести»; the official localisation's name kept; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  "Crescent Moon": {
    name: "Полумесяц",
    propertyGroups: [
      {
        properties: [
          'Вероятность 10% применить умение "Цепная молния" 17-го уровня при ударе',
          'Вероятность 7% применить умение "Статическое поле" 13-го уровня при ударе',
          "+20% к скорости атаки",
          "+(180-220)% к урону",
          "Игнорирует защиту цели",
          "-35% к сопротивлению молнии у врага",
          "+25% к вероятности нанести открытую рану",
          "+(9-11) поглощаемого магического урона",
          "+2 к мане при убийстве",
          '"Призрачный волк" 18-го уровня (30/30 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#22 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Delirium: {
    name: "Бред",
    propertyGroups: [
      {
        properties: [
          'Вероятность 1% применить умение "Бред" 50-го уровня при получении урона *',
          'Вероятность 6% применить умение "Ментальный взрыв" 14-го уровня при получении урона',
          'Вероятность 14% применить умение "Устрашение" 13-го уровня при получении урона',
          'Вероятность 11% применить умение "Замешательство" 18-го уровня при ударе',
          "+2 ко всем умениям",
          "+261 к защите",
          "+10 к живучести",
          "+50% к золоту за убийство монстров",
          "+25% к вероятности найти магический предмет",
          '"Привлечение" 17-го уровня (60/60 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h5 — name: landofgames.ru prefers «Исступление»; the official localisation's name kept; on-striking Confuse line absent from the primary source's Delirium entry; phrased after its when-struck convention; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); 2 of 10 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Doom: {
    name: "Гибель",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Вулкан" 18-го уровня при ударе',
          'При надевании дает ауру "Священный холод" 12-го уровня',
          "+2 ко всем умениям",
          "+45% к скорости атаки",
          "+(330-370)% к урону",
          "-(40-60)% к сопротивлению льду у врага",
          "+20% к вероятности нанести смертельный удар",
          "+25% к вероятности нанести открытую рану",
          "Запрещает монстрам лечиться",
          "Замораживает цель +3",
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#47 — name: landofgames.ru prefers «Рок»; the official localisation's name kept",
  },
  Duress: {
    name: "Принуждение",
    propertyGroups: [
      {
        properties: [
          "+40% к ускоренному восстановлению от удара",
          "+(10-20)% к урону",
          "+37-133 урона от льда",
          "+15% к вероятности нанести сокрушающий удар",
          "+33% к вероятности нанести открытую рану",
          "+150-200% к защите",
          "Выносливость снижается на 20% медленнее",
          "+45% к сопротивлению льду",
          "+15% к сопротивлению молнии",
          "+15% к сопротивлению огню",
          "+15% к сопротивлению яду",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a10 — site's dominant spelling chosen over two one-off variants; the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention",
  },
  Enigma: {
    name: "Тайна",
    propertyGroups: [
      {
        properties: [
          "+2 ко всем умениям",
          "+45% к скорости ходьбы и бега",
          '+1 к умению "Телепортация"',
          "+(750-775) к защите",
          "+0.75*ур к силе (зависит от уровня персонажа)",
          "+5% к максимальному запасу здоровья",
          "Урон уменьшен на 8%",
          "+14 к здоровью при убийстве",
          "+15% к урону, приходящемуся на ману",
          "+1%*ур к вероятности найти магический предмет (зависит от уровня персонажа)",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a20 — name: landofgames.ru prefers «Энигма»; the official localisation's name kept; per-level line transcribed from the primary source's «*ур» convention; 2 of 10 property lines are not quoted from the official-localisation guide, 2 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Eternity: {
    name: "Вечность",
    propertyGroups: [
      {
        properties: [
          "Не теряет прочности",
          "+(260-310)% к урону",
          "+9 к минимальному урону",
          "Похищает 7% здоровья за удар",
          "+20% к вероятности нанести сокрушающий удар",
          "При ударе ослепляет цель",
          "Замедляет цель на 33%",
          "Восполняет 16% маны",
          "Восполняет +16 здоровья",
          "Нельзя заморозить",
          "+30% к вероятности найти магический предмет",
          '"Оживление" 8-го уровня (88/88 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#36 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); 1 of 12 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Exile: {
    name: "Изгнание",
    itemTypeRestriction: "паладин",
    propertyGroups: [
      {
        properties: [
          'Вероятность 15% применить умение "Похищение жизни" 5-го уровня при ударе',
          'При надевании дает ауру "Непокорность" (13-16)-го уровня',
          "+2 к Боевым аурам (только для паладинов)",
          "+30% к скорости блока",
          "Замораживает цель",
          "+(220-260)% к защите",
          "Восполняет +7 здоровья",
          "+5% к максимальному сопротивлению льду",
          "+5% к максимальному сопротивлению огню",
          "+25% к вероятности найти магический предмет",
          "Восполняет 1 ед. прочности каждые 4 сек.",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s6",
  },
  Famine: {
    name: "Голод",
    propertyGroups: [
      {
        properties: [
          "+30% к скорости атаки",
          "+(320-370)% к урону",
          "Игнорирует защиту цели",
          "+180-200 магического урона",
          "+50-200 урона от огня",
          "+51-250 урона от молнии",
          "+50-200 урона от льда",
          "Похищает 12% здоровья за удар",
          "Запрещает монстрам лечиться",
          "+10 к силе",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#42 — site alternates bracketed and bare ranges; the dominant bracketed form chosen; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; 1 of 10 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Gloom: {
    name: "Сумрак",
    propertyGroups: [
      {
        properties: [
          'Вероятность 15% применить умение "Лишение зрения" 3-го уровня при получении урона',
          "+10% к ускоренному восстановлению от удара",
          "+(200-260)% к защите",
          "+10 к силе",
          "+45 к сопротивлению всем видам урона",
          "Вдвое уменьшает время заморозки",
          "+5% к урону, приходящемуся на ману",
          "-3 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a11 — name: landofgames.ru prefers «Мрак»; the official localisation's name kept; site's dominant spelling chosen over two one-off variants; site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  "Hand of Justice": {
    name: "Длань Правосудия",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Огненный след" 36-го уровня при достижении нового уровня',
          'Вероятность 100% применить умение "Метеорит" 48-го уровня после смерти',
          'При надевании дает ауру "Священный огонь" 16-го уровня',
          "+33% к скорости атаки",
          "+(280-330)% к урону",
          "Игнорирует защиту цели",
          "Похищает 7% здоровья за удар",
          "-20% к сопротивлению огню у врага",
          "+20% к вероятности нанести смертельный удар",
          "При ударе ослепляет цель",
          "Замораживает цель +3",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#48 — name: the official localisation spells this «Длань Правосудия»; diablo2-resurrected.ru writes «Длань правосудия»; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  "Heart of the Oak": {
    name: "Сердце дуба",
    propertyGroups: [
      {
        properties: [
          "+3 ко всем умениям",
          "+40% к скорости применения умений",
          "+75% к урону по демонам",
          "+100 к рейтингу атаки против демонов",
          "+3-14 урона от льда",
          "Похищает 7% маны за удар",
          "+10 к ловкости",
          "Восполняет +20 здоровья",
          "+15% к максимальному запасу маны",
          "+(30-40) к сопротивлению всем видам урона",
          '"Древесный дух" 4-го уровня (25/25 зарядов)',
          '"Ворон" 14-го уровня (60/60 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#28 — the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Kingslayer: {
    name: "Цареубийца",
    propertyGroups: [
      {
        properties: [
          "+30% к скорости атаки",
          "+(230-270)% к урону",
          "-25% к защите цели",
          "+20% к рейтингу атаки",
          "+33% к вероятности нанести сокрушающий удар",
          "+50% к вероятности нанести открытую рану",
          '+1 к умению "Возмездие"',
          "Запрещает монстрам лечиться",
          "+10 к силе",
          "+40% к золоту за убийство монстров",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#25 — site's Fury entry writes «к рейтингу защиты» for this line — a transcription error; «к рейтингу атаки» per its other entries",
  },
  Passion: {
    name: "Страсть",
    propertyGroups: [
      {
        properties: [
          "+25% к скорости атаки",
          "+(160-210)% к урону",
          "+(50-80)% к рейтингу атаки",
          "+75% урона по нежити",
          "+50 к рейтингу атаки против нежити",
          "+1-50 урона от молнии",
          '+1 к умению "Берсерк"',
          '+1 к умению "Истовость"',
          "При ударе ослепляет цель +10",
          "+25% к вероятности обратить монстра в бегство при ударе",
          "+75% к золоту за убийство монстров",
          '"Сердце росомахи" 3-го уровня (12/12 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#19 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Prudence: {
    name: "Благоразумие",
    propertyGroups: [
      {
        properties: [
          "+25% к ускоренному восстановлению от удара",
          "+(140-170)% к защите",
          "+(25-35) к сопротивлению всем видам урона",
          "-3 к урону",
          "-17 к магическому урону",
          "+2 к мане при убийстве",
          "+1 к радиусу обзора",
          "Восполняет 1 ед. прочности раз в 4 сек.",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a14 — name: landofgames.ru prefers «Расчетливость»; the official localisation's name kept; site's dominant spelling chosen over two one-off variants",
  },
  Sanctuary: {
    name: "Убежище",
    propertyGroups: [
      {
        properties: [
          "+20% к ускоренному восстановлению от удара",
          "+20% к скорости блока",
          "Вероятность 20% заблокировать удар",
          "+(130-160)% к защите",
          "+250 к защите от снарядов",
          "+20 к ловкости",
          "+(50-70) к сопротивлению всем видам урона",
          "-7 к магическому урону",
          '"Замедление снарядов" 12-го уровня (60/60 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s5 — site's dominant spelling chosen over two one-off variants; site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Splendor: {
    name: "Великолепие",
    propertyGroups: [
      {
        properties: [
          "+1 ко всем умениям",
          "+10% к скорости применения умений",
          "+20% к скорости блока",
          "+(60-100)% к защите",
          "+10 к энергии",
          "Восполняет 15% маны",
          "+50% к золоту за убийство монстров",
          "+20% к вероятности найти магический предмет",
          "+3 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s4",
  },
  Stone: {
    name: "Камень",
    propertyGroups: [
      {
        properties: [
          "+60% к ускоренному восстановлению от удара",
          "+(250-290)% к защите",
          "+300 к защите от снарядов",
          "+16 к силе",
          "+16 к живучести",
          "+10 к энергии",
          "+15 к сопротивлению всем видам урона",
          '"Пылающий валун" 16-го уровня (80/80 зарядов)',
          '"Глиняный голем" 16-го уровня (16/16 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a12 — site's dominant spelling chosen over two one-off variants; site alternates «видам»/«типам»; the dominant «видам» chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Wind: {
    name: "Ветер",
    propertyGroups: [
      {
        properties: [
          'Вероятность 10% применить умение "Торнадо" 9-го уровня при ударе',
          "+20% к скорости ходьбы и бега",
          "+40% к скорости атаки",
          "+15% к ускоренному восстановлению от удара",
          "+(120-160)% к урону",
          "-50% к защите цели",
          "+50 к рейтингу атаки",
          "При ударе ослепляет цель",
          "+1 к радиусу обзора",
          '"Смерч" 13-го уровня (127/127 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#34 — site's dominant spelling chosen over two one-off variants; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Brand: {
    name: "Клеймо",
    propertyGroups: [
      {
        properties: [
          'Вероятность 35% применить умение "Усиление урона" 14-го уровня при получении урона',
          'Вероятность 100% применить умение "Костяное копье" 18-го уровня при ударе',
          "+(260-340)% к урону",
          "Игнорирует защиту цели",
          "+20% к рейтингу атаки",
          "+(280-330)% к урону по демонам",
          "+20% к вероятности нанести смертельный удар",
          "Запрещает монстрам лечиться",
          "Отбрасывает врагов",
          "Взрывные стрелы или болты (15-го уровня)",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#39",
  },
  Death: {
    name: "Смерть",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Цепная молния" 44-го уровня после смерти',
          'Вероятность 25% применить умение "Ледяной шип" 18-го уровня при атаке',
          "Не теряет прочности",
          "+(300-385)% к урону",
          "+20% к рейтингу атаки",
          "+50 к рейтингу атаки",
          "+1-50 урона от молнии",
          "Похищает 7% маны за удар",
          "+50% к вероятности нанести сокрушающий удар",
          "+0.5%*ур к вероятности нанести смертельный удар (зависит от уровня персонажа)",
          "+1 к радиусу обзора",
          '"Кровяной голем" 22-го уровня (15/15 зарядов)',
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#27 — site's Fury entry writes «к рейтингу защиты» for this line — a transcription error; «к рейтингу атаки» per its other entries; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; per-level line transcribed from the primary source's «*ур» convention; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); 1 of 13 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Destruction: {
    name: "Разрушение",
    propertyGroups: [
      {
        properties: [
          'Вероятность 23% применить умение "Вулкан" 12-го уровня при ударе',
          'Вероятность 5% применить умение "Пылающий валун" 23-го уровня при ударе',
          'Вероятность 100% применить умение "Метеорит" 45-го уровня после смерти',
          'Вероятность 15% применить умение "Кольцо молний" 22-го уровня при атаке',
          "+350% к урону",
          "Игнорирует защиту цели",
          "+100-180 магического урона",
          "Похищает 7% маны за удар",
          "+20% к вероятности нанести сокрушающий удар",
          "+20% к вероятности нанести смертельный удар",
          "Запрещает монстрам лечиться",
          "+10 к ловкости",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#40 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Dragon: {
    name: "Дракон",
    propertyGroups: [
      {
        properties: [
          'Вероятность 20% применить умение "Яд" 18-го уровня при получении урона',
          'Вероятность 12% применить умение "Гидра" 15-го уровня при ударе',
          'При надевании дает ауру "Священный огонь" 14-го уровня',
          "+360 к защите",
          "+230 к защите от снарядов",
          "+(3-5) ко всем характеристикам",
          "+0.375*ур к силе (зависит от уровня персонажа)",
          "+5% к максимальной мане (только для брони)",
          "+50 к мане",
          "+5% к максимальному сопротивлению молнии",
          "-7 к урону",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a18 — per-level line transcribed from the primary source's «*ур» convention; the site splits this record into per-base entries; the base qualifier is restated inline to mirror the English line; 2 of 11 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Dream: {
    name: "Мечта",
    propertyGroups: [
      {
        properties: [
          'Вероятность 10% применить умение "Замешательство" 15-го уровня при получении урона',
          'При надевании дает ауру "Священная молния" 15-го уровня',
          "+(20-30)% к ускоренному восстановлению от удара",
          "+30% к защите",
          "+(150-220) к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "+50 к здоровью",
          "+0.625*ур к мане (зависит от уровня персонажа)",
          "+(5-20) к сопротивлению всем видам урона",
          "+(12-25)% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h7 — the site splits this record into per-base entries; the base qualifier is restated inline to mirror the English line; per-level line transcribed from the primary source's «*ур» convention; 2 of 11 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Edge: {
    name: "Острие",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Шипы" 15-го уровня',
          "+35% к скорости атаки",
          "+(320-380)% к урону по демонам",
          "+280% урона по нежити",
          "+75 урона от яда за 5 сек.",
          "Похищает 7% здоровья за удар",
          "Запрещает монстрам лечиться",
          "+(5-10) ко всем характеристикам",
          "+2 к мане при убийстве",
          "Снижает цены у торговцев на 15%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#9 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Faith: {
    name: "Вера",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Фанатизм" (12-15)-го уровня',
          "+(1-2) ко всем умениям",
          "+330% к урону",
          "Игнорирует защиту цели",
          "+300% к рейтингу атаки",
          "+75% урона по нежити",
          "+50 к рейтингу атаки против нежити",
          "+120 урона от огня",
          "+15 к сопротивлению всем видам урона",
          "Вероятность 10% оживить монстра",
          "+75% к золоту за убийство монстров",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#41 — site's Fury entry writes «к рейтингу защиты» for this line — a transcription error; «к рейтингу атаки» per its other entries; site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  Fortitude: {
    name: "Сила духа",
    propertyGroups: [
      {
        properties: [
          'Вероятность 20% применить умение "Леденящий доспех" 15-го уровня при получении урона',
          "+25% к скорости применения умений",
          "+300% к урону",
          "+9 к минимальному урону",
          "+50 к рейтингу атаки",
          "+20% к вероятности нанести смертельный удар",
          "+25% к вероятности обратить монстра в бегство при ударе",
          "+200% к защите",
          "+1*ур к здоровью (зависит от уровня персонажа)",
          "+(25-30) к сопротивлению всем видам урона",
          "+12% к урону, приходящемуся на ману",
          "+1 к радиусу обзора",
        ],
      },
      {
        properties: [
          'Вероятность 20% применить умение "Леденящий доспех" 15-го уровня при получении урона',
          "+25% к скорости применения умений",
          "+300% к урону",
          "+200% к защите",
          "+15 к защите",
          "+1*ур к здоровью (зависит от уровня персонажа)",
          "Восполняет +7 здоровья",
          "+5% к максимальному сопротивлению молнии",
          "+(25-30) к сопротивлению всем видам урона",
          "-7 к урону",
          "+12% к урону, приходящемуся на ману",
          "+1 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#32 — name: landofgames.ru prefers «Стойкость»; the official localisation's name kept; per-level line transcribed from the primary source's «*ур» convention; 2 of 24 property lines are not quoted from the official-localisation guide, 2 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Grief: {
    name: "Печаль",
    propertyGroups: [
      {
        properties: [
          'Вероятность 35% применить умение "Яд" 15-го уровня при ударе',
          "+(30-40)% к скорости атаки",
          "+(340-400) к урону",
          "Игнорирует защиту цели",
          "-25% к защите цели",
          "+1.875%*ур к урону по демонам (зависит от уровня персонажа)",
          "+5-30 урона от огня",
          "-(20-25)% к сопротивлению яду у врага",
          "+20% к вероятности нанести смертельный удар",
          "Запрещает монстрам лечиться",
          "+2 к мане при убийстве",
          "+(10-15) к здоровью при убийстве",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#33 — per-level line transcribed from the primary source's «*ур» convention; 1 of 12 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Harmony: {
    name: "Гармония",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Бодрость" 10-го уровня',
          "+(200-275)% к урону",
          "+9 к минимальному урону",
          "+9 к максимальному урону",
          "+55-160 урона от молнии",
          "+55-160 урона от огня",
          "+55-160 урона от льда",
          '+(2-6) к умению "Валькирия"',
          "+10 к ловкости",
          "Восполняет 20% маны",
          "+2 к мане при убийстве",
          "+2 к радиусу обзора",
          '"Оживление" 20-го уровня (25/25 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#16 — site alternates bracketed and bare ranges; the dominant bracketed form chosen; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Ice: {
    name: "Лёд",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Снежная буря" 40-го уровня при достижении нового уровня',
          'Вероятность 25% применить умение "Кольцо льда" 22-го уровня при ударе',
          'При надевании дает ауру "Священный холод" 18-го уровня',
          "+20% к скорости атаки",
          "+(140-210)% к урону",
          "Игнорирует защиту цели",
          "+(25-30)% к урону от умений льда",
          "-20% к сопротивлению льду у врага",
          "Похищает 7% здоровья за удар",
          "+20% к вероятности нанести смертельный удар",
          "+3.125*ур к золоту за убийство монстров (зависит от уровня персонажа)",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#44 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; per-level line transcribed from the primary source's «*ур» convention; the site writes a stray «%» on this flat-gold line, dropped here; 1 of 11 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Infinity: {
    name: "Бесконечность",
    propertyGroups: [
      {
        properties: [
          'Вероятность 50% применить умение "Цепная молния" 20-го уровня при убийстве',
          'При надевании дает ауру "Осуждение" 12-го уровня',
          "+35% к скорости ходьбы и бега",
          "+(255-325)% к урону",
          "-(45-55)% к сопротивлению молнии у врага",
          "+40% к вероятности нанести сокрушающий удар",
          "Запрещает монстрам лечиться",
          "+0.5*ур к живучести (зависит от уровня персонажа)",
          "+30% к вероятности найти магический предмет",
          '"Ураганный доспех" 21-го уровня (30/30 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#37 — per-level line transcribed from the primary source's «*ур» convention; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); 1 of 10 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Insight: {
    name: "Прозрение",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Медитация" (12-17)-го уровня',
          "+35% к скорости применения умений",
          "+(200-260)% к урону",
          "+9 к минимальному урону",
          "+(180-250)% к рейтингу атаки",
          "+5-30 урона от огня",
          "+75 урона от яда за 5 сек.",
          '+(1-6) к умению "Критический удар"',
          "+5 ко всем характеристикам",
          "+2 к мане при убийстве",
          "+23% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#11 — 1 of 11 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  "Last Wish": {
    name: "Последняя воля",
    propertyGroups: [
      {
        properties: [
          'Вероятность 6% применить умение "Уход в тень" 11-го уровня при получении урона',
          'Вероятность 10% применить умение "Похищение жизни" 18-го уровня при ударе',
          'Вероятность 20% применить умение "Залп молний" 20-го уровня при атаке',
          'При надевании дает ауру "Мощь" 17-го уровня',
          "+(330-375)% к урону",
          "Игнорирует защиту цели",
          "+(60-70)% к вероятности нанести сокрушающий удар",
          "Запрещает монстрам лечиться",
          "При ударе ослепляет цель",
          "+0.5%*ур к вероятности найти магический предмет (зависит от уровня персонажа)",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#45 — name: landofgames.ru prefers «Последнее желание»; the official localisation's name kept; per-level line transcribed from the primary source's «*ур» convention; 1 of 10 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Lawbringer: {
    name: "Судия",
    propertyGroups: [
      {
        properties: [
          'Вероятность 20% применить умение "Одряхление" 15-го уровня при ударе',
          'При надевании дает ауру "Убежище" (16-18)-го уровня',
          "-50% к защите цели",
          "+150-210 урона от огня",
          "+130-180 урона от льда",
          "Похищает 7% здоровья за удар",
          "Убитые монстры не возрождаются",
          "+(200-250) к защите от снарядов",
          "+10 к ловкости",
          "+75% к золоту за убийство монстров",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#21 — name: landofgames.ru prefers «Законотворец»; the official localisation's name kept; site alternates bracketed and bare ranges; the dominant bracketed form chosen; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  Oath: {
    name: "Клятва",
    propertyGroups: [
      {
        properties: [
          'Вероятность 30% применить умение "Костяной дух" 20-го уровня при ударе',
          "Не теряет прочности",
          "+50% к скорости атаки",
          "+(210-340)% к урону",
          "+75% к урону по демонам",
          "+100 к рейтингу атаки против демонов",
          "Запрещает монстрам лечиться",
          "+10 к энергии",
          "+(10-15) поглощаемого магического урона",
          '"Сердце росомахи" 16-го уровня (20/20 зарядов)',
          '"Железный голем" 17-го уровня (14/14 зарядов)',
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#24 — charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); 2 of 11 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Obedience: {
    name: "Послушание",
    propertyGroups: [
      {
        properties: [
          'Вероятность 30% применить умение "Чары" 21-го уровня при убийстве',
          "+40% к ускоренному восстановлению от удара",
          "+370% к урону",
          "-25% к защите цели",
          "+3-14 урона от льда",
          "-25% к сопротивлению огню у врага",
          "+40% к вероятности нанести сокрушающий удар",
          "+(200-300) к защите",
          "+10 к силе",
          "+10 к ловкости",
          "+(20-30) к сопротивлению всем видам урона",
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#18 — name: landofgames.ru prefers «Покорность»; the official localisation's name kept; the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention",
  },
  Phoenix: {
    name: "Феникс",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Огненный след" 40-го уровня при достижении нового уровня',
          'Вероятность 40% применить умение "Огненная буря" 22-го уровня при ударе',
          'При надевании дает ауру "Искупление" (10-15)-го уровня',
          "+(350-400)% к урону",
          "Игнорирует защиту цели",
          "Похищает 14% маны за удар",
          "-28% к сопротивлению огню у врага",
          "+20% к вероятности нанести смертельный удар",
          "+(350-400) к защите от снарядов",
          "+(15-21) к поглощению огня",
        ],
      },
      {
        properties: [
          'Вероятность 100% применить умение "Огненный след" 40-го уровня при достижении нового уровня',
          'Вероятность 40% применить умение "Огненная буря" 22-го уровня при ударе',
          'При надевании дает ауру "Искупление" (10-15)-го уровня',
          "+(350-400) к защите от снарядов",
          "+(350-400)% к урону",
          "-28% к сопротивлению огню у врага",
          "+50 к здоровью",
          "+5% к максимальному сопротивлению молнии",
          "+10% к максимальному сопротивлению огню",
          "+(15-21) к поглощению огня",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#46 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; 1 of 20 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Pride: {
    name: "Гордость",
    propertyGroups: [
      {
        properties: [
          'Вероятность 25% применить умение "Огненная стена" 17-го уровня при получении урона',
          'При надевании дает ауру "Сосредоточенность" (16-20)-го уровня',
          "+(260-300)% к рейтингу атаки",
          "+1%*ур к урону по демонам (зависит от уровня персонажа)",
          "+50-280 урона от молнии",
          "+20% к вероятности нанести смертельный удар",
          "При ударе ослепляет цель",
          "Замораживает цель +3",
          "+10 к живучести",
          "Восполняет +8 здоровья",
          "+1.875%*ур к золоту за убийство монстров (зависит от уровня персонажа)",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#49 — name: landofgames.ru prefers «Гордыня»; the official localisation's name kept; per-level line transcribed from the primary source's «*ур» convention; 2 of 11 property lines are not quoted from the official-localisation guide, 2 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Rift: {
    name: "Разлом",
    propertyGroups: [
      {
        properties: [
          'Вероятность 20% применить умение "Торнадо" 16-го уровня при ударе',
          'Вероятность 16% применить умение "Морозная сфера" 21-го уровня при атаке',
          "+20% к рейтингу атаки",
          "+160-250 магического урона",
          "+60-180 урона от огня",
          "+(5-10) ко всем характеристикам",
          "+10 к ловкости",
          "+38% к урону, приходящемуся на ману",
          "+75% к золоту за убийство монстров",
          '"Железная дева" 15-го уровня (40/40 зарядов)',
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#26 — site's Fury entry writes «к рейтингу защиты» for this line — a transcription error; «к рейтингу атаки» per its other entries; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/)",
  },
  Spirit: {
    name: "Дух",
    propertyGroups: [
      {
        properties: [
          "+2 ко всем умениям",
          "+(25-35)% к скорости применения умений",
          "+55% к ускоренному восстановлению от удара",
          "+1-50 урона от молнии",
          "+3-14 урона от льда",
          "+75 урона от яда за 5 сек.",
          "Похищает 7% здоровья за удар",
          "+250 к защите от снарядов",
          "+22 к живучести",
          "+(89-112) к мане",
          "+(3-8) поглощаемого магического урона",
        ],
      },
      {
        properties: [
          "+2 ко всем умениям",
          "+(25-35)% к скорости применения умений",
          "+55% к ускоренному восстановлению от удара",
          "+250 к защите от снарядов",
          "+22 к живучести",
          "+(89-112) к мане",
          "+35% к сопротивлению льду",
          "+35% к сопротивлению молнии",
          "+35% к сопротивлению яду",
          "+(3-8) поглощаемого магического урона",
          "Атакующий получает 14 урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#9a — site's dominant spelling chosen over two one-off variants; the primary source omits the cold-duration clause; duration phrased after its own poison-damage convention; site alternates «за удар»/«при ударе»; the dominant «за удар» chosen",
  },
  "Voice of Reason": {
    name: "Голос разума",
    propertyGroups: [
      {
        properties: [
          'Вероятность 15% применить умение "Морозная сфера" 13-го уровня при ударе',
          'Вероятность 18% применить умение "Ледяной удар" 20-го уровня при ударе',
          "+50 к рейтингу атаки",
          "+(220-350)% к урону по демонам",
          "+(355-375)% урона по нежити",
          "+50 к рейтингу атаки против нежити",
          "+100-220 урона от льда",
          "-24% к сопротивлению льду у врага",
          "+10 к ловкости",
          "Нельзя заморозить",
          "+75% к золоту за убийство монстров",
          "+1 к радиусу обзора",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#20 — name: landofgames.ru prefers «Глас разума»; the official localisation's name kept; site alternates bracketed and bare ranges; the dominant bracketed form chosen",
  },
  Wrath: {
    name: "Гнев",
    propertyGroups: [
      {
        properties: [
          'Вероятность 30% применить умение "Одряхление" 1-го уровня при ударе',
          'Вероятность 5% применить умение "Похищение жизни" 10-го уровня при ударе',
          "+375% к урону по демонам",
          "+100 к рейтингу атаки против демонов",
          "+250-300% урона по нежити",
          "+85-120 магического урона",
          "+41-240 урона от молнии",
          "+20% к вероятности нанести сокрушающий удар",
          "Запрещает монстрам лечиться",
          "+10 к энергии",
          "Нельзя заморозить",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#38 — 1 of 11 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Bone: {
    name: "Кость",
    itemTypeRestriction: "некромант",
    propertyGroups: [
      {
        properties: [
          'Вероятность 15% применить умение "Костяной доспех" 10-го уровня при получении урона',
          'Вероятность 15% применить умение "Костяное копье" 10-го уровня при ударе',
          "+2 к умениям некроманта",
          "+(100-150) к мане",
          "+30 к сопротивлению всем видам урона",
          "-7 к урону",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a9 — site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  Enlightenment: {
    name: "Просветление",
    itemTypeRestriction: "волшебница",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Огненный след" 15-го уровня при получении урона',
          'Вероятность 5% применить умение "Огненный шар" 15-го уровня при ударе',
          "+2 к умениям волшебницы",
          '+1 к умению "Тепло"',
          "+30% к защите",
          "+30% к сопротивлению огню",
          "-7 к урону",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a8",
  },
  Myth: {
    name: "Миф",
    itemTypeRestriction: "варвар",
    propertyGroups: [
      {
        properties: [
          'Вероятность 3% применить умение "Рёв" 1-го уровня при получении урона',
          'Вероятность 10% применить умение "Провокация" 1-го уровня при ударе',
          "+2 к умениям варвара",
          "+30 к защите от снарядов",
          "Восполняет +10 здоровья",
          "Атакующий получает 14 урона",
          "Требования -15%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a2 — 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Peace: {
    name: "Покой",
    itemTypeRestriction: "амазонка",
    propertyGroups: [
      {
        properties: [
          'Вероятность 4% применить умение "Замедление снарядов" 5-го уровня при получении урона',
          'Вероятность 2% применить умение "Валькирия" 15-го уровня при ударе',
          "+2 к умениям амазонки",
          "+20% к ускоренному восстановлению от удара",
          '+2 к умению "Критический удар"',
          "+30% к сопротивлению льду",
          "Атакующий получает 14 урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a3 — site's dominant spelling chosen over two one-off variants",
  },
  Principle: {
    name: "Убеждение",
    itemTypeRestriction: "паладин",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Заряд света" 5-го уровня при ударе',
          "+2 к умениям паладина",
          "Выносливость снижается на 15% медленнее",
          "+5% к максимальному сопротивлению яду",
          "+30% к сопротивлению огню",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a15 — name: landofgames.ru prefers «Принцип»; the official localisation's name kept",
  },
  Rain: {
    name: "Дождь",
    itemTypeRestriction: "друид",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Ураганный доспех" 15-го уровня при получении урона',
          'Вероятность 5% применить умение "Смерч" 15-го уровня при ударе',
          "+2 к умениям друида",
          "+(100-150) к мане",
          "+30% к сопротивлению молнии",
          "-7 к магическому урону",
          "+15% к урону, приходящемуся на ману",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a13 — site writes this line with and without an editorial «[получаемому]»; the dominant bracketed form chosen",
  },
  Treachery: {
    name: "Вероломство",
    itemTypeRestriction: "ассасин",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Уход в тень" 15-го уровня при получении урона',
          'Вероятность 25% применить умение "Яд" 15-го уровня при ударе',
          "+2 к умениям ассасина",
          "+45% к скорости атаки",
          "+20% к ускоренному восстановлению от удара",
          "+30% к сопротивлению льду",
          "+50% к золоту за убийство монстров",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a7 — site's dominant spelling chosen over two one-off variants",
  },
  Plague: {
    name: "Чума",
    propertyGroups: [
      {
        properties: [
          'Вероятность 20% применить умение "Снижение сопротивления" 12-го уровня при получении урона',
          'Вероятность 25% применить умение "Кольцо яда" 15-го уровня при ударе',
          'При надевании даёт ауру "Очищение" (13-17)-го уровня',
          "+(1-2) ко всем умениям",
          "+20% к скорости атаки",
          "+(220-320)% к урону",
          "-23% к сопротивлению яду у врага",
          "+0.3%*ур к вероятности нанести смертельный удар (зависит от уровня персонажа)",
          "+25% к вероятности нанести открытую рану",
          "Замораживает цель +3",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#51 — per-level line transcribed from the primary source's «*ур» convention; 3 of 10 property lines are not quoted from the official-localisation guide, 1 of them the per-level formulas, which keep «*ур» rather than the client's Latin «clvl» so the page stays one language; those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Pattern: {
    name: "Узор",
    itemTypeRestriction: "ассасин",
    propertyGroups: [
      {
        properties: [
          "+30% к скорости блока",
          "+(40-80)% к урону",
          "+10% к рейтингу атаки",
          "+17-62 урона от огня",
          "+1-50 урона от молнии",
          "+3-14 урона от льда",
          "+75 урона от яда за 5 сек.",
          "+6 к силе",
          "+6 к ловкости",
          "+15 к сопротивлению всем видам урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#6 — site alternates bracketed and bare ranges; the dominant bracketed form chosen; site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  "Unbending Will": {
    name: "Непреклонность",
    propertyGroups: [
      {
        properties: [
          'Вероятность 18% применить умение "Провокация" 18-го уровня при ударе',
          "+3 к боевым навыкам (только для варваров)",
          "+(20-30)% к скорости атаки",
          "+(300-350)% к урону",
          "+9 к максимальному урону",
          "+50 к рейтингу атаки",
          "+75% урона по нежити",
          "+50 к рейтингу атаки против нежити",
          "Похищает (8-10)% здоровья за удар",
          "Запрещает монстрам лечиться",
          "+10 к силе",
          "+10 к живучести",
          "-8 к урону",
          "+1 к радиусу обзора",
          "Требования -20%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#17 — 2 of 15 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Wisdom: {
    name: "Мудрость",
    propertyGroups: [
      {
        properties: [
          "+33% к пронзающей атаке",
          "+(15-25)% к рейтингу атаки",
          "Похищает (4-8)% маны за удар",
          "+30% к защите",
          "+10 к энергии",
          "Выносливость снижается на 15% медленнее",
          "Нельзя заморозить",
          "+5 к мане при убийстве",
          "+15% к урону, приходящемуся на ману",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4",
  },
  Obsession: {
    name: "Помешательство",
    propertyGroups: [
      {
        properties: [
          "Не теряет прочности",
          'Вероятность 24% применить умение "Немощность" 10-го уровня при получении урона',
          "+4 ко всем умениям",
          "+65% к скорости применения умений",
          "+60% к ускоренному восстановлению от удара",
          "Отбрасывает врагов",
          "+10 к живучести",
          "+10 к энергии",
          "+(15-25)% к максимальному запасу здоровья",
          "Восполняет (15-30)% маны",
          "+(60-70) к сопротивлению всем видам урона",
          "+75% к золоту за убийство монстров",
          "+30% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#53 — site's dominant spelling chosen over two one-off variants; 1 of 13 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  "Flickering Flame": {
    name: "Мерцающее пламя",
    propertyGroups: [
      {
        properties: [
          'При надевании даёт ауру "Сопротивление огню" (4-8)-го уровня',
          "+3 к умениям огня",
          "-(10-15)% к сопротивлению огню у врага",
          "+30% к защите",
          "+30 к защите от снарядов",
          "+(50-75) к мане",
          "Вдвое уменьшает время заморозки",
          "+5% к максимальному сопротивлению огню",
          "Сокращает время действия яда на 50%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h6",
  },
  Mist: {
    name: "Туман",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Сосредоточенность" (8-12)-го уровня',
          "+3 ко всем умениям",
          "+20% к скорости атаки",
          "+100% к пронзающей атаке",
          "+(325-375)% к урону",
          "+9 к максимальному урону",
          "+20% к рейтингу атаки",
          "+3-14 урона от льда",
          "Замораживает цель +3",
          "+24 к живучести",
          "+40 к сопротивлению всем видам урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#50 — site alternates bracketed and bare ranges; the dominant bracketed form chosen; site alternates «видам»/«типам»; the dominant «видам» chosen",
  },
  Bulwark: {
    name: "Оплот",
    propertyGroups: [
      {
        properties: [
          "+20% к ускоренному восстановлению от удара",
          "Похищает (4-6)% здоровья за удар",
          "+(75-100)% к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "Восполняет +30 здоровья",
          "-7 к урону",
          "Физический урон уменьшен на (10-15)%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4_1 — site's dominant spelling chosen over two one-off variants",
  },
  Cure: {
    name: "Лекарство",
    propertyGroups: [
      {
        properties: [
          'При надевании дает ауру "Очищение" 1-го уровня',
          "+20% к ускоренному восстановлению от удара",
          "+(75-100)% к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "+(40-60)% к сопротивлению яду",
          "Сокращает время действия яда на 50%",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4_2 — normalised to the site's dominant aura phrasing; its Cure entry writes the one-off «Аура \"Очищение\" 1 уровня.»; site's dominant spelling chosen over two one-off variants; 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Ground: {
    name: "Земля",
    propertyGroups: [
      {
        properties: [
          "+20% к ускоренному восстановлению от удара",
          "+(75-100)% к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "+(40-60)% к сопротивлению молнии",
          "+(10-15)% к поглощению молнии",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4_3 — site's dominant spelling chosen over two one-off variants; 1 of 6 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Hearth: {
    name: "Очаг",
    propertyGroups: [
      {
        properties: [
          "+20% к ускоренному восстановлению от удара",
          "+(75-100)% к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "+(40-60)% к сопротивлению льду",
          "+(10-15)% к поглощению льда",
          "Нельзя заморозить",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4_4 — site's dominant spelling chosen over two one-off variants; 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Temper: {
    name: "Закалка",
    propertyGroups: [
      {
        properties: [
          "+20% к ускоренному восстановлению от удара",
          "+(75-100)% к защите",
          "+10 к живучести",
          "+5% к максимальному запасу здоровья",
          "+(40-60)% к сопротивлению огню",
          "+(10-15)% к поглощению огня",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h4_5 — site's dominant spelling chosen over two one-off variants; 1 of 6 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Mosaic: {
    name: "Мозаика",
    itemTypeRestriction: "ассасин",
    // Project-authored: the vendor note named Season 13, which went stale when
    // the disable continued. "В сезоне" matches the English "on ladder" without
    // pinning a number that will age out again.
    //
    // Corrected on review with the English note. This read «Можно создать в
    // одиночной игре вне ладдера» — one place, offline, qualified by "outside
    // ladder" — where two are allowed: non-ladder online and single-player
    // offline. The Russian was the worse of the two, because it named only the
    // offline case explicitly.
    note: "Отключено в сезоне! Вне сезона и в одиночной игре собрать можно.",
    propertyGroups: [
      {
        properties: [
          "+50% к вероятности не израсходовать заряды завершающими приёмами",
          "+2 к Боевым искусствам (только для ассасина)",
          "+20% к скорости атаки",
          "+(200-250)% к урону",
          "+20% к рейтингу атаки",
          "Похищает 7% здоровья за удар",
          "+(8-15)% к урону от умений льда",
          "+(8-15)% к урону от умений молнии",
          "+(8-15)% к урону от умений огня",
          "Запрещает монстрам лечиться",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#26_5 — 2 of 10 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru; note: project-authored Russian of the project's English override (vendor named Season 13; disable continued)",
  },
  Metamorphosis: {
    name: "Метаморфоза",
    itemTypeRestriction: "друид",
    propertyGroups: [
      {
        properties: [
          'Вероятность 100% применить умение "Метка волка" 1-го уровня при ударе',
          'Вероятность 100% применить умение "Метка медведя" 1-го уровня при ударе',
          "+5 к Смене облика (только для друидов)",
          "+25% к вероятности нанести сокрушающий удар",
          "+(50-80)% к защите",
          "+10 к силе",
          "+10 к живучести",
          "+10 к сопротивлению всем видам урона",
          "Нельзя заморозить",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h8 — Reign of the Warlock line phrased after the site's conventions; site alternates «видам»/«типам»; the dominant «видам» chosen; 3 of 9 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Authority: {
    name: "Власть",
    propertyGroups: [
      {
        properties: [
          'Вероятность 2% применить умение "Ментальный оберег" 10-го уровня при получении урона',
          'Вероятность 10% применить умение "Цепь Миазм" 15-го уровня при ударе',
          "+2 к умениям чернокнижника",
          "+(40-60)% к урону",
          "Требования -15%",
          "+20% к ускоренному восстановлению от удара",
          "+30% к сопротивлению огню",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a3_2 — site's dominant spelling chosen over two one-off variants; 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Coven: {
    name: "Ковен",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Печать: Летаргия" 10-го уровня при получении урона',
          "+1 ко всем умениям",
          "+20% к скорости применения умений",
          "+(30-50)% к защите",
          "+(1-5) здоровья при убийстве",
          "+(26-40)% к вероятности найти магический предмет",
          "+30% к сопротивлению огню",
          "+10 к живучести",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#h5_2 — 1 of 8 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Void: {
    name: "Бездна",
    propertyGroups: [
      {
        properties: [
          "+2 ко всем умениям",
          "+40% к скорости применения умений",
          "+(10-15)% к урону от магических умений",
          '+(1-3) к умению "Бездна"',
          "+(8-12) ко всем характеристикам",
          '"Одряхление" 4-го уровня (35/35 зарядов)',
          "+3-14 урона от льда",
          "Не теряет прочности",
          "+30% к вероятности найти магический предмет",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#54 — Abyss bonus is a +1-3 range (diablo2.io / Maxroll / D2Runewizard), not a fixed +1 to the level-3 skill; charge-skill line absent from the primary source's entry; phrased after its conventions, skill names verified against the primary source's own class skill pages (diablo2-resurrected.ru/Skills/); site alternates bracketed and bare ranges; the dominant bracketed form chosen; 1 of 9 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Vigilance: {
    name: "Бдительность",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Кольцо огня" 10-го уровня при получении урона',
          "+10% к скорости ходьбы и бега",
          "+30% к скорости блока",
          "+(20-40) к здоровью",
          "+(20-40) к мане",
          "+(25-35) к сопротивлению всем видам урона",
          "+(75-100)% к защите",
          "Восполняет +7 здоровья",
          "+5% к максимальному сопротивлению яду",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#s5_2",
  },
  Ritual: {
    name: "Ритуал",
    propertyGroups: [
      {
        properties: [
          'Вероятность 13% применить умение "Печать: Смерть" 1-го уровня при получении урона',
          "+40% к скорости атаки",
          "+(250-320)% к урону",
          "+(150-250)% к урону по демонам",
          "+(200-260)% к рейтингу атаки",
          "+(3-5) здоровья при убийстве",
          "Убитые монстры не возрождаются",
          "Похищает 7% здоровья за удар",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#30_2 — site alternates «за удар»/«при ударе»; the dominant «за удар» chosen; 1 of 8 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Mania: {
    name: "Мания",
    propertyGroups: [
      {
        properties: [
          'Вероятность 5% применить умение "Ускорение" 1-го уровня при ударе',
          'При надевании дает ауру "Фанатизм" 1-го уровня',
          "+30% к скорости атаки",
          "+(180-200)% к урону",
          "+75% урона по нежити",
          "+50 к рейтингу атаки против нежити",
          "+10 к ловкости",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#16_5 — 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
  Hysteria: {
    name: "Истерия",
    propertyGroups: [
      {
        properties: [
          "+65% к скорости ходьбы и бега",
          "+40% к скорости атаки",
          "+20% к ускоренному восстановлению от удара",
          "+6 к избежанию",
          "+10 к ловкости",
          "Выносливость снижается на 50% медленнее",
          "+10 к сопротивлению всем видам урона",
        ],
      },
    ],
    source:
      "https://www.noob-club.ru/index.php?topic=70236.0 — verified against the official localisation; transcribed from https://diablo2-resurrected.ru/runnie-slova-runi.htm#a4_5 — site's dominant spelling chosen over two one-off variants; 1 of 7 property lines are not quoted from the official-localisation guide (it predates this record); those follow its conventions, transcribed from diablo2-resurrected.ru",
  },
};
