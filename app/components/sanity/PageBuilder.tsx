'use client';

import BlockRenderer from './BlockRenderer';
import {Page, ProductDecorator} from 'studio/sanity.types';

type PageBuilderProps = {
  parent: {_id: string; _type: string};
  pageBuilder: ProductDecorator['pageBuilder'] | Page['pageBuilder'];
};

type PageBuilderSection = {
  _key: string;
  _type: string;
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilderSections: PageBuilderSection[],
  parent: {_id: string; _type: string},
) {
  // const sanityDataAttr = dataAttr({
  //   id: parent._id,
  //   type: parent._type,
  //   path: `pageBuilder`,
  // }).toString();

  return (
    <div data-sanity={'dataAttr_breaks_vite'}>
      {pageBuilderSections.map((block: PageBuilderSection, index: number) => (
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
