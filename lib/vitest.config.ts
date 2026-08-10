/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default getViteConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      // Ahead of the bare-name alias, which would otherwise swallow the subpath.
      '@flyo/nitro-astro/componentKey': fileURLToPath(new URL('./componentKey.ts', import.meta.url)),
      '@flyo/nitro-astro': fileURLToPath(new URL('./index.ts', import.meta.url)),
      // The real module is emitted by vite-plugin-flyo-components at build time
      // from the consumer's `components` option; test/flyo-components.ts is the
      // same shape with two components registered in it.
      'virtual:flyo-components': fileURLToPath(new URL('./test/flyo-components.ts', import.meta.url)),
    },
  },
});
