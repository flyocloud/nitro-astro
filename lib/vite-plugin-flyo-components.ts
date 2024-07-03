/**
 * Custom Vite plugin to prepare flyo components
 */
import camelcase from "camelcase";
import type { Plugin } from "vite";

export default function vitePluginFlyoComponents(
  componentsDir: string,
  components: object,
  fallbackComponent?: null | string
): Plugin {
  const virtualModuleId = "virtual:flyo-components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-flyo-components",
    async resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const exports: string[] = [];

        for (const [componentName, componentFile] of Object.entries(
          components
        )) {
          const resolvedId = await this.resolve(
            "/" + componentsDir + "/" + componentFile + ".astro"
          );

          if (resolvedId) {
            exports.push(
              `export { default as ${camelcase(componentName)} } from "${resolvedId.id}"`
            );
          }
        }

        let fallbackComponentResolvedId = null;
        if (fallbackComponent) {
          fallbackComponentResolvedId = await this.resolve(
            "/" + componentsDir + "/" + fallbackComponent + ".astro"
          );
        }
        if (fallbackComponentResolvedId) {
          exports.push(
            `export { default as fallback } from "${fallbackComponentResolvedId.id}"`
          );
        } else {
          exports.push(
            `export { default as fallback } from "@flyo/nitro-astro/FallbackComponent.astro"`
          );
        }

        return exports.join(";");
      }
    },
  };
}
