import {PageSection} from '~/types/sanity';
import PageBuilder from './PageBuilder';
import styles from './Sections.module.css';
import {clsx} from 'clsx';

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
  const sanityDataAttr = `${parent._id}-${parent._type}-pageBuilder`;

  return (
    <div data-sanity={sanityDataAttr} className={styles.SectionsContainer}>
      {pageBuilder.map((pageSection: PageSection, index) => {
        const parentId = `${parent._id}-section-${index}`;
        return (
          <PageBuilder
            key={`${parentId}-${pageSection.sectionBuilder?.length || 0}`}
            parent={{_id: parentId, _type: pageSection._type}}
            pageBuilder={
              pageSection.sectionBuilder as PageSection['sectionBuilder']
            }
            idName={pageSection.sectionId}
            className={clsx(
              styles.Section,
              styles.fullHeight,
              pageSection.sectionClasses,
            )}
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
