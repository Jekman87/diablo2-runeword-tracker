import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SITE_URL } from "../src/header/site.ts";

// What a crawler is given lives in three files that no module imports:
// `index.html`, `public/robots.txt` and `public/sitemap.xml`. They are static by
// design — Vite copies the last two into `dist/` untouched — so the site's own
// URL is written out four times counting the constant, and the only failure mode
// that matters is the three copies drifting from it. A canonical link pointing
// at the wrong host does not break a single local check; it just quietly asks
// Google to index an address that does not exist.
//
// So this reads the shipped files and compares them with `SITE_URL`. It also
// holds the parts of the head a search result is built from — a description that
// is present and non-empty, and a body that says something without JavaScript —
// because those are as easy to delete by accident as they were to add.
//
// It lives in `scripts/` rather than `src/` for the reason the borrowed-assets
// test next door does: it reads the repository from disk, and
// `tsconfig.app.json` withholds Node's types from application code.

const ROOT = path.resolve(import.meta.dirname, "..");

const html = read("index.html");
const robots = read("public", "robots.txt");
const sitemap = read("public", "sitemap.xml");

describe("the document head", () => {
  it("declares the canonical URL the site constant names", () => {
    expect(attribute("link", "rel", "canonical", "href")).toBe(SITE_URL);
  });

  it("carries a description, and repeats it for Open Graph", () => {
    const description = attribute("meta", "name", "description", "content");

    expect(description).toBeTruthy();
    expect(description).toMatch(/runeword/i);
    expect(attribute("meta", "property", "og:description", "content")).toBe(
      description,
    );
  });

  it("gives Open Graph the same title and URL as the document", () => {
    expect(attribute("meta", "property", "og:title", "content")).toBe(
      /<title>([^<]+)<\/title>/.exec(html)?.[1],
    );
    expect(attribute("meta", "property", "og:url", "content")).toBe(SITE_URL);
  });
});

describe("the scriptless body", () => {
  it("still explains what the page is", () => {
    const fallback = /<noscript>([\s\S]*?)<\/noscript>/.exec(html)?.[1] ?? "";
    const text = fallback
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    expect(text).toMatch(/runeword/i);
    expect(text.length).toBeGreaterThan(80);
  });
});

describe("robots.txt", () => {
  it("allows every crawler", () => {
    expect(robots).toMatch(/^User-agent:\s*\*$/m);
    expect(robots).not.toMatch(/^Disallow:\s*\S/m);
  });

  it("names the sitemap under the Pages sub-path", () => {
    expect(robots).toMatch(
      new RegExp(`^Sitemap:\\s*${escaped(SITE_URL)}sitemap\\.xml$`, "m"),
    );
  });
});

describe("sitemap.xml", () => {
  it("lists the site URL, and only it", () => {
    const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
      ([, location]) => location,
    );

    expect(locations).toEqual([SITE_URL]);
  });

  // Not a parse: the file is six lines of hand-written XML and pulling in a
  // parser to read them would cost more than it proves. What can plausibly go
  // wrong by hand is a missing declaration, a dropped namespace, or an unclosed
  // root, and those are visible from the outside of the document.
  it("is a urlset a crawler will accept", () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true,
    );
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });
});

function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

/**
 * The value of `wanted` on the first `<name>` tag whose `key` attribute is
 * `value` — `attribute("meta", "name", "description", "content")` for the meta
 * description.
 *
 * Attribute order and line breaks inside a tag are Prettier's to decide and it
 * rewraps them as the file grows, so matching a whole tag with one expression
 * would be a test that fails on a reformat. This splits the document into tags
 * first and reads each one's attributes, which is indifferent to how they are
 * laid out.
 */
function attribute(
  name: string,
  key: string,
  value: string,
  wanted: string,
): string | undefined {
  for (const [tag] of html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))) {
    const attributes = new Map(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]),
    );

    if (attributes.get(key) === value) return attributes.get(wanted);
  }

  return undefined;
}

/** `text` as a literal inside a regular expression. */
function escaped(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
