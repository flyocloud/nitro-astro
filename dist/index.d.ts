import type { AstroIntegration } from "astro";
import { Configuration, ConfigApi, EntitiesApi, PagesApi, SearchApi, SitemapApi, VersionApi } from '@flyo/nitro-typescript';
export type IntegrationOptions = {
    accessToken: string;
    liveEdit: boolean;
    componentsDir: string;
    components: object;
    fallbackComponent?: string;
};
export declare function useConfiguration(): Configuration;
export declare function useConfigApi(): ConfigApi;
export declare function useEntitiesApi(): EntitiesApi;
export declare function usePagesApi(): PagesApi;
export declare function useSearchApi(): SearchApi;
export declare function useSitemapApi(): SitemapApi;
export declare function useVersionApi(): VersionApi;
export default function flyoNitroIntegration(options: IntegrationOptions): AstroIntegration;
