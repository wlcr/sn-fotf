import {clsx} from 'clsx';
import {ImageContentSection} from 'studio/sanity.types';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import CoverImage from './CoverImage';
import PortableText from './PortableText';
import styles from './ImageContentSection.module.css';

type ImageContentSectionProps = {
  block: ImageContentSection;
  index: number;
};

export default function ImageContentSectionBlock({
  block,
}: ImageContentSectionProps) {
  const textAlign =
    block.contentAlign === 'alignCenter'
      ? 'center'
      : block.contentAlign === 'alignRight'
        ? 'right'
        : 'left';

  const flexAlign =
    block.contentAlign === 'alignCenter'
      ? 'center'
      : block.contentAlign === 'alignRight'
        ? 'flex-end'
        : 'flex-start';

  // CSS prop for flex flow based on section layout
  const flexFlow =
    block.sectionLayout === 'imageAbove'
      ? 'column wrap'
      : block.sectionLayout === 'imageLeft'
        ? 'row nowrap'
        : 'row-reverse nowrap';

  return (
    <div
      className={styles.layoutBlock}
      style={{'--flexFlow': flexFlow} as React.CSSProperties}
    >
      <div className={styles.imageSide}>
        {block?.image && <CoverImage image={block.image} priority />}
      </div>
      <div
        className={styles.contentSide}
        style={{'--flexAlign': flexAlign} as React.CSSProperties}
      >
        {block?.content?.length && (
          <div
            className={styles.contentContainer}
            style={{'--textAlign': textAlign} as React.CSSProperties}
          >
            <PortableText
              value={block.content?.map((blockItem) => ({
                ...blockItem,
                children: blockItem.children ?? [],
              }))}
            />
          </div>
        )}
        {block?.button && block.button.link && block.button.buttonText && (
          <Suspense fallback={null}>
            <ResolvedLink
              link={block.button.link}
              className={clsx('button', styles.button)}
            >
              <span>{block.button.buttonText}</span>
            </ResolvedLink>
          </Suspense>
        )}
      </div>
    </div>
  );
}
