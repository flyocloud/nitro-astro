import { useSitemapApi } from "@flyo/nitro-astro";
import type { EntityinterfaceInner } from "@flyo/nitro-typescript";
import type { AstroGlobal } from "astro";

/**
 * A sitemap item as the API delivers it. `updated_at` is a Unix timestamp (in
 * seconds) of the last time the content delivered for that entry actually
 * changed, and is the value the API documents as the `lastmod` source. It is
 * not part of the generated SDK model yet, so it is declared here.
 */
type SitemapItem = EntityinterfaceInner & { updated_at?: number };

type SitemapEntry = { loc: string; updatedAt?: number };

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
  // The generated `sitemap()` maps every item through the SDK model, which
  // copies the properties it knows and would drop `updated_at`. Reading the raw
  // response body keeps it until the SDK is regenerated.
  const response = await useSitemapApi().sitemapRaw({});
  const sitemap: SitemapItem[] = await response.raw.json();

  const entries: SitemapEntry[] = [];
  const pageEntries = new Map<string, SitemapEntry>();

  for (const item of sitemap) {
    if (item.entity_type === "nitro-page") {
      if (!item.entity_slug) {
        continue;
      }
      // The same page slug can be delivered by more than one container; keep
      // one entry per slug and the most recent modification date of them.
      const known = pageEntries.get(item.entity_slug);
      if (known) {
        known.updatedAt =
          Math.max(known.updatedAt ?? 0, item.updated_at ?? 0) || undefined;
        continue;
      }
      const entry = {
        loc: buildUrl(item.entity_slug, config.site.origin),
        updatedAt: item.updated_at,
      };
      pageEntries.set(item.entity_slug, entry);
      entries.push(entry);
    } else if (item.routes?.detail) {
      entries.push({
        loc: buildUrl(item.routes["detail"], config.site.origin),
        updatedAt: item.updated_at,
      });
    }
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const entry of entries) {
    xml += `<url><loc>${entry.loc}</loc>${buildLastMod(entry.updatedAt)}</url>`;
  }

  xml += "</urlset>";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
