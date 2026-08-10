import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import FlyoNitroBlock from "./FlyoNitroBlock.astro";

/** `virtual:flyo-components` is aliased to test/flyo-components.ts — see vitest.config.ts. */
async function render(component: string) {
  const container = await AstroContainer.create();
  return container.renderToString(FlyoNitroBlock, {
    props: { block: { component, uid: "e4244ff7" } },
    request: new Request("https://example.com/page"),
  });
}

describe("FlyoNitroBlock", () => {
  it("renders the component registered under the block's name", async () => {
    expect(await render("HeroImage")).toContain("registered");
  });

  it("renders it whatever casing and separators Flyo sends", async () => {
    // The name in `components` is written by hand and `block.component` comes from
    // the API, so the two spellings can drift; both used to meet at camelcase.
    for (const name of ["HeroImage", "heroImage", "hero_image", "hero-image"]) {
      expect(await render(name)).toContain("registered");
    }
  });

  it("renders the fallback for a component nobody registered", async () => {
    const html = await render("Unregistered");

    expect(html).toContain("fallback");
    expect(html).not.toContain("registered");
  });

  it("renders the fallback for a name that is a property of Object.prototype", async () => {
    // A plain object registry inherits from Object.prototype, so "constructor"
    // resolves to a function and Astro renders whatever that turns into.
    for (const name of ["constructor", "toString", "valueOf"]) {
      expect(await render(name)).toContain("fallback");
    }
  });
});
