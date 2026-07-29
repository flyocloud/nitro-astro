# @flyo/nitro-astro

This directory contains the source code for the **@flyo/nitro-astro** package — an Astro integration for connecting the Flyo Headless Content Hub into your Astro projects.

## What's Included

- **Astro Integration**: Registers the middleware, image service, dev toolbar app and live edit script
- **Block Components**: `FlyoNitroPage`, `FlyoNitroBlock`, `BlockSlot`, `FallbackComponent`
- **Meta Components**: `MetaInfo`, `MetaInfoPage`, `MetaInfoEntity`, `DebugInfo`
- **WYSIWYG Renderer**: `FlyoWysiwyg` for ProseMirror/TipTap JSON with per-node overrides
- **API Helpers**: `useConfig`, `usePagesApi`, `useEntitiesApi`, `useSearchApi`, `useSitemapApi` and friends
- **CDN & Sitemap**: Flyo storage image service and an automatic `/sitemap.xml` route

## Documentation

For complete documentation, installation instructions, and usage examples, please visit:

**https://github.com/flyocloud/nitro-astro**

- Usage guide & API reference: https://github.com/flyocloud/nitro-astro#usage
- AI integration advisory: https://github.com/flyocloud/nitro-astro/blob/main/ai-instructions-astro.md
- Upgrade guide: https://github.com/flyocloud/nitro-astro/blob/main/UPGRADE.md

## Development

```bash
# Install dependencies (from the repository root)
npm install

# Build the package
npm run build

# Run tests
npm test

# Development mode (watch)
npm run dev
```

## Package Structure

- `index.ts` — Integration entry point (the only bundled file)
- `components/` — Astro components, shipped as raw source
- `cdn.ts`, `middleware.ts`, `sitemap.ts`, `toolbar.ts` — Runtime modules, shipped as raw source
- `dist/` — Built output (generated)
- `vite.config.ts` — Build configuration
- `vitest.config.ts` — Test configuration

See [AGENTS.md](https://github.com/flyocloud/nitro-astro/blob/main/AGENTS.md) for the rules on adding components and exports.
