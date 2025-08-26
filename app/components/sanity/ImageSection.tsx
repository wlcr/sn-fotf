import {ImageSection} from 'studio/sanity.types';
import CoverImage from './CoverImage';

type ImageSectionProps = {
  block: ImageSection;
  index: number;
};

export default function ImageSectionBlock({block}: ImageSectionProps) {
  return (
    <div className={'image-side'}>
      {block?.image && <CoverImage image={block.image} priority />}
    </div>
  );
}
