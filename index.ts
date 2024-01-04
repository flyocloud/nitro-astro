import type { AstroIntegration } from "astro";
import { Configuration, ConfigApi, EntitiesApi, PagesApi, SearchApi, SitemapApi, VersionApi } from '@flyo/nitro-typescript'
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

export type IntegrationOptions = {
  accessToken: string,
  liveEdit: boolean,
  componentsDir: string,
  components: object,
  fallbackComponent?: string
};

export function useConfiguration(): Configuration {
  if (!globalThis.flyoNitroInstance) {
    console.error("The Flyo Typescript Configuration has not been initialized correctly");
  }
  return globalThis.flyoNitroInstance;
}

export function useConfigApi() : ConfigApi {
  return new ConfigApi(useConfiguration());
}

export function useEntitiesApi() : EntitiesApi {
  return new EntitiesApi(useConfiguration());
}

export function usePagesApi() : PagesApi {
  return new PagesApi(useConfiguration());
}

export function useSearchApi() : SearchApi {
  return new SearchApi(useConfiguration());
}

export function useSitemapApi() : SitemapApi {
  return new SitemapApi(useConfiguration());
}

export function useVersionApi() : VersionApi {
  return new VersionApi(useConfiguration());
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
      "astro:config:setup": ({ injectScript, updateConfig, injectRoute }) => {

        injectRoute({
          pattern: '/sitemap.xml',
          entrypoint: '/sitemap.js'
        })

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

            var defaultConfig = new Configuration({
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