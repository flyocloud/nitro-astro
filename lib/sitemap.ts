import { useSitemapApi } from "./index.ts"

function buildUrl(path: string, domain: string) {
  return `${domain.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function GET(config: any) {
  const sitemap = await useSitemapApi().sitemap();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  const routes = [];
  for (const item of sitemap) {
    if (item.entity_type === 'nitro-page') {
      if (routes.includes(item.entity_slug)) {
        continue;
      }
      routes.push(item.entity_slug);
      xml += `<url><loc>${buildUrl(item.entity_slug, config.site.origin)}</loc></url>`;
    } else if (item.routes?.detail) {
      xml += `<url><loc>${buildUrl(item.routes['detail'], config.site.origin)}</loc></url>`;
    }
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}