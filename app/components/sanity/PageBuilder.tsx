import BlockRenderer, {BlockType} from './BlockRenderer';
import {Page, PageSection} from '~/types/sanity';

type PageBuilderProps = {
  parent: {_id: string; _type: string};
  pageBuilder: PageSection['sectionBuilder'] | Page['pageBuilder'];
  idName?: string;
  className?: string;
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderSections(
  pageBuilderSections: BlockType[],
  parent: {_id: string; _type: string},
  idName?: string,
  className?: string,
) {
  // TODO: implement a real data attr construction for visual editing
  const sanityDataAttr = `${parent._id}-${parent._type}-pageBuilder`;

  return (
    <div id={idName} data-sanity={sanityDataAttr} className={className}>
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

export default function PageBuilder({
  parent,
  pageBuilder,
  idName,
  className,
}: PageBuilderProps) {
  const pageBuilderSections = pageBuilder || [];

  return (
    pageBuilderSections &&
    pageBuilderSections.length > 0 &&
    renderSections(pageBuilderSections, parent, idName, className)
  );
}
