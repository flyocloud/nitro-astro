import { defineConfig } from "vite";
import path from "path";

const name = "nitro-astro";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "flyoNitroIntegration",
        fileName: (format) => (format === "es" ? `${name}.mjs` : `${name}.js`),
      },
      rollupOptions: {
        output: {
          exports: "named", // Set the output.exports to 'named'
        },
      },
    },
  };
});
