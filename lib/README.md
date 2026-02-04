# Flyo Nitro Astro Framework Integration

The Flyo Nitro Astro Framework Integration provides a comprehensive solution for implementing the Flyo Nitro CMS within the Astro (astro.build) environment. This guide details the integration process, emphasizing the use of Nitro [configurations](https://dev.flyo.cloud/dev/nitro/#die-grundlagen-von-nitro) within the Astro layout framework. Key highlights include:

- **Nitro Configuration in Astro**: This section explores methods for incorporating Nitro configurations into the Astro layout, offering step-by-step instructions for seamless integration that leverages the strengths of both systems.
- **Page Resolution and Block Integration**: Learn to manage and resolve pages within the Astro framework, including integrating Nitro's dynamic [blocks](https://dev.flyo.cloud/dev/nitro/block.html). This part provides insights into creating responsive and interactive web pages using Nitro block technology.
- **Fetching Entity Details**: Focus on techniques for retrieving and displaying detailed information about entities within Astro. This segment covers data fetching, handling, and presentation methods.
- **Image Service Integration**: Understand the integration of Flyo Storage's image service, as detailed in [Flyo Storage Documentation](https://dev.flyo.cloud/dev/infos/images.html). This section delves into working with images in Astro, including uploading, retrieving, and displaying images from Flyo Storage.
- **Meta Information Extraction**: The guide concludes with extracting and utilizing meta information, discussing the importance of meta tags for SEO and user engagement within the Astro framework.

This guide targets developers and web designers aiming to combine Flyo Nitro CMS and Astro framework capabilities to create dynamic, efficient, and feature-rich websites.

## Installation

To install the `@flyo/nitro-astro` package, execute the following command:

```bash
npm install @flyo/nitro-astro
# yarn add @flyo/nitro-astro
```

Then, revise and adjust the configuration in your `astro.config.mjs`:

```js
import { loadEnv } from "vite"
import { defineConfig } from "astro/config";
import flyoNitroIntegration from "@flyo/nitro-astro";

const {
  FLYO_ACCESS_TOKEN,
  FLYO_LIVE_EDIT
} = loadEnv(process.env.NODE_ENV, process.cwd() + "/", "");

export default defineConfig({
  site: "https://myflyowebsite.com", // required to make the sitemap.xml work
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN, // Switch between dev and prod tokens depending on the environment
      liveEdit: FLYO_LIVE_EDIT, // Enable on dev and preview systems for application reloading in the Flyo preview frame upon changes
      components: {
        // Define where the Flyo components are located. The suffix .astro is not required. The object key is the value from Flyo, while the object value is the component in the Astro components folder
        // [!] Adding new elements requires restarting the development process
        FlyoElementName: "AstroElementName",
        AnotherFlyoElement: "subfolder/AnotherFlyoElement",
      },
    }),
  ],
  output: "server",
});
```

> [!WARNING]
> The nitro astro integration requires an SSR setup which is done by using `output: 'server'`.

## Configuration Options

The `flyoNitroIntegration` accepts the following configuration options:

### Required Options

- **`accessToken`** (string, required): Your Flyo access token for authentication. This is either the production or development token from the Flyo Cloud interface. Keep in mind that requests with production accessToken will be effectively cached by the Flyo CDN, but development accessToken requests will not be cached.

- **`components`** (object, required): Object containing component definitions where the key is the component name defined in the Flyo Interface, and the value is the name of the component inside the components directory. The `.astro` suffix is not required.
  ```js
  components: {
    Text: "Text",
    CardsGrid: "CardsGrid",
    SlotContainer: "subfolder/SlotContainer",
  }
  ```

### Optional Options

- **`liveEdit`** (string | boolean | number, default: `false`): Enables live editing mode. If enabled, the application will reload when changes are made in the Flyo preview frame. This should be enabled on dev and preview systems.

- **`componentsDir`** (string, default: `"src/components/flyo"`): Directory path where your Flyo components are located.

- **`fallbackComponent`** (string, optional): Name of a fallback component to use when a requested component is not found. This component will only be used in live editing mode. Example: `"BlockNotFound"` would reference `{componentsDir}/BlockNotFound.astro`.

- **`clientCacheHeaderTtl`** (number, default: `900`): TTL (Time-To-Live) for client-side cache headers, in seconds. Default is 900 seconds (15 minutes). Only available if `liveEdit` is disabled. Use `0` to disable client caching.

- **`serverCacheHeaderTtl`** (number, default: `1200`): TTL (Time-To-Live) for server-side cache headers, in seconds. Default is 1200 seconds (20 minutes). Only available if `liveEdit` is disabled. Use `0` to disable server caching.

### Complete Configuration Example

```js
export default defineConfig({
  site: "https://myflyowebsite.com",
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN,
      liveEdit: FLYO_LIVE_EDIT,
      componentsDir: "src/components/flyo",
      fallbackComponent: "BlockNotFound",
      clientCacheHeaderTtl: 600,  // 10 minutes
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

### Pages

Add a `[...slug].astro` file in the pages directory with the following example content as a catch-all CMS handler:

```astro
---
import Layout from "../layouts/Layout.astro";
import { usePagesApi, useConfig } from "@flyo/nitro-astro";
import FlyoNitroPage from "@flyo/nitro-astro/FlyoNitroPage.astro";
import MetaInfoPage from "@flyo/nitro-astro/MetaInfoPage.astro";

const slug = Astro.params.slug ?? "";
const config = await useConfig(Astro);

if (!config.pages.includes(slug)) {
  throw Astro.redirect("/404", 404);
}

let page;

try {
  const pagesApi = usePagesApi();
  page = await pagesApi.page({ slug });
} catch (e) {
  throw Astro.redirect("/404", 404);
}
---

<Layout title={page.title}>
  <MetaInfoPage page={page} slot="head" />
  <FlyoNitroPage page={page} />
</Layout>
```

To receive the config in the layout in `src/layouts/Layout.astro`:

```astro
---
import { useConfig } from "@flyo/nitro-astro";

const config = await useConfig(Astro);
const { title } = Astro.props;
const currentPath = Astro.url.pathname;
---

<!doctype html>
<html lang="en">
  <head>
    <title>{title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <!-- Auto-inject meta information for pages and entities -->
    <slot name="head" />
  </head>
  <body>
    {
      config.containers.nav.items.map((item: object) => (
        <a
          style="background-color: red; color: white"
          href={item.href}
          class={`nav-class ${currentPath === item.href ? "text-red" : ""}`}
        >
          {item.label}
          <br />
        </a>
      ))
    }
    <div class="container">
      <slot />
    </div>
  </body>
</html>
```

### Blocks

Block components are the building blocks of your Flyo pages. They receive a `block` prop containing all the data from Flyo.

#### Basic Block Component Example

Located in `src/components/flyo/Text.astro`:

```astro
---
import { editable } from "@flyo/nitro-astro";
const { block } = Astro.props;
---

<!-- Make the block editable if necessary -->
<div {...editable(block)}>
  <!-- Content variable -->
  <div set:html={block.content.content.html} />
</div>
```

#### Block with Items and Images

```astro
---
import { Image } from "astro:assets";
import { editable } from "@flyo/nitro-astro";
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
const { block } = Astro.props;
---

<!-- Make the block editable if necessary -->
<div {...editable(block)}>
  <!-- Content variable -->
  <div set:html={block.content.content.html} />

  <!-- Handling items -->
  {
    block.items.map((item: object) => (
      <div>
        {item.title}
        <a href={item.link.routes.detail}>Go to Detail</a>
      </div>
    ))
  }

  <!-- Image Proxy -->
  <Image
    src={block.content.image.source}
    alt={block.content.alt ?? ""}
    width={1920}
    height={768}
  />

  <!-- Handling slots -->
  <BlockSlot slot={block.slots.mysuperslotname} />
</div>
```

#### Cards Grid Component Example

Example of a component that displays a grid of cards with items (`src/components/flyo/CardsGrid.astro`):

```astro
---
import { Image } from "astro:assets";
import { editable } from "@flyo/nitro-astro";
const { block } = Astro.props;
---

{
  block.items.map((item: any) => (
    <div {...editable(block)} style="background-color:#F0F0F0; padding:20px; margin-bottom:10px;">
      <h2 class="text-xl">{item.title}</h2>
      {item.image && (
        <Image
          src={item.image.source}
          alt={item.title}
          width="200"
          height="200"
        />
      )}
      <a href={item.link.routes.detail} class="underline">
        Go to Detail
      </a>
    </div>
  ))
}
```

#### Slot Container Component Example

Slots allow you to nest blocks within blocks (`src/components/flyo/SlotContainer.astro`):

```astro
---
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
const { block } = Astro.props;
---

<BlockSlot slot={block.slots.slotcontainername} />
```

## Available Components

### Core Components

These components are provided by the package and can be imported directly:

#### `FlyoNitroPage`

Renders an entire Flyo page with all its blocks.

```astro
---
import FlyoNitroPage from "@flyo/nitro-astro/FlyoNitroPage.astro";
const page = await usePagesApi().page({ slug });
---

<FlyoNitroPage page={page} />
```

#### `FlyoNitroBlock`

Renders a single Flyo block. This component automatically maps the block's component name to your custom components.

```astro
---
import FlyoNitroBlock from "@flyo/nitro-astro/FlyoNitroBlock.astro";
---

<FlyoNitroBlock block={block} />
```

#### `BlockSlot`

Renders the contents of a Flyo block slot, allowing for nested block structures.

```astro
---
import BlockSlot from "@flyo/nitro-astro/BlockSlot.astro";
---

<BlockSlot slot={block.slots.myslotname} />
```

#### `MetaInfo`

Generic component for adding meta tags (title, description, image, JSON-LD).

```astro
---
import MetaInfo from "@flyo/nitro-astro/MetaInfo.astro";
---

<MetaInfo
  title="Page Title"
  description="Page description"
  image="https://example.com/image.jpg"
  jsonld={jsonldObject}
  slot="head"
/>
```

> The image must be a flyo cdn url and will be automatically transformed to the correct format (1200x600 jpg)

#### `MetaInfoPage`

Specialized meta component for Flyo pages.

```astro
---
import MetaInfoPage from "@flyo/nitro-astro/MetaInfoPage.astro";
---

<MetaInfoPage page={page} slot="head" />
```

#### `MetaInfoEntity`

Specialized meta component for Flyo entities.

```astro
---
import MetaInfoEntity from "@flyo/nitro-astro/MetaInfoEntity.astro";
---

<MetaInfoEntity response={entityResponse} slot="head" />
```

#### `FallbackComponent`

Automatically used when a component is not found (only in live edit mode). You can customize this behavior with the `fallbackComponent` configuration option.

### Wysiwyg

The `FlyoWysiwyg` component renders ProseMirror/TipTap JSON content. It handles standard nodes automatically and allows you to provide custom components for specific node types.

#### Basic Usage

```astro
---
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
const { block } = Astro.props;
---

<FlyoWysiwyg json={block.content.json} />
```

#### Custom Node Components

You can override the default rendering of specific node types by providing custom components:

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
    video: CustomVideo
  }} 
/>
```

#### Custom Image Component Example

Here's an example of a custom image component (`src/components/flyo/wysiwyg/Image.astro`):

```astro
---
const { node } = Astro.props;
const { src, alt, title } = node.attrs;
---

<img src={src.source} alt={alt} title={title} style="max-width: 100%; height: auto;" />
```

The `node` prop contains all attributes from the ProseMirror node. For images, you typically get:
- `src`: The image source (can be an object with a `source` property when using Flyo storage)
- `alt`: Alternative text
- `title`: Image title

#### Complete Text Block with Wysiwyg Example

```astro
---
import { editable } from "@flyo/nitro-astro";
import FlyoWysiwyg from "@flyo/nitro-astro/FlyoWysiwyg.astro";
import Image from "./wysiwyg/Image.astro";

const { block } = Astro.props;
---

<div {...editable(block)}>
  <div class="p-4">
    <FlyoWysiwyg 
      json={block.content.content.json} 
      components={{
        image: Image
      }}
    />
  </div>
</div>
```

### Entities

The **Entity Details** API provides all the information about an entity and the associated model data configured in the Flyo interface. You can request detail pages either by using a slug (with an additional schema ID) or by a unique ID.

#### Example: Request by slug (type ID 9999)

For a blog post, use `src/pages/blog/[slug].astro` with `entityBySlug`. Since slugs can be unique within an entity but may not be unique across the entire system, it’s recommended to include the schema ID to fetch the correct entity.

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
  return new Response(e.body, {
    status: 404,
    statusText: "Entity Not Found",
  });
}
const isProd = import.meta.env.PROD;
---

<Layout>
  <MetaInfoEntity response={response} slot="head" />
  <h1>{slug}</h1>
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

#### Example: Request by unique ID

For fetching by unique ID, use `src/pages/blog/[uniqueid].astro` with `entityByUniqueid`. The unique ID is globally unique across the entire system, making it reliable for fetching specific entities.

```astro
const { uniqueid } = Astro.params;
// ....
await useEntitiesApi().entityByUniqueid({ 
    uniqueid,
    lang: Astro.currentLocale,
  });
```

### Multiple Languages (i18n)

Refer to the [Astro internationalization documentation](https://docs.astro.build/en/guides/internationalization/) to configure languages. Ensure that the languages used in Flyo are defined in the `locales` array, and set the default language in `defaultLocale` in `astro.config.mjs`.

```astro
import { defineConfig } from "astro/config"
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false
    }
  }
})
```

> [!NOTE]  
> Flyo's i18n setup always prefixes the default language, making it essential to configure this in the i18n routing to avoid errors with adapters like Vercel.

All endpoints accept a `lang` parameter to retrieve data in the desired language. The **Nitro Astro** package handles this automatically. However, since the Entity Details page is custom-built, you need to manually pass the language parameter.

+ For slug-based requests: 
  ```js
  await useEntitiesApi().entityBySlug({ slug, lang: Astro.currentLocale });
  ```
+ For unique ID-based requests: 
  ```js
  await useEntitiesApi().entityByUniqueid({ uniqueid, lang: Astro.currentLocale });
  ```

> [!NOTE]  
> If your entity details are internationalized (i18n), you need to create separate detail pages for each language.

```
.
├── de
│   └── detail
│       └── [slug].astro
├── fr
│   └── detail
│       └── [slug].astro
```

The above structure would be `/de/detail/[slug].astro` and `/fr/detail/[slug].astro`.

## API Functions

The Flyo Nitro Astro package provides several API functions to interact with the Flyo Nitro CMS:

### Configuration APIs

#### `useConfig(astro: AstroGlobal)`

Returns the resolved configuration object that includes navigation containers and other config data. This is typically used in layouts and pages.

```astro
---
import { useConfig } from "@flyo/nitro-astro";

const config = await useConfig(Astro);
// Access navigation items
config.containers.nav.items.map((item) => ...)
// Access available pages
config.pages.includes(slug)
---
```

#### `useConfigApi()`

Returns the ConfigApi instance for making custom configuration requests.

```astro
---
import { useConfigApi } from "@flyo/nitro-astro";

const configApi = useConfigApi();
const config = await configApi.config({ lang: "en" });
---
```

#### `useConfiguration()`

Returns the API main configuration which holds the access key and is globally available.

```typescript
import { useConfiguration } from "@flyo/nitro-astro";

const configuration = useConfiguration();
```

### Page APIs

#### `usePagesApi()`

Returns the PagesApi instance for fetching Flyo pages.

```astro
---
import { usePagesApi } from "@flyo/nitro-astro";

const pagesApi = usePagesApi();
const page = await pagesApi.page({ slug: "about" });
---
```

### Entity APIs

#### `useEntitiesApi()`

Returns the EntitiesApi instance for fetching entity details.

```astro
---
import { useEntitiesApi } from "@flyo/nitro-astro";

// Fetch by slug and type ID
const entity = await useEntitiesApi().entityBySlug({
  slug: "my-post",
  lang: Astro.currentLocale,
  typeId: 54
});

// Or fetch by unique ID
const entity = await useEntitiesApi().entityByUniqueid({
  uniqueid: "abc123",
  lang: Astro.currentLocale
});
---
```

### Search APIs

#### `useSearchApi()`

Returns the SearchApi instance for performing search operations.

```astro
---
import { useSearchApi } from "@flyo/nitro-astro";

const searchApi = useSearchApi();
// Use the search API for custom search functionality
---
```

### Sitemap APIs

#### `useSitemapApi()`

Returns the SitemapApi instance. The sitemap is automatically generated at `/sitemap.xml`, but you can use this API for custom sitemap functionality.

```astro
---
import { useSitemapApi } from "@flyo/nitro-astro";

const sitemapApi = useSitemapApi();
const sitemap = await sitemapApi.sitemap();
---
```

### Version APIs

#### `useVersionApi()`

Returns the VersionApi instance for checking API versions.

```astro
---
import { useVersionApi } from "@flyo/nitro-astro";

const versionApi = useVersionApi();
// Use for version-specific functionality
---
```

### Helper Functions

#### `editable(block)`

Makes a block editable in the Flyo live edit mode. Returns an object with the `data-flyo-uid` attribute.

```astro
---
import { editable } from "@flyo/nitro-astro";
const { block } = Astro.props;
---

<div {...editable(block)}>
  <!-- Block content -->
</div>
```

> **Note**: `editableBlock` is also available as a backwards-compatible alias for `editable`.

## Built-in Features

### Automatic Sitemap Generation

The integration automatically creates a `/sitemap.xml` route that includes all your Flyo pages and entities. Make sure to set the `site` property in your `astro.config.mjs`:

```js
export default defineConfig({
  site: "https://myflyowebsite.com",
  // ... rest of config
});
```

### Image Service Integration

The package includes an automatic image service that integrates with Flyo Storage's image transformation capabilities. Images are automatically processed through Flyo's CDN with support for:

- Dynamic resizing (`width` and `height`)
- Format conversion (defaults to WebP)
- Lazy loading
- Proper dimensions to prevent CLS

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

The image URL is automatically transformed to: `https://storage.flyo.cloud/image_xxx.jpg/thumb/1920x768?format=webp`

### Development Toolbar

When running in development mode, the integration adds a custom toolbar with quick links to:
- Flyo Cloud Login
- Flyo Nitro Developer Portal
- Flyo Nitro API Documentation

### Middleware & Caching

The integration automatically adds middleware that:
- Resolves the Flyo configuration on each request
- Sets appropriate cache headers for production (configurable via `clientCacheHeaderTtl` and `serverCacheHeaderTtl`)
- Disables caching when `liveEdit` is enabled

Cache headers set:
- `Cache-Control`: Client-side caching
- `CDN-Cache-Control`: CDN caching
- `Vercel-CDN-Cache-Control`: Vercel-specific caching

### Live Edit Mode

When `liveEdit` is enabled, the integration:
- Injects JavaScript to enable page refresh from the Flyo interface
- Wires up all elements with `data-flyo-uid` for direct editing
- Highlights and enables click-to-edit functionality
- Shows fallback components when blocks are missing

## Best Practices

### Component Organization

Organize your Flyo components in a dedicated directory (default: `src/components/flyo`):

```
src/
  components/
    flyo/
      Text.astro
      CardsGrid.astro
      Hero.astro
      wysiwyg/
        Image.astro
        Video.astro
```

### Error Handling

Always wrap API calls in try-catch blocks and return appropriate responses:

```astro
---
let page;
try {
  page = await usePagesApi().page({ slug });
} catch (e) {
  return new Response("Not Found", {
    status: 404,
    statusText: "Page Not Found"
  });
}
---
```

### Environment Variables

Use environment variables for sensitive configuration:

```bash
# .env
FLYO_ACCESS_TOKEN=your_token_here
FLYO_LIVE_EDIT=true
```

### TypeScript Support

The package is fully typed and exports TypeScript types from `@flyo/nitro-typescript`:

```typescript
import type { Block, Page, Entity } from "@flyo/nitro-typescript";
```
