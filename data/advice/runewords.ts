// Usefulness judgements and crafting advice for all 99 runewords, keyed by
// canonical English name. Authored editorial content — nothing here has a
// vendor source, which is exactly why it lives beside `data/ru/` rather than
// in `vendor/` or the generator.
//
// **How the judgements were made.** The Maxroll runeword tier list is the
// starting point (S/A → meta, B/C → situational, D/F → chronicle), checked
// against Traderie completed-trade velocity — the time the newest 50 completed
// trades span, collected 2026-08-02 during the Reign of the Warlock season.
// Where the two disagree the note on the entry records the call. Recommended
// bases come from the same Traderie listings (sellers name the base) crossed
// with build guides.
//
// **Russian prose is this project's own**, written against fan references —
// the strict game-client rule applies to the game vocabulary inside it (base
// item names, class names), not to the sentences. No machine translation.
//
// Every entry's `source` says where its reasoning came from; the generator
// keeps the field out of the emitted JSON.
import type { RunewordAdviceEntry } from "./types.ts";

export const runewordAdvice: Record<string, RunewordAdviceEntry> = {};
