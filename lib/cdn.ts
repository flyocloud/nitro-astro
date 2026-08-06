/**
 * Create an astro ExternalImageService for flyo where the base url with transormations looks like https://storage.flyo.cloud/image_7a158241.jpg?w=250&h=250&format=webp
 *
 * The legacy `/thumb/{width}x{height}` path is deprecated on the CDN and is no
 * longer produced here.
 */
import type { ExternalImageService, ImageTransform } from "astro";

/** Base url of the flyo storage CDN. */
export const FLYO_CDN_URL = "https://storage.flyo.cloud";

/**
 * A dimension the CDN accepts: a positive integer.
 *
 * Everything else (`0`, `""`, `"null"`, negative or non numeric values) becomes
 * `null`. A `null` side is expressed by leaving the parameter out entirely,
 * which is how the CDN reads "this side is dynamic" — sending the value would
 * answer with HTTP 400 instead.
 *
 * The upper bound stays with the CDN: it caps oversized values itself, and that
 * limit can change without a release here.
 */
function normalizeDimension(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const rounded = Math.round(parsed);

  return rounded < 1 ? null : rounded;
}

export interface FlyoImageOptions {
  /** Width in pixels. Omit it to let the CDN derive it from the aspect ratio. */
  width?: number | string | null;
  /** Height in pixels. Omit it to let the CDN derive it from the aspect ratio. */
  height?: number | string | null;
  /** `webp`, `jpg`, `jpeg`, `png` or `gif`. Ignored unless a dimension is set. */
  format?: string | null;
  /** Deliver the file as a download instead of rendering it inline. */
  download?: boolean;
}

/**
 * Build a flyo storage url with the query parameter transformations:
 *
 * - `?w=300&h=300` fixed size
 * - `?w=300` height follows the aspect ratio
 * - `?h=300` width follows the aspect ratio
 * - no parameters at all: the untouched original file
 */
export function flyoImageUrl(
  src: string,
  options: FlyoImageOptions = {}
): string {
  // check if the src contains already https://storage.flyo.cloud
  // if not we add it to the url
  const url = src.includes(FLYO_CDN_URL) ? src : `${FLYO_CDN_URL}/${src}`;

  const queryStart = url.indexOf("?");
  const pathname = queryStart === -1 ? url : url.slice(0, queryStart);
  const params = new URLSearchParams(
    queryStart === -1 ? "" : url.slice(queryStart + 1)
  );

  const width = normalizeDimension(options.width);
  const height = normalizeDimension(options.height);

  params.delete("w");
  params.delete("h");
  if (width !== null) {
    params.set("w", String(width));
  }
  if (height !== null) {
    params.set("h", String(height));
  }

  // a format without a dimension is ignored by the CDN, which then serves the
  // unmodified original file, so it is not worth sending.
  params.delete("format");
  if (options.format && (width !== null || height !== null)) {
    params.set("format", options.format);
  }

  if (options.download) {
    params.set("download", "1");
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

const service: ExternalImageService = {
  getURL(options: ImageTransform) {
    return flyoImageUrl(
      typeof options.src === "string" ? options.src : `${options.src}`,
      {
        width: options.width,
        height: options.height,
        format: options.format ?? "webp",
      }
    );
  },

  getHTMLAttributes(options) {
    const { ...attributes } = options;
    return {
      ...attributes,
      width: options.width ?? null, // width and height are required to prevent CLS and enable lazy loading for chrome.
      height: options.height ?? null, // width and height are required to prevent CLS and enable lazy loading for chrome.
      loading: options.loading ?? "lazy",
      decoding: options.decoding ?? "async",
    };
  },
};

export default service;
