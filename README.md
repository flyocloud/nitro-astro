# Flyo Nitro for Astro

<p align="center">
  <img src="https://storage.flyo.cloud/12_K6uT5tY4TwXRL3_flyo-logo-colored.png" alt="Flyo" width="140" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg" alt="Astro" width="120" />
</p>

Connect the **Flyo Nitro** headless content hub to your [Astro](https://astro.build) project. Pages are composed of CMS-driven blocks, plus entities and containers, rendered by your own Astro components — with live editing, image CDN, sitemap and caching wired up by the integration.

> **⚠️ Important:** This integration requires an **SSR setup** (`output: "server"` in `astro.config.mjs`) and a matching [Astro adapter](https://docs.astro.build/en/guides/on-demand-rendering/) for deployment. It does not work with a fully static build, because pages and configuration are resolved per request.

<details>
<summary><strong>AI coding agent instructions — Astro integration</strong></summary>

The file [ai-instructions-astro.md](ai-instructions-astro.md) contains a complete advisory for integrating Flyo Nitro CMS into an **existing Astro project** using `@flyo/nitro-astro`.

It is written to be pasted directly into a coding agent (Claude, Copilot, Cursor, etc.) as a system prompt or task description.

**Copy the raw instructions:**

- GitHub raw URL: `https://raw.githubusercontent.com/flyocloud/nitro-astro/refs/heads/main/ai-instructions-astro.md`
- Or open [ai-instructions-astro.md](ai-instructions-astro.md) and use the **Raw** button.

The advisory covers:

- Package installation and `astro.config.mjs` setup (SSR, adapter, integration options)
- Environment variables and access token handling
- TypeScript type generation from the Flyo OpenAPI schema
- Layout `Header` and `Footer` components driven by Flyo containers
- The catch-all `src/pages/[...slug].astro` route
- WYSIWYG wrapper component and the built-in `astro:assets` CDN image handling
- A reusable Claude skill (`.claude/skills/flyo-block/SKILL.md`) for building a named block from a design or existing component
- Entity detail pages, i18n and sitemap
- A final validation checklist

</details>

## Usage

### 1. Installation

```bash
npm install @flyo/nitro-astro
# yarn add @flyo/nitro-astro
```

You also need an SSR adapter for your target platform, for example:

```bash
npx astro add node
# npx astro add vercel
# npx astro add netlify
```

### 2. Configuration

Register the integration in `astro.config.mjs`:

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
  site: "https://myflyowebsite.com", // required to make the sitemap.xml work
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN, // switch between dev and prod tokens depending on the environment
      liveEdit: FLYO_LIVE_EDIT, // enable on dev and preview systems for application reloading in the Flyo preview frame upon changes
      components: {
        // Where the Flyo components are located. The suffix .astro is not required.
        // The object key is the component name from Flyo, the value is the component
        // inside the Astro components folder.
        // [!] Adding new elements requires restarting the development process
        FlyoElementName: "AstroElementName",
        AnotherFlyoElement: "subfolder/AnotherFlyoElement",
      },
    }),
  ],
  output: "server",
});
```

Store the token in `.env` (never commit real tokens):

```bash
# .env
FLYO_ACCESS_TOKEN=your_token_here
FLYO_LIVE_EDIT=true
```

For production:

```bash
FLYO_ACCESS_TOKEN=your_production_token
FLYO_LIVE_EDIT=false
```

> `accessToken` is enforced — an empty value throws during `astro:config:setup`, so a missing env var fails the build instead of rendering an empty site.

### 3. Configuration Options

The `flyoNitroIntegration()` function accepts the following options:

#### Required

- **`accessToken`** (string) — Your Flyo access token. Either the production or the development token from the Flyo Cloud interface. Requests made with a production token are effectively cached by the Flyo CDN; development token requests are not cached.

- **`components`** (object) — Component map where the key is the component name defined in the Flyo interface and the value is the component inside `componentsDir`. The `.astro` suffix is not required.

  ```js
  components: {
    Text: "Text",
    CardsGrid: "CardsGrid",
    SlotContainer: "subfolder/SlotContainer",
  }
  ```

  The key is matched against the block's `component` name ignoring casing and separators, so `HeroImage`, `heroImage` and `hero_image` all address the same component. Two keys that differ only in those — `HeroImage` and `hero_image` side by side — are rejected at build time, because nothing could tell which of the two a block meant.

#### Optional

- **`liveEdit`** (string | boolean | number, default `false`) — Enables live editing mode. The application reloads when changes are made in the Flyo preview frame. Enable it on dev and preview systems, disable it in production.

- **`componentsDir`** (string, default `"src/components/flyo"`) — Directory where your Flyo block components live.

- **`fallbackComponent`** (string, optional) — Name of a fallback component used when a requested component is not found. Only rendered in live edit mode. `"BlockNotFound"` references `{componentsDir}/BlockNotFound.astro`.

- **`clientCacheHeaderTtl`** (number, default `900`) — TTL for client-side cache headers in seconds. Only applied when `liveEdit` is disabled. Use `0` to disable client caching.

- **`serverCacheHeaderTtl`** (number, default `1200`) — TTL for server/CDN cache headers in seconds. Only applied when `liveEdit` is disabled. Use `0` to disable server caching.

#### Complete example

```js
export default defineConfig({
  site: "https://myflyowebsite.com",
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN,
      liveEdit: FLYO_LIVE_EDIT,
      componentsDir: "src/components/flyo",
      fallbackComponent: "BlockNotFound",
      clientCacheHeaderTtl: 600, // 10 minutes
      serverCacheHeaderTtl: 1800, // 30 minutes
      components: {
        Text: "Text",
        CardsGrid: "CardsGrid",
        SlotContainer: "SlotContainer",
      },
    }),
  ],
  output: "server",
});
```

### 4. Setup Layout

The integration adds a middleware that resolves the Flyo config once per request and puts it on `Astro.locals.config`. Read it with `useConfig(Astro)` — typically in `src/layouts/Layout.astro` — to build your navigation:

```astro
---
import { useConfig } from "@flyo/nitro-astro";
import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";

