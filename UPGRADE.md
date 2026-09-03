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

## Upgrading from 2.5 to 2.6

**Remove `camelcase` from your `package.json` if you added it.** Up to 2.5 `FlyoNitroBlock.astro` imported it without this package declaring it, so the build only worked where npm hoisted the copy `astro` pulls in transitively. Installs that do not hoist — pnpm, Yarn PnP, a future Astro without that dependency — failed with `Failed to resolve import "camelcase"`, and adding it by hand was the workaround. 2.6 needs nothing:

```diff
  "dependencies": {
-   "camelcase": "^8.0.0",
    "@flyo/nitro-astro": "^2.6.0"
  }
```

**Component matching is unchanged for every name that resolved before.** The keys of the `components` option are still matched against the block's `component` name ignoring casing and separators, so `HeroImage`, `heroImage`, `hero_image` and `hero-image` still address the same component. What changed is the normalization behind it — one local function instead of camelCase — and every pair of names the old one treated as equal is still treated as equal.

**Two option keys that differ only in casing or separators are now a build error.** They were distinguishable before (`heroimage` and `HeroImage` became two separate exports), but nothing could tell which of the two an incoming block meant. Rename one:

```diff
  components: {
-   heroimage: "HeroImageLegacy",
+   HeroImageLegacy: "HeroImageLegacy",
    HeroImage: "HeroImage",
  }
```

The error names both keys. If your `components` map has no such pair — the normal case — there is nothing to do.

**A component name that is not a valid JavaScript identifier now works.** An option key was written straight into a generated `export { default as … }`, so one starting with a digit (`2cols`) or containing a character camelCase did not fold away (`hero/block`, `hero!block`) broke the build with a syntax error in a virtual module. Keys are data now, so any name Flyo can send is registrable. Spaces, dots, dashes and underscores were never affected.

**A block whose `component` collides with an `Object.prototype` member renders the fallback.** `constructor`, `toString` and `valueOf` previously resolved to the prototype member and rendered whatever Astro made of it.

**`virtual:flyo-components` changed shape.** It is internal — `FlyoNitroBlock.astro` is its only consumer — but if you imported it yourself, it went from one named export per component to a default export:

```diff
- import * as components from "virtual:flyo-components";
- const Component = components[key] ?? components.fallback;
+ import registry from "virtual:flyo-components";
+ const Component = registry.components[key] ?? registry.fallback;
```

**New export `@flyo/nitro-astro/componentKey`** for computing the same key yourself, should you index blocks by component name:

```ts
import { componentKey } from "@flyo/nitro-astro/componentKey";

componentKey("HeroImage"); // "heroimage"
componentKey("hero_image"); // "heroimage"
```

## Upgrading from 2.6 to 2.7

Nothing to change in your project. Two things about the injected `/sitemap.xml` are worth knowing.

**Every entry now carries a `<lastmod>`**, taken from the `updated_at` timestamp the API delivers per item. For pages that is the last time the delivered content actually changed, so a rebuild producing identical output does not move it. Entries the API reports without a usable timestamp are listed without the element.

**Locations come from the `href` the API resolved**, for pages and entities alike, instead of being rebuilt from `entity_slug` and `routes.detail`. If you compared the generated sitemap against a stored copy, expect the paths of entries whose resolved `href` differs from their raw slug to change — language-prefixed urls in a multi-lingual setup, most notably. Entities without a resolved `href` are no longer listed.

**Dependencies:** `@flyo/nitro-typescript` moved to `^1.5.0`, which is the version whose sitemap model carries `href` and `updated_at`. If you import models from it yourself, note that the unused `BlockSlot` and `PageProperty` interfaces are gone — `BlockSlotValue` and `PagePropertyValue`, the ones `Block.slots` and `Page.properties` actually use, are unchanged.

## Upgrading from 2.7 to 2.8

Nothing to change in your project. Both items are about the `<head>` your pages ship.

