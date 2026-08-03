import { ItemTypes } from "@/components/ItemTypes";
import { PropertyLine } from "@/components/PropertyLine";
import { RuneSequence } from "@/components/RuneSequence";
import type { Runeword } from "@/data";
import { useLocale, useStrings } from "@/i18n";
import { displayItemType, displayRuneword } from "@/runewords/display";
import { varyingProperties } from "@/runewords/varies";

export interface RunewordDialogProps {
  /** The runeword being shown. The panel is only rendered while open. */
  runeword: Runeword;
  /** The heading's id, so the panel around this can be named by it. */
  titleId: string;
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
export function RunewordDialog({ runeword, titleId }: RunewordDialogProps) {
  const strings = useStrings();
  const locale = useLocale();
  const projected = displayRuneword(runeword, locale);
  const varies = varyingProperties(runeword);

  return (
    <div className="grid gap-3">
      {/* No close control. There was one, and it was `<dialog>`'s: `showModal()`
          needed a first focusable element and that is what it focused, so the
          panel had to offer one. A panel that opens when the pointer rests on a
          name is not a thing you close, it is a thing you leave — move the pointer
          away, press Escape, or press anywhere else, and it is gone. A button
          asking to be pressed advertises a ceremony the panel does not have.

          It cost nothing to remove, either: the panel holds no other control, so
          losing it loses no keyboard reach. What tells a screen reader the panel
          is there is `aria-expanded` and `aria-controls` on the name, which
          `useRole` puts there and which never depended on this. */}
      <h2 id={titleId} className="text-2xl text-gold-mid">
        {projected.name}
      </h2>

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
        {projected.note ? (
          <>
            <dt className="text-gold">{strings.detail.note}</dt>
            <dd className="text-note-text">{projected.note}</dd>
          </>
        ) : null}
      </dl>

      <h3 className="text-center text-xl">{strings.detail.properties}</h3>
      {/* One pass over the groups, one code path for all 99 records. A label
          renders as a gold heading — the categories it applies to are dataset
          content, the same vocabulary `ItemTypes` renders, not display copy —
          so it cannot read as another green property line. A single unlabelled
          group renders no heading element at all, not an empty one.

          The property lines (and a group's own heading) are centred, as the
          game centres them in the item tooltip this panel reproduces. The
          name, the labelled values and the note above stay left-aligned —
          those are the structure this panel adds and the tooltip has no
          equivalent for.

          The heading and the lines come from different halves of the same
          projection: the label is a category name, which localises through the
          reference data (`displayItemType`), while the lines are the record's
          own. That is why a Russian variant stores no group labels — restating
          them per record would be a second copy of the reference data. */}
      {runeword.propertyGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="grid gap-1 text-center">
          {group.itemTypes ? (
            <h4 className="text-gold">
              {group.itemTypes
                .map((category) => displayItemType(category, locale))
                .join(strings.itemTypes.separator)}
            </h4>
          ) : null}
          {/* Whether a line rolls is a fact about the record, read off the
              Russian variant whichever language is on screen — see
              `varyingProperties`. The projected line is what renders; the flag
              beside it only decides its colour. */}
          <ul className="grid gap-0.5 text-property">
            {projected.propertyGroups[groupIndex].properties.map(
              (line, index) => (
                <li key={index}>
                  <PropertyLine
                    line={line}
                    varies={varies[groupIndex][index]}
                  />
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
