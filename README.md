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
      components: { 
        // define where the flyo components are located the suffix .astro is no required. Object key is the value from flyo, while object value is the component inside astro components folder
        // [!] Adding new elements requires the dev process to restart (it seems)
        "FlyoElementName": "AstroElementName",
        "AnotherFlyoElement": "subfolder/AnotherFlyoElement"
      }
    })
  ],
});
```

Add a `[...slug].astro` file in pages directory with the following exmaple content as a catch all cms handler:

```astro
---
import Layout from '../layouts/Layout.astro';
import { PagesApi } from '@flyo/nitro-js'
import FlyoNitroPage from '@flyo/nitro-astro/FlyoNitroPage.astro'

const { slug } = Astro.params;
const page = await new PagesApi().page({slug: slug === undefined ? '' : slug})
---
<Layout title={page.title}>
	<FlyoNitroPage page={page} />
</Layout>
```

To recieve the config in the layout:

```astro
---
import { ConfigApi } from '@flyo/nitro-js';

const config = await new ConfigApi().config()
const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
	<head>
		<title>{title}</title>
	</head>
	<body>
		{config.containers.nav.items.map((item: object) => (
			<a style="background-color: red; color: white" href={item.href}>
				{item.label}<br />
			</a>
		))}
		<div class="container">
			<slot />
		</div>
	</body>
</html>
```

Entity Detail Example

```astro
---
import { EntitiesApi } from '@flyo/nitro-js'

const { slug } = Astro.params;
const entity = await new EntitiesApi().entityBySlug(slug);
---
<h1>{ slug }</h1>
<img src={ entity.model.image.source } style="width:100%" />
```

Block Component Example:

```astro
---
import FlyoNitroBlock from '@flyo/nitro-astro/FlyoNitroBlock.astro';
const { block } = Astro.props
---
<!-- content variable -->
<div set:html={block.content.content.html} />

<!-- handling items -->
{block.items.map((item: object) => (
    <div>
        { item.title }
        <a href={item.link.routes.detail}>Go to Detail</a>
    </div>
))}

<!-- handling slots -->
{block.slots.slotcontainername.content.map((block: object) => (
    <FlyoNitroBlock block={block} />
))}
```

## Development

1. `npm install`
2. `npm run build`