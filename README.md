# nitro-astro
Flyo Nitro for Astro Framework

## Install

The astro.config.mjs file:

```js
import flyoNitroIntegration from '@flyo/nitro-astro';

export default defineConfig({
  integrations: [
    flyoNitroIntegration({accessToken: 'N0vxR2275jSoEvFion7UNSGKS6JscMM2GvOZUo4n95zFroAZ'})
  ],
});
```

Add a `[...slug].astro` filein pages directory with the following exmaple content:

```astro
---
import Layout from '../layouts/Layout.astro';
import { PagesApi } from '@flyo/nitro-js'

const { slug } = Astro.params;
const page = await new PagesApi().page({slug: slug === undefined ? '' : slug})
---
<Layout title={page.title}>
	<h1>{page.title}</h1>
</Layout>

```

## Development

1. `npm install`
2. `npm run build`