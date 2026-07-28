export interface PropertyLineProps {
  /** One granted-property line, exactly as the dataset holds it. */
  line: string;
  className?: string;
}

/**
 * One granted-property line, with its numeric values picked out brighter.
 *
 * The line is never rewritten. `String.prototype.split` on a capturing group
 * returns the plain text and the matched values interleaved — even indices are
 * text, odd indices are values — and concatenating that array reproduces the
 * input *by construction*, because `split` never builds a new string. That is
 * the whole reason for the choice, and it is what the round-trip test asserts
 * over all 975 lines in the dataset.
 *
 * The obvious alternatives all build a new string: `replace` with markup, or
 * walking match indices by hand. Both can silently drop a leading `-`, and
 * `-33% Extra Gold From Monsters` rendered as `33% Extra Gold From Monsters` is
 * not a visual bug — it is a bonus where the game gives a penalty, and it looks
 * entirely correct. If this derivation ever could not round-trip, the right
 * answer would be to drop the emphasis rather than loosen the assertion: in game
 * a property line is one colour, and the two-tone treatment is the reference's
 * invention.
 *
 * The line is data, not display copy, so it does not go through the i18n layer.
 */
export function PropertyLine({ line, className }: PropertyLineProps) {
  return (
    <span className={className}>
      {line.split(VALUE).map((fragment, index) =>
        index % 2 === 0 ? (
          fragment
        ) : (
          <span key={index} className="text-property-value">
            {fragment}
          </span>
        ),
      )}
    </span>
  );
}

/**
 * A numeric value in a property line: an optional sign, digits, an optional
 * decimal part, an optional hyphenated upper bound, an optional percent sign.
 *
 * Wrapped in a capture group so `split` keeps what it matched. Two facts from
 * the data shaped it. Ranges are hyphenated — `3-14`, `+8-15%`, `21-110`,
 * `0.5-49.5%` — so the upper bound has to be part of the same match or a range
 * would render as two values with a stray hyphen between them. And a hyphen also
 * occurs as a plain separator, in `Adds 3-14 Cold Damage - Cold Duration 3
 * Seconds`; requiring a digit immediately after the sign is what keeps that one
 * from reading as a range.
 *
 * Sixty-six of the 975 lines contain no digit at all. Those split into a single
 * fragment and render unemphasised, which needs no special case.
 */
const VALUE = /([+-]?\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?%?)/;
