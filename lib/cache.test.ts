import { describe, it, expect, vi } from "vitest";
import { applyCacheHeaders, disableCache, isCacheDisabled } from "./cache";

/** A stand-in for the Astro context: the `locals` bag is all these functions read. */
function context(locals: Record<string, unknown> = {}) {
  return { locals } as never;
}

const TTL = { clientCacheHeaderTtl: 900, serverCacheHeaderTtl: 1200 };

function headersOf(
  ctx: ReturnType<typeof context>,
  options: Record<string, unknown> | null = TTL
) {
  const response = new Response("<html></html>");
  applyCacheHeaders(response, ctx, options);
  return response.headers;
}

describe("disableCache", () => {
  it("marks the request and reads back as disabled", () => {
    const ctx = context();

    expect(isCacheDisabled(ctx)).toBe(false);
    disableCache(ctx);
    expect(isCacheDisabled(ctx)).toBe(true);
  });

  it("reports a context without locals instead of throwing", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => disableCache(undefined as never)).not.toThrow();
    expect(isCacheDisabled(undefined as never)).toBe(false);
    expect(error).toHaveBeenCalled();

    error.mockRestore();
  });
});

describe("applyCacheHeaders", () => {
  it("sets the configured ttls for a normal request", () => {
    const headers = headersOf(context());

    expect(headers.get("Cache-Control")).toBe("max-age=900");
    expect(headers.get("CDN-Cache-Control")).toBe("max-age=1200");
    expect(headers.get("Vercel-CDN-Cache-Control")).toBe("max-age=1200");
  });

  it("sets no header while live edit is on", () => {
    const headers = headersOf(context(), { ...TTL, liveEdit: true });

    expect(headers.get("Cache-Control")).toBeNull();
    expect(headers.get("CDN-Cache-Control")).toBeNull();
    expect(headers.get("Vercel-CDN-Cache-Control")).toBeNull();
  });

  it("disables client and server caching for a marked request", () => {
    const ctx = context();
    disableCache(ctx);

    const headers = headersOf(ctx);

    expect(headers.get("Cache-Control")).toBe(
      "private, no-store, max-age=0, must-revalidate"
    );
    expect(headers.get("CDN-Cache-Control")).toBe("no-store");
    expect(headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  });

  it("disables caching of a marked request while live edit is on too", () => {
    const ctx = context();
    disableCache(ctx);

    const headers = headersOf(ctx, { ...TTL, liveEdit: true });

    expect(headers.get("Cache-Control")).toContain("no-store");
    expect(headers.get("CDN-Cache-Control")).toBe("no-store");
    expect(headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  });

  it("leaves the response alone without integration options", () => {
    const headers = headersOf(context(), null);

    expect([...headers.keys()]).not.toContain("cache-control");
  });
});
