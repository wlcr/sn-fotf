import {FaqSection} from 'studio/sanity.types';
import {FaqAccordion} from './FaqAccordion/FaqAccordion';

type FaqSectionBlockProps = {
  block: FaqSection;
  index: number;
};

export default function FaqSectionBlock({block}: FaqSectionBlockProps) {
  if (!block?.faqItems?.length) return null;

  return (
    <>
      <h2 className="h2">{block.title}</h2>
      <FaqAccordion items={block.faqItems} />
    </>
  );
}
