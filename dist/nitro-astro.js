(function(l,h){typeof exports=="object"&&typeof module<"u"?h(exports):typeof define=="function"&&define.amd?define(["exports"],h):(l=typeof globalThis<"u"?globalThis:l||self,h(l.flyoNitroIntegration={}))})(this,function(l){"use strict";const h="https://api.flyo.cloud/nitro/v1".replace(/\/+$/,"");class U{constructor(i={}){this.configuration=i}set config(i){this.configuration=i}get basePath(){return this.configuration.basePath!=null?this.configuration.basePath:h}get fetchApi(){return this.configuration.fetchApi}get middleware(){return this.configuration.middleware||[]}get queryParamsStringify(){return this.configuration.queryParamsStringify||q}get username(){return this.configuration.username}get password(){return this.configuration.password}get apiKey(){const i=this.configuration.apiKey;if(i)return typeof i=="function"?i:()=>i}get accessToken(){const i=this.configuration.accessToken;if(i)return typeof i=="function"?i:async()=>i}get headers(){return this.configuration.headers}get credentials(){return this.configuration.credentials}}const L=new U,_=class P{constructor(i=L){this.configuration=i,this.fetchApi=async(t,r)=>{let a={url:t,init:r};for(const s of this.middleware)s.pre&&(a=await s.pre({fetch:this.fetchApi,...a})||a);let o;try{o=await(this.configuration.fetchApi||fetch)(a.url,a.init)}catch(s){for(const u of this.middleware)u.onError&&(o=await u.onError({fetch:this.fetchApi,url:a.url,init:a.init,error:s,response:o?o.clone():void 0})||o);if(o===void 0)throw s instanceof Error?new O(s,"The request failed and the interceptors did not return an alternative response"):s}for(const s of this.middleware)s.post&&(o=await s.post({fetch:this.fetchApi,url:a.url,init:a.init,response:o.clone()})||o);return o},this.middleware=i.middleware}withMiddleware(...i){const t=this.clone();return t.middleware=t.middleware.concat(...i),t}withPreMiddleware(...i){const t=i.map(r=>({pre:r}));return this.withMiddleware(...t)}withPostMiddleware(...i){const t=i.map(r=>({post:r}));return this.withMiddleware(...t)}isJsonMime(i){return i?P.jsonRegex.test(i):!1}async request(i,t){const{url:r,init:a}=await this.createFetchParams(i,t),o=await this.fetchApi(r,a);if(o&&o.status>=200&&o.status<300)return o;throw new N(o,"Response returned an error code")}async createFetchParams(i,t){let r=this.configuration.basePath+i.path;i.query!==void 0&&Object.keys(i.query).length!==0&&(r+="?"+this.configuration.queryParamsStringify(i.query));const a=Object.assign({},this.configuration.headers,i.headers);Object.keys(a).forEach(g=>a[g]===void 0?delete a[g]:{});const o=typeof t=="function"?t:async()=>t,s={method:i.method,headers:a,body:i.body,credentials:this.configuration.credentials},u={...s,...await o({init:s,context:i})};let c;K(u.body)||u.body instanceof URLSearchParams||x(u.body)?c=u.body:this.isJsonMime(a["Content-Type"])?c=JSON.stringify(u.body):c=u.body;const d={...u,body:c};return{url:r,init:d}}clone(){const i=this.constructor,t=new i(this.configuration);return t.middleware=this.middleware.slice(),t}};_.jsonRegex=new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$","i");let y=_;function x(e){return typeof Blob<"u"&&e instanceof Blob}function K(e){return typeof FormData<"u"&&e instanceof FormData}class N extends Error{constructor(i,t){super(t),this.response=i,this.name="ResponseError"}}class O extends Error{constructor(i,t){super(t),this.cause=i,this.name="FetchError"}}class v extends Error{constructor(i,t){super(t),this.field=i,this.name="RequiredError"}}function n(e,i){return e[i]!=null}function q(e,i=""){return Object.keys(e).map(t=>b(t,e[t],i)).filter(t=>t.length>0).join("&")}function b(e,i,t=""){const r=t+(t.length?`[${e}]`:e);if(i instanceof Array){const a=i.map(o=>encodeURIComponent(String(o))).join(`&${encodeURIComponent(r)}=`);return`${encodeURIComponent(r)}=${a}`}if(i instanceof Set){const a=Array.from(i);return b(e,a,t)}return i instanceof Date?`${encodeURIComponent(r)}=${encodeURIComponent(i.toISOString())}`:i instanceof Object?q(i,r):`${encodeURIComponent(r)}=${encodeURIComponent(String(i))}`}function m(e,i){return Object.keys(e).reduce((t,r)=>({...t,[r]:i(e[r])}),{})}class f{constructor(i,t=r=>r){this.raw=i,this.transformer=t}async value(){return this.transformer(await this.raw.json())}}function $(e){return M(e)}function M(e,i){return e==null?e:{identifier:n(e,"identifier")?e.identifier:void 0,content:n(e,"content")?e.content.map(R):void 0}}function R(e){return F(e)}function F(e,i){return e==null?e:{items:n(e,"items")?e.items:void 0,content:n(e,"content")?e.content:void 0,config:n(e,"config")?e.config:void 0,identifier:n(e,"identifier")?e.identifier:void 0,uid:n(e,"uid")?e.uid:void 0,component:n(e,"component")?e.component:void 0,slots:n(e,"slots")?m(e.slots,$):void 0}}function E(e){return B(e)}function B(e,i){return e==null?e:{type:n(e,"type")?e.type:void 0,target:n(e,"target")?e.target:void 0,label:n(e,"label")?e.label:void 0,href:n(e,"href")?e.href:void 0,slug:n(e,"slug")?e.slug:void 0,properties:n(e,"properties")?e.properties:void 0,children:n(e,"children")?e.children.map(E):void 0}}function D(e){return G(e)}function G(e,i){return e==null?e:{items:n(e,"items")?e.items.map(E):void 0,uid:n(e,"uid")?e.uid:void 0,identifier:n(e,"identifier")?e.identifier:void 0,label:n(e,"label")?e.label:void 0}}function J(e){return V(e)}function V(e,i){return e==null?e:{domain:n(e,"domain")?e.domain:void 0,slug:n(e,"slug")?e.slug:void 0,version:n(e,"version")?e.version:void 0,updated_at:n(e,"updated_at")?e.updated_at:void 0,language:n(e,"language")?e.language:void 0}}function W(e){return z(e)}function z(e,i){return e==null?e:{nitro:n(e,"nitro")?J(e.nitro):void 0,pages:n(e,"pages")?e.pages:void 0,containers:n(e,"containers")?m(e.containers,D):void 0,globals:n(e,"globals")?e.globals:void 0}}function H(e){return X(e)}function X(e,i){return e==null?e:{api:n(e,"api")?e.api:void 0,image:n(e,"image")?e.image:void 0}}function Z(e){return Q(e)}function Q(e,i){return e==null?e:{_version:n(e,"_version")?e._version:void 0,entity_metric:n(e,"entity_metric")?H(e.entity_metric):void 0,entity_unique_id:n(e,"entity_unique_id")?e.entity_unique_id:void 0,entity_id:n(e,"entity_id")?e.entity_id:void 0,entity_image:n(e,"entity_image")?e.entity_image:void 0,entity_slug:n(e,"entity_slug")?e.entity_slug:void 0,entity_teaser:n(e,"entity_teaser")?e.entity_teaser:void 0,entity_time_end:n(e,"entity_time_end")?e.entity_time_end:void 0,entity_time_start:n(e,"entity_time_start")?e.entity_time_start:void 0,entity_title:n(e,"entity_title")?e.entity_title:void 0,entity_type:n(e,"entity_type")?e.entity_type:void 0,entity_type_id:n(e,"entity_type_id")?e.entity_type_id:void 0,updated_at:n(e,"updated_at")?e.updated_at:void 0,routes:n(e,"routes")?e.routes:void 0}}function C(e){return Y(e)}function Y(e,i){return e==null?e:{entity:n(e,"entity")?Z(e.entity):void 0,model:n(e,"model")?e.model:void 0,language:n(e,"language")?e.language:void 0,jsonld:n(e,"jsonld")?e.jsonld:void 0}}function A(e){return ee(e)}function ee(e,i){return e==null?e:{entity_unique_id:n(e,"entity_unique_id")?e.entity_unique_id:void 0,entity_title:n(e,"entity_title")?e.entity_title:void 0,entity_teaser:n(e,"entity_teaser")?e.entity_teaser:void 0,entity_slug:n(e,"entity_slug")?e.entity_slug:void 0,entity_time_start:n(e,"entity_time_start")?e.entity_time_start:void 0,entity_type:n(e,"entity_type")?e.entity_type:void 0,entity_type_id:n(e,"entity_type_id")?e.entity_type_id:void 0,entity_image:n(e,"entity_image")?e.entity_image:void 0,routes:n(e,"routes")?e.routes:void 0}}function ie(e){return te(e)}function te(e,i){return e==null?e:{description:n(e,"description")?e.description:void 0,image:n(e,"image")?e.image:void 0,title:n(e,"title")?e.title:void 0}}function ne(e){return oe(e)}function oe(e,i){return e==null?e:{slug:n(e,"slug")?e.slug:void 0,title:n(e,"title")?e.title:void 0}}function re(e){return ae(e)}function ae(e,i){return e==null?e:{value:n(e,"value")?e.value:void 0,navigation:n(e,"navigation")?e.navigation:void 0,propagate:n(e,"propagate")?e.propagate:void 0}}function I(e){return se(e)}function se(e,i){return e==null?e:{id:n(e,"id")?e.id:void 0,title:n(e,"title")?e.title:void 0,href:n(e,"href")?e.href:void 0,slug:n(e,"slug")?e.slug:void 0,json:n(e,"json")?e.json.map(R):void 0,depth:n(e,"depth")?e.depth:void 0,is_home:n(e,"is_home")?e.is_home:void 0,created_at:n(e,"created_at")?e.created_at:void 0,updated_at:n(e,"updated_at")?e.updated_at:void 0,is_visible:n(e,"is_visible")?e.is_visible:void 0,meta_json:n(e,"meta_json")?ie(e.meta_json):void 0,properties:n(e,"properties")?m(e.properties,re):void 0,uid:n(e,"uid")?e.uid:void 0,type:n(e,"type")?e.type:void 0,target:n(e,"target")?e.target:void 0,container:n(e,"container")?e.container:void 0,breadcrumb:n(e,"breadcrumb")?e.breadcrumb.map(ne):void 0}}function ue(e){return ce(e)}function ce(e,i){return e==null?e:{version:n(e,"version")?e.version:void 0,updated_at:n(e,"updated_at")?e.updated_at:void 0}}class de extends y{async configRaw(i){const t={},r={};this.configuration&&this.configuration.apiKey&&(t.token=this.configuration.apiKey("token"));const a=await this.request({path:"/config",method:"GET",headers:r,query:t},i);return new f(a,o=>W(o))}async config(i){return await(await this.configRaw(i)).value()}}class le extends y{async entityBySlugRaw(i,t){if(i.slug===null||i.slug===void 0)throw new v("slug","Required parameter requestParameters.slug was null or undefined when calling entityBySlug.");const r={};i.typeId!==void 0&&(r.typeId=i.typeId);const a={};this.configuration&&this.configuration.apiKey&&(r.token=this.configuration.apiKey("token"));const o=await this.request({path:"/entities/slug/{slug}".replace("{slug}",encodeURIComponent(String(i.slug))),method:"GET",headers:a,query:r},t);return new f(o,s=>C(s))}async entityBySlug(i,t){return await(await this.entityBySlugRaw(i,t)).value()}async entityByUniqueidRaw(i,t){if(i.uniqueid===null||i.uniqueid===void 0)throw new v("uniqueid","Required parameter requestParameters.uniqueid was null or undefined when calling entityByUniqueid.");const r={},a={};this.configuration&&this.configuration.apiKey&&(r.token=this.configuration.apiKey("token"));const o=await this.request({path:"/entities/uniqueid/{uniqueid}".replace("{uniqueid}",encodeURIComponent(String(i.uniqueid))),method:"GET",headers:a,query:r},t);return new f(o,s=>C(s))}async entityByUniqueid(i,t){return await(await this.entityByUniqueidRaw(i,t)).value()}}class fe extends y{async homeRaw(i){const t={},r={};this.configuration&&this.configuration.apiKey&&(t.token=this.configuration.apiKey("token"));const a=await this.request({path:"/pages/home",method:"GET",headers:r,query:t},i);return new f(a,o=>I(o))}async home(i){return await(await this.homeRaw(i)).value()}async pageRaw(i,t){const r={};i.slug!==void 0&&(r.slug=i.slug);const a={};this.configuration&&this.configuration.apiKey&&(r.token=this.configuration.apiKey("token"));const o=await this.request({path:"/pages",method:"GET",headers:a,query:r},t);return new f(o,s=>I(s))}async page(i={},t){return await(await this.pageRaw(i,t)).value()}}class pe extends y{async searchRaw(i,t){if(i.query===null||i.query===void 0)throw new v("query","Required parameter requestParameters.query was null or undefined when calling search.");const r={};i.query!==void 0&&(r.query=i.query);const a={};this.configuration&&this.configuration.apiKey&&(r.token=this.configuration.apiKey("token"));const o=await this.request({path:"/search",method:"GET",headers:a,query:r},t);return new f(o,s=>s.map(A))}async search(i,t){return await(await this.searchRaw(i,t)).value()}}class ye extends y{async sitemapRaw(i){const t={},r={};this.configuration&&this.configuration.apiKey&&(t.token=this.configuration.apiKey("token"));const a=await this.request({path:"/sitemap",method:"GET",headers:r,query:t},i);return new f(a,o=>o.map(A))}async sitemap(i){return await(await this.sitemapRaw(i)).value()}}class he extends y{async versionRaw(i){const t={},r={};this.configuration&&this.configuration.apiKey&&(t.token=this.configuration.apiKey("token"));const a=await this.request({path:"/version",method:"GET",headers:r,query:t},i);return new f(a,o=>ue(o))}async version(i){return await(await this.versionRaw(i)).value()}}const ge=/[\p{Lu}]/u,ve=/[\p{Ll}]/u,k=/^[\p{Lu}](?![\p{Lu}])/gu,S=/([\p{Alpha}\p{N}_]|$)/u,w=/[_.\- ]+/,me=new RegExp("^"+w.source),T=new RegExp(w.source+S.source,"gu"),j=new RegExp("\\d+"+S.source,"gu"),we=(e,i,t,r)=>{let a=!1,o=!1,s=!1,u=!1;for(let c=0;c<e.length;c++){const d=e[c];u=c>2?e[c-3]==="-":!0,a&&ge.test(d)?(e=e.slice(0,c)+"-"+e.slice(c),a=!1,s=o,o=!0,c++):o&&s&&ve.test(d)&&(!u||r)?(e=e.slice(0,c-1)+"-"+e.slice(c-1),s=o,o=!1,a=!0):(a=i(d)===d&&t(d)!==d,s=o,o=t(d)===d&&i(d)!==d)}return e},_e=(e,i)=>(k.lastIndex=0,e.replace(k,t=>i(t))),qe=(e,i)=>(T.lastIndex=0,j.lastIndex=0,e.replace(T,(t,r)=>i(r)).replace(j,t=>i(t)));function be(e,i){if(!(typeof e=="string"||Array.isArray(e)))throw new TypeError("Expected the input to be `string | string[]`");if(i={pascalCase:!1,preserveConsecutiveUppercase:!1,...i},Array.isArray(e)?e=e.map(o=>o.trim()).filter(o=>o.length).join("-"):e=e.trim(),e.length===0)return"";const t=i.locale===!1?o=>o.toLowerCase():o=>o.toLocaleLowerCase(i.locale),r=i.locale===!1?o=>o.toUpperCase():o=>o.toLocaleUpperCase(i.locale);return e.length===1?w.test(e)?"":i.pascalCase?r(e):t(e):(e!==t(e)&&(e=we(e,t,r,i.preserveConsecutiveUppercase)),e=e.replace(me,""),e=i.preserveConsecutiveUppercase?_e(e,t):t(e),i.pascalCase&&(e=r(e.charAt(0))+e.slice(1)),qe(e,r))}function Re(e,i,t){const r="virtual:flyo-components",a="\0"+r;return{name:"vite-plugin-flyo-components",async resolveId(o){if(o===r)return a},async load(o){if(o===a){const s=[];for(const[c,d]of Object.entries(i)){const g=await this.resolve("/"+e+"/"+d+".astro");g&&s.push(`export { default as ${be(c)} } from "${g.id}"`)}let u=null;return t&&(u=await this.resolve("/"+e+"/"+t+".astro")),u?s.push(`export { default as fallback } from "${u.id}"`):s.push('export { default as fallback } from "@flyo/nitro-astro/FallbackComponent.astro"'),s.join(";")}}}}function p(){return globalThis.flyoNitroInstance||console.error("The Flyo Typescript Configuration has not been initialized correctly"),globalThis.flyoNitroInstance}function Ee(){return new de(p())}function Ce(){return new le(p())}function Ae(){return new fe(p())}function Ie(){return new pe(p())}function ke(){return new ye(p())}function Se(){return new he(p())}function Te(e){const i={accessToken:!1,liveEdit:!1,fallbackComponent:null,...e};return{name:"@flyo/nitro-astro",hooks:{"astro:config:setup":({injectScript:t,updateConfig:r,injectRoute:a})=>{a({pattern:"sitemap.xml",entrypoint:"@flyo/nitro-astro/sitemap.js"}),r({image:{service:{entrypoint:"@flyo/nitro-astro/cdn.ts"}},vite:{plugins:[Re(e.componentsDir,e.components,e.fallbackComponent)]}}),t("page-ssr",`
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${i.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
          `),i.liveEdit&&t("page",`
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
            `)}}}}l.default=Te,l.useConfigApi=Ee,l.useConfiguration=p,l.useEntitiesApi=Ce,l.usePagesApi=Ae,l.useSearchApi=Ie,l.useSitemapApi=ke,l.useVersionApi=Se,Object.defineProperties(l,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
