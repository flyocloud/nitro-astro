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

/**
 * Options for configuring the integration.
 */
export interface IntegrationOptions {
  /**
   * Access token for authentication.
   * This is either the production or development token from the flyo cloud interface. Keep in mind that requests for production accessToken will be effectivly cached from the flyo cdn, but the development accessToken requests will not be cached.
   */
  accessToken: string;

  /**
   * Enables live editing mode.
   * If enabled, the user can interact with the components, also it represents the application to be in development mode.
   */
  liveEdit: string | boolean | number;

  /** 
   * Directory path for components.
   * By default the flyo components are located in `src/components/flyo`.
   */
  componentsDir: string;

  /** 
   * Object containing component definitions.
   * The key is the component name defined in Flyo Interface, while the value is the name of the component inside the components directory.
   * ```json
   * components: {
   *  FlyoComponentName: "FlyoComponentName",
   *  AnotherFlyoComponent "subfolder/AnotherFlyoComponent",
   * }
   * ```
   * > The suffix .astro is not required.
   * > Adding new elements to components section, requires restarting the development server.
   */
  components: object;

  /**
   * (Optional) Fallback component name.
   * If provided, this component will be used as a fallback. This fallback component will be used when the requested component is not found and only in live editing mode.
   */
  fallbackComponent?: string;

  /**
   * TTL (Time-To-Live) for client-side cache headers, in seconds.
   * Default is 900 seconds (15 minutes) its only availble if the liveEdit is disabled. Use 0 to disable client caching.
   */
  clientCacheHeaderTtl: number;

  /**
   * TTL (Time-To-Live) for server-side cache headers, in seconds.
   * Default is 1200 seconds (20 minutes) its only availble if the liveEdit is disabled. Use 0 to disable server caching.
   */
  serverCacheHeaderTtl: number;
}

export interface FlyoIntegration {
  config: Configuration;
  options: {
    liveEdit: boolean;
    componentsDir: string;
    clientCacheHeaderTtl: number;
    serverCacheHeaderTtl: number;
  };
}

export function useFlyoIntegration(): FlyoIntegration {
  if (!globalThis.flyoNitroInstance) {
    console.error(
      "The Flyo Typescript Configuration has not been initialized correctly"
    );
  }
  return globalThis.flyoNitroInstance;
}

/**
 * Returns the API main configuration which is used by the SDK.
 * It holds the access key and is globally available.
 */
export function useConfiguration(): Configuration {
  return useFlyoIntegration().config;
}

/**
 * Resolves (if not done) and returns the main configuration object of
 * the SDK, which is done in the middleware.ts and using the useConfigApi()
 * function.
 */
export async function useConfig(astro: AstroGlobal): Promise<ConfigResponse> {
  return await astro.locals.config;
}

