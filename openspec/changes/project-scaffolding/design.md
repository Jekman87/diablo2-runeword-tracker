## Context

The repository has documentation, vendored data under `vendor/runewizard/` and
an OpenSpec setup, but no application. `IDEAS.md` already fixes the stack
(React + TypeScript, Vite, Tailwind, ESLint, Prettier) and names the exact
tooling to borrow from the owner's `kwp-app`. `AGENTS.md` fixes the code
conventions. So this design is not choosing a stack — it is deciding the
handful of things those two documents leave open: package manager, major
versions, config file layout, how the vendored data is kept out of the build,
and what "done" means for a scaffold with no features in it.

Two constraints shape the choices:

- **`vendor/` is read-only and must never be compiled.** It contains
  third-party `.ts` files written against another project's types. If the
  TypeScript project or ESLint picks them up, the first `pnpm typecheck` fails
  on code we are contractually not allowed to edit.
- **This machine sits behind TLS interception** (`docs/DATA-SOURCES.md`).
  Any tool with its own CA bundle can fail to reach the registry. `pnpm` is
  such a tool.

## Goals / Non-Goals

**Goals:**

- `pnpm install && pnpm dev` produces a running page on a clean checkout.
- `pnpm build` produces a static bundle; `pnpm typecheck`, `pnpm lint`,
  `pnpm format:check` and `pnpm test` all pass on the scaffold as committed.
- Every dependency named in the `IDEAS.md` Tooling section is installed and
  demonstrably wired, not merely listed in `package.json`.
- A commit cannot introduce unformatted or lint-failing code.
- The next change can add a feature by adding files, touching no config.

**Non-Goals:**

- Any runeword behaviour: no data loading, no zod schema for the dataset, no
  table, no persistence, no aggregation logic.
- The Diablo II visual theme. Tailwind is installed; the palette, the serif
  display font, the custom cursor and the rune sprite are a later change.
- The i18n layer. `AGENTS.md` forbids hardcoded display text in components,
  which is why the shell renders as close to nothing as possible — there is no
  copy to hardcode.
- CI and GitHub Pages deployment.
- A component library or a `cn()` helper. `clsx`, `tailwind-merge` and `cva`
  are installed here because the dependency list belongs in one place; the
  shape of the helper that uses them is a decision for the first component.

## Decisions

### Package manager: pnpm

`.gitignore` already ignores `.pnpm-store/` and `pnpm-debug.log*`, so this was
decided before this change existed; the design just makes it explicit.
Consequence worth planning for: pnpm blocks dependency build scripts by
default, and `simple-git-hooks` needs its `postinstall` to run in order to
register the hook. That approval goes in `pnpm-workspace.yaml` under
`onlyBuiltDependencies`. Miss it and the hook silently never installs — which
looks exactly like "the hook works, nothing was wrong with my commit".

### Tailwind CSS v4 via `@tailwindcss/vite`, not PostCSS

v4 is the current major and its Vite plugin replaces the whole PostCSS chain:
install `tailwindcss` + `@tailwindcss/vite`, add the plugin, put
`@import "tailwindcss";` at the top of `src/index.css`. No `tailwind.config.js`,
no `postcss.config.js`, no `content` globs to keep in sync.

_Alternative considered:_ Tailwind v3 with the classic PostCSS setup, which
has more Stack Overflow answers behind it. Rejected — starting a greenfield
project on the previous major buys nothing and costs a migration later. The
theme change that follows will define colours with `@theme` in CSS, which is
also where a Diablo II palette reads better than in a JS config object.

_Consequence for Prettier:_ `prettier-plugin-tailwindcss` locates the theme
through the `tailwindStylesheet` option under v4, replacing v3's
`tailwindConfig`. Set it to `./src/index.css`. Left unset, the plugin still
sorts, but it cannot see custom theme values and will misorder any class built
on them.

### React 19, and `openspec/config.yaml` gets corrected

`IDEAS.md` says only "React"; `openspec/config.yaml` says React 18 and "~89"
runewords. Both figures in the config are stale — `docs/DATA-SOURCES.md`
verified 99 runewords, and there is no reason to start a new project on
React 18. Since `config.yaml` is injected as context into every future
proposal, a stale number there propagates. Fix it in this change.

_Alternative considered:_ pin React 18 to match the config. Rejected — that is
letting a typo in a context file make a technical decision.

### Two TypeScript configs, and `vendor/` excluded from both

Standard Vite split: `tsconfig.json` as a solution file referencing
`tsconfig.app.json` (browser code, `src/` only) and `tsconfig.node.json`
(`vite.config.ts`). `strict: true`, plus `noUnusedLocals`,
`noUnusedParameters`, `noFallthroughCasesInSwitch` and
`verbatimModuleSyntax`.

