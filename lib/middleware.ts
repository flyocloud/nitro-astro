import { defineMiddleware } from "astro/middleware";
import { useConfigApi, useFlyoIntegration } from "@flyo/nitro-astro";

let resolvedValue;

async function getConfigPromise(context) {
  if (resolvedValue) {
    // If the value is already resolved, return a resolved promise with the value
    return resolvedValue;
  }

  // Fetch the config and store the resolved value
  const value = await useConfigApi().config({
    lang: context.currentLocale,
  });
  resolvedValue = value;
  return value;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // ensure that on each request, the resolved config is cleared, otherwise the
  // node server needs to be restarted to get the new config
  // this could be an option, but its hard for developers to understand, but good for performance
  resolvedValue = null

  context.locals.config = getConfigPromise(context);

  const liveEditEnabled = useFlyoIntegration().options.liveEdit;

  if (!liveEditEnabled) {
    const response = await next();

    response.headers.set(
      "Vercel-CDN-Cache-Control",
      `max-age=${useFlyoIntegration().options.serverCacheHeaderTtl}`
    );
    response.headers.set(
      "CDN-Cache-Control",
      `max-age=${useFlyoIntegration().options.serverCacheHeaderTtl}`
    );
    response.headers.set(
      "Cache-Control",
      `max-age=${useFlyoIntegration().options.clientCacheHeaderTtl}`
    );

    return response;
  }

  return next();
});
