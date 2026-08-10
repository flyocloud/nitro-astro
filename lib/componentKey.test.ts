import { describe, it, expect } from "vitest";
import camelcase from "camelcase";
import { componentKey } from "./componentKey";

/**
 * Names Flyo can send as `block.component` or a user can write into the
 * `components` option: the spec's own example, the spellings the docs use, the
 * separator styles of `identifier`, and the shapes that used to make `camelcase`
 * interesting (digits, acronyms, non-ASCII, nothing at all).
 */
const NAMES = [
  "HeroImage",
  "heroImage",
  "hero_image",
  "hero-image",
  "Hero Image",
  "heroimage",
  "HEROIMAGE",
  "Text",
  "text",
  "CardsGrid",
  "SlotContainer",
  "BlockNotFound",
  "CTABlock",
  "ctaBlock",
  "Grid2Col",
  "grid2col",
  "grid2Col",
  "Hero2",
  "ÜberUns",
  "überUns",
  "über_uns",
  "Grüezi-Block",
  "2cols",
  "a",
  "",
  "---",
];

describe("componentKey", () => {
  it("ignores casing and separator style", () => {
    const spellings = [
      "HeroImage",
      "heroImage",
      "hero_image",
      "hero-image",
      "Hero Image",
      "heroimage",
      "HEROIMAGE",
    ];
    expect(new Set(spellings.map(componentKey))).toEqual(
      new Set(["heroimage"])
    );
  });

  it("keeps digits and non-ASCII letters, which distinguish real components", () => {
    expect(componentKey("Grid2Col")).toBe("grid2col");
    expect(componentKey("ÜberUns")).toBe("überuns");
    expect(componentKey("ÜberUns")).not.toBe(componentKey("Uns"));
  });

  it("is idempotent, so a key can be fed back in", () => {
    for (const name of NAMES) {
      expect(componentKey(componentKey(name))).toBe(componentKey(name));
    }
  });

  it("survives a name that is nothing but separators", () => {
    expect(componentKey("")).toBe("");
    expect(componentKey("---")).toBe("");
  });

  // The two tests below are the upgrade contract. Registration used to be keyed by
  // `camelcase(name)` on both sides of the lookup, so any two names camelcase
  // mapped onto one export have to keep mapping onto one key here — otherwise a
  // site whose `components` key is spelled differently from Flyo's component name
  // silently starts rendering the fallback. Coarser is safe, finer is not.
  it("agrees with a name camelcase already normalized", () => {
    for (const name of NAMES) {
      expect(componentKey(camelcase(name))).toBe(componentKey(name));
    }
  });

  it("maps every pair camelcase unified onto a single key", () => {
    // Two-word names in every casing and separator style a project might have
    // written, which is where camelcase and this function could disagree at all.
    const words = [
      "hero",
      "image",
      "cards",
      "grid",
      "cta",
      "block",
      "2",
      "col",
    ];
    const spellings = new Set(NAMES);
    for (const first of words) {
      for (const second of words) {
        if (first === second) continue;
        const capital = (word: string) => word[0].toUpperCase() + word.slice(1);
        for (const separator of ["", "-", "_", " ", "."]) {
          spellings.add(first + separator + second);
          spellings.add(capital(first) + separator + capital(second));
          spellings.add(first.toUpperCase() + separator + second.toUpperCase());
          spellings.add(first + separator + capital(second));
        }
      }
    }

    // Group by the key registration used to use: every group has to come out of
    // componentKey as a single key, or two spellings that used to reach the same
    // component no longer do.
    const groups = new Map<string, Set<string>>();
    for (const name of spellings) {
      const previous = camelcase(name);
      const keys = groups.get(previous) ?? new Set<string>();
      groups.set(previous, keys.add(componentKey(name)));
    }

    const split = [...groups].filter(([, keys]) => keys.size > 1);
    expect(split).toEqual([]);
  });
});
