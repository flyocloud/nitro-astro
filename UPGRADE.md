# UPGRADE

This document will help you upgrading from a Version into another.

## 1.x to 2.x

- The language parameter when accessing the config has been removed and the full Astro context object is now required.

before (in 1.x):

```astro
const config = await useConfig(Astro.currentLocale)
```

now (in 2.x):

```astro
const config = await useConfig(Astro);
```
