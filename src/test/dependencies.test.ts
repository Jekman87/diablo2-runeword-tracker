import { computePosition, offset } from "@floating-ui/react";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

// Proves the runtime utility dependencies are installed, importable and
// behave as the code rules assume. Not a test of the libraries themselves —
// a test that this project can use them.

describe("runtime utility dependencies", () => {
  it("clsx joins conditional class names", () => {
    const off: boolean = false;

    expect(clsx("a", off && "b", ["c"], { d: true, e: false })).toBe("a c d");
  });

  it("tailwind-merge resolves conflicting utilities to the last one", () => {
    expect(twMerge("p-2 p-4")).toBe("p-4");
    expect(twMerge("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("class-variance-authority resolves a variant lookup", () => {
    const button = cva("base", {
      variants: {
        size: { sm: "text-sm", lg: "text-lg" },
      },
      defaultVariants: { size: "sm" },
    });

    expect(button({ size: "lg" })).toBe("base text-lg");
    expect(button()).toBe("base text-sm");
  });

  it("zod parses valid input and rejects invalid input", () => {
    const runeword = z.object({
      name: z.string(),
      runes: z.array(z.string()).min(2),
    });

    expect(runeword.parse({ name: "Infinity", runes: ["Ber", "Mal"] })).toEqual(
      {
        name: "Infinity",
        runes: ["Ber", "Mal"],
      },
    );

    expect(() => runeword.parse({ name: "Broken", runes: [] })).toThrow();
  });

  it("@floating-ui/react positions a floating element against a reference", async () => {
    const floating = document.body.appendChild(document.createElement("div"));

    // A virtual reference with a rect stated outright, because jsdom performs
    // no layout and a real element would measure 0×0 in every direction. The
    // positioning arithmetic is what is under test here, and it is the same
    // arithmetic either way: `bottom-start` puts the panel at the reference's
    // left edge and its bottom edge, and `offset` moves it down by the gap.
    const reference = {
      getBoundingClientRect: () => new DOMRect(0, 100, 80, 20),
    };

    const { x, y, placement } = await computePosition(reference, floating, {
      placement: "bottom-start",
      middleware: [offset(8)],
    });

    expect(placement).toBe("bottom-start");
    expect(x).toBe(0);
    expect(y).toBe(128);

    floating.remove();
  });
});
