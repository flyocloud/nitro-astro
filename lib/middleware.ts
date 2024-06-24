import { defineMiddleware } from "astro:middleware";
import { useConfigApi } from "./index.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.config = await useConfigApi().config({
    lang: context.currentLocale,
  });

  return next();
});
