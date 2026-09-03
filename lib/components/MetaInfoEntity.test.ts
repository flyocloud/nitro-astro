import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MetaInfoEntity from "./MetaInfoEntity.astro";

async function render(response: Record<string, unknown>) {
  const container = await AstroContainer.create();
  return container.renderToString(MetaInfoEntity, {
    props: { response },
    request: new Request("https://example.com/news/hello"),
  });
}

const entity = { entity: { entity_title: "Hello", entity_teaser: "Teaser" } };

describe("MetaInfoEntity", () => {
  it("renders the entity meta tags", async () => {
    const html = await render(entity);

    expect(html).toContain('name="title" content="Hello"');
    expect(html).toContain('name="description" content="Teaser"');
  });

  it("keeps a draft preview out of the search index", async () => {
    const html = await render({ ...entity, is_draft: true });

    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
  });

  it("emits no robots tag for a regular entity", async () => {
    expect(await render({ ...entity, is_draft: false })).not.toContain(
      'name="robots"'
    );
    expect(await render(entity)).not.toContain('name="robots"');
  });
});
