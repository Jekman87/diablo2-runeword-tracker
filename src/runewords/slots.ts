import type { Runeword } from "@/data";

/**
 * The five equipment slots the slot filter offers.
 *
 * A tuple rather than a bare union, so the filter's options, the stored value's
 * schema and this type all read from one declaration. `IDEAS.md` settles that
 * these are the *only* category filter: anything finer grained is search's job,
 * not a sixth control's.
 *
 * **The names are the game's own, and the split follows it too.** The in-game
 * Chronicle lists Body Armor, Helmet, Offhand, Melee and Missile — it calls the
 * shield slot the offhand, which is honest about `Grimoire` sitting there beside
 * `Shields`, and it separates melee from missile weapons, which is the difference a
 * player actually plans around: a bow runeword and a sword runeword are not
 * alternatives to each other. This project first had four slots with one `weapon`,
 * and adopting the player's own vocabulary is worth the delta.
 *
 * The order is the order the control presents them in — the head, then the two
 * weapon slots together, then the off-hand, then the body. Not the Chronicle's own
 * order, which suits the vertical list it draws where ours is a row of chips.
 */
export const slots = [
  "helm",
  "melee",
  "missile",
  "offhand",
  "bodyArmour",
] as const;

export type Slot = (typeof slots)[number];

/**
 * The slots a base item category belongs to.
 *
 * **A list rather than a single slot**, which is the shape the melee/missile split
 * forced. `Weapons` means *any* weapon — a runeword carrying it can be made in a
 * bow as readily as in a sword — so one category genuinely belongs to two slots,
 * and collapsing it to either would hide nine runewords from a filter they belong
 * in. Every other category maps to exactly one.
 *
 * Empty for a category this project has not mapped. That is a defect rather than a
 * state the interface renders — its runewords would be unreachable by every option
 * of the control — and `slots.test.ts` asserts over the dataset that it cannot
 * happen, so the empty case exists to be caught by a test.
 */
export function slotsOfCategory(category: string): readonly Slot[] {
  return SLOTS_BY_CATEGORY[category] ?? [];
}

/**
 * The distinct slots a runeword occupies, in the order the filter lists them.
 *
 * A runeword matches a slot when **any** of its categories belongs to it, so
 * `Fortitude` (`Weapons`, `Body Armors`) yields melee, missile and body armour and
 * is presented under all three. That is not a compromise: a runeword really can go
 * into any of them.
 *
 * Thirteen of the 99 span more than one slot and `Fortitude` spans three, where the
 * four-slot mapping had five spanning two and none spanning three. Splitting the
 * weapons is what did that, and it is the honest count rather than a regression:
 * those runewords always could go into either kind of weapon, and one `weapon` slot
 * simply had no way to say so.
 */
export function slotsOf(runeword: Runeword): Slot[] {
  const occupied = new Set<Slot>();

  for (const category of runeword.itemTypes) {
    for (const slot of slotsOfCategory(category)) occupied.add(slot);
  }

  // Filtered from the canonical order rather than returned in the order the
  // record happens to name its categories, so two runewords covering the same
  // slots always report them the same way round.
  return slots.filter((slot) => occupied.has(slot));
}

/**
 * All 20 base item categories the dataset names, grouped into the five slots.
 *
 * **In application code, and deliberately not in the dataset.** The slot is this
 * project's grouping of the vendored categories, not a value the vendored source
 * carries: `src/data/item-types.json` is generated from `vendor/`, the generator
 * validates the vendored shape and fails on a field it does not know, and
 * `vendor/` is read-only. A `slot` field there would mean the generator emitting
 * a value with no source, which is the "plausible-looking dataset" its own rules
 * exist to prevent. So the mapping is keyed *by* the category names and lives
 * beside them.
 *
 * Total over the categories the dataset uses, **proven by test rather than
 * asserted here**. The failure that matters is not a mis-grouped category but an
 * unmapped one: it would make its runewords vanish from every slot at once, and
 * silently. A category valid upstream and new to us therefore fails the suite.
 *
 * Three entries are worth defending.
 *
 * `Grimoire → offhand`. It occurs on seven runewords — `Ancient's Pledge`,
 * `Rhyme`, `Sanctuary`, `Splendor`, `Dragon`, `Dream`, `Vigilance` — and on every
 * one of them beside `Shields`, so a Grimoire runeword is an off-hand runeword and
 * any other mapping makes those seven answer the wrong filter. The slot being
 * named for the hand rather than for the shield is what makes that read as a fact
 * instead of as an exception.
 *
 * `Weapons → melee and missile`, the one category with two. See `slotsOfCategory`.
 *
 * `Wands`, `Staves` and `Scepters → melee`. All three are melee weapons in the game
 * however much the class carrying them casts; nothing about a caster base makes it
 * a missile weapon.
 */
const SLOTS_BY_CATEGORY: Record<string, readonly Slot[]> = {
  Helms: ["helm"],

  "Body Armors": ["bodyArmour"],

  Shields: ["offhand"],
  "Paladin Shields": ["offhand"],
  Grimoire: ["offhand"],

  // Any weapon at all, so both of the weapon slots.
  Weapons: ["melee", "missile"],

  "Melee Weapons": ["melee"],
  Axes: ["melee"],
  Claws: ["melee"],
  Clubs: ["melee"],
  Daggers: ["melee"],
  Hammers: ["melee"],
  Maces: ["melee"],
  Polearms: ["melee"],
  Scepters: ["melee"],
  Spears: ["melee"],
  Staves: ["melee"],
  Swords: ["melee"],
  Wands: ["melee"],

  "Missile Weapons": ["missile"],
};