const config = await useConfig(Astro);
const { title } = Astro.props;
const currentPath = Astro.url.pathname;
---

<!doctype html>
<html lang={config.nitro?.language ?? "en"}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <DebugInfo />
    <!-- Auto-inject meta information for pages and entities -->
    <slot name="head" />
  </head>
  <body>
    <header>
      <nav>
        {
          config.containers.nav.items.map((item: any) => (
            <a
              href={item.href}
              target={item.target}
              class={currentPath === item.href ? "is-active" : ""}
            >
              {item.label}
            </a>
          ))
        }
      </nav>
    </header>
    <div class="container">
      <slot />
    </div>
  </body>
</html>
```

The `<slot name="head" />` is what makes `MetaInfoPage` / `MetaInfoEntity` work from inside a page — see the next step.

> `useConfig()` takes the Astro context (`Astro` in a component, `context` in an endpoint). Because the config is resolved in the middleware, it is **not** available inside `getStaticPaths()`.

### 5. Create the Catch-all Page Route

Add `src/pages/[...slug].astro` as the catch-all CMS handler. It resolves the slug against the routing table in the config, fetches the page and renders all its blocks:

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

`FlyoNitroPage` iterates `page.json` and renders each block through `FlyoNitroBlock`, which looks up the matching component from your `components` map.

If you need the page data for custom logic, keep using `page` directly — it holds `page.title`, `page.meta_json`, `page.properties`, `page.breadcrumb`, `page.translation` and the block array `page.json`.

### 6. Generate Block Types

Flyo can generate fully typed TypeScript definitions for **every block, entity and container** in your Nitro project straight from the OpenAPI schema. This gives you autocomplete and type-safety when building components.

Add a `flyo:types` script to your `package.json`:

```json
{
  "scripts": {
    "flyo:types": "npx -y openapi-typescript@latest 'https://api.flyo.cloud/nitro/v1/openapi/schemas?token=<YOUR_TOKEN>' -o ./src/generated/flyo.ts --root-types --root-types-no-schema-prefix --export-type"
  }
}
```

Replace `<YOUR_TOKEN>` with your Flyo develop token. Then run:

```bash
npm run flyo:types
```

This writes `./src/generated/flyo.ts` containing a type for each of your blocks (for example `BlockHero`, `BlockText`, …), as well as your entities and containers.

What the flags do:

- `--root-types` / `--root-types-no-schema-prefix` — export each schema as a top-level type alias (e.g. `BlockHero`) instead of nesting it under `components['schemas']`.
- `--export-type` — emit `export type` aliases so you can import them directly.

> **Tip:** Re-run `npm run flyo:types` whenever you add or change block fields in the Nitro CMS so your types stay in sync. You can either commit the generated file or add it to `.gitignore` and regenerate it in CI.

Now you can type a component's `block` prop with the exact generated type instead of the generic `Block`:

```astro
---
import { editable } from "@flyo/nitro-astro";
import type { BlockHero } from "../../generated/flyo";

