import { defineMiddleware } from "astro:middleware";
import { useConfigApi } from "./index.ts";

let resolvedValue;

async function getConfigPromise(context) {
  console.log("request config request");
  if (resolvedValue) {
    // If the value is already resolved, return a resolved promise with the value
    return resolvedValue;
  }
  console.log("config request");
  // Fetch the config and store the resolved value
  const value = await useConfigApi().config({
    lang: context.currentLocale,
  });
  resolvedValue = value;
  return value;
}

export const onRequest = defineMiddleware((context, next) => {
  context.locals.config = getConfigPromise(context);
  return next();
});
