'use client';

import {PageBuilderResult, PageSection} from 'studio/sanity.types';
import PageBuilder from './PageBuilder';

type SectionsBuilderProps = {
  parent: {_id: string; _type: string};
  pageBuilder: PageSection[];
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilder: PageSection[],
  parent: {_id: string; _type: string},
) {
  // TODO: implement a real data attr construction for visual editing
  const sanityDataAttr = `${parent._id}-${parent._type}-sectionPageBuilder`;

  return (
    <div data-sanity={sanityDataAttr}>
      {pageBuilder.map((pageSection: PageSection, index) => {
        const parentId = `${parent._id}-section-${index}`;
        return (
          <PageBuilder
            key={`${parentId}-${pageSection.sectionBuilder?.length || 0}`}
            parent={{_id: parentId, _type: pageSection._type}}
            pageBuilder={
              pageSection.sectionBuilder as PageSection['sectionBuilder']
            }
          />
        );
      })}
    </div>
  );
}

export default function SectionPageBuilder({
  parent,
  pageBuilder,
}: SectionsBuilderProps) {
  return (
    pageBuilder && pageBuilder.length > 0 && renderSections(pageBuilder, parent)
  );
}
