import { type ReactNode, useId } from "react";

import { cva } from "class-variance-authority";

import { runewords } from "@/data";
import { type Strings, useStrings } from "@/i18n";
import type { CraftedFilter, SlotFilter } from "@/view/types";

export interface RunewordControlsProps {
  query: string;
  craftedFilter: CraftedFilter;
  slotFilter: SlotFilter;
  /** How many rows the table is presenting. The total is not a prop — see below. */
  visibleCount: number;
  /** Whether anything is hiding rows, which is when the reset is offered. */
  narrowed: boolean;
  /**
   * The export and import controls, rendered at the far end of the row that
   * states the result count.
   *
   * **A slot rather than `onExport` and `onImport` props**, because this
   * component owns no state and renders the view settings — and progress is not
   * one. Taking those two callbacks would drag a file input, a parsed file and a
   * confirmation dialog into the component about search and filters, and would
   * make the thing that decides *where* the controls sit also the thing that
   * knows what they do. `App` builds them, for the same reason it builds the
   * mark/unmark confirmation: it is where the crafted set lives.
   *
   * Optional, so every existing test that renders this bar still renders.
   */
  transfer?: ReactNode;
  onQueryChange: (query: string) => void;
  onCraftedFilterChange: (filter: CraftedFilter) => void;
  onSlotFilterChange: (filter: SlotFilter) => void;
  onReset: () => void;
}

/**
 * The search field, the two filters, the count and the reset.
 *
 * Sits between the progress bar and the table, which is where `IDEAS.md` puts
 * search and filters in the Phase 1 layout. It owns no state: `App` holds the
 * settings and this renders them, so the controls always show what the table is
 * actually doing — which matters most on a first paint, where a restored filter is
 * otherwise invisible state.
 *
 * **The denominator is read from the dataset here, and is deliberately not a
 * prop**, for the same reason `CraftedProgress` reads it: the count is *presented
 * out of every runeword there is*, and a prop is how that would quietly become
 * "out of the rows before the last filter".
 *
 * **No debounce.** Filtering and sorting 99 records already in memory is a single
 * pass over an array; a debounce would add latency to every keystroke to save work
 * that does not exist.
 *
 * The bar wraps rather than scrolling. The table's sideways overflow below about
 * 542px is a pre-existing defect recorded in `IDEAS.md`, and this must not add to
 * it.
 */
export function RunewordControls({
  query,
  craftedFilter,
  slotFilter,
  visibleCount,
  narrowed,
  transfer,
  onQueryChange,
  onCraftedFilterChange,
  onSlotFilterChange,
  onReset,
}: RunewordControlsProps) {
  const strings = useStrings();
  const searchId = useId();
  const hintId = useId();

  return (
    <div className="grid gap-3">
      {/* `items-start`, so the filter legends line up with the search field's own
          label rather than with the bottom of its hint. The search block and each
          fieldset put the same 4px between their heading and their control, so
          aligning the tops aligns both rows — the hint simply hangs below. */}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="grid gap-1">
          <label htmlFor={searchId} className="text-gold-mid">
            {strings.controls.searchLabel}
          </label>

          {/* `type="search"` rather than `type="text"`: it carries the searchbox
              role and the engine's own clear affordance, neither of which is
              worth rebuilding. */}
          <input
            id={searchId}
            type="search"
            value={query}
            aria-describedby={hintId}
            onChange={(event) => onQueryChange(event.target.value)}
            className="search-field h-9 w-full max-w-xs rounded-xs border border-row-line bg-muted-dark px-2 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
          />

          <p id={hintId} className="text-[14px] text-muted">
            {strings.controls.searchHint}
          </p>
        </div>

        <RadioFilter
          legend={strings.controls.craftedLegend}
          value={craftedFilter}
          options={craftedOptions(strings)}
          onChange={onCraftedFilterChange}
        />

        <RadioFilter
          legend={strings.controls.slotLegend}
          value={slotFilter}
          options={slotOptions(strings)}
          onChange={onSlotFilterChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Polite rather than assertive, and never moving focus: a filter change
            is worth announcing and is not worth interrupting. The region is in
            the document unconditionally, because one that appears at the same
            moment as its text is one some readers never announce. */}
        <p aria-live="polite" className="text-gold-mid">
          {strings.controls.count(visibleCount, runewords.length)}
        </p>

        {/* Only while something is hidden. A permanent "clear" on an unfiltered
            page is a control that does nothing, which is the same defect as a
            colour token with no use site. */}
        {narrowed ? (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-item-restriction underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
          >
            {strings.controls.reset}
          </button>
        ) : null}

        {/* Pushed to the far end of the count's row rather than squeezed in
            beside the filters. The first row is already a search field and nine
            chips across two fieldsets, and at 1152px there is no honest room for
            two more buttons on it — the pair would wrap and read as a bar of its
            own without being one.

            `ml-auto` rather than `justify-between` on the row: the reset appears
            and disappears with the narrowing, so the row's content count
            changes, and space-between would move the buttons whenever it did.
            This pins them to the end regardless. When the row is too narrow to
            hold both ends, the margin collapses and they wrap under the count. */}
        <div className="ml-auto flex flex-wrap gap-1">{transfer}</div>
      </div>
    </div>
  );
}

