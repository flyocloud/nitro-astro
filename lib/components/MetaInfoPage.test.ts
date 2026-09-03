import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MetaInfoPage from "./MetaInfoPage.astro";

async function render(props: Record<string, unknown>) {
  const container = await AstroContainer.create();
  return container.renderToString(MetaInfoPage, {
    props,
    request: new Request("https://example.com/page"),
  });
}

describe("MetaInfoPage", () => {
  it("renders the page json-ld as a ld+json script", async () => {
    const html = await render({
      page: {
        meta_json: { title: "About Me" },
        jsonld: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "About Me",
        },
      },
    });

    expect(html).toContain(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"About Me"}</script>'
    );
  });

  it("keeps a non-indexable page out of the search index", async () => {
    const html = await render({ page: { is_indexable: 0 } });

    expect(html).toContain('<meta name="robots" content="noindex">');
  });

  it("emits no robots tag for an indexable page", async () => {
    expect(await render({ page: { is_indexable: 1 } })).not.toContain(
      'name="robots"'
    );
    expect(await render({ page: {} })).not.toContain('name="robots"');
  });

  it("emits no ld+json script without json-ld", async () => {
    const html = await render({ page: { meta_json: { title: "About Me" } } });

    expect(html).toContain('name="title" content="About Me"');
    expect(html).not.toContain("application/ld+json");
  });
});
