import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
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
