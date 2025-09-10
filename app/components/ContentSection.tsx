import PortableText from './PortableText';
import type {ContentSection as ContentSectionType} from '~/types/sanity';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import styles from './ContentSection.module.css';
import {clsx} from 'clsx';

type ContentSectionProps = {
  section: ContentSectionType;
  index: number;
};

export default function ContentSection({section}: ContentSectionProps) {
  const contentAlign = section.contentAlign || 'alignLeft';
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
        {section?.content?.length && (
          <div
            className={styles.contentContainer}
            style={{'--textAlign': textAlign} as React.CSSProperties}
          >
            <PortableText
              value={section.content?.map((blockItem) => ({
                ...blockItem,
                children: blockItem.children ?? [],
              }))}
            />
          </div>
        )}
        {section?.button &&
          section.button.link &&
          section.button.buttonText && (
            <Suspense fallback={null}>
              <ResolvedLink
                link={section.button.link}
                className={clsx('button', styles.button)}
              >
                <span>{section.button.buttonText}</span>
              </ResolvedLink>
            </Suspense>
          )}
      </div>
    </div>
  );
}
