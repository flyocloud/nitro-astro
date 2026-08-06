import { describe, it, expect } from "vitest";
import service, { flyoImageUrl, FLYO_CDN_MAX_DIMENSION } from "./cdn";

const IMAGE = "image_7a158241.jpg";
const ABSOLUTE = `https://storage.flyo.cloud/${IMAGE}`;

describe("flyoImageUrl", () => {
  it("prefixes the CDN host for a bare file name", () => {
    expect(flyoImageUrl(IMAGE, { width: 300, height: 300 })).toBe(
      `${ABSOLUTE}?w=300&h=300`
    );
  });

  it("keeps a url that already points at the CDN", () => {
    expect(flyoImageUrl(ABSOLUTE, { width: 300, height: 300 })).toBe(
      `${ABSOLUTE}?w=300&h=300`
    );
  });

  it("emits only w when the height is dynamic", () => {
    expect(flyoImageUrl(IMAGE, { width: 300 })).toBe(`${ABSOLUTE}?w=300`);
  });

  it("emits only h when the width is dynamic", () => {
    expect(flyoImageUrl(IMAGE, { height: 300 })).toBe(`${ABSOLUTE}?h=300`);
  });

  it("returns the untouched original when no dimension is given", () => {
    expect(flyoImageUrl(IMAGE)).toBe(ABSOLUTE);
  });

  it("never emits the legacy thumb path", () => {
    expect(flyoImageUrl(IMAGE, { width: 300, height: 300 })).not.toContain(
      "/thumb/"
    );
  });

  it("appends the format next to the dimensions", () => {
    expect(
      flyoImageUrl(IMAGE, { width: 300, height: 300, format: "webp" })
    ).toBe(`${ABSOLUTE}?w=300&h=300&format=webp`);
  });

  it("drops the format when no dimension is set, since the CDN ignores it", () => {
    expect(flyoImageUrl(IMAGE, { format: "webp" })).toBe(ABSOLUTE);
  });

  it("adds the download flag", () => {
    expect(flyoImageUrl(IMAGE, { width: 300, download: true })).toBe(
      `${ABSOLUTE}?w=300&download=1`
    );
  });

  it.each([0, -10, "", "null", null, undefined, Number.NaN])(
    "treats %p as a dynamic side instead of sending an invalid value",
    (value) => {
      expect(flyoImageUrl(IMAGE, { width: value as never, height: 300 })).toBe(
        `${ABSOLUTE}?h=300`
      );
    }
  );

  it("caps dimensions at the CDN maximum", () => {
    expect(flyoImageUrl(IMAGE, { width: 5000, height: 4000 })).toBe(
      `${ABSOLUTE}?w=${FLYO_CDN_MAX_DIMENSION}&h=${FLYO_CDN_MAX_DIMENSION}`
    );
  });

  it("accepts numeric strings and rounds fractional values", () => {
    expect(flyoImageUrl(IMAGE, { width: "300", height: 200.6 })).toBe(
      `${ABSOLUTE}?w=300&h=201`
    );
  });

  it("replaces transformation parameters that are already on the url", () => {
    expect(
      flyoImageUrl(`${ABSOLUTE}?w=100&h=100&format=png&v=2`, {
        width: 300,
        height: 300,
        format: "webp",
      })
    ).toBe(`${ABSOLUTE}?v=2&w=300&h=300&format=webp`);
  });
});

describe("image service getURL", () => {
  it("defaults to webp", () => {
    expect(
      service.getURL(
        { src: IMAGE, width: 250, height: 250 } as never,
        {} as never
      )
    ).toBe(`${ABSOLUTE}?w=250&h=250&format=webp`);
  });

  it("honours an explicit format", () => {
    expect(
      service.getURL(
        { src: ABSOLUTE, width: 800, height: 600, format: "jpg" } as never,
        {} as never
      )
    ).toBe(`${ABSOLUTE}?w=800&h=600&format=jpg`);
  });

  it("serves the original when neither width nor height is given", () => {
    expect(service.getURL({ src: IMAGE } as never, {} as never)).toBe(ABSOLUTE);
  });
});