interface Props {
  block: BlockHero;
}

const { block } = Astro.props;
---

<section {...editable(block)}>
  <h2>{block.content?.title}</h2>
  <p>{block.content?.teaser}</p>
</section>
```

Using the generated `BlockHero` type gives you autocomplete on `block.content.*` and catches typos at build time (`astro check`). The next sections use the generic `Block` type for simplicity, but you can swap in a generated type anywhere a block is rendered.

### 7. Create Custom Block Components

Block components are the building blocks of your Flyo pages. They live in `componentsDir` (default `src/components/flyo`) and receive a `block` prop containing all data from Flyo.

`src/components/flyo/Text.astro`:

```astro
---
import { editable } from "@flyo/nitro-astro";
const { block } = Astro.props;
---

<!-- Make the block editable in the Flyo live editor -->
<div {...editable(block)}>
  <div set:html={block.content.content.html} />
</div>
```

The `editable()` helper spreads the `data-flyo-uid` attribute onto your root element, which is what the live editor uses to highlight the block and open it for editing.

Register the component in `astro.config.mjs`, where the key is the Flyo component name:

```js
components: {
  Text: "Text",
}
```

> Adding a new entry to `components` requires restarting the dev server.

A richer block with items and images:

```astro
---
import { Image } from "astro:assets";
import { editable } from "@flyo/nitro-astro";
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
const { block } = Astro.props;
---

<div {...editable(block)}>
  <!-- Content variable -->
  <div set:html={block.content.content.html} />

  <!-- Handling items -->
  {
    block.items.map((item: any) => (
      <div>
        {item.title}
        <a href={item.link.routes.detail}>Go to Detail</a>
      </div>
    ))
  }

  <!-- Image through the Flyo CDN image service -->
  <Image
    src={block.content.image.source}
    alt={block.content.alt ?? ""}
    width={1920}
    height={768}
  />

  <!-- Nested blocks -->
  <BlockSlot slot={block.slots.mysuperslotname} />
</div>
```

A cards grid (`src/components/flyo/CardsGrid.astro`):

```astro
---
import { Image } from "astro:assets";
import { editable } from "@flyo/nitro-astro";
const { block } = Astro.props;
---

<div {...editable(block)}>
  {
    block.items.map((item: any) => (
      <div class="card">
        <h2>{item.title}</h2>
        {item.image && (
          <Image
            src={item.image.source}
            alt={item.title}
            width="200"
            height="200"
          />
        )}
        <a href={item.link.routes.detail}>Go to Detail</a>
      </div>
    ))
  }
</div>
```

### 8. WYSIWYG Component

The `FlyoWysiwyg` component renders ProseMirror/TipTap JSON content. It handles standard nodes automatically and lets you provide custom components for specific node types.

```astro
---
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
const { block } = Astro.props;
---

<FlyoWysiwyg json={block.content.json} />
```

Override the rendering of specific node types:

```astro
---
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
import CustomImage from "./wysiwyg/CustomImage.astro";
import CustomVideo from "./wysiwyg/CustomVideo.astro";

const { block } = Astro.props;
---

<FlyoWysiwyg
  json={block.content.json}
  components={{
    image: CustomImage,
    video: CustomVideo,
  }}
/>
```

A custom node component receives the node as a `node` prop (`src/components/flyo/wysiwyg/Image.astro`):

```astro
---
const { node } = Astro.props;
const { src, alt, title } = node.attrs;
---

