import {stegaClean} from '@sanity/client/stega';
import {getImageDimensions} from '@sanity/asset-utils';
import SanityImage from './SanityImage';

interface CoverImageProps {
  image: any;
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const {image: source, priority} = props;
  const image = source?.asset?._ref ? (
    <SanityImage
      image={source}
      width={getImageDimensions(source).width}
      height={getImageDimensions(source).height}
      aspectRatio={getImageDimensions(source).aspectRatio}
      alt={stegaClean(source?.alt) || ''}
    />
  ) : null;

  return <div className="relative">{image}</div>;
}
