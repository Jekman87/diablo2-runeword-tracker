import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  ANALYTICS_TOKEN,
  OG_IMAGE_URL,
  SITE_URL,
  SITE_URL_RU,
  YANDEX_VERIFICATION,
} from "../src/header/site.ts";

// What a crawler is given lives in files that no module imports: two entry
// documents (`index.html` and `ru/index.html`), `public/robots.txt`,
// `public/sitemap.xml` and `public/og-image.png`. They are static by design —
// Vite copies the public files into `dist/` untouched — so the site's URLs are
// written out many times, and the failure mode that matters is the copies
// drifting from the constants. A canonical link pointing at the wrong host
// does not break a single local check; it just quietly asks Google to index an
// address that does not exist.
//
// So this reads the shipped files and compares them with the constants. It
// also holds the parts of the head a search result is built from — a
// description that is present and non-empty, a hreflang trio that is identical
// in both documents, a social card whose image really exists at the size it
// declares, and a body that says something without JavaScript — because those
// are as easy to delete by accident as they were to add.
//
// It lives in `scripts/` rather than `src/` for the reason the borrowed-assets
// test next door does: it reads the repository from disk, and
// `tsconfig.app.json` withholds Node's types from application code.
//
// **It reads the source templates, and deliberately stops there.** Since the
// entries are prerendered, the body of each served document is a build product:
// the head fields, the URLs, the beacon and the `<noscript>` paragraph are facts
// about these files, but the list inside `#root` exists only in `dist/`. Testing
// both here would mean one test whose failure could mean either "a template
// drifted" or "you forgot to build". So the rendered content is asserted by the
// build itself, plus `scripts/prerender-document.test.ts` for the pure parts and
// one CI step for the build step existing at all.

const ROOT = path.resolve(import.meta.dirname, "..");

const documents = {
  en: { html: read("index.html"), url: SITE_URL, lang: "en" },
  ru: { html: read("ru", "index.html"), url: SITE_URL_RU, lang: "ru" },
} as const;

const robots = read("public", "robots.txt");
const sitemap = read("public", "sitemap.xml");

describe.each(Object.entries(documents))("the %s document head", (_, doc) => {
  it("declares its own language before any script runs", () => {
    expect(attribute(doc.html, "html", "lang", doc.lang, "lang")).toBe(
      doc.lang,
    );
  });

  it("declares the canonical URL the site constant names", () => {
    expect(attribute(doc.html, "link", "rel", "canonical", "href")).toBe(
      doc.url,
    );
  });

  it("carries a description, and repeats it for Open Graph", () => {
    const description = attribute(
      doc.html,
      "meta",
      "name",
      "description",
      "content",
    );

    expect(description).toBeTruthy();
    expect(description).toMatch(/runeword|рунн/i);
    expect(
      attribute(doc.html, "meta", "property", "og:description", "content"),
    ).toBe(description);
  });

  it("gives Open Graph the same title and URL as the document", () => {
    expect(attribute(doc.html, "meta", "property", "og:title", "content")).toBe(
      /<title>([^<]+)<\/title>/.exec(doc.html)?.[1],
    );
    expect(attribute(doc.html, "meta", "property", "og:url", "content")).toBe(
      doc.url,
    );
  });

  it("names both languages through the same hreflang trio", () => {
    expect(hreflangs(doc.html)).toEqual({
      en: SITE_URL,
      ru: SITE_URL_RU,
      "x-default": SITE_URL,
    });
  });

  it("carries the social card", () => {
    expect(attribute(doc.html, "meta", "property", "og:image", "content")).toBe(
      OG_IMAGE_URL,
    );
    expect(attribute(doc.html, "meta", "name", "twitter:card", "content")).toBe(
      "summary_large_image",
    );

    const locale = attribute(
      doc.html,
      "meta",
      "property",
      "og:locale",
      "content",
    );
    const alternate = attribute(
      doc.html,
      "meta",
      "property",
      "og:locale:alternate",
      "content",
    );

    expect([locale, alternate].sort()).toEqual(["en_US", "ru_RU"]);
    expect(locale?.startsWith(doc.lang)).toBe(true);
  });

  it("identifies the application as structured data", () => {
    const block = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
      .exec(doc.html)?.[1]
      ?.trim();

    expect(block).toBeTruthy();

    const data = JSON.parse(block ?? "{}") as Record<string, unknown>;

    expect(data["@type"]).toBe("WebApplication");
    expect(data.url).toBe(SITE_URL);
    expect(data.inLanguage).toEqual(expect.arrayContaining(["en", "ru"]));
  });

  it("still explains what the page is without scripting", () => {
    const fallback =
      /<noscript>([\s\S]*?)<\/noscript>/.exec(doc.html)?.[1] ?? "";
    const text = fallback
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    expect(text).toMatch(doc.lang === "ru" ? /рунн/i : /runeword/i);
    expect(text.length).toBeGreaterThan(80);
  });
});

