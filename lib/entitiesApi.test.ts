import { describe, it, expect, vi, beforeEach } from "vitest";

const sdk = vi.hoisted(() => ({
  response: {} as Record<string, unknown>,
  calls: [] as unknown[],
}));

// The two endpoints that also resolve a draft token. Everything else about the
// generated client is irrelevant here — no request must leave the test.
vi.mock("@flyo/nitro-typescript", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  EntitiesApi: class {
    async entityBySlug(requestParameters: unknown) {
      sdk.calls.push(requestParameters);
      return sdk.response;
    }
    async entityByUniqueid(requestParameters: unknown) {
      sdk.calls.push(requestParameters);
      return sdk.response;
    }
  },
}));

const { useEntitiesApi, isCacheDisabled } = await import("./index");

function context() {
  return { locals: {} } as never;
}

beforeEach(() => {
  sdk.response = {};
  sdk.calls = [];
  (globalThis as Record<string, unknown>).flyoNitroInstance = {
    config: {},
    options: {
      accessToken: "token",
      liveEdit: false,
      componentsDir: "src/components/flyo",
      clientCacheHeaderTtl: 900,
      serverCacheHeaderTtl: 1200,
    },
  };
});

describe("useEntitiesApi", () => {
  it("disables caching when the slug resolved to a draft", async () => {
    sdk.response = { is_draft: true, draft_expires_at: 1739276400 };
    const ctx = context();

    const response = await useEntitiesApi(ctx).entityBySlug({ slug: "token" });

    expect(response.is_draft).toBe(true);
    expect(isCacheDisabled(ctx)).toBe(true);
  });

  it("disables caching when the unique id resolved to a draft", async () => {
    sdk.response = { is_draft: true };
    const ctx = context();

    await useEntitiesApi(ctx).entityByUniqueid({ uniqueid: "token" });

    expect(isCacheDisabled(ctx)).toBe(true);
  });

  it("keeps caching for a regular entity response", async () => {
    sdk.response = { is_draft: false, draft_expires_at: null };
    const ctx = context();

    await useEntitiesApi(ctx).entityBySlug({ slug: "hello-world" });

    expect(isCacheDisabled(ctx)).toBe(false);
  });

  it("passes the request parameters through untouched", async () => {
    await useEntitiesApi(context()).entityBySlug({ slug: "hello", typeId: 54 });

    expect(sdk.calls).toEqual([{ slug: "hello", typeId: 54 }]);
  });

  it("works without a context, leaving the cache decision to the caller", async () => {
    sdk.response = { is_draft: true };

    const response = await useEntitiesApi().entityBySlug({ slug: "token" });

    expect(response.is_draft).toBe(true);
  });
});
