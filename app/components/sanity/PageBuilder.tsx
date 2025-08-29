'use client';

import BlockRenderer, {BlockType} from './BlockRenderer';
import {Page, PageSection, ProductDecorator} from 'studio/sanity.types';

type PageBuilderProps = {
  parent: {_id: string; _type: string};
  pageBuilder:
    | PageSection['sectionBuilder']
    | ProductDecorator['pageBuilder']
    | Page['pageBuilder'];
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilderSections: BlockType[],
  parent: {_id: string; _type: string},
) {
  // TODO: implement a real data attr construction for visual editing
  const sanityDataAttr = `${parent._id}-${parent._type}-pageBuilder`;

  return (
    <div data-sanity={sanityDataAttr}>
      {pageBuilderSections.map((block: BlockType, index: number) => (
        <BlockRenderer
          key={block._key}
          index={index}
          block={block}
          pageId={parent._id}
          pageType={parent._type}
        />
      ))}
    </div>
  );
}

export default function PageBuilder({parent, pageBuilder}: PageBuilderProps) {
  const pageBuilderSections = pageBuilder || [];

  return (
    pageBuilderSections &&
    pageBuilderSections.length > 0 &&
    renderSections(pageBuilderSections, parent)
  );
}
