/**
 * The key a component is registered and looked up under.
 *
 * `block.component` is already the identifier-safe field of a block — the API
 * documents it as `HeroImage`, next to `identifier`, which is `hero_image` — so
 * the two sides of the lookup usually agree on the spelling by themselves. All
 * this has to survive is the drift between the name Flyo sends and the key
 * written into the `components` option by hand: casing, and the separator style
 * of `hero_image` / `hero-image` / `hero image`.
 *
 * Both sides must run this exact function — the virtual module
 * `vite-plugin-flyo-components.ts` emits, and `components/FlyoNitroBlock.astro`
 * at request time. Two copies that drift apart do not fail the build, they route
 * every block to the fallback component, so there is one: the plugin imports it
 * relatively into the bundle, and the component, which ships as raw source, gets
 * it through the `./componentKey` subpath of `exports`.
 *
 * It replaced `camelcase`, which the shipped `.astro` had to resolve from the
 * consumer's own node_modules without being declared anywhere. Every pair of
 * names camelcase used to map onto one export still maps onto one key here —
 * `componentKey.test.ts` holds that line — so no registration that worked before
 * stops working.
 */
export function componentKey(name: string): string {
  return String(name)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}
