(function(i,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(i=typeof globalThis<"u"?globalThis:i||self,d(i.flyoNitroIntegration={}))})(this,function(i){"use strict";const d=/[\p{Lu}]/u,C=/[\p{Ll}]/u,p=/^[\p{Lu}](?![\p{Lu}])/gu,y=/([\p{Alpha}\p{N}_]|$)/u,u=/[_.\- ]+/,m=new RegExp("^"+u.source),h=new RegExp(u.source+y.source,"gu"),v=new RegExp("\\d+"+y.source,"gu"),g=(e,o,s,a)=>{let c=!1,t=!1,n=!1,f=!1;for(let r=0;r<e.length;r++){const l=e[r];f=r>2?e[r-3]==="-":!0,c&&d.test(l)?(e=e.slice(0,r)+"-"+e.slice(r),c=!1,n=t,t=!0,r++):t&&n&&C.test(l)&&(!f||a)?(e=e.slice(0,r-1)+"-"+e.slice(r-1),n=t,t=!1,c=!0):(c=o(l)===l&&s(l)!==l,n=t,t=s(l)===l&&o(l)!==l)}return e},I=(e,o)=>(p.lastIndex=0,e.replace(p,s=>o(s))),E=(e,o)=>(h.lastIndex=0,v.lastIndex=0,e.replace(h,(s,a)=>o(a)).replace(v,s=>o(s)));function A(e,o){if(!(typeof e=="string"||Array.isArray(e)))throw new TypeError("Expected the input to be `string | string[]`");if(o={pascalCase:!1,preserveConsecutiveUppercase:!1,...o},Array.isArray(e)?e=e.map(t=>t.trim()).filter(t=>t.length).join("-"):e=e.trim(),e.length===0)return"";const s=o.locale===!1?t=>t.toLowerCase():t=>t.toLocaleLowerCase(o.locale),a=o.locale===!1?t=>t.toUpperCase():t=>t.toLocaleUpperCase(o.locale);return e.length===1?u.test(e)?"":o.pascalCase?a(e):s(e):(e!==s(e)&&(e=g(e,s,a,o.preserveConsecutiveUppercase)),e=e.replace(m,""),e=o.preserveConsecutiveUppercase?I(e,s):s(e),o.pascalCase&&(e=a(e.charAt(0))+e.slice(1)),E(e,a))}function L(e,o,s){const a="virtual:flyo-components",c="\0"+a;return{name:"vite-plugin-flyo-components",async resolveId(t){if(t===a)return c},async load(t){if(t===c){const n=[];for(const[r,l]of Object.entries(o)){const w=await this.resolve("/"+e+"/"+l+".astro");w&&n.push(`export { default as ${A(r)} } from "${w.id}"`)}let f=null;return s&&(f=await this.resolve("/"+e+"/"+s+".astro")),f?n.push(`export { default as fallback } from "${f.id}"`):n.push('export { default as fallback } from "@flyo/nitro-astro/src/components/FallbackComponent.astro"'),n.join(";")}}}}function N(){return globalThis.flyoNitroInstance||console.error("flyoNitroInstance has not been initialized correctly"),globalThis.flyoNitroInstance}function R(e){const o={accessToken:!1,liveEdit:!1,fallbackComponent:null,...e};return{name:"@flyo/nitro-astro",hooks:{"astro:config:setup":({injectScript:s,updateConfig:a})=>{a({vite:{plugins:[L(e.componentsDir,e.components,e.fallbackComponent)]}}),s("page-ssr",`
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = Configuration({
              apiKey: '${o.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
          `),o.liveEdit&&s("page",`
              window.addEventListener("message", (event) => {
                if (event.data?.action === 'pageRefresh') {
                    window.location.reload(true);
                }
              })

              function getActualWindow() {
                if (window === window.top) {
                  return window;
                } else if (window.parent) {
                  return window.parent;
                }
                return window;
              }

              window.openBlockInFlyo = function(blockUid) {
                getActualWindow().postMessage({
                    action: 'openEdit',
                    data: JSON.parse(JSON.stringify({item:{uid: blockUid}}))
                }, 'https://flyo.cloud')
              }
            `)}}}}i.default=R,i.useFlyoNitro=N,Object.defineProperties(i,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