**`MetaInfoPage` emits the page JSON-LD.** The page endpoint returns a `jsonld` object with schema.org information about the page, the same way the entity endpoint does, but only `MetaInfoEntity` ever rendered it. Pages now ship a `<script type="application/ld+json">` too, built from `page.jsonld`. If you were rendering that script yourself next to `MetaInfoPage`, remove it or you will ship two. Pages the API delivers without `jsonld` emit nothing, as before.

**Page meta images work again.** `@flyo/nitro-typescript` moved to `^1.6.0`. In `1.5.0` — the version 2.6 and 2.7 depended on — `meta_json.image` was deserialized to an empty object no matter what the API sent, so `MetaInfoPage` shipped no `og:image` or `twitter:image` for any page. `1.6.0` deserializes the value correctly and the tags come back. Entity meta images were never affected, and nothing about the emitted markup changed apart from the tags now being present.

The value that arrives is a URL string when a meta image is set and `false` when none is, so `MetaInfo` selects the source by type rather than by truthiness. If you pass `image` to `MetaInfo` yourself, both are accepted; anything that is not a non-empty string renders no image tags.

## Upgrading from 2.8 to 2.9

The integration keeps working as it is: every existing call site compiles and behaves as before. Two things are worth doing — two lines per entity detail route so **draft links** are not cached, and an audit of your own SDK annotations, if you have any.

**Dependencies:** `@flyo/nitro-typescript` moved from `^1.6.0` to `^2.2.0`, regenerated against OpenAPI document 2.35 (was 2.29) and later; `2.1.0` added `Entity.canonical`, `2.2.0` the `is_indexable` flag described below. No endpoint, parameter or request shape changed. `Entity` gained `is_draft` and `draft_expires_at`, `/sitemap` got a response model of its own, and the model details below carry over from the `1.7.0` step that this release skips.

**Turn caching off for a draft link on entity detail routes.** A draft link is a shareable, expiring snapshot of an entity that is still offline in Flyo, requested through `entityBySlug()` and `entityByUniqueid()` with an opaque token in place of the slug or the unique id. `is_draft` is `true` on such a response and `draft_expires_at` holds the Unix timestamp at which the link stops working; after that the same URL answers 404.

Because a draft is private and expires, no cache may keep a copy of it — the CDN would serve the snapshot to everyone and the browser would keep answering after the link had expired. The new `disableCache()` says so for the current request:

```diff
  const response = await useEntitiesApi().entityBySlug({ slug, typeId: 9999 });
+
+ if (response.is_draft) {
+   disableCache(Astro);
+ }
```

`useEntitiesApi()` and every other `use*Api()` function is unchanged. `disableCache()` marks the request, and the middleware then answers it with `Cache-Control: private, no-store, max-age=0, must-revalidate` plus `CDN-Cache-Control: no-store` and `Vercel-CDN-Cache-Control: no-store` instead of the configured TTLs. It is a no-op for a published entity, where `is_draft` is `false`.

Two details about where it goes:

```ts
import { disableCache } from "@flyo/nitro-astro";

disableCache(Astro); // in the page frontmatter, not in a nested component
```

It has to run while the frontmatter runs, which is where the response is assembled — a nested component renders after the middleware has written the headers. And it is not entity-specific: use it for a personalised page, a response built from a cookie, or an entity fetched through the raw `entityBySlugRaw()` methods.

Two more things a detail route needs for draft links to resolve at all, both of them yours to decide:

- **Do not pass `typeId` when the parameter is a draft token.** The token is not a slug the type filter applies to, so a typed lookup misses the draft. Either drop `typeId` on that route or retry the lookup once without it when it fails.
- **Let the token past your own slug validation.** It looks like neither a slug nor a unique id, so a route that matches the parameter against a pattern rejects it.

`MetaInfoEntity` now renders `<meta name="robots" content="noindex, nofollow">` when `is_draft` is `true`, so a leaked preview URL stays out of the search index. Regular entity responses are unaffected. Note that it only touches the markup — the caching decision stays in the route, where the response is still being assembled.

