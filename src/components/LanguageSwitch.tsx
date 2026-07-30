import { cva } from "class-variance-authority";

import {
  type Locale,
  type Strings,
  setLocale,
  useLocale,
  useStrings,
} from "@/i18n";

/**
 * The language switch: two options, one pressed, on the header's title line.
 *
 * **Buttons with `aria-pressed`, not radios like the filter groups.** The
 * filters carry a visible `<legend>` and five options, which is what a
 * fieldset is for; this is two toggles whose accessible names are whole
 * languages — "English", "Русский" — and a control that must stay legible to a
 * reader who cannot read the page around it. State lives on each option
 * (`aria-pressed`), so the active language is reported to assistive technology
 * rather than carried by colour alone; the group's own name says what the pair
 * is for.
 *
 * The labels resolve through the copy layer like all display text, and the
 * copy layer holds them identical in both records: a language's own name does
 * not translate. The visible label is the two-letter code; the accessible name
 * behind it is the whole word, because `EN` read aloud says less than
 * "English".
 *
 * `setLocale` is reached by import rather than by prop. The store is module
 * state precisely so that the one control that changes the language does not
 * need the fourteen components that render it to pass anything down.
 */
export function LanguageSwitch() {
  const strings = useStrings();
  const locale = useLocale();

  return (
    <div
      role="group"
      aria-label={strings.language.label}
      className="flex gap-1"
    >
      {options(strings).map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.name}
          aria-pressed={locale === option.value}
          onClick={() => setLocale(option.value)}
          className={chip({ selected: locale === option.value })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The two options, from the copy layer. Two entries written out rather than a
 * map over `locales`, for the reason the filter options are: a lookup from a
 * value to a string is one more indirection than two lines, and the compiler
 * catches a locale this version does not offer either way.
 */
function options(strings: Strings) {
  return [
    { value: "en", label: strings.language.en, name: strings.language.enName },
    { value: "ru", label: strings.language.ru, name: strings.language.ruName },
  ] as const satisfies readonly {
    value: Locale;
    label: string;
    name: string;
  }[];
}

/**
 * The filter chips' two states, at the header's scale. Same tokens and same
 * variant split as the chips in `RunewordControls` — `bg-blood-light` pressed,
 * `bg-muted-dark` at rest — but `h-7` rather than `h-9`: the chips state the
 * search field's height to sit beside it, and there is no field here, only a
 * title line the control must not dominate. The outline is on the button
 * itself because the button is the focusable element — no hidden input to
 * reach through with `has-[:focus-visible]`.
 */
const chip = cva(
  "inline-flex h-7 cursor-pointer items-center rounded-xs px-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light",
  {
    variants: {
      selected: {
        true: "bg-blood-light text-gold-light",
        false: "bg-muted-dark text-body hover:text-gold-light",
      },
    },
  },
);
