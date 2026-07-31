import { useId, useState } from "react";

import clsx from "clsx";

import { Badge } from "@/components/AvailabilityBadges";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { FEEDBACK_URL, GAME_PATCH, UPDATE_NOTES_URL } from "@/header/site";
import { useStrings } from "@/i18n";
import { patchColour } from "@/runewords/patch-colour";

/**
 * The header band: what this page is, which patch its list reflects, where to say
 * something about it, which language it speaks, and — behind a disclosure — how
 * to use it.
 *
 * A `<header>` **outside** `<main>`, which is the whole reason `App.tsx` mounts
 * it as a sibling: the element only exposes the `banner` landmark when it is not
 * a descendant of `main`. The `<h1>` and the divider moved in here with it, so
 * `<main>` now starts at the progress band — also the honest reading of what the
 * main content is.
 *
 * Nothing here is sticky. The two bands below hold the questions the page exists
 * to answer and are coupled by `--progress-band-height`; a header that claimed
 * permanent viewport height would re-open that arithmetic to say the title
 * twice. It scrolls away — and so does the help panel, which is the other reason
 * the disclosure can be a plain in-flow block rather than an overlay.
 *
 * **The ornamental divider spans the viewport** while the title block and the
 * help panel keep the page's measure. The header itself is full-width; an inner
 * wrapper carries `mx-auto max-w-6xl px-6`, and the divider sits outside that
 * wrapper as a direct child. No `100vw`: `html` reserves a stable scrollbar
 * gutter, so a viewport-width band overflows the document.
 *
 * **The patch notes hang off the patch number, not off a link of their own.** The
 * sentence already names the patch, so the name of the patch is the thing to
 * press; a separate "Update Notes" beside it — which is where the reference puts
 * it — would be a second control saying the same word.
 *
 * **Both links open in a new tab**, and each says so in its accessible name. The
 * page is a tracker a player keeps open while reading patch notes or filing a
 * report, so taking the tab away is the wrong default here even though it is the
 * right one almost everywhere else. `rel="noopener noreferrer"` is the hygiene
 * that buys: no `window.opener` handed to the destination, no referrer leaked.
 *
 * Colour: `text-gold-mid` at rest, `text-gold-light` with an underline under the
 * pointer — the pair a runeword's name in the detail view already moves between.
 * The blue `--color-link` this change first rendered went out of the palette with
 * this decision: it was the last token declared ahead of a use site, and rather
 * than earn one it turned out to be the wrong colour for a page whose entire
 * palette is gold on black. A token nothing renders is removed, which is what
 * `d2-theme` asks for.
 *
 * **The help disclosure is a button and `aria-expanded`, not a `<details>`, and
 * that is a layout constraint rather than a preference.** Help belongs on the
 * title's own line beside Feedback, and its panel belongs below both at the page's
 * full measure — but a `<summary>` has to be the first child of the `<details>` it
 * opens, so the control and the panel cannot sit in two different rows of the
 * header's grid. Every other disclosure in this project is native (`RemainingPanel`
 * is a real `<details>`) and this one pays for the position: three lines of state
 * and two ARIA attributes, and the closed panel is `display: none` rather than
 * hidden-until-found, so find-in-page cannot open it the way it can open the
 * remaining panels. That is the whole cost, stated so the next reader does not
 * "fix" it back into a `<details>` and wonder why the layout collapses.
 */
