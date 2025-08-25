import {SanityImageSource} from '@sanity/asset-utils';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID || 'rimuhevv',
  dataset: process.env.SANITY_DATASET || 'production',
});

export const urlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source);
};
