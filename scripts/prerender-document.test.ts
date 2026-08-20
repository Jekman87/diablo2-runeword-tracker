import { describe, expect, it } from "vitest";

import {
  EMPTY_ROOT,
  assertRendered,
  decisionScript,
  injectInto,
} from "./prerender-document.ts";

// What a built document must end up saying, tested without building anything.
// The runner beside these functions needs `dist/` and a compiled SSR bundle; the
// guarantees do not, and the point of the split is that they can fail here —
// where a developer sees them — rather than only in a deploy nobody watches.

const KEYS = ["site:a:v1", "site:b:v1"] as const;

describe("the decision script", () => {
  it("carries the keys it was given, not a copy of them", () => {
    const script = decisionScript(KEYS);

    for (const key of KEYS) expect(script).toContain(key);
  });

  it("escapes a key rather than breaking out of the script", () => {
    // The keys arrive from the stores' own constants, so their contents are not
    // this function's business — but they end up inside a `<script>`, and JSON
    // is what makes that safe. Asserted because the failure would be a broken
    // page, not a wrong one.
    const script = decisionScript(['site:"odd":v1']);

    expect(script).toContain('site:\\"odd\\":v1');
    expect(script.match(/<script>/g)).toHaveLength(1);
  });

  // That the *real* keys reach the built document is checked by the build
  // itself, in `prerender.ts`: the keys live behind the `@/` alias, so this
  // side of the split cannot import them, and checking the artifact is the
  // stronger test anyway.

  it("hides with an inline display property, not the hidden attribute", () => {
    // `[hidden] { display: none }` is a user-agent rule that any Tailwind
    // display utility outranks, so the attribute would not hide anything.
    expect(decisionScript(KEYS)).toContain('style.display="none"');
    expect(decisionScript(KEYS)).not.toContain("hidden");
  });

  it("is a classic script rather than a module", () => {
    // A module is deferred, and deferred is too late: the decision has to be
    // taken before the first paint.
    expect(decisionScript(KEYS)).toMatch(/^<script>/);
    expect(decisionScript(KEYS)).not.toContain("type=");
  });

  it("survives storage that throws", () => {
    expect(decisionScript(KEYS)).toContain("try{");
    expect(decisionScript(KEYS)).toContain("catch(e){}");
  });

  it("refuses to be built with no keys at all", () => {
    // With an empty list it would never hide anything, which is the one outcome
    // worse than not having the script.
    expect(() => decisionScript([])).toThrow(/at least one storage key/);
  });
});

describe("injecting into a built document", () => {
  const shell = `<body>${EMPTY_ROOT}<script type="module" src="/main.js"></script></body>`;

  it("puts the markup inside the root and the script after it", () => {
    const html = injectInto(shell, "<main>rows</main>", KEYS);

    expect(html).toContain(`<div id="root"><main>rows</main></div><script>`);
    // Still before the bundle, which is the whole reason for the ordering.
    expect(html.indexOf("<script>try{")).toBeLessThan(
      html.indexOf('<script type="module"'),
    );
  });

  it("leaves the rest of the document alone", () => {
    const withHead = `<head><title>t</title></head>${shell}`;
    const html = injectInto(withHead, "<main>rows</main>", KEYS);

    expect(html).toContain("<title>t</title>");
    expect(html).toContain('<script type="module" src="/main.js">');
  });

  it("fails when the client build's output no longer has an empty root", () => {
    expect(() => injectInto("<body></body>", "<main>x</main>", KEYS)).toThrow(
      /does not contain/,
    );
  });

  it("fails on empty markup rather than shipping an empty root", () => {
    expect(() => injectInto(shell, "", KEYS)).toThrow(/no markup/);
  });
});

describe("asserting a document really carries its language's list", () => {
  const expectation = {
    label: "dist/x.html",
    present: "Body Armor",
    absent: "Броня",
  };

  it("passes when the right language is present", () => {
    const html = injectInto(EMPTY_ROOT, "<td>Body Armor</td>", KEYS);

    expect(() => assertRendered(html, expectation)).not.toThrow();
  });

  it("fails when nothing was rendered", () => {
    expect(() => assertRendered(EMPTY_ROOT, expectation)).toThrow(
      /no rendered content/,
    );
  });

  it("fails when the content is there but in the other language", () => {
    // The failure a presence check would wave through, and the plausible one:
    // the locale is the input most likely to be wrong.
    const html = injectInto(EMPTY_ROOT, "<td>Броня</td>", KEYS);

    expect(() => assertRendered(html, expectation)).toThrow(/other language/);
  });

  it("fails when the expected word is simply missing", () => {
    const html = injectInto(EMPTY_ROOT, "<td>something else</td>", KEYS);

    expect(() => assertRendered(html, expectation)).toThrow(/does not contain/);
  });
});