**The sitemap moved off the entity model.** `/sitemap` used to reuse the entity/search model; 2.35 gives it its own "Sitemap Item" schema, so `SitemapApi.sitemap()` returns `SitemapinterfaceInner[]` instead of `EntityinterfaceInner[]` (`sitemapRaw()` likewise). The injected `/sitemap.xml` route reads only `href` and `updated_at`, which are both on the new model, so there is nothing to change unless you generate a sitemap yourself.

If you do, `entity_title`, `entity_teaser`, `entity_image`, `entity_time_start` and `entity_type_id` are gone from a sitemap entry — read them from `SearchApi.search()` or the entities endpoints instead. And drop any explicit annotation on the result: every property of both models is optional, so `SitemapinterfaceInner` is still assignable to `EntityinterfaceInner` and an annotated result keeps compiling while the dropped fields silently read `undefined`.

```diff
- const items: EntityinterfaceInner[] = await useSitemapApi().sitemap({});
+ const items = await useSitemapApi().sitemap({});
  items.map((item) => `<url><loc>${base}${item.href}</loc></url>`);
```

`entity_type`, `entity_slug` and `routes` are still on the sitemap item, still populated and still typed as before, but marked `@deprecated`: `href` is the resolved URL for pages and mapped entities alike, and the endpoint omits entries it cannot resolve one for. Nothing errors today; migrate URL assembly to `href` before the next major spec bump.

`SearchApi.search()` still returns `EntityinterfaceInner[]` — that model is unchanged and not deprecated. Only the sitemap moved off it.

**Two model details carry over from the skipped `1.7.0`,** and only matter if you annotate types against the SDK yourself.

**The `Routes` model is gone.** `routes` used to point at a named `Routes` schema, which 2.30 inlines, so the SDK no longer exports `Routes`, `RoutesFromJSON`, `RoutesToJSON` or `instanceOfRoutes`. Importing the type stops compiling — replace the annotation with the inline type it stood for:

```diff
- import type { Routes } from "@flyo/nitro-typescript";
- function firstRoute(routes: Routes) { … }
+ function firstRoute(routes: { [key: string]: any }) { … }
```

**`routes` is now `{ [key: string]: any }`** on both `EntityInterface` and `EntityinterfaceInner`. On `EntityInterface` it was declared as a map of strings, which was wrong: the map always carries the boolean `_empty` key next to the URL paths, so `routes._empty` no longer needs a cast to be read as a boolean. Reading a path by name — `item.link.routes.detail`, the way the block examples do — still type-checks and still gives you a string. What you lose is `string` inference when the key is dynamic, so narrow there:

```ts
const path = entity.routes?.[key];
if (typeof path !== "string") return undefined;
```

**Non-indexable content emits `noindex` on its own.** `@flyo/nitro-typescript` moved to `^2.2.0`, which adds `is_indexable` to `Page` (`0` when the page is kept out of the index) and to `Entity` (`false` when every page placing the entity's content pool is non-indexable). `MetaInfoPage` and `MetaInfoEntity` render `<meta name="robots" content="noindex">` for such content without any configuration; a draft still renders `noindex, nofollow`, and never both tags. The flag is not access control — the page or entity is delivered and stays reachable by URL, it is only kept out of the sitemap, the search endpoint and the index. Remove your own robots tag if you were deriving one from the same flag. Content the API reports without `is_indexable` is treated as indexable, exactly as before.

`MetaInfo` takes the directive as a `robots` prop for the same purpose: `<MetaInfo robots="noindex" … />` renders the tag verbatim, omitting it renders none.

Deserialization is unchanged but for one case: when the API sends an explicit `"_empty": null`, `1.6.0` dropped the key while `1.7.0` and `2.0.0` keep the `null`. Compare with `routes._empty == null` if you want to treat a missing and a null value alike. The same holds for the new draft fields — `is_draft: false` survives deserialization and an explicit `draft_expires_at: null` is kept as `null` rather than dropped, so use `draft_expires_at == null` if you mean "either".

For the full API and component reference see [README.md](README.md).

(publish workflow changed)