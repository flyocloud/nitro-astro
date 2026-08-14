import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MetaInfo from "./MetaInfo.astro";

async function render(props: Record<string, unknown>) {
  const container = await AstroContainer.create();
  return container.renderToString(MetaInfo, {
    props,
    request: new Request("https://example.com/page"),
  });
}

describe("MetaInfo", () => {
  it("rewrites the image with the CDN query parameters", async () => {
    const html = await render({
      title: "Title",
      image: "https://storage.flyo.cloud/image_7a158241.jpg",
    });

    expect(html).toContain(
      'property="og:image" content="https://storage.flyo.cloud/image_7a158241.jpg?w=1200&h=630&format=jpg"'
    );
    expect(html).toContain(
      'name="twitter:image" content="https://storage.flyo.cloud/image_7a158241.jpg?w=1200&h=600&format=jpg"'
    );
    expect(html).not.toContain("/thumb/");
  });

  it("prefixes a bare source with the CDN host", async () => {
    const html = await render({ image: "image_7a158241.jpg" });

    expect(html).toContain(
      'name="image" content="https://storage.flyo.cloud/image_7a158241.jpg?w=1200&h=630&format=jpg"'
    );
  });

  it("emits no image tags without an image", async () => {
    const html = await render({ title: "Title" });

    expect(html).not.toContain("og:image");
  });

  it("emits no image tags when the meta image is false", async () => {
    const html = await render({ title: "Title", image: false });

    expect(html).not.toContain("og:image");
    expect(html).not.toContain("false");
  });
});
