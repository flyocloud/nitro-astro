# Flyo Nitro CMS integration advisory for an existing Astro project

You are a coding agent working inside an existing Astro project. Your goal is to integrate Flyo Nitro CMS using `@flyo/nitro-astro`.

Repository and documentation:

- Package repository: `https://github.com/flyocloud/nitro-astro`
- Developer README: `https://github.com/flyocloud/nitro-astro/blob/main/README.md`
- Upgrade guide: `https://github.com/flyocloud/nitro-astro/blob/main/UPGRADE.md`

## Important constraints

This integration requires **server-side rendering**.

Before changing files, verify the project's `astro.config.mjs` (or `.ts`/`.mts`). The integration resolves the Flyo configuration per request through a middleware and renders pages on demand, so the project must run with:

```
output: "server"
```

and a matching [Astro adapter](https://docs.astro.build/en/guides/on-demand-rendering/) (`@astrojs/node`, `@astrojs/vercel`, `@astrojs/netlify`, …). If the project is a purely static build with no adapter, stop and explain that `@flyo/nitro-astro` needs an SSR setup, then ask the user which deployment target they want before adding an adapter.

Astro conventions this advisory follows:

```
astro.config.mjs                             # project root
src/pages/[...slug].astro                    # catch-all CMS route
src/layouts/Layout.astro                     # base layout
src/components/layout/Header.astro           # neutral layout components
src/components/layout/Footer.astro
src/components/flyo/                         # Flyo block components (componentsDir)
src/components/flyo/wysiwyg/AppWysiwyg.astro
src/generated/flyo.ts                        # generated CMS types
```

Only files inside `src/pages/` are routes. Everything else — layouts, components, block components, generated types — lives under `src/` but outside `src/pages/`.

Block components must live inside the configured `componentsDir` (default `src/components/flyo`), because the integration resolves them from that directory by name.

Do not hardcode secrets into source files. The Flyo access token must be stored in environment variables.

Use TypeScript where the project supports it.

Prefer small, clean, reusable components.

## First interaction with the user

Before implementing, ask the user for the following required information.

### 1. Flyo Nitro access token

Ask for the Flyo access token that should be used for this project.

Store it in `.env` as:

```
FLYO_ACCESS_TOKEN=<token>
FLYO_LIVE_EDIT=true
```

For production, the environment should contain:

```
FLYO_ACCESS_TOKEN=<production-token>
FLYO_LIVE_EDIT=false
```

Also make sure `.env` is git-ignored and add a `.env.dist` (or `.env.example`) with placeholder values. Do not commit real tokens.

### 2. Site URL

Ask for the production domain. It is set as `site` in `astro.config.mjs` and is required for the automatically injected `/sitemap.xml` route:

```
Which domain will this site run on in production (used for `site` and the sitemap)?
```

### 3. Available Flyo container identifiers

Ask which Flyo config containers exist and should be used in the layout.

Common examples:

```
nav
navbar
navigation
main_navigation
footer
```

Ask the user specifically:

```
Which Flyo container identifier should be used for the main navigation?
Which Flyo container identifier should be used for the footer?
```

Use those identifiers in the `Header` and `Footer` components.

The components should not be named `FlyoHeader` or `FlyoFooter`, because they are regular layout components. Use neutral layout names:

```
src/components/layout/Header.astro
src/components/layout/Footer.astro
```

## Implementation steps

### 1. Install the package

Install the Flyo Nitro Astro package:

```
npm install @flyo/nitro-astro
```

Use the project's package manager if it is clearly not npm:

```
pnpm add @flyo/nitro-astro
```

or:

```
yarn add @flyo/nitro-astro
```

If the project has no SSR adapter yet, add one for the user's deployment target, for example:

```
npx astro add node
```

Do **not** run `astro add @flyo/nitro-astro` — the integration is registered manually in the next step.

### 2. Register the integration in `astro.config.mjs`

Merge the Flyo integration into the existing config. Do not overwrite existing integrations, adapters, `site`, `i18n`, `vite` or `markdown` settings.

```
import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import flyoNitroIntegration from "@flyo/nitro-astro";

const { FLYO_ACCESS_TOKEN, FLYO_LIVE_EDIT } = loadEnv(
  process.env.NODE_ENV,
  process.cwd() + "/",
  ""
);

export default defineConfig({
  site: "https://example.com", // required for the injected sitemap.xml
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN,
      liveEdit: FLYO_LIVE_EDIT,
      componentsDir: "src/components/flyo",
      serverCacheHeaderTtl: 1200,
      clientCacheHeaderTtl: 900,
      components: {
        // Block components are registered here after they are created.
        // Use the Claude skill created later in this advisory to build and register them.
      },
    }),
  ],
  output: "server",
});
```

Notes to respect:

- `loadEnv` from `vite` is used because `astro.config.mjs` runs before Astro's env handling.
- `accessToken` is enforced by the integration — an empty value throws during `astro:config:setup`, which is intentional.
- Every key in `components` maps a Flyo component name to a file inside `componentsDir`; the `.astro` suffix is not required. Adding a new entry requires restarting the dev server.
- Optionally set `fallbackComponent: "BlockNotFound"` and create `src/components/flyo/BlockNotFound.astro`; it renders only in live edit mode.

### 3. Generate Flyo TypeScript definitions

Create the generated types directory:

```
src/generated
```

Add this script to `package.json`:

```
{
  "scripts": {
    "flyo:types": "npx -y openapi-typescript@latest 'https://api.flyo.cloud/nitro/v1/openapi/schemas?token=$FLYO_ACCESS_TOKEN' -o ./src/generated/flyo.ts --root-types --root-types-no-schema-prefix --export-type"
  }
}
```

Then run:

```
npm run flyo:types
```

The direct command is:

```
npx -y openapi-typescript@latest 'https://api.flyo.cloud/nitro/v1/openapi/schemas?token=flyotoken' -o ./src/generated/flyo.ts --root-types --root-types-no-schema-prefix --export-type
```

Replace `flyotoken` with the real Flyo access token.

If shell variable expansion inside the npm script is problematic on the current platform, temporarily run the direct command with the token locally. Do not commit the token.

This produces a type per block (`BlockHero`, `BlockText`, …), per entity and per container, which the block components use for type-safe `Astro.props`.

### 4. Create neutral layout `Header` and `Footer` components

Create:

```
src/components/layout/Header.astro
src/components/layout/Footer.astro
```

Use the user-provided Flyo container identifiers. Both read the Flyo config through `useConfig(Astro)`, which is resolved once per request by the integration's middleware.

Example `Header.astro`:

```
---
import { useConfig } from "@flyo/nitro-astro";

const NAV_CONTAINER_KEY = "nav";

const config = await useConfig(Astro);
const items = config?.containers?.[NAV_CONTAINER_KEY]?.items ?? [];
const currentPath = Astro.url.pathname;
---

{
  items.length > 0 && (
    <header>
      <nav aria-label="Main navigation">
        <ul>
          {items.map((item: any) => (
            <li>
              <a
                href={item.href}
                target={item.target}
                aria-current={currentPath === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

Example `Footer.astro`:

```
---
import { useConfig } from "@flyo/nitro-astro";

const FOOTER_CONTAINER_KEY = "footer";

const config = await useConfig(Astro);
const items = config?.containers?.[FOOTER_CONTAINER_KEY]?.items ?? [];
---

{
  items.length > 0 && (
    <footer>
      <nav aria-label="Footer navigation">
        <ul>
          {items.map((item: any) => (
            <li>
              <a href={item.href} target={item.target}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}
```

Replace `NAV_CONTAINER_KEY` and `FOOTER_CONTAINER_KEY` with the actual identifiers provided by the user.

If the shape of the config container items differs from this example, inspect the returned config structure or the generated types and adapt the rendering safely.

### 5. Update the base layout

Update (or create) `src/layouts/Layout.astro`.

The layout must contain three Flyo-specific things:

1. `Header` and `Footer`
2. `DebugInfo` in the `<head>`
3. A named `head` slot — the meta components are passed in from the pages and need to end up inside `<head>`

Example:

```
---
import { useConfig } from "@flyo/nitro-astro";
import DebugInfo from "@flyo/nitro-astro/DebugInfo.astro";
import Header from "../components/layout/Header.astro";
import Footer from "../components/layout/Footer.astro";

const config = await useConfig(Astro);
const { title } = Astro.props;
---

<!doctype html>
<html lang={config.nitro?.language ?? "en"}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <DebugInfo />
    <slot name="head" />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

Preserve any existing fonts, global styles, analytics, view transitions and body classes from the existing layout. Do not blindly overwrite it — merge the Flyo integration into it.

`useConfig()` takes the Astro context. In an endpoint pass the context object instead: `await useConfig(context)`. Because the config comes from the middleware, it is **not** available inside `getStaticPaths()`.

### 6. Create the wildcard catch-all page route

Create:

```
src/pages/[...slug].astro
```

Use:

```
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

If the project has no `src/pages/404.astro`, create a minimal one so the rewrite has a target.

If the project already has routes (for example a hand-built `index.astro` or other static pages), inspect the routing structure first. Astro gives more specific routes priority over the catch-all, so existing pages keep working — but a hand-built `src/pages/index.astro` will shadow the Flyo homepage. Ask the user whether the homepage should come from Flyo, and remove or rename the static file if so.

### 7. Prepare a project WYSIWYG wrapper

Most Flyo Nitro projects use WYSIWYG fields. Create a reusable wrapper even if there are no custom nodes yet.

Create:

```
src/components/flyo/wysiwyg/AppWysiwyg.astro
```

Use:

```
---
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";

interface Props {
  json: any;
  class?: string;
}

const { json, class: className = "wysiwyg" } = Astro.props;
---

<div class={className}>
  <FlyoWysiwyg
    json={json}
    components={{
      // Add custom WYSIWYG node components here later, e.g. image: Image
    }}
  />
</div>
```

Use this wrapper in Flyo block components whenever a block contains WYSIWYG JSON. Custom node components receive the node as a `node` prop.

### 8. Images — use `astro:assets`, do not build an image component

**Nothing to create in this step.** The integration registers the Flyo Storage CDN as Astro's image service (`image.service.entrypoint` → `@flyo/nitro-astro/cdn.ts`), so the built-in `<Image />` component from `astro:assets` already transforms Flyo storage URLs:

```
---
import { Image } from "astro:assets";
---

<Image
  src={block.content.image.source}
  alt={block.content.image.caption ?? ""}
  width={800}
  height={600}
/>
```

This renders `https://storage.flyo.cloud/<image>/thumb/800x600?format=webp` with `loading="lazy"` and `decoding="async"` already applied.

Rules to follow:

- Use `<Image />` (or `<Picture />`) from `astro:assets` directly in block components. Do **not** create a `FlyoImage` wrapper, a custom loader or a `<img>` with a hand-built CDN URL. Those are patterns from React frameworks where the loader must be passed per usage — in Astro the service is global and already configured.
- Do **not** touch `image.service` in `astro.config.mjs`. Overriding it with `sharp`, `squoosh` or `passthrough` disables the Flyo CDN transformation for the whole project.
- `width` and `height` are required for remote images: they drive the `/thumb/{width}x{height}` transformation and prevent layout shift.
- The output format defaults to `webp`; override it per image with `format="jpg"` when a specific format is needed.
- A raw source string is enough — the service prefixes `https://storage.flyo.cloud/` when the URL does not already contain it.
- CMS image fields can be empty, so guard the usage instead of wrapping the component:

  ```
  {block.content?.image?.source && (
    <Image src={block.content.image.source} alt="" width={800} height={600} />
  )}
  ```

Local project assets (logos, icons in `src/assets/`) keep working as usual — Astro resolves them through the same component.

### 9. Create a reusable Claude skill for building a named Flyo block

Do not manually add a full block convention section to the advisory only. Instead, create a reusable Claude skill that future agents can use to build or update **one named Flyo block at a time**, driven by a design brief or by an existing component that should be converted into a block.

This skill is invoked with a block **name** and a **design intent**, for example:

```
Use the flyo-block skill. Block: Hero. Create a decent-looking, responsive hero block based on the hero design.
```

```
Use the flyo-block skill. Block: Hero. Convert the existing HeroBanner component into a Flyo hero block and keep its look and feel.
```

```
Use the flyo-block skill. Block: Teaser. Update the existing Teaser block to match the new card design.
```

The skill is therefore not a bulk generator. It focuses on translating a design (a brief, a screenshot, or an existing Astro component) into a single, well-crafted, type-safe Flyo block, and registering it.

Create:

```
.claude/skills/flyo-block/SKILL.md
```

Use this content:

````
---
name: flyo-block
description: Create or update a single named Flyo Nitro CMS block for this Astro project, driven by a design brief or by converting an existing Astro component into a block. Use when the user names a block (e.g. "Hero") and describes how it should look or points to an existing component to base it on.
---

# Flyo block builder skill

Use this skill to create or update **one named Flyo Nitro CMS block** at a time.

This skill is design-driven. It is invoked with:

- a block **name** (for example `Hero`, `Teaser`, `Gallery`), and
- a **design intent**, which is one of:
  - a written design brief ("a decent-looking, responsive hero with headline, lead text and a CTA"),
  - a reference to an existing component to convert into a block ("base it on the existing `HeroBanner` component"),
  - a visual reference (screenshot / mockup) the user provides.

The goal is to translate that design intent into a single, polished, type-safe Flyo block and register it.

## Project context

This project uses:

```txt
Astro in SSR mode (output: "server")
@flyo/nitro-astro
```

Routes live in `src/pages/`. Everything else (layouts, components, block components, generated types) lives under `src/` outside of `src/pages/`.

Generated Flyo types are located at:

```txt
src/generated/flyo.ts
```

Flyo block components must be placed in the configured `componentsDir`:

```txt
src/components/flyo
```

Shared Flyo helpers are available at:

```txt
src/components/flyo/wysiwyg/AppWysiwyg.astro
```

Images use the built-in `<Image />` component from `astro:assets` — the Flyo Storage CDN is registered as Astro's image service by the integration, so there is no image wrapper component and no loader to pass.

Blocks are registered in the `components` map of `flyoNitroIntegration()` in `astro.config.mjs`.

## Inputs to resolve first

Before writing code, make sure you know:

1. The **block name** the user wants (used for the file name, component name and registration key).
2. Whether this is a **create** (new block) or an **update** (an existing block file already exists).
3. The **design source**:
   - a brief in the prompt, or
   - an existing component/file to convert or match, or
   - a visual reference.
4. The matching **generated block type** in `src/generated/flyo.ts`.

If the user only gives a name and a design but there is no matching type in `src/generated/flyo.ts`, ask them to confirm the CMS block identifier (or run `npm run flyo:types`) before inventing fields.

## Main task

When asked to build a named block:

1. Inspect `src/generated/flyo.ts` and find the generated type that matches the requested block name.
2. If converting an existing component, read that component fully and note its markup, styling approach, props and layout.
3. Map the design's visual pieces (heading, text, image, buttons, background, layout) onto the block's real CMS fields from the generated type.
4. Create or update the block component in `src/components/flyo` using the block name (for example `Hero.astro`).
5. Implement the design faithfully: responsive layout, sensible spacing, and the project's existing design system where one exists.
6. Use `AppWysiwyg` for WYSIWYG JSON fields.
7. Use `<Image />` from `astro:assets` for Flyo media/image fields — never a hand-built `<img>` with a CDN URL.
8. Spread `editable(block)` onto the block's root element.
9. Use `BlockSlot` for nested slot rendering.
10. Register (or confirm registration of) the block in `astro.config.mjs`.
11. Keep the implementation focused on the single named block; do not generate unrelated blocks.

## Converting an existing component into a block

When the user points to an existing component ("base it on the existing `HeroBanner`"):

1. Read the referenced component and preserve its look and feel (class names, layout, spacing, variants).
2. Replace its hardcoded/static props with the block's CMS fields from `src/generated/flyo.ts`.
3. Keep the original styling and structure; only swap the data source and add the Flyo wiring (`editable`, `AppWysiwyg`, `astro:assets` images, slots).
4. If the original component should stay as a presentational component, you may keep it and have the block wrap it, passing CMS values as props — whichever keeps the design intact with the least duplication.

## Design guidance

- Match the requested design intent, not a generic template. If the user asks for a "decent-looking" layout, produce a genuinely polished, responsive result.
- Reuse the project's existing components, typography helpers, buttons and layout primitives if they already exist.
- Only introduce new styling when the project has no clear design system to follow, and keep it consistent with what already exists.
- Keep the block responsive and accessible (semantic elements, alt text, focusable controls).

## Important rules

Always inspect `src/generated/flyo.ts` before creating or updating a block.

Do not guess field names if the generated type definitions are available.

Use optional chaining for CMS fields unless the generated type guarantees that a field is required.

Keep the block component readable and scoped to the one named block.

Do not invent a fake block type that does not exist in the generated types.

Do not fetch CMS data inside a block component — a block only renders the `block` prop it receives.

## Basic block pattern

```astro
---
import { editable } from "@flyo/nitro-astro";
import type { BlockExample } from "../../generated/flyo";

interface Props {
  block: BlockExample;
}

const { block } = Astro.props;
---

<section {...editable(block)}>
  {/* Render block.content fields here */}
</section>
```

## Block pattern with slots

Astro renders everything on the server, so `editable()` and `BlockSlot` can be used in the same component:

```astro
---
import { editable } from "@flyo/nitro-astro";
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
import type { BlockExampleContainer } from "../../generated/flyo";

interface Props {
  block: BlockExampleContainer;
}

const { block } = Astro.props;
---

<section {...editable(block)}>
  <BlockSlot slot={block.slots.content} />
</section>
```

The slot key (`block.slots.content`) must match the slot identifier defined in the Flyo interface.

## Items

Repeatable content comes in as `block.items`:

```astro
{
  block.items?.map((item: any) => (
    <article>
      <h3>{item.title}</h3>
      <a href={item.link?.routes?.detail}>Details</a>
    </article>
  ))
}
```

## WYSIWYG usage

```astro
---
import AppWysiwyg from "./wysiwyg/AppWysiwyg.astro";
---

{block.content?.text?.json && <AppWysiwyg json={block.content.text.json} />}
```

## Image usage

The integration registers the Flyo Storage CDN as Astro's image service, so `astro:assets` transforms Flyo URLs out of the box. Use it directly — do not create a wrapper component, a loader, or a manual `/thumb/` URL:

```astro
---
import { Image } from "astro:assets";
---

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

`width` and `height` are required for remote images — they drive the `/thumb/{width}x{height}` transformation and prevent layout shift. The format defaults to `webp`; override it per image with `format="jpg"` when needed.

## Registering the block

After creating or updating the named block component, make sure it is registered in `astro.config.mjs`. The key is the component name from the Flyo interface, the value is the path inside `componentsDir` without the `.astro` suffix:

```js
flyoNitroIntegration({
  accessToken: FLYO_ACCESS_TOKEN,
  liveEdit: FLYO_LIVE_EDIT,
  componentsDir: "src/components/flyo",
  components: {
    Hero: "Hero",
    Text: "Text",
    CardsGrid: "CardsGrid",
    SlotContainer: "subfolder/SlotContainer",
  },
});
```

Adding a new entry requires **restarting the dev server** — tell the user when a restart is needed.

## Final checklist after building the block

- The named block file exists in `src/components/flyo` (created or updated).
- The block imports the correct generated type from `src/generated/flyo.ts`.
- The design intent (brief, reference component, or mockup) is faithfully implemented and responsive.
- If converting an existing component, its look and feel is preserved.
- WYSIWYG fields use `AppWysiwyg`.
- Images use `<Image />` from `astro:assets` with explicit width and height.
- Slot rendering uses `BlockSlot`.
- `editable(block)` is spread onto the root element.
- The block is registered in `astro.config.mjs` and the dev server was restarted.
- `astro check` passes.
````

This replaces a manual "block component convention" section and removes block registration from the main setup flow. Building a named block from a design (or from an existing component) and registering it are now handled by the reusable Claude skill.

### 10. Entity detail pages (if the project has entities)

Ask the user whether the site has entity detail pages (blog posts, products, locations, …) and which entity type IDs and route prefixes they use.

For a slug-based detail page create `src/pages/<segment>/[slug].astro`:

```
---
import Layout from "../../layouts/Layout.astro";
import { useEntitiesApi } from "@flyo/nitro-astro";
import MetaInfoEntity from "@flyo/nitro-astro/MetaInfoEntity.astro";

const { slug = "" } = Astro.params;

let response = null;
try {
  response = await useEntitiesApi().entityBySlug({
    slug,
    lang: Astro.currentLocale,
    typeId: 9999, // the entity type ID from Flyo
  });
} catch (e) {
  return Astro.rewrite("/404");
}

const isProd = import.meta.env.PROD;
---

<Layout title={response.entity.entity_title}>
  <MetaInfoEntity response={response} slot="head" />
  <h1>{response.entity.entity_title}</h1>
</Layout>
{
  isProd && (
    <script is:inline define:vars={{ api: response.entity.entity_metric.api }}>
      fetch(api)
    </script>
  )
}
```

For a unique-ID based route use `entityByUniqueid({ uniqueid, lang: Astro.currentLocale })` instead. Any route parameter name works — the resolution logic is yours.

Keep the `fetch(api)` metric call guarded by `import.meta.env.PROD` so development views are not counted.

### 11. Sitemap

The integration injects `/sitemap.xml` automatically with all Flyo pages and entity detail routes. There is nothing to create — only make sure `site` is set correctly in `astro.config.mjs`.

Do **not** add `@astrojs/sitemap` for Flyo content; it does not see the CMS routes. If the project already uses it for other static routes, tell the user that the two sitemaps coexist and only one can be served at `/sitemap.xml`.

### 12. Optional: Multilanguage (i18n)

If the Flyo project is multilingual, make the integration locale-aware. Ask the user:

```
Is the site multilingual? If so, what is the primary language and which locales are used (e.g. de, en)?
```

If it is single-language, skip this step. For a multilingual project:

1. Configure Astro's own i18n routing in `astro.config.mjs`. Flyo always prefixes the default language, so `prefixDefaultLocale: true` is required:

```
export default defineConfig({
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // …
});
```

2. Nothing to change in the catch-all route. Flyo page slugs are locale-prefixed and globally unique, and `config.pages[]` lists all languages, so `src/pages/[...slug].astro` resolves every localized page.

3. Nothing to change in the layout or the container components. The middleware passes `Astro.currentLocale` to the config API, so `useConfig(Astro)` already returns the navigation in the active language. Use the resolved language for `<html lang>`:

```
const config = await useConfig(Astro);
// <html lang={config.nitro?.language ?? "en"}>
```

4. Entity detail routes must pass the language explicitly, because an entity slug is shared across languages:

```
await useEntitiesApi().entityBySlug({ slug, lang: Astro.currentLocale, typeId: <id> });
await useEntitiesApi().entityByUniqueid({ uniqueid, lang: Astro.currentLocale });
```

If entity details are internationalized, create one detail page per language (`src/pages/de/detail/[slug].astro`, `src/pages/fr/detail/[slug].astro`).

5. Language switcher. Pages and entities carry a `translation[]` array with `language.shortcode`, `language.name`, `slug`, `title` and a fully-resolved `href`. Astro renders every navigation on the server, so the switcher is plain markup — pass the translations from the page into the layout and render them there:

```
---
// src/pages/[...slug].astro
<Layout title={page.title} translations={page.translation}>
---
```

```
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
            aria-current={t.language?.shortcode === currentLocale ? "true" : undefined}
          >
            {t.language?.name}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

Entity pages feed the same switcher from the entity response's `translation[]`. A route that has no translations (a hand-built page) should fall back to a static list of language home pages.

See the "Multilanguage (i18n)" section of the README for full details.

### 13. Create or update `AGENTS.md` so future agents have Flyo context

So that any AI coding agent that works on this project later (Claude Code, Copilot, Cursor, etc.) automatically knows it is built on Flyo Nitro CMS and where to read the full library documentation, create — or update, if one already exists — an `AGENTS.md` file at the **project root**.

`AGENTS.md` is the vendor-neutral convention that most coding agents read on startup. If the project already uses a tool-specific memory file such as `CLAUDE.md`, add the same Flyo section there as well (or have that file point at `AGENTS.md`). This mirrors the example `AGENTS.md` in the Flyo Nitro README: <https://github.com/flyocloud/nitro-astro/blob/main/README.md#example-agentsmd>.

Add a Flyo section that **self-references this library's documentation**, so the agent can pull in the full integration context (usage, API reference and this advisory) on demand while coding against the Flyo Nitro CMS library:

```markdown
# Flyo Nitro CMS

This project uses the **Flyo Nitro** headless CMS via `@flyo/nitro-astro` to manage its content. Pages are composed of CMS-driven blocks, plus entities and containers, rendered with Astro in SSR mode.

When working on any Flyo/Nitro code (blocks, entities, `astro.config.mjs`, layout, pages, sitemap), consult these sources for the full context of the library:

- Usage guide & API reference: https://github.com/flyocloud/nitro-astro#usage
- AI integration advisory (raw): https://raw.githubusercontent.com/flyocloud/nitro-astro/refs/heads/main/ai-instructions-astro.md
- Full Nitro CMS documentation: https://docs.flyo.cloud/doc/integrations-nitro-cms

Project conventions:

- Astro with `output: "server"` and an SSR adapter — the integration needs on-demand rendering.
- Flyo block components live in `src/components/flyo` and are registered in the `components` map in `astro.config.mjs`. Adding one requires a dev server restart.
- The Flyo config is resolved per request by the integration middleware; read it with `useConfig(Astro)` (not available in `getStaticPaths()`).
- Regenerate types with `npm run flyo:types` whenever CMS block fields change.
- Build one named block at a time with the `.claude/skills/flyo-block` skill.
```

If an `AGENTS.md` already exists, **merge** this Flyo section into it rather than overwriting the file — preserve any existing project instructions.

### 14. Validation checklist

After implementation, run:

```
npm run flyo:types
npx astro check
npm run build
```

If the project has no lint script, skip lint and run the available type-check/build scripts. Then start the dev server once and confirm that a CMS page renders and `/sitemap.xml` returns XML.

Verify:

```
.env contains FLYO_ACCESS_TOKEN and FLYO_LIVE_EDIT, and is git-ignored
astro.config.mjs has output: "server", an SSR adapter, site, and flyoNitroIntegration()
src/layouts/Layout.astro renders Header, Footer, DebugInfo and a <slot name="head" />
src/components/layout/Header.astro exists
src/components/layout/Footer.astro exists
Header and Footer use the user-provided Flyo container identifiers
src/generated/flyo.ts exists
src/pages/[...slug].astro exists and rewrites to /404 for unknown slugs
src/pages/404.astro exists
src/components/flyo/wysiwyg/AppWysiwyg.astro exists
Images use <Image /> from astro:assets and image.service is not overridden in astro.config.mjs
/sitemap.xml returns the Flyo pages and entities
.claude/skills/flyo-block/SKILL.md exists
AGENTS.md exists at the project root and references the Flyo Nitro docs (github.com/flyocloud/nitro-astro#usage and the raw ai-instructions-astro.md)
The project builds successfully
```

If live edit does not connect, check the bridge version — the editor handshake needs `@flyo/nitro-js-bridge` `>= 1.4.0`, and `>= 1.5.0` is recommended:

```
npm ls @flyo/nitro-js-bridge
npm update @flyo/nitro-js-bridge
```

## Follow-up workflow after setup

After the base integration is complete, the next step is to build real Flyo block components from your designs, one named block at a time.

Use the created Claude skill:

```
.claude/skills/flyo-block/SKILL.md
```

Then ask the agent per block, providing a name and a design intent. Examples:

```
Use the flyo-block skill. Block: Hero. Create a decent-looking, responsive hero block based on the hero design.
```

```
Use the flyo-block skill. Block: Hero. Convert the existing HeroBanner component into a Flyo hero block and keep its look and feel.
```

```
Use the flyo-block skill. Block: Teaser. Update the existing Teaser block to match the new card design.
```
