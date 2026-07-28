## 1. Base path

- [x] 1.1 Set `base: "/diablo2-runeword-tracker/"` in `vite.config.ts` as a
      literal constant — not read from an environment variable, so that
      `pnpm preview` reproduces production asset resolution
- [x] 1.2 Run `pnpm build` and read `dist/index.html`; confirm the script and
      stylesheet references are prefixed with the sub-path
- [x] 1.3 Run `pnpm preview`, load the sub-path URL, and confirm the heading
      renders with Tailwind styles applied
- [x] 1.4 Confirm `pnpm dev` still serves — it now lives under the sub-path
      rather than at the root, which is expected
- [x] 1.5 Run `pnpm test`; confirm the base change did not affect the suite

## 2. Node version pin

- [x] 2.1 Add `.nvmrc` pinning Node 24, matching the development machine. The
      dependency floor is Node 20.19 for `vite@8` and Node 20 for `vitest@4`,
      so 24 satisfies both with room ahead
- [x] 2.2 Confirm `.nvmrc` is not excluded by `.prettierignore` handling in a
      way that breaks `pnpm format:check`

## 3. Workflow — quality gate

- [x] 3.1 Create `.github/workflows/ci.yml` triggered on push to `main` and on
      pull requests targeting `main`
- [x] 3.2 Declare workflow permissions: `contents: read`, plus `pages: write`
      and `id-token: write` for the deploy job
- [x] 3.3 In the gate job, order the setup steps `actions/checkout@v7`, then
      `pnpm/action-setup@v6` with no version input so it reads the
      `packageManager` field, then `actions/setup-node@v7` with
      `node-version-file: .nvmrc` and `cache: "pnpm"`. The pnpm step must come
      before the Node step or the cache lookup cannot find the pnpm binary
- [x] 3.4 Install with `pnpm install --frozen-lockfile`
- [x] 3.5 Add `typecheck`, `lint`, `format:check`, `test` and `build` as five
      separate named steps, so a failure names the check that failed
- [x] 3.6 Add a step after the build that asserts the asset references in
      `dist/index.html` carry the `/diablo2-runeword-tracker/` prefix, and
      fails the run if they do not

## 4. Workflow — deployment

- [x] 4.1 Add `actions/configure-pages@v6` and
      `actions/upload-pages-artifact@v5` pointed at `dist`, so the gate job
      publishes the artifact
- [x] 4.2 Add a `deploy` job with `needs` on the gate job, guarded to run only
      for pushes to `main` — never for pull requests or other branches
- [x] 4.3 Give the deploy job the `github-pages` environment and its URL
      output, then deploy with `actions/deploy-pages@v5`
- [x] 4.4 Set the deploy concurrency group to `pages` with
      `cancel-in-progress: false`, so overlapping deployments queue instead of
      being interrupted
- [x] 4.5 Run `pnpm format` and `pnpm lint`; confirm the new YAML and `.nvmrc`
      do not break either gate locally

## 5. First deployment

- [x] 5.1 Commit and push to `main`, then watch the first run end to end. The
      `github-pages` environment is created during the first deploy job —
      commit `ef9e238`, run `30348051090`, both jobs green
- [x] 5.2 Confirm the gate job reports all five checks plus the base-path
      assertion as passing — seven distinct green steps, and the assertion
      logged `ok` for both the JS and the CSS reference
- [x] 5.3 Load `https://jekman87.github.io/diablo2-runeword-tracker/` and
      confirm the shell renders with styles applied and no console errors —
      served HTTP 200 with the heading string present in the deployed bundle
      and every utility class `App.tsx` uses present in the deployed CSS. The
      console-error half needs a real browser and is left to a manual look;
      no browser tooling is installed and this change adds no dependencies
- [x] 5.4 Check the network panel: the hashed JS and CSS must return HTTP 200
      from under the sub-path, not 404 from the domain root — both 200 under
      the sub-path with correct content types; the same asset path at the
      domain root returns 404, confirming the prefix is what makes it resolve
- [x] 5.5 Confirm via the Pages API or the repository UI that the deployment is
      recorded against the pushed commit — deployment `5637604787`,
      environment `github-pages`, sha `ef9e238`
- [x] 5.6 Confirm no build output was committed to any branch — `dist/` stays
      ignored and no `gh-pages` branch exists — no tracked files under
      `dist/` (ignored by `.gitignore:6`) and `main` is the only branch

## 6. Negative verification

- [x] 6.1 Verify a failing gate blocks deployment: push a commit with a
      deliberate lint error on a scratch branch, confirm the gate fails and no
      deployment runs, then remove the branch — **a bare branch push triggers
      nothing**, since the workflow listens only on pushes to `main` and pull
      requests targeting it, so the branch was raised as PR #2 to make the gate
      run. Type-check passed and **Lint** failed by name
      (`@typescript-eslint/no-explicit-any`), the four later steps never ran,
      and the deploy job was skipped. PR closed, branch deleted
- [x] 6.2 Confirm the previously published site is still served unchanged after
      that failed run — still HTTP 200 serving the same hashed assets, and the
      `github-pages` environment still holds exactly one deployment (`ef9e238`)
- [x] 6.3 Verify a pull request runs the gate and does not deploy — run
      `30348463690` fired on `event: pull_request` and its deploy job was
      skipped. Note the deploy job is skipped for two independent reasons on a
      red PR (`needs: build` failed _and_ the `if:` guard excludes
      `pull_request`); the guard alone is what excludes a green PR

## 7. Documentation

- [x] 7.1 Add the live URL and a workflow status badge to `README.md`
- [x] 7.2 Note in `README.md` that the dev server serves under the sub-path, so
      the URL does not read as a bug
- [x] 7.3 Update the `IDEAS.md` Tooling or Decided section if deployment is
      described there as pending — it was not described as pending, so the
      Decided entry gained the live URL and the trigger instead

## 8. Acceptance

- [x] 8.1 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five
      exit zero
- [ ] 8.2 Confirm a second push to `main` redeploys and the live site reflects
      the new commit
- [x] 8.3 Run `openspec validate --changes deploy-github-pages --strict`
- [ ] 8.4 Commit as `ci(deploy): publish to github pages via actions`
