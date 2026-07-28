import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "vendor"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
    },
  },
  // Globals are split out of the shared block because flat config *merges*
  // `languageOptions.globals` across every matching entry. A `scripts` block
  // alone would therefore add Node globals on top of the browser ones rather
  // than replacing them, and `document` would stay defined in a build script.
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["scripts/**"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
