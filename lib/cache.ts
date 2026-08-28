import type { APIContext, AstroGlobal } from "astro";

/**
 * Anything carrying the per-request `locals` bag: `Astro` inside a page or
 * component, `context` inside middleware and endpoints. The two Astro types
 * share no common ancestor, so the pair is spelled out.
 */
export type FlyoRequestContext =
  | Pick<AstroGlobal, "locals">
  | Pick<APIContext, "locals">;

/**
 * The `locals` key the middleware reads. Deliberately not part of the public
 * API — write it with `disableCache()` and read it with `isCacheDisabled()`.
 */
const DISABLE_CACHE = "flyoDisableCache";

/**
 * Directives for a response nothing may keep a copy of. `no-store` alone is
 * enough for a well behaved cache; `private`, `max-age=0` and
 * `must-revalidate` cover the ones that are not.
 */
const NO_STORE_CLIENT = "private, no-store, max-age=0, must-revalidate";
const NO_STORE_SERVER = "no-store";

/** The cache relevant integration options, as `useFlyoIntegration()` resolves them. */
export interface CacheHeaderOptions {
  liveEdit?: boolean;
  clientCacheHeaderTtl?: number;
  serverCacheHeaderTtl?: number;
}

function localsOf(context: FlyoRequestContext | null | undefined) {
  const locals = context?.locals as Record<string, unknown> | undefined;
  return locals && typeof locals === "object" ? locals : null;
}

/**
 * Marks the current request as uncacheable: the middleware answers it with
 * `no-store` at the client and at the server/CDN, instead of the configured
 * TTLs.
 *
 * Draft links do this on their own through `useEntitiesApi(Astro)` — a draft is
 * a shareable, expiring snapshot of content that is still offline, so a CDN
 * copy would hand it to everyone and a browser copy would outlive the link.
 * Call it yourself for anything else that must not be cached: a personalised
 * page, a response built from a cookie, an entity fetched through the raw API
 * methods.
 *
 * It has to run while the page frontmatter runs, which is where the response is
 * assembled. A nested component renders after the middleware has written the
 * headers, so calling it from there is too late.
 */
export function disableCache(context: FlyoRequestContext): void {
  const locals = localsOf(context);

  if (!locals) {
    console.error(
      "disableCache() needs the Astro context: `Astro` in a page or component, `context` in an endpoint or middleware."
    );
    return;
  }

  locals[DISABLE_CACHE] = true;
}

/** Whether `disableCache()` has been called for this request. */
export function isCacheDisabled(context: FlyoRequestContext): boolean {
  return localsOf(context)?.[DISABLE_CACHE] === true;
}

/**
 * Writes the cache headers of a response: the configured TTLs, or `no-store`
 * when the request was marked uncacheable.
 *
 * Live edit gets neither — the editor has to see the change it just made — but
 * an uncacheable request still gets `no-store`, because "no header" leaves the
 * decision to whatever sits in front of the app.
 */
export function applyCacheHeaders(
  response: Response,
  context: FlyoRequestContext,
  options: CacheHeaderOptions | null | undefined
): void {
  // Without the integration options there is no TTL to apply, and no way to
  // tell live edit from production. Better to leave the response untouched.
  if (!response?.headers || !options) {
    return;
  }

  if (isCacheDisabled(context)) {
    response.headers.set("Vercel-CDN-Cache-Control", NO_STORE_SERVER);
    response.headers.set("CDN-Cache-Control", NO_STORE_SERVER);
    response.headers.set("Cache-Control", NO_STORE_CLIENT);
    return;
  }

  if (options.liveEdit) {
    return;
  }

  response.headers.set(
    "Vercel-CDN-Cache-Control",
    `max-age=${options.serverCacheHeaderTtl}`
  );
  response.headers.set(
    "CDN-Cache-Control",
    `max-age=${options.serverCacheHeaderTtl}`
  );
  response.headers.set(
    "Cache-Control",
    `max-age=${options.clientCacheHeaderTtl}`
  );
}
