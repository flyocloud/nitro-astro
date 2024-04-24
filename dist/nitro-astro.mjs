const U = "https://api.flyo.cloud/nitro/v1".replace(/\/+$/, "");
class j {
  constructor(n = {}) {
    this.configuration = n;
  }
  set config(n) {
    this.configuration = n;
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
    const n = this.configuration.apiKey;
    if (n)
      return typeof n == "function" ? n : () => n;
  }
  get accessToken() {
    const n = this.configuration.accessToken;
    if (n)
      return typeof n == "function" ? n : async () => n;
  }
  get headers() {
    return this.configuration.headers;
  }
  get credentials() {
    return this.configuration.credentials;
  }
}
const L = new j(), R = class C {
  constructor(n = L) {
    this.configuration = n, this.fetchApi = async (t, i) => {
      let r = { url: t, init: i };
      for (const a of this.middleware)
        a.pre && (r = await a.pre({
          fetch: this.fetchApi,
          ...r
        }) || r);
      let o;
      try {
        o = await (this.configuration.fetchApi || fetch)(r.url, r.init);
      } catch (a) {
        for (const l of this.middleware)
          l.onError && (o = await l.onError({
            fetch: this.fetchApi,
            url: r.url,
            init: r.init,
            error: a,
            response: o ? o.clone() : void 0
          }) || o);
        if (o === void 0)
          throw a instanceof Error ? new O(a, "The request failed and the interceptors did not return an alternative response") : a;
      }
      for (const a of this.middleware)
        a.post && (o = await a.post({
          fetch: this.fetchApi,
          url: r.url,
          init: r.init,
          response: o.clone()
        }) || o);
      return o;
    }, this.middleware = n.middleware;
  }
  withMiddleware(...n) {
    const t = this.clone();
    return t.middleware = t.middleware.concat(...n), t;
  }
  withPreMiddleware(...n) {
    const t = n.map((i) => ({ pre: i }));
    return this.withMiddleware(...t);
  }
  withPostMiddleware(...n) {
    const t = n.map((i) => ({ post: i }));
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
  isJsonMime(n) {
    return n ? C.jsonRegex.test(n) : !1;
  }
  async request(n, t) {
    const { url: i, init: r } = await this.createFetchParams(n, t), o = await this.fetchApi(i, r);
    if (o && o.status >= 200 && o.status < 300)
      return o;
    throw new K(o, "Response returned an error code");
  }
  async createFetchParams(n, t) {
    let i = this.configuration.basePath + n.path;
    n.query !== void 0 && Object.keys(n.query).length !== 0 && (i += "?" + this.configuration.queryParamsStringify(n.query));
    const r = Object.assign({}, this.configuration.headers, n.headers);
    Object.keys(r).forEach((g) => r[g] === void 0 ? delete r[g] : {});
    const o = typeof t == "function" ? t : async () => t, a = {
      method: n.method,
      headers: r,
      body: n.body,
      credentials: this.configuration.credentials
    }, l = {
      ...a,
      ...await o({
        init: a,
        context: n
      })
    };
    let s;
    N(l.body) || l.body instanceof URLSearchParams || P(l.body) ? s = l.body : this.isJsonMime(r["Content-Type"]) ? s = JSON.stringify(l.body) : s = l.body;
    const u = {
      ...l,
      body: s
    };
    return { url: i, init: u };
  }
  /**
   * Create a shallow clone of `this` by constructing a new instance
   * and then shallow cloning data members.
   */
  clone() {
    const n = this.constructor, t = new n(this.configuration);
    return t.middleware = this.middleware.slice(), t;
  }
};
R.jsonRegex = new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i");
let f = R;
function P(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function N(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
class K extends Error {
  constructor(n, t) {
    super(t), this.response = n, this.name = "ResponseError";
  }
}
class O extends Error {
  constructor(n, t) {
    super(t), this.cause = n, this.name = "FetchError";
  }
}
class h extends Error {
  constructor(n, t) {
    super(t), this.field = n, this.name = "RequiredError";
  }
}
function I(e, n = "") {
  return Object.keys(e).map((t) => k(t, e[t], n)).filter((t) => t.length > 0).join("&");
}
function k(e, n, t = "") {
  const i = t + (t.length ? `[${e}]` : e);
  if (n instanceof Array) {
    const r = n.map((o) => encodeURIComponent(String(o))).join(`&${encodeURIComponent(i)}=`);
    return `${encodeURIComponent(i)}=${r}`;
  }
  if (n instanceof Set) {
    const r = Array.from(n);
    return k(e, r, t);
  }
  return n instanceof Date ? `${encodeURIComponent(i)}=${encodeURIComponent(n.toISOString())}` : n instanceof Object ? I(n, i) : `${encodeURIComponent(i)}=${encodeURIComponent(String(n))}`;
}
function v(e, n) {
  return Object.keys(e).reduce(
    (t, i) => ({ ...t, [i]: n(e[i]) }),
    {}
  );
}
class d {
  constructor(n, t = (i) => i) {
    this.raw = n, this.transformer = t;
  }
  async value() {
    return this.transformer(await this.raw.json());
  }
}
function $(e) {
  return B(e);
}
function B(e, n) {
  return e == null ? e : {
    identifier: e.identifier == null ? void 0 : e.identifier,
    content: e.content == null ? void 0 : e.content.map(A)
  };
}
function A(e) {
  return F(e);
}
function F(e, n) {
  return e == null ? e : {
    items: e.items == null ? void 0 : e.items,
    content: e.content == null ? void 0 : e.content,
    config: e.config == null ? void 0 : e.config,
    identifier: e.identifier == null ? void 0 : e.identifier,
    uid: e.uid == null ? void 0 : e.uid,
    component: e.component == null ? void 0 : e.component,
    slots: e.slots == null ? void 0 : v(e.slots, $)
  };
}
function S(e) {
  return D(e);
}
function D(e, n) {
  return e == null ? e : {
    type: e.type == null ? void 0 : e.type,
    target: e.target == null ? void 0 : e.target,
    label: e.label == null ? void 0 : e.label,
    href: e.href == null ? void 0 : e.href,
    slug: e.slug == null ? void 0 : e.slug,
    properties: e.properties == null ? void 0 : e.properties,
    children: e.children == null ? void 0 : e.children.map(S)
  };
}
function M(e) {
  return G(e);
}
function G(e, n) {
  return e == null ? e : {
    items: e.items == null ? void 0 : e.items.map(S),
    uid: e.uid == null ? void 0 : e.uid,
    identifier: e.identifier == null ? void 0 : e.identifier,
    label: e.label == null ? void 0 : e.label
  };
}
function J(e) {
  return V(e);
}
function V(e, n) {
  return e == null ? e : {
    domain: e.domain == null ? void 0 : e.domain,
    slug: e.slug == null ? void 0 : e.slug,
    version: e.version == null ? void 0 : e.version,
    updated_at: e.updated_at == null ? void 0 : e.updated_at,
    language: e.language == null ? void 0 : e.language,
    primary_language: e.primary_language == null ? void 0 : e.primary_language
  };
}
function W(e) {
  return Q(e);
}
function Q(e, n) {
  return e == null ? e : {
    nitro: e.nitro == null ? void 0 : J(e.nitro),
    pages: e.pages == null ? void 0 : e.pages,
    containers: e.containers == null ? void 0 : v(e.containers, M),
    globals: e.globals == null ? void 0 : e.globals
  };
}
function z(e) {
  return H(e);
}
function H(e, n) {
  return e == null ? e : {
    api: e.api == null ? void 0 : e.api,
    image: e.image == null ? void 0 : e.image
  };
}
function Y(e) {
  return Z(e);
}
function Z(e, n) {
  return e == null ? e : {
    _version: e._version == null ? void 0 : e._version,
    entity_metric: e.entity_metric == null ? void 0 : z(e.entity_metric),
    entity_unique_id: e.entity_unique_id == null ? void 0 : e.entity_unique_id,
    entity_id: e.entity_id == null ? void 0 : e.entity_id,
    entity_image: e.entity_image == null ? void 0 : e.entity_image,
    entity_slug: e.entity_slug == null ? void 0 : e.entity_slug,
    entity_teaser: e.entity_teaser == null ? void 0 : e.entity_teaser,
    entity_time_end: e.entity_time_end == null ? void 0 : e.entity_time_end,
    entity_time_start: e.entity_time_start == null ? void 0 : e.entity_time_start,
    entity_title: e.entity_title == null ? void 0 : e.entity_title,
    entity_type: e.entity_type == null ? void 0 : e.entity_type,
    entity_type_id: e.entity_type_id == null ? void 0 : e.entity_type_id,
    updated_at: e.updated_at == null ? void 0 : e.updated_at,
    routes: e.routes == null ? void 0 : e.routes
  };
}
function w(e) {
  return X(e);
}
function X(e, n) {
  return e == null ? e : {
    entity: e.entity == null ? void 0 : Y(e.entity),
    model: e.model == null ? void 0 : e.model,
    language: e.language == null ? void 0 : e.language,
    jsonld: e.jsonld == null ? void 0 : e.jsonld
  };
}
function x(e) {
  return ee(e);
}
function ee(e, n) {
  return e == null ? e : {
    entity_unique_id: e.entity_unique_id == null ? void 0 : e.entity_unique_id,
    entity_title: e.entity_title == null ? void 0 : e.entity_title,
    entity_teaser: e.entity_teaser == null ? void 0 : e.entity_teaser,
    entity_slug: e.entity_slug == null ? void 0 : e.entity_slug,
    entity_time_start: e.entity_time_start == null ? void 0 : e.entity_time_start,
    entity_type: e.entity_type == null ? void 0 : e.entity_type,
    entity_type_id: e.entity_type_id == null ? void 0 : e.entity_type_id,
    entity_image: e.entity_image == null ? void 0 : e.entity_image,
    routes: e.routes == null ? void 0 : e.routes
  };
}
function ne(e) {
  return te(e);
}
function te(e, n) {
  return e == null ? e : {
    description: e.description == null ? void 0 : e.description,
    image: e.image == null ? void 0 : e.image,
    title: e.title == null ? void 0 : e.title
  };
}
function ie(e) {
  return oe(e);
}
function oe(e, n) {
  return e == null ? e : {
    slug: e.slug == null ? void 0 : e.slug,
    title: e.title == null ? void 0 : e.title
  };
}
function re(e) {
  return ae(e);
}
function ae(e, n) {
  return e == null ? e : {
    value: e.value == null ? void 0 : e.value,
    navigation: e.navigation == null ? void 0 : e.navigation,
    propagate: e.propagate == null ? void 0 : e.propagate
  };
}
function _(e) {
  return le(e);
}
function le(e, n) {
  return e == null ? e : {
    id: e.id == null ? void 0 : e.id,
    title: e.title == null ? void 0 : e.title,
    href: e.href == null ? void 0 : e.href,
    slug: e.slug == null ? void 0 : e.slug,
    json: e.json == null ? void 0 : e.json.map(A),
    depth: e.depth == null ? void 0 : e.depth,
    is_home: e.is_home == null ? void 0 : e.is_home,
    created_at: e.created_at == null ? void 0 : e.created_at,
    updated_at: e.updated_at == null ? void 0 : e.updated_at,
    is_visible: e.is_visible == null ? void 0 : e.is_visible,
    meta_json: e.meta_json == null ? void 0 : ne(e.meta_json),
    properties: e.properties == null ? void 0 : v(e.properties, re),
    uid: e.uid == null ? void 0 : e.uid,
    type: e.type == null ? void 0 : e.type,
    target: e.target == null ? void 0 : e.target,
    container: e.container == null ? void 0 : e.container,
    breadcrumb: e.breadcrumb == null ? void 0 : e.breadcrumb.map(ie)
  };
}
function se(e) {
  return ue(e);
}
function ue(e, n) {
  return e == null ? e : {
    version: e.version == null ? void 0 : e.version,
    updated_at: e.updated_at == null ? void 0 : e.updated_at
  };
}
class ce extends f {
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async configRaw(n, t) {
    const i = {};
    n.lang != null && (i.lang = n.lang);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/config",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => W(a));
  }
  /**
   * The config API endpoint provides comprehensive information required for configuring the layout of websites. It encompasses various essential elements, including containers with pages, an extensive list of available slugs, globals containing content pool data, and crucial details about the Nitro configuration itself. By accessing this endpoint, developers can gather all the necessary data to effectively design and structure their websites. The endpoint offers a holistic view of the website\'s layout, empowering developers to tailor the user experience and optimize the overall design.
   * Get Config
   */
  async config(n = {}, t) {
    return await (await this.configRaw(n, t)).value();
  }
}
class de extends f {
  /**
   * The endpoint allows for the retrieval of entities based on their slug, with an optional Entity-Type-ID for more accurate results. The endpoint requires a `slug` parameter to be passed in the path, which is necessary for identifying the entity. However, since slugs are not unique across different entities, it is highly recommended to also provide the `typeId` parameter through the query to avoid incorrect or unintended results. This `typeId` serves as an Entity-Definition-Schema ID, ensuring a more precise and targeted entity retrieval by distinguishing the entities more clearly. The `slug` parameter is mandatory and should be a string (e.g., \'hello-world\'), while the `typeId` parameter is optional and should be an integer (e.g., 123), representing the Entity-Definition-Schema ID.
   * Find entity by slug and optional Entity-Type-ID
   */
  async entityBySlugRaw(n, t) {
    if (n.slug == null)
      throw new h(
        "slug",
        'Required parameter "slug" was null or undefined when calling entityBySlug().'
      );
    const i = {};
    n.lang != null && (i.lang = n.lang), n.typeId != null && (i.typeId = n.typeId);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/entities/slug/{slug}".replace("{slug}", encodeURIComponent(String(n.slug))),
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => w(a));
  }
  /**
   * The endpoint allows for the retrieval of entities based on their slug, with an optional Entity-Type-ID for more accurate results. The endpoint requires a `slug` parameter to be passed in the path, which is necessary for identifying the entity. However, since slugs are not unique across different entities, it is highly recommended to also provide the `typeId` parameter through the query to avoid incorrect or unintended results. This `typeId` serves as an Entity-Definition-Schema ID, ensuring a more precise and targeted entity retrieval by distinguishing the entities more clearly. The `slug` parameter is mandatory and should be a string (e.g., \'hello-world\'), while the `typeId` parameter is optional and should be an integer (e.g., 123), representing the Entity-Definition-Schema ID.
   * Find entity by slug and optional Entity-Type-ID
   */
  async entityBySlug(n, t) {
    return await (await this.entityBySlugRaw(n, t)).value();
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueidRaw(n, t) {
    if (n.uniqueid == null)
      throw new h(
        "uniqueid",
        'Required parameter "uniqueid" was null or undefined when calling entityByUniqueid().'
      );
    const i = {};
    n.lang != null && (i.lang = n.lang);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/entities/uniqueid/{uniqueid}".replace("{uniqueid}", encodeURIComponent(String(n.uniqueid))),
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => w(a));
  }
  /**
   * The endpoint provides comprehensive information about a specified entity. An entity represents a collection of information pertaining to a specific data type and is defined by a key-value pair. You can use various data types such as blogs, events, or any other relevant data. However, in order to access an entity, it must be properly configured within the nitro config.
   * Find entity by uniqueid
   */
  async entityByUniqueid(n, t) {
    return await (await this.entityByUniqueidRaw(n, t)).value();
  }
}
class fe extends f {
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async homeRaw(n, t) {
    const i = {};
    n.lang != null && (i.lang = n.lang);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/pages/home",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => _(a));
  }
  /**
   * This endpoint allows you to retrieve the designated homepage of a website. Alternatively, you can utilize the pages endpoint by specifying an empty slug parameter to achieve the same result. By using either of these methods, you can effectively access the desired homepage of the website.
   * Get Home
   */
  async home(n = {}, t) {
    return await (await this.homeRaw(n, t)).value();
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async pageRaw(n, t) {
    const i = {};
    n.lang != null && (i.lang = n.lang), n.slug != null && (i.slug = n.slug);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/pages",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => _(a));
  }
  /**
   * This endpoint retrieves comprehensive information from a specified page using either a slug or a path. The slug refers to a unique identifier for the page, while the path is the slug with a leading slash. By providing either the slug or the path as input, the function will gather all the relevant details associated with the page.
   * Get Page by slug
   */
  async page(n = {}, t) {
    return await (await this.pageRaw(n, t)).value();
  }
}
class pe extends f {
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async searchRaw(n, t) {
    if (n.query == null)
      throw new h(
        "query",
        'Required parameter "query" was null or undefined when calling search().'
      );
    const i = {};
    n.lang != null && (i.lang = n.lang), n.query != null && (i.query = n.query);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/search",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => a.map(x));
  }
  /**
   * This endpoint offers a powerful capability to search through the websites sitemap, encompassing both pages and entities. With this endpoint, users can efficiently explore and retrieve information from your sitemap by creating a paginated search experience.
   * Get Search by query
   */
  async search(n, t) {
    return await (await this.searchRaw(n, t)).value();
  }
}
class ge extends f {
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemapRaw(n, t) {
    const i = {};
    n.lang != null && (i.lang = n.lang);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/sitemap",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => a.map(x));
  }
  /**
   * This endpoint provides comprehensive data for generating the sitemap. It encompasses all the necessary information, including pages from containers, as well as all entities that have been mapped.
   * Get Sitemap
   */
  async sitemap(n = {}, t) {
    return await (await this.sitemapRaw(n, t)).value();
  }
}
class ye extends f {
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async versionRaw(n, t) {
    const i = {};
    n.lang != null && (i.lang = n.lang);
    const r = {};
    this.configuration && this.configuration.apiKey && (i.token = await this.configuration.apiKey("token"));
    const o = await this.request({
      path: "/version",
      method: "GET",
      headers: r,
      query: i
    }, t);
    return new d(o, (a) => se(a));
  }
  /**
   * The Version API endpoint offers a highly efficient solution for evaluating the current caching status of your application\'s caching mechanism. This functionality allows you to cache the entire application configuration and page responses indefinitely. However, utilizing this endpoint enables you to assess the validity of the cache by sending a request to determine its current status. This caching endpoint is specifically designed for optimal performance when compared to the configuration endpoint, which requires more thorough evaluation and encompasses a substantial response body.
   * Get Version Information
   */
  async version(n = {}, t) {
    return await (await this.versionRaw(n, t)).value();
  }
}
const he = /[\p{Lu}]/u, ve = /[\p{Ll}]/u, b = /^[\p{Lu}](?![\p{Lu}])/gu, T = /([\p{Alpha}\p{N}_]|$)/u, m = /[_.\- ]+/, me = new RegExp("^" + m.source), E = new RegExp(m.source + T.source, "gu"), q = new RegExp("\\d+" + T.source, "gu"), we = (e, n, t, i) => {
  let r = !1, o = !1, a = !1, l = !1;
  for (let s = 0; s < e.length; s++) {
    const u = e[s];
    l = s > 2 ? e[s - 3] === "-" : !0, r && he.test(u) ? (e = e.slice(0, s) + "-" + e.slice(s), r = !1, a = o, o = !0, s++) : o && a && ve.test(u) && (!l || i) ? (e = e.slice(0, s - 1) + "-" + e.slice(s - 1), a = o, o = !1, r = !0) : (r = n(u) === u && t(u) !== u, a = o, o = t(u) === u && n(u) !== u);
  }
  return e;
}, _e = (e, n) => (b.lastIndex = 0, e.replace(b, (t) => n(t))), be = (e, n) => (E.lastIndex = 0, q.lastIndex = 0, e.replace(E, (t, i) => n(i)).replace(q, (t) => n(t)));
function Ee(e, n) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (n = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...n
  }, Array.isArray(e) ? e = e.map((o) => o.trim()).filter((o) => o.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  const t = n.locale === !1 ? (o) => o.toLowerCase() : (o) => o.toLocaleLowerCase(n.locale), i = n.locale === !1 ? (o) => o.toUpperCase() : (o) => o.toLocaleUpperCase(n.locale);
  return e.length === 1 ? m.test(e) ? "" : n.pascalCase ? i(e) : t(e) : (e !== t(e) && (e = we(e, t, i, n.preserveConsecutiveUppercase)), e = e.replace(me, ""), e = n.preserveConsecutiveUppercase ? _e(e, t) : t(e), n.pascalCase && (e = i(e.charAt(0)) + e.slice(1)), be(e, i));
}
function qe(e, n, t) {
  const i = "virtual:flyo-components", r = "\0" + i;
  return {
    name: "vite-plugin-flyo-components",
    async resolveId(o) {
      if (o === i)
        return r;
    },
    async load(o) {
      if (o === r) {
        const a = [];
        for (const [s, u] of Object.entries(n)) {
          const g = await this.resolve(
            "/" + e + "/" + u + ".astro"
          );
          g && a.push(`export { default as ${Ee(s)} } from "${g.id}"`);
        }
        let l = null;
        return t && (l = await this.resolve(
          "/" + e + "/" + t + ".astro"
        )), l ? a.push(`export { default as fallback } from "${l.id}"`) : a.push('export { default as fallback } from "@flyo/nitro-astro/FallbackComponent.astro"'), a.join(";");
      }
    }
  };
}
let Re = Symbol("clean"), c = [], Ce = (e, n) => {
  let t = [], i = {
    get() {
      return i.lc || i.listen(() => {
      })(), i.value;
    },
    l: n || 0,
    lc: 0,
    listen(r, o) {
      return i.lc = t.push(r, o || i.l) / 2, () => {
        let a = t.indexOf(r);
        ~a && (t.splice(a, 2), --i.lc || i.off());
      };
    },
    notify(r, o) {
      let a = !c.length;
      for (let l = 0; l < t.length; l += 2)
        c.push(
          t[l],
          t[l + 1],
          i.value,
          r,
          o
        );
      if (a) {
        for (let l = 0; l < c.length; l += 5) {
          let s;
          for (let u = l + 1; !s && (u += 5) < c.length; )
            c[u] < c[l + 1] && (s = c.push(
              c[l],
              c[l + 1],
              c[l + 2],
              c[l + 3],
              c[l + 4]
            ));
          s || c[l](
            c[l + 2],
            c[l + 3],
            c[l + 4]
          );
        }
        c.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {
    },
    set(r) {
      let o = i.value;
      o !== r && (i.value = r, i.notify(o));
    },
    subscribe(r, o) {
      let a = i.listen(r, o);
      return r(i.value), a;
    },
    value: e
  };
  return process.env.NODE_ENV !== "production" && (i[Re] = () => {
    t = [], i.lc = 0, i.off();
  }), i;
};
function p() {
  return globalThis.flyoNitroInstance || console.error("The Flyo Typescript Configuration has not been initialized correctly"), globalThis.flyoNitroInstance;
}
function Ie() {
  return new ce(p());
}
const y = Ce(!1);
async function ke(e = null) {
  return (!y.get() || globalThis.flyoNitroIntegrationOptions.liveEdit) && y.set(await Ie().config({ lang: e })), y.get();
}
function Ae() {
  return new de(p());
}
function Se() {
  return new fe(p());
}
function xe() {
  return new pe(p());
}
function Te() {
  return new ge(p());
}
function Ue() {
  return new ye(p());
}
function je(e) {
  return {
    "data-flyo-block-uid": e.uid
  };
}
function Le(e) {
  const n = {
    accessToken: !1,
    liveEdit: !1,
    fallbackComponent: null,
    componentsDir: "src/components/flyo",
    ...e
  };
  return n.liveEdit === "true" ? n.liveEdit = !0 : n.liveEdit === "false" && (n.liveEdit = !1), {
    name: "@flyo/nitro-astro",
    hooks: {
      "astro:config:setup": ({ injectScript: t, updateConfig: i, injectRoute: r }) => {
        r({
          pattern: "sitemap.xml",
          entrypoint: "@flyo/nitro-astro/sitemap.ts"
        }), i({
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
              )
            ]
          }
        }), t(
          "page-ssr",
          `
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${n.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
            globalThis.flyoNitroIntegrationOptions = {
              liveEdit: ${n.liveEdit}
            };
          `
        ), n.liveEdit && t(
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

              elements.forEach(element => {
                  element.addEventListener('click', function() {
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
  Le as default,
  je as editableBlock,
  ke as useConfig,
  Ie as useConfigApi,
  p as useConfiguration,
  Ae as useEntitiesApi,
  Se as usePagesApi,
  xe as useSearchApi,
  Te as useSitemapApi,
  Ue as useVersionApi
};
