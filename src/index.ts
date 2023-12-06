import type { AstroIntegration } from "astro";
import { Configuration } from '@flyo/nitro-typescript'
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

export type IntegrationOptions = {
    accessToken: string,
    liveEdit: boolean,
    componentsDir: string,
    components: object,
    fallbackComponent?: string
};

export function useFlyoNitro(): Configuration {
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
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = Configuration({
              apiKey: '${resolvedOptions.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
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

              window.openBlockInFlyo = function(blockUid) {
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