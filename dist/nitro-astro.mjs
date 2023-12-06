const U = "https://api.flyo.cloud/nitro/v1".replace(/\/+$/, "");
class x {
  constructor(i = {}) {
    this.configuration = i;
  }
  set config(i) {
    this.configuration = i;
  }
  get basePath() {
    return this.configuration.basePath != null ? this.configuration.basePath : U;
  }
  get fetchApi() {
    return this.configuration.fetchApi;
  }
  get middleware() {
    return this.configuration.middleware || [];
  }
  get queryParamsStringify() {
    return this.configuration.queryParamsStringify || I;
  }
  get username() {
    return this.configuration.username;
  }
  get password() {
    return this.configuration.password;
  }
  get apiKey() {
    const i = this.configuration.apiKey;
    if (i)
      return typeof i == "function" ? i : () => i;
  }
  get accessToken() {
    const i = this.configuration.accessToken;
    if (i)
      return typeof i == "function" ? i : async () => i;
  }
  get headers() {
    return this.configuration.headers;
  }
  get credentials() {
    return this.configuration.credentials;
  }
}
const P = new x(), R = class E {
  constructor(i = P) {
    this.configuration = i, this.fetchApi = async (t, r) => {
      let a = { url: t, init: r };
      for (const s of this.middleware)
        s.pre && (a = await s.pre({
          fetch: this.fetchApi,
          ...a
        }) || a);
      let o;
      try {
        o = await (this.configuration.fetchApi || fetch)(a.url, a.init);
      } catch (s) {
        for (const u of this.middleware)
          u.onError && (o = await u.onError({
            fetch: this.fetchApi,
            url: a.url,
            init: a.init,
            error: s,
            response: o ? o.clone() : void 0
          }) || o);
        if (o === void 0)
          throw s instanceof Error ? new N(s, "The request failed and the interceptors did not return an alternative response") : s;
      }
      for (const s of this.middleware)
        s.post && (o = await s.post({
          fetch: this.fetchApi,
          url: a.url,
          init: a.init,
          response: o.clone()
        }) || o);
      return o;
    }, this.middleware = i.middleware;
  }
  withMiddleware(...i) {
    const t = this.clone();
    return t.middleware = t.middleware.concat(...i), t;
  }
  withPreMiddleware(...i) {
    const t = i.map((r) => ({ pre: r }));
    return this.withMiddleware(...t);
  }
  withPostMiddleware(...i) {
    const t = i.map((r) => ({ post: r }));
    return this.withMiddleware(...t);
  }
  /**
   * Check if the given MIME is a JSON MIME.
   * JSON MIME examples:
   *   application/json
   *   application/json; charset=UTF8
   *   APPLICATION/JSON
   *   application/vnd.company+json
   * @param mime - MIME (Multipurpose Internet Mail Extensions)
   * @return True if the given MIME is JSON, false otherwise.
   */
  isJsonMime(i) {
    return i ? E.jsonRegex.test(i) : !1;
  }
  async request(i, t) {
    const { url: r, init: a } = await this.createFetchParams(i, t), o = await this.fetchApi(r, a);
    if (o && o.status >= 200 && o.status < 300)
      return o;
    throw new K(o, "Response returned an error code");
  }
  async createFetchParams(i, t) {
    let r = this.configuration.basePath + i.path;
    i.query !== void 0 && Object.keys(i.query).length !== 0 && (r += "?" + this.configuration.queryParamsStringify(i.query));
    const a = Object.assign({}, this.configuration.headers, i.headers);
    Object.keys(a).forEach((h) => a[h] === void 0 ? delete a[h] : {});
    const o = typeof t == "function" ? t : async () => t, s = {
      method: i.method,
      headers: a,
      body: i.body,
      credentials: this.configuration.credentials
    }, u = {
      ...s,
      ...await o({
        init: s,
        context: i
      })
    };
    let c;
    L(u.body) || u.body instanceof URLSearchParams || j(u.body) ? c = u.body : this.isJsonMime(a["Content-Type"]) ? c = JSON.stringify(u.body) : c = u.body;
    const d = {
      ...u,
      body: c
    };
    return { url: r, init: d };
  }
  /**
   * Create a shallow clone of `this` by constructing a new instance
   * and then shallow cloning data members.
   */
  clone() {
    const i = this.constructor, t = new i(this.configuration);
    return t.middleware = this.middleware.slice(), t;
  }
};
R.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
let f = R;
function j(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function L(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
class K extends Error {
  constructor(i, t) {
    super(t), this.response = i, this.name = "ResponseError";
  }
}
class N extends Error {
  constructor(i, t) {
    super(t), this.cause = i, this.name = "FetchError";
  }
}
class y extends Error {
  constructor(i, t) {
    super(t), this.field = i, this.name = "RequiredError";
  }
}
function n(e, i) {
  return e[i] != null;
}
function I(e, i = "") {
  return Object.keys(e).map((t) => A(t, e[t], i)).filter((t) => t.length > 0).join("&");
}
function A(e, i, t = "") {
  const r = t + (t.length ? `[${e}]` : e);
  if (i instanceof Array) {
    const a = i.map((o) => encodeURIComponent(String(o))).join(`&${encodeURIComponent(r)}=`);
    return `${encodeURIComponent(r)}=${a}`;
  }
  if (i instanceof Set) {
    const a = Array.from(i);
    return A(e, a, t);
  }
  return i instanceof Date ? `${encodeURIComponent(r)}=${encodeURIComponent(i.toISOString())}` : i instanceof Object ? I(i, r) : `${encodeURIComponent(r)}=${encodeURIComponent(String(i))}`;
}
function g(e, i) {
  return Object.keys(e).reduce(
    (t, r) => ({ ...t, [r]: i(e[r]) }),
    {}
  );
}
class l {
  constructor(i, t = (r) => r) {
    this.raw = i, this.transformer = t;
  }
  async value() {
    return this.transformer(await this.raw.json());
  }
}
function $(e) {
  return O(e);
}
function O(e, i) {
  return e == null ? e : {
    identifier: n(e, "identifier") ? e.identifier : void 0,
    content: n(e, "content") ? e.content.map(C) : void 0
  };
}
function C(e) {
  return F(e);
}
function F(e, i) {
  return e == null ? e : {
    items: n(e, "items") ? e.items : void 0,
    content: n(e, "content") ? e.content : void 0,
    config: n(e, "config") ? e.config : void 0,
    identifier: n(e, "identifier") ? e.identifier : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    component: n(e, "component") ? e.component : void 0,
    slots: n(e, "slots") ? g(e.slots, $) : void 0
  };
}
function T(e) {
  return M(e);
}
function M(e, i) {
  return e == null ? e : {
    type: n(e, "type") ? e.type : void 0,
    target: n(e, "target") ? e.target : void 0,
    label: n(e, "label") ? e.label : void 0,
    href: n(e, "href") ? e.href : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    properties: n(e, "properties") ? e.properties : void 0,
    children: n(e, "children") ? e.children.map(T) : void 0
  };
}
function B(e) {
  return D(e);
}
function D(e, i) {
  return e == null ? e : {
    items: n(e, "items") ? e.items.map(T) : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    identifier: n(e, "identifier") ? e.identifier : void 0,
    label: n(e, "label") ? e.label : void 0
  };
}
function G(e) {
  return J(e);
}
function J(e, i) {
  return e == null ? e : {
    domain: n(e, "domain") ? e.domain : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    version: n(e, "version") ? e.version : void 0,
    updatedAt: n(e, "updated_at") ? e.updated_at : void 0,
    language: n(e, "language") ? e.language : void 0
  };
}
function V(e) {
  return W(e);
}
function W(e, i) {
  return e == null ? e : {
    nitro: n(e, "nitro") ? G(e.nitro) : void 0,
    pages: n(e, "pages") ? e.pages : void 0,
    containers: n(e, "containers") ? g(e.containers, B) : void 0,
    globals: n(e, "globals") ? e.globals : void 0
  };
}
function z(e) {
  return H(e);
}
function H(e, i) {
  return e == null ? e : {
    api: n(e, "api") ? e.api : void 0,
    image: n(e, "image") ? e.image : void 0
  };
}
function X(e) {
  return Z(e);
}
function Z(e, i) {
  return e == null ? e : {
    version: n(e, "_version") ? e._version : void 0,
    entityMetric: n(e, "entity_metric") ? z(e.entity_metric) : void 0,
    entityUniqueId: n(e, "entity_unique_id") ? e.entity_unique_id : void 0,
    entityId: n(e, "entity_id") ? e.entity_id : void 0,
    entityImage: n(e, "entity_image") ? e.entity_image : void 0,
    entitySlug: n(e, "entity_slug") ? e.entity_slug : void 0,
    entityTeaser: n(e, "entity_teaser") ? e.entity_teaser : void 0,
    entityTimeEnd: n(e, "entity_time_end") ? e.entity_time_end : void 0,
    entityTimeStart: n(e, "entity_time_start") ? e.entity_time_start : void 0,
    entityTitle: n(e, "entity_title") ? e.entity_title : void 0,
    entityType: n(e, "entity_type") ? e.entity_type : void 0,
    entityTypeId: n(e, "entity_type_id") ? e.entity_type_id : void 0,
    updatedAt: n(e, "updated_at") ? e.updated_at : void 0,
    routes: n(e, "routes") ? e.routes : void 0
  };
}
function m(e) {
  return Q(e);
}
function Q(e, i) {
  return e == null ? e : {
    entity: n(e, "entity") ? X(e.entity) : void 0,
    model: n(e, "model") ? e.model : void 0,
    language: n(e, "language") ? e.language : void 0,
    jsonld: n(e, "jsonld") ? e.jsonld : void 0
  };
}
function k(e) {
  return Y(e);
}
function Y(e, i) {
  return e == null ? e : {
    entityUniqueId: n(e, "entity_unique_id") ? e.entity_unique_id : void 0,
    entityTitle: n(e, "entity_title") ? e.entity_title : void 0,
    entityTeaser: n(e, "entity_teaser") ? e.entity_teaser : void 0,
    entitySlug: n(e, "entity_slug") ? e.entity_slug : void 0,
    entityTimeStart: n(e, "entity_time_start") ? e.entity_time_start : void 0,
    entityType: n(e, "entity_type") ? e.entity_type : void 0,
    entityTypeId: n(e, "entity_type_id") ? e.entity_type_id : void 0,
    entityImage: n(e, "entity_image") ? e.entity_image : void 0,
    routes: n(e, "routes") ? e.routes : void 0
  };
}
function ee(e) {
  return ie(e);
}
function ie(e, i) {
  return e == null ? e : {
    description: n(e, "description") ? e.description : void 0,
    image: n(e, "image") ? e.image : void 0,
    title: n(e, "title") ? e.title : void 0
  };
}
function te(e) {
  return ne(e);
}
function ne(e, i) {
  return e == null ? e : {
    slug: n(e, "slug") ? e.slug : void 0,
    title: n(e, "title") ? e.title : void 0
  };
}
function oe(e) {
  return re(e);
}
function re(e, i) {
  return e == null ? e : {
    value: n(e, "value") ? e.value : void 0,
    navigation: n(e, "navigation") ? e.navigation : void 0,
    propagate: n(e, "propagate") ? e.propagate : void 0
  };
}
function w(e) {
  return ae(e);
}
function ae(e, i) {
  return e == null ? e : {
    id: n(e, "id") ? e.id : void 0,
    title: n(e, "title") ? e.title : void 0,
    href: n(e, "href") ? e.href : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    json: n(e, "json") ? e.json.map(C) : void 0,
    depth: n(e, "depth") ? e.depth : void 0,
    isHome: n(e, "is_home") ? e.is_home : void 0,
    createdAt: n(e, "created_at") ? e.created_at : void 0,
    updatedAt: n(e, "updated_at") ? e.updated_at : void 0,
    isVisible: n(e, "is_visible") ? e.is_visible : void 0,
    metaJson: n(e, "meta_json") ? ee(e.meta_json) : void 0,
    properties: n(e, "properties") ? g(e.properties, oe) : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    type: n(e, "type") ? e.type : void 0,
    target: n(e, "target") ? e.target : void 0,
    container: n(e, "container") ? e.container : void 0,
    breadcrumb: n(e, "breadcrumb") ? e.breadcrumb.map(te) : void 0
  };
}
function se(e) {
  return ue(e);
}
function ue(e, i) {
  return e == null ? e : {
    version: n(e, "version") ? e.version : void 0,
    updatedAt: n(e, "updated_at") ? e.updated_at : void 0
  };
}
class ce extends f {
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async configRaw(i) {
    const t = {}, r = {};
    this.configuration && this.configuration.apiKey && (t.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/config",
      method: "GET",
      headers: r,
      query: t
    }, i);
    return new l(a, (o) => V(o));
  }
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async config(i) {
    return await (await this.configRaw(i)).value();
  }
}
class de extends f {
  /**
   * 
   * Find entity by slug and optional Type-ID
   */
  async entityBySlugRaw(i, t) {
    if (i.slug === null || i.slug === void 0)
      throw new y("slug", "Required parameter requestParameters.slug was null or undefined when calling entityBySlug.");
    const r = {};
    i.typeId !== void 0 && (r.typeId = i.typeId);
    const a = {};
    this.configuration && this.configuration.apiKey && (r.token = this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/entities/slug/{slug}".replace("{slug}", encodeURIComponent(String(i.slug))),
      method: "GET",
      headers: a,
      query: r
    }, t);
    return new l(o, (s) => m(s));
  }
  /**
   * 
   * Find entity by slug and optional Type-ID
   */
  async entityBySlug(i, t) {
    return await (await this.entityBySlugRaw(i, t)).value();
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueidRaw(i, t) {
    if (i.uniqueid === null || i.uniqueid === void 0)
      throw new y("uniqueid", "Required parameter requestParameters.uniqueid was null or undefined when calling entityByUniqueid.");
    const r = {}, a = {};
    this.configuration && this.configuration.apiKey && (r.token = this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/entities/uniqueid/{uniqueid}".replace("{uniqueid}", encodeURIComponent(String(i.uniqueid))),
      method: "GET",
      headers: a,
      query: r
    }, t);
    return new l(o, (s) => m(s));
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueid(i, t) {
    return await (await this.entityByUniqueidRaw(i, t)).value();
  }
}
class le extends f {
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async homeRaw(i) {
    const t = {}, r = {};
    this.configuration && this.configuration.apiKey && (t.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/pages/home",
      method: "GET",
      headers: r,
      query: t
    }, i);
    return new l(a, (o) => w(o));
  }
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async home(i) {
    return await (await this.homeRaw(i)).value();
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async pageRaw(i, t) {
    const r = {};
    i.slug !== void 0 && (r.slug = i.slug);
    const a = {};
    this.configuration && this.configuration.apiKey && (r.token = this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/pages",
      method: "GET",
      headers: a,
      query: r
    }, t);
    return new l(o, (s) => w(s));
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async page(i = {}, t) {
    return await (await this.pageRaw(i, t)).value();
  }
}
class fe extends f {
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async searchRaw(i, t) {
    if (i.query === null || i.query === void 0)
      throw new y("query", "Required parameter requestParameters.query was null or undefined when calling search.");
    const r = {};
    i.query !== void 0 && (r.query = i.query);
    const a = {};
    this.configuration && this.configuration.apiKey && (r.token = this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/search",
      method: "GET",
      headers: a,
      query: r
    }, t);
    return new l(o, (s) => s.map(k));
  }
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async search(i, t) {
    return await (await this.searchRaw(i, t)).value();
  }
}
class pe extends f {
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemapRaw(i) {
    const t = {}, r = {};
    this.configuration && this.configuration.apiKey && (t.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/sitemap",
      method: "GET",
      headers: r,
      query: t
    }, i);
    return new l(a, (o) => o.map(k));
  }
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemap(i) {
    return await (await this.sitemapRaw(i)).value();
  }
}
class he extends f {
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async versionRaw(i) {
    const t = {}, r = {};
    this.configuration && this.configuration.apiKey && (t.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/version",
      method: "GET",
      headers: r,
      query: t
    }, i);
    return new l(a, (o) => se(o));
  }
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async version(i) {
    return await (await this.versionRaw(i)).value();
  }
}
const ye = /[\p{Lu}]/u, ge = /[\p{Ll}]/u, _ = /^[\p{Lu}](?![\p{Lu}])/gu, S = /([\p{Alpha}\p{N}_]|$)/u, v = /[_.\- ]+/, ve = new RegExp("^" + v.source), q = new RegExp(v.source + S.source, "gu"), b = new RegExp("\\d+" + S.source, "gu"), me = (e, i, t, r) => {
  let a = !1, o = !1, s = !1, u = !1;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    u = c > 2 ? e[c - 3] === "-" : !0, a && ye.test(d) ? (e = e.slice(0, c) + "-" + e.slice(c), a = !1, s = o, o = !0, c++) : o && s && ge.test(d) && (!u || r) ? (e = e.slice(0, c - 1) + "-" + e.slice(c - 1), s = o, o = !1, a = !0) : (a = i(d) === d && t(d) !== d, s = o, o = t(d) === d && i(d) !== d);
  }
  return e;
}, we = (e, i) => (_.lastIndex = 0, e.replace(_, (t) => i(t))), _e = (e, i) => (q.lastIndex = 0, b.lastIndex = 0, e.replace(q, (t, r) => i(r)).replace(b, (t) => i(t)));
function qe(e, i) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (i = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...i
  }, Array.isArray(e) ? e = e.map((o) => o.trim()).filter((o) => o.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  const t = i.locale === !1 ? (o) => o.toLowerCase() : (o) => o.toLocaleLowerCase(i.locale), r = i.locale === !1 ? (o) => o.toUpperCase() : (o) => o.toLocaleUpperCase(i.locale);
  return e.length === 1 ? v.test(e) ? "" : i.pascalCase ? r(e) : t(e) : (e !== t(e) && (e = me(e, t, r, i.preserveConsecutiveUppercase)), e = e.replace(ve, ""), e = i.preserveConsecutiveUppercase ? we(e, t) : t(e), i.pascalCase && (e = r(e.charAt(0)) + e.slice(1)), _e(e, r));
}
function be(e, i, t) {
  const r = "virtual:flyo-components", a = "\0" + r;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(o) {
      if (o === r)
        return a;
    },
    async load(o) {
      if (o === a) {
        const s = [];
        for (const [c, d] of Object.entries(i)) {
          const h = await this.resolve(
            "/" + e + "/" + d + ".astro"
          );
          h && s.push(`export { default as ${qe(c)} } from "${h.id}"`);
        }
        let u = null;
        return t && (u = await this.resolve(
          "/" + e + "/" + t + ".astro"
        )), u ? s.push(`export { default as fallback } from "${u.id}"`) : s.push('export { default as fallback } from "@flyo/nitro-astro/components/FallbackComponent.astro"'), s.join(";");
      }
    }
  };
}
function p() {
  return globalThis.flyoNitroInstance || console.error("The Flyo Typescript Configuration has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function Re() {
  return new ce(p());
}
function Ee() {
  return new de(p());
}
function Ie() {
  return new le(p());
}
function Ae() {
  return new fe(p());
}
function Ce() {
  return new pe(p());
}
function Te() {
  return new he(p());
}
function ke(e) {
  const i = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    ...e
  };
  return {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: t, updateConfig: r }) => {
        r({
          vite: {
            plugins: [
              be(
                e.componentsDir,
                e.components,
                e.fallbackComponent
              )
            ]
          }
        }), t(
          "page-ssr",
          `
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${i.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
          `
        ), i.liveEdit && t(
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
  ke as default,
  Re as useConfigApi,
  p as useConfiguration,
  Ee as useEntitiesApi,
  Ie as usePagesApi,
  Ae as useSearchApi,
  Ce as useSitemapApi,
  Te as useVersionApi
};
