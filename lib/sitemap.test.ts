import { describe, it, expect, vi } from "vitest";
import type { AstroGlobal } from "astro";

const api = vi.hoisted(() => ({ items: [] as Record<string, unknown>[] }));

// The route resolves the SDK through the package itself.
vi.mock("@flyo/nitro-astro", () => ({
  useSitemapApi: () => ({ sitemap: async () => api.items }),
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
  it("lists the resolved href of pages and entities", async () => {
    const xml = await render([
      { entity_type: "nitro-page", entity_slug: "about-us", href: "/about-us" },
      {
        entity_type: "news",
        entity_slug: "news-title-1",
        href: "/news/news-title-1",
        routes: { detail: "/ignored" },
      },
    ]);

    expect(xml).toContain("<loc>https://example.com/about-us</loc>");
    expect(xml).toContain("<loc>https://example.com/news/news-title-1</loc>");
    expect(xml).not.toContain("ignored");
  });

  it("reads the sitemap item model of the API, nothing else", async () => {
    // What /sitemap delivers per entry: the id, the timestamp and the resolved
    // url. Titles, teasers, images and the type id live on the entity/search
    // model and are not part of a sitemap item.
    const xml = await render([
      {
        entity_unique_id: "12_K6uT5tY4TwXRL3",
        updated_at: 1739276400,
        href: "/news/news-title-1",
      },
    ]);

    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        "<url><loc>https://example.com/news/news-title-1</loc>" +
        "<lastmod>2025-02-11T12:20:00Z</lastmod></url>" +
        "</urlset>"
    );
  });

  it("emits updated_at as lastmod", async () => {
    const xml = await render([
      { href: "/about-us", updated_at: 1739276400 },
      { href: "/news/news-title-1", updated_at: 1739362800 },
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
      { href: "/about-us" },
      { href: "/contact", updated_at: 0 },
      { href: "/news/one", updated_at: null },
    ]);

    expect(xml).toContain("<url><loc>https://example.com/about-us</loc></url>");
    expect(xml).toContain("<url><loc>https://example.com/contact</loc></url>");
    expect(xml).toContain("<url><loc>https://example.com/news/one</loc></url>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("keeps one entry per location with the most recent timestamp", async () => {
    const xml = await render([
      { href: "/about-us", updated_at: 1739276400 },
      { href: "/about-us", updated_at: 1739362800 },
    ]);

    expect(
      xml.match(/<loc>https:\/\/example\.com\/about-us<\/loc>/g)
    ).toHaveLength(1);
    expect(xml).toContain("<lastmod>2025-02-12T12:20:00Z</lastmod>");
  });

  it("skips items without a listable href", async () => {
    const xml = await render([
      { entity_type: "nitro-page", entity_slug: "no-href" },
      { href: "" },
      { href: "mailto:hello@flyo.ch" },
      { href: "https://other.example.com/page" },
      { href: "//other.example.com/page" },
    ]);

    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
  });
});
