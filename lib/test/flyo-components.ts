/**
 * Stands in for the module `vite-plugin-flyo-components.ts` emits, aliased onto
 * `virtual:flyo-components` in vitest.config.ts. Keys are what `componentKey`
 * produces, because that is what the real plugin writes.
 */
import Registered from "./Registered.astro";
import fallback from "./Fallback.astro";

export default {
  components: { heroimage: Registered, text: Registered },
  fallback,
};