export function SiteHeader() {
  const strings = useStrings();
  const [helpOpen, setHelpOpen] = useState(false);
  const helpId = useId();

  return (
    <header className="grid gap-6 pt-6">
      {/* The width classes are `<main>`'s in `App.tsx`, minus its bottom padding so
          the divider closes the band and `<main>`'s own top padding supplies the one
          gap below it. Two landmarks means two class lists that have to agree; a
          drift shows immediately as a misaligned left edge under a hard vertical
          rule. See the comment there. The measure lives on this wrapper rather
          than on the `<header>`, so the divider below can escape it. */}
      <div className="mx-auto grid w-full max-w-6xl gap-2 px-6">
        {/* Title block left, the two controls right, and at narrow widths they
            wrap beneath the title rather than squeezing it — no breakpoint says
            that better than letting flex wrap. Baselines align, so both sit on the
            title's own line as the reference has them. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <h1 className="text-3xl font-normal tracking-wide">
              {strings.app.title}
            </h1>

            {/* Secondary text beside a gold title — the role `--color-muted`
                already plays for the table's item categories — with the patch
                itself picked out as the one pressable thing in the sentence. The
                space between the two is a space between two strings, which is the
                one piece of punctuation a split sentence cannot put in the copy
                layer. */}
            <p className="text-muted">
              {strings.header.patchLine}{" "}
              <a
                aria-label={strings.header.patchNotesName(GAME_PATCH)}
                className={LINK}
                href={UPDATE_NOTES_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                {strings.header.patchLink(GAME_PATCH)}
              </a>
            </p>
          </div>

          {/* Help first, then Feedback, which is the reference's own order —
              then the language switch, a control and not a link, so the
              two-link rule below stands. `items-center` rather than the
              row's own `items-baseline`: the switch's chips are boxes, and a
              box hung from a text baseline sits visibly low beside words. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              aria-controls={helpId}
              aria-expanded={helpOpen}
              className={`group/help flex cursor-pointer items-center gap-1 ${LINK_REST}`}
              onClick={() => setHelpOpen((open) => !open)}
              type="button"
            >
              {/* Presentation only: the button's `aria-expanded` already reports
                  the state this draws. The underline lives on the word rather
                  than on the button, because an underline running under a
                  triangle reads as a typo. */}
              <span
                aria-hidden
                className={clsx(
                  "transition-transform",
                  helpOpen && "rotate-90",
                )}
              >
                ▸
              </span>

              <span className="group-hover/help:underline">
                {strings.header.help}
              </span>
            </button>

            <a
              aria-label={strings.header.feedbackName}
              className={LINK}
              href={FEEDBACK_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {strings.header.feedback}
            </a>

            <LanguageSwitch />
          </div>
        </div>
      </div>

      {/* Full-bleed: a direct child of the header, outside the measure wrapper. */}
      <div className="gold-divider" />

      {/* The panel opens **below the divider**, not above it. The divider is
          the header's own bottom edge — the line that says the title, the patch
          and the controls end here — and a block of prose wedged in above it
          pushes that edge down and reads as part of the title block. Beneath
          it, the help is what it is: an explanation of the page, opened over
          the top of the page.

          Still in flow rather than the reference's overlay dropdown: an
          overlay needs a positioned ancestor, a `z-index` argued against the
          two sticky bands and the detail view's panel, and an outside-press
          dismissal — all so that opening help does not move a page the reader
          has just asked to have explained. Pushing what follows down is the
          conduct the remaining panels already have.

          Hidden by the `hidden` **attribute**, with the `display` class applied
          only while open. Both halves are needed and the pairing is the point: a
          `grid` class would silently beat `[hidden] { display: none }` if it were
          always applied, and the attribute rather than a `hidden` class is what
          makes the panel hidden even where the stylesheet has not loaded — which
          is also how a jsdom test can tell that it is closed. It stays mounted
          either way, so `aria-controls` always resolves to a real element.

          On the page ground, with no panel colour and no border: the three
          tokens holding this exact value all name another surface — the detail
          view's panel, the undo notice, the remaining panels' summary band — and
          a fourth declared for a block of prose would be a name for a value
          rather than for a role. The measure is capped because 1104px of prose is
          not a paragraph, and the block keeps the page's left rule under
          right-aligned controls: text is read from the left however it opened.

          Its own measure wrapper, so the full-bleed divider does not take the
          prose with it. */}
      <div
        id={helpId}
        hidden={!helpOpen}
        className={clsx(
          "mx-auto w-full max-w-6xl px-6",
          helpOpen && "grid gap-2",
        )}
      >
        <div className="grid max-w-3xl gap-2">
          <p>{strings.header.helpIntro}</p>

          <ul className="grid list-disc gap-2 ps-5">
            {strings.header.helpPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {/* Badge legend and rune-tier note. Samples are the table's own
              `Badge`, decorative here because the words beside them already say
              what each means. All four patch colours, including the classic era —
              a reader meeting the brown tag has nowhere else to learn it. */}
          <div className="grid gap-2">
            <p>{strings.header.helpBadgesIntro}</p>
            <ul className="grid list-none gap-2">
              {LEGEND_PATCHES.map((patch) => (
                <li key={patch} className="flex flex-wrap items-center gap-2">
                  <Badge
                    kind="patch"
                    colour={patchColour(patch)}
                    marker={patch}
                    meaning={strings.availability.patchMeaning(patch)}
                    decorative
                  />
                  <span>{strings.header.helpBadgePatch(patch)}</span>
                </li>
              ))}
              <li className="flex flex-wrap items-center gap-2">
                <Badge
                  kind="ladder"
                  marker={strings.availability.ladderMarker}
                  meaning={strings.availability.ladderMeaning}
                  decorative
                />
                <span>{strings.header.helpBadgeLadder}</span>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Badge
                  kind="note"
                  marker={strings.availability.noteMarker}
                  meaning={strings.header.helpBadgeNote}
                  decorative
                />
                <span>{strings.header.helpBadgeNote}</span>
              </li>
            </ul>
            <p>{strings.header.helpRuneTiers}</p>
          </div>
        </div>
      </div>

      {/* Sentinel for the back-to-top control — after the help panel, so the
          threshold follows the header's full height including an open disclosure. */}
      <div data-scroll-top-sentinel aria-hidden className="h-0" />
    </header>
  );
}

/**
 * One patch per era colour — `1.10` stands for the classic era that `1.11`
 * shares. Written out so Tailwind sees every class through `patchColour`, and
 * so the legend cannot silently drop a colour when a fifth patch arrives.
 */
const LEGEND_PATCHES = ["1.10", "2.4", "2.6", "3.0"] as const;

/**
 * The resting and hover colours the header's three controls share, written once
 * because they must be one control in three places rather than three that happen
 * to match. Split in two because the help button underlines only its label, so it
 * takes the colours without the underline and puts that on the word itself.
 *
 * Not a component: there is no behaviour here, and a wrapper around `<a>` to pass
 * three attributes through would hide the `target` this change is deliberate about.
 */
const LINK_REST = "text-gold-mid hover:text-gold-light";
const LINK = `${LINK_REST} hover:underline`;
