import type { AstroIntegration } from "astro";
import { ApiClient } from '@flyo/nitro-js'

export type IntegrationOptions = {
    accessToken: string;
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
      ...options,
    };
    return {
      name: "@flyo/nitro-astro",
      hooks: {
        "astro:config:setup": ({ injectScript, updateConfig }) => {
          
          injectScript(
            "page-ssr",
            `
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