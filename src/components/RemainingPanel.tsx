export interface RemainingPanelProps {
  /** The panel's title, already resolved through the strings layer. */
  title: string;
  children: React.ReactNode;
}

/**
 * The disclosure shell both remaining panels share: a summary band that opens
 * and closes over whatever content it is given.
 *
 * A native `<details>`, for the same reason progress is a native
 * `<progress>`: the open/closed semantics, Enter and Space on the summary,
 * the expanded state reported to assistive technology and the no-JS default
 * all come from the platform, with nothing restated in ARIA. Unlike the
 * detail view's hover panel, nothing here needs positioning, so no library
 * earns its place.
 *
 * Collapsed by default is the *absence* of the `open` attribute — which is
 * also what makes "closed unless the player opens it this visit" true with
 * no state anywhere. Nothing reads or writes storage; the panels are
 * reference material, not a view setting.
 *
 * The platform's own marker is dropped and replaced, as the search field's
 * clear button was: the native triangle is drawn in no token and varies by
 * engine. `list-none` removes it where the summary is a list item (Firefox,
 * and the standard rendering) and the `::-webkit-details-marker` rule covers
 * the engines that still draw it as a pseudo-element. The replacement glyph
 * turns with `[open]` and moves between the muted-to-gold pair the page's
 * other controls already use — and it is presentation only, `aria-hidden`,
 * because the element itself already reports the state the glyph draws.
 *
 * One shell used twice rather than two summaries kept in step by convention:
 * the panels must look and behave identically, and a shared component makes
 * that one implementation.
 */
export function RemainingPanel({ title, children }: RemainingPanelProps) {
  return (
    <details className="group">
      <summary className="group/summary flex cursor-pointer list-none items-center gap-2 rounded-xs bg-blood-dark px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="text-muted transition-transform group-open:rotate-90 group-hover/summary:text-gold-light"
        >
          ▸
        </span>

        <h2 className="text-xl">{title}</h2>
      </summary>

      <div className="px-3 py-4">{children}</div>
    </details>
  );
}
