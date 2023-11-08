# nitro-astro
Flyo Nitro for Astro Framework

## Install

The astro.config.mjs file:

```js
import flyoNitroIntegration from '@flyo/nitro-astro';

export default defineConfig({
  integrations: [
    flyoNitroIntegration({
      accessToken: 'N0vxfdfd275jSoEvFion7dfdfsdfasdfasd4n95zFroAZ', // switch between dev and prod token depending on the enviroment
      liveEdit: true, // on dev and preview system this should be enabled, as this allows to reload the application inside the flyo preview frame when things change
      components: { // define where the flyo components are located the suffix .astro is no required. Object key is the value from flyo, while object value is the component inside astro components folder
        "FlyoElementName": "AstroElementName",
        "AnotherFlyoElement": "subfolder/AnotherFlyoElement"
      }
    })
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