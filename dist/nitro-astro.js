(function(d,y){typeof exports=="object"&&typeof module<"u"?y(exports):typeof define=="function"&&define.amd?define(["exports"],y):(d=typeof globalThis<"u"?globalThis:d||self,y(d.flyoNitroIntegration={}))})(this,function(d){"use strict";const y="https://api.flyo.cloud/nitro/v1".replace(/\/+$/,"");class N{constructor(n={}){this.configuration=n}set config(n){this.configuration=n}get basePath(){return this.configuration.basePath!=null?this.configuration.basePath:y}get fetchApi(){return this.configuration.fetchApi}get middleware(){return this.configuration.middleware||[]}get queryParamsStringify(){return this.configuration.queryParamsStringify||E}get username(){return this.configuration.username}get password(){return this.configuration.password}get apiKey(){const n=this.configuration.apiKey;if(n)return typeof n=="function"?n:()=>n}get accessToken(){const n=this.configuration.accessToken;if(n)return typeof n=="function"?n:async()=>n}get headers(){return this.configuration.headers}get credentials(){return this.configuration.credentials}}const x=new N,b=class L{constructor(n=x){this.configuration=n,this.fetchApi=async(t,i)=>{let r={url:t,init:i};for(const a of this.middleware)a.pre&&(r=await a.pre({fetch:this.fetchApi,...r})||r);let o;try{o=await(this.configuration.fetchApi||fetch)(r.url,r.init)}catch(a){for(const l of this.middleware)l.onError&&(o=await l.onError({fetch:this.fetchApi,url:r.url,init:r.init,error:a,response:o?o.clone():void 0})||o);if(o===void 0)throw a instanceof Error?new $(a,"The request failed and the interceptors did not return an alternative response"):a}for(const a of this.middleware)a.post&&(o=await a.post({fetch:this.fetchApi,url:r.url,init:r.init,response:o.clone()})||o);return o},this.middleware=n.middleware}withMiddleware(...n){const t=this.clone();return t.middleware=t.middleware.concat(...n),t}withPreMiddleware(...n){const t=n.map(i=>({pre:i}));return this.withMiddleware(...t)}withPostMiddleware(...n){const t=n.map(i=>({post:i}));return this.withMiddleware(...t)}isJsonMime(n){return n?L.jsonRegex.test(n):!1}async request(n,t){const{url:i,init:r}=await this.createFetchParams(n,t),o=await this.fetchApi(i,r);if(o&&o.status>=200&&o.status<300)return o;throw new B(o,"Response returned an error code")}async createFetchParams(n,t){let i=this.configuration.basePath+n.path;n.query!==void 0&&Object.keys(n.query).length!==0&&(i+="?"+this.configuration.queryParamsStringify(n.query));const r=Object.assign({},this.configuration.headers,n.headers);Object.keys(r).forEach(h=>r[h]===void 0?delete r[h]:{});const o=typeof t=="function"?t:async()=>t,a={method:n.method,headers:r,body:n.body,credentials:this.configuration.credentials},l={...a,...await o({init:a,context:n})};let s;O(l.body)||l.body instanceof URLSearchParams||K(l.body)?s=l.body:this.isJsonMime(r["Content-Type"])?s=JSON.stringify(l.body):s=l.body;const c={...l,body:s};return{url:i,init:c}}clone(){const n=this.constructor,t=new n(this.configuration);return t.middleware=this.middleware.slice(),t}};b.jsonRegex=new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$","i");let g=b;function K(e){return typeof Blob<"u"&&e instanceof Blob}function O(e){return typeof FormData<"u"&&e instanceof FormData}class B extends Error{constructor(n,t){super(t),this.response=n,this.name="ResponseError"}}class $ extends Error{constructor(n,t){super(t),this.cause=n,this.name="FetchError"}}class v extends Error{constructor(n,t){super(t),this.field=n,this.name="RequiredError"}}function E(e,n=""){return Object.keys(e).map(t=>q(t,e[t],n)).filter(t=>t.length>0).join("&")}function q(e,n,t=""){const i=t+(t.length?`[${e}]`:e);if(n instanceof Array){const r=n.map(o=>encodeURIComponent(String(o))).join(`&${encodeURIComponent(i)}=`);return`${encodeURIComponent(i)}=${r}`}if(n instanceof Set){const r=Array.from(n);return q(e,r,t)}return n instanceof Date?`${encodeURIComponent(i)}=${encodeURIComponent(n.toISOString())}`:n instanceof Object?E(n,i):`${encodeURIComponent(i)}=${encodeURIComponent(String(n))}`}function m(e,n){return Object.keys(e).reduce((t,i)=>({...t,[i]:n(e[i])}),{})}class f{constructor(n,t=i=>i){this.raw=n,this.transformer=t}async value(){return this.transformer(await this.raw.json())}}function F(e){return D(e)}function D(e,n){return e==null?e:{identifier:e.identifier==null?void 0:e.identifier,content:e.content==null?void 0:e.content.map(R)}}function R(e){return M(e)}function M(e,n){return e==null?e:{items:e.items==null?void 0:e.items,content:e.content==null?void 0:e.content,config:e.config==null?void 0:e.config,identifier:e.identifier==null?void 0:e.identifier,uid:e.uid==null?void 0:e.uid,component:e.component==null?void 0:e.component,slots:e.slots==null?void 0:m(e.slots,F)}}function C(e){return G(e)}function G(e,n){return e==null?e:{type:e.type==null?void 0:e.type,target:e.target==null?void 0:e.target,label:e.label==null?void 0:e.label,href:e.href==null?void 0:e.href,slug:e.slug==null?void 0:e.slug,properties:e.properties==null?void 0:e.properties,children:e.children==null?void 0:e.children.map(C)}}function J(e){return V(e)}function V(e,n){return e==null?e:{items:e.items==null?void 0:e.items.map(C),uid:e.uid==null?void 0:e.uid,identifier:e.identifier==null?void 0:e.identifier,label:e.label==null?void 0:e.label}}function W(e){return Q(e)}function Q(e,n){return e==null?e:{domain:e.domain==null?void 0:e.domain,slug:e.slug==null?void 0:e.slug,version:e.version==null?void 0:e.version,updated_at:e.updated_at==null?void 0:e.updated_at,language:e.language==null?void 0:e.language,primary_language:e.primary_language==null?void 0:e.primary_language}}function z(e){return H(e)}function H(e,n){return e==null?e:{nitro:e.nitro==null?void 0:W(e.nitro),pages:e.pages==null?void 0:e.pages,containers:e.containers==null?void 0:m(e.containers,J),globals:e.globals==null?void 0:e.globals}}function Y(e){return Z(e)}function Z(e,n){return e==null?e:{api:e.api==null?void 0:e.api,image:e.image==null?void 0:e.image}}function X(e){return ee(e)}function ee(e,n){return e==null?e:{_version:e._version==null?void 0:e._version,entity_metric:e.entity_metric==null?void 0:Y(e.entity_metric),entity_unique_id:e.entity_unique_id==null?void 0:e.entity_unique_id,entity_id:e.entity_id==null?void 0:e.entity_id,entity_image:e.entity_image==null?void 0:e.entity_image,entity_slug:e.entity_slug==null?void 0:e.entity_slug,entity_teaser:e.entity_teaser==null?void 0:e.entity_teaser,entity_time_end:e.entity_time_end==null?void 0:e.entity_time_end,entity_time_start:e.entity_time_start==null?void 0:e.entity_time_start,entity_title:e.entity_title==null?void 0:e.entity_title,entity_type:e.entity_type==null?void 0:e.entity_type,entity_type_id:e.entity_type_id==null?void 0:e.entity_type_id,updated_at:e.updated_at==null?void 0:e.updated_at,routes:e.routes==null?void 0:e.routes}}function A(e){return ne(e)}function ne(e,n){return e==null?e:{entity:e.entity==null?void 0:X(e.entity),model:e.model==null?void 0:e.model,language:e.language==null?void 0:e.language,jsonld:e.jsonld==null?void 0:e.jsonld}}function I(e){return te(e)}function te(e,n){return e==null?e:{entity_unique_id:e.entity_unique_id==null?void 0:e.entity_unique_id,entity_title:e.entity_title==null?void 0:e.entity_title,entity_teaser:e.entity_teaser==null?void 0:e.entity_teaser,entity_slug:e.entity_slug==null?void 0:e.entity_slug,entity_time_start:e.entity_time_start==null?void 0:e.entity_time_start,entity_type:e.entity_type==null?void 0:e.entity_type,entity_type_id:e.entity_type_id==null?void 0:e.entity_type_id,entity_image:e.entity_image==null?void 0:e.entity_image,routes:e.routes==null?void 0:e.routes}}function ie(e){return oe(e)}function oe(e,n){return e==null?e:{description:e.description==null?void 0:e.description,image:e.image==null?void 0:e.image,title:e.title==null?void 0:e.title}}function re(e){return ae(e)}function ae(e,n){return e==null?e:{slug:e.slug==null?void 0:e.slug,title:e.title==null?void 0:e.title}}function le(e){return se(e)}function se(e,n){return e==null?e:{value:e.value==null?void 0:e.value,navigation:e.navigation==null?void 0:e.navigation,propagate:e.propagate==null?void 0:e.propagate}}function k(e){return ue(e)}function ue(e,n){return e==null?e:{id:e.id==null?void 0:e.id,title:e.title==null?void 0:e.title,href:e.href==null?void 0:e.href,slug:e.slug==null?void 0:e.slug,json:e.json==null?void 0:e.json.map(R),depth:e.depth==null?void 0:e.depth,is_home:e.is_home==null?void 0:e.is_home,created_at:e.created_at==null?void 0:e.created_at,updated_at:e.updated_at==null?void 0:e.updated_at,is_visible:e.is_visible==null?void 0:e.is_visible,meta_json:e.meta_json==null?void 0:ie(e.meta_json),properties:e.properties==null?void 0:m(e.properties,le),uid:e.uid==null?void 0:e.uid,type:e.type==null?void 0:e.type,target:e.target==null?void 0:e.target,container:e.container==null?void 0:e.container,breadcrumb:e.breadcrumb==null?void 0:e.breadcrumb.map(re)}}function ce(e){return de(e)}function de(e,n){return e==null?e:{version:e.version==null?void 0:e.version,updated_at:e.updated_at==null?void 0:e.updated_at}}class fe extends g{async configRaw(n,t){const i={};n.lang!=null&&(i.lang=n.lang);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/config",method:"GET",headers:r,query:i},t);return new f(o,a=>z(a))}async config(n={},t){return await(await this.configRaw(n,t)).value()}}class pe extends g{async entityBySlugRaw(n,t){if(n.slug==null)throw new v("slug",'Required parameter "slug" was null or undefined when calling entityBySlug().');const i={};n.lang!=null&&(i.lang=n.lang),n.typeId!=null&&(i.typeId=n.typeId);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/entities/slug/{slug}".replace("{slug}",encodeURIComponent(String(n.slug))),method:"GET",headers:r,query:i},t);return new f(o,a=>A(a))}async entityBySlug(n,t){return await(await this.entityBySlugRaw(n,t)).value()}async entityByUniqueidRaw(n,t){if(n.uniqueid==null)throw new v("uniqueid",'Required parameter "uniqueid" was null or undefined when calling entityByUniqueid().');const i={};n.lang!=null&&(i.lang=n.lang);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/entities/uniqueid/{uniqueid}".replace("{uniqueid}",encodeURIComponent(String(n.uniqueid))),method:"GET",headers:r,query:i},t);return new f(o,a=>A(a))}async entityByUniqueid(n,t){return await(await this.entityByUniqueidRaw(n,t)).value()}}class ge extends g{async homeRaw(n,t){const i={};n.lang!=null&&(i.lang=n.lang);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/pages/home",method:"GET",headers:r,query:i},t);return new f(o,a=>k(a))}async home(n={},t){return await(await this.homeRaw(n,t)).value()}async pageRaw(n,t){const i={};n.lang!=null&&(i.lang=n.lang),n.slug!=null&&(i.slug=n.slug);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/pages",method:"GET",headers:r,query:i},t);return new f(o,a=>k(a))}async page(n={},t){return await(await this.pageRaw(n,t)).value()}}class ye extends g{async searchRaw(n,t){if(n.query==null)throw new v("query",'Required parameter "query" was null or undefined when calling search().');const i={};n.lang!=null&&(i.lang=n.lang),n.query!=null&&(i.query=n.query);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/search",method:"GET",headers:r,query:i},t);return new f(o,a=>a.map(I))}async search(n,t){return await(await this.searchRaw(n,t)).value()}}class he extends g{async sitemapRaw(n,t){const i={};n.lang!=null&&(i.lang=n.lang);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/sitemap",method:"GET",headers:r,query:i},t);return new f(o,a=>a.map(I))}async sitemap(n={},t){return await(await this.sitemapRaw(n,t)).value()}}class ve extends g{async versionRaw(n,t){const i={};n.lang!=null&&(i.lang=n.lang);const r={};this.configuration&&this.configuration.apiKey&&(i.token=await this.configuration.apiKey("token"));const o=await this.request({path:"/version",method:"GET",headers:r,query:i},t);return new f(o,a=>ce(a))}async version(n={},t){return await(await this.versionRaw(n,t)).value()}}const me=/[\p{Lu}]/u,we=/[\p{Ll}]/u,S=/^[\p{Lu}](?![\p{Lu}])/gu,T=/([\p{Alpha}\p{N}_]|$)/u,w=/[_.\- ]+/,_e=new RegExp("^"+w.source),U=new RegExp(w.source+T.source,"gu"),j=new RegExp("\\d+"+T.source,"gu"),be=(e,n,t,i)=>{let r=!1,o=!1,a=!1,l=!1;for(let s=0;s<e.length;s++){const c=e[s];l=s>2?e[s-3]==="-":!0,r&&me.test(c)?(e=e.slice(0,s)+"-"+e.slice(s),r=!1,a=o,o=!0,s++):o&&a&&we.test(c)&&(!l||i)?(e=e.slice(0,s-1)+"-"+e.slice(s-1),a=o,o=!1,r=!0):(r=n(c)===c&&t(c)!==c,a=o,o=t(c)===c&&n(c)!==c)}return e},Ee=(e,n)=>(S.lastIndex=0,e.replace(S,t=>n(t))),qe=(e,n)=>(U.lastIndex=0,j.lastIndex=0,e.replace(U,(t,i)=>n(i)).replace(j,t=>n(t)));function Re(e,n){if(!(typeof e=="string"||Array.isArray(e)))throw new TypeError("Expected the input to be `string | string[]`");if(n={pascalCase:!1,preserveConsecutiveUppercase:!1,...n},Array.isArray(e)?e=e.map(o=>o.trim()).filter(o=>o.length).join("-"):e=e.trim(),e.length===0)return"";const t=n.locale===!1?o=>o.toLowerCase():o=>o.toLocaleLowerCase(n.locale),i=n.locale===!1?o=>o.toUpperCase():o=>o.toLocaleUpperCase(n.locale);return e.length===1?w.test(e)?"":n.pascalCase?i(e):t(e):(e!==t(e)&&(e=be(e,t,i,n.preserveConsecutiveUppercase)),e=e.replace(_e,""),e=n.preserveConsecutiveUppercase?Ee(e,t):t(e),n.pascalCase&&(e=i(e.charAt(0))+e.slice(1)),qe(e,i))}function Ce(e,n,t){const i="virtual:flyo-components",r="\0"+i;return{name:"vite-plugin-flyo-components",async resolveId(o){if(o===i)return r},async load(o){if(o===r){const a=[];for(const[s,c]of Object.entries(n)){const h=await this.resolve("/"+e+"/"+c+".astro");h&&a.push(`export { default as ${Re(s)} } from "${h.id}"`)}let l=null;return t&&(l=await this.resolve("/"+e+"/"+t+".astro")),l?a.push(`export { default as fallback } from "${l.id}"`):a.push('export { default as fallback } from "@flyo/nitro-astro/FallbackComponent.astro"'),a.join(";")}}}}let Ae=Symbol("clean"),u=[],Ie=(e,n)=>{let t=[],i={get(){return i.lc||i.listen(()=>{})(),i.value},l:n||0,lc:0,listen(r,o){return i.lc=t.push(r,o||i.l)/2,()=>{let a=t.indexOf(r);~a&&(t.splice(a,2),--i.lc||i.off())}},notify(r,o){let a=!u.length;for(let l=0;l<t.length;l+=2)u.push(t[l],t[l+1],i.value,r,o);if(a){for(let l=0;l<u.length;l+=5){let s;for(let c=l+1;!s&&(c+=5)<u.length;)u[c]<u[l+1]&&(s=u.push(u[l],u[l+1],u[l+2],u[l+3],u[l+4]));s||u[l](u[l+2],u[l+3],u[l+4])}u.length=0}},off(){},set(r){let o=i.value;o!==r&&(i.value=r,i.notify(o))},subscribe(r,o){let a=i.listen(r,o);return r(i.value),a},value:e};return process.env.NODE_ENV!=="production"&&(i[Ae]=()=>{t=[],i.lc=0,i.off()}),i};function p(){return globalThis.flyoNitroInstance||console.error("The Flyo Typescript Configuration has not been initialized correctly"),globalThis.flyoNitroInstance}function P(){return new fe(p())}const _=Ie(!1);async function ke(e=null){return(!_.get()||globalThis.flyoNitroIntegrationOptions.liveEdit)&&_.set(await P().config({lang:e})),_.get()}function Se(){return new pe(p())}function Te(){return new ge(p())}function Ue(){return new ye(p())}function je(){return new he(p())}function Pe(){return new ve(p())}function Le(e){return{"data-flyo-block-uid":e.uid}}function Ne(e){const n={accessToken:!1,liveEdit:!1,fallbackComponent:null,componentsDir:"src/components/flyo",...e};return n.liveEdit==="true"?n.liveEdit=!0:n.liveEdit==="false"&&(n.liveEdit=!1),{name:"@flyo/nitro-astro",hooks:{"astro:config:setup":({injectScript:t,updateConfig:i,injectRoute:r})=>{r({pattern:"sitemap.xml",entrypoint:"@flyo/nitro-astro/sitemap.ts"}),i({image:{service:{entrypoint:"@flyo/nitro-astro/cdn.ts"}},vite:{plugins:[Ce(e.componentsDir,e.components,e.fallbackComponent)]}}),t("page-ssr",`
            import { Configuration } from '@flyo/nitro-typescript'

            var defaultConfig = new Configuration({
              apiKey: '${n.accessToken}'
            })

            globalThis.flyoNitroInstance = defaultConfig;
            globalThis.flyoNitroIntegrationOptions = {
              liveEdit: ${n.liveEdit}
            };
          `),n.liveEdit&&t("page",`
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
            `)}}}}d.default=Ne,d.editableBlock=Le,d.useConfig=ke,d.useConfigApi=P,d.useConfiguration=p,d.useEntitiesApi=Se,d.usePagesApi=Te,d.useSearchApi=Ue,d.useSitemapApi=je,d.useVersionApi=Pe,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
