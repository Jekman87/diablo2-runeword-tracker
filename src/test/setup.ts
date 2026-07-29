import "@testing-library/jest-dom/vitest";

// Nothing but the matchers.
//
// This file used to carry a hand-written stand-in for `HTMLDialogElement`, which
// jsdom ships with the `open` property and nothing else — no `showModal`, no
// `close`, no Escape handling and no focus behaviour. The detail view was a
// `<dialog>` opened with `showModal()`, so without that shim it could not be
// opened in a test at all.
//
// The detail view is a floating panel now, and its dismissal, its focus trap and
// its focus restoration come from `@floating-ui/react` rather than from the
// platform. So the tests stop asserting against a stand-in for a browser and
// start asserting against the real implementation, in the environment that
// implementation supports. That is a straight win, and it is why removing this is
// part of the change rather than tidying after it.
//
// What jsdom still cannot answer is anything that needs layout: `safePolygon`'s
// geometry, whether the panel flipped above the pointer, whether it shifted
// inward at a viewport edge, and which side of the `md` breakpoint is showing.
// Those are browser checks, and asserting them here would assert nothing.
