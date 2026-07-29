# UPGRADE

This document describes every change a **consumer project** has to make to move from an
older `@flyo/nitro-astro` release to the latest one. It is written to be self-contained:
you can paste it into an AI coding agent together with the instruction _"upgrade this Astro
project to the latest @flyo/nitro-astro following this document"_ and it has everything it
needs — exact file paths, before/after snippets, search patterns and a verification list.

Internal repository conventions (how to add a component to this package, how the tarball is
built) are **not** part of this document — see [AGENTS.md](AGENTS.md) for those.

---

## How to use this document

1. Find the version the project currently uses (see [Step 0](#step-0--determine-the-current-version)).
2. Work through **every** section from that version upwards, in order. The sections are
   cumulative — skipping one will leave the project half-migrated.
3. Finish with the [verification checklist](#verification-checklist).

Sections are marked so you can tell what you are dealing with:

| Marker              | Meaning                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| 🔴 **BREAKING**     | The project will not build or will misbehave until you change your code.     |
| 🟡 **BEHAVIOUR**    | Still builds, but output/runtime behaviour changes. Review before deploying. |
| 🟢 **ADDITIVE**     | New capability, nothing to do unless you want it.                            |
| ⚪ **HOUSEKEEPING** | Packaging/tooling only, no source change in your project.                    |

---

## Step 0 — determine the current version

Do **not** read the `version` field of this repository's `lib/package.json` — releases are
cut by semantic-release and that field is never bumped (it permanently says `1.0.0`).

In the consumer project:

```bash
# what the manifest asks for
grep '"@flyo/nitro-astro"' package.json

# what is actually installed (authoritative)
npm ls @flyo/nitro-astro @flyo/nitro-js-bridge @flyo/nitro-typescript
```

If `npm ls` is unavailable, read `node_modules/@flyo/nitro-astro/package.json` — the
published tarball carries the real version.

Then pick your starting point:

| Installed version | Start at                                                    |
| ----------------- | ----------------------------------------------------------- |
| `1.x` (≤ 1.5.0)   | [1.x → 2.x](#1x--2x-major)                                  |
| `2.0.0` – `2.0.9` | [2.0.0 → 2.0.11](#200--2011-patch-level-correctness-fixes)  |
| `2.0.10`/`2.0.11` | [2.0.x → 2.1.2](#20x--212-live-edit-moves-to-the-js-bridge) |
| `2.1.x`           | [2.1.x → 2.2.0](#21x--220-wysiwyg-renderer)                 |
| `2.2.x`           | [2.2.x → 2.3.8](#22x--238-debuginfo-and-seo-meta-tags)      |
| `2.3.x`           | [2.3.x → 2.4.3](#23x--243-scroll-to-handshake-and-types)    |
| `2.4.0` – `2.4.2` | [2.3.x → 2.4.3](#23x--243-scroll-to-handshake-and-types)    |

---

## Release map

Reference table for the whole 2.x line. "Consumer impact" is what this document covers.

| Version  | Date       | Consumer impact                                                                         |
| -------- | ---------- | --------------------------------------------------------------------------------------- |
| `1.5.0`  | 2024-06-10 | Last 1.x release.                                                                       |
| `2.0.0`  | 2024-07-03 | 🔴 `useConfig()` signature, config now resolved by middleware, cache headers.           |
| `2.0.1`  | 2024-07-03 | ⚪ `toolbar.ts` was missing from the tarball.                                           |
| `2.0.2`  | 2024-07-03 | ⚪ Type exports moved to `dist/types`.                                                  |
| `2.0.3`  | 2024-07-03 | ⚪ `files` fix.                                                                         |
| `2.0.4`  | 2024-07-03 | ⚪ `.ts` sources added to the tarball.                                                  |
| `2.0.5`  | 2024-07-03 | 🟡 Config is re-resolved on every request (no more stale config until restart).         |
| `2.0.6`  | 2024-07-03 | ⚪ `files` fix.                                                                         |
| `2.0.7`  | 2024-10-30 | ⚪ `@flyo/nitro-typescript` → `^1.1.0`.                                                 |
| `2.0.8`  | 2024-10-30 | ⚪ Metadata/readme.                                                                     |
| `2.0.9`  | 2024-10-30 | ⚪ Dropped the `astro-adapter` keyword — install with `npm install`, not `astro add`.   |
| `2.0.10` | 2024-11-15 | 🔴 `componentsDir` default was never applied. Blocks render nothing before this.        |
| `2.0.11` | 2024-11-15 | 🟡 Missing `accessToken` now throws at config time; middleware degrades gracefully.     |
| `2.1.0`  | 2025-09-18 | 🔴 Live-edit attribute renamed `data-flyo-block-uid` → `data-flyo-uid`. Broken deps.    |
| `2.1.1`  | 2025-09-19 | 🔴 Adds the `@flyo/nitro-js-bridge` dependency `2.1.0` forgot. **Never ship `2.1.0`.**  |
| `2.1.2`  | 2025-09-19 | 🟢 `editable()` added; `editableBlock()` kept as alias.                                 |
| `2.2.0`  | 2025-11-28 | 🟢 `FlyoWysiwyg.astro` for ProseMirror/TipTap JSON.                                     |
| `2.3.0`  | 2026-01-30 | 🟢 `DebugInfo.astro`.                                                                   |
| `2.3.1`  | 2026-01-30 | ⚪ `DebugInfo` import path fix.                                                         |
| `2.3.2`  | 2026-01-30 | ⚪ `DebugInfo` output format.                                                           |
| `2.3.3`  | 2026-01-30 | 🟢 `DebugInfo` falls back to `process.env` when build-time env is empty.                |
| `2.3.4`  | 2026-01-30 | ⚪ Internal rename.                                                                     |
| `2.3.5`  | 2026-02-04 | 🟡 `MetaInfo` now rewrites the `image` prop into a `/thumb/…` social-card URL.          |
| `2.3.6`  | 2026-02-04 | 🟡 Separate Twitter card size (1200x600 vs og 1200x630).                                |
| `2.3.7`  | 2026-02-04 | 🟡 `MetaInfo` emits `og:url` **and** `<link rel="canonical">` unconditionally.          |
| `2.3.8`  | 2026-02-09 | 🟢 `@flyo/nitro-astro/components/X.astro` import spelling now also works.               |
| `2.4.0`  | 2026-03-05 | 🟡 Live edit calls `scrollTo()` — needs js-bridge ≥ 1.3.0, which it does not pin.       |
| `2.4.1`  | 2026-03-05 | 🟡 Pins js-bridge `^1.4.0` (editor handshake).                                          |
| `2.4.2`  | 2026-07-27 | ⚪ Pins js-bridge `^1.5.0`; stops shipping junk files.                                  |
| `2.4.3`  | 2026-07-28 | 🔴→fixed `TS2307: Cannot find module '@flyo/nitro-astro/BlockSlot.astro'` in consumers. |

---

# 1.x → 2.x (major)

2.0.0 changed how the Flyo config reaches your templates. In 1.x every call site fetched
(and process-globally cached) the config itself; in 2.x an **injected middleware** resolves
it once per request and puts it on `Astro.locals.config`. Everything else in this section
follows from that.

Do not upgrade to bare `2.0.0`. Go straight to the latest `2.4.x` and then read the
per-minor sections below, because 2.0.0–2.0.9 contain the `componentsDir` bug (2.0.10)
that silently renders no blocks.

## 1.1 — Preconditions

| Requirement                                          | Note                                                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Astro `4.x` (developed and tested against `^4.16.7`) | 2.x uses the `addMiddleware` integration API (Astro ≥ 3.5.0) and `addDevToolbarApp`.      |
| `output: "server"` in `astro.config.mjs`             | Already required in 1.x. The middleware only runs for on-demand rendered routes.          |
| An adapter (`@astrojs/node`, `@astrojs/vercel`, …)   | Unchanged from 1.x.                                                                       |
| Astro ≥ 4.13.0 if you adopt the `Astro.rewrite` 404s | `Astro.rewrite` is stable from 4.13.0 (experimental from 4.8.0). Optional — see step 1.6. |

## 1.2 — Dependencies 🔴

Files to change: **`package.json`**, then reinstall.

```diff
   "dependencies": {
-    "@flyo/nitro-astro": "^1.5.0",
+    "@flyo/nitro-astro": "^2.4.3",
```

```bash
npm install @flyo/nitro-astro@latest
npm ls @flyo/nitro-astro @flyo/nitro-js-bridge @flyo/nitro-typescript
```

Three things changed underneath:

- **`nanostores` is no longer a dependency.** 1.x depended on `nanostores@^0.10.3` to cache
  the config; 2.x does not. If any of your own code imports `nanostores` and relied on it
  being hoisted into `node_modules` by this package, add it to your own `dependencies`.
- **`@flyo/nitro-typescript` moved from `^1.0.9` to `^1.1.0`.** One model was renamed in
  that release: `BlockSlots` → `BlockSlot`. Only relevant if you imported the type by name;
  `Block["slots"]` is unchanged.
  ```diff
  - import type { BlockSlots } from "@flyo/nitro-typescript";
  + import type { BlockSlot } from "@flyo/nitro-typescript";
  ```
- **`@flyo/nitro-js-bridge` becomes a transitive dependency** (from 2.1.1 on). npm hoists it
  so the injected live-edit script and `FlyoWysiwyg.astro` can resolve it from your project.
  With pnpm's strict layout, Yarn PnP, or any setup that does not hoist, add it explicitly:
  ```bash
  npm install @flyo/nitro-js-bridge
  ```
  Symptom if it is missing: `Failed to resolve import "@flyo/nitro-js-bridge"` during build
  or dev.

**Installation command changed.** 1.x documented `astro add @flyo/nitro-astro`. The package
no longer carries the `astro-integration`/`astro-adapter` keywords (removed in 2.0.9), so
use `npm install` and register the integration in `astro.config.mjs` yourself. If you
previously ran `astro add`, the entry it wrote to `astro.config.mjs` stays valid.

## 1.3 — `useConfig()` signature 🔴

This is the change the old version of this document described. It affects **every** file
that reads the Flyo config — typically `src/layouts/*.astro` and any page.

`useConfig()` in 1.x took an optional language string and did the HTTP request itself. In
2.x it takes the Astro context object and just awaits what the middleware already put on
`Astro.locals.config`.

**before (1.x)** — both spellings existed:

```astro
---
const config = await useConfig();
const config = await useConfig(Astro.currentLocale);
---
```

**after (2.x):**

```astro
---
const config = await useConfig(Astro);
---
```

In an API route / endpoint, pass the context instead of the `Astro` global:

```ts
export async function GET(context) {
  const config = await useConfig(context);
}
```

Search for every call site:

```bash
grep -rn "useConfig(" src/
```

Two consequences of the mechanism change:

- **`useConfig` only works where the middleware ran.** It is not available in
  `getStaticPaths()` (Astro does not expose `locals` there) or at module scope. Use
  `useConfigApi().config({ lang })` directly if you need the config outside a render. On a
  route you explicitly prerender, Astro runs the middleware at _build_ time, so
  `useConfig(Astro)` returns the config as it was when you built — content changes will not
  appear until the next build.
- **The language is no longer yours to pass.** The middleware calls
  `useConfigApi().config({ lang: context.currentLocale })`. That means Astro's i18n config
  is now the single source of truth — see step 1.7.

## 1.4 — `useConfiguration()` / `globalThis.flyoNitroInstance` 🔴

In 1.x, `globalThis.flyoNitroInstance` **was** the `Configuration` object and
`globalThis.flyoNitroIntegrationOptions` held the options. In 2.x there is one global with
both:

```js
// 1.x
globalThis.flyoNitroInstance = defaultConfig; // a Configuration
globalThis.flyoNitroIntegrationOptions = { liveEdit };

// 2.x
globalThis.flyoNitroInstance = {
  config: defaultConfig,
  options: {
    accessToken, // added in 2.3.0
    liveEdit,
    componentsDir,
    clientCacheHeaderTtl,
    serverCacheHeaderTtl,
  },
};
```

`useConfiguration()` still returns the `Configuration` (it now unwraps `.config`), so calls
to it need no change. But if you touched the globals directly, migrate to the new accessor:

```diff
- const liveEdit = globalThis.flyoNitroIntegrationOptions.liveEdit;
+ import { useFlyoIntegration } from "@flyo/nitro-astro";
+ const liveEdit = useFlyoIntegration().options.liveEdit;
```

```bash
grep -rn "flyoNitroInstance\|flyoNitroIntegrationOptions" src/
```

`useConfigApi()`, `useEntitiesApi()`, `usePagesApi()`, `useSearchApi()`, `useSitemapApi()`
and `useVersionApi()` are unchanged in name, signature and behaviour.

## 1.5 — Middleware and cache headers 🟡

2.x injects `@flyo/nitro-astro/middleware.ts` with `order: "post"`. You do not create or
register anything, but two things are worth knowing.

**Your own middleware runs first.** With `order: "post"` the integration middleware is
_inner_: your `src/middleware.ts` executes, calls `next()`, and only then is
`locals.config` set. So this does not work:

```ts
// src/middleware.ts — locals.config is still undefined here
export const onRequest = defineMiddleware(async (context, next) => {
  const config = await context.locals.config; // ❌ undefined
  return next();
});
```

Read it after `next()`, or call `useConfigApi().config({ lang: context.currentLocale })`
yourself.

**Cache headers are new.** 1.x set none. When `liveEdit` is falsy, 2.x sets three headers on
every response:

| Header                     | Value                            |
| -------------------------- | -------------------------------- |
| `Cache-Control`            | `max-age=<clientCacheHeaderTtl>` |
| `CDN-Cache-Control`        | `max-age=<serverCacheHeaderTtl>` |
| `Vercel-CDN-Cache-Control` | `max-age=<serverCacheHeaderTtl>` |

Defaults are `clientCacheHeaderTtl: 900` (15 min) and `serverCacheHeaderTtl: 1200` (20 min).
If your project already manages caching — its own headers, a CDN config, `Cache-Control` set
in a route — reconcile this before deploying. Two ways out:

```js
// opt out via config (emits max-age=0, it does not omit the header)
flyoNitroIntegration({ clientCacheHeaderTtl: 0, serverCacheHeaderTtl: 0 });
```

```ts
// or overwrite in your own middleware, which wraps the integration's
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
});
```

**A dev toolbar app is also injected** (`@flyo/nitro-astro/toolbar.ts`) with links to Flyo
Cloud and the docs. Dev-only, nothing to do.

## 1.6 — Config options: new keys and one required key 🟡

`flyoNitroIntegration()` gained two options since 1.x, and three of the existing ones behave
differently. File: **`astro.config.mjs`**.

```diff
 flyoNitroIntegration({
   accessToken: FLYO_ACCESS_TOKEN,
   liveEdit: FLYO_LIVE_EDIT,
   componentsDir: "src/components/flyo",
   fallbackComponent: "BlockNotFound",
+  clientCacheHeaderTtl: 900,   // new in 2.0.0, optional
+  serverCacheHeaderTtl: 1200,  // new in 2.0.0, optional
   components: { … },
 })
```

- **`accessToken` is now enforced.** From 2.0.11 an empty or missing token throws
  `The Flyo Nitro Integration requires an accessToken` during `astro:config:setup` instead
  of failing later with confusing API errors. If you load it via `loadEnv`, make sure the
  variable is actually present in CI and in the deploy target, or the **build** fails.
- **`components` may now be omitted** (defaults to `{}`). It was required in 1.x.
- **`componentsDir` genuinely defaults to `src/components/flyo`** only from 2.0.10 on. In
  2.0.0–2.0.9 the default was computed but never handed to the Vite plugin, so a project
  that omitted the option resolved components against `undefined/…` and rendered nothing.
  Another reason not to stop at 2.0.x.

Optional, but this is what the 2.x docs recommend for 404s (needs Astro ≥ 4.13 and a
`src/pages/404.astro`):

```diff
- return new Response("Not Found", { status: 404, statusText: "Page Not Found" });
+ return Astro.rewrite("/404");
```

`Astro.rewrite` keeps the requested URL and renders your 404 route, where the 1.x pattern
returned a bare body with no layout. Functionally optional — the old `Response` still works.

## 1.7 — i18n is now driven by Astro 🟡

Because the middleware reads `context.currentLocale`, the locale you get from
`useConfig(Astro)` is whatever Astro resolved for the request. If your 1.x code passed a
language explicitly, that control is gone; configure it in **`astro.config.mjs`** instead:

```js
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
```

Flyo always prefixes the default language, so `prefixDefaultLocale: true` is required to
avoid mismatches — particularly with the Vercel adapter.

Entity detail pages are still hand-written and still need the language passed explicitly:

```ts
await useEntitiesApi().entityBySlug({
  slug,
  lang: Astro.currentLocale,
  typeId: 9999,
});
await useEntitiesApi().entityByUniqueid({
  uniqueid,
  lang: Astro.currentLocale,
});
```

## 1.8 — `FallbackComponent` is silent in production 🟡

1.x always rendered a red "Can't find `<component>`" box when a block had no matching
component. 2.x renders it **only when `liveEdit` is enabled**, and the message now names the
folder it searched.

If you relied on that box being visible on a production URL to spot unmapped blocks, you
now need `liveEdit` on, or your own `fallbackComponent`.

## 1.9 — Config is fetched per request 🟡

1.x cached the config in a module-level nanostore, so a long-running Node process kept
serving the config it fetched at boot until you restarted it (unless `liveEdit` was on). From
2.0.5 the cache is cleared at the start of every request, so content changes appear without
a restart — at the cost of one config request per uncached page view. The
`serverCacheHeaderTtl` CDN headers from step 1.5 are what keeps that off your origin in
production.

## 1.10 — Files to touch, at a glance

| File in your project              | What to change                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `package.json`                    | Bump `@flyo/nitro-astro` to `^2.4.3`; add `nanostores`/`@flyo/nitro-js-bridge` if used |
| `astro.config.mjs`                | Optional cache TTLs; confirm `accessToken` is non-empty; `i18n` block if multilingual  |
| `src/layouts/*.astro`             | `useConfig()` → `useConfig(Astro)`                                                     |
| `src/pages/**/*.astro`            | `useConfig()` → `useConfig(Astro)`; optionally `Astro.rewrite("/404")`                 |
| `src/pages/404.astro`             | Create it if you adopt `Astro.rewrite("/404")`                                         |
| `src/middleware.ts` (if you have) | Do not read `locals.config` before `await next()`; reconcile cache headers             |
| `src/components/flyo/*.astro`     | Nothing for 1.x → 2.0; see [2.0.x → 2.1.2](#20x--212-live-edit-moves-to-the-js-bridge) |
| `src/env.d.ts`                    | Optionally add `/// <reference path="../.astro/types.d.ts" />`                         |
| any `globalThis.flyoNitro*` usage | Replace with `useFlyoIntegration()`                                                    |

Unchanged, so you can leave them alone: component→file mapping and the `camelCase` key
resolution in the Vite plugin, the `/sitemap.xml` route, the image CDN service and its
`/thumb/{w}x{h}?format=` URL shape, and the props of `FlyoNitroPage`, `FlyoNitroBlock`,
`BlockSlot`, `MetaInfo`, `MetaInfoPage` and `MetaInfoEntity`.

## 1.11 — Search patterns for a mechanical pass

```bash
grep -rn "useConfig()"                       src/   # → useConfig(Astro)
grep -rn "useConfig(Astro.currentLocale)"    src/   # → useConfig(Astro)
grep -rn "flyoNitroIntegrationOptions"       src/   # → useFlyoIntegration().options
grep -rn "flyoNitroInstance"                 src/   # → useFlyoIntegration()
grep -rn "data-flyo-block-uid"               src/   # → data-flyo-uid
grep -rn "BlockSlots"                        src/   # → BlockSlot
grep -rn "nanostores"                        src/   # add to your own dependencies
grep -rn "astro add @flyo/nitro-astro"       .      # → npm install @flyo/nitro-astro
```

---

# 2.0.0 → 2.0.11 (patch-level correctness fixes)

⚪ Mostly packaging. Two entries matter if you are actually running a `2.0.x`:

- **2.0.10 — `componentsDir` default.** Before this, the resolved default was not passed to
  the Vite plugin: projects that omitted `componentsDir` got no components at all (every
  block fell through to the fallback). Either upgrade, or set `componentsDir` explicitly.
- **2.0.11 — `accessToken` is enforced** and the middleware stops throwing when the
  integration global is missing. See step 1.6.

Nothing to change in your source. Just `npm install @flyo/nitro-astro@latest`.

---

# 2.0.x → 2.1.2 (live edit moves to the JS bridge)

## The live-edit attribute was renamed 🔴

The attribute the injected script looks for changed in **2.1.0**:

```
data-flyo-block-uid   →   data-flyo-uid
```

`editableBlock()` emits the new attribute automatically, so **spread call sites keep
working**. What breaks is any place you wrote the attribute by hand:

```diff
- <div data-flyo-block-uid={block.uid}>
+ <div data-flyo-uid={block.uid}>
```

and any CSS or JS of your own that selected on it:

```diff
- document.querySelectorAll("[data-flyo-block-uid]")
+ document.querySelectorAll("[data-flyo-uid]")
```

```bash
grep -rn "data-flyo-block-uid" src/ public/
```

Symptom if you miss one: the element renders fine but is not clickable in the Flyo preview
frame.

## `editable()` replaces `editableBlock()` 🟢

**2.1.2** renamed the helper and kept the old name as an alias
(`export const editableBlock = editable`). No deprecation warning, no removal planned, so
this is cosmetic — but the docs and examples all use `editable` now:

```diff
- import { editableBlock } from "@flyo/nitro-astro";
- <div {...editableBlock(block)}>
+ import { editable } from "@flyo/nitro-astro";
+ <div {...editable(block)}>
```

## Never ship `2.1.0` 🔴

The 2.1.0 live-edit script imports `@flyo/nitro-js-bridge`, but 2.1.0's `package.json`
forgot to declare the dependency. Projects that did not already have the bridge in their
tree fail with `Failed to resolve import "@flyo/nitro-js-bridge"`. Fixed in **2.1.1**. Use
`>= 2.1.1`, or `^2.4.3` as recommended.

## Hand-rolled live-edit code should be deleted 🟡

Before 2.1.0 the injected script defined `window.openBlockInFlyo` and its own
`postMessage`/`pageRefresh` listeners inline. Those are gone; the bridge (`reload()`,
`highlightAndClick()`) provides them. If you copied any of that into your own project — a
`window.openBlockInFlyo` call, a `message` listener for `action: "pageRefresh"`, a
`postMessage` to `https://flyo.cloud` — remove it. It will double-fire against the bridge.

```bash
grep -rn "openBlockInFlyo\|pageRefresh\|flyo.cloud'" src/
```

---

# 2.1.x → 2.2.0 (WYSIWYG renderer)

🟢 Additive. New component `@flyo/nitro-astro/FlyoWysiwyg.astro` renders ProseMirror/TipTap
JSON, with per-node-type overrides.

Nothing breaks. But if your text blocks use `set:html` on `block.content.*.html`, this is
the version where you can switch to the structured JSON and get control over individual
nodes:

```diff
  ---
  import { editable } from "@flyo/nitro-astro";
+ import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
+ import Image from "./wysiwyg/Image.astro";
  const { block } = Astro.props;
  ---

  <div {...editable(block)}>
-   <div class="p-4" set:html={block.content.content.html} />
+   <div class="p-4">
+     <FlyoWysiwyg json={block.content.content.json} components={{ image: Image }} />
+   </div>
  </div>
```

Props: `json` (the node, an array of nodes, or a `doc` node) and `components` (a map of
node type → Astro component, each receiving a `node` prop). Unmapped node types are rendered
by the bridge's `wysiwyg()` helper. A custom node component looks like:

```astro
---
// src/components/flyo/wysiwyg/Image.astro
const { node } = Astro.props;
const { src, alt, title } = node.attrs;
---

<img src={src.source} alt={alt} title={title} style="max-width:100%;height:auto" />
```

`FlyoWysiwyg.astro` imports `wysiwyg` from `@flyo/nitro-js-bridge` and is compiled by _your_
Vite — so the bridge must be resolvable from your project. See step 1.2 if it is not.

---

# 2.2.x → 2.3.8 (DebugInfo and SEO meta tags)

## `DebugInfo.astro` 🟢

New in 2.3.0. Emits a single HTML comment with environment/deployment facts — useful for
telling deployments apart in the browser's "view source". Add it to your layout `<head>`:

```diff
  ---
  import { useConfig } from "@flyo/nitro-astro";
+ import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";
  ---
  <head>
+   <DebugInfo />
```

Output shape:

```html
<!-- liveedit:true | env:development | version:42 | versiondate:… | tokentype:develop | did:… | csha:… -->
```

It reads `MODE`, `VERCEL_DEPLOYMENT_ID`, `VERCEL_GIT_COMMIT_SHA` and `VERSION`, preferring
`import.meta.env` and falling back to `process.env` (that fallback arrived in 2.3.3, so on
2.3.0–2.3.2 runtime-only variables show as `-`). `tokentype` is derived from the token
prefix: `p-` → production, `d-` → develop.

Note it prints the access-token _type_, never the token. Nothing secret is emitted — but it
does disclose that the site is a Flyo Nitro site and which deployment it is, so leave it out
if you would rather not say.

## `MetaInfo` now rewrites the image URL 🟡

**Review this before deploying.** From 2.3.5, `MetaInfo` no longer passes the `image` prop
through verbatim — it appends a transformation:

| Tag                       | Before 2.3.5 | 2.3.6 onwards                        |
| ------------------------- | ------------ | ------------------------------------ |
| `og:image` / `name=image` | `image`      | `${image}/thumb/1200x630?format=jpg` |
| `twitter:image`           | `image`      | `${image}/thumb/1200x600?format=jpg` |

(2.3.5 used 1200x600 for all three; 2.3.6 split the Twitter size out.)

Consequences:

- **Pass the plain Flyo storage URL.** If you were already appending `/thumb/…` or a
  `?format=` query yourself, remove it — otherwise the value is concatenated twice and the
  URL 404s.
  ```diff
  - <MetaInfo image={`${page.meta_json.image}/thumb/1200x600?format=jpg`} slot="head" />
  + <MetaInfo image={page.meta_json.image} slot="head" />
  ```
- **Non-Flyo images stop working.** The suffix is appended unconditionally, so an image on
  your own domain or an external host becomes a broken URL. Emit those `og:image` tags
  yourself instead of via `MetaInfo`.
- `MetaInfoPage` and `MetaInfoEntity` forward `page.meta_json.image` /
  `entity.entity_image`, which are Flyo storage URLs — those are fine as-is.

## `MetaInfo` emits `og:url` and a canonical link 🟡

From 2.3.7, every `MetaInfo` render adds two unconditional tags built from `Astro.url.href`:

```
<meta property="og:url" content="…" />
<link rel="canonical" href="…" />
```

If your layout already emits a canonical link, you now have **two**, and search engines will
see conflicting hints. Remove yours, or stop using `MetaInfo` on those routes:

```bash
grep -rn 'rel="canonical"\|og:url' src/
```

Also be aware the value is the _requested_ URL, query string included. If you serve
tracking-parameter URLs, the canonical will carry them.

## Longer import spelling 🟢

2.3.8 added a second spelling for every component. Both
`@flyo/nitro-astro/BlockSlot.astro` (the original) and
`@flyo/nitro-astro/components/BlockSlot.astro` (new) now resolve to the same component.

Prefer the short form. Nothing to change.

---

# 2.3.x → 2.4.3 (scroll-to, handshake, and types)

## Bring the JS bridge along 🟡

2.4.0's live-edit script imports `scrollTo` from `@flyo/nitro-js-bridge`, which only exists
from bridge **1.3.0**, while 2.4.0 still declares `^1.2.0`. The editor handshake needs
**1.4.0**. The two are pinned in 2.4.1 (`^1.4.0`) and 2.4.2 (`^1.5.0`).

A fresh install resolves fine. A project with a **lockfile pinning bridge 1.2.x** and
nitro-astro 2.4.0 gets a live-edit script importing a non-existent export. So after
upgrading, check what you actually resolved:

```bash
npm ls @flyo/nitro-js-bridge     # must be >= 1.5.0
npm update @flyo/nitro-js-bridge # if it is older
```

Bridge exports by version, for reference:

| Bridge version | Adds                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| `1.1.x`        | `open`, `reload`, `wysiwyg`, `highlightAndClick`, `isEmbedded`, `resolveWindow` |
| `1.3.0`        | `scrollTo` — required by nitro-astro ≥ 2.4.0                                    |
| `1.4.0`        | `registerEditorHandshake`, `getEditorOrigin` — the connection announcement      |

Symptom of a too-old bridge on 2.4.x: the preview renders correctly but the Flyo editor
reports **"no connection to the live preview"**, and scroll-to-block does nothing.

## `scrollTo()` 🟢

2.4.0 wires `scrollTo()` in live-edit mode, so selecting a block in the Flyo editor scrolls
the preview to it. It works off the same `data-flyo-uid` attribute `editable()` already
emits — nothing to add, provided the
[attribute rename](#20x--212-live-edit-moves-to-the-js-bridge) is done.

## `TS2307: Cannot find module '…/BlockSlot.astro'` 🔴→fixed

Before 2.4.3, importing a component from this package raised `TS2307` in the IDE (and in
`tsc --noEmit` / `astro check`) for projects whose `tsconfig.json` did not extend
`astro/tsconfigs/*`, or that had no `tsconfig.json` at all. Those get `moduleResolution:
node10`, where TypeScript never reads `exports`. 2.4.3 ships a `typesVersions` fallback and
a declaration beside each shim, so the imports resolve under `bundler`, `node16`, `nodenext`
and `node10` alike.

If you worked around this locally, you can now remove the workaround:

```diff
- // @ts-expect-error - no types for .astro subpath exports
  import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
```

```diff
  // src/env.d.ts — delete if you added it only for this package
- declare module "*.astro" {
-   const c: (props: Record<string, any>) => any;
-   export default c;
- }
```

Deleting that ambient declaration is worth doing: while it is present it flattens the props
of **your own** components to `any`, so you lose type checking project-wide.

The recommended `tsconfig.json` remains:

```json
{ "extends": "astro/tsconfigs/strict" }
```

## Tarball contents ⚪

2.4.2 stopped shipping test sources and 15 unreferenced `.d.ts` files; 2.4.3 added
`components/*.astro.d.ts`. Public API unchanged. Nothing to do — listed only so a diff of
`node_modules` does not surprise you.

---

# Verification checklist

Run these after the upgrade. The `grep`, `npm ls` and build checks work offline; the `curl`
and live-edit ones need a running site and a Flyo project.

```bash
npm ls @flyo/nitro-astro @flyo/nitro-js-bridge @flyo/nitro-typescript
npx astro check      # or: npx tsc --noEmit
npx astro build
npx astro dev
```

- [ ] `npm ls` shows `@flyo/nitro-astro@2.4.3` (or newer) and `@flyo/nitro-js-bridge@1.5.0`
      (or newer), with no `UNMET DEPENDENCY`.
- [ ] `grep -rn "useConfig()" src/` and `grep -rn "useConfig(Astro.currentLocale)" src/`
      return nothing.
- [ ] `grep -rn "data-flyo-block-uid" src/ public/` returns nothing.
- [ ] `grep -rn "flyoNitroInstance\|flyoNitroIntegrationOptions" src/` returns nothing.
- [ ] `astro check` reports no `TS2307` from inside `node_modules/@flyo/nitro-astro`.
- [ ] The build does not fail with `The Flyo Nitro Integration requires an accessToken`
      (check the env var in CI and in the deploy target, not just locally).
- [ ] `astro.config.mjs` still has `output: "server"` and a `site` value (the latter is what
      `/sitemap.xml` builds absolute URLs from).
- [ ] A page renders its blocks — not the red "Can't find …" fallback. A wall of fallbacks
      means `componentsDir` or the `components` map is wrong.
- [ ] `curl -sI <url> | grep -i cache-control` shows the TTLs you expect, and no header of
      your own got clobbered.
- [ ] `curl -s <url> | grep -c 'rel="canonical"'` returns `1`, not `2`.
- [ ] `curl -s <url> | grep 'og:image'` yields a URL that actually loads.
- [ ] `/sitemap.xml` responds with XML and absolute URLs.
- [ ] With `liveEdit` enabled, the Flyo preview frame reports a live connection, blocks are
      clickable, and selecting a block in the editor scrolls the preview.

---

# Appendix A — the complete import surface of 2.4.x

Everything a consumer may import. There is no wildcard in `exports`, so nothing outside
this list is reachable even though it exists in the tarball.

**From the package root** — `import { … } from "@flyo/nitro-astro"`:

| Export                 | Kind     | Notes                                    |
| ---------------------- | -------- | ---------------------------------------- |
| `default`              | function | The integration, for `astro.config.mjs`  |
| `useConfig(astro)`     | async fn | 🔴 signature changed in 2.0.0            |
| `useConfigApi()`       | function |                                          |
| `useConfiguration()`   | function | Returns the SDK `Configuration`          |
| `useFlyoIntegration()` | function | New in 2.0.0 — `{ config, options }`     |
| `useEntitiesApi()`     | function |                                          |
| `usePagesApi()`        | function |                                          |
| `useSearchApi()`       | function |                                          |
| `useSitemapApi()`      | function |                                          |
| `useVersionApi()`      | function |                                          |
| `editable(block)`      | function | New name in 2.1.2; emits `data-flyo-uid` |
| `editableBlock(block)` | function | Alias of `editable`, kept for 1.x code   |
| `IntegrationOptions`   | type     |                                          |
| `FlyoIntegration`      | type     |                                          |

**Components** — `import X from "@flyo/nitro-astro/X.astro"` (or
`…/components/X.astro` since 2.3.8):

| Component           | Props                                     | Since |
| ------------------- | ----------------------------------------- | ----- |
| `FlyoNitroPage`     | `page`                                    | 1.x   |
| `FlyoNitroBlock`    | `block`, plus any extra props             | 1.x   |
| `BlockSlot`         | `slot`                                    | 1.x   |
| `MetaInfo`          | `title`, `description`, `image`, `jsonld` | 1.x   |
| `MetaInfoPage`      | `page`                                    | 1.x   |
| `MetaInfoEntity`    | `response`                                | 1.x   |
| `FallbackComponent` | `block`                                   | 1.x   |
| `FlyoWysiwyg`       | `json`, `components`                      | 2.2.0 |
| `DebugInfo`         | none                                      | 2.3.0 |

**Entrypoints wired up by the integration** — you never import these yourself:
`@flyo/nitro-astro/cdn.ts` (image service), `middleware.ts` (config + cache headers),
`sitemap.ts` (the `/sitemap.xml` route), `toolbar.ts` (dev toolbar app).

# Appendix B — a minimal 2.4.x reference project

The shape a fully migrated project should have. Compare against
[playground/](playground/) in this repository for a working version.

**`astro.config.mjs`**

```js
import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import flyoNitroIntegration from "@flyo/nitro-astro";

const { FLYO_ACCESS_TOKEN, FLYO_LIVE_EDIT } = loadEnv(
  process.env.NODE_ENV,
  process.cwd() + "/",
  ""
);

export default defineConfig({
  site: "https://myflyowebsite.com", // required for /sitemap.xml
  output: "server", // required — the integration needs SSR
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN, // required, throws if empty
      liveEdit: FLYO_LIVE_EDIT, // dev + preview only
      componentsDir: "src/components/flyo",
      components: {
        Text: "Text",
        CardsGrid: "CardsGrid",
        SlotContainer: "subfolder/SlotContainer",
      },
      // fallbackComponent: "BlockNotFound",
      // clientCacheHeaderTtl: 900,
      // serverCacheHeaderTtl: 1200,
    }),
  ],
});
```

**`src/pages/[...slug].astro`**

```astro
---
import Layout from "../layouts/Layout.astro";
import { usePagesApi, useConfig } from "@flyo/nitro-astro";
import FlyoNitroPage from "@flyo/nitro-astro/FlyoNitroPage.astro";
import MetaInfoPage from "@flyo/nitro-astro/MetaInfoPage.astro";

const slug = Astro.params.slug ?? "";
const config = await useConfig(Astro);

if (!config.pages.includes(slug)) {
  return Astro.rewrite("/404");
}

let page;
try {
  page = await usePagesApi().page({ slug });
} catch (e) {
  return Astro.rewrite("/404");
}
---

<Layout title={page.title}>
  <MetaInfoPage page={page} slot="head" />
  <FlyoNitroPage page={page} />
</Layout>
```

**`src/layouts/Layout.astro`**

```astro
---
import { useConfig } from "@flyo/nitro-astro";
import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";

const config = await useConfig(Astro);
const { title } = Astro.props;
---

<!doctype html>
<html lang={Astro.currentLocale}>
  <head>
    <DebugInfo />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**`src/components/flyo/Text.astro`**

```astro
---
import { editable } from "@flyo/nitro-astro";
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
import Image from "./wysiwyg/Image.astro";

const { block } = Astro.props;
---

<div {...editable(block)}>
  <FlyoWysiwyg json={block.content.content.json} components={{ image: Image }} />
</div>
```

**`tsconfig.json`** — extending an Astro preset is what gives you `exports`-aware module
resolution:

```json
{ "extends": "astro/tsconfigs/strict" }
```

**`.env`**

```bash
FLYO_ACCESS_TOKEN=d-your-development-token
FLYO_LIVE_EDIT=true
```

For the full API and component documentation, see [lib/README.md](lib/README.md).
