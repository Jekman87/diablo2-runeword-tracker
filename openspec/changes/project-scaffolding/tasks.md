## 1. Environment

- [x] 1.1 Confirm the Node and pnpm versions available; if pnpm is absent,
      enable it via `corepack enable pnpm`
- [x] 1.2 Verify registry reachability with `pnpm ping`. If it fails with a
      certificate error, apply the fix in `docs/DATA-SOURCES.md` ("TLS
      interception on this machine") — set `NODE_EXTRA_CA_CERTS` or
      `cafile`, never `strict-ssl=false`

## 2. Application skeleton

- [ ] 2.1 Create `package.json`: name `diablo2-runeword-tracker`, private,
      `"type": "module"`, `packageManager` pinned to the pnpm version in use
- [ ] 2.2 Install React 19 and `react-dom` as dependencies; install `vite`,
      `@vitejs/plugin-react` and the React type packages as devDependencies
- [ ] 2.3 Create `index.html` at the root with a `#root` div and the module
      script tag pointing at `src/main.tsx`
- [ ] 2.4 Create `src/main.tsx`, `src/App.tsx` and `src/index.css`. The shell
      renders the app name and nothing else — no copy that would need i18n
- [ ] 2.5 Create `vite.config.ts` with the React plugin; confirm `pnpm dev`
      serves the shell

## 3. TypeScript

- [ ] 3.1 Add `tsconfig.json` as a solution file referencing
      `tsconfig.app.json` and `tsconfig.node.json`
- [ ] 3.2 Configure `tsconfig.app.json` with `strict`, `noUnusedLocals`,
      `noUnusedParameters`, `noFallthroughCasesInSwitch`,
      `verbatimModuleSyntax`, `jsx: "react-jsx"`, and `include: ["src"]` —
      an explicit include, so `vendor/` can never drift in
- [ ] 3.3 Add the `@/*` → `./src/*` path mapping to `tsconfig.app.json` and
      the matching `resolve.alias` to `vite.config.ts`
- [ ] 3.4 Add the `typecheck` script (`tsc --build --force`) and make `build`
      run it before `vite build`
- [ ] 3.5 Change one import in `src/` to the `@/` form and confirm
      `pnpm typecheck` and `pnpm build` both resolve it

## 4. Tailwind CSS

- [ ] 4.1 Install `tailwindcss` and `@tailwindcss/vite`; add the plugin to
      `vite.config.ts`
- [ ] 4.2 Put `@import "tailwindcss";` at the top of `src/index.css` and
      ensure `src/main.tsx` imports it
- [ ] 4.3 Apply a utility class in `App.tsx` and confirm it takes effect in
      `pnpm dev` and in `pnpm build` output
- [ ] 4.4 Confirm no `tailwind.config.js` or `postcss.config.js` was created

## 5. Linting

- [ ] 5.1 Install `eslint`, `@eslint/js`, `typescript-eslint`,
      `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` and
      `globals`
- [ ] 5.2 Write `eslint.config.js` in flat format composing those configs,
      with a global `ignores: ["dist", "vendor"]`
- [ ] 5.3 Add the `lint` script; confirm `pnpm lint` exits clean on the
      scaffold
- [ ] 5.4 Temporarily add a conditional hook call, confirm `pnpm lint` fails
      on it, then revert

## 6. Formatting

- [ ] 6.1 Install `prettier`, `@trivago/prettier-plugin-sort-imports` and
      `prettier-plugin-tailwindcss`
- [ ] 6.2 Write `.prettierrc` with both plugins listed — sort-imports first,
      `prettier-plugin-tailwindcss` last, as that plugin requires
- [ ] 6.3 Set `tailwindStylesheet: "./src/index.css"` so the Tailwind plugin
      can see the v4 theme (this replaces v3's `tailwindConfig`)
- [ ] 6.4 Set `importOrder` to
      `["^react$", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"]` with
      `importOrderSeparation` and `importOrderSortSpecifiers` enabled, and
      `importOrderParserPlugins: ["typescript", "jsx"]`
- [ ] 6.5 Write `.prettierignore` covering `dist`, `vendor`, `pnpm-lock.yaml`
      and `local`
- [ ] 6.6 Add `format` and `format:check` scripts, run `pnpm format` over the
      repo, and confirm `pnpm format:check` then exits clean
- [ ] 6.7 Verify both plugins actually fire: scramble a class list and an
      import block in a scratch file, run `pnpm format`, confirm both were
      reordered, then delete the scratch file

## 7. Testing

- [ ] 7.1 Install `vitest`, `jsdom`, `@testing-library/react`,
      `@testing-library/jest-dom` and `@testing-library/user-event`
- [ ] 7.2 Add the `test` block to `vite.config.ts` (`environment: "jsdom"`,
      `globals: true`, a setup file) rather than a separate config, so the
      alias and plugins are shared
- [ ] 7.3 Create `src/test/setup.ts` importing
      `@testing-library/jest-dom/vitest`
- [ ] 7.4 Add `test` and `test:watch` scripts; ensure the `tsconfig`
      arrangement type-checks test files and Vitest globals
- [ ] 7.5 Write `src/App.test.tsx`: render the shell, assert it appears
- [ ] 7.6 Write a smoke test importing `clsx`, `tailwind-merge`,
      `class-variance-authority` and `zod`, exercising each — a conflicting
      `twMerge` pair, a `cva` variant lookup, a `zod` parse that succeeds and
      one that throws
- [ ] 7.7 Confirm `pnpm test` passes

## 8. Utility dependencies

- [ ] 8.1 Install `clsx`, `tailwind-merge`, `class-variance-authority` and
      `zod` as runtime dependencies (not dev) — they ship in the bundle
- [ ] 8.2 Confirm the task 7.6 smoke test passes against the installed
      versions

## 9. Pre-commit hook

- [ ] 9.1 Install `simple-git-hooks` and `lint-staged`
- [ ] 9.2 Add `pnpm-workspace.yaml` with `onlyBuiltDependencies:
      ["simple-git-hooks"]`, otherwise pnpm blocks its postinstall and the
      hook is never registered
- [ ] 9.3 Configure `simple-git-hooks` with a `pre-commit` entry running
      `pnpm lint-staged`, and a `prepare` script so a fresh clone installs it
- [ ] 9.4 Configure `lint-staged`: `eslint --fix` then `prettier --write` for
      `*.{ts,tsx}`, `prettier --write` for `*.{json,css,md}`
- [ ] 9.5 Verify the hook **fires**, not merely that the file exists: stage a
      deliberately misformatted file, commit, confirm the committed content
      came out formatted
- [ ] 9.6 Verify an unfixable lint error aborts the commit, then revert

## 10. Vendor isolation

- [ ] 10.1 Run `pnpm typecheck`, `pnpm lint` and `pnpm format:check` and
      confirm none of the three reports or touches anything under `vendor/`
- [ ] 10.2 Run `git status` after `pnpm format` and confirm no `vendor/` file
      is modified
- [ ] 10.3 Confirm `dist/` after a build contains no vendored content

## 11. Documentation and housekeeping

- [ ] 11.1 Write `docs/CODE_RULES.md` from the Code section of `AGENTS.md`,
      expanded with what the tooling now enforces: strict mode,
      `verbatimModuleSyntax`, import order, class ordering, the `@/` alias,
      and the file structure rule (public exports first, helpers last)
- [ ] 11.2 Add a "Read first" link to `docs/CODE_RULES.md` in `AGENTS.md`
- [ ] 11.3 Update `README.md`: replace "Nothing is built yet" with prerequisites,
      `pnpm install`, and a table of the available scripts
- [ ] 11.4 Fix the stale facts in `openspec/config.yaml` — React 18 → React 19,
      "~89" → 99 runewords
- [ ] 11.5 Add any new tool cache directories to `.gitignore`; confirm
      `node_modules/`, `dist/` and `coverage/` are already covered

## 12. Acceptance

- [ ] 12.1 Delete `node_modules/` and reinstall from the lockfile; confirm
      `pnpm-lock.yaml` is unchanged afterwards
- [ ] 12.2 Run the full gate in sequence — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five
      exit zero
- [ ] 12.3 Run `pnpm preview` and confirm the built output renders the same as
      dev
- [ ] 12.4 Run `openspec validate --changes project-scaffolding --strict`
- [ ] 12.5 Commit as `chore(setup): scaffold vite react typescript toolchain`