<img
  src={src.source}
  alt={alt}
  title={title}
  style="max-width: 100%; height: auto;"
/>
```

For images you typically get:

- `src` — the image source (an object with a `source` property when using Flyo storage)
- `alt` — alternative text
- `title` — image title

**Recommended pattern:** create a project-level `AppWysiwyg.astro` wrapper once, register your custom node components there and keep a default class (for example `class="wysiwyg"`) so the setup is reusable:

```astro
---
// src/components/flyo/wysiwyg/AppWysiwyg.astro
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
import Image from "./Image.astro";

const { json, class: className = "wysiwyg" } = Astro.props;
---

<div class={className}>
  <FlyoWysiwyg json={json} components={{ image: Image }} />
</div>
```

Then use the wrapper in your blocks:

```astro
---
import { editable } from "@flyo/nitro-astro";
import AppWysiwyg from "./wysiwyg/AppWysiwyg.astro";

const { block } = Astro.props;
---

<div {...editable(block)}>
  <AppWysiwyg json={block.content.content.json} />
</div>
```

### 9. Image Optimization with the Flyo CDN

The integration registers the [Flyo Storage image service](https://dev.flyo.cloud/dev/infos/images.html) as Astro's image service, so the built-in `<Image />` component from `astro:assets` transforms Flyo storage URLs out of the box:

```astro
---
import { Image } from "astro:assets";
---

<Image
  src={block.content.image.source}
  alt="Description"
  width={1920}
  height={768}
/>
```

The URL is rewritten to `https://storage.flyo.cloud/image_xxx.jpg?w=1920&h=768&format=webp`.

The service:

- Adds the Flyo CDN host (`storage.flyo.cloud`) if it is not already part of the URL
- Applies width/height transformations (`?w={width}&h={height}`)
- Converts to WebP by default (override with the `format` attribute)
- Emits `width`, `height`, `loading="lazy"` and `decoding="async"` to prevent layout shift

Only the side you pass is sent: `width` alone yields `?w=1920` and lets the CDN derive the height from the aspect ratio, `height` alone yields `?h=768`. A value the CDN would reject (`0`, an empty string, `"null"`) is treated as "this side is dynamic" and left out. Without any dimension the untouched original file is served — the CDN ignores `format` in that case, so it is not sent either. Oversized values are passed through and capped by the CDN itself.

> [!NOTE]
> The CDN's legacy `/thumb/{width}x{height}` path is deprecated (removal announced for 06.08.2028) and is no longer produced by this integration. `/filter/{width}x{height}` and other path-based variants were removed on 06.08.2026 and now answer with HTTP 404. If you build storage URLs by hand somewhere, migrate them: `/thumb/{w}x{h}` → `?w={w}&h={h}`, `/thumb/{w}xnull` → `?w={w}`, `/thumb/nullx{h}` → `?h={h}`.

Use `<Image />` and `<Picture />` from `astro:assets` as you normally would — the service is configured globally by the integration, so there is nothing to pass per image.

> [!IMPORTANT]
> Do not set `image.service` in your own `astro.config.mjs`. Overriding it (with `sharp`, `squoosh` or `passthrough`) replaces the Flyo service and disables CDN transformation for the whole project.

`width` and `height` are required for remote images — they are what the CDN transformation uses. CMS image fields can be empty, so guard the usage:

```astro
{
  block.content?.image?.source && (
    <Image
      src={block.content.image.source}
      alt={block.content.image.caption ?? ""}
      width={800}
      height={600}
    />
  )
}
```

Local project assets in `src/assets/` keep working as usual through the same component.

### 10. Nested Blocks (Slots)

Blocks can contain other blocks in slots. Render them with `BlockSlot`, which recursively delegates each nested block back to `FlyoNitroBlock`:

```astro
---
// src/components/flyo/SlotContainer.astro
import { editable } from "@flyo/nitro-astro";
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
const { block } = Astro.props;
---

<div {...editable(block)}>
  <h2>{block.content?.title}</h2>
  <BlockSlot slot={block.slots.slotcontainername} />
</div>
```

