# UPGRADE

This document will help you upgrading from a Version into another.

## from 1.x to 2.x

- BREAKING CHANGE: useConfig() param signature has changed. The language parameter when accessing the config has been removed and the full Astro context object is now required.

before (in 1.x):

```astro
const config = await useConfig(Astro.currentLocale)
```

now (in 2.x):

```astro
const config = await useConfig(Astro);
```

The config is typically requested in the Layout of your Astro Project. See the `src/layouts` folder
