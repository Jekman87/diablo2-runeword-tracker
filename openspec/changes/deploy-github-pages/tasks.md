## 1. Base path

- [ ] 1.1 Set `base: "/diablo2-runeword-tracker/"` in `vite.config.ts` as a
      literal constant — not read from an environment variable, so that
      `pnpm preview` reproduces production asset resolution
- [ ] 1.2 Run `pnpm build` and read `dist/index.html`; confirm the script and
      stylesheet references are prefixed with the sub-path
- [ ] 1.3 Run `pnpm preview`, load the sub-path URL, and confirm the heading
      renders with Tailwind styles applied
- [ ] 1.4 Confirm `pnpm dev` still serves — it now lives under the sub-path
      rather than at the root, which is expected
- [ ] 1.5 Run `pnpm test`; confirm the base change did not affect the suite

## 2. Node version pin

- [ ] 2.1 Add `.nvmrc` pinning Node 24, matching the development machine. The
      dependency floor is Node 20.19 for `vite@8` and Node 20 for `vitest@4`,
      so 24 satisfies both with room ahead
- [ ] 2.2 Confirm `.nvmrc` is not excluded by `.prettierignore` handling in a
      way that breaks `pnpm format:check`

## 3. Workflow — quality gate

- [ ] 3.1 Create `.github/workflows/ci.yml` triggered on push to `main` and on
      pull requests targeting `main`
- [ ] 3.2 Declare workflow permissions: `contents: read`, plus `pages: write`
      and `id-token: write` for the deploy job
- [ ] 3.3 In the gate job, order the setup steps `actions/checkout@v7`, then
      `pnpm/action-setup@v6` with no version input so it reads the
      `packageManager` field, then `actions/setup-node@v7` with
      `node-version-file: .nvmrc` and `cache: "pnpm"`. The pnpm step must come
      before the Node step or the cache lookup cannot find the pnpm binary
- [ ] 3.4 Install with `pnpm install --frozen-lockfile`
- [ ] 3.5 Add `typecheck`, `lint`, `format:check`, `test` and `build` as five
      separate named steps, so a failure names the check that failed
- [ ] 3.6 Add a step after the build that asserts the asset references in
      `dist/index.html` carry the `/diablo2-runeword-tracker/` prefix, and
      fails the run if they do not

## 4. Workflow — deployment

- [ ] 4.1 Add `actions/configure-pages@v6` and
      `actions/upload-pages-artifact@v5` pointed at `dist`, so the gate job
      publishes the artifact
- [ ] 4.2 Add a `deploy` job with `needs` on the gate job, guarded to run only
      for pushes to `main` — never for pull requests or other branches
- [ ] 4.3 Give the deploy job the `github-pages` environment and its URL
      output, then deploy with `actions/deploy-pages@v5`
- [ ] 4.4 Set the deploy concurrency group to `pages` with
      `cancel-in-progress: false`, so overlapping deployments queue instead of
      being interrupted
- [ ] 4.5 Run `pnpm format` and `pnpm lint`; confirm the new YAML and `.nvmrc`
      do not break either gate locally

## 5. First deployment

- [ ] 5.1 Commit and push to `main`, then watch the first run end to end. The
      `github-pages` environment is created during the first deploy job
- [ ] 5.2 Confirm the gate job reports all five checks plus the base-path
      assertion as passing
- [ ] 5.3 Load `https://jekman87.github.io/diablo2-runeword-tracker/` and
      confirm the shell renders with styles applied and no console errors
- [ ] 5.4 Check the network panel: the hashed JS and CSS must return HTTP 200
      from under the sub-path, not 404 from the domain root
- [ ] 5.5 Confirm via the Pages API or the repository UI that the deployment is
      recorded against the pushed commit
- [ ] 5.6 Confirm no build output was committed to any branch — `dist/` stays
      ignored and no `gh-pages` branch exists

## 6. Negative verification

- [ ] 6.1 Verify a failing gate blocks deployment: push a commit with a
      deliberate lint error on a scratch branch, confirm the gate fails and no
      deployment runs, then remove the branch
- [ ] 6.2 Confirm the previously published site is still served unchanged after
      that failed run
- [ ] 6.3 Verify a pull request runs the gate and does not deploy

## 7. Documentation

- [ ] 7.1 Add the live URL and a workflow status badge to `README.md`
- [ ] 7.2 Note in `README.md` that the dev server serves under the sub-path, so
      the URL does not read as a bug
- [ ] 7.3 Update the `IDEAS.md` Tooling or Decided section if deployment is
      described there as pending

## 8. Acceptance

- [ ] 8.1 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five
      exit zero
- [ ] 8.2 Confirm a second push to `main` redeploys and the live site reflects
      the new commit
- [ ] 8.3 Run `openspec validate --changes deploy-github-pages --strict`
- [ ] 8.4 Commit as `ci(deploy): publish to github pages via actions`
