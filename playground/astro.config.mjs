import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import flyoNitroIntegration from "@flyo/nitro-astro";

const { FLYO_ACCESS_TOKEN, FLYO_LIVE_EDIT } = loadEnv(
  process.env.NODE_ENV,
  process.cwd() + "/",
  ""
);

export default defineConfig({
  compressHTML: true,
  site: "https://myflyowebsite.com", // required to make the sitemap.xml work
  integrations: [
    flyoNitroIntegration({
      accessToken: FLYO_ACCESS_TOKEN,
      liveEdit: FLYO_LIVE_EDIT,
      componentsDir: "src/components/flyo",
      components: {
        Text: "Text",
        CardsGrid: "CardsGrid",
        SlotContainer: "SlotContainer",
      },
    }),
  ],
  output: "server",
});
