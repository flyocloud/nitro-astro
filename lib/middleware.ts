import { defineMiddleware } from "astro:middleware";
import { useConfigApi, useFlyoIntegration } from "./index.ts";

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
