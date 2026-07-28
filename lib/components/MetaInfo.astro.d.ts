// Fallback declaration for plain `tsc`, which cannot read `.astro`. Only the
// `.ts` shim beside it resolves this file; Astro tooling resolves the real
// `MetaInfo.astro` and keeps its `Props`. See AGENTS.md.
declare const MetaInfo: (props: Record<string, any>) => any;
export default MetaInfo;
