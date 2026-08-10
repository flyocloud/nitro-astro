# AGENTS.md

npm workspace. `lib/` is the published package `@flyo/nitro-astro`, `playground/` is a local Astro app for trying it out.

Only `lib/index.ts` is bundled (`build.lib.entry` in [lib/vite.config.ts](lib/vite.config.ts)). Everything else in the package — components, `cdn.ts`, `middleware.ts`, `sitemap.ts`, `toolbar.ts` — ships as **raw source** and is resolved by the consumer's own Astro/Vite toolchain. Keep that in mind: a file is not part of the package just because it exists.

## Adding a component

1. `lib/components/X.astro` — the component.
2. `lib/components/X.ts` — a two-line shim, same as every other one:

   ```ts
   import X from "./X.astro";
   export default X;
   ```

   Required, not optional. TypeScript cannot resolve `.astro` on its own, so the `types` condition must point at a `.ts` file.

3. `lib/components/X.astro.d.ts` — a fallback declaration for the line above:

   ```ts
   declare const X: (props: Record<string, any>) => any;
   export default X;
   ```

   Also required. Astro tooling resolves the real `X.astro` and ignores this file, so prop types stay intact; plain `tsc` has no Astro plugin and would otherwise report TS2307 **inside the consumer's `node_modules`** — and `skipLibCheck` does not suppress it, because the shim is a `.ts`, not a `.d.ts`.

4. Two entries in `exports` in [lib/package.json](lib/package.json) — both spellings, and note the asymmetry (`import` on the short form goes to the shim, on the long form to the `.astro`):

   ```jsonc
   "./X.astro": {
     "types":   "./components/X.ts",
     "import":  "./components/X.ts",
     "require": "./components/X.ts"
   },
   "./components/X.astro": {
     "types":   "./components/X.ts",
     "import":  "./components/X.astro",
     "require": "./components/X.astro"
   }
   ```

5. The same two subpaths in `typesVersions` in [lib/package.json](lib/package.json), pointing at the shim:

   ```jsonc
   "X.astro":            ["./components/X.ts"],
   "components/X.astro": ["./components/X.ts"]
   ```

   Also required — see the resolution note below.

6. `npm test --workspace=lib`.

Nothing else. `files` already ships all of `components/`, and `index.ts` deliberately does not re-export components — the `exports` map is the only way in. There is no wildcard in `exports`, so a subpath you forget to list is unreachable for consumers even though it is inside the tarball.

## Adding a root-level module (like `cdn.ts`)

Add it to **both** `files` and `exports` in [lib/package.json](lib/package.json), as plain source:

```jsonc
"./thing.ts": "./thing.ts"
```

If it should instead be part of the bundle and the generated types, it has to be reachable from `index.ts` — see the dts note below.

## What the tests enforce

[lib/packaging.test.ts](lib/packaging.test.ts) builds, runs `npm pack --dry-run`, and fails if:

