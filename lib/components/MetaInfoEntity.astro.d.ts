// Fallback declaration for plain `tsc`, which cannot read `.astro`. Only the
// `.ts` shim beside it resolves this file; Astro tooling resolves the real
// `MetaInfoEntity.astro` and keeps its `Props`. See AGENTS.md.
declare const MetaInfoEntity: (props: Record<string, any>) => any;
export default MetaInfoEntity;
