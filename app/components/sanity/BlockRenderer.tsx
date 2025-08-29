import React, {createElement} from 'react';

import ContentSection from './ContentSection';
import ImageContentSection from './ImageContentSection';
import ImageSection from './ImageSection';
import FaqSectionBlock from './FaqSection';
import SideBySideCtaSection from './SideBySideCtaSection';
import NewsletterSectionBlock from './NewsletterBlock';
import BeerLabelBlock from './BeerLabelBlock';
import BeerMapBlock from './BeerMapBlock';

type BlocksType = {
  [key: string]: React.FC<any>;
};

export type BlockType = {
  _id?: string;
  _type: string;
  _key: string;
  specialComponent?: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

const Blocks: BlocksType = {
  faqBlock: FaqSectionBlock,
  imageBlock: ImageSection,
  contentBlock: ContentSection,
  imageContentBlock: ImageContentSection,
  ctaBlock: SideBySideCtaSection,
  newsletterBlock: NewsletterSectionBlock,
  labelsComponent: BeerLabelBlock,
  mapComponent: BeerMapBlock,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  // TODO: implement a real data attr construction for visual editing
  const sanityDataAttr = `${block._id}-${block._type}-blockBuilder`;

  // Block does exist
  const BlockComponent =
    Blocks[
      block.specialComponent && block.specialComponent !== ''
        ? block.specialComponent
        : block._type
    ];

  if (BlockComponent) {
    return (
      <div key={block._key} data-sanity={sanityDataAttr}>
        {createElement(BlockComponent, {
          key: block._key,
          block,
          index,
        })}
      </div>
    );
  }
  // Block doesn't exist yet
  return createElement(
    () => (
      <div>
        <blockquote>
          A &ldquo;{block._type}&rdquo; block component hasn&apos;t been created
        </blockquote>
      </div>
    ),
    {key: block._key},
  );
}
