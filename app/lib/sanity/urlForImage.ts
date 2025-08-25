import imageUrlBuilder from '@sanity/image-url';
import {getImageDimensions} from '@sanity/asset-utils';

const imageBuilder = imageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID || 'rimuhevv',
  dataset: process.env.SANITY_DATASET || 'production',
});

export const urlForImage = (source: any) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  const imageRef = source?.asset?._ref;
  const crop = source.crop;

  // get the image's og dimensions
  const {width, height} = getImageDimensions(imageRef);

  if (crop) {
    // compute the cropped image's area
    const croppedWidth = Math.floor(width * (1 - (crop.right + crop.left)));

    const croppedHeight = Math.floor(height * (1 - (crop.top + crop.bottom)));

    // compute the cropped image's position
    const left = Math.floor(width * crop.left);
    const top = Math.floor(height * crop.top);

    // gather into a url
    return imageBuilder
      ?.image(source)
      .rect(left, top, croppedWidth, croppedHeight)
      .auto('format');
  }

  return imageBuilder?.image(source).auto('format');
};
