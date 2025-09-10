import HeroSection from './HeroSection/HeroSection';
import FaqSection from './FaqSection';
import ImageSection from './ImageSection';

export const SectionsMap: Record<string, unknown> = {
  // heroSection: HeroSection,
  // faqSection: FaqSection,
  // imageSection: ImageSection,
  // contentSection: ContentSection,
  // imageContentSection: ImageContentSection,
  // sideBySideCtaSection: SideBySideCtaSection,
  // newsletterSection: NewsletterSection,
  // beerMapSection: BeerMapSection,
};

export type SectionsProps = {
  sections: unknown[];
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function Sections({sections}: SectionsProps) {
  // TODO: implement a real data attr construction for visual editing
  // const sanityDataAttr = `${block._id}-${block._type}-blockBuilder`;

  return sections?.map((section) => {
    const Component = SectionsMap[section._type];

    return <div key={section._type}>{section._type}</div>;
  });
}
