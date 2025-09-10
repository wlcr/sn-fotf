import type {
  HeroSection as HeroSectionData,
  FaqSection as FaqSectionData,
  ImageSection as ImageSectionData,
  ContentSection as ContentSectionData,
  ImageContentSection as ImageContentSectionData,
  NewsletterSection as NewsletterSectionData,
  CollectionSection as CollectionSectionData,
} from 'studio/sanity.types';

import HeroSection from './HeroSection/HeroSection';
import FaqSection from './FaqSection';
import ImageSection from './ImageSection';
import ContentSection from './ContentSection';
import ImageContentSection from './ImageContentSection';
import NewsletterSection from './NewsletterSection';
import SideBySideCtaSection from './SideBySideCtaSection';
import BeerMapSection from './BeerMapSection';

export const SectionsMap: Record<string, React.ComponentType<any>> = {
  heroSection: HeroSection,
  faqSection: FaqSection,
  imageSection: ImageSection,
  contentSection: ContentSection,
  imageContentSection: ImageContentSection,
  sideBySideCtaSection: SideBySideCtaSection,
  newsletterSection: NewsletterSection,
  beerMapSection: BeerMapSection,
};

export type SectionData =
  | (HeroSectionData & {_key?: string})
  | (FaqSectionData & {_key?: string})
  | (ImageSectionData & {_key?: string})
  | (ContentSectionData & {_key?: string})
  | (ImageContentSectionData & {_key?: string})
  | (NewsletterSectionData & {_key?: string})
  | (CollectionSectionData & {_key?: string});

export type SectionsProps = {
  sections: SectionData[];
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function Sections({sections}: SectionsProps) {
  // TODO: implement a real data attr construction for visual editing
  // const sanityDataAttr = `${block._id}-${block._type}-blockBuilder`;

  return sections?.map((section) => {
    const Component = SectionsMap[section._type];

    if (!Component) {
      return (
        <div key={section._key || section._type}>
          Unknown section: {section._type}
        </div>
      );
    }

    return <Component key={section._key || section._type} {...section} />;
  });
}
