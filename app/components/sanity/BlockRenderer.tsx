import React, {createElement} from 'react';

import ContentSection from './ContentSection';
import ImageContentSection from './ImageContentSection';
import ImageSection from './ImageSection';
import FaqSectionBlock from './FaqSection';
import SideBySideCtaSection from './SideBySideCtaSection';
import JsonBlock from './JsonBlock';

type BlocksType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

const Blocks: BlocksType = {
  faqSection: FaqSectionBlock,
  imageSection: ImageSection,
  contentSection: ContentSection,
  imageContentSection: ImageContentSection,
  sideBySideCta: SideBySideCtaSection,
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
  // const sanityDataAttr = dataAttr({
  //   id: pageId,
  //   type: pageType,
  //   path: `pageBuilder[_key=="${block._key}"]`,
  // }).toString();

  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div key={block._key} data-sanity={'dataAttr_breaks_vite'}>
        {createElement(Blocks[block._type], {
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
