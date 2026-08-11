import { describe, it, expect, vi } from "vitest";
import type { AstroGlobal } from "astro";

const api = vi.hoisted(() => ({ items: [] as Record<string, unknown>[] }));

// The route resolves the SDK through the package itself; the raw response is
// what carries `updated_at`, so the mock has to hand out a real Response.
vi.mock("@flyo/nitro-astro", () => ({
  useSitemapApi: () => ({
    sitemapRaw: async () => ({ raw: new Response(JSON.stringify(api.items)) }),
  }),
}));

const { GET } = await import("./sitemap");

async function render(items: Record<string, unknown>[]) {
  api.items = items;
  const response = await GET({
    site: new URL("https://example.com"),
  } as AstroGlobal);
  return await response.text();
}

describe("sitemap", () => {
  it("emits updated_at as lastmod for pages and entities", async () => {
    const xml = await render([
      {
        entity_type: "nitro-page",
        entity_slug: "about-us",
        updated_at: 1739276400,
      },
      {
        entity_type: "news",
        routes: { detail: "/news/news-title-1" },
        updated_at: 1739362800,
      },
    ]);

    expect(xml).toContain(
      "<url><loc>https://example.com/about-us</loc><lastmod>2025-02-11T12:20:00Z</lastmod></url>"
    );
    expect(xml).toContain(
      "<url><loc>https://example.com/news/news-title-1</loc><lastmod>2025-02-12T12:20:00Z</lastmod></url>"
    );
  });

  it("omits lastmod when no usable timestamp is delivered", async () => {
    const xml = await render([
      { entity_type: "nitro-page", entity_slug: "about-us" },
      { entity_type: "nitro-page", entity_slug: "contact", updated_at: 0 },
      {
        entity_type: "news",
        routes: { detail: "/news/one" },
        updated_at: null,
      },
    ]);

    expect(xml).toContain("<url><loc>https://example.com/about-us</loc></url>");
    expect(xml).toContain("<url><loc>https://example.com/contact</loc></url>");
    expect(xml).toContain("<url><loc>https://example.com/news/one</loc></url>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("keeps one entry per page slug with the most recent timestamp", async () => {
    const xml = await render([
      {
        entity_type: "nitro-page",
        entity_slug: "about-us",
        updated_at: 1739276400,
      },
      {
        entity_type: "nitro-page",
        entity_slug: "about-us",
        updated_at: 1739362800,
      },
    ]);

    expect(
      xml.match(/<loc>https:\/\/example\.com\/about-us<\/loc>/g)
    ).toHaveLength(1);
    expect(xml).toContain("<lastmod>2025-02-12T12:20:00Z</lastmod>");
  });

  it("skips items without a route", async () => {
    const xml = await render([
      { entity_type: "news", routes: { _empty: true } },
      { entity_type: "nitro-page", updated_at: 1739276400 },
    ]);

    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
  });
});
