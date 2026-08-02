import { useId, useState } from "react";

import {
  FloatingFocusManager,
  FloatingPortal,
  type OpenChangeReason,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import { ItemTypes } from "@/components/ItemTypes";
import type { Runeword } from "@/data";
import { useLocale, useStrings } from "@/i18n";
import { displayRuneword } from "@/runewords/display";

export interface RunewordAdviceProps {
  runeword: Runeword;
  /** Whether this row's advice panel is the open one. Owned by the table. */
  open: boolean;
  /** Same contract as the detail panel's: one value serves all 99 rows. */
  onOpenChange: (
    name: string,
    open: boolean,
    reason: OpenChangeReason | undefined,
  ) => void;
}

/**
 * The item-types cell's content, and the crafting-advice panel it opens.
 *
 * A second instance of `RunewordDetails`' floating pattern, deliberately down
 * to the trigger split and the conditional focus management — see that
 * component for why each decision is what it is. Not shared as one component:
 * the two anchor to different cells, present different content, and a single
 * component taking both sets of props would be a switch statement wearing a
 * panel. What *is* shared is the table-level "one open panel" state, which now
 * spans both kinds.
 *
 * Two things are this panel's own. **The trigger is the cell's existing
 * text**, wrapped in a button — the categories and restriction the cell always
 * showed — so hover gets the whole cell and a tap gets the text a phone reader
 * is already looking at; a runeword without advice renders the same text with
 * no button and no panel. And **the panel is made for reading out of**: its
 * text is selectable (a reader's whole reason for opening it may be to copy a
 * base name into a trade search) and its sources are real anchors. Both work
 * because `safePolygon` holds the panel open under the travelling pointer and
 * the row ignores clicks it does not contain.
 */
export function RunewordAdvice({
  runeword,
  open,
  onOpenChange,
}: RunewordAdviceProps) {
  const strings = useStrings();
  const titleId = useId();
  const projected = displayRuneword(runeword, useLocale());
  const advice = projected.advice;

  const [openedBy, setOpenedBy] = useState<Trigger>("hover");

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange(nextOpen, _event, reason) {
      onOpenChange(runeword.name, nextOpen, reason);

      if (nextOpen) setOpenedBy(triggerFor(reason));
    },
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [
      offset(GAP),
      flip({ padding: EDGE }),
      shift({ padding: EDGE, crossAxis: true }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const interactions = useInteractions([
    useHover(context, {
      delay: { open: OPEN_DELAY },
      handleClose: safePolygon(),
      mouseOnly: true,
    }),
    useFocus(context),
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "dialog" }),
  ]);

  // No advice, no panel and no button: the cell reads exactly as it did before
  // this capability existed, and nothing advertises a press that does nothing.
  if (advice === undefined) return <ItemTypes runeword={runeword} />;

  return (
    <>
      {/* `text-left` because a button centres its content by default and this
          one wraps a cell's worth of left-aligned text. The accessible name
          says what opens; the visible text stays the categories themselves. */}
      <button
        ref={setReference}
        type="button"
        aria-label={strings.advice.label(projected.name)}
        className="block w-full cursor-pointer text-left"
        {...interactions.getReferenceProps()}
      >
        <ItemTypes runeword={runeword} />
      </button>

      {open ? (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={openedBy === "activated"}
            disabled={openedBy === "hover"}
            initialFocus={openedBy === "activated" ? 0 : -1}
          >
            <div
              ref={setFloating}
              {...interactions.getFloatingProps()}
              style={floatingStyles}
              aria-labelledby={titleId}
              className={PANEL}
            >
              <h3 id={titleId} className="mb-2 text-lg text-gold-mid">
                {strings.advice.heading}
              </h3>

              <div className="grid gap-2">
                {advice.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {advice.sources === undefined ? null : (
                <p className="mt-3 text-[13px] text-muted">
                  {strings.advice.sources}{" "}
                  {advice.sources.map((source, index) => (
                    <span key={source.url}>
                      {index > 0 ? ", " : null}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={strings.advice.sourceName(source.label)}
                        className="text-gold-mid underline hover:text-gold-light"
                      >
                        {source.label}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}

type Trigger = "hover" | "focused" | "activated";

function triggerFor(reason: OpenChangeReason | undefined): Trigger {
  if (reason === "hover") return "hover";
  if (reason === "focus") return "focused";

  return "activated";
}

const GAP = 8;
const EDGE = 8;
const OPEN_DELAY = 250;

// The detail panel's surface, one size down: advice runs a few paragraphs, not
// 26 property lines, so `max-w-md` reads better than the detail panel's `lg`.
// `select-text` is stated even though it is the default, because copyable text
// is a requirement here rather than an accident of the platform.
const PANEL =
  "z-10 max-h-[calc(100dvh-2rem)] max-w-md select-text overflow-y-auto rounded-xs border border-panel-edge bg-panel p-4 text-[14px] text-panel-text";
