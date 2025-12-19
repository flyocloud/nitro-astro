import { defineMiddleware } from "astro/middleware";
import { useConfigApi, useFlyoIntegration } from "@flyo/nitro-astro";

let resolvedValue;

function applyFrameAncestorHeaders(response) {
  const allowed = "frame-ancestors https://flyo.cloud";
  const existing = response.headers.get("Content-Security-Policy");

  if (existing) {
    const directives = existing
      .split(";")
      .map((dir) => dir.trim())
      .filter(Boolean)
      .filter((dir) => !dir.toLowerCase().startsWith("frame-ancestors"));

    directives.push(allowed);
    response.headers.set("Content-Security-Policy", directives.join("; "));
  } else {
    response.headers.set("Content-Security-Policy", allowed);
  }

  // Avoid conflicts: browsers prioritize CSP frame-ancestors over X-Frame-Options
  response.headers.delete("X-Frame-Options");
}

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

  const integration = useFlyoIntegration();

  let liveEditEnabled = false;
  try {
    // Safely retrieve options from useFlyoIntegration
    liveEditEnabled = integration?.options?.liveEdit || false;
  } catch (error) {
    console.error("Error in useFlyoIntegration:", error);
  }

  if (!liveEditEnabled) {
    const response = await next();

    if (integration?.options) {
      response.headers.set(
        "Vercel-CDN-Cache-Control",
        `max-age=${integration.options.serverCacheHeaderTtl}`
      );
      response.headers.set(
        "CDN-Cache-Control",
        `max-age=${integration.options.serverCacheHeaderTtl}`
      );
      response.headers.set(
        "Cache-Control",
        `max-age=${integration.options.clientCacheHeaderTtl}`
      );
    }

    applyFrameAncestorHeaders(response);

    return response;
  }

  const response = await next();
  applyFrameAncestorHeaders(response);
  return response;
});
