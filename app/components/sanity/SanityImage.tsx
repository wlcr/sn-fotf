import {urlForImage} from '~/lib/sanity/urlForImage';

type SanityImageProps = {
  image: any; // Replace 'any' with the actual image type if available
  width?: number;
  height?: number;
  aspectRatio?: number;
  alt?: string;
};

export default function SanityImage({
  image,
  width,
  height,
  aspectRatio,
  alt,
}: SanityImageProps) {
  if (!image) {
    return null;
  }

  const ar = aspectRatio || (width && height ? width / height : undefined);
  // assume a maxWidth and maxHeight of 2000px;
  // calculate a newWidth and newHeight based on the ar const and that max value; but always keep the aspect ratio in those values
  const maxWidth = 2000;
  const maxHeight = 2000;
  let newWidth = maxWidth;
  let newHeight = ar ? Math.round(newWidth / ar) : maxHeight;
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = ar ? Math.round(newHeight * ar) : maxWidth;
  }

  const imageUrl = urlForImage(image!)
    ?.width(newWidth)
    .height(newHeight)
    .auto('format')
    .url();

  return (
    <img
      src={imageUrl}
      alt={alt || ''}
      width={newWidth}
      height={newHeight}
      loading="lazy" // Add lazy loading for performance
    />
  );
}