export function useConfigApi(): ConfigApi {
  return new ConfigApi(useConfiguration());
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

const flyoSvg = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 163.4 88.5">
<style type="text/css">
    .st8{fill:#FFFFFF;}
</style>
<g id="Ebene_1">
    <g>
        <path class="st8" d="M49,56.7c-0.5-0.3-0.8-0.7-1.2-1.2c-0.4-0.5-0.6-1.2-0.7-1.8c-0.1-0.6-0.2-1.2-0.2-1.8V18.7
            c0-5.2-1.6-9.4-4.8-12.6c-3.2-3.2-8.2-4.8-15-4.8c-6.1,0-10.9,1.5-14.3,4.6C9.4,8.9,7.7,13.3,7.7,19v6.4H1.5V35h6.1v32.1h11.9V35
            h7.7v-9.6h-7.7c0-8.3,0.6-9.4,1.8-11.3c1.2-1.8,3.2-2.8,6.1-2.8c1.5,0,2.7,0.3,3.7,0.8c1,0.5,1.7,1.2,2.3,2.1
            c0.6,0.9,0.9,1.9,1.2,3.1c0.2,1.2,0.3,2.4,0.3,3.7v36.8c0,1.4,0.3,2.6,0.8,3.8c0.5,1.2,1.3,2.2,2.3,3.2c1,0.9,2.1,1.6,3.5,2.1
            c10.1,3,18.5-1.1,18.5-1.1l-4-10.1C52,58.4,49.6,57,49,56.7z"/>
        <path class="st8" d="M146.3,34.6c-1.1-2.9-2.7-5.5-4.9-7.7c-2.1-2.2-4.7-4-7.7-5.3c-3-1.3-6.4-2-10.2-2c-3.8,0-7.2,0.7-10.2,2
            c-3,1.3-5.6,3.1-7.7,5.3c-2.1,2.2-3.7,4.8-4.9,7.7c-1.1,2.9-1.7,6-1.7,9.3c0,3.2,0.6,6.3,1.7,9.2c1.1,2.9,2.7,5.5,4.9,7.7
            c2.1,2.2,4.7,4,7.7,5.3c3,1.3,6.4,2,10.2,2c3.8,0,7.2-0.7,10.2-2c3-1.3,5.6-3.1,7.7-5.3c2.1-2.2,3.7-4.8,4.8-7.7
            c1.1-2.9,1.7-6,1.7-9.2C148,40.6,147.4,37.5,146.3,34.6z M134.8,49.5c-0.6,1.7-1.5,3.2-2.6,4.5c-1.1,1.2-2.4,2.2-3.9,2.9
            c-1.5,0.7-3.1,1-4.8,1c-1.7,0-3.3-0.3-4.8-1c-1.5-0.7-2.8-1.6-3.9-2.9c-1.1-1.2-2-2.7-2.6-4.4s-0.9-3.6-0.9-5.7
            c0-2,0.3-3.9,0.9-5.6c0.6-1.7,1.5-3.2,2.6-4.5c1.1-1.2,2.4-2.2,3.9-2.9c1.5-0.7,3.1-1.1,4.8-1.1c1.7,0,3.3,0.3,4.8,1
            c1.5,0.7,2.8,1.6,3.9,2.9c1.1,1.2,2,2.7,2.6,4.5c0.6,1.7,0.9,3.6,0.9,5.6C135.8,45.8,135.4,47.7,134.8,49.5z"/>
        <path class="st8" d="M88.2,20.4L77,56.8L64.4,20.4H52.1l18.4,46.6c-0.1,0.9-0.2,1.7-0.4,2.6c-0.1,0.4-0.2,0.7-0.3,1.1c0,0,0,0,0,0
            c-0.5,1.2-1,2.4-1.7,3.3c-0.1,0.1-0.1,0.2-0.2,0.3c0,0.1-0.1,0.1-0.2,0.2c-0.8,1-1.8,1.9-3,2.7c0.7,1.7,1.4,3.3,2.2,5.4l1.8,4.7
            c0.3-0.1,0.6-0.3,0.9-0.4c0.3-0.2,0.6-0.3,0.9-0.4c0.2-0.1,0.4-0.2,0.5-0.3c1.3-0.7,2.3-1.4,3.4-2.3c0,0,0.1-0.1,0.1-0.1
            c0.1-0.1,0.3-0.2,0.4-0.4c1.2-1.1,2.2-2.1,3-3.2c1.4-1.8,2.5-3.7,3.3-5.9c0.7-1.8,1.2-3.7,1.4-5.6c0-0.3,0.1-0.6,0.2-1l16.6-47.3
            H88.2z"/>
        <path class="st8" d="M161.3,62.6c-0.3-0.8-0.8-1.6-1.4-2.2c-0.6-0.6-1.3-1.1-2.2-1.5c-0.9-0.4-1.8-0.6-2.9-0.6
            c-1.1,0-2.1,0.2-2.9,0.6c-0.9,0.4-1.6,0.9-2.2,1.5c-0.6,0.6-1.1,1.4-1.4,2.2c-0.3,0.8-0.5,1.7-0.5,2.6c0,0.9,0.2,1.8,0.5,2.6
            c0.3,0.8,0.8,1.6,1.4,2.2c0.6,0.6,1.3,1.1,2.2,1.5c0.9,0.4,1.8,0.6,2.9,0.6c1.1,0,2.1-0.2,2.9-0.6c0.9-0.4,1.6-0.9,2.2-1.5
            c0.6-0.6,1.1-1.4,1.4-2.2c0.3-0.8,0.5-1.7,0.5-2.6C161.7,64.3,161.6,63.4,161.3,62.6z"/>
    </g>
</g>
</svg>
`;

export default function flyoNitroIntegration(
  options: IntegrationOptions
): AstroIntegration {
  const resolvedOptions = {
    accessToken: false,
    liveEdit: false,
    fallbackComponent: null,
    componentsDir: "src/components/flyo",
    serverCacheHeaderTtl: 1200, // 20 minutes
    clientCacheHeaderTtl: 900, // 15 minutes
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
        addDevToolbarApp,
      }) => {
        addDevToolbarApp({
          id: "flyo-nitro",
          name: "Flyo Nitro",
          //icon: 'lightbulb',
          icon: flyoSvg,
          //icon: '<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="60" rx="90" ry="50" fill="#F4A460" /><circle cx="70" cy="45" r="5" fill="white" /><circle cx="90" cy="30" r="5" fill="white" /><circle cx="110" cy="45" r="5" fill="white" /><circle cx="130" cy="30" r="5" fill="white" /><circle cx="150" cy="45" r="5" fill="white" /><path d="M30 90 Q60 75, 90 90 T150 90 Q160 80, 180 90" fill="#228B22" /><rect x="30" y="90" width="140" height="15" fill="#FF6347" /><rect x="30" y="105" width="140" height="15" fill="#FFD700" /><rect x="30" y="120" width="140" height="25" fill="#8B4513" /><ellipse cx="100" cy="160" rx="90" ry="30" fill="#F4A460" /></svg>',
          entrypoint: "@flyo/nitro-astro/toolbar.ts",
        });

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
                resolvedOptions.componentsDir,
                resolvedOptions.components || {},
                resolvedOptions.fallbackComponent
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
                clientCacheHeaderTtl: ${resolvedOptions.clientCacheHeaderTtl},
                serverCacheHeaderTtl: ${resolvedOptions.serverCacheHeaderTtl}
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
