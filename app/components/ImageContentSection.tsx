import {clsx} from 'clsx';
import type {ImageContentSection as ImageContentSectionData} from 'studio/sanity.types';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import CoverImage from './CoverImage';
import PortableText from './PortableText';
import styles from './ImageContentSection.module.css';

type ImageContentSectionProps = {
  section: ImageContentSectionData;
};

export default function ImageContentSection({
  section,
}: ImageContentSectionProps) {
  // these sub classes below never seem to get appended to the DOM
  const sectionLayout = section.sectionLayout || 'imageLeft';
  const contentAlign = section.contentAlign || 'alignLeft';

  const LayoutClasses = clsx(
    styles.layoutBlock,
    sectionLayout === 'imageLeft' && styles.imageLeft,
    sectionLayout === 'imageRight' && styles.imageRight,
    sectionLayout === 'imageAbove' && styles.imageAbove,
  );

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

  // however, relying on CSS props does seem to work reliably
  const flexFlow =
    sectionLayout === 'imageAbove'
      ? 'column wrap'
      : sectionLayout === 'imageLeft'
        ? 'row nowrap'
        : 'row-reverse nowrap';

  return (
    <div className={LayoutClasses}>
      <div className={styles.imageSide}>
        {section?.image && <CoverImage image={section.image} priority />}
      </div>
      <div className={styles.contentSide}>
        {section?.content?.length && (
          <div className={styles.contentContainer}>
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
