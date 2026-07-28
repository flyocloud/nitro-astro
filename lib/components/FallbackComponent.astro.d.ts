// Fallback declaration for plain `tsc`, which cannot read `.astro`. Only the
// `.ts` shim beside it resolves this file; Astro tooling resolves the real
// `FallbackComponent.astro` and keeps its `Props`. See AGENTS.md.
declare const FallbackComponent: (props: Record<string, any>) => any;
export default FallbackComponent;
