# Flyo Nitro Astro Framework Integration

The Flyo Nitro Astro Framework Integration provides a comprehensive solution for implementing the Flyo Nitro CMS within the Astro (astro.build) environment. This guide details the integration process, emphasizing the use of Nitro [configurations](https://dev.flyo.cloud/dev/nitro/#die-grundlagen-von-nitro) within the Astro layout framework. Key highlights include:

+ **Nitro Configuration in Astro**: This section explores methods for incorporating Nitro configurations into the Astro layout, offering step-by-step instructions for seamless integration that leverages the strengths of both systems.
+ **Page Resolution and Block Integration**: Learn to manage and resolve pages within the Astro framework, including integrating Nitro's dynamic [blocks](https://dev.flyo.cloud/dev/nitro/block.html). This part provides insights into creating responsive and interactive web pages using Nitro block technology.
+ **Fetching Entity Details**: Focus on techniques for retrieving and displaying detailed information about entities within Astro. This segment covers data fetching, handling, and presentation methods.
+ **Image Service Integration**: Understand the integration of Flyo Storage's image service, as detailed in [Flyo Storage Documentation](https://dev.flyo.cloud/dev/infos/images.html). This section delves into working with images in Astro, including uploading, retrieving, and displaying images from Flyo Storage.
+ **Meta Information Extraction**: The guide concludes with extracting and utilizing meta information, discussing the importance of meta tags for SEO and user engagement within the Astro framework.

This guide targets developers and web designers aiming to combine Flyo Nitro CMS and Astro framework capabilities to create dynamic, efficient, and feature-rich websites.

## Installation

To install the package, execute the following command:

```bash
astro add @flyo/nitro-astro
```

Then, revise and adjust the configuration in your `astro.config.mjs`:

```js
import flyoNitroIntegration from '@flyo/nitro-astro';

export default defineConfig({
  site: "https://myflyowebsite.com", // required to make the sitemap.xml work
  integrations: [
    flyoNitroIntegration({
      accessToken: 'ADD_YOUR_TOKEN_HERE', // Switch between dev and prod tokens depending on the environment
      liveEdit: true, // Enable on dev and preview systems for application reloading in the Flyo preview frame upon changes
      components: { 
        // Define where the Flyo components are located. The suffix .astro is not required. The object key is the value from Flyo, while the object value is the component in the Astro components folder
        // [!] Adding new elements requires restarting the development process
        "FlyoElementName": "AstroElementName",
        "AnotherFlyoElement": "subfolder/AnotherFlyoElement"
      }
    })
  ],
  output: 'server'
});
```

> The nitro astro integration requires an SSR setup which is done by using `output: 'server'`.

### Pages

Add a `[...slug].astro` file in the pages directory with the following example content as a catch-all CMS handler:

```astro
---
import Layout from '../layouts/Layout.astro';
import { usePagesApi } from '@flyo/nitro-astro';
import FlyoNitroPage from '@flyo/nitro-astro/FlyoNitroPage.astro'
import MetaInfoPage from '@flyo/nitro-astro/MetaInfoPage.astro';

const { slug } = Astro.params;
let page;
try {
  page = await usePagesApi().page({slug: slug === undefined ? '' : slug})
} catch (e) {
  return new Response(e.body.name, {
    status: 404,
    statusText: 'Page Not Found'
  });
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
import { useConfigApi } from "@flyo/nitro-astro";

const config = await useConfigApi().config();
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
    {config.containers.nav.items.map((item: object) => (
      <a style="background-color: red; color: white" href={item.href} class={`nav-class ${currentPath === item.href ? 'text-red' : ''}`}>
        {item.label}<br />
      </a>
    ))}
    <div class="container">
      <slot />
    </div>
  </body>
</html>
```

### Blocks

Block Component Example (which are mostly located in `src/components/flyo`):

```astro
---
import { Image } from "astro:assets"
import { editableBlock } from '@flyo/nitro-astro'
import BlockSlot from '@flyo/nitro-astro/BlockSlot.astro'
const { block } = Astro.props;
---
<!-- Make the block editable if necessary -->
<div {...editableBlock(block)}>

  <!-- Content variable -->
  <div set:html={block.content.content.html} />

  <!-- Handling items -->
  {block.items.map((item: object) => (
    <div>
      { item.title }
      <a href={item.link.routes.detail}>Go to Detail</a>
    </div>
  ))}

  <!-- Image Proxy -->
  <Image src={block.content.image.source} alt={block.content.alt ?? ''} width={1920} height={768} />

  <!-- Handling slots -->
  <BlockSlot slot={block.slots.mysuperslotname} />
</div>
```

### Entities

Entity Detail Example, for a file which is located in `src/pages/blog/[slug].astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { useEntitiesApi } from '@flyo/nitro-astro';
import MetaInfoEntity from '@flyo/nitro-astro/MetaInfoEntity.astro';

const { slug } = Astro.params;
let response = null;
try {
  response = await useEntitiesApi().entityBySlug({ slug });
} catch (e) {
  return new Response(e.body, {
    status: 404,
    statusText: 'Entity Not Found'
  });
}
const isProd = import.meta.env.PROD;
---
<Layout>
  <MetaInfoEntity response={response} slot="head" />
  <h1>{ slug }</h1>
  <img src={ response.model.image.source } style="width:100%" />
</Layout>
{ isProd && <script is:inline define:vars={{ api: response.entity.entity_metric.api }}>fetch(api)</script> }
```
