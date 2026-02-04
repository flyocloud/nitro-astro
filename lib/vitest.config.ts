/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default getViteConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@flyo/nitro-astro': fileURLToPath(new URL('./index.ts', import.meta.url)),
    },
  },
});
