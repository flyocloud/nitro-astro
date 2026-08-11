import { useSitemapApi } from "@flyo/nitro-astro";
import type { AstroGlobal } from "astro";

type SitemapEntry = { loc: string; updatedAt?: number };

/** An `href` that is not a path of this site — `mailto:`, `tel:`, an absolute url. */
const ABSOLUTE_HREF = /^[a-z][a-z0-9+.-]*:|^\/\//i;

function buildUrl(path: string, domain: string) {
  return `${domain.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/**
 * The `lastmod` element in the W3C datetime format the sitemap protocol
 * requires, or an empty string when the API delivered no usable timestamp —
 * `lastmod` is optional, so omitting it is better than emitting a broken one.
 */
function buildLastMod(updatedAt?: number) {
  if (
    typeof updatedAt !== "number" ||
    !Number.isFinite(updatedAt) ||
    updatedAt <= 0
  ) {
    return "";
  }

  return `<lastmod>${new Date(updatedAt * 1000).toISOString().replace(/\.\d{3}Z$/, "Z")}</lastmod>`;
}

export async function GET(config: AstroGlobal) {
  const sitemap = await useSitemapApi().sitemap();

  const entries = new Map<string, SitemapEntry>();

  for (const item of sitemap) {
    // `href` is the URL the API resolved for the entry, for pages and entities
    // alike. No route or slug guessing: an item without one has no location to
    // list, and one that is not a path of this site does not belong in a sitemap.
    if (!item.href || ABSOLUTE_HREF.test(item.href)) {
      continue;
    }

    const loc = buildUrl(item.href, config.site.origin);

    // The same location can arrive more than once, for instance a page that is
    // delivered by several containers. One entry per location, carrying the most
    // recent modification date of them.
    const known = entries.get(loc);
    if (known) {
      known.updatedAt =
        Math.max(known.updatedAt ?? 0, item.updated_at ?? 0) || undefined;
      continue;
    }

    entries.set(loc, { loc, updatedAt: item.updated_at });
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const entry of entries.values()) {
    xml += `<url><loc>${entry.loc}</loc>${buildLastMod(entry.updatedAt)}</url>`;
  }

  xml += "</urlset>";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
