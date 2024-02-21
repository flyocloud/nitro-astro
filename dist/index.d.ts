import type { AstroIntegration } from "astro";
import { Configuration, ConfigApi, EntitiesApi, PagesApi, SearchApi, SitemapApi, VersionApi, Block, ConfigResponse } from '@flyo/nitro-typescript';
export type IntegrationOptions = {
    accessToken: string;
    liveEdit: any;
    componentsDir: string;
    components: object;
    fallbackComponent?: string;
};
export declare function useConfiguration(): Configuration;
export declare function useConfigApi(): ConfigApi;
export declare function useConfig(): Promise<ConfigResponse>;
export declare function useEntitiesApi(): EntitiesApi;
export declare function usePagesApi(): PagesApi;
export declare function useSearchApi(): SearchApi;
export declare function useSitemapApi(): SitemapApi;
export declare function useVersionApi(): VersionApi;
export declare function editableBlock(block: Block): object;
export default function flyoNitroIntegration(options: IntegrationOptions): AstroIntegration;
