import BlockRenderer from './BlockRenderer';
import type {Page, ProductDecorator} from 'studio/sanity.types';

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
 *
 * This component is designed for React Router v7 and server-side rendering.
 */

function renderSections(
  pageBuilderSections: PageBuilderSection[],
  parent: {_id: string; _type: string},
) {
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
