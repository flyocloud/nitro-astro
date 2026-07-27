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

3. Two entries in `exports` in [lib/package.json](lib/package.json) — both spellings, and note the asymmetry (`import` on the short form goes to the shim, on the long form to the `.astro`):

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

4. `npm test --workspace=lib`.

Nothing else. `files` already ships all of `components/`, and `index.ts` deliberately does not re-export components — the `exports` map is the only way in. There is no wildcard in `exports`, so a subpath you forget to list is unreachable for consumers even though it is inside the tarball.

## Adding a root-level module (like `cdn.ts`)

Add it to **both** `files` and `exports` in [lib/package.json](lib/package.json), as plain source:

```jsonc
"./thing.ts": "./thing.ts"
```

If it should instead be part of the bundle and the generated types, it has to be reachable from `index.ts` — see the dts note below.

## What the tests enforce

[lib/packaging.test.ts](lib/packaging.test.ts) builds, runs `npm pack --dry-run`, and fails if:

- something `main` / `module` / `types` / `exports` points at is missing from the tarball (forgot step 2 or the `files` entry),
- test files, tsconfigs, tooling configs or stray `.d.ts` files ship,
- `dist/types/**` contains anything the package does not reference.

So a forgotten export or a junk file is a red CI run, not a broken release. If you change what the package ships, expect this suite to have an opinion.

## Gotchas

- **Declarations are generated for `index.ts` only** (`include` on the dts plugin in [lib/vite.config.ts](lib/vite.config.ts)). Pointing `types` at some other `dist/types/*.d.ts` will not work until you widen that.
- **`.astro` imports resolve via an ambient declaration** in [lib/module.d.ts](lib/module.d.ts), needed because plain `tsc` has no Astro language-service plugin. It is not published, so consumers keep their own richer prop types.
- **`vite-plugin-flyo-components.ts` is about the consumer's components** (`src/components/flyo`, exposed as `virtual:flyo-components`). It has nothing to do with this library's own components — do not register anything there.
- **Live-edit code is an injected string** in [lib/index.ts](lib/index.ts), not a normal import: it is emitted into the consumer's page and resolved from _their_ `node_modules`. That is why bumping `@flyo/nitro-js-bridge` here is not needed for clients to receive a new bridge — their `npm update` picks it up through the semver range.
- `tsconfig.json` excludes `./vite*.ts`, which is why the vite plugin files get no declarations.

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
