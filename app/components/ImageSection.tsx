import type {ImageSection as ImageSectionData} from 'studio/sanity.types';
import CoverImage from './CoverImage';

type ImageSectionProps = {
  section: ImageSectionData;
};

export default function ImageSection({section}: ImageSectionProps) {
  return (
    <div className={'image-side'}>
      {section?.image && <CoverImage image={section.image} priority />}
    </div>
  );
}
