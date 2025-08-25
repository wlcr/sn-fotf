import { ImageSection } from '@/sanity.types';
import { Box } from '@radix-ui/themes';
import CoverImage from './CoverImage';

type ImageSectionProps = {
  block: ImageSection;
  index: number;
};

export default function ImageSectionBlock({
  block,
}: ImageSectionProps) {
  return (
    <Box className={'image-side'}>
      {block?.image && (
        <CoverImage image={block.image} priority />
      )}
    </Box>
  );
}
