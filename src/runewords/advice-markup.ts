import { adviceTerms, runes, runewords } from "@/data";

/** What an advice fragment is, which is what decides how it is drawn. */
export type AdviceKind = "text" | "value" | "skill" | "base" | "rune";

/** One piece of an advice paragraph, and how it should be drawn. */
export interface AdviceSegment {
  text: string;
  kind: AdviceKind;
}

/**
 * An advice paragraph split into prose, game names and numbers, each name
 * classified by what kind of thing it is.
 *
 * **The colours are the page's, not this panel's.** A base item is drawn as the
 * table's base column draws one, a rune as the table's rune labels, a skill and
 * its numbers as a granted property in the detail panel. The advice talks about
 * the same things the table shows, so the reader should not have to learn a
 * second vocabulary to read it — which is also why `kind` is returned rather
 * than a class name: the mapping to colours belongs to the component, this
 * belongs to the data.
 *
 * **Why terms are recognised rather than marked up.** The advice is plain
 * strings on purpose — an editor writing a paragraph should not have to
 * remember a markup convention, and a stray bracket should not be able to break
 * rendering. Recognition works because the prose writes names in consistent
 * shapes: a Latin run inside Russian prose is always a game name, a Russian
 * name glossed with its English one (`Латы мага (Mage Plate)`) is one term
 * including the gloss, and a capitalised phrase in English prose is a proper
 * name in a register that otherwise stays lower case. What the shapes cannot do
 * is say *which kind* of name they found, so the kinds come from the
 * dictionaries — the dataset's own runes and runeword names, and the base and
 * skill lists generated beside the advice.
 *
 * An unrecognised name is a skill. Bases, runes and runeword names are all
 * covered by lists derived from closed sets; skills are the open one, because
 * each season adds its own and the vendored property lines are the last to know
 * them.
 *
 * Segments concatenate back to the input exactly, which the round-trip test
 * asserts over every shipped paragraph — the same guarantee `PropertyLine`
 * makes, and for the same reason.
 */
export function markUpAdvice(paragraph: string): AdviceSegment[] {
  const segments: AdviceSegment[] = [];
  let last = 0;

  for (const match of paragraph.matchAll(PATTERN)) {
    const text = match[0];

    // `Maxroll and Traderie` now matches as one phrase, so the exclusion has
    // to hold for a run of excluded names as well as for a lone one.
    if (
      text
        .split(/ (?:of|the|and) | /)
        .every((word) => EXCLUDED.has(word) || word === "")
    ) {
      continue;
    }

    if (match.index > last) {
      segments.push({ text: paragraph.slice(last, match.index), kind: "text" });
    }

    segments.push({ text, kind: classify(text) });
    last = match.index + text.length;
  }

  if (last < paragraph.length) {
    segments.push({ text: paragraph.slice(last), kind: "text" });
  }

  return segments;
}

/** What kind of thing a matched fragment names. */
function classify(text: string): AdviceKind {
  if (VALUE_ONLY.test(text)) return "value";
  // Ethereal is a property of the *base*, not of the runeword put into it —
  // "make it ethereal" is an instruction about which item to go and find, the
  // same kind of instruction as "make it a Monarch". So it takes the base
  // colour rather than the property blue every other stat here takes.
  if (BASE_STAT.test(text)) return "base";
  if (RUNE_NAMES.has(text)) return "rune";
  // A recipe — `Hel Shael Ral`, `Vex-Lo-Ber-Jah` — matches as one capitalised
  // phrase, and every word of it is a rune. Colouring the run gold is both
  // correct and what the table does with the same names.
  if (text.split(/[ -]/).every((word) => RUNE_NAMES.has(word))) return "rune";
  // Skills before runeword names, because several words are named after the
  // skill they grant — `Fury` is a druid skill and a chronicle-tier runeword,
  // and the prose means the skill far more often than the word.
  if (SKILL_NAMES.has(text)) return "skill";
  if (RUNEWORD_NAMES.has(text)) return "rune";
  if (BASE_NAMES.has(text)) return "base";
  // The prose pluralises a base as readily as it names one: `trades show
  // Flails and Scimitars`. The dictionary holds the singular, so a trailing
  // `s` is stripped before the lookup rather than doubling every entry.
  const singular = text.replace(/s$/, "");
  if (BASE_NAMES.has(singular)) return "base";
  if (SKILL_NAMES.has(singular)) return "skill";
  // A glossed name — `Латы мага (Mage Plate)` — is classified by its gloss,
  // which is the half the base list knows.
  const gloss = /\(([^)]+)\)$/.exec(text)?.[1];
  if (gloss !== undefined && BASE_NAMES.has(gloss)) return "base";
  if (gloss !== undefined && SKILL_NAMES.has(gloss)) return "skill";
  // A stem-matched Russian name says nothing about itself, so the kind is
  // decided by asking which stem list it satisfies. Bases are asked last,
  // after the skills above, for the `Fury` reason.
  if (RU_BASES.length > 0 && RU_BASE_MATCH.test(text)) return "base";

  return "skill";
}

