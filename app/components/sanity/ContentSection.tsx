import PortableText from './PortableText';
import {ContentSection} from 'studio/sanity.types';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import styles from './ContentSection.module.css';
import {clsx} from 'clsx';

type ContentSectionProps = {
  block: ContentSection;
  index: number;
};

export default function ContentSectionBlock({block}: ContentSectionProps) {
  const contentAlign = block.contentAlign || 'alignLeft';
  const textAlign =
    contentAlign === 'alignCenter'
      ? 'center'
      : contentAlign === 'alignRight'
        ? 'right'
        : 'left';

  const flexAlign =
    contentAlign === 'alignCenter'
      ? 'center'
      : contentAlign === 'alignRight'
        ? 'flex-end'
        : 'flex-start';

  return (
    <div className={styles.layoutBlock}>
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
