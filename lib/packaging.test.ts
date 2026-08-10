import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { isBuiltin } from "node:module";
import path from "node:path";

const libDir = fileURLToPath(new URL(".", import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(libDir, "package.json"), "utf8"));

/**
 * Every path package.json promises to consumers: `main`, `module`, `types` and
 * every string leaf of `exports` and `typesVersions` (the condition objects nest
 * arbitrarily deep).
 */
function declaredTargets(): string[] {
  const out = new Set<string>();
  const add = (value: unknown) => {
    if (typeof value === "string") out.add(value.replace(/^\.\//, ""));
    else if (value && typeof value === "object") Object.values(value).forEach(add);
  };
  add(pkg.main);
  add(pkg.module);
  add(pkg.types);
  add(pkg.exports);
  add(pkg.typesVersions);
  return [...out];
}

/** The `.astro` subpaths in `exports`, without the leading `./`. */
function astroSubpaths(): string[] {
  return Object.keys(pkg.exports)
    .filter((key) => key.endsWith(".astro"))
    .map((key) => key.replace(/^\.\//, ""));
}

/** Shipped files the consumer's own toolchain resolves, i.e. everything outside dist/. */
const RAW_SOURCE = /^(?!dist\/).*\.(astro|[cm]?[jt]sx?)$/;

/** `from "x"`, `import "x"`, `import("x")` — enough for the source we ship. */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g;

/** `@scope/name/deep/path` -> `@scope/name`, `name/deep/path` -> `name`. */
function packageName(specifier: string): string {
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

/** Every bare specifier a shipped file imports, deduplicated. */
function bareSpecifiers(file: string): string[] {
  const source = readFileSync(path.join(libDir, file), "utf8");
  const specifiers = [...source.matchAll(SPECIFIER)].map((match) => match[1]);
  return [
    ...new Set(
      specifiers
        .filter((specifier) => !/^[./]/.test(specifier))
        .filter((specifier) => !specifier.startsWith("virtual:")) // our own vite plugin
        .filter((specifier) => !isBuiltin(specifier))
    ),
  ];
}

/** The packages a shipped file imports by bare specifier, deduplicated. */
function importedPackages(file: string): string[] {
  return [...new Set(bareSpecifiers(file).map(packageName))];
}

/**
 * Bare specifiers shipped source may import without `dependencies` naming them.
 * `astro` is the host project by definition — an integration is loaded from the
 * consumer's `astro.config.mjs`, so their Astro is always present and is the copy
 * that has to win. The package's own name resolves to the installed package.
 */
const HOST_PROVIDED = ["astro", pkg.name];

/** Files that must never reach npm, even when their directory is listed in `files`. */
const JUNK = [
  { label: "test files", pattern: /(^|\/)[^/]*\.(test|spec)\.[cm]?[jt]sx?$/ },
  { label: "TypeScript configs", pattern: /(^|\/)tsconfig[^/]*\.json$/ },
  {
    label: "build tooling configs",
    pattern: /(^|\/)(vite|vitest|eslint)[^/]*\.config\.[cm]?[jt]s$/,
  },
  // components/X.astro.d.ts is deliberate — see the typesVersions/`tsc` tests below.
  {
    label: "declaration files outside dist/",
    pattern: /^(?!dist\/)(?!components\/[^/]+\.astro\.d\.ts$).*\.d\.ts$/,
  },
];

let shipped: string[];

beforeAll(() => {
  // The tarball is half build output, and .github/workflows/tests.yml runs
  // `npm test` without a build step, so produce dist/ here rather than
  // asserting against whatever happens to be lying around.
  execFileSync("npm", ["run", "build"], { cwd: libDir, stdio: "ignore" });

  const raw = execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: libDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  shipped = JSON.parse(raw)[0].files.map((file: { path: string }) => file.path);
}, 180_000);

describe("published package", () => {
  it("ships every path referenced by main, module, types and exports", () => {
    const missing = declaredTargets().filter((target) => !shipped.includes(target));
    expect(missing).toEqual([]);
  });

  for (const { label, pattern } of JUNK) {
    it(`ships no ${label}`, () => {
      expect(shipped.filter((file) => pattern.test(file))).toEqual([]);
    });
  }

  it("ships no declarations that nothing references", () => {
    const declared = declaredTargets().filter((target) => target.startsWith("dist/types/"));
    const actual = shipped.filter((file) => file.startsWith("dist/types/"));
    expect(actual.sort()).toEqual(declared.sort());
  });
});

describe("runtime resolution for consumers", () => {
  // Only `index.ts` is bundled. Every component, `cdn.ts`, `middleware.ts`,
  // `sitemap.ts` and `toolbar.ts` ships as raw source and is resolved by the
  // consumer's Astro/Vite out of *their* node_modules, so a bare import missing
  // from `dependencies` only resolves where something else in their tree happens
  // to hoist it: `camelcase` in FlyoNitroBlock.astro rode on astro -> boxen ->
  // camelcase until an install that did not hoist it failed a user's build. The
  // bundle hides this — rollup inlines the same import, so dist/ always works.
  it("declares every package the shipped source imports", () => {
    const declared = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      ...HOST_PROVIDED,
    ];
    const undeclared = shipped
      .filter((file) => RAW_SOURCE.test(file))
      .flatMap((file) =>
        importedPackages(file)
          .filter((name) => !declared.includes(name))
          .map((name) => `${file}: ${name}`)
      );
    expect(undeclared).toEqual([]);
  });

  // Shipped source reaching for its own package goes through `exports` like anyone
  // else's import would, and there is no wildcard in it. Nothing else catches a
  // subpath that is missing there: the vitest alias in vitest.config.ts resolves
  // these by file path, so a renamed file or a forgotten `exports` entry passes
  // every unit test and breaks the first consumer build instead.
  it("exports every subpath of itself that shipped source imports", () => {
    const unreachable = shipped
      .filter((file) => RAW_SOURCE.test(file))
      .flatMap((file) =>
        bareSpecifiers(file)
          .filter((specifier) => packageName(specifier) === pkg.name)
          .map((specifier) => specifier.replace(pkg.name, "."))
          .filter((subpath) => !pkg.exports[subpath])
          .map((subpath) => `${file}: ${subpath}`)
      );
    expect([...new Set(unreachable)]).toEqual([]);
  });
});

describe("type resolution for consumers", () => {
  // `exports` is invisible to TypeScript's legacy ("node10"/classic) resolution,
  // which every consumer gets whose tsconfig does not extend astro/tsconfigs/*
  // — or who has no tsconfig at all. Without a typesVersions fallback such a
  // project cannot resolve `@flyo/nitro-astro/BlockSlot.astro` and reports
  // TS2307, because no file of that name exists at the package root.
  it("mirrors every .astro subpath in typesVersions", () => {
    const fallbacks = pkg.typesVersions?.["*"] ?? {};
    const missing = astroSubpaths().filter((subpath) => !fallbacks[subpath]);
    expect(missing).toEqual([]);
  });

  it("points every typesVersions fallback at the same shim as exports", () => {
    const fallbacks = pkg.typesVersions["*"];
    const mismatched = astroSubpaths().filter(
      (subpath) => fallbacks[subpath]?.[0] !== pkg.exports[`./${subpath}`].types
    );
    expect(mismatched).toEqual([]);
  });

  it("declares every .astro a shim imports, so plain tsc can follow it", () => {
    // Astro tooling resolves the real `.astro` (keeping its `Props`) and ignores
    // these; `tsc` has no Astro plugin, and would otherwise report TS2307 from
    // inside node_modules. `skipLibCheck` does not help — the shims are `.ts`.
    const missing = astroSubpaths()
      .map((subpath) => `${pkg.exports[`./${subpath}`].types.replace(/\.ts$/, "")}.astro.d.ts`)
      .map((declaration) => declaration.replace(/^\.\//, ""))
      .filter((declaration) => !shipped.includes(declaration));
    expect([...new Set(missing)]).toEqual([]);
  });
});
