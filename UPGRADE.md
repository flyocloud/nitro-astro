# UPGRADE

This guide is written for both humans and AI coding agents. Steps are explicit enough to follow by hand and precise enough to apply programmatically.

## Upgrading from 1.x to 2.0

In 1.x every call site fetched the config itself. In 2.0 an injected middleware resolves it once per request and puts it on `Astro.locals.config`. Most of the following follows from that.

Install with `npm install @flyo/nitro-astro` — the `astro add` command from the 1.x docs no longer applies. Go to at least `2.0.11`: before `2.0.10` the `componentsDir` default was never passed to the Vite plugin, so a project that omitted the option renders no blocks at all.

**`useConfig()` takes the Astro context.** The language parameter is gone. Change every call site (usually `src/layouts/*.astro` and pages):

```diff
- const config = await useConfig();
- const config = await useConfig(Astro.currentLocale);
+ const config = await useConfig(Astro);
```

In an endpoint, pass the context object instead: `await useConfig(context)`.

Two consequences: the config is not available in `getStaticPaths()`, and the language now comes from `Astro.currentLocale`, so Astro's `i18n` config is the only place to set it. Flyo always prefixes the default language, so use `routing: { prefixDefaultLocale: true }`.

**`globalThis.flyoNitroInstance` changed shape.** It was the `Configuration`; it is now `{ config, options }`, and `globalThis.flyoNitroIntegrationOptions` is gone:

```diff
- const liveEdit = globalThis.flyoNitroIntegrationOptions.liveEdit;
+ import { useFlyoIntegration } from "@flyo/nitro-astro";
+ const liveEdit = useFlyoIntegration().options.liveEdit;
```

`useConfiguration()` and all `use*Api()` functions are unchanged.

**Cache headers are new.** When `liveEdit` is falsy the middleware sets `Cache-Control` (`clientCacheHeaderTtl`, default 900) plus `CDN-Cache-Control` and `Vercel-CDN-Cache-Control` (`serverCacheHeaderTtl`, default 1200). 1.x set none. If you manage caching yourself, set both options to `0` or overwrite the headers in your own middleware.

**Your own middleware runs before the integration's** (it is added with `order: "post"`), so `context.locals.config` is not set until after `await next()`.

**`accessToken` is enforced** from `2.0.11` — an empty value throws during `astro:config:setup`, so a missing env var now fails the build.

**`FallbackComponent` only renders when `liveEdit` is enabled.** In 1.x the red "component not found" box also appeared in production.

**Dependencies:** `nanostores` is no longer pulled in — add it to your own `package.json` if you import it. `@flyo/nitro-typescript` moved to `^1.1.0`, which renamed the `BlockSlots` model to `BlockSlot`.

## Upgrading from 2.0 to 2.1

Use `2.1.1` or newer. `2.1.0` imports `@flyo/nitro-js-bridge` without declaring it as a dependency and fails with `Failed to resolve import "@flyo/nitro-js-bridge"`.

**The live edit attribute was renamed** from `data-flyo-block-uid` to `data-flyo-uid`. `editableBlock()` emits the new name automatically, so only hand-written attributes and your own selectors break:

```diff
- <div data-flyo-block-uid={block.uid}>
+ <div data-flyo-uid={block.uid}>
```

**`editable()` replaces `editableBlock()`**, which stays available as an alias:

```diff
- import { editableBlock } from "@flyo/nitro-astro";
- <div {...editableBlock(block)}>
+ import { editable } from "@flyo/nitro-astro";
+ <div {...editable(block)}>
```

**Live edit now runs through `@flyo/nitro-js-bridge`.** The inline `window.openBlockInFlyo` helper and the `pageRefresh` message listener are gone. If you copied either into your project, remove it — it double-fires against the bridge.

## Upgrading from 2.1 to 2.2

New component `FlyoWysiwyg.astro` renders ProseMirror/TipTap JSON with per-node overrides. Nothing breaks; switch your text blocks from `set:html` if you want control over individual nodes:

```diff
+ import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
+ import Image from "./wysiwyg/Image.astro";

- <div class="p-4" set:html={block.content.content.html} />
+ <FlyoWysiwyg json={block.content.content.json} components={{ image: Image }} />
```

