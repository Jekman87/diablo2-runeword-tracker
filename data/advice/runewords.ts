// Usefulness judgements and crafting advice for all 99 runewords, keyed by
// canonical English name. Authored editorial content — nothing here has a
// vendor source, which is exactly why it lives beside `data/ru/` rather than
// in `vendor/` or the generator.
//
// **How the judgements were made.** The Maxroll runeword tier list is the
// starting point (S/A leaning meta, B/C situational, D/F chronicle), checked
// against Traderie completed-trade velocity — the time the newest 50 completed
// trades span, collected 2026-08-02 during the Reign of the Warlock season.
// The measured range runs from Call to Arms (50 trades in 8 hours) to Radiance
// (12 trades in four years). Where tier and velocity disagree the entry's note
// records the call. Recommended bases come from the same Traderie listings —
// sellers name the base item — crossed with build guides.
//
// **Russian prose is this project's own**, written against fan references —
// the strict game-client rule applies to the game vocabulary inside it (base
// item names, class names), not to the sentences. No machine translation.
//
// Every entry's `source` says where its reasoning came from; the generator
// keeps the field out of the emitted JSON.
import type { RunewordAdviceEntry } from "./types.ts";

export const runewordAdvice: Record<string, RunewordAdviceEntry> = {
  "Ancient's Pledge": {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Qual-Kehk's Act 5 quest reward hands you exactly these runes (Ral Ort Tal), so drop them into any 3-socket shield with decent block the moment you reach Nightmare; paladins should use a 3-socket paladin shield to stack its inherent resistances on top. Huge all-resistances for essentially free.",
        "It is purely a levelling stopgap until Spirit or a class shield takes over. Nobody trades it — craft your own and move on.",
      ],
      ru: [
        "Награда за квест Квал-Кека в 5-м акте — ровно эти руны (Ral Ort Tal), так что вставляйте их в любой щит с 3 гнёздами и нормальным блоком, как только добрались до Кошмара; паладину лучше взять паладинский щит с 3 гнёздами, чтобы его собственные резисты сложились с рунным словом. Огромные сопротивления практически даром.",
        "Это чисто временный щит на прокачку, пока не появится Spirit или классовый щит. Им никто не торгует — соберите свой и идите дальше.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll A; Traderie: no completed trades found; assignment rule: budget levelling shield nobody trades",
  },
  Black: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Make it in a 3-socket Flail — fast base, low requirements, and it is what most completed trades name. The draw is 40% Crushing Blow plus Knockback for three cheap runes.",
        "Classic budget boss-killer for a weapon swap: switch to it against act bosses to melt their health bar with Crushing Blow. Demand is thin — trades trickle through slowly — so craft your own rather than counting on selling one.",
      ],
      ru: [
        "Собирайте в цепе (Flail) с 3 гнёздами — быстрая база с низкими требованиями, и именно её называют большинство завершённых сделок. Главное здесь — 40% сокрушающего удара (Crushing Blow) и отбрасывание за три дешёвые руны.",
        "Классическое бюджетное оружие для добивания боссов на свопе: переключаетесь на него против боссов актов, и Crushing Blow быстро съедает их полоску жизни. Спрос вялый — сделки проходят редко, — так что проще собрать своё, чем рассчитывать на продажу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~13570h (very slow); top base Flail 38/50; kept situational as CB swap weapon",
  },
  Fury: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Once a niche attack-speed option for werewolf druids, but Grief-era it is thoroughly obsolete, and it eats a Jah rune — awful value for a D-tier word. Trades that do happen mostly name Phase Blade or Berserker Axe.",
        "For the Chronicle, use the cheapest 3-socket melee base you have and accept that the Jah is the real cost — leave this one for last, then vendor the result.",
      ],
      ru: [
        "Когда-то нишевый вариант на скорость атаки для друида-оборотня, но в эпоху Grief оно безнадёжно устарело, а требует руну Jah — ужасная цена за слово D-уровня. Те сделки, что случаются, чаще всего называют Фазовый клинок или Секиру берсерка.",
        "Для Хроники берите самую дешёвую базу ближнего боя с 3 гнёздами и смиритесь, что настоящая цена — это Jah. Оставьте это слово напоследок, а результат сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in ~1509h; top bases Phase Blade 25, Berserker Axe 11; chronicle but flagged Jah cost",
  },
  "Holy Thunder": {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A relic levelling scepter for zealots in Normal, nothing more. Craft it in the cheapest 4-socket War Scepter you find (that is what nearly all trades name) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Реликтовый скипетр для прокачки зилота в Нормале, не более того. Соберите в самом дешёвом боевом скипетре (War Scepter) с 4 гнёздами — именно его называют почти все сделки, — просто чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll F; 50 trades in ~21185h (dead); top base War Scepter 35/50; pure chronicle filler",
  },
  Honor: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "+1 to all skills on a melee weapon sounds nice at level 27, but the five cheap runes buy you a weapon you will replace within an act. Craft it in any cheap 5-socket melee base (trades mostly name a Zweihander) to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "+1 ко всем навыкам на оружии ближнего боя звучит неплохо на 27-м уровне, но пять дешёвых рун покупают оружие, которое вы смените в течение акта. Соберите в любой дешёвой базе ближнего боя с 5 гнёздами (в сделках чаще всего Цвайхандер), чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in ~2542h; top base Zweihander 18/50; chronicle filler with cheap runes",
  },
  "King's Grace": {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "An early-game sword/scepter with demon and undead damage that no build actually wants. Craft it in the cheapest 3-socket sword or scepter you have (a plain Crystal Sword works) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Меч или скипетр раннего этапа с уроном по демонам и нежити, который на деле не нужен ни одному билду. Соберите в самом дешёвом мече или скипетре с 3 гнёздами (подойдёт обычный Кристальный меч), чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; 47 trades in ~41235h (dead); bases scattered (Dimensional Blade 8, Crystal Sword 5); pure chronicle filler",
  },
  Leaf: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Tir Ral in a 2-socket staff — the best levelling weapon a fire sorceress can hold at level 19. Hunt for a base with +3 Fire Bolt or Fireball staffmods (Akara's shop in Normal often sells them); the runeword adds +3 to fire skills on top, and that staff carries you deep into Nightmare.",
        "The runes cost nothing, so almost everyone self-crafts. Trades exist but the bases are mostly plain low staves; a Leaf in a good-staffmod base sells occasionally to fresh sorceresses.",
      ],
      ru: [
        "Tir Ral в посохе с 2 гнёздами — лучшее оружие для прокачки огненной волшебницы на 19-м уровне. Ищите базу со стаффмодами +3 к Fire Bolt или Fireball (в Нормале такие часто продаёт Акара); рунное слово добавляет сверху +3 к навыкам огня, и этот посох тащит вас до глубин Кошмара.",
        "Руны стоят копейки, так что почти все собирают сами. Сделки есть, но базы в них в основном простые низкие посохи; Leaf в базе с хорошими стаффмодами изредка покупают свежие волшебницы.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~1593h; top bases plain staves (Short/Gnarled/Battle Staff); situational levelling staff",
  },
  Lionheart: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A big pile of attributes, life and resistances in a 3-socket body armor — a genuinely decent budget melee chest in its day, and most completed trades name Mage Plate for its low strength requirement. But Smoke fixes resistances cheaper and Duress or Treachery outfight it, so nowadays it mostly gathers dust.",
        "For the Chronicle, craft it in any cheap 3-socket armor and vendor it; keep one only if a fresh melee character happens to need the stats right now.",
      ],
      ru: [
        "Большая куча характеристик, жизни и сопротивлений в броне с 3 гнёздами — в своё время вполне приличный бюджетный нагрудник для ближнего боя, и большинство завершённых сделок называют Магическую кирасу (Mage Plate) из-за низкого требования к силе. Но Smoke закрывает резисты дешевле, а Duress и Treachery сильнее в бою, так что сейчас оно в основном пылится.",
        "Для Хроники соберите в любой дешёвой броне с 3 гнёздами и сдайте торговцу; оставить стоит только если свежему бойцу ближнего боя статы нужны прямо сейчас.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~16585h (slow); top base Mage Plate 16/50; chronicle with a budget-melee footnote",
  },
  Lore: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Ort Sol in any 2-socket helm — the base barely matters, and trades confirm it (Bone Helm, Crown, Full Helm, whatever is at hand). +1 to all skills plus lightning resistance for two runes you find by Act 5 Normal.",
        "Every levelling caster wears one, plenty of budget hell builds keep it until a Shako drops, and it is fine on a mercenary too. In constant demand at season start; it crafts in seconds and sells steadily despite the trivial rune cost.",
      ],
      ru: [
        "Ort Sol в любом шлеме с 2 гнёздами — база почти не важна, и сделки это подтверждают (Костяной шлем, Корона, Полный шлем — что под руку попалось). +1 ко всем навыкам плюс сопротивление молнии за две руны, которые находятся ещё в Нормале.",
        "Его носит каждый кастер на прокачке, многие бюджетные билды ходят в нём по Аду, пока не выпадет Шако, да и наёмнику он подходит. В начале сезона спрос постоянный: собирается за секунды и стабильно продаётся, несмотря на копеечные руны.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~1379h (steady); bases scattered cheap helms; meta budget +1 skills helm",
  },
  Malice: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A level 15 weapon whose only tricks are Prevent Monster Heal and making monsters flee — nothing any build wants past the first acts. Craft it in the cheapest 3-socket melee weapon you have (trades mostly show Flails and Crystal Swords) to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Оружие 15-го уровня, всё умение которого — запрет лечения монстров и обращение их в бегство; ни одному билду оно не нужно уже после первых актов. Соберите в самом дешёвом оружии ближнего боя с 3 гнёздами (в сделках в основном цепы и Кристальные мечи), чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~12723h (slow); top base Flail 13; pure chronicle filler",
  },
  Melody: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "+3 to bow skills with Knockback — on paper a levelling bow for amazons, and curiously most completed trades name elite amazon bows (Grand Matron, Matriarchal). In practice bow builds jump to better options fast and demand is nearly dead.",
        "Fill the Chronicle with the cheapest 3-socket missile weapon you can find, then vendor it.",
      ],
      ru: [
        "+3 к навыкам лука с отбрасыванием — на бумаге лук для прокачки амазонки, и, что забавно, большинство завершённых сделок называют элитные луки амазонки (Grand Matron, Matriarchal). На практике лучные билды быстро перескакивают на варианты получше, и спрос почти мёртв.",
        "Закройте Хронику самым дешёвым метательным оружием с 3 гнёздами и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~23508h (dead); top bases Grand Matron Bow 21, Matriarchal Bow 14; chronicle",
  },
  Memory: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Lum Io Sol Eth in a 4-socket staff: +3 sorceress skills, 33% faster cast rate and a mountain of mana. The classic switch-staff for Energy Shield sorceresses — prebuff ES and Battle Orders-style buffs from the switch slot — and a solid levelling weapon too. A base with +Energy Shield staffmods is the jackpot.",
        "Trades move at a decent clip across all staff bases (Gnarled, Battle, War, Archon Staff), so a good-staffmod Memory does find sorceress buyers.",
      ],
      ru: [
        "Lum Io Sol Eth в посохе с 4 гнёздами: +3 к навыкам волшебницы, 33% скорости чтения заклинаний и гора маны. Классический посох на свопе для волшебниц с Энергетическим щитом — пребафф ES со второго слота, — да и для прокачки он хорош. База со стаффмодом +Energy Shield — джекпот.",
        "Сделки идут довольно бодро по всем базам посохов (Gnarled, Battle, War, Archon Staff), так что Memory с хорошими стаффмодами находит покупателей среди волшебниц.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~579h (decent); bases spread across staves; situational ES-sorc prebuff staff",
  },
  Nadir: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A level 13 helm whose selling point is Cloak of Shadows charges — a curiosity, not equipment. Craft it in the cheapest 2-socket helm you have (Skull Cap, Cap, anything) to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Шлем 13-го уровня, чья единственная фишка — заряды Cloak of Shadows; это диковинка, а не экипировка. Соберите в самом дешёвом шлеме с 2 гнёздами (Skull Cap, обычная шапка — что угодно), чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 33 trades in ~40632h (dead); cheap helm bases; pure chronicle filler",
  },
  Radiance: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Light radius and a little energy on a 3-socket helm — one of the weakest runewords in the game, and the trade data agrees (barely any completed trades). Craft it in the cheapest 3-socket helm you find just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Радиус света и немного энергии на шлеме с 3 гнёздами — одно из слабейших рунных слов в игре, и данные торговли это подтверждают (завершённых сделок почти нет). Соберите в самом дешёвом шлеме с 3 гнёздами, чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll F; only 12 trades sampled in ~37339h (dead); pure chronicle filler",
  },
  Rhyme: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Shael Eth in a 2-socket shield: Cannot Be Frozen, 25 all-resistances, Cannot Be Frozen again for emphasis — the cheapest CBF in the game. Any low-strength shield works (trades show Bone Shields, Kite Shields, Grim Shields), and necromancers can roll it in a 2-socket shrunken head for the +skills bonus.",
        "Great on every levelling character and on budget hell builds until Spirit; melee characters without CBF elsewhere keep it longer than you would think. Runes are free, so most self-craft; sells occasionally in nice bases.",
      ],
      ru: [
        "Shael Eth в щите с 2 гнёздами: невозможность заморозки (Cannot Be Frozen), 25 ко всем сопротивлениям — самый дешёвый CBF в игре. Подойдёт любой щит с низким требованием к силе (в сделках Костяные щиты, Кайт-щиты, Мрачные щиты), а некромант может собрать его в голове с 2 гнёздами ради бонуса к навыкам.",
        "Отличен на любом персонаже на прокачке и в бюджетных билдах в Аду до появления Spirit; бойцы ближнего боя без CBF из других источников носят его дольше, чем кажется. Руны бесплатные, так что почти все собирают сами; в хороших базах изредка продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~2025h; bases cheap shields + Unraveller Head; situational budget CBF shield",
  },
  Silence: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Six runes including Vex and Ist for a D-tier weapon make this the most expensive Chronicle filler in the early book. It needs a 6-socket weapon; trades mostly name Phase Blade, but any cheap 6-socket base (a plain Crystal Sword or polearm) does the job just as well.",
        "Craft it last, when the Vex and Ist no longer hurt, then vendor it — no current build wants it.",
      ],
      ru: [
        "Шесть рун, включая Vex и Ist, за оружие D-уровня — самый дорогой «наполнитель Хроники» в этой части списка. Нужно оружие с 6 гнёздами; в сделках чаще всего Фазовый клинок, но любая дешёвая база с 6 гнёздами (обычный Кристальный меч или древковое) справится не хуже.",
        "Собирайте его последним, когда Vex и Ist уже не жалко, и сдайте торговцу — ни одному актуальному билду оно не нужно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in ~1576h; top base Phase Blade 28/50; chronicle, flagged Vex+Ist cost",
  },
  Smoke: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Nef Lum in a 2-socket body armor for a flat 50 to all resistances — the single cheapest way to fix hell resistances for yourself or your mercenary. Pick a light base like Mage Plate or Dusk Shroud if you are wearing it; trades show all sorts of bases (Balrog Skin leads), which just proves people roll it in whatever drops.",
        "Every hardcore player and half the softcore ladder crafts one at some point. Runes are cheap, so it sells only occasionally — mostly to people too lazy to find a Lum.",
      ],
      ru: [
        "Nef Lum в броне с 2 гнёздами даёт ровно 50 ко всем сопротивлениям — самый дешёвый способ закрыть резисты в Аду себе или наёмнику. Если носите сами, берите лёгкую базу вроде Магической кирасы (Mage Plate) или Сумеречного савана (Dusk Shroud); в сделках базы самые разные (чаще всего Шкура балрога) — люди просто собирают его в том, что выпало.",
        "Каждый хардкорщик и половина софткорной ладдера рано или поздно собирают себе такой. Руны дешёвые, поэтому продаётся лишь изредка — в основном тем, кому лень искать Lum.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~978h (decent); bases scattered (Balrog Skin 8, Mage Plate 6); situational budget res armor",
  },
  Stealth: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Tal Eth in any 2-socket body armor — trades mostly show Breast Plates and Chain Mails, i.e. whatever light base was lying around. Faster cast rate, faster hit recovery and faster run/walk in one dirt-cheap package at level 17.",
        "The definitive levelling armor: every fresh caster (sorceress, necromancer, hammerdin-to-be) crafts one within the first hours of a season, and melee characters like it too. In constant demand at league start; the runes cost nothing, so what sells is the convenience of a ready 2-socket base.",
      ],
      ru: [
        "Tal Eth в любой броне с 2 гнёздами — в сделках в основном Кирасы (Breast Plate) и Кольчуги, то есть любая лёгкая база, что была под рукой. Скорость чтения заклинаний, скорость восстановления после удара и скорость бега в одном копеечном пакете на 17-м уровне.",
        "Эталонная броня для прокачки: каждый свежий кастер (волшебница, некромант, будущий хаммердин) собирает её в первые часы сезона, да и бойцам ближнего боя она нравится. В начале ладдера спрос постоянный; руны бесплатные, так что продаётся по сути удобство готовой базы с 2 гнёздами.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~1459h; top bases Breast Plate 11, Chain Mail 6; meta levelling armor",
  },
  Steel: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A level 13 starter weapon with a bit of attack speed and Open Wounds — outgrown within a couple of acts. Craft it in the cheapest 2-socket sword, axe or mace you have (trades show Flails and Scimitars) to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Стартовое оружие 13-го уровня с чуточкой скорости атаки и Open Wounds — перерастаете его за пару актов. Соберите в самом дешёвом мече, топоре или булаве с 2 гнёздами (в сделках цепы и скимитары), чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~6645h (slow); top bases Flail 12, Scimitar 12; pure chronicle filler",
  },
  Strength: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Two cheap runes for 25% Crushing Blow at level 25 — a passable stopgap for a very fresh melee character or an early mercenary polearm, but nothing anyone keeps. Craft it in the cheapest 2-socket melee base you have to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Две дешёвые руны за 25% сокрушающего удара на 25-м уровне — сойдёт как затычка для совсем свежего бойца ближнего боя или раннего древкового наёмнику, но никто его не оставляет. Соберите в самой дешёвой базе ближнего боя с 2 гнёздами, чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 36 trades in ~37806h (dead); bases scattered; chronicle with early-CB footnote",
  },

  Venom: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A poison-damage weapon that no build actually wants: the poison is slow and every serious character does more with Grief or an elemental runeword. Craft it in the cheapest 3-socket weapon you can find just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Оружие с ядовитым уроном, которое на деле не нужно ни одному билду: яд тикает медленно, и любой серьёзный персонаж получит больше от Grief или стихийного рунворда. Соберите его в самом дешёвом оружии с 3 гнёздами, чтобы закрыть Хронику, и продайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; Traderie: only 12 trades sampled, span ~21521h — dead market; chronicle filler",
  },
  Wealth: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A dedicated gold-find and magic-find farming armor. Craft it in a 3-socket Mage Plate — that is what most completed trades name — because its low strength requirement lets any farming character slip it on without wasting stat points.",
        "Cheap runes (Lem Ko Tir) and a clear niche: swap it on for boss runs or gold farming for gambling. Magic-find enthusiasts still want it, so it sells occasionally.",
      ],
      ru: [
        "Специализированная броня для фарма золота и магических вещей. Собирайте её в Латах мага (Mage Plate) с 3 гнёздами — именно эту базу называют в большинстве завершённых сделок: низкое требование к силе позволяет любому фарм-персонажу надеть её без лишних статов.",
        "Руны дешёвые (Lem Ko Tir), а ниша понятная: надевайте на боссранах или при фарме золота под гэмблинг. Любители мэджик-файнда её по-прежнему берут, так что изредка продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~1536h — slow but steady; top base Mage Plate 15/50",
  },
  White: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Necromancer-only wand and one of the cheapest strong caster weapons in the game (just Dol Io). The runes are trivial — the value is in the base: a 2-socket Bone Wand or Grim Wand whose staffmods roll +3 Bone Spear or +3 Bone Spirit, since White adds its own bone skills on top.",
        "The go-to main hand for Bone Spear necromancers until an elite rare or Heart of the Oak class setup, and good enough that many keep it into Hell. Trades move at a steady clip, and wands with the right staffmods are what buyers hunt for.",
      ],
      ru: [
        "Жезл только для некроманта и одно из самых дешёвых сильных кастерских оружий в игре (всего Dol Io). Руны копеечные — вся ценность в базе: Костяной жезл (Bone Wand) или Мрачный жезл (Grim Wand) с 2 гнёздами, на котором выпали стаффмоды +3 к Костяному копью или Костяному духу, ведь White добавляет свои костяные скиллы сверху.",
        "Основное оружие копейного некроманта до элитного рара или сборки под Heart of the Oak; многим его хватает и в Аду. Торгуется довольно бойко, и покупатели охотятся именно за жезлами с нужными стаффмодами.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~616h — steady; top bases Bone Wand 15, Grim Wand 10; staffmod hunting is the market",
  },
  Zephyr: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A low-level levelling bow that even levelling characters skip nowadays. Craft it in any cheap 2-socket bow just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Лук для прокачки на низких уровнях, который сейчас пропускают даже при прокачке. Соберите в любом дешёвом луке с 2 гнёздами, чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~40900h — near-dead market; chronicle filler",
  },
  Beast: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Craft it in a 5-socket Berserker Axe — the overwhelming favorite in completed trades — for the fast attack speed and low weight. Its level 9 Fanaticism aura is the whole point: it supercharges physical builds around you.",
        "Classic homes: summoner necromancers and druids who want Fanaticism for their army, melee characters stacking auras, and anyone who fancies fighting as a Werebear via the oskill. Expensive runes (Ber), but demand is brisk and a well-based Beast sells reliably.",
      ],
      ru: [
        "Собирайте в Секире берсерка (Berserker Axe) с 5 гнёздами — в завершённых сделках эта база с большим отрывом лидирует: быстрая скорость атаки и небольшие требования. Весь смысл — в ауре Фанатизма 9 уровня, которая разгоняет физические билды вокруг вас.",
        "Классические хозяева: некроманты и друиды-призыватели, дающие Фанатизм своей армии, милишники, стакающие ауры, и те, кому нравится, что слово даёт любому классу умение друида «Медведь-оборотень». Руны дорогие (Ber), но спрос живой, и Beast в хорошей базе продаётся стабильно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~294h — brisk; top base Berserker Axe 36/50",
  },
  Bramble: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The poison-damage armor: its +25-50% poison skill damage is why Rabies druids and Poison Nova necromancers build around it. Craft it in a 4-socket Archon Plate (the most traded base) or a Dusk Shroud if you want a lighter strength requirement.",
        "Expensive runes (Ohm and Sur), and the Thorns aura is mostly flavor. Demand comes almost entirely from poison specialists, so it sells to a narrow but real audience.",
      ],
      ru: [
        "Броня под ядовитый урон: +25-50% к урону ядом — ради этого её собирают друиды с Бешенством (Rabies) и некроманты с Ядовитой новой. Основа — Архонтские латы (Archon Plate) с 4 гнёздами, самая ходовая в сделках, либо Сумеречный саван (Dusk Shroud), если хочется меньших требований к силе.",
        "Руны дорогие (Ohm и Sur), а аура Шипов — скорее для антуража. Спрос почти целиком от ядовитых спецов, так что покупатель узкий, но реальный.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~319h — brisk; top base Archon Plate 17/50",
  },
  "Breath of the Dying": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "The classic 6-socket endgame melee weapon. The Zod rune makes it indestructible, so an ethereal elite base is strictly correct: ethereal Thunder Maul dominates completed trades, with Berserker Axe, Colossus Blade and War Pike behind it. An ethereal 6-socket War Pike or Thresher version is a monster weapon for an act 2 mercenary.",
        "Whirlwind barbarians, Fury druids and other physical attackers all want it, and the huge Enhanced Damage roll plus dual leech keeps it relevant deep into endgame. In constant demand — crafts and sells well despite the very expensive rune bill (Vex and Zod).",
      ],
      ru: [
        "Классическое эндгеймовое оружие ближнего боя на 6 гнёзд. Руна Zod делает его неразрушимым, поэтому эфирная элитная база — строго правильный выбор: в завершённых сделках доминирует эфирный Громовой молот (Thunder Maul), за ним Секира берсерка, Клинок колосса и Боевая пика. Эфирная Боевая пика или Молотилка на 6 гнёзд — чудовищное оружие для наёмника 2 акта.",
        "Его хотят варвары-вихри, друиды с Яростью и прочие физические атакеры: огромный ролл усиленного урона и двойной лич актуальны до самого позднего эндгейма. Стабильный спрос — собирается и продаётся отлично, несмотря на очень дорогие руны (Vex и Zod).",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~73h — hot; top bases eth Thunder Maul 22, Berserker Axe 9, Colossus Blade 5, War Pike 4",
  },
  "Call to Arms": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "The universal weapon-swap item: every character of every class wants Battle Orders and Battle Command from the switch slot. Because it only ever sits on swap, the base's stats are irrelevant — a plain 5-socket Crystal Sword or Flail is standard, and those two dominate completed trades.",
        "Rolls matter (+1 to +6 Battle Orders), so high rolls carry a premium. This is one of the fastest-moving runewords on the market — in constant demand, crafts and sells extremely well.",
      ],
      ru: [
        "Универсальная вещь для второго слота оружия: Боевой приказ и Боевую команду со свапа хочет каждый персонаж любого класса. Поскольку оно лежит только на свапе, статы базы не важны — стандарт это обычный Кристальный меч (Crystal Sword) или Цеп (Flail) с 5 гнёздами, и именно они доминируют в завершённых сделках.",
        "Важен ролл (+1..+6 к Боевому приказу), поэтому высокие роллы идут с наценкой. Один из самых быстрых рунвордов на рынке — постоянный спрос, собирается и продаётся отлично.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in 8h — hottest velocity in slice; top bases Crystal Sword 29, Flail 12",
  },
  Chaos: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Assassin-only claw whose selling point is the Whirlwind oskill — the backbone of the Whirlwind assassin. Craft it in a 3-socket Runic Talons or Suwayyah (the two bases nearly all completed trades name); it is usually paired with a Fury claw in the off hand for speed.",
        "The build is a fan favorite rather than top meta, and the Ohm rune makes it a mid-expensive craft. Sells occasionally to Whirlwind assassin enthusiasts.",
      ],
      ru: [
        "Коготь только для ассасина, весь смысл которого — чужое умение варвара «Вихрь» (Whirlwind), основа билда ассасинки-вихря. Собирайте в Рунических когтях (Runic Talons) или Сувайе (Suwayyah) с 3 гнёздами — почти все завершённые сделки называют именно эти базы; обычно в пару берут коготь Fury во вторую руку ради скорости.",
        "Билд скорее любимец фанатов, чем топ-мета, а руна Ohm делает сборку недешёвой. Изредка продаётся ценителям Вихря на ассасине.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~1759h — moderate; top bases Runic Talons 17, Suwayyah 15",
  },
  "Chains of Honor": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "The premier defensive endgame armor: +2 all skills and a massive +65 all resistances plus damage reduction. Craft it in a 4-socket Archon Plate — by far the most traded base — or Dusk Shroud for a low strength requirement; Sacred Armor if you chase maximum defense.",
        "Standard on Uber-killing Smiters, summon necromancers and most melee characters that don't need Enigma's Teleport. In constant demand — it crafts and sells well all season.",
      ],
      ru: [
        "Главная защитная броня эндгейма: +2 ко всем навыкам и огромные +65 ко всем сопротивлениям плюс снижение урона. Собирайте в Архонтских латах (Archon Plate) с 4 гнёздами — это самая ходовая база с большим отрывом — или в Сумеречном саване ради низкой силы; Священные латы (Sacred Armor) — если гонитесь за максимальной защитой.",
        "Стандарт для смайтеров под убер-Тристрам, некромантов-призывателей и большинства милишников, которым не нужен Телепорт из Enigma. Постоянный спрос — собирается и продаётся весь сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source: "Maxroll A; 50 trades in ~51h — hot; top base Archon Plate 28/50",
  },
  "Crescent Moon": {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The lightning-melee enabler: -35% enemy lightning resistance plus Static Field procs. Craft it in a 3-socket Phase Blade (no repairs, fastest swings — the base most completed trades name) or a cheap Crystal Sword while levelling into it.",
        "Core weapon for Dream/Holy Shock 'Tesladin' paladins and other lightning-damage melee builds, and a serviceable budget stand-in where Infinity is out of reach. Sells at a steady pace to those builds.",
      ],
      ru: [
        "Оружие для молниевого ближнего боя: -35% к сопротивлению врагов молнии плюс прок Статического поля. Собирайте в Фазовом клинке (Phase Blade) с 3 гнёздами — не ломается, машет быстрее всех, и именно его чаще всего называют в сделках; на разгоне сойдёт и дешёвый Кристальный меч.",
        "Ключевое оружие паладинов-«тесладинов» на Dream/Святом шоке и других милишных молниевых билдов, а также рабочая бюджетная замена там, где Infinity не по карману. Продаётся стабильно под эти билды.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~331h — brisk; top bases Phase Blade 19, Crystal Sword 8",
  },
  Delirium: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A crowd-control helm: +2 all skills with constant Confuse and Mind Blast procs that turn packs against each other (and occasionally morph you into a bone fetish, which is half the charm). Any 3-socket helm works; trades show a spread of Demonhead, Bone Visage and barbarian helms.",
        "Summoner necromancers and hardcore players who value chaos-as-defense are the buyers. A fun, genuinely useful oddity that sells occasionally.",
      ],
      ru: [
        "Шлем контроля толпы: +2 ко всем навыкам и постоянные проки Замешательства и Ментального удара, которые стравливают паки между собой (а иногда превращают вас в костяного фетиша — в этом половина обаяния). Подойдёт любой шлем с 3 гнёздами; в сделках мелькают Голова демона (Demonhead), Костяной лик (Bone Visage) и варварские шлемы.",
        "Покупатели — некроманты-призыватели и хардкорщики, ценящие хаос как защиту. Забавная и реально полезная диковинка, изредка продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~1431h — moderate; top bases Demonhead 7, Bone Visage 6, class helms scattered",
  },
  Doom: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The Holy Freeze weapon: its level 12 aura chills everything around you, which elemental melee builds love. Completed trades are almost unanimous — a 5-socket Berserker Axe is the base. An ethereal polearm version on an act 2 mercenary also works as a walking slow aura, though the axe for self-use is what the market actually trades.",
        "Fury druids, Frenzy barbarians and cold-themed melee builds are the audience. Very expensive runes (Cham, Lo, Ohm), but demand is brisk, so a well-rolled Doom finds a buyer.",
      ],
      ru: [
        "Оружие Святой стужи: аура 12 уровня замораживает всё вокруг, что обожают стихийные милишники. Завершённые сделки почти единодушны — база — Секира берсерка (Berserker Axe) с 5 гнёздами. Вариант в эфирном древковом на наёмнике 2 акта тоже работает как ходячая аура замедления, но рынок реально торгует именно секирой под себя.",
        "Аудитория — друиды с Яростью, варвары с Бешенством и «холодные» милишные билды. Руны очень дорогие (Cham, Lo, Ohm), но спрос живой, и Doom с хорошим роллом находит покупателя.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~104h — hot; top base Berserker Axe 46/50; merc-polearm note is community knowledge, market is axes",
  },
  Duress: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The best mid-budget melee armor: Crushing Blow, Open Wounds, cold damage and solid resistances from three cheap-ish runes (Shael Um Thul). Craft it in a 3-socket elite armor — trades split between Archon Plate, Ornate Plate, Wire Fleece and Boneweave, so pick whatever fits your strength.",
        "A common stop for melee characters saving toward Fortitude or Chains of Honor, and a fine mercenary armor too. Sells occasionally to budget melee builds.",
      ],
      ru: [
        "Лучшая среднебюджетная броня для ближнего боя: Сокрушающий удар, Открытые раны, урон холодом и приличные сопротивления за сравнительно дешёвые руны (Shael Um Thul). Собирайте в элитной броне с 3 гнёздами — сделки делятся между Архонтскими латами, Парадными латами (Ornate Plate), Проволочным руном (Wire Fleece) и Костяным плетением (Boneweave), берите под свою силу.",
        "Частая промежуточная остановка для милишников, копящих на Fortitude или Chains of Honor, и неплохая броня для наёмника. Изредка продаётся бюджетным милишным билдам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~1917h — moderate; bases spread: Archon Plate 6, Ornate Plate 6, Wire Fleece 5, Boneweave 5",
  },
  Enigma: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "The most famous armor in the game: it gives every class Teleport, plus +2 skills, huge strength and magic find. Craft it in a 3-socket Mage Plate — the most traded base by far, since the low strength requirement suits casters and Enigma's own +strength covers gear — or an Archon Plate / Dusk Shroud when you want more defense on the same light frame.",
        "Hammerdins, summon necromancers, sorceresses who want the stats, and frankly almost every endgame character build around it. In constant demand all season — it crafts and sells as reliably as anything in the game, expensive Jah and Ber notwithstanding.",
      ],
      ru: [
        "Самая знаменитая броня в игре: даёт Телепорт любому классу, плюс +2 к навыкам, кучу силы и мэджик-файнд. Собирайте в Латах мага (Mage Plate) с 3 гнёздами — это безоговорочно самая ходовая база: низкое требование к силе идеально кастерам, а собственная +сила Enigma закрывает остальную экипировку; Архонтские латы или Сумеречный саван — если хочется больше защиты при тех же требованиях.",
        "Хаммердины, некроманты-призыватели, волшебницы ради статов — по сути, почти каждый эндгеймовый персонаж строится вокруг неё. Постоянный спрос весь сезон: собирается и продаётся надёжнее всего в игре, несмотря на дорогие Jah и Ber.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~25h — hot; top bases Mage Plate 28, Archon Plate 11",
  },
  Eternity: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Very expensive runes (Ber, Sur) for a weapon nothing wants — its Replenish Life and Revive charges never justified the cost. Craft it in the cheapest valid 5-socket melee weapon just to fill the Chronicle, then vendor it; do not burn a good Phase Blade or Berserker Axe on it.",
      ],
      ru: [
        "Очень дорогие руны (Ber, Sur) ради оружия, которое никому не нужно — восполнение жизни и заряды Воскрешения никогда не окупали цену. Соберите в самом дешёвом подходящем оружии ближнего боя с 5 гнёздами, чтобы закрыть Хронику, и сдайте торговцу; хороший Фазовый клинок или Секиру берсерка на это не тратьте.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; 50 trades in ~1499h (mostly collectors, Phase Blade/Berserker Axe named); chronicle — advise cheapest base despite that",
  },
  Exile: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The paladin's Uber shield: Life Tap charges, Defiance aura and self-repair. Craft it in a 4-socket elite paladin shield with high base all-resistances — Sacred Targe, Vortex Shield and Sacred Rondache lead the completed trades. An ethereal base is actually desirable here: self-repair keeps it alive while the eth bonus plus Defiance produces enormous defense.",
        "The signature shield of Smiters running Uber Tristram, where Life Tap keeps them standing. Jah-free but still pricey (Vex, Ohm); it trades briskly for a class-locked item and a well-based one sells.",
      ],
      ru: [
        "Паладинский щит для уберов: заряды Похищения жизни, аура Непокорности и самопочинка. Собирайте в элитном паладинском щите с 4 гнёздами и высоким базовым сопротивлением всему — в завершённых сделках лидируют Священный тарж (Sacred Targe), Щит вихря (Vortex Shield) и Священный рондаш (Sacred Rondache). Эфирная база здесь реально желанна: самопочинка не даёт ей сломаться, а эфирный бонус вместе с Непокорностью выдаёт огромную защиту.",
        "Фирменный щит смайтеров в убер-Тристраме, где Похищение жизни держит их на ногах. Без Jah, но всё равно недёшево (Vex, Ohm); для классовой вещи торгуется бойко, и щит в хорошей базе продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~193h — brisk for class item; top bases Sacred Targe 15, Vortex Shield 14, Sacred Rondache 10",
  },
  Famine: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A pile of random elemental damage on very expensive runes (Jah, Ohm) that Grief and Breath of the Dying outclass completely. Craft it in the cheapest 4-socket axe or hammer you can find just to fill the Chronicle, then vendor it — save your Berserker Axes for real runewords.",
      ],
      ru: [
        "Куча случайного стихийного урона на очень дорогих рунах (Jah, Ohm), которую Grief и Breath of the Dying перекрывают полностью. Соберите в самом дешёвом топоре или молоте с 4 гнёздами, чтобы закрыть Хронику, и сдайте торговцу — Секиры берсерка приберегите для настоящих рунвордов.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; 50 trades in ~1701h (collector traffic, Berserker Axe 34/50); chronicle — advise cheapest base",
  },
  Gloom: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Resistances and a Dim Vision proc on an armor nobody equips — Duress does the budget job better and Chains of Honor the endgame one. Craft it in the cheapest 3-socket body armor just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Сопротивления и прок Затуманивания зрения на броне, которую никто не носит — бюджетную роль лучше играет Duress, эндгеймовую — Chains of Honor. Соберите в самой дешёвой броне с 3 гнёздами, чтобы закрыть Хронику, и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in ~956h (faster than expected for D tier, likely chronicle-driven); chronicle filler",
  },
  "Hand of Justice": {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The fire twin of the aura weapons: level 16 Holy Fire plus a big -20% enemy fire resistance. Completed trades are nearly unanimous on the base — a 4-socket Phase Blade for its speed and zero durability worries.",
        "The heart of the Dragon/Hand of Justice 'Auradin' paladin and of fire-flavored zealots. Very expensive runes (Sur, Cham, Lo), but the build has a loyal following and the demand pace is brisk, so it sells to Auradin builders.",
      ],
      ru: [
        "Огненный близнец аурных оружий: Святой огонь 16 уровня плюс солидные -20% к сопротивлению врагов огню. Завершённые сделки почти единодушны в базе — Фазовый клинок (Phase Blade) с 4 гнёздами за скорость и отсутствие проблем с прочностью.",
        "Сердце паладина-«аурадина» на связке Dragon + Hand of Justice и огненных зилотов. Руны очень дорогие (Sur, Cham, Lo), но у билда преданная аудитория, спрос живой — аурадинам продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source: "Maxroll B; 50 trades in ~125h — brisk; top base Phase Blade 44/50",
  },

  "Heart of the Oak": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Make it in a plain 4-socket Flail — the runeword provides all the stats itself, so the cheapest, fastest base with low requirements is the correct one. Do not waste a mace or staff on it.",
        "+3 to all skills, 40 all resistances and fast cast make it the default endgame caster weapon: Wind druids, Hammerdins, many sorceresses and trap assassins all reach for it. In constant demand — it crafts and sells well every season.",
      ],
      ru: [
        "Делайте его в обычном цепе (Flail) на 4 гнезда — все характеристики даёт сам рунворд, поэтому правильная база — самая дешёвая и быстрая, с минимальными требованиями. Не тратьте на него булаву или посох.",
        "+3 ко всем навыкам, 40 ко всем сопротивлениям и быстрый каст делают его стандартным оружием кастера для эндгейма: друиды ветра, хаммердины, многие волшебницы и ассасины-трапперы берут именно его. Стабильный спрос — крафтится и продаётся каждый сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll S; Traderie sample returned 0 trades (scrape gap), no base stats used; base advice (4-socket Flail) is standard community knowledge",
  },
  Kingslayer: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades name a Phase Blade — indestructible, fast, and low strength requirement, exactly what a niche melee weapon wants. It needs a 4-socket base.",
        "Crushing Blow, Open Wounds and the Vengeance proc make it a boss-killer or PvP-switch piece rather than a main weapon; Grief and Death outclass it for general play. Sells occasionally to collectors and off-meta melee builds.",
      ],
      ru: [
        "В большинстве завершённых сделок фигурирует Фазовый клинок — неразрушимый, быстрый и с низким требованием к силе, ровно то, что нужно нишевому оружию ближнего боя. База нужна с 4 гнёздами.",
        "Сокрушающий удар, открытые раны и прок Мести делают его оружием для добивания боссов или PvP-свитча, а не основным: Grief и Death его перекрывают в обычной игре. Продаётся изредка — коллекционерам и нестандартным милишникам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~86 days (slow); top base Phase Blade 33/50; positioned as boss/PvP niche",
  },
  Passion: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Its party trick is granting Zeal and Berserk to any class, which fuels meme builds and nothing more — trades are nearly dead. Craft it in the cheapest 4-socket weapon you find just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Его единственный фокус — давать Фанатизм (Zeal) и Берсерка любому классу, что годится лишь для мем-билдов; торговля по нему почти мертва. Соберите в самом дешёвом оружии с 4 гнёздами ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~2.6 years (dead); top base Phase Blade but irrelevant for chronicle advice",
  },
  Prudence: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A two-rune armor with modest resistances and defense that every other mid-game armor outclasses. Craft it in the cheapest 2-socket body armor just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Броня из двух рун со скромными сопротивлениями и защитой, которую перекрывает любая другая броня середины игры. Соберите в самой дешёвой броне с 2 гнёздами ради Хроники и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source: "Maxroll C; 50 trades in ~1 year (very slow); chronicle filler",
  },
  Sanctuary: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades name a Monarch (needs 156 strength) — take a 3-socket one; casters can pick a lighter 3-socket shield since the defense is not the point.",
        "Huge all resistances plus magic damage reduction make it the max-resist shield for non-paladins who want defense rather than Spirit's caster stats — handy against gloams and in Hell untwinked. Sells occasionally.",
      ],
      ru: [
        "В большинстве завершённых сделок — Монарх (нужно 156 силы), берите с 3 гнёздами; кастерам подойдёт и более лёгкий щит с 3 гнёздами, защита тут не главное.",
        "Большие сопротивления плюс снижение магического урона делают его щитом «на максимум резистов» для не-паладинов, которым нужна защита, а не кастерские статы Spirit — выручает против гломов и в Аду без твинков. Продаётся изредка.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~99 days (slow-moderate); top base Monarch 26/50",
  },
  Splendor: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "+1 skills and a little cast speed on a shield sounds fine until Rhyme and Spirit exist. Craft it in the cheapest 2-socket shield (necromancers can use a grimoire) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "+1 к навыкам и немного скорости каста на щите звучит неплохо — пока существуют Rhyme и Spirit. Соберите в самом дешёвом щите с 2 гнёздами (некроманту подойдёт гримуар) ради Хроники и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~155 days (slow); trades split across Kite Shield and necro grimoires (Dark Tome/Codex)",
  },
  Stone: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades name a Wyrmhide — a light elite armor with a low strength requirement, so the massive defense bonus comes without gearing your whole character around it. It needs a 4-socket base; an ethereal elite armor is strictly better if it goes on your mercenary.",
        "Big defense, stats, resistances and Clay Golem charges make it a budget defensive armor for melee characters and mercenaries who cannot afford Fortitude. Sells at a steady trickle.",
      ],
      ru: [
        "В большинстве завершённых сделок — Шкура вирма (Wyrmhide): лёгкая элитная броня с низким требованием к силе, так что огромный бонус защиты достаётся без перестройки персонажа. База нужна с 4 гнёздами; для наёмника строго лучше эфирная элитная броня.",
        "Большая защита, статы, сопротивления и заряды Глиняного голема делают её бюджетной защитной бронёй для милишников и наёмников, которым не по карману Fortitude. Продаётся понемногу, но стабильно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~31 days (moderate); top base Wyrmhide 35/50 (dominant)",
  },
  Wind: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Twister and Tornado charges on a melee weapon are a curiosity, not a build — the trade market for it is essentially dead. Craft it in the cheapest 2-socket melee weapon just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Заряды Смерча и Торнадо на оружии ближнего боя — курьёз, а не билд; рынок по нему фактически мёртв. Соберите в самом дешёвом оружии ближнего боя с 2 гнёздами ради Хроники и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; only 32 trades total spanning ~3 years (dead); chronicle filler",
  },
  Brand: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Completed trades split almost evenly between Matriarchal Bow and Grand Matron Bow — 4-socket amazon bows; an ethereal one is strictly better if it goes on an act 1 rogue mercenary.",
        "Explosive arrows plus the Bone Spear proc give it real screen-clearing flair, but the Jah and Lo runes cost Faith money, and Faith is simply better. A fun off-meta bowazon or merc weapon that sells occasionally.",
      ],
      ru: [
        "Завершённые сделки почти поровну делятся между Луком матриарха и Луком великой матроны — амазонские луки на 4 гнезда; для наёмницы-лучницы 1-го акта строго лучше эфирный.",
        "Разрывные стрелы и прок Костяного копья действительно зачищают экран, но руны Jah и Lo стоят как Faith, а Faith попросту сильнее. Забавный офф-мета лук для амазонки или наёмницы, продаётся изредка.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~18 days (decent); top bases Matriarchal Bow 20, Grand Matron Bow 19; judgement: outclassed by Faith at similar rune cost",
  },
  Death: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades name a Berserker Axe; the runeword itself is Indestructible, so an ethereal 5-socket base is strictly better and loses nothing. Ethereal Berserker Axe or Colossus Blade are the targets.",
        "100% Deadly Strike at high level plus Crushing Blow makes it a genuine Grief alternative for whirlwind barbarians and other physical melee — noticeably cheaper to assemble. Demand is hot right now; it crafts and sells well.",
      ],
      ru: [
        "В большинстве завершённых сделок — Топор берсерка; сам рунворд неразрушимый, поэтому эфирная база на 5 гнёзд строго лучше и ничего не теряет. Цель — эфирный Топор берсерка или Меч колосса.",
        "100% смертельного удара на высоком уровне плюс сокрушающий удар делают его реальной альтернативой Grief для варваров-вихрей и прочего физического ближнего боя — и собирается заметно дешевле. Спрос сейчас горячий: крафтится и продаётся отлично.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C but 50 trades in ~3 days (hot); top base Berserker Axe 29/50; judgement call: demand data outweighs the C tier, kept situational per JSON",
  },
  Destruction: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "The procs look dramatic and the weapon still loses to Grief and Breath of the Dying — nobody builds around it, and the Vex-Lo-Ber-Jah rune bill is brutal for a Chronicle checkbox. Leave it for last and craft it in the cheapest 5-socket polearm or sword you can find; most trades name Phase Blade, but for a checkbox any valid base does.",
      ],
      ru: [
        "Проки выглядят эффектно, но оружие всё равно проигрывает Grief и Breath of the Dying — под него никто не строится, а счёт из рун Vex-Lo-Ber-Jah за галочку в Хронике жесток. Оставьте его напоследок и соберите в самом дешёвом древковом или мече на 5 гнёзд; в сделках чаще фигурирует Фазовый клинок, но для галочки сойдёт любая база.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll F; 50 trades in ~46 days; top base Phase Blade 41/50; flagged expensive-runes-for-chronicle so advice says do it last",
  },
  Dragon: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "For the armor slot most completed trades name Mage Plate or Archon Plate (3 sockets); paladins building the shield version take a 3-socket Sacred Targe with high base all-resistances.",
        "Its level 14 Holy Fire aura is one third of the classic auradin package alongside Dream and Hand of Justice. Auradin builders keep it moving briskly on the market — it sells to a specific but reliable crowd.",
      ],
      ru: [
        "Для слота брони в большинстве завершённых сделок — Латы мага (Mage Plate) или Архонтские латы на 3 гнезда; паладины под щитовой вариант берут Священный тарж (Sacred Targe) с 3 гнёздами и высоким базовым сопротивлением.",
        "Его аура Святого огня 14-го уровня — треть классического набора аурадина вместе с Dream и Hand of Justice. Сборщики аурадинов обеспечивают ему бодрый оборот: покупатель специфический, но надёжный.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~3.3 days (hot); top bases Mage Plate 15, Archon Plate 11, Sacred Targe 7",
  },
  Dream: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "It needs a 3-socket helm or shield; most completed trades name Bone Visage, with Sacred Targe, Monarch and Diadem behind it. For the paladin shield version pick a Sacred Targe with high base all-resistances; Diadem is the low-requirement helm choice.",
        "The level 15 Holy Shock aura is the whole point: double-Dream Tesladins and Dream zeal sorceresses stack two copies for enormous lightning damage. Steady demand from those builds — it sells reliably if not instantly.",
      ],
      ru: [
        "Нужен шлем или щит с 3 гнёздами; в большинстве завершённых сделок — Костяной лик (Bone Visage), за ним Священный тарж, Монарх и Диадема. Для паладинского щита берите Священный тарж с высоким базовым сопротивлением; Диадема — шлем с минимальными требованиями.",
        "Аура Святого разряда 15-го уровня — весь смысл предмета: тесладины с двумя Dream и Dream-волшебницы с Фанатизмом складывают две копии ради огромного урона молнией. Стабильный спрос от этих билдов — продаётся надёжно, пусть и не мгновенно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~7.5 days (brisk); top bases Bone Visage 19, Sacred Targe 7, Monarch 5, Diadem 4",
  },
  Edge: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Three cheap runes in any 3-socket bow — trades show throwaway bases like Edge Bow and Short Bow, and that is correct; the base does not matter.",
        "The reduced vendor prices mod is the real product: keep it on weapon switch and save a fortune gambling and shopping. The level 15 Thorns aura also props up summoner builds early on. Cheap to make, and it sells occasionally to gamblers and summoners.",
      ],
      ru: [
        "Три дешёвые руны в любой лук с 3 гнёздами — в сделках мелькают проходные базы вроде Edge Bow и Короткого лука, и это правильно: база не важна.",
        "Настоящий товар здесь — снижение цен у торговцев: держите его на свитче и экономьте состояние на гэмбле и закупках. Аура Шипов 15-го уровня заодно поддерживает саммонеров на старте. Дешёвый в сборке, изредка продаётся гэмблерам и саммонерам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~138 days (slow — people self-craft it, cheap runes); top bases Edge Bow 9, Short Bow 7",
  },
  Faith: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades name a Grand Matron Bow, with Matriarchal Bow second — 4-socket amazon bows. If it goes on an act 1 rogue mercenary, an ethereal base is strictly better.",
        "The level 12-15 Fanaticism aura defines it: Faith bowazons wear it themselves, and physical builds park it on the rogue merc to buff the whole party. Expensive runes (Jah and Ohm), but demand is hot — it moves fast when listed.",
      ],
      ru: [
        "В большинстве завершённых сделок — Лук великой матроны, следом Лук матриарха; амазонские луки на 4 гнезда. Если лук идёт наёмнице-лучнице 1-го акта, эфирная база строго лучше.",
        "Всё решает аура Фанатизма 12–15 уровня: Faith-амазонки носят его сами, а физические билды вешают его на наёмницу, чтобы бафать всю группу. Руны дорогие (Jah и Ohm), но спрос горячий — уходит быстро.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~2 days (hot); top bases Grand Matron Bow 28, Matriarchal Bow 12",
  },
  Fortitude: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Make it in an ethereal 4-socket elite armor with high defense for your mercenary — trades show Archon Plate and Sacred Armor leading; characters wearing it themselves take a non-ethereal Archon Plate for the low strength requirement.",
        "300% enhanced damage plus resistances is the endgame body armor for nearly every physical build and every act 2 mercenary. In constant demand — it crafts and sells well all season long.",
      ],
      ru: [
        "Делайте его в эфирной элитной броне на 4 гнезда с высокой защитой для наёмника — в сделках лидируют Архонтские латы и Священная броня; для себя берут неэфирные Архонтские латы из-за низкого требования к силе.",
        "300% усиленного урона плюс сопротивления — это эндгейм-броня почти для любого физического билда и каждого наёмника 2-го акта. Стабильный спрос — крафтится и продаётся весь сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~2.2 days (hot); top bases Archon Plate 13, Sacred Armor 10, plus Thunder Maul weapon versions",
  },
  Grief: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Phase Blade is the base in the overwhelming majority of completed trades — indestructible (never needs repairs), the fastest swing, and only 25 strength; it must roll 5 sockets. Berserker Axe is the alternative when you want ethereal or more base damage.",
        "The hidden +340-400 flat damage makes it the single best melee weapon in the game: smiters, zealots, whirlwind barbarians and kicksins all want one. The hottest mover in the entire trade sample — crafts and sells instantly.",
      ],
      ru: [
        "Фазовый клинок — база в подавляющем большинстве завершённых сделок: неразрушимый (не требует ремонта), самый быстрый и всего 25 силы; нужен ролл на 5 гнёзд. Топор берсерка — альтернатива, если хочется эфир или больше базового урона.",
        "Скрытые +340–400 чистого урона делают его лучшим оружием ближнего боя в игре: смайтеры, зилоты, варвары-вихри и киксины — все хотят себе такой. Самый ходовой предмет во всей выборке — крафтится и продаётся мгновенно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~17 hours (hottest in slice); top base Phase Blade 39/50",
  },
  Harmony: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Any 4-socket bow works; trades mostly show Matriarchal and Grand Matron Bows because amazons make them, but the base barely matters.",
        "The level 10 Vigor aura is the point: keep it on weapon switch and every character without teleport runs the map like a paladin. Valkyrie charges are a bonus. Cheap-ish to make; sells occasionally to runners and untwinked players.",
      ],
      ru: [
        "Подойдёт любой лук с 4 гнёздами; в сделках в основном Луки матриарха и великой матроны — просто потому, что их делают амазонки, база тут почти не важна.",
        "Смысл — в ауре Энергии (Vigor) 10-го уровня: держите лук на свитче, и любой персонаж без телепорта бегает по карте как паладин. Заряды Валькирии — приятный бонус. Собирается недорого; изредка продаётся раннерам и игрокам без твинков.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~78 days (slow — cheap enough to self-craft); top base Matriarchal Bow 13",
  },
  Ice: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Matriarchal Bow dominates completed trades, with Grand Matron Bow second — 4-socket amazon bows; ethereal is strictly better if a rogue mercenary carries it.",
        "The Holy Freeze aura plus massive cold skill damage builds the dedicated cold bowazon and keeps everything on the screen slowed. Jah and Lo make it expensive, but the niche is real — it sells steadily to Iceazon builders.",
      ],
      ru: [
        "В завершённых сделках доминирует Лук матриарха, следом Лук великой матроны — амазонские луки на 4 гнезда; для наёмницы-лучницы строго лучше эфирный.",
        "Аура Святой стужи плюс огромный бонус к урону холодом собирают полноценную ледяную амазонку-лучницу и держат весь экран замедленным. Руны Jah и Lo делают его дорогим, но ниша реальна — стабильно продаётся сборщикам Iceazon.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~14 days (steady); top base Matriarchal Bow 37/50 (dominant)",
  },
  Infinity: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Make it ethereal for your act 2 mercenary — merc gear takes no durability loss, so ethereal is strictly better. It needs a 4-socket base: the classic picks are ethereal Thresher, Giant Thresher and Cryptic Axe, and since patch 2.6 also allowed spear-class bases, cheap low-requirement Scythes and Mancatchers lead the completed trades.",
        "The Conviction aura strips enemy resistances and breaks immunities, which is why every elemental build — Lightning sorceresses and javazons above all — wants it on their mercenary. In constant demand; it crafts and sells well every single season.",
      ],
      ru: [
        "Делайте его эфирным для наёмника 2-го акта — снаряжение наёмников не теряет прочность, поэтому эфир строго лучше. Нужна база с 4 гнёздами: классика — эфирные Молотилка (Thresher), Гигантская молотилка и Загадочный топор (Cryptic Axe), а с патча 2.6 слово можно собирать и в копьях, поэтому в завершённых сделках лидируют дешёвые и нетребовательные Коса (Scythe) и Ловец (Mancatcher).",
        "Аура Осуждения (Conviction) срезает сопротивления врагов и ломает иммунитеты — поэтому каждый элементальный билд, прежде всего молниевые волшебницы и джавазонки, хочет его на своём наёмнике. Стабильный спрос: крафтится и продаётся каждый сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~22 hours (hot); top bases Scythe 25, Mancatcher 8, Thresher 5, Giant Thresher 4 — noted the low-req base trend rather than defaulting to eth Cryptic Axe lore",
  },

  Insight: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Craft it in a 4-socket ethereal elite polearm for your act 2 mercenary — most completed trades name Colossus Voulge and Thresher, with Giant Thresher and Great Poleaxe close behind. Ethereal is strictly better here since the mercenary never loses durability. A 4-socket Archon Staff version also trades for sorceresses who want the Meditation aura on their own weapon slot.",
        "The Meditation aura solves mana for every caster in the game — Blizzard/Orb sorceresses, Hammerdins, Javazons, summon necromancers all run it on the merc. Runes are cheap (Ral Tir Tal Sol), demand never stops: it crafts and sells well all season long.",
      ],
      ru: [
        "Делайте в эфирном элитном древковом с 4 гнёздами для наёмника 2-го акта — в завершённых сделках чаще всего фигурируют Colossus Voulge и Thresher, следом Giant Thresher и Great Poleaxe. Эфирная база здесь строго лучше: у наёмника прочность не тратится. Вариант в Archon Staff с 4 гнёздами тоже торгуется — волшебницы берут его ради ауры Медитации в свой слот оружия.",
        "Аура Медитации закрывает вопрос маны для любого кастера — Blizzard/Orb-волшебницы, хаммердины, джавазонки, некроманты-саммонеры держат её на наёмнике. Руны копеечные (Ral Tir Tal Sol), спрос не иссякает: крафтится и продаётся стабильно весь сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in 33h (hot); top bases Colossus Voulge 16 / Thresher 8 / Archon Staff 6; classic merc staple",
  },
  "Last Wish": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Almost every completed trade names a 6-socket Phase Blade — indestructible and fast, so ethereal does not matter; a 6-socket Berserker Axe is the rare alternative. The base must roll exactly six sockets.",
        "Level 17 Might aura, Fade on struck and huge crushing blow make it the signature weapon for uber-killing smiters and kick assassins, and a luxury choice for other melee. Six runes including three Jah make it one of the most expensive words in the game, yet it still moves steadily — a prestige craft that sells well.",
      ],
      ru: [
        "Практически все завершённые сделки — Фазовый клинок с 6 гнёздами: он неразрушимый и быстрый, так что эфирность не важна; редкая альтернатива — Berserker Axe на 6 гнёзд. База должна выбить ровно шесть гнёзд.",
        "Аура Мощи 17-го уровня, Fade при получении удара и огромный crushing blow делают его фирменным оружием смайтеров и кик-ассасинок для убийства уберов, а заодно люксовым выбором для прочего милишного контента. Шесть рун, включая три Jah, — одно из самых дорогих слов в игре, но расходится стабильно: престижный крафт, который хорошо продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in 103h; top base Phase Blade 47/50 — near-total dominance; very expensive runes noted qualitatively",
  },
  Lawbringer: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Most completed trades put it in a Phase Blade (indestructible, fast); a Crystal Sword works as a cheap 3-socket alternative, and scepter versions exist for paladins. Runes are mid-cheap: Amn Lem Ko.",
        "The level 16-18 Sanctuary aura ignores undead physical resistance and the Decrepify proc breaks physical immunes, so it shines as an act 5 mercenary sword or a swap weapon in undead-heavy areas like the Chaos Sanctuary. Demand is slow but real — it sells occasionally to melee players who hit physical immunes.",
      ],
      ru: [
        "В большинстве завершённых сделок — Фазовый клинок (неразрушимый, быстрый); дешёвая альтернатива — Crystal Sword на 3 гнезда, для паладинов встречаются версии в скипетрах. Руны недорогие: Amn Lem Ko.",
        "Аура Святилища 16-18-го уровня игнорирует физическое сопротивление нежити, а прок Decrepify пробивает физических иммунных, поэтому меч отлично идёт наёмнику 5-го акта или на свап в местах с нежитью вроде Санктуария Хаоса. Спрос вялый, но живой — изредка покупают милишники, упирающиеся в физиммунных.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in 1296h (~54 days, slow); top base Phase Blade 35; niche anti-physical-immune verdict",
  },
  Oath: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The word grants Indestructible, so an ethereal 4-socket base costs you nothing and gains huge damage — most completed trades name ethereal Balrog Blade, with Colossus Blade, Highland Blade and Cryptic Sword as alternatives.",
        "Around 300% enhanced damage plus 50% increased attack speed for four mid runes (Shael Pul Mal Lum) makes it the classic budget melee weapon: Frenzy barbarians, fury druids and early-ladder zealots use it before Grief. Sells occasionally to fresh melee characters, especially early in the season.",
      ],
      ru: [
        "Слово даёт Неразрушимость, поэтому эфирная база на 4 гнезда ничего не теряет и получает огромный урон — в завершённых сделках чаще всего эфирный Balrog Blade, альтернативы — Colossus Blade, Highland Blade и Cryptic Sword.",
        "Около 300% усиленного урона плюс 50% скорости атаки за четыре средние руны (Shael Pul Mal Lum) — классическое бюджетное милишное оружие: Frenzy-варвары, друиды-оборотни и зилоты начала сезона берут его до Grief. Изредка продаётся свежим милишным персонажам, особенно на старте ладдера.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in 178h; top base Balrog Blade 35 (eth); budget-melee verdict",
  },
  Obedience: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Craft it in a 5-socket ethereal elite polearm for your act 2 mercenary — completed trades split between Thresher and Giant Thresher, with Mancatcher and Cryptic Axe behind them. Ethereal is strictly better on a merc weapon.",
        "370% enhanced damage, 40% crushing blow and resistances from five cheap runes (Hel Ko Thul Eth Fal) make it the best budget merc weapon in the game — the stopgap before Insight has funding or when you want raw kill speed early. Sells occasionally, mostly at season start.",
      ],
      ru: [
        "Собирайте в эфирном элитном древковом на 5 гнёзд для наёмника 2-го акта — завершённые сделки делятся между Thresher и Giant Thresher, следом идут Mancatcher и Cryptic Axe. Эфирная база для оружия наёмника строго лучше.",
        "370% усиленного урона, 40% crushing blow и резисты за пять дешёвых рун (Hel Ko Thul Eth Fal) — лучшее бюджетное оружие наёмника в игре: затычка до дорогого варианта или выбор ради чистой скорости убийства в начале сезона. Продаётся изредка, в основном на старте ладдера.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in 396h; top bases Thresher 18 / Giant Thresher 15 (eth); budget merc weapon verdict",
  },
  Phoenix: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Two shield homes dominate the completed trades: 4-socket Monarch (needs 156 strength) for sorceresses, and Sacred Targe or Sacred Rondache with high all-resistances for paladins. Weapon versions exist but almost never trade.",
        "The Redemption aura plus roughly -28% enemy fire resistance make the Monarch a staple for Fireball/Fire Wall sorceresses, while the paladin shield version powers uber smiters who lean on Redemption for sustain. Vex Vex Lo Jah is an expensive stack, but the word stays in constant demand and sells well.",
      ],
      ru: [
        "В завершённых сделках доминируют два щита: Монарх на 4 гнезда (нужно 156 силы) для волшебниц и Sacred Targe / Sacred Rondache с высоким бонусом ко всем сопротивлениям для паладинов. Версии в оружии существуют, но почти не торгуются.",
        "Аура Искупления плюс примерно -28% к огненному сопротивлению врагов делают Монарх обязательным для Fireball/Fire Wall-волшебниц, а паладинский вариант носят убер-смайтеры ради отхила через Искупление. Vex Vex Lo Jah — дорогой набор, но спрос постоянный: слово стабильно продаётся.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in 72h (fast); top bases Monarch 27 / Sacred Targe 14; shield versions only in practice",
  },
  Pride: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A 4-socket ethereal polearm for the act 2 mercenary — completed trades favor Mancatcher (fast, and the merc never breaks it), then Giant Thresher and Colossus Voulge. The merc is not the killer here, so the base matters less than usual.",
        "Its level 16-20 Concentration aura buffs your own damage: Blessed Hammer paladins, bowazons and other physical builds take it once their damage, not mana, is the bottleneck. Expensive runes (Cham, Sur, Lo) for an aura stick, but trades move at a decent clip — it sells to endgame physical builds.",
      ],
      ru: [
        "Эфирное древковое на 4 гнезда для наёмника 2-го акта — в завершённых сделках лидирует Mancatcher (быстрый, а у наёмника прочность не тратится), дальше Giant Thresher и Colossus Voulge. Наёмник тут не убийца, так что база менее критична, чем обычно.",
        "Аура Сосредоточения 16-20-го уровня усиливает ваш собственный урон: хаммердины, лучницы-амазонки и другие физические билды берут её, когда упираются в урон, а не в ману. Руны дорогие (Cham, Sur, Lo) ради «палки с аурой», но сделки идут бодро — покупают эндгейм-билды на физическом уроне.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B but 50 trades in 80h (surprisingly fast for B); top bases Mancatcher 18 / Giant Thresher 10; kept situational per JSON",
  },
  Rift: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Interestingly, most completed trades name paladin scepters — War Scepter above all, plus Divine Scepter and Caduceus — with ethereal Thresher and Cryptic Axe versions for the act 2 mercenary behind them. Runes are mid-tier: Hel Ko Lem Gul.",
        "It deals fire and magic damage per hit (Firestorm and Frozen Orb procs on top), so its job is breaking physically immune packs — either on a merc polearm or as a paladin swap weapon. Trades are very slow; it sells rarely, to players who specifically need the immune coverage.",
      ],
      ru: [
        "Любопытно, что большинство завершённых сделок — паладинские скипетры: прежде всего War Scepter, плюс Divine Scepter и Caduceus; следом идут эфирные Thresher и Cryptic Axe для наёмника 2-го акта. Руны средние: Hel Ko Lem Gul.",
        "Оружие бьёт огнём и магией с каждым ударом (сверху проки Firestorm и Frozen Orb), поэтому его работа — разбирать физически иммунных: либо на древке наёмника, либо как свап-оружие паладина. Сделки идут очень медленно; покупают редко и только те, кому нужно именно покрытие иммунных.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in 3365h (~140 days, very slow); top base War Scepter 22 — scepter dominance was a mild surprise, reported as-is",
  },
  Spirit: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "Monarch for non-paladins (needs 156 strength, the only 4-socket regular shield); paladins use a 4-socket elite paladin shield with high all-resistances instead. The Crystal Sword version is the levelling and swap classic — most completed trades are Monarchs, with Crystal Swords a distant second.",
        "+2 skills, 25-35% faster cast rate and a fat mana pool from four cheap runes: every caster wears one — sorceresses, Hammerdins, necromancers, trap assassins — and many keep a sword copy on swap. It is the fastest-moving runeword in the data: in constant demand, crafts and sells well all season, with high-FCR rolls commanding a premium.",
      ],
      ru: [
        "Монарх для всех, кроме паладинов (нужно 156 силы — единственный обычный щит на 4 гнезда); паладины вместо него берут элитный паладинский щит на 4 гнезда с высоким бонусом ко всем сопротивлениям. Версия в Crystal Sword — классика для прокачки и свапа; в завершённых сделках Монархи с большим отрывом, Crystal Sword — далёкое второе место.",
        "+2 к навыкам, 25-35% скорости каста и жирный запас маны за четыре дешёвые руны: его носит каждый кастер — волшебницы, хаммердины, некроманты, трап-ассасинки, — а многие держат и меч на свапе. Самое ходовое слово во всей выборке: постоянный спрос, крафтится и продаётся весь сезон, роллы с высоким FCR уходят с наценкой.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in 24.7h — fastest velocity in slice; top bases Monarch 37 / Crystal Sword 6",
  },
  "Voice of Reason": {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A cold-damage sword with -24% enemy cold resistance that no serious build wants — craft it in the cheapest 4-socket base you find (a plain Crystal Sword is fine) just to fill the Chronicle, then vendor it. Its only faint niche is a very budget cold-proc levelling sword, and even completed trades are spread over months.",
      ],
      ru: [
        "Меч с холодным уроном и -24% к сопротивлению холоду у врагов, который не нужен ни одному серьёзному билду — соберите в самой дешёвой базе на 4 гнезда (обычный Crystal Sword сгодится) просто ради галочки в Хронике и сдайте торговцу. Единственная слабая ниша — совсем бюджетный меч на прокачку, да и завершённые сделки размазаны по месяцам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in 11085h (~15 months, dead); top bases Phase Blade 24 / Crystal Sword 12; chronicle-trash verdict",
  },
  Wrath: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Craft it in the cheapest 4-socket bow you have just to fill the Chronicle, then vendor it. Its one redeeming niche: on an act 1 rogue mercenary the magic damage and Decrepify proc handle physically immune monsters, and completed trades do name Matriarchal and Grand Matron Bows — but demand is glacial and the Ber rune is wasted on it.",
      ],
      ru: [
        "Соберите в самом дешёвом луке на 4 гнезда ради галочки в Хронике и сдайте торговцу. Единственная ниша: на наёмнице-лучнице 1-го акта магический урон и прок Decrepify закрывают физически иммунных — в завершённых сделках действительно мелькают Matriarchal Bow и Grand Matron Bow, — но спрос ледяной, а руна Ber на него откровенно жалко.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in 1934h (~80 days, slow); top bases Matriarchal Bow 22 / Grand Matron Bow 15; chronicle with A1-merc footnote",
  },
  Bone: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Necromancer-only armor with +2 necromancer skills and Bone Spirit charges that loses to every real endgame chest — craft it in the cheapest 3-socket armor you find (Mage Plate is the usual low-strength pick in trades) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Броня только для некроманта с +2 к навыкам и зарядами Костяного духа, проигрывающая любому настоящему эндгейм-нагруднику — соберите в самой дешёвой броне на 3 гнезда (в сделках обычно берут Mage Plate из-за низкого требования к силе) ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in 12054h (dead); top base Mage Plate 16; chronicle-trash verdict",
  },
  Enlightenment: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Sorceress-only armor with +2 sorceress skills and fire procs that nobody equips past levelling — craft it in the cheapest 3-socket armor available (Dusk Shroud or Mage Plate for low strength) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Броня только для волшебницы с +2 к навыкам и огненными проками, которую никто не носит дальше прокачки — соберите в самой дешёвой броне на 3 гнезда (Dusk Shroud или Mage Plate из-за низкой силы) ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in 6959h (dead); top bases Dusk Shroud 9 / Mage Plate 7; chronicle-trash verdict",
  },
  Myth: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Barbarian-only armor with +2 barbarian skills and a Taunt proc — a passable twink levelling chest at level 25, nothing more. Craft it in the cheapest 3-socket armor you find just to fill the Chronicle, then vendor it; its trades are the slowest in this whole group.",
      ],
      ru: [
        "Броня только для варвара с +2 к навыкам и проком Taunt — сносный твинк-нагрудник на 25-м уровне, не больше. Соберите в самой дешёвой броне на 3 гнезда ради галочки в Хронике и сдайте торговцу; сделки по нему — одни из самых медленных во всей группе.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in 30777h (~3.5 years, dead); bases scattered; chronicle with twink-levelling footnote",
  },
  Peace: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Amazon-only armor from three cheap runes (Shael Thul Amn); completed trades favor low-strength 3-socket bases — Mage Plate and Breast Plate above all.",
        "+2 amazon skills, Critical Strike and a chance to summon a level 15 Valkyrie on striking make it a solid budget chest for bowazons and javazons before Chains of Honor or Fortitude. Sells occasionally, mostly early in the season to fresh amazons.",
      ],
      ru: [
        "Броня только для амазонки из трёх дешёвых рун (Shael Thul Amn); в завершённых сделках предпочитают лёгкие базы на 3 гнезда — прежде всего Mage Plate и Breast Plate.",
        "+2 к навыкам амазонки, Critical Strike и шанс призвать Валькирию 15-го уровня при ударе — крепкий бюджетный нагрудник для лучниц и джавазонок до Chains of Honor или Fortitude. Продаётся изредка, в основном свежим амазонкам в начале сезона.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in 6512h (slow); top bases Mage Plate 15 / Breast Plate 9; budget amazon chest verdict",
  },
  Principle: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Paladin-only armor with +2 paladin skills and a Holy Bolt proc that no build actually wants — craft it in the cheapest 3-socket armor you find just to fill the Chronicle, then vendor it. Trades in the data are effectively dead.",
      ],
      ru: [
        "Броня только для паладина с +2 к навыкам и проком Holy Bolt, которая не нужна ни одному билду — соберите в самой дешёвой броне на 3 гнезда ради галочки в Хронике и сдайте торговцу. Сделки по ней в данных практически мертвы.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll D; 50 trades in 32319h (~3.7 years, dead); top bases Archon Plate 17 / Mage Plate 15; chronicle-trash verdict",
  },
  Rain: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "Druid-only armor with +2 druid skills, a Cyclone Armor proc on struck and Twister on striking — a curiosity, not an endgame piece. Craft it in the cheapest 3-socket armor you find (Mage Plate leads the trades) just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Броня только для друида с +2 к навыкам, проком Cyclone Armor при получении удара и Twister при ударе — диковинка, а не эндгейм-вещь. Соберите в самой дешёвой броне на 3 гнезда (в сделках лидирует Mage Plate) ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in 27672h (~3 years, dead); top base Mage Plate 17; chronicle-trash verdict",
  },
  Treachery: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "The +2 assassin skills are the least of it — its real home is your act 2 mercenary, in an ethereal elite armor: completed trades split across Sacred Armor, Archon Plate, Boneweave and Dusk Shroud, all 3-socket. Ethereal is strictly better since the merc pays no durability.",
        "45% increased attack speed plus the Fade proc (60 to all resistances and damage reduction once it triggers) makes the merc nearly unkillable for three cheap runes (Shael Thul Lem). Assassins also wear it themselves for the same package. In constant demand — crafts and sells well every season.",
      ],
      ru: [
        "+2 к навыкам ассасина — далеко не главное: настоящий дом этого слова — наёмник 2-го акта в эфирной элитной броне; завершённые сделки делятся между Sacred Armor, Archon Plate, Boneweave и Dusk Shroud, все на 3 гнезда. Эфирная база строго лучше — наёмник не тратит прочность.",
        "45% скорости атаки плюс прок Fade (60 ко всем сопротивлениям и снижение урона после срабатывания) делают наёмника почти бессмертным за три дешёвые руны (Shael Thul Lem). Ассасинки носят её и сами ради того же набора. Постоянный спрос — крафтится и продаётся каждый сезон.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in 495h; top bases Sacred Armor 7 / Archon Plate 7 (eth for merc); assassin-restricted per JSON but advice centers on merc use",
  },
  Plague: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "Completed trades favor 3-socket elite swords — Mythical Sword and Cryptic Sword above all, with Phase Blade and assassin Greater Talons versions behind. The Cham rune makes it a pricey craft.",
        "+1-2 all skills, a Cleansing aura and a Lower Resist proc on striking: it is a support weapon that strips enemy resistances for elemental builds — popular as an assassin claw or a party-play offhand. Sells occasionally to players building around the proc.",
      ],
      ru: [
        "В завершённых сделках предпочитают элитные мечи на 3 гнезда — прежде всего Mythical Sword и Cryptic Sword, следом версии в Фазовом клинке и ассасинских Greater Talons. Из-за руны Cham крафт недешёвый.",
        "+1-2 ко всем навыкам, аура Очищения и прок Lower Resist при ударе: это оружие поддержки, снимающее сопротивления врагов для стихийных билдов — популярно как коготь ассасинки или оффхенд для игры в группе. Изредка покупают те, кто строит билд вокруг прока.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in 257h; top bases Mythical Sword 16 / Cryptic Sword 11; Lower-Resist support verdict",
  },
  Pattern: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A levelling claw for low-level assassins (level 23) and nothing beyond that — craft it in the cheapest 3-socket claw you find just to fill the Chronicle, then vendor it. Even the trade sample could not reach 50 completed trades, and the ones recorded span years.",
      ],
      ru: [
        "Коготь для прокачки ассасинки на низких уровнях (23-й) и ничего сверх того — соберите в самом дешёвом когте на 3 гнезда ради галочки в Хронике и сдайте торговцу. Выборка сделок даже не набрала 50 завершённых, а имеющиеся растянуты на годы.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; only 35 trades sampled over ~32873h (dead); top bases Blade Talons 9 / Quhab 7; chronicle-trash verdict",
  },

  "Unbending Will": {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A 6-socket sword word, so the base must roll exactly six sockets. Most completed trades name Phase Blade — indestructible, very fast, and cheap on strength/dexterity for a self-wield melee character — while a 6-socket ethereal Colossus Blade makes a solid budget weapon for an act 5 barbarian mercenary — ethereal is strictly better there, since gear on a mercenary never loses durability.",
        "It plays like a poor man's Grief for Frenzy or Zeal melee builds: big enhanced damage, life leech, and crushing-blow-adjacent utility from cheap mid runes. Sells occasionally — worth crafting for your own melee character rather than for trade.",
      ],
      ru: [
        "Рунное слово на 6 гнёзд, так что база должна выпасть ровно с шестью сокетами. Чаще всего в завершённых сделках фигурирует Фазовый клинок — неразрушимый, очень быстрый и нетребовательный к силе и ловкости для собственного мили-персонажа; а эфирный Клинок колосса (Colossus Blade) на 6 гнёзд — неплохой бюджетный вариант для наёмника 5 акта: эфирка там строго лучше, ведь снаряжение на наёмнике прочность не теряет.",
        "По ощущениям это «Grief для бедных» под Frenzy- или Zeal-билды: высокий усиленный урон, кража жизни и полезные мелочи за дешёвые средние руны. Продаётся изредка — крафтить стоит скорее под своего мили-персонажа, чем на продажу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~1173h (slow); top bases Phase Blade 39, Colossus Blade 8; judgement: budget melee/A5 merc sword",
  },
  Wisdom: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A 3-socket helm word aimed at bow amazons: 33% piercing attack plus mana leech lets a Strafe or Multishot zon free up the belt slot Razortail would occupy. Craft it in a 3-socket circlet base (Tiara or Diadem, low strength requirement) for yourself; trades also show plenty of Demonhead and Bone Visage, which work fine if you have the strength.",
        "Only pierce-hungry ranged builds want it, and completed trades trickle in slowly — craft on demand for your own bowazon rather than stocking up.",
      ],
      ru: [
        "Рунное слово для шлема на 3 гнезда, заточенное под амазонку с луком: 33% пронзающей атаки плюс кража маны позволяют Strafe- или Multishot-амазонке освободить пояс от Razortail. Для себя лучше собирать в диадеме или тиаре на 3 гнезда (низкое требование к силе); в сделках также часто мелькают Голова демона (Demonhead) и Костяной лик (Bone Visage) — тоже годятся, если хватает силы.",
        "Нужно оно только дальнобойным билдам, которым не хватает пирса, и продаётся очень медленно — крафтите под конкретную амазонку, а не про запас.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~5387h (very slow); top bases Demonhead 11, Bone Visage/Tiara/Crown/Diadem 6 each; judgement: bowazon pierce helm, niche",
  },
  Obsession: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A 6-socket elite staff word — most completed trades name Archon Staff, with War Staff as the cheaper alternative. Since the recipe already contains Zod, an ethereal base is perfectly fine and never breaks.",
        "It is an all-in-one two-handed caster stick: +4 to all skills, 65% faster cast rate, big life/mana and all resistances. Sorceresses and other casters who are willing to give up the shield slot get near-endgame stats from a single item, though Zod and Ist make it a pricey craft. Demand is brisk this season — it moves quickly when listed.",
      ],
      ru: [
        "Рунное слово для элитного посоха на 6 гнёзд — в большинстве завершённых сделок это Архонтский посох (Archon Staff), более дешёвый вариант — Боевой посох (War Staff). В рецепте уже есть Зод, так что эфирная база полностью безопасна — посох не ломается.",
        "Это кастерская «двуручка всё-в-одном»: +4 ко всем навыкам, 65% скорости каста, много жизни, маны и всех сопротивлений. Волшебницы и другие кастеры, готовые отказаться от щита, получают почти эндгеймовые статы одним предметом, хотя Зод и Ист делают крафт недешёвым. Спрос в этом сезоне бодрый — выставленный посох уходит быстро.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~79h (hot); top bases Archon Staff 28, War Staff 20; judgement: shieldless caster staff, expensive Zod craft",
  },
  "Flickering Flame": {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "A 3-socket helm word and the fire-build helm: +3 fire skills, a Resist Fire aura, and minus enemy fire resistance that stacks with other pierce sources. Completed trades favor Bone Visage (high defense, light weight) and circlet bases — Diadem or Tiara — when you want low strength requirements; an ethereal Bone Visage is a fine pick for a mercenary carrying the aura for you.",
        "Fire sorceresses, Fissure/Armageddon druids, and any fire-damage build that struggles with resistant monsters want one. In constant demand — it crafts and sells well, so a good Vex is rarely wasted here.",
      ],
      ru: [
        "Рунное слово для шлема на 3 гнезда и главный шлем огненных билдов: +3 к навыкам огня, аура Resist Fire и снижение огненного сопротивления врагов, которое складывается с другими источниками пробития. В сделках чаще всего Костяной лик (Bone Visage) — высокая защита при малом весе — и «обручи» (Диадема, Тиара), если хочется минимальных требований к силе; эфирный Bone Visage хорош на наёмнике, который носит ауру за вас.",
        "Его хотят огненные волшебницы, друиды с Fissure/Armageddon и вообще любой огненный билд, страдающий от резистентных монстров. Спрос постоянный — крафтится и продаётся отлично, так что хороший Векс тут точно не пропадёт.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll S; 50 trades in ~126h (hot); top bases Bone Visage 22, Diadem 16, Tiara 5; judgement: core fire-build helm",
  },
  Mist: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A 5-socket bow/crossbow word carrying a high-level Concentration aura, +3 to all skills, and huge enhanced damage. Completed trades are dominated by amazon bows — Grand Matron Bow and Matriarchal Bow — since a bowazon who wields Mist herself gets the aura plus +skills in one weapon, usually pairing it with a Faith or Pride source elsewhere.",
        "Cham and Gul make it an expensive craft, and Faith often wins the slot, so it sells occasionally to well-funded bowazons rather than constantly.",
      ],
      ru: [
        "Рунное слово для лука или арбалета на 5 гнёзд с высокоуровневой аурой Concentration, +3 ко всем навыкам и огромным усиленным уроном. В сделках почти сплошь луки амазонки — Лук великой матроны (Grand Matron Bow) и Лук матриарха (Matriarchal Bow): амазонка с Mist в руках получает и ауру, и +скиллы одним предметом, обычно дополняя его Faith или Pride на других слотах.",
        "Чам и Гул делают крафт дорогим, а слот часто выигрывает Faith, поэтому продаётся оно лишь время от времени — богатым амазонкам-лучницам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll C; 50 trades in ~220h (moderate); top bases Grand Matron Bow 20, Matriarchal Bow 18; judgement: rich bowazon aura bow, loses to Faith often",
  },
  Bulwark: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A cheap 3-socket helm word (ladder-only, so you need a ladder character this season): life leech, physical damage taken reduced, +vitality, and life replenish from three low runes. Completed trades name Demonhead and Grand Crown most, but for a levelling or hardcore melee character any solid 3-socket helm you find on the way is fine — the mods, not the base, do the work.",
        "Great value while levelling and a comfortable hardcore pick, but it gets replaced by endgame helms, so it sells only occasionally.",
      ],
      ru: [
        "Дешёвое рунное слово для шлема на 3 гнезда (только для ладдера — в этом сезоне нужен ладдерный персонаж): кража жизни, снижение физического урона, +к живучести и реген жизни за три младшие руны. В сделках чаще всего Голова демона (Demonhead) и Большая корона (Grand Crown), но для прокачки или хардкорного мили-персонажа сгодится любой приличный шлем с 3 гнёздами, найденный по пути — работают моды, а не база.",
        "Отличная вещь на прокачке и уютный выбор для хардкора, но в эндгейме его вытесняют другие шлемы, так что продаётся лишь изредка.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; ladder-only; 50 trades in ~1337h (slow); top bases Demonhead 14, Grand Crown 13; judgement: levelling/HC melee helm",
  },
  Cure: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "A 3-socket helm word (ladder-only this season) built around a Cleansing aura and shortened poison duration — the go-to mercenary helm wherever poison is the killer. Craft it in an ethereal elite helm for your merc: completed trades are led by Spired Helm and Bone Visage, with Corona and Demonhead close behind; ethereal versions get extra defense and the merc never breaks them.",
        "Hardcore players and anyone farming poison-heavy zones keep buying these three cheap runes' worth of insurance. In constant demand — it crafts and sells well.",
      ],
      ru: [
        "Рунное слово для шлема на 3 гнезда (в этом сезоне — только ладдер) вокруг ауры Cleansing и сокращения длительности яда — дежурный шлем наёмника везде, где убивает яд. Собирайте в эфирном элитном шлеме для наёмника: в сделках лидируют Островерхий шлем (Spired Helm) и Костяной лик (Bone Visage), следом Корона (Corona) и Голова демона; эфирка даёт больше защиты, а наёмник её не ломает.",
        "Хардкорщики и все, кто фармит ядовитые зоны, стабильно скупают эту «страховку» ценой в три дешёвые руны. Спрос постоянный — крафтится и продаётся отлично.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; ladder-only; 50 trades in ~36h (hottest in slice); top bases Spired Helm 21, Bone Visage 12; judgement: eth merc anti-poison helm, meta per JSON",
  },
  Ground: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A ladder-only 3-socket helm with lightning resistance and lightning absorb. In theory it is a swap helm against Burning Souls and other lightning-heavy packs, but almost nobody trades it — craft it in the cheapest 3-socket helm you have lying around just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Ладдерный шлем на 3 гнезда с сопротивлением молнии и поглощением молнии. В теории это свап-шлем против Горящих душ и прочих молниевых паков, но им почти никто не торгует — соберите в самом дешёвом шлеме с 3 гнёздами ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; ladder-only; 46 trades over ~29195h (dead market); judgement: chronicle filler, lightning-absorb swap niche noted",
  },
  Hearth: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A ladder-only 3-socket helm with cold resistance, cold absorb, and Cannot be Frozen. The freeze immunity is its one redeeming niche as a cheap swap piece, but the market is dead — craft it in the cheapest valid 3-socket helm just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Ладдерный шлем на 3 гнезда с сопротивлением холоду, поглощением холода и «не может быть заморожен». Иммунитет к заморозке — его единственная полезная ниша как дешёвого свапа, но рынок мёртв: соберите в самом дешёвом шлеме с 3 гнёздами ради Хроники и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; ladder-only; 50 trades over ~20806h (dead market); judgement: chronicle filler, CBF/cold-absorb niche noted",
  },
  Temper: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A ladder-only 3-socket helm with fire resistance and fire absorb — a theoretical swap piece for fire-heavy fights that virtually nobody trades. Craft it in the cheapest valid 3-socket helm just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Ладдерный шлем на 3 гнезда с сопротивлением огню и поглощением огня — теоретический свап для боёв с сильным огнём, которым практически никто не торгует. Соберите в самом дешёвом шлеме с 3 гнёздами ради Хроники и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll C; ladder-only; 50 trades over ~7969h (dead market); judgement: chronicle filler, fire-absorb niche noted",
  },
  Mosaic: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The Martial Arts assassin claw: its 50% chance not to consume charges keeps Phoenix Strike and the other charge-up skills rolling, and the classic setup is one Mosaic in each hand. Craft it in a 3-socket Greater Talons or Runic Talons — ideally with +2/+3 to Martial Arts staffmods — which is exactly what completed trades show.",
        "Important this season: Mosaic is disabled on ladder and can only be crafted offline or non-ladder. Within non-ladder it still trades briskly, and good +MA bases keep their value, so it sells well where it is legal.",
      ],
      ru: [
        "Главные когти ассасина боевых искусств: 50% шанс не тратить заряды позволяет Phoenix Strike и другим зарядным навыкам работать без пауз, а классическая сборка — по Mosaic в каждой руке. Собирайте в Больших когтях (Greater Talons) или Рунических когтях (Runic Talons) на 3 гнезда, в идеале со стаффмодами +2/+3 к боевым искусствам — именно такие базы и мелькают в сделках.",
        "Важно в этом сезоне: Mosaic отключён в ладдере — собрать его можно только офлайн или в нон-ладдере. Там он по-прежнему бодро торгуется, а хорошие базы с +MA держат цену, так что продаётся отлично — где разрешён.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "No Maxroll tier (disabled on ladder per note); 50 trades in ~124h (hot); top bases Greater Talons 21, Runic Talons 20; judgement: dual-wield MA sin claw, non-ladder/offline only",
  },
  Metamorphosis: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The shapeshifter druid's pelt (druid-only, ladder-only this season): Mark of the Wolf and Mark of the Bear buffs plus crushing blow turn Fury and Rabies werewolves into much smoother killers. Craft it in a 3-socket druid pelt with good +shapeshifting staffmods — completed trades most often name Antlers, with elite pelts like Earth Spirit and Totemic Mask behind it.",
        "Only shapeshift druids want it, but for them it is a build-defining helm, so it sells steadily to that crowd.",
      ],
      ru: [
        "Тотемный шлем друида-оборотня (только друид, в этом сезоне — только ладдер): баффы Метка волка и Метка медведя плюс сокрушающий удар делают вервольфа с Fury или Rabies заметно бодрее. Собирайте в друидском тотеме на 3 гнезда с хорошими стаффмодами на оборотничество — в сделках чаще всего Рога (Antlers), за ними элитные тотемы вроде Духа земли (Earth Spirit) и Тотемной маски.",
        "Нужен он только друидам-оборотням, но для них это билдообразующий шлем, так что своей аудитории продаётся стабильно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; ladder-only; druid-only; 50 trades in ~403h (moderate); top bases Antlers 16, Earth Spirit 7; judgement: shapeshift druid core helm",
  },
  Authority: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A newer 3-socket body armor word from cheap runes (Hel Shael Ral), sitting in the levelling/budget bracket at level 29. Completed trades mostly show light caster bases — Dusk Shroud and Mage Plate — so people treat it as an inexpensive armor to wear until the real endgame chest arrives.",
        "Trades come through only occasionally; craft it for your own fresh character rather than for the market.",
      ],
      ru: [
        "Новое рунное слово для брони на 3 гнезда из дешёвых рун (Hel Shael Ral), бюджетный вариант 29 уровня на прокачку. В сделках в основном лёгкие кастерские базы — Сумеречный саван (Dusk Shroud) и Латы мага (Mage Plate): его носят, пока не появится настоящая эндгеймовая броня.",
        "Сделки проходят редко — крафтите под собственного свежего персонажа, а не на продажу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~1393h (slow); top bases Dusk Shroud 8, Mage Plate 7; judgement: newer 3.x word, kept modest — levelling armor per data",
  },
  Coven: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A newer 3-socket helm word (Ist Ral Io) that Maxroll rates highly. Completed trades favor caster-friendly bases — Diadem, Bone Visage, Demonhead, Tiara — so the usual advice applies: a 3-socket circlet base for low strength requirements, or Bone Visage for defense.",
        "The market moves at a modest pace; it finds buyers among casters and summon-flavored builds, so it sells occasionally rather than constantly.",
      ],
      ru: [
        "Новое рунное слово для шлема на 3 гнезда (Ист, Рал, Ио), которое Maxroll оценивает высоко. В сделках преобладают кастерские базы — Диадема, Костяной лик (Bone Visage), Голова демона, Тиара, — так что совет стандартный: «обруч» на 3 гнезда ради низких требований к силе или Bone Visage ради защиты.",
        "Рынок неторопливый: покупатели находятся среди кастеров и саммонерских билдов, так что продаётся время от времени, а не постоянно.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; 50 trades in ~746h (moderate-slow); top bases Diadem 12, Bone Visage 9, Demonhead 9; judgement: newer 3.x word, kept modest per instructions — build specifics not asserted",
  },
  Void: {
    usefulness: "meta",
    advice: {
      paragraphs: [
        "A 3-socket dagger word (Thul Zod Ist) that is one of the hottest items on the market this season — the newest completed trades span barely two days. Most trades name Kris and Blade as the base; since the recipe includes Zod, an ethereal base is perfectly safe and never breaks.",
        "Demand lines up with the Reign of the Warlock season's caster-dagger appetite: for a caster the base's damage barely matters, so a cheap 3-socket Kris does the job. In constant demand — it crafts and sells well.",
      ],
      ru: [
        "Рунное слово для кинжала на 3 гнезда (Тул, Зод, Ист) — один из самых горячих товаров сезона: последние завершённые сделки укладываются буквально в пару суток. Чаще всего базой служат Крис (Kris) и Клинок (Blade); в рецепте есть Зод, так что эфирная база полностью безопасна и не ломается.",
        "Спрос совпадает с сезоном «Власть чародея» и его аппетитом к кастерским кинжалам: для кастера урон базы почти не важен, так что дешёвый Крис на 3 гнезда отлично подходит. Спрос постоянный — крафтится и продаётся на ура.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; 50 trades in ~48h (very hot); top bases Kris 21, Blade 17; judgement: warlock-season caster dagger inferred from demand — build lore kept modest",
  },
  Vigilance: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A 2-socket shield word from two mid runes that almost nobody trades — the handful of completed listings are scattered across Monarchs, paladin shields, and even a Tome. Craft it in the cheapest valid 2-socket shield (or grimoire/voodoo head) you have just to fill the Chronicle, then vendor it.",
      ],
      ru: [
        "Рунное слово для щита на 2 гнезда из двух средних рун, которым почти никто не торгует — редкие сделки размазаны по Монархам, паладинским щитам и даже гримуарам. Соберите в самом дешёвом подходящем щите (или гримуаре/голове вуду) на 2 гнезда ради галочки в Хронике и сдайте торговцу.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll D; only 17 trades sampled over ~2495h (dead market); judgement: chronicle filler",
  },
  Ritual: {
    usefulness: "chronicle",
    advice: {
      paragraphs: [
        "A 3-socket dagger word rated at the bottom of Maxroll's list, and the market agrees — trades are rare. The catch is that Ohm is not a throwaway rune, so this Chronicle checkmark costs real currency: craft it in the cheapest 3-socket dagger (a plain Kris works; most listings happen to use Fanged Knife) only when you can spare the Ohm, then vendor or shelve it.",
      ],
      ru: [
        "Рунное слово для кинжала на 3 гнезда с самого дна тир-листа Maxroll, и рынок с этим согласен — сделки редки. Подвох в том, что Ом — не мусорная руна, так что эта галочка в Хронике стоит реальных денег: собирайте в самом дешёвом кинжале с 3 гнёздами (обычный Крис сойдёт; в объявлениях чаще Клыкастый нож), только когда Ом не жалко, и потом сдавайте торговцу или в сундук.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
      ],
    },
    source:
      "Maxroll F; 50 trades in ~1789h (slow); top base Fanged Knife 42; judgement: chronicle filler with a non-trivial Ohm cost — flagged the rune expense",
  },
  Mania: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "A newer ladder-only 3-socket weapon word from cheap runes (Shael Ko Eld) at level 39, so you need a ladder character this season. Completed trades are split between Phase Blade for melee self-wield and amazon bows like Matriarchal Bow, which fits its role as a budget mid-game weapon while you save for the real endgame stick.",
        "Maxroll rates it well for its bracket, but it is a stepping stone — it sells occasionally to levelling characters.",
      ],
      ru: [
        "Новое ладдерное рунное слово для оружия на 3 гнезда из дешёвых рун (Shael Ko Eld) 39 уровня — в этом сезоне нужен ладдерный персонаж. Сделки делятся между Фазовым клинком для мили-персонажей и амазонскими луками вроде Лука матриарха — типичная роль бюджетного оружия середины игры, пока копите на настоящий эндгейм.",
        "Maxroll оценивает его высоко для своей ниши, но это промежуточная ступень — продаётся изредка, качающимся персонажам.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll A; ladder-only; 50 trades in ~550h (moderate); top bases Phase Blade 11, Matriarchal Bow 8; judgement: newer 3.x word, kept modest — budget mid-game weapon per data",
  },
  Hysteria: {
    usefulness: "situational",
    advice: {
      paragraphs: [
        "The body-armor sibling of Mania (same Shael Ko Eld runes, ladder-only this season) — a cheap 3-socket chest for the level-39 bracket. Completed trades show light caster bases like Mage Plate and Dusk Shroud alongside Archon Plate; an ethereal Archon Plate or elite armor also works as a budget mercenary chest, since the merc never breaks it.",
        "A decent stopgap until Fortitude or an endgame armor arrives; it sells occasionally to levelling characters and merc-gearers.",
      ],
      ru: [
        "Броневой близнец Mania (те же руны Shael Ko Eld, в этом сезоне — только ладдер) — дешёвая броня на 3 гнезда для уровня 39. В сделках лёгкие кастерские базы вроде Лат мага (Mage Plate) и Сумеречного савана рядом с Архонтскими латами; эфирные Архонтские латы или другая элитная броня годятся и как бюджетный нагрудник для наёмника — он её не ломает.",
        "Нормальная затычка, пока не появится Fortitude или другая эндгеймовая броня; продаётся изредка — качающимся персонажам и на наёмников.",
      ],
      sources: [
        {
          label: "Maxroll tier list",
          url: "https://maxroll.gg/d2/tierlists/runeword-tier-list",
        },
        {
          label: "Traderie trade data",
          url: "https://traderie.com/diablo2resurrected",
        },
      ],
    },
    source:
      "Maxroll B; ladder-only; 50 trades in ~613h (moderate); top bases Mage Plate 11, Archon Plate 11, Dusk Shroud 9; judgement: newer 3.x word, kept modest — budget mid-game armor per data",
  },
};