`BlockSlot` handles iterating over the nested blocks, resolving each component and unlimited nesting depth. Everything renders on the server, so `editable()` and `BlockSlot` work in the same component.

### 11. Entity Detail Pages

The **Entity Details** API provides all information about an entity and its associated model data configured in the Flyo interface. Detail pages can be requested by slug (with a schema/type ID) or by unique ID.

#### Example 1: Request by slug (type ID 9999)

For a blog post, use `src/pages/blog/[slug].astro` with `entityBySlug`. Slugs are unique within an entity but not necessarily across the whole system, so pass the schema ID to fetch the correct entity:

```astro
---
import Layout from "../../layouts/Layout.astro";
import { useEntitiesApi } from "@flyo/nitro-astro";
import MetaInfoEntity from "@flyo/nitro-astro/MetaInfoEntity.astro";

const { slug } = Astro.params;

let response = null;
try {
  response = await useEntitiesApi().entityBySlug({
    slug,
    lang: Astro.currentLocale,
    typeId: 9999,
  });
} catch (e) {
  return Astro.rewrite("/404");
}

const isProd = import.meta.env.PROD;
---

<Layout title={response.entity.entity_title}>
  <MetaInfoEntity response={response} slot="head" />
  <h1>{response.entity.entity_title}</h1>
  <img src={response.model.image.source} style="width:100%" />
</Layout>
{
  isProd && (
    <script is:inline define:vars={{ api: response.entity.entity_metric.api }}>
      fetch(api)
    </script>
  )
}
```

The inline `fetch(api)` call reports the detail view back to Flyo's entity metrics — only do this in production.

#### Example 2: Request by unique ID

The unique ID is globally unique across the whole system, which makes it reliable for fetching a specific entity. Use `src/pages/blog/[uniqueid].astro`:

```astro
---
const { uniqueid } = Astro.params;
// ...
const response = await useEntitiesApi().entityByUniqueid({
  uniqueid,
  lang: Astro.currentLocale,
});
---
```

Any route parameter name works — you control the resolution logic, the library only provides the API clients and the meta/JSON-LD components.

### 12. Multilanguage (i18n)