A custom node component receives the node as a `node` prop. Node types you do not map are rendered by the bridge.

## Upgrading from 2.2 to 2.3

**`MetaInfo` now rewrites the `image` prop** into `${image}/thumb/1200x630?format=jpg` (`1200x600` for `twitter:image`). Pass the plain Flyo storage URL — if you were appending `/thumb/…` yourself, remove it, and emit `og:image` yourself for images not hosted on Flyo. `MetaInfoPage` and `MetaInfoEntity` are unaffected.

**`MetaInfo` also emits `og:url` and `<link rel="canonical">`** from `Astro.url.href` on every render. Remove your own canonical link or you will ship two.

New component `DebugInfo.astro` prints an HTML comment with environment, deployment and API version. Add it to your layout `<head>` if you want it:

```diff
+ import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";
+ <DebugInfo />
```

Components can now also be imported as `@flyo/nitro-astro/components/X.astro`. The short path keeps working.

## Upgrading from 2.3 to 2.4

**Update the JS bridge along with the package.** Live edit calls `scrollTo()`, which needs `@flyo/nitro-js-bridge` `1.3.0`, and the editor connection handshake needs `1.4.0`. A fresh install is fine, but a lockfile pinning an older bridge produces a live edit script importing an export that does not exist:

```bash
npm ls @flyo/nitro-js-bridge     # expect >= 1.5.0
npm update @flyo/nitro-js-bridge
```

Symptom of a stale bridge: the preview renders, but the Flyo editor reports no connection to the live preview and scroll-to-block does nothing.

**Use `2.4.3` or newer if you import components.** Earlier versions raised `TS2307: Cannot find module '@flyo/nitro-astro/BlockSlot.astro'` in projects whose `tsconfig.json` did not extend `astro/tsconfigs/*`. If you added an ambient `declare module "*.astro"` to work around it, delete it — it flattens the props of your own components to `any`.

## Upgrading from 2.4 to 2.5

**The CDN image service emits query parameters instead of the `/thumb/` path.** `<Image width={800} height={600} />` now renders `https://storage.flyo.cloud/<image>?w=800&h=600&format=webp` instead of `…/thumb/800x600?format=webp`, and `MetaInfo` builds `?w=1200&h=630&format=jpg` for `og:image` (`h=600` for `twitter:image`). Nothing to change in your project — the rendered markup differs, the images do not. Update snapshot tests and any assertion matching `/thumb/`, and expect cold caches on the first deploy since every image URL changes.

The reason is the CDN itself: `/thumb/{width}x{height}` is deprecated (removal announced for 06.08.2028) and the `/filter/…` variants were removed on 06.08.2026. If you build storage URLs by hand anywhere — hero backgrounds, e-mail templates, `<link rel="preload">`, custom `og:image` tags — migrate them:

```diff
- https://storage.flyo.cloud/image_xxx.jpg/thumb/300x300
+ https://storage.flyo.cloud/image_xxx.jpg?w=300&h=300

- https://storage.flyo.cloud/image_xxx.jpg/thumb/300xnull
+ https://storage.flyo.cloud/image_xxx.jpg?w=300

- https://storage.flyo.cloud/image_xxx.jpg/thumb/nullx300
+ https://storage.flyo.cloud/image_xxx.jpg?h=300

- https://storage.flyo.cloud/image_xxx.jpg/filter/300x300
+ https://storage.flyo.cloud/image_xxx.jpg?w=300&h=300
```

A dynamic side is expressed by leaving the parameter out — `w=0`, `w=` and `w=null` answer with HTTP 400. Oversized values are capped by the CDN, and `format` without `w` or `h` is ignored, so a bare URL always returns the original file.

**New export `flyoImageUrl(src, options)`** for the places `<Image />` cannot reach:

```ts
import { flyoImageUrl } from "@flyo/nitro-astro";

flyoImageUrl(image, { width: 1200, height: 630, format: "jpg" });
// https://storage.flyo.cloud/<image>?w=1200&h=630&format=jpg
```

It adds the CDN host when missing, drops invalid dimensions and replaces `w` / `h` / `format` already present on the URL. Limits such as the maximum dimension stay with the CDN, so a change there needs no release here.

For the full API and component reference see [README.md](README.md).