describe.each(Object.entries(documents))(
  "the %s document's page-view counter",
  (_, doc) => {
    it("carries the beacon with the token the constant names", () => {
      const token = /data-cf-beacon='{"token":\s*"([^"]+)"}'/.exec(
        doc.html,
      )?.[1];

      // A document that quietly loses its beacon, or drifts from the constant,
      // stops counting without anything else breaking — which is why this is a
      // test and not a comment. Nobody goes looking for a counter they believe
      // is running.
      expect(token).toBe(ANALYTICS_TOKEN);
    });

    it("loads the beacon without blocking the tracker", () => {
      const beacon =
        /<script[^>]*cloudflareinsights\.com[^>]*>/.exec(doc.html)?.[0] ?? "";

      // `type="module"` is deferred by definition, which is how Cloudflare's own
      // snippet satisfies the rule; `defer` would satisfy it too. What must not
      // appear is a plain blocking script.
      expect(beacon).toMatch(/type="module"|defer/);
    });
  },
);

describe("search-engine ownership proofs", () => {
  it("carries the Yandex verification the constant names", () => {
    const content = attribute(
      documents.en.html,
      "meta",
      "name",
      "yandex-verification",
      "content",
    );

    // A verification tag deleted by accident is a property silently unverified:
    // the site keeps working and the reports quietly stop, which is why this is
    // a test and not a comment.
    expect(content).toBe(YANDEX_VERIFICATION);
  });

  it("proves ownership with markup rather than a script", () => {
    // Both engines offer a script-based option; neither is used, because a
    // verification script is executable third-party code on every page load for
    // a one-time check.
    for (const name of ["google-site-verification", "yandex-verification"]) {
      const tag = new RegExp(`<meta[^>]*name="${name}"[^>]*>`).exec(
        documents.en.html,
      );

      expect(tag?.[0]).toBeDefined();
      expect(tag?.[0]).not.toContain("script");
    }
  });

  it("needs no second tag on the Russian entry", () => {
    // Verification is per site and the sitemap lists both URLs, so the root
    // document proving ownership is the whole of it.
    expect(documents.ru.html).not.toContain("yandex-verification");
  });
});

describe("the analytics token", () => {
  it("is a real token rather than a placeholder", () => {
    // Shape, not value: the point is that a `TODO` or an empty string cannot
    // ship as a counter that reports nowhere while the page looks finished.
    expect(ANALYTICS_TOKEN).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("the search term players use", () => {
  it("appears in the root title or description", () => {
    const title = /<title>([^<]+)<\/title>/.exec(documents.en.html)?.[1] ?? "";
    const description =
      attribute(documents.en.html, "meta", "name", "description", "content") ??
      "";

    expect(`${title} ${description}`).toContain("D2R");
  });

  it("appears in the Russian title or description too", () => {
    const title = /<title>([^<]+)<\/title>/.exec(documents.ru.html)?.[1] ?? "";
    const description =
      attribute(documents.ru.html, "meta", "name", "description", "content") ??
      "";

    expect(`${title} ${description}`).toContain("D2R");
  });
});

describe("the social card image", () => {
  it("is committed at the size the documents declare", () => {
    const png = readFileSync(path.join(ROOT, "public", "og-image.png"));

    // The PNG magic, then IHDR's width and height at fixed offsets — no image
    // library needed to hold two numbers.
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
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
  it("lists both entry URLs, and only them", () => {
    const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
      ([, location]) => location,
    );

    expect(locations).toEqual([SITE_URL, SITE_URL_RU]);
  });

  // Not a parse: the file is a handful of lines of hand-written XML and
  // pulling in a parser to read them would cost more than it proves. What can
  // plausibly go wrong by hand is a missing declaration, a dropped namespace,
  // or an unclosed root, and those are visible from the outside of the
  // document.
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

/** Every hreflang link in a document, as a `hreflang → href` record. */
function hreflangs(html: string): Record<string, string> {
  const found: Record<string, string> = {};

  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = new Map(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]),
    );

    const hreflang = attributes.get("hreflang");
    const href = attributes.get("href");

    if (attributes.get("rel") === "alternate" && hreflang && href) {
      found[hreflang] = href;
    }
  }

  return found;
}

/**
 * The value of `wanted` on the first `<name>` tag whose `key` attribute is
 * `value` — `attribute(html, "meta", "name", "description", "content")` for
 * the meta description.
 *
 * Attribute order and line breaks inside a tag are Prettier's to decide and it
 * rewraps them as the file grows, so matching a whole tag with one expression
 * would be a test that fails on a reformat. This splits the document into tags
 * first and reads each one's attributes, which is indifferent to how they are
 * laid out.
 */
function attribute(
  html: string,
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