interface RadioFilterProps<T extends string> {
  legend: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

/**
 * One filter: a `<fieldset>`, its `<legend>`, and radio inputs styled as chips.
 *
 * **Radios rather than buttons with `aria-pressed`.** The semantics say "one of
 * these" without a sentence explaining it, arrow-key movement between the options
 * comes for free, and the legend names the group for a reader who arrives at it
 * out of context. Both filters are single-select by decision — a runeword belongs
 * to several slots at once, so a union of two produces a presented set that is
 * hard to predict from the controls.
 *
 * The input stays a real radio and is visually hidden inside its own label, so the
 * chip is the label's own background and the control keeps its role, its keyboard
 * behaviour and its focus.
 */
function RadioFilter<T extends string>({
  legend,
  value,
  options,
  onChange,
}: RadioFilterProps<T>) {
  const name = useId();

  return (
    /* Not a grid or a flex container: a `<legend>` is laid out by the fieldset
       itself and engines disagree about what it becomes inside one. The margin
       below does the spacing the gap would have. */
    <fieldset>
      <legend className="mb-1 text-gold-mid">{legend}</legend>

      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={chip({ selected: option.value === value })}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />

            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * A filter option's two states, as a `cva` variant rather than a conditional
 * string.
 *
 * Both colours are tokens that were already declared with nothing rendering them —
 * `--color-muted-dark` at rest and `--color-blood-light` when selected — which is
 * the fix `d2-theme` asks for rather than a sixth colour family beside them.
 *
 * `has-[:focus-visible]` draws the focus indicator on the chip when the hidden
 * radio inside it takes focus, so the keyboard state is visible even though the
 * input is not.
 *
 * This comment is worded around a scanner in one respect, which is worth knowing
 * before anyone "improves" it: Tailwind reads `src/**` for class candidates and
 * cannot tell prose from markup, so the usual four-letter word for what focus
 * draws around a chip generates that utility and its `@property` block — 1.65 kB
 * for a word in a sentence, and it comes back if the word is written either bare or
 * with a leading dot. The same defect `IDEAS.md` records from a change document,
 * seen from inside the application. `src/index.css` has the rest of the story.
 */
const chip = cva(
  // `h-9` is the search field's height, stated on both rather than left to fall out
  // of padding and two different font sizes — a chip and the field sitting side by
  // side at 28px and 34px read as a mistake, and no amount of `py-` makes 14px text
  // and 16px text agree by accident. `inline-flex` is what lets a `<label>` centre
  // its own text inside a stated height.
  "inline-flex h-9 cursor-pointer items-center rounded-xs px-3 text-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-light",
  {
    variants: {
      selected: {
        true: "bg-blood-light text-gold-light",
        false: "bg-muted-dark text-body hover:text-gold-light",
      },
    },
  },
);

/**
 * The crafted filter's three options.
 *
 * Built from the copy rather than mapped over the `craftedFilters` tuple, because
 * a lookup from a value to a string is one more indirection than three lines, and
 * the compiler catches an option this version does not offer either way.
 */
function craftedOptions(strings: Strings) {
  return [
    { value: "all", label: strings.controls.craftedAll },
    { value: "crafted", label: strings.controls.craftedCrafted },
    { value: "remaining", label: strings.controls.craftedRemaining },
  ] as const satisfies readonly { value: CraftedFilter; label: string }[];
}

/** The slot filter's six options, in the order `slots` declares them. */
function slotOptions(strings: Strings) {
  return [
    { value: "all", label: strings.controls.slotAll },
    { value: "helm", label: strings.controls.slotHelm },
    { value: "melee", label: strings.controls.slotMelee },
    { value: "missile", label: strings.controls.slotMissile },
    { value: "offhand", label: strings.controls.slotOffhand },
    { value: "bodyArmour", label: strings.controls.slotBodyArmour },
  ] as const satisfies readonly { value: SlotFilter; label: string }[];
}
