// The shape of the authored advice module. Keys are canonical English
// runeword names; the generator validates them against the vendored data and
// fails on any key it does not define, exactly as it does for translations.

/**
 * One runeword's editorial judgement and advice, authored by this project —
 * neither field has a vendor source.
 *
 * `usefulness` is the closed three-value judgement the table renders under
 * the name. `advice` is the panel's content: English paragraphs, their
 * Russian mirrors (same count — rendering pairs them by position), and the
 * links the judgement was drawn from. `source` records where the entry's
 * reasoning came from — tier list, trade data, build guide — for review, and
 * is never emitted.
 */
export interface RunewordAdviceEntry {
  usefulness: "meta" | "situational" | "chronicle";
  advice?: {
    paragraphs: string[];
    ru: string[];
    sources?: { label: string; url: string }[];
  };
  source: string;
}

/**
 * The game names the advice highlighter marks, by kind. Each kind is drawn in
 * the colour the rest of the page already uses for that kind of thing, so a
 * base item reads as a base item wherever it appears.
 */
export interface AdviceTermsSource {
  bases: { en: string[]; ru: string[] };
  skills: { en: string[]; ru: string[] };
}
