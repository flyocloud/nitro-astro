/**
 * Create an astro ExternalImageService for flyo where the base url with transormations looks like https://storage.flyo.cloud/image_7a158241.jpg/thumb/250x250?format=webp
 */
import type { ExternalImageService, ImageTransform } from "astro";

const service: ExternalImageService = {
  getURL(options: ImageTransform) {

    // check if the options.src contains already https://storage.flyo.cloud
    let url = options.src.includes('https://storage.flyo.cloud') ? options.src : `https://storage.flyo.cloud/${options.src}`

    // if either width or height are defined we add the /thumb/$widthx$height path to it.
    let width: string | number | null = options.width ? options.width : null;
    let height: string | number | null = options.height ? options.height : null;

    if (width || height) {
      if (width === null) {
        width = 'null';
      }
      if (height === null) {
        height = 'null';
      }
      url += `/thumb/${width}x${height}`;
    }
    
    const format = options.format ? options.format : 'webp';

    return `${url}?format=${format}`;
  },

  getHTMLAttributes(options) {
    const { ...attributes } = options;
    return {
      ...attributes,
      width: options.width ?? null, // width and height are required to prevent CLS and enable lazy loading for chrome.
      height: options.height ?? null, // width and height are required to prevent CLS and enable lazy loading for chrome.
      loading: options.loading ?? 'lazy',
      decoding: options.decoding ?? 'async',
    };
  }
};

export default service;