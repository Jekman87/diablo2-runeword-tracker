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
});
