/**
 * Virtual User Config
 * 
 * Allowing you to use the config within components like:
 * 
 * import Config from 'virtual:flyo-user-config'
 * 
 * Config.liveEdit
 */
import type { Plugin } from "vite"

export default function vitePluginFlyoUserConfig(
    config: object,
): Plugin {
    const virtualModuleId = 'virtual:flyo-user-config'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'vite-plugin-flyo-components',
        async resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        async load(id: string) {
            if (id === resolvedVirtualModuleId) {
                return`export default ${JSON.stringify(config)}`
            }
        }
    }
}