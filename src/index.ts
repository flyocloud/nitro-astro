import type { AstroIntegration } from "astro";
import { ApiClient } from '@flyo/nitro-js'
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

export type IntegrationOptions = {
    accessToken: string,
    liveEdit: boolean,
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
    liveEdit: false,
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

        if (resolvedOptions.liveEdit) {
          injectScript(
            "page",
            `
              window.addEventListener("message", (event) => {
                if (event.data?.action === 'pageRefresh') {
                    window.location.reload(true);
                }
              })

              function getActualWindow() {
                if (window === window.top) {
                  return window;
                } else if (window.parent) {
                  return window.parent;
                }
                return window;
              }
              
              function openBlockInFlyo(blockUid) {
                getActualWindow().postMessage({
                    action: 'openEdit',
                    data: JSON.parse(JSON.stringify({item:{uid: blockUid}}))
                }, 'https://flyo.cloud')
              }
            `
          );
        }
      },
    },
  };
}