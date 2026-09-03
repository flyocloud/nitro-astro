import { defineConfig, Plugin } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

const name = "nitro-astro";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "index.ts"),
        name: "flyoNitroIntegration",
        fileName: (format) => (format === "es" ? `${name}.mjs` : `${name}.js`),
      },
    },
    plugins: [
      dts({
        outDir: "dist/types",
        // The bundle entry plus what it re-exports. `exports` in package.json
        // resolves every other subpath (./middleware.ts, ./sitemap.ts,
        // ./toolbar.ts and the components) to the shipped source, so
        // declarations for those were emitted but never resolved by anyone.
        include: ["index.ts", "cdn.ts", "cache.ts"],
        // One self-contained file. Without the rollup, `export … from "./cdn"`
        // survives into dist/types/index.d.ts as a relative import that resolves
        // to nothing beside it, and consumers see no error for it — every Astro
        // tsconfig sets skipLibCheck — the re-exported symbols just degrade to
        // `any`. The rollup inlines them, and emits nothing but index.d.ts, which
        // is what packaging.test.ts checks for.
        rollupTypes: true,
      }) as unknown as Plugin,
    ],
  };
});
