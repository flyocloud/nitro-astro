const x = "https://api.flyo.cloud/nitro/v1".replace(/\/+$/, "");
class T {
  constructor(t = {}) {
    this.configuration = t;
  }
  set config(t) {
    this.configuration = t;
  }
  get basePath() {
    return this.configuration.basePath != null ? this.configuration.basePath : x;
  }
  get fetchApi() {
    return this.configuration.fetchApi;
  }
  get middleware() {
    return this.configuration.middleware || [];
  }
  get queryParamsStringify() {
    return this.configuration.queryParamsStringify || k;
  }
  get username() {
    return this.configuration.username;
  }
  get password() {
    return this.configuration.password;
  }
  get apiKey() {
    const t = this.configuration.apiKey;
    if (t)
      return typeof t == "function" ? t : () => t;
  }
  get accessToken() {
    const t = this.configuration.accessToken;
    if (t)
      return typeof t == "function" ? t : async () => t;
  }
  get headers() {
    return this.configuration.headers;
  }
  get credentials() {
    return this.configuration.credentials;
  }
}
const P = new T(), R = class E {
  constructor(t = P) {
    this.configuration = t, this.fetchApi = async (i, o) => {
      let a = { url: i, init: o };
      for (const s of this.middleware)
        s.pre && (a = await s.pre({
          fetch: this.fetchApi,
          ...a
        }) || a);
      let r;
      try {
        r = await (this.configuration.fetchApi || fetch)(a.url, a.init);
      } catch (s) {
        for (const u of this.middleware)
          u.onError && (r = await u.onError({
            fetch: this.fetchApi,
            url: a.url,
            init: a.init,
            error: s,
            response: r ? r.clone() : void 0
          }) || r);
        if (r === void 0)
          throw s instanceof Error ? new N(s, "The request failed and the interceptors did not return an alternative response") : s;
      }
      for (const s of this.middleware)
        s.post && (r = await s.post({
          fetch: this.fetchApi,
          url: a.url,
          init: a.init,
          response: r.clone()
        }) || r);
      return r;
    }, this.middleware = t.middleware;
  }
  withMiddleware(...t) {
    const i = this.clone();
    return i.middleware = i.middleware.concat(...t), i;
  }
  withPreMiddleware(...t) {
    const i = t.map((o) => ({ pre: o }));
    return this.withMiddleware(...i);
  }
  withPostMiddleware(...t) {
    const i = t.map((o) => ({ post: o }));
    return this.withMiddleware(...i);
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
  isJsonMime(t) {
    return t ? E.jsonRegex.test(t) : !1;
  }
  async request(t, i) {
    const { url: o, init: a } = await this.createFetchParams(t, i), r = await this.fetchApi(o, a);
    if (r && r.status >= 200 && r.status < 300)
      return r;
    throw new K(r, "Response returned an error code");
  }
  async createFetchParams(t, i) {
    let o = this.configuration.basePath + t.path;
    t.query !== void 0 && Object.keys(t.query).length !== 0 && (o += "?" + this.configuration.queryParamsStringify(t.query));
    const a = Object.assign({}, this.configuration.headers, t.headers);
    Object.keys(a).forEach((y) => a[y] === void 0 ? delete a[y] : {});
    const r = typeof i == "function" ? i : async () => i, s = {
      method: t.method,
      headers: a,
      body: t.body,
      credentials: this.configuration.credentials
    }, u = {
      ...s,
      ...await r({
        init: s,
        context: t
      })
    };
    let c;
    L(u.body) || u.body instanceof URLSearchParams || j(u.body) ? c = u.body : this.isJsonMime(a["Content-Type"]) ? c = JSON.stringify(u.body) : c = u.body;
    const l = {
      ...u,
      body: c
    };
    return { url: o, init: l };
  }
  /**
   * Create a shallow clone of `this` by constructing a new instance
   * and then shallow cloning data members.
   */
  clone() {
    const t = this.constructor, i = new t(this.configuration);
    return i.middleware = this.middleware.slice(), i;
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
  constructor(t, i) {
    super(i), this.response = t, this.name = "ResponseError";
  }
}
class N extends Error {
  constructor(t, i) {
    super(i), this.cause = t, this.name = "FetchError";
  }
}
class h extends Error {
  constructor(t, i) {
    super(i), this.field = t, this.name = "RequiredError";
  }
}
function n(e, t) {
  return e[t] != null;
}
function k(e, t = "") {
  return Object.keys(e).map((i) => C(i, e[i], t)).filter((i) => i.length > 0).join("&");
}
function C(e, t, i = "") {
  const o = i + (i.length ? `[${e}]` : e);
  if (t instanceof Array) {
    const a = t.map((r) => encodeURIComponent(String(r))).join(`&${encodeURIComponent(o)}=`);
    return `${encodeURIComponent(o)}=${a}`;
  }
  if (t instanceof Set) {
    const a = Array.from(t);
    return C(e, a, i);
  }
  return t instanceof Date ? `${encodeURIComponent(o)}=${encodeURIComponent(t.toISOString())}` : t instanceof Object ? k(t, o) : `${encodeURIComponent(o)}=${encodeURIComponent(String(t))}`;
}
function g(e, t) {
  return Object.keys(e).reduce(
    (i, o) => ({ ...i, [o]: t(e[o]) }),
    {}
  );
}
class d {
  constructor(t, i = (o) => o) {
    this.raw = t, this.transformer = i;
  }
  async value() {
    return this.transformer(await this.raw.json());
  }
}
function O(e) {
  return $(e);
}
function $(e, t) {
  return e == null ? e : {
    identifier: n(e, "identifier") ? e.identifier : void 0,
    content: n(e, "content") ? e.content.map(I) : void 0
  };
}
function I(e) {
  return F(e);
}
function F(e, t) {
  return e == null ? e : {
    items: n(e, "items") ? e.items : void 0,
    content: n(e, "content") ? e.content : void 0,
    config: n(e, "config") ? e.config : void 0,
    identifier: n(e, "identifier") ? e.identifier : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    component: n(e, "component") ? e.component : void 0,
    slots: n(e, "slots") ? g(e.slots, O) : void 0
  };
}
function A(e) {
  return B(e);
}
function B(e, t) {
  return e == null ? e : {
    type: n(e, "type") ? e.type : void 0,
    target: n(e, "target") ? e.target : void 0,
    label: n(e, "label") ? e.label : void 0,
    href: n(e, "href") ? e.href : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    properties: n(e, "properties") ? e.properties : void 0,
    children: n(e, "children") ? e.children.map(A) : void 0
  };
}
function M(e) {
  return D(e);
}
function D(e, t) {
  return e == null ? e : {
    items: n(e, "items") ? e.items.map(A) : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    identifier: n(e, "identifier") ? e.identifier : void 0,
    label: n(e, "label") ? e.label : void 0
  };
}
function G(e) {
  return J(e);
}
function J(e, t) {
  return e == null ? e : {
    domain: n(e, "domain") ? e.domain : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    version: n(e, "version") ? e.version : void 0,
    updated_at: n(e, "updated_at") ? e.updated_at : void 0,
    language: n(e, "language") ? e.language : void 0
  };
}
function V(e) {
  return W(e);
}
function W(e, t) {
  return e == null ? e : {
    nitro: n(e, "nitro") ? G(e.nitro) : void 0,
    pages: n(e, "pages") ? e.pages : void 0,
    containers: n(e, "containers") ? g(e.containers, M) : void 0,
    globals: n(e, "globals") ? e.globals : void 0
  };
}
function z(e) {
  return H(e);
}
function H(e, t) {
  return e == null ? e : {
    api: n(e, "api") ? e.api : void 0,
    image: n(e, "image") ? e.image : void 0
  };
}
function X(e) {
  return Z(e);
}
function Z(e, t) {
  return e == null ? e : {
    _version: n(e, "_version") ? e._version : void 0,
    entity_metric: n(e, "entity_metric") ? z(e.entity_metric) : void 0,
    entity_unique_id: n(e, "entity_unique_id") ? e.entity_unique_id : void 0,
    entity_id: n(e, "entity_id") ? e.entity_id : void 0,
    entity_image: n(e, "entity_image") ? e.entity_image : void 0,
    entity_slug: n(e, "entity_slug") ? e.entity_slug : void 0,
    entity_teaser: n(e, "entity_teaser") ? e.entity_teaser : void 0,
    entity_time_end: n(e, "entity_time_end") ? e.entity_time_end : void 0,
    entity_time_start: n(e, "entity_time_start") ? e.entity_time_start : void 0,
    entity_title: n(e, "entity_title") ? e.entity_title : void 0,
    entity_type: n(e, "entity_type") ? e.entity_type : void 0,
    entity_type_id: n(e, "entity_type_id") ? e.entity_type_id : void 0,
    updated_at: n(e, "updated_at") ? e.updated_at : void 0,
    routes: n(e, "routes") ? e.routes : void 0
  };
}
function m(e) {
  return Q(e);
}
function Q(e, t) {
  return e == null ? e : {
    entity: n(e, "entity") ? X(e.entity) : void 0,
    model: n(e, "model") ? e.model : void 0,
    language: n(e, "language") ? e.language : void 0,
    jsonld: n(e, "jsonld") ? e.jsonld : void 0
  };
}
function S(e) {
  return Y(e);
}
function Y(e, t) {
  return e == null ? e : {
    entity_unique_id: n(e, "entity_unique_id") ? e.entity_unique_id : void 0,
    entity_title: n(e, "entity_title") ? e.entity_title : void 0,
    entity_teaser: n(e, "entity_teaser") ? e.entity_teaser : void 0,
    entity_slug: n(e, "entity_slug") ? e.entity_slug : void 0,
    entity_time_start: n(e, "entity_time_start") ? e.entity_time_start : void 0,
    entity_type: n(e, "entity_type") ? e.entity_type : void 0,
    entity_type_id: n(e, "entity_type_id") ? e.entity_type_id : void 0,
    entity_image: n(e, "entity_image") ? e.entity_image : void 0,
    routes: n(e, "routes") ? e.routes : void 0
  };
}
function ee(e) {
  return te(e);
}
function te(e, t) {
  return e == null ? e : {
    description: n(e, "description") ? e.description : void 0,
    image: n(e, "image") ? e.image : void 0,
    title: n(e, "title") ? e.title : void 0
  };
}
function ie(e) {
  return ne(e);
}
function ne(e, t) {
  return e == null ? e : {
    slug: n(e, "slug") ? e.slug : void 0,
    title: n(e, "title") ? e.title : void 0
  };
}
function oe(e) {
  return re(e);
}
function re(e, t) {
  return e == null ? e : {
    value: n(e, "value") ? e.value : void 0,
    navigation: n(e, "navigation") ? e.navigation : void 0,
    propagate: n(e, "propagate") ? e.propagate : void 0
  };
}
function w(e) {
  return ae(e);
}
function ae(e, t) {
  return e == null ? e : {
    id: n(e, "id") ? e.id : void 0,
    title: n(e, "title") ? e.title : void 0,
    href: n(e, "href") ? e.href : void 0,
    slug: n(e, "slug") ? e.slug : void 0,
    json: n(e, "json") ? e.json.map(I) : void 0,
    depth: n(e, "depth") ? e.depth : void 0,
    is_home: n(e, "is_home") ? e.is_home : void 0,
    created_at: n(e, "created_at") ? e.created_at : void 0,
    updated_at: n(e, "updated_at") ? e.updated_at : void 0,
    is_visible: n(e, "is_visible") ? e.is_visible : void 0,
    meta_json: n(e, "meta_json") ? ee(e.meta_json) : void 0,
    properties: n(e, "properties") ? g(e.properties, oe) : void 0,
    uid: n(e, "uid") ? e.uid : void 0,
    type: n(e, "type") ? e.type : void 0,
    target: n(e, "target") ? e.target : void 0,
    container: n(e, "container") ? e.container : void 0,
    breadcrumb: n(e, "breadcrumb") ? e.breadcrumb.map(ie) : void 0
  };
}
function se(e) {
  return ue(e);
}
function ue(e, t) {
  return e == null ? e : {
    version: n(e, "version") ? e.version : void 0,
    updated_at: n(e, "updated_at") ? e.updated_at : void 0
  };
}
class ce extends f {
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async configRaw(t) {
    const i = {}, o = {};
    this.configuration && this.configuration.apiKey && (i.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/config",
      method: "GET",
      headers: o,
      query: i
    }, t);
    return new d(a, (r) => V(r));
  }
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async config(t) {
    return await (await this.configRaw(t)).value();
  }
}
class le extends f {
  /**
   * 
   * Find entity by slug and optional Type-ID
   */
  async entityBySlugRaw(t, i) {
    if (t.slug === null || t.slug === void 0)
      throw new h("slug", "Required parameter requestParameters.slug was null or undefined when calling entityBySlug.");
    const o = {};
    t.typeId !== void 0 && (o.typeId = t.typeId);
    const a = {};
    this.configuration && this.configuration.apiKey && (o.token = this.configuration.apiKey("token"));
    const r = await this.request({
      path: "/entities/slug/{slug}".replace("{slug}", encodeURIComponent(String(t.slug))),
      method: "GET",
      headers: a,
      query: o
    }, i);
    return new d(r, (s) => m(s));
  }
  /**
   * 
   * Find entity by slug and optional Type-ID
   */
  async entityBySlug(t, i) {
    return await (await this.entityBySlugRaw(t, i)).value();
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueidRaw(t, i) {
    if (t.uniqueid === null || t.uniqueid === void 0)
      throw new h("uniqueid", "Required parameter requestParameters.uniqueid was null or undefined when calling entityByUniqueid.");
    const o = {}, a = {};
    this.configuration && this.configuration.apiKey && (o.token = this.configuration.apiKey("token"));
    const r = await this.request({
      path: "/entities/uniqueid/{uniqueid}".replace("{uniqueid}", encodeURIComponent(String(t.uniqueid))),
      method: "GET",
      headers: a,
      query: o
    }, i);
    return new d(r, (s) => m(s));
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueid(t, i) {
    return await (await this.entityByUniqueidRaw(t, i)).value();
  }
}
class de extends f {
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async homeRaw(t) {
    const i = {}, o = {};
    this.configuration && this.configuration.apiKey && (i.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/pages/home",
      method: "GET",
      headers: o,
      query: i
    }, t);
    return new d(a, (r) => w(r));
  }
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async home(t) {
    return await (await this.homeRaw(t)).value();
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async pageRaw(t, i) {
    const o = {};
    t.slug !== void 0 && (o.slug = t.slug);
    const a = {};
    this.configuration && this.configuration.apiKey && (o.token = this.configuration.apiKey("token"));
    const r = await this.request({
      path: "/pages",
      method: "GET",
      headers: a,
      query: o
    }, i);
    return new d(r, (s) => w(s));
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async page(t = {}, i) {
    return await (await this.pageRaw(t, i)).value();
  }
}
class fe extends f {
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async searchRaw(t, i) {
    if (t.query === null || t.query === void 0)
      throw new h("query", "Required parameter requestParameters.query was null or undefined when calling search.");
    const o = {};
    t.query !== void 0 && (o.query = t.query);
    const a = {};
    this.configuration && this.configuration.apiKey && (o.token = this.configuration.apiKey("token"));
    const r = await this.request({
      path: "/search",
      method: "GET",
      headers: a,
      query: o
    }, i);
    return new d(r, (s) => s.map(S));
  }
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async search(t, i) {
    return await (await this.searchRaw(t, i)).value();
  }
}
class pe extends f {
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemapRaw(t) {
    const i = {}, o = {};
    this.configuration && this.configuration.apiKey && (i.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/sitemap",
      method: "GET",
      headers: o,
      query: i
    }, t);
    return new d(a, (r) => r.map(S));
  }
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemap(t) {
    return await (await this.sitemapRaw(t)).value();
  }
}
class ye extends f {
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async versionRaw(t) {
    const i = {}, o = {};
    this.configuration && this.configuration.apiKey && (i.token = this.configuration.apiKey("token"));
    const a = await this.request({
      path: "/version",
      method: "GET",
      headers: o,
      query: i
    }, t);
    return new d(a, (r) => se(r));
  }
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async version(t) {
    return await (await this.versionRaw(t)).value();
  }
}
const he = /[\p{Lu}]/u, ge = /[\p{Ll}]/u, _ = /^[\p{Lu}](?![\p{Lu}])/gu, U = /([\p{Alpha}\p{N}_]|$)/u, v = /[_.\- ]+/, ve = new RegExp("^" + v.source), b = new RegExp(v.source + U.source, "gu"), q = new RegExp("\\d+" + U.source, "gu"), me = (e, t, i, o) => {
  let a = !1, r = !1, s = !1, u = !1;
  for (let c = 0; c < e.length; c++) {
    const l = e[c];
    u = c > 2 ? e[c - 3] === "-" : !0, a && he.test(l) ? (e = e.slice(0, c) + "-" + e.slice(c), a = !1, s = r, r = !0, c++) : r && s && ge.test(l) && (!u || o) ? (e = e.slice(0, c - 1) + "-" + e.slice(c - 1), s = r, r = !1, a = !0) : (a = t(l) === l && i(l) !== l, s = r, r = i(l) === l && t(l) !== l);
  }
  return e;
}, we = (e, t) => (_.lastIndex = 0, e.replace(_, (i) => t(i))), _e = (e, t) => (b.lastIndex = 0, q.lastIndex = 0, e.replace(b, (i, o) => t(o)).replace(q, (i) => t(i)));
function be(e, t) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (t = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...t
  }, Array.isArray(e) ? e = e.map((r) => r.trim()).filter((r) => r.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  const i = t.locale === !1 ? (r) => r.toLowerCase() : (r) => r.toLocaleLowerCase(t.locale), o = t.locale === !1 ? (r) => r.toUpperCase() : (r) => r.toLocaleUpperCase(t.locale);
  return e.length === 1 ? v.test(e) ? "" : t.pascalCase ? o(e) : i(e) : (e !== i(e) && (e = me(e, i, o, t.preserveConsecutiveUppercase)), e = e.replace(ve, ""), e = t.preserveConsecutiveUppercase ? we(e, i) : i(e), t.pascalCase && (e = o(e.charAt(0)) + e.slice(1)), _e(e, o));
}
function qe(e, t, i) {
  const o = "virtual:flyo-components", a = "\0" + o;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(r) {
      if (r === o)
        return a;
    },
    async load(r) {
      if (r === a) {
        const s = [];
        for (const [c, l] of Object.entries(t)) {
          const y = await this.resolve(
            "/" + e + "/" + l + ".astro"
          );
          y && s.push(`export { default as ${be(c)} } from "${y.id}"`);
        }
        let u = null;
        return i && (u = await this.resolve(
          "/" + e + "/" + i + ".astro"
        )), u ? s.push(`export { default as fallback } from "${u.id}"`) : s.push('export { default as fallback } from "@flyo/nitro-astro/FallbackComponent.astro"'), s.join(";");
      }
    }
  };
}
function Re(e) {
  const t = "virtual:flyo-user-config", i = "\0" + t;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(o) {
      if (o === t)
        return i;
    },
    async load(o) {
      if (o === i)
        return `export default ${JSON.stringify(e)}`;
    }
  };
}
function p() {
  return globalThis.flyoNitroInstance || console.error("The Flyo Typescript Configuration has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function Ee() {
  return new ce(p());
}
function ke() {
  return new le(p());
}
function Ce() {
  return new de(p());
}
function Ie() {
  return new fe(p());
}
function Ae() {
  return new pe(p());
}
function Se() {
  return new ye(p());
}
function Ue(e) {
  return {
    "data-flyo-block-uid": e.uid
  };
}
function xe(e) {
  const t = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    ...e
  };
  return t.liveEdit === "true" ? t.liveEdit = !0 : t.liveEdit === "false" && (t.liveEdit = !1), {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: i, updateConfig: o, injectRoute: a }) => {
        a({
          pattern: "sitemap.xml",
          entrypoint: "@flyo/nitro-astro/sitemap.js"
        }), o({
          image: {
            service: {
              entrypoint: "@flyo/nitro-astro/cdn.ts"
            }
          },
          vite: {
            plugins: [
              qe(
                e.componentsDir,
                e.components,
                e.fallbackComponent
              ),
              Re(t)
            ]
          }
        }), i(
          "page-ssr",
          `
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${t.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
          `
        ), t.liveEdit && i(
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

              // Find all elements with the 'data-flyo-block-uid' attribute
              const elements = document.querySelectorAll('[data-flyo-block-uid]');

              // Add a click event listener to each element
              elements.forEach(element => {
                  element.addEventListener('click', function() {
                      // On click, alert the value of 'data-flyo-block-uid'
                      console.log('open', this.getAttribute('data-flyo-block-uid'))
                      openBlockInFlyo(this.getAttribute('data-flyo-block-uid'))
                  });
              });
            `
        );
      }
    }
  };
}
export {
  xe as default,
  Ue as editableBlock,
  Ee as useConfigApi,
  p as useConfiguration,
  ke as useEntitiesApi,
  Ce as usePagesApi,
  Ie as useSearchApi,
  Ae as useSitemapApi,
  Se as useVersionApi
};
