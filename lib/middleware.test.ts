import { describe, it, expect, vi, beforeEach } from "vitest";

const integration = vi.hoisted(() => ({
  options: {} as Record<string, unknown> | null,
}));

// Only the two config helpers are stubbed: `applyCacheHeaders` and
// `isCacheDisabled` are the real thing, so this covers the whole loop from the
// page marking a request to the headers the visitor receives.
vi.mock("@flyo/nitro-astro", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useConfigApi: () => ({ config: async () => ({ pages: [] }) }),
  useFlyoIntegration: () => ({ config: {}, options: integration.options }),
}));

const { onRequest } = await import("./middleware");

/** Runs the middleware around a page that may mark the request uncacheable. */
async function handle({ draft = false } = {}) {
  const context = {
    locals: {} as Record<string, unknown>,
    currentLocale: "en",
  };

  const response = await onRequest(
    context as never,
    (async () => {
      if (draft) {
        const { disableCache } = await import("./cache");
        disableCache(context as never);
      }
      return new Response("<html></html>");
    }) as never
  );

  return { context, headers: (response as Response).headers };
}

beforeEach(() => {
  integration.options = {
    liveEdit: false,
    clientCacheHeaderTtl: 900,
    serverCacheHeaderTtl: 1200,
  };
});

describe("middleware", () => {
  it("exposes the resolved config on locals", async () => {
    const { context } = await handle();

    expect(await context.locals.config).toEqual({ pages: [] });
  });

  it("sets the configured cache ttls", async () => {
    const { headers } = await handle();

    expect(headers.get("Cache-Control")).toBe("max-age=900");
    expect(headers.get("CDN-Cache-Control")).toBe("max-age=1200");
    expect(headers.get("Vercel-CDN-Cache-Control")).toBe("max-age=1200");
  });

  it("answers a draft page with no-store at the client and the cdn", async () => {
    const { headers } = await handle({ draft: true });

    expect(headers.get("Cache-Control")).toBe(
      "private, no-store, max-age=0, must-revalidate"
    );
    expect(headers.get("CDN-Cache-Control")).toBe("no-store");
    expect(headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  });

  it("sets no cache header while live edit is on", async () => {
    integration.options = { ...integration.options, liveEdit: true };

    const { headers } = await handle();

    expect(headers.get("Cache-Control")).toBeNull();
  });
});
