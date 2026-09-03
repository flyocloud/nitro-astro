import { defineMiddleware } from "astro/middleware";
import {
  applyCacheHeaders,
  useConfigApi,
  useFlyoIntegration,
} from "@flyo/nitro-astro";

let resolvedValue;

async function getConfigPromise(context) {
  if (resolvedValue) {
    // If the value is already resolved, return a resolved promise with the value
    return resolvedValue;
  }

  // check if useFlyoIntegration is available and configured correctly
  if (!useFlyoIntegration()?.config || false) {
    console.error("useFlyoIntegration is not available or not configured correctly.");
    return null;
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

  let options = null;
  try {
    // Safely retrieve options from useFlyoIntegration
    options = useFlyoIntegration()?.options || null;
  } catch (error) {
    console.error("Error in useFlyoIntegration:", error);
  }

  const response = await next();

  // The TTLs from the integration options, or no-store when the page marked the
  // request uncacheable — which a draft link does on its own. Live edit gets no
  // header at all. See cache.ts.
  applyCacheHeaders(response, context, options);

  return response;
});
