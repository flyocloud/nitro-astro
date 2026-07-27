/// <reference types="vite/client" />

declare module "virtual:*" {
  const component: any;
  export default component;
}

// Astro ships no ambient declaration for `.astro` files: inside an Astro project
// they are resolved by the Astro TypeScript language-service plugin, which the
// plain `tsc` run behind vite-plugin-dts does not use. This keeps the `.ts`
// re-export shims in `components/` resolvable when building the declarations.
// Not published (see `files` in package.json), so consumers keep the richer
// per-component prop types from their own Astro tooling.
declare module "*.astro" {
  const component: (props: Record<string, any>) => any;
  export default component;
}