- something `main` / `module` / `types` / `exports` / `typesVersions` points at is missing from the tarball (forgot step 2 or the `files` entry),
- test files, tsconfigs, tooling configs or stray `.d.ts` files ship (`components/*.astro.d.ts` is the one allowed exception),
- `dist/types/**` contains anything the package does not reference,
- a shipped source file imports a package that `dependencies` does not name (`astro` and the package's own name excepted — see the dependency note below),
- an `.astro` subpath in `exports` has no `typesVersions` fallback, or the two disagree (forgot step 5),
- a shim has no `components/X.astro.d.ts` beside it (forgot step 3).

So a forgotten export or a junk file is a red CI run, not a broken release. If you change what the package ships, expect this suite to have an opinion.

## Gotchas

- **Declarations are generated for `index.ts` only** (`include` on the dts plugin in [lib/vite.config.ts](lib/vite.config.ts)). Pointing `types` at some other `dist/types/*.d.ts` will not work until you widen that.
- **`exports` alone is not enough for consumers.** TypeScript only reads `exports` under `moduleResolution` `bundler` / `node16` / `nodenext`. A consumer whose `tsconfig.json` does not extend `astro/tsconfigs/*` — or who has no `tsconfig.json` at all — gets legacy `node10` resolution, where `exports` is invisible and `@flyo/nitro-astro/BlockSlot.astro` is looked up as a literal file at the package root. That file does not exist (components live in `components/`), so the IDE reports `TS2307: Cannot find module`. `typesVersions` is the fallback legacy resolution _does_ read; it only affects types, runtime resolution goes through `exports` either way. Keep the two in sync — the tests do not let you forget.
- **`.astro` imports from `.ts` resolve via `components/X.astro.d.ts`**, not an ambient `declare module "*.astro"`. The ambient version would have to be published to help consumers, and publishing it flattens the props of _their_ components to `any`. [lib/module.d.ts](lib/module.d.ts) is for `virtual:*` only.
- **Every bare import in shipped source must be a real `dependency`.** The bundle inlines its imports, so `dist/` works no matter what `dependencies` says — but the raw source is resolved from the _consumer's_ `node_modules`, where an undeclared package only resolves if something else in their tree happens to hoist it. `camelcase` in `components/FlyoNitroBlock.astro` was undeclared and resolved through `astro` → `boxen` → `camelcase` for exactly that reason, until an install that did not hoist it turned into a failed consumer build. `astro` is the one thing raw source may import freely: an integration is loaded from the consumer's `astro.config.mjs`, so their Astro is always present and always the version that has to win.
- **Component lookup is keyed by [lib/componentKey.ts](lib/componentKey.ts) on both ends.** The virtual module `vite-plugin-flyo-components.ts` emits registers each `components` key under `componentKey(name)`, and `FlyoNitroBlock.astro` looks up `componentKey(block.component)`. One implementation, two call sites, and they have to stay one: a second copy that drifts does not fail the build, it renders the fallback component for every block. That is also why the plugin emits a keyed registry instead of one named export per component — a Flyo name is not necessarily a valid JS identifier (`2cols`, `hero/block`), and `export { default as 2cols }` is a syntax error in the emitted module.
- **`componentKey.ts` is shipped raw _and_ inlined in the bundle.** The plugin imports it relatively (so rollup inlines it), the component imports `@flyo/nitro-astro/componentKey` (so the consumer resolves the shipped source). Both copies come from the one file, which is the point.
- **`vite-plugin-flyo-components.ts` is about the consumer's components** (`src/components/flyo`, exposed as `virtual:flyo-components`). It has nothing to do with this library's own components — do not register anything there.
- **Live-edit code is an injected string** in [lib/index.ts](lib/index.ts), not a normal import: it is emitted into the consumer's page and resolved from _their_ `node_modules`. That is why bumping `@flyo/nitro-js-bridge` here is not needed for clients to receive a new bridge — their `npm update` picks it up through the semver range.
- `tsconfig.json` excludes `./vite*.ts`, which is why the vite plugin files get no declarations.

## Docs

Three files, three audiences — keep them in sync when the public API changes:

- [README.md](README.md) — the documentation. Usage guide, configuration options, API and component reference. This is what users read on GitHub.
- [lib/README.md](lib/README.md) — the npm package page. Stays short and links back to the repo; npm publishes it regardless of the `files` array.
- [ai-instructions-astro.md](ai-instructions-astro.md) — the integration advisory for AI coding agents working in a consumer project. Linked from the README.
- [UPGRADE.md](UPGRADE.md) — breaking changes per release.

## Commands

```bash
npm install
npm run build                  # builds lib
npm test --workspace=lib       # unit + packaging tests (builds first)
npm run playground             # localhost:4321
npx eslint
npx prettier . --write
```

Releases are semantic-release from `main` (see [.github/workflows/release.yml](.github/workflows/release.yml)); commit messages drive the version.
