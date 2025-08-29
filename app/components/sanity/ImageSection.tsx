import {ImageBlock} from 'studio/sanity.types';
import CoverImage from './CoverImage';

type ImageBlockProps = {
  block: ImageBlock;
  index: number;
};

export default function ImageSectionBlock({block}: ImageBlockProps) {
  return (
    <div className={'image-side'}>
      {block?.image && <CoverImage image={block.image} priority />}
    </div>
  );
}