/**
 * A number worth hitting: a signed value, optionally a range, optionally a
 * percent — or an unsigned range that carries one. The sign and the percent are
 * what keep a socket count (`3-socket`) and a patch number (`2.4`) out of it.
 */
const VALUE =
  // signed, with an optional range: `+3`, `+40-45`, `+1..+6`, `-20%`. The
  // minus belongs in the sign class: `-20% to enemy fire resistance` is a
  // bonus, and colouring `20%` while leaving the sign black reads as one.
  // A hyphen inside `3-14` cannot be caught by it, because the boundary
  // lookbehind refuses a match that starts right after a digit.
  "[+±-]\\d+(?:[.,]\\d+)?(?:\\s?(?:\\.\\.|[-–—])\\s?\\+?\\d+(?:[.,]\\d+)?)?%?" +
  // an unsigned range carrying a percent: `25-35%`
  "|\\d+(?:[.,]\\d+)?\\s?[-–—]\\s?\\d+(?:[.,]\\d+)?%" +
  // a bare percentage: `25%`, which is how a flat chance is written
  "|\\d+(?:[.,]\\d+)?%";

const VALUE_ONLY = new RegExp(`^(?:${VALUE})$`);

/** Escapes a name for use inside the alternation below. */
function quoted(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The stats that describe the base item rather than the runeword's own
 * properties, and so are drawn in the base colour. Ethereal is the whole list
 * today: it is the one word in these texts that answers "which item do I go
 * looking for" rather than "what will the finished item do".
 */
const BASE_STAT = /^(?:ethereal|эфирн[а-яё]+)$/iu;

const RUNE_NAMES = new Set(runes.flatMap((rune) => [rune.name, rune.ru]));

const RUNEWORD_NAMES = new Set(
  runewords.flatMap((record) =>
    record.ru ? [record.name, record.ru.name] : [record.name],
  ),
);

const BASE_NAMES = new Set([...adviceTerms.bases.en, ...adviceTerms.bases.ru]);

const SKILL_NAMES = new Set([
  ...adviceTerms.skills.en,
  ...adviceTerms.skills.ru,
]);

/**
 * A Russian skill name as a pattern that survives inflection: each word keeps
 * its stem and takes any ending. «Святая стужа» has to be found in Doom's
 * «Оружие Святой стужи», and a dictionary of exact forms would need every case
 * of every name in it.
 */
function stemmed(name: string): string {
  return name
    .split(" ")
    .map((word) =>
      /[а-яё]/i.test(word)
        ? `${quoted(word.replace(/[а-яё]{0,2}$/i, ""))}[а-яё]*`
        : quoted(word),
    )
    .join(" ");
}

/**
 * Stat vocabulary, as stems, because Russian inflects and English does not.
 * Deliberately short: these are the stats the advice actually asks a reader to
 * look for on a base, not every stat in the game.
 *
 * The Russian stems end in `[а-яё]*` and never `\w*`: JavaScript's `\w` is
 * ASCII by definition, so `сопротивлени\w*` matches the stem and stops dead
 * before the ending — which is exactly the silent half-match a highlighter
 * must not make.
 */
const STATS = [
  // English
  "all resistances",
  "resistances",
  "enhanced damage",
  "enhanced defense",
  "faster cast rate",
  "crushing blow",
  "deadly strike",
  "open wounds",
  "life steal",
  "life stolen per hit",
  "magic find",
  "prevent monster heal",
  "attack speed",
  "ethereal",
  // Russian, stemmed
  "сопротивлени[а-яё]*",
  "резист(?:ы|ов|ам|ами|ах|а|у)?(?![а-яё])",
  "усиленн[а-яё]+ (?:урон[а-яё]*|защит[а-яё]*)",
  "скорост[а-яё]* (?:каста|атаки|чтения заклинаний)",
  "сокрушающ[а-яё]+ удар[а-яё]*",
  "смертельн[а-яё]+ удар[а-яё]*",
  "открыт[а-яё]+ ран[а-яё]*",
  "кража жизни",
  "похищени[а-яё]* жизни",
  "эфирн[а-яё]+",
  "стаффмод[а-яё]*",
  "оскилл[а-яё]*",
  "гнёзд[а-яё]*",
  "мэджик-финд[а-яё]*",
];

/**
 * The two names in the sources line that are not game terms. Everything else a
 * Latin run catches in Russian prose is one.
 */
const EXCLUDED = new Set([
  // The two source sites in the review notes.
  "Maxroll",
  "Traderie",
  // Places, monsters and tags: capitalised, and not things a crafter buys.
  "Uber Tristram",
  "Burning Souls",
  "Chaos Sanctuary",
  "Amazon Only",
  "Assassin Only",
  "Sorceress Only",
  "Druid Only",
  "Warlock Only",
  "Necromancer Only",
  "Paladin Only",
  "Barbarian Only",
]);

/**
 * Longest first, so `Grand Matron Bow` wins over the `Bow` inside it and
 * `Секира берсерка (Berserker Axe)` over either half.
 */
const NAMED = [
  ...RUNE_NAMES,
  ...RUNEWORD_NAMES,
  ...BASE_NAMES,
  ...adviceTerms.skills.en,
]
  // Two letters is long enough for a rune and too short for anything else:
  // five of the 33 are `El`, `Io`, `Ko`, `Um`, `Lo` — and `Ло` in Doom's
  // `(Cham, Lo, Ohm)` was the one name in the recipe left uncoloured. Other
  // dictionaries keep the length floor, because a two-letter base or skill
  // name would be a fragment of something rather than a name.
  .filter((name) => name.length > 2 || RUNE_NAMES.has(name))
  .sort((a, b) => b.length - a.length);

/**
 * The dictionary, split by how many words a name has.
 *
 * **The split is what makes the longest name win.** A regex alternation takes
 * the first branch that matches, not the longest, so a one-word name tried
 * early beats the longer phrase containing it: `Bone` (a runeword) inside
 * `Bone Spirit` (a skill), `Blade` inside `Blade Shield`, `Ice` inside
 * `Blades of Ice`. Every multi-word name is tried first, then the generic
 * capitalised phrase, and only then the single words — so a phrase is always
 * considered before its parts.
 */
// `s?` so `Berserker Axes` and `Flails` match the singular the dictionary
// holds; `classify` strips the same `s` before looking a match up.
const plural = (name: string) =>
  /[a-z]$/.test(name) ? `${quoted(name)}s?` : quoted(name);

const NAMED_PHRASES = NAMED.filter((name) => name.includes(" ")).map(plural);

const NAMED_WORDS = NAMED.filter((name) => !name.includes(" ")).map(plural);

/**
 * Russian base names, matched by stem for the reason the skills are: the prose
 * declines them. «Секира берсерка» has to be found as «Секиру берсерка», and
 * «Монарх» as «Монархи» and «Монархам».
 */
const RU_BASES = adviceTerms.bases.ru
  .filter((name) => /[а-яё]/i.test(name))
  .sort((a, b) => b.length - a.length)
  .map(stemmed);

const RU_BASE_MATCH = new RegExp(`^(?:${RU_BASES.join("|")})$`, "iu");

const RU_SKILLS = adviceTerms.skills.ru
  .slice()
  .sort((a, b) => b.length - a.length)
  .map(stemmed);

/**
 * The English names a Russian gloss may carry. Restricting the gloss form to
 * known names is what keeps «Руны очень дорогие (Cham, Lo, Ohm)» from reading
 * as an item called "very expensive runes" — a parenthesis after a capitalised
 * Russian phrase is common in this prose and only sometimes a gloss.
 */
const GLOSSES = [...BASE_NAMES, ...adviceTerms.skills.en]
  .filter((name) => /^[A-Z]/.test(name))
  .sort((a, b) => b.length - a.length)
  .map(quoted)
  .join("|");

/**
 * A Russian name with its English gloss, a bare Latin run, a capitalised
 * English phrase, a known name, an inflected Russian skill, a stat, or a
 * number — in that order, because the first alternative that matches at a
 * position wins and the compound forms have to be tried before their parts.
 */
const PATTERN = new RegExp(
  // **The boundaries are Unicode-aware, and that is not a detail.** `\b` is
  // defined over ASCII word characters, so it counts every Cyrillic letter as
  // a boundary: the rune `Ист` matched inside «Историю» and left the word
  // half-coloured. A lookaround over `\p{L}` and digits is the boundary that
  // holds in both alphabets.
  //
  // The known names come before the generic shapes, so a rune sequence reads
  // as runes: `Hel Shael Ral` is three names the dictionary knows, and the
  // capitalised-phrase rule would otherwise swallow all three and call the
  // result one skill.
  `(?<![\\p{L}\\d])(?:${[
    `[А-ЯЁ][а-яё]+(?:[ -][а-яё]+){0,3} \\((?:${GLOSSES})\\)`,
    NAMED_PHRASES.join("|"),
    RU_SKILLS.join("|"),
    RU_BASES.join("|"),
    // A capitalised phrase, with the small words a skill name may contain:
    // `Claws of Thunder`, `Blades of Ice`. Before the single-word names, so
    // the whole skill wins over the base or runeword hiding inside it —
    // `Bone Spirit` is a skill, not the `Bone` runeword next to `Spirit`.
    // Not starting on a sentence-opening function word or on a stat: `The
    // Cham`, `But Smoke` and `Ethereal Berserker Axe` are one capitalised run
    // each, and all three would swallow the name that follows.
    "(?!(?:The|A|An|But|And|If|It|Its|This|That|These|Those|Each|Every|Both|" +
      "Once|Within|Ethereal|Uber)[ -])" +
      "[A-Z][A-Za-z'’]*(?:[ -](?:of|the|and)[ -][A-Z][A-Za-z'’]*|[ -][A-Z][A-Za-z'’]*)+",
    NAMED_WORDS.join("|"),
    STATS.join("|"),
    VALUE,
  ].join("|")})(?![\\p{L}\\d])`,
  "gu",
);
