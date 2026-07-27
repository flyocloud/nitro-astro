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
        // Only the bundle entry needs generated declarations: `exports` in
        // package.json resolves every other subpath (./cdn.ts, ./middleware.ts,
        // ./sitemap.ts, ./toolbar.ts and the components) to the shipped source,
        // so declarations for those were emitted but never resolved by anyone.
        include: ["index.ts"],
      }) as unknown as Plugin,
    ],
  };
});
