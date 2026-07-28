/// <reference types="vite/client" />

declare module "virtual:*" {
  const component: any;
  export default component;
}

// `.astro` imports are not declared here: an ambient `*.astro` module would only
// fix the shims for our own build, and it cannot be published without flattening
// every consumer's component props to `any`. Each shim gets a sibling
// `components/X.astro.d.ts` instead, which ships. See AGENTS.md.
