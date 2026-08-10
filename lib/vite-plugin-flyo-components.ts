/**
 * Custom Vite plugin to prepare flyo components
 */
import type { Plugin } from "vite";
import { componentKey } from "./componentKey";

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
        // A keyed registry rather than one named export per component: the key is
        // derived from a name the user controls, and `export { default as 2cols }`
        // or `as subfolder/Thing` is a syntax error in the emitted module. Numbered
        // locals cannot collide with anything.
        const imports: string[] = [];
        const entries: string[] = [];
        const claimedBy = new Map<string, string>();

        for (const [componentName, componentFile] of Object.entries(
          components
        )) {
          const resolvedId = await this.resolve(
            "/" + componentsDir + "/" + componentFile + ".astro"
          );

          if (resolvedId) {
            const key = componentKey(componentName);
            const claim = claimedBy.get(key);

            if (claim) {
              // Silently keeping the last one would render the wrong component for
              // one of the two, which is a great deal harder to notice than this.
              throw new Error(
                `The Flyo components "${claim}" and "${componentName}" are the same component name, they only differ in casing or separators. Rename one of them in the components option.`
              );
            }

            claimedBy.set(key, componentName);
            const local = `component${entries.length}`;
            imports.push(`import ${local} from "${resolvedId.id}"`);
            entries.push(`${JSON.stringify(key)}: ${local}`);
          }
        }

        let fallbackComponentResolvedId = null;
        if (fallbackComponent) {
          fallbackComponentResolvedId = await this.resolve(
            "/" + componentsDir + "/" + fallbackComponent + ".astro"
          );
        }
        if (fallbackComponentResolvedId) {
          imports.push(
            `import fallback from "${fallbackComponentResolvedId.id}"`
          );
        } else {
          imports.push(
            `import fallback from "@flyo/nitro-astro/FallbackComponent.astro"`
          );
        }

        return [
          ...imports,
          `export default { components: { ${entries.join(", ")} }, fallback }`,
        ].join(";");
      }
    },
  };
}
