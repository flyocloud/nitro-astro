import { describe, it, expect } from "vitest";
import vitePluginFlyoComponents from "./vite-plugin-flyo-components";

const VIRTUAL_ID = "\0virtual:flyo-components";

/**
 * The plugin only needs `this.resolve` out of the rollup plugin context, and every
 * path it asks for exists in these tests — a component the consumer did not create
 * resolves to null and is left out of the registry, which the last test covers.
 */
function load(
  components: object,
  fallbackComponent?: null | string,
  missing: string[] = []
): Promise<string | undefined> {
  const plugin = vitePluginFlyoComponents(
    "src/components/flyo",
    components,
    fallbackComponent
  );
  const context = {
    resolve: async (id: string) =>
      missing.some((name) => id.includes(name)) ? null : { id },
  };
  // `load` is typed as a rollup hook, which can also be an object form.
  const hook = plugin.load as (
    this: typeof context,
    id: string
  ) => Promise<string | undefined>;
  return hook.call(context, VIRTUAL_ID);
}

describe("virtual:flyo-components", () => {
  it("registers components under their normalized key", async () => {
    const code = await load({ Text: "Text", CardsGrid: "sub/CardsGrid" });

    expect(code).toContain(
      `import component0 from "/src/components/flyo/Text.astro"`
    );
    expect(code).toContain(
      `import component1 from "/src/components/flyo/sub/CardsGrid.astro"`
    );
    expect(code).toContain(`"text": component0`);
    expect(code).toContain(`"cardsgrid": component1`);
  });

  it("emits no identifier derived from a component name", async () => {
    // A key starting with a digit, or holding a character camelCase did not fold
    // away, used to reach `export { default as … }` verbatim: a syntax error in the
    // emitted module. Separators were always fine — camelcase absorbed those.
    const code = await load({ "2cols": "2cols", "hero/block": "Hero" });

    expect(code).toContain(`"2cols": component0`);
    expect(code).toContain(`"heroblock": component1`);
    expect(code).toMatch(/^(import component\d+ from|import fallback from)/);
  });

  it("falls back to the shipped component when none is configured", async () => {
    const code = await load({});

    expect(code).toContain(
      `import fallback from "@flyo/nitro-astro/FallbackComponent.astro"`
    );
    expect(code).toContain("export default { components: {  }, fallback }");
  });

  it("uses the configured fallback component when it resolves", async () => {
    const code = await load({}, "BlockNotFound");

    expect(code).toContain(
      `import fallback from "/src/components/flyo/BlockNotFound.astro"`
    );
  });

  it("ships the default fallback when the configured one does not exist", async () => {
    const code = await load({}, "BlockNotFound", ["BlockNotFound"]);

    expect(code).toContain(
      `import fallback from "@flyo/nitro-astro/FallbackComponent.astro"`
    );
  });

  it("refuses two names that differ only in casing or separators", async () => {
    // Two `export { default as heroImage }` used to make this a rollup error about
    // a duplicate export; keep failing, but say which option keys are at fault.
    await expect(
      load({ HeroImage: "HeroImage", hero_image: "Legacy" })
    ).rejects.toThrow(/"HeroImage" and "hero_image"/);
  });

  it("leaves out a component whose file does not resolve", async () => {
    const code = await load({ Text: "Text", Gone: "Gone" }, null, ["Gone"]);

    expect(code).toContain(`"text": component0`);
    expect(code).not.toContain("Gone");
  });
});
