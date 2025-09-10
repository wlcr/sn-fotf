import {ImageSection} from '~/types/sanity';
import CoverImage from './CoverImage';

type ImageSectionProps = {
  block: ImageSection;
  index: number;
};

export default function ImageSection({block}: ImageSectionProps) {
  return (
    <div className={'image-side'}>
      {block?.image && <CoverImage image={block.image} priority />}
    </div>
  );
}
