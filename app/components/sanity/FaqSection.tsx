'use client';

import {type PortableTextBlock} from '@portabletext/react';

import PortableText from './PortableText';
import {FaqSection} from 'studio/sanity.types';
import {Heading} from '@radix-ui/themes';
import {Accordion, AccordionItem} from './Accordion';

type FaqSectionBlockProps = {
  block: FaqSection;
  index: number;
};

export default function FaqSectionBlock({block}: FaqSectionBlockProps) {
  if (!block?.faqItems?.length) return null;

  return (
    <>
      <Heading as="h2">{block.title}</Heading>
      <Accordion>
        {block.faqItems.map((item, index) => (
          <AccordionItem
            triggerText={item.question!}
            value={`item-${index}`}
            key={item._key ?? `item-${index}`}
          >
            <PortableText value={item.answer as PortableTextBlock[]} />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
