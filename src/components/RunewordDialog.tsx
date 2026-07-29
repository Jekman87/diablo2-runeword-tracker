import { ItemTypes } from "@/components/ItemTypes";
import { PropertyLine } from "@/components/PropertyLine";
import { RuneSequence } from "@/components/RuneSequence";
import type { Runeword } from "@/data";
import { useStrings } from "@/i18n";

export interface RunewordDialogProps {
  /** The runeword being shown. The panel is only rendered while open. */
  runeword: Runeword;
  /** The heading's id, so the panel around this can be named by it. */
  titleId: string;
  onClose: () => void;
}

/**
 * The detail view's body: one runeword's runes with their names, the socket count
 * derived from them, its bases, its level, its availability in full words and
 * every granted property line.
 *
 * The content is exactly what it was. What went away is the element it lived in:
 * this was a `<dialog>` opened with `showModal()`, and a view that now opens when
 * a pointer comes to rest on a name has no business being a modal dialog or
 * dimming the page behind it. `RunewordDetails` owns the panel, its position and
 * its focus behaviour; this renders what is inside it and nothing else.
 *
 * The four things `showModal()` supplied for free are supplied there instead —
 * `useDismiss` for Escape and outside-press, `FloatingFocusManager` for the trap
 * and for focus returned to the name. The backdrop has no replacement because it
 * has no place: it was the one part of the dialog that was about interrupting the
 * reader.
 *
 * It renders only when there is a runeword to render, so `runeword` is required
 * rather than nullable. The empty-while-closed branch existed because one dialog
 * element had to stay mounted for the platform to close it; nothing stays mounted
 * now.
 */
export function RunewordDialog({
  runeword,
  titleId,
  onClose,
}: RunewordDialogProps) {
  const strings = useStrings();

  return (
    <div className="grid gap-3">
      {/* The close control sits at the top, beside the name, rather than after
          the property list. That is not only convention: it is the first
          focusable element in the panel, so it is where a deliberately-opened
          panel puts focus — and a button below 26 property lines would have the
          browser scroll the panel to its bottom on open, landing the reader past
          the name they just clicked. */}
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={titleId} className="text-2xl text-gold-mid">
          {runeword.name}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer border border-row-line px-3 py-1 text-gold-mid hover:text-gold-light"
        >
          {strings.detail.close}
        </button>
      </div>

      {/* Label in one column, value in the next. A `dl` stacks by default,
          which turns eight short facts into sixteen lines and pushes the
          property list off a laptop screen. */}
      <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
        <dt className="text-gold">{strings.detail.runes}</dt>
        {/* The same component the rows draw, at the same native size. The panel
            was already the place that showed a rune's name beneath its icon;
            sharing it is what makes that one presentation rather than two that
            happen to agree. */}
        <dd>
          <RuneSequence runeword={runeword} className="flex flex-wrap gap-3" />
        </dd>

        <dt className="text-gold">{strings.detail.sockets}</dt>
        {/* Derived here, at the point of display. There is no socket field
            on the record and none may be added: a second representation of
            a fact can only drift from the first. */}
        <dd>{runeword.runes.length}</dd>

        <dt className="text-gold">{strings.detail.itemTypes}</dt>
        <dd>
          <ItemTypes runeword={runeword} />
        </dd>

        <dt className="text-gold">{strings.detail.requiredLevel}</dt>
        <dd>{runeword.requiredLevel}</dd>

        {/* Patch and ladder status in full words, not the row's markers.
            This is the path that needs no pointer at all — a touch user
            with no screen reader can reach neither a hover tooltip nor an
            accessible name. */}
        {runeword.patch || runeword.ladderOnly ? (
          <>
            <dt className="text-gold">{strings.detail.availability}</dt>
            {/* One `dd` holding both sentences rather than two, because the
                two-column grid gives each `dd` the second column and a
                second one would land back under the label. */}
            <dd>
              {runeword.patch ? (
                <span className="block">
                  {strings.availability.patchMeaning(runeword.patch)}
                </span>
              ) : null}
              {runeword.ladderOnly ? (
                <span className="block">
                  {strings.availability.ladderMeaning}
                </span>
              ) : null}
            </dd>
          </>
        ) : null}

        {/* `Mosaic`'s caveat is the single most actionable sentence in the
            dataset, and the reference hides it behind a hover. */}
        {runeword.note ? (
          <>
            <dt className="text-gold">{strings.detail.note}</dt>
            <dd className="text-accent">{runeword.note}</dd>
          </>
        ) : null}
      </dl>

      <h3 className="text-xl">{strings.detail.properties}</h3>
      <ul className="grid gap-0.5 text-property">
        {runeword.properties.map((line, index) => (
          <li key={index}>
            <PropertyLine line={line} />
          </li>
        ))}
      </ul>
    </div>
  );
}
