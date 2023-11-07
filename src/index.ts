import type { AstroIntegration } from "astro";
import { ApiClient } from '@flyo/nitro-js'
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

export type IntegrationOptions = {
    accessToken: string,
    componentsDir: string,
    components: object,
    fallbackComponent?: string
};

export function useFlyoNitro(): ApiClient {
  if (!globalThis.flyoNitroInstance) {
    console.error("flyoNitroInstance has not been initialized correctly");
  }
  return globalThis.flyoNitroInstance;
}

export default function flyoNitroIntegration(
    options: IntegrationOptions
  ): AstroIntegration {

  const resolvedOptions = {
    accessToken: false,
    fallbackComponent: null,
    ...options,
  };

  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginFlyoComponents(
                options.componentsDir,
                options.components,
                options.fallbackComponent
              )
            ],
          },
        })

        injectScript(
          "page-ssr",
          `
            import { ApiClient } from '@flyo/nitro-js'
            var defaultClient = ApiClient.instance;
            defaultClient.defaultHeaders = {}

            let ApiToken = defaultClient.authentications['ApiToken'];
            ApiToken.apiKey = '${resolvedOptions.accessToken}';

            globalThis.flyoNitroInstance = defaultClient;
          `
        ); // do

        injectScript(
          "page",
          `
            console.log('reload')
          `
        );
      },
    },
  };
}