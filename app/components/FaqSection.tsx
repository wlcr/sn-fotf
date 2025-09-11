import type {FaqSection as FaqSectionData} from 'studio/sanity.types';
import {FaqAccordion} from './FaqAccordion/FaqAccordion';

type FaqSectionProps = {
  section: FaqSectionData;
};

export default function FaqSection({section}: FaqSectionProps) {
  if (!section?.faqItems?.length) return null;

  return (
    <>
      <h2 className="h2">{section.title}</h2>
      <FaqAccordion items={section.faqItems} />
    </>
  );
}
