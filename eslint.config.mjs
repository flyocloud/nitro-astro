import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from 'eslint-plugin-astro';


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    ignores: ["lib/dist/", "playground/", "dist/", "node_modules/"],
  },
  { languageOptions: {
    globals: globals.node,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["*.astro"],
    languageOptions: {
      eslintPluginAstro,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
];