Flyo Nitro is fully multilingual. Configure the languages with [Astro's own i18n routing](https://docs.astro.build/en/guides/internationalization/). Make sure the languages used in Flyo are listed in `locales` and that the primary language is set as `defaultLocale`:

```js
import { defineConfig } from "astro/config";

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

> [!NOTE]
> Flyo's i18n setup always prefixes the default language, so `prefixDefaultLocale: true` is required — otherwise adapters like Vercel produce routing errors.

**Pages need no extra work.** Every Flyo page has a full, globally-unique slug that already contains its language prefix (`de/erleben`, `en/experience`), and `config.pages[]` lists all of them — so your existing catch-all route resolves every localized page.

**Config and containers are resolved per locale.** The middleware passes `Astro.currentLocale` to the config API, so `useConfig(Astro)` returns the navigation in the active language automatically. The resolved language is echoed back as `config.nitro.language` — use it for `<html lang>`.

**Entity detail pages need the language explicitly**, because an entity slug is shared across languages:

```js
await useEntitiesApi().entityBySlug({ slug, lang: Astro.currentLocale });
await useEntitiesApi().entityByUniqueid({
  uniqueid,
  lang: Astro.currentLocale,
});
```

> [!NOTE]
> If your entity details are internationalized, create a detail page per language:
>
> ```
> .
> ├── de
> │   └── detail
> │       └── [slug].astro
> ├── fr
>     └── detail
>         └── [slug].astro
> ```

#### Language switcher

Pages and entities carry a `translation[]` array with their language alternates, including fully-resolved `href`s. Since Astro renders every navigation on the server, a switcher is just markup — pass the translations from the page into your layout:

```astro
<!-- src/pages/[...slug].astro -->
<Layout title={page.title} translations={page.translation}>
  <MetaInfoPage page={page} slot="head" />
  <FlyoNitroPage page={page} />
</Layout>
```

```astro
---
// src/layouts/Layout.astro
const { translations = [] } = Astro.props;
const currentLocale = Astro.currentLocale;
---

<nav aria-label="Language">
  <ul>
    {
      translations.map((t: any) => (
        <li>
          <a
            href={t.href}
            aria-current={
              t.language?.shortcode === currentLocale ? "true" : undefined
            }
          >
            {t.language?.name}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

Each translation entry contains `language.shortcode`, `language.name`, `slug`, `title` and `href`. The same array is available on entity responses, so entity detail pages can feed the identical switcher.

### 13. Sitemap Generation

The integration automatically injects a `/sitemap.xml` route that contains all Flyo pages and entity detail routes. The only requirement is a `site` in `astro.config.mjs`:

```js
export default defineConfig({
  site: "https://myflyowebsite.com",
  // ... rest of config
});
```

Pages and entities are both listed with the `href` the API resolved for them, and each entry carries a `<lastmod>` taken from the `updated_at` timestamp — for pages that is the last time the delivered content actually changed, so a rebuild that produces identical output does not move it. Entries the API reports without a usable timestamp are emitted without `lastmod`, which is valid; entries without an `href` are not listed at all.

Nothing else to wire up — do **not** add `@astrojs/sitemap` for Flyo content, it would not see the CMS routes.

### 14. Meta Information & Debug Info

`MetaInfoPage` and `MetaInfoEntity` render title, description, Open Graph, Twitter and JSON-LD tags from the CMS data. They must end up inside `<head>`, which is what the named `head` slot in the layout is for:

```astro
<Layout title={page.title}>
  <MetaInfoPage page={page} slot="head" />
  <!-- … -->
</Layout>
```

`MetaInfo` is the generic version if you want to set the values yourself:

```astro
---
import MetaInfo from "@flyo/nitro-astro/MetaInfo.astro";
---

<MetaInfo
  title="Page Title"
  description="Page description"
  image="https://storage.flyo.cloud/image_xxx.jpg"
  jsonld={jsonldObject}
  slot="head"
/>
```

> The `image` must be a plain Flyo CDN URL — it is rewritten to `?w=1200&h=630&format=jpg` for `og:image` and `?w=1200&h=600&format=jpg` for `twitter:image`. `MetaInfo` also emits `og:url` and `<link rel="canonical">` from the current URL, so remove your own canonical link.

`DebugInfo` prints an HTML comment into the page with live edit status, environment, API version and date, token type, Vercel deployment ID and commit SHA — useful for checking what a deployed site is actually serving:

```astro
---
import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";
---

<DebugInfo />
```

## Built-in Features

### Middleware & Caching

The integration adds a middleware (`order: "post"`) that:

- Resolves the Flyo configuration once per request and exposes it as `Astro.locals.config` (read it with `useConfig(Astro)`)
- Sets cache headers in production, configurable via `clientCacheHeaderTtl` and `serverCacheHeaderTtl`
- Disables caching entirely when `liveEdit` is enabled

Headers set when live edit is off:

- `Cache-Control` — client-side caching (`clientCacheHeaderTtl`)
- `CDN-Cache-Control` — CDN caching (`serverCacheHeaderTtl`)
- `Vercel-CDN-Cache-Control` — Vercel-specific caching (`serverCacheHeaderTtl`)

> Your own middleware runs **before** the integration's, so `context.locals.config` is only populated after `await next()`. If you manage caching yourself, set both TTL options to `0` or overwrite the headers in your own middleware.

### Live Edit Mode

When `liveEdit` is enabled, the integration:

- Injects the client script that reloads the page from the Flyo interface
- Wires every element carrying `data-flyo-uid` (from `editable()`) for click-to-edit and highlighting
- Enables scroll-to-block from the editor
- Announces the preview connection to the Flyo editor, so it can tell a working live preview apart from a blocked frame or a production URL without live edit
- Renders the fallback component when a block's component is missing

The injected script imports `@flyo/nitro-js-bridge`, which is resolved from **your project's** installed version at build time. Version `>= 1.5.0` is recommended (`>= 1.4.0` required for the connection announcement); with an older bridge the Flyo editor reports "no connection to the live preview" even when the preview renders correctly.

```bash
npm ls @flyo/nitro-js-bridge     # expect >= 1.5.0
npm update @flyo/nitro-js-bridge
```

### Development Toolbar

In dev mode the integration adds an Astro dev toolbar app with quick links to the Flyo Cloud login, the Flyo Nitro developer portal and the Nitro API documentation.

## API Reference

### Integration

- **`flyoNitroIntegration(options)`** (default export) — The Astro integration. Registers the middleware, the `/sitemap.xml` route, the CDN image service, the dev toolbar app and the live edit script.
  ```js
  import flyoNitroIntegration from "@flyo/nitro-astro";
  ```

### Functions

- **`useConfig(astro)`** — Returns the resolved config object (navigation containers, routing table, `nitro` meta) for the current request. Takes the Astro context (`Astro` in components, `context` in endpoints).
  ```ts
  const config = await useConfig(Astro);
  config.containers.nav.items; // navigation
  config.pages.includes(slug); // routing table
  config.nitro?.language; // resolved locale
  ```
- **`useConfigApi()`** — Returns the `ConfigApi` instance for custom configuration requests.
  ```ts
  const config = await useConfigApi().config({ lang: "en" });
  ```
- **`usePagesApi()`** — Returns the `PagesApi` instance for fetching pages.
  ```ts
  const page = await usePagesApi().page({ slug: "about" });
  ```
- **`useEntitiesApi()`** — Returns the `EntitiesApi` instance for entity details.
  ```ts
  await useEntitiesApi().entityBySlug({
    slug,
    lang: Astro.currentLocale,
    typeId: 54,
  });
  await useEntitiesApi().entityByUniqueid({
    uniqueid,
    lang: Astro.currentLocale,
  });
  ```
- **`useSearchApi()`** — Returns the `SearchApi` instance for search operations.
- **`useSitemapApi()`** — Returns the `SitemapApi` instance. The `/sitemap.xml` route is generated automatically; use this only for custom sitemap handling.
- **`useVersionApi()`** — Returns the `VersionApi` instance for API version checks.
- **`useConfiguration()`** — Returns the SDK `Configuration` object holding the access key.
- **`useFlyoIntegration()`** — Returns `{ config, options }` — the SDK configuration plus the resolved integration options (`accessToken`, `liveEdit`, `componentsDir`, cache TTLs).
  ```ts
  const liveEdit = useFlyoIntegration().options.liveEdit;
  ```
- **`editable(block)`** — Returns the `data-flyo-uid` attribute object that wires a block into the Flyo live editor.
  ```astro
  <div {...editable(block)}>…</div>
  ```
  > `editableBlock` remains available as a backwards-compatible alias.
- **`flyoImageUrl(src, options)`** — Builds a Flyo storage URL with the CDN transformation parameters. `<Image />` covers the normal case; use this where no `<img>` is involved — CSS backgrounds, `<link rel="preload">`, e-mail templates, custom meta tags. Options are `width`, `height`, `format` and `download`.
  ```ts
  flyoImageUrl(block.content.image.source, { width: 1200, height: 630 });
  // https://storage.flyo.cloud/image_xxx.jpg?w=1200&h=630
  flyoImageUrl(block.content.image.source, { width: 1200 });
  // https://storage.flyo.cloud/image_xxx.jpg?w=1200  (height follows the aspect ratio)
  ```

### Components

Import each component from its own subpath — components are shipped as raw `.astro` source and are not part of the main entry point.

- **`FlyoNitroPage.astro`** — Renders a whole Flyo page by delegating every block to `FlyoNitroBlock`.
  ```astro
  import FlyoNitroPage from "@flyo/nitro-astro/FlyoNitroPage.astro";
  <FlyoNitroPage page={page} />
  ```
- **`FlyoNitroBlock.astro`** — Low-level renderer that maps a block's component name to your registered component.
  ```astro
  import FlyoNitroBlock from "@flyo/nitro-astro/FlyoNitroBlock.astro";
  <FlyoNitroBlock block={block} />
  ```
- **`BlockSlot.astro`** — Renders the nested blocks of a slot.
  ```astro
  import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
  <BlockSlot slot={block.slots.myslotname} />
  ```
- **`FlyoWysiwyg.astro`** — Renders ProseMirror/TipTap JSON with optional per-node component overrides.
  ```astro
  import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
  <FlyoWysiwyg json={block.content.json} components={{ image: CustomImage }} />
  ```
- **`MetaInfo.astro`** — Generic meta tags (title, description, image, JSON-LD, `og:url`, canonical).
- **`MetaInfoPage.astro`** — Meta tags derived from a page's `meta_json`.
  ```astro
  <MetaInfoPage page={page} slot="head" />
  ```
- **`MetaInfoEntity.astro`** — Meta tags and JSON-LD derived from an entity response.
  ```astro
  <MetaInfoEntity response={response} slot="head" />
  ```
- **`DebugInfo.astro`** — Prints an HTML comment with environment, deployment and API version info.
- **`FallbackComponent.astro`** — Rendered when a block's component is missing (live edit only). Override it with the `fallbackComponent` option.

Every component can also be imported through the longer `@flyo/nitro-astro/components/X.astro` path.

## Best Practices

### Component organization

Keep Flyo block components in a dedicated directory (default `src/components/flyo`):

```
src/
  components/
    flyo/
      Text.astro
      CardsGrid.astro
      Hero.astro
      wysiwyg/
        AppWysiwyg.astro
        Image.astro
```

### Error handling

Always wrap API calls in `try`/`catch` and return a proper response:

```astro
---
let page;
try {
  page = await usePagesApi().page({ slug });
} catch (e) {
  return Astro.rewrite("/404");
}
---
```

### TypeScript support

The package is fully typed and re-uses the models from `@flyo/nitro-typescript`:

```ts
import type { Block, Page, Entity } from "@flyo/nitro-typescript";
```

For project-specific block shapes, prefer the generated types from `npm run flyo:types` (see [Generate Block Types](#6-generate-block-types)).

## Upgrading

Breaking changes and migration steps for every major/minor release are documented in [UPGRADE.md](UPGRADE.md).

## Example `AGENTS.md`

If you build your project with an AI coding assistant (Claude Code, Copilot, Cursor, etc.), drop an `AGENTS.md` file in your project root so the assistant understands your stack and knows where to find the Flyo/Nitro documentation. `AGENTS.md` is the vendor-neutral convention most coding agents read on startup — if your tool uses a specific memory file such as `CLAUDE.md`, use that name too (or have it reference `AGENTS.md`).

Here is a minimal starting point you can copy and adapt. Note that it **self-references this library's docs** — the usage guide and the AI integration advisory — so the assistant can pull in the full Flyo Nitro setup and context on demand:

```markdown
# Flyo Nitro CMS

This is the new XYZ website of XYZ.

It uses the **Flyo Nitro** headless CMS via `@flyo/nitro-astro` to manage the content of the website. Pages are composed of CMS-driven blocks, plus entities and containers, rendered with Astro in SSR mode.

When working on any Flyo/Nitro code (blocks, entities, `astro.config.mjs`, layout, pages, sitemap), consult these sources for the full context of the library:

- Usage guide & API reference: https://github.com/flyocloud/nitro-astro#usage
- AI integration advisory (raw): https://raw.githubusercontent.com/flyocloud/nitro-astro/refs/heads/main/ai-instructions-astro.md
- Full Nitro CMS documentation: https://docs.flyo.cloud/doc/integrations-nitro-cms
```

## Development

This repository is an npm workspace: `lib/` is the published package `@flyo/nitro-astro`, `playground/` is a local Astro app to try it out.

> Workspaces with npm: https://docs.npmjs.com/cli/v10/using-npm/workspaces

```bash
npm install
npm run dev                    # build lib in watch mode
npm run playground             # localhost:4321
npm run build                  # build lib
npm test --workspace=lib       # unit + packaging tests
npx eslint
npx prettier . --write
```

Copy `playground/.env.dist` to `playground/.env` and add your own access token before starting the playground.

> `npm cache clean --force` fixed an issue where the Astro project did not start due to missing dependencies.

See [AGENTS.md](AGENTS.md) for the packaging rules of this repository (how components are exported and what the tests enforce).

Releases are handled by [semantic-release](https://semantic-release.gitbook.io/semantic-release) from `main`; commit messages drive the version.