The important line is `include: ["src"]` on the app config — an `include` that
names `src` explicitly cannot drift into `vendor/`, whereas an `exclude` list
has to be maintained. ESLint gets the same treatment through a global
`ignores: ["dist", "vendor"]` entry, and Prettier through `.prettierignore`.
Three tools, three separate ignore mechanisms, one rule: **`vendor/` is
invisible to tooling.** A task in `tasks.md` verifies this by running all
three, rather than trusting it.

_Alternative considered:_ move `vendor/` outside the project root. Rejected —
`docs/DATA-SOURCES.md` argues for keeping provenance visible in the repo, and
that decision is settled.

### Path alias `@/*` → `src/*`, declared twice

Vite resolves imports at build time and TypeScript resolves them at check
time, and neither reads the other's config. The alias therefore goes in both
`tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`). A
mismatch here produces the confusing failure mode where the editor is happy
and the build is not.

This also feeds `@trivago/prettier-plugin-sort-imports`: the import order is
`react` first, then packages, then `@/…`, then relative — expressed as
`importOrder: ["^react$", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"]` with
`importOrderSeparation` on.

_Known sharp edge:_ `@trivago/prettier-plugin-sort-imports` needs
`importOrderParserPlugins: ["typescript", "jsx"]` to parse `.tsx`, and it must
be listed **before** `prettier-plugin-tailwindcss` in `plugins` —
the Tailwind plugin documents that it has to load last.

### ESLint flat config, typed linting deferred

`eslint.config.js` in flat format, composing `@eslint/js` recommended,
`typescript-eslint` recommended, `eslint-plugin-react-hooks` and
`eslint-plugin-react-refresh`. Non-type-aware to start: type-aware linting
roughly triples lint time and its value shows up on a codebase with real
logic, not on a hello-world shell. Revisit when the aggregation logic lands.

Prettier runs as a separate command rather than through `eslint-plugin-prettier`
— formatting failures should read as formatting failures, not as lint errors.

### Vitest with `jsdom`, and one real test

`vitest` + `@testing-library/react` + `jsdom`, configured inside
`vite.config.ts` rather than a separate `vitest.config.ts` so the alias and
plugins are shared automatically.

The scaffold ships one test that mounts the app shell and asserts it renders.
Its job is not coverage — it is to prove the whole chain (alias resolution,
JSX transform, jsdom environment, setup file) actually works. A test
infrastructure whose first real use is six weeks away is a test infrastructure
that is broken and nobody knows it.

### Pre-commit hook: `simple-git-hooks` + `lint-staged`

Named in `IDEAS.md`, and the lighter of the two common options — it writes the
hook file directly instead of shipping a `.husky/` directory. `lint-staged`
runs `eslint --fix` then `prettier --write` on staged `.ts`/`.tsx`, and
`prettier --write` alone on `.json`/`.css`/`.md`.

Type-checking and tests deliberately stay **out** of the hook. Both are
whole-project operations that cannot be scoped to staged files, and a
multi-second commit is a hook people start bypassing with `--no-verify`. They
belong in CI, which is the next change.

### Where the utility dependencies land

`clsx`, `tailwind-merge`, `cva` and `zod` are installed but, apart from being
imported nowhere, would be dead weight this change cannot justify. The
resolution: the smoke test imports each one and asserts a trivial fact about
it. That is enough to catch a broken install or a version incompatibility now,
without inventing an API that a later spec should design.

## Risks / Trade-offs

- **TLS interception breaks `pnpm install`** → The failure mode
  (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`) and its fix are already documented in
  `docs/DATA-SOURCES.md`; the first task points at that section rather than
  rediscovering it. Do not reach for `strict-ssl=false`.
- **pnpm silently skips `simple-git-hooks`' build script** → The hook is
  verified by an explicit task: stage a deliberately misformatted file, commit,
  confirm it was reformatted. Checking that `.git/hooks/pre-commit` exists is
  not the same as checking that it fires.
- **A vendored file leaks into the build** → Excluded three separate ways and
  verified by running `typecheck`, `lint` and `format:check` after wiring.
- **Tailwind v4 is a smaller ecosystem than v3** → The only v4-sensitive
  dependency here is `prettier-plugin-tailwindcss`, which supports it via
  `tailwindStylesheet`. Nothing else in the list touches Tailwind internals.
- **`verbatimModuleSyntax` rejects a common import style** → It forces
  `import type { … }` for type-only imports. This is a deliberate cost: it
  makes the type/value boundary explicit, and it is far cheaper to adopt on an
  empty `src/` than to retrofit across a finished feature set.
- **The scaffold is over-configured for what it renders** → Accepted, and it is
  the point. Config added alongside a feature gets reviewed as an afterthought;
  config added on its own gets reviewed on its merits.
