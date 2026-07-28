import { render, screen } from "@testing-library/react";

import { App } from "@/App";
import { en } from "@/i18n/en";

// The table's own behaviour is covered by `RunewordTable.test.tsx`. What is
// asserted here is only what the page shell owes: its title, and that the table
// is the page's content rather than the rune grid that used to be.

describe("App", () => {
  it("renders the application shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: en.app.title }),
    ).toBeInTheDocument();
  });

  it("renders the runeword table as the page's content", () => {
    render(<App />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(100);
  });

  it("builds no site header", () => {
    render(<App />);

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toEqual([]);
  });
});
