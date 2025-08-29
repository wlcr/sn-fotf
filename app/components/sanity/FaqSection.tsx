'use client';
import {FaqBlock} from 'studio/sanity.types';
import {FaqAccordion} from './FaqAccordion/FaqAccordion';

type FaqBlockProps = {
  block: FaqBlock;
  index: number;
};

export default function FaqSectionBlock({block}: FaqBlockProps) {
  if (!block?.faqItems?.length) return null;

  return (
    <>
      <h2 className="h2">{block.title}</h2>
      <FaqAccordion items={block.faqItems} />
    </>
  );
}
