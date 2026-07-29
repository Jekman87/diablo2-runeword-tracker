import { slots } from "@/runewords/slots";
import type { SortDirection, SortKey } from "@/runewords/sort";

/**
 * The three states of the crafted filter.
 *
 * `all` first, because it is the default and the control lists them in this
 * order.
 */
export const craftedFilters = ["all", "crafted", "remaining"] as const;

export type CraftedFilter = (typeof craftedFilters)[number];

/**
 * The five states of the slot filter: everything, or one of the four slots.
 *
 * **One slot rather than a set.** A runeword already belongs to several slots —
 * `Fortitude` is a weapon and a body armour — so a union of two would produce a
 * presented set that is hard to predict from the controls, and search covers the
 * finer intent that would want it. Stored as a named slot rather than an array of
 * one, so a future multi-select would be a new key rather than a shape this one
 * has to keep accepting.
 */
export const slotFilters = ["all", ...slots] as const;

export type SlotFilter = (typeof slotFilters)[number];

/**
 * How the player has chosen to look at the list.
 *
 * **There is no search field here, deliberately.** Sort and the two filters are a
 * preference and are persisted; a search query is a lookup in progress and is
 * not, so it travels beside these rather than within them — see
 * `useViewSettings` and `visibleRunewords`, both of which take it as a separate
 * parameter for that reason.
 */
export interface ViewSettings {
  sortKey: SortKey;
  sortDirection: SortDirection;
  craftedFilter: CraftedFilter;
  slotFilter: SlotFilter;
}

/**
 * The view a first visit gets, and the filters a reset returns to.
 *
 * Required level ascending, because that is `runeword-table`'s default order and
 * the order every other ordering falls back to. Both filters present everything.
 *
 * `Readonly`, and handed out rather than rebuilt, because nothing may mutate it —
 * a reset that edited the defaults would change what every later reset means.
 */
export const DEFAULT_VIEW_SETTINGS: Readonly<ViewSettings> = {
  sortKey: "requiredLevel",
  sortDirection: "ascending",
  craftedFilter: "all",
  slotFilter: "all",
};
