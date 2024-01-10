/**
 * Create an astro ExternalImageService for flyo where the base url with transormations looks like https://storage.flyo.cloud/image_7a158241.jpg/thumb/250x250?format=webp
 */
import type { ExternalImageService, ImageTransform } from "astro";

const service: ExternalImageService = {
  getURL(options: ImageTransform) {
    return `https://https://storage.flyo.cloud/${options.src}/thumb/${options.width}x${options.height}?format=${options.format}`;
  },
};

export default service;