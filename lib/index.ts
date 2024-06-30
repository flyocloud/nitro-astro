import type { AstroIntegration, AstroGlobal } from "astro";
import {
  Configuration,
  ConfigApi,
  EntitiesApi,
  PagesApi,
  SearchApi,
  SitemapApi,
  VersionApi,
  type Block,
  type ConfigResponse,
} from "@flyo/nitro-typescript";
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

export type IntegrationOptions = {
  accessToken: string;
  liveEdit: string | boolean | number;
  componentsDir: string;
  components: object;
  fallbackComponent?: string;
};

export type FlyoIntegration = {
  config: Configuration;
  options: {
    liveEdit: boolean;
    componentsDir: string;
  };
};

export function useFlyoIntegration(): FlyoIntegration {
  if (!globalThis.flyoNitroInstance) {
    console.error(
      "The Flyo Typescript Configuration has not been initialized correctly"
    );
  }
  return globalThis.flyoNitroInstance;
}

export function useConfiguration(): Configuration {
  return useFlyoIntegration().config;
}

export function useConfigApi(): ConfigApi {
  return new ConfigApi(useConfiguration());
}

export async function useConfig(astro: AstroGlobal): Promise<ConfigResponse> {
  return await astro.locals.config;
}

export function useEntitiesApi(): EntitiesApi {
  return new EntitiesApi(useConfiguration());
}

export function usePagesApi(): PagesApi {
  return new PagesApi(useConfiguration());
}

export function useSearchApi(): SearchApi {
  return new SearchApi(useConfiguration());
}

export function useSitemapApi(): SitemapApi {
  return new SitemapApi(useConfiguration());
}

export function useVersionApi(): VersionApi {
  return new VersionApi(useConfiguration());
}

export function editableBlock(block: Block): object {
  return {
    "data-flyo-block-uid": block.uid,
  };
}

export default function flyoNitroIntegration(
  options: IntegrationOptions
): AstroIntegration {
  const resolvedOptions = {
    accessToken: false,
    liveEdit: false,
    fallbackComponent: null,
    componentsDir: "src/components/flyo",
    ...options,
  };

  if (resolvedOptions.liveEdit === "true") {
    resolvedOptions.liveEdit = true;
  } else if (resolvedOptions.liveEdit === "false") {
    resolvedOptions.liveEdit = false;
  }

  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({
        injectScript,
        updateConfig,
        injectRoute,
        addMiddleware,
      }) => {
        // inject the sitemap xml generator
        injectRoute({
          pattern: "sitemap.xml",
          entrypoint: "@flyo/nitro-astro/sitemap.ts",
        });

        addMiddleware({
          entrypoint: "@flyo/nitro-astro/middleware.ts",
          order: "post",
        });

        // inject the image cdn service
        updateConfig({
          image: {
            service: {
              entrypoint: "@flyo/nitro-astro/cdn.ts",
            },
          },
          vite: {
            plugins: [
              vitePluginFlyoComponents(
                options.componentsDir,
                options.components || {},
                options.fallbackComponent
              ),
            ],
          },
        });

        injectScript(
          "page-ssr",
          `
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${resolvedOptions.accessToken}'
            })

            globalThis.flyoNitroInstance = {
              config: defaultConfig,
              options: {
                liveEdit: ${resolvedOptions.liveEdit},
                componentsDir: '${resolvedOptions.componentsDir}',
              }
            };
          `
        );

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

              // Find all elements with the 'data-flyo-block-uid' attribute
              const elements = document.querySelectorAll('[data-flyo-block-uid]');

              elements.forEach(element => {
                  element.addEventListener('click', function() {
                      openBlockInFlyo(this.getAttribute('data-flyo-block-uid'))
                  });
              });
            `
          );
        }
      },
    },
  };
}
