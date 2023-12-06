const v = /[\p{Lu}]/u, h = /[\p{Ll}]/u, p = /^[\p{Lu}](?![\p{Lu}])/gu, C = /([\p{Alpha}\p{N}_]|$)/u, i = /[_.\- ]+/, y = new RegExp("^" + i.source), u = new RegExp(i.source + C.source, "gu"), w = new RegExp("\\d+" + C.source, "gu"), I = (e, o, s, r) => {
  let c = !1, a = !1, n = !1, f = !1;
  for (let t = 0; t < e.length; t++) {
    const l = e[t];
    f = t > 2 ? e[t - 3] === "-" : !0, c && v.test(l) ? (e = e.slice(0, t) + "-" + e.slice(t), c = !1, n = a, a = !0, t++) : a && n && h.test(l) && (!f || r) ? (e = e.slice(0, t - 1) + "-" + e.slice(t - 1), n = a, a = !1, c = !0) : (c = o(l) === l && s(l) !== l, n = a, a = s(l) === l && o(l) !== l);
  }
  return e;
}, m = (e, o) => (p.lastIndex = 0, e.replace(p, (s) => o(s))), E = (e, o) => (u.lastIndex = 0, w.lastIndex = 0, e.replace(u, (s, r) => o(r)).replace(w, (s) => o(s)));
function g(e, o) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (o = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...o
  }, Array.isArray(e) ? e = e.map((a) => a.trim()).filter((a) => a.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  const s = o.locale === !1 ? (a) => a.toLowerCase() : (a) => a.toLocaleLowerCase(o.locale), r = o.locale === !1 ? (a) => a.toUpperCase() : (a) => a.toLocaleUpperCase(o.locale);
  return e.length === 1 ? i.test(e) ? "" : o.pascalCase ? r(e) : s(e) : (e !== s(e) && (e = I(e, s, r, o.preserveConsecutiveUppercase)), e = e.replace(y, ""), e = o.preserveConsecutiveUppercase ? m(e, s) : s(e), o.pascalCase && (e = r(e.charAt(0)) + e.slice(1)), E(e, r));
}
function A(e, o, s) {
  const r = "virtual:flyo-components", c = "\0" + r;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(a) {
      if (a === r)
        return c;
    },
    async load(a) {
      if (a === c) {
        const n = [];
        for (const [t, l] of Object.entries(o)) {
          const d = await this.resolve(
            "/" + e + "/" + l + ".astro"
          );
          d && n.push(`export { default as ${g(t)} } from "${d.id}"`);
        }
        let f = null;
        return s && (f = await this.resolve(
          "/" + e + "/" + s + ".astro"
        )), f ? n.push(`export { default as fallback } from "${f.id}"`) : n.push('export { default as fallback } from "@flyo/nitro-astro/src/components/FallbackComponent.astro"'), n.join(";");
      }
    }
  };
}
function L() {
  return globalThis.flyoNitroInstance || console.error("flyoNitroInstance has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function N(e) {
  const o = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    ...e
  };
  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: s, updateConfig: r }) => {
        r({
          vite: {
            plugins: [
              A(
                e.componentsDir,
                e.components,
                e.fallbackComponent
              )
            ]
          }
        }), s(
          "page-ssr",
          `
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = Configuration({
              apiKey: '${o.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
          `
        ), o.liveEdit && s(
          "page",
          `
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
            `
        );
      }
    }
  };
}
export {
  N as default,
  L as useFlyoNitro
};
