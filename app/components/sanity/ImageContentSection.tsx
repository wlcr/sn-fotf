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
  // these sub classes below never seem to get appended to the DOM
  // const LayoutClasses = clsx(styles.layoutBlock, {
  //   [styles.imageLeft]: block.sectionLayout === 'imageLeft',
  //   [styles.imageRight]: block.sectionLayout === 'imageRight',
  //   [styles.imageAbove]: block.sectionLayout === 'imageAbove',
  // });

  const textAlign =
    block.contentAlign === 'alignCenter'
      ? 'center'
      : block.contentAlign === 'alignRight'
        ? 'right'
        : 'left';
  console.log('textAlign IC', textAlign);

  const flexAlign =
    block.contentAlign === 'alignCenter'
      ? 'center'
      : block.contentAlign === 'alignRight'
        ? 'flex-end'
        : 'flex-start';
  console.log('flexAlign IC', flexAlign);

  // however, relying on CSS props does seem to work reliably
  const flexFlow =
    block.sectionLayout === 'imageAbove'
      ? 'column wrap'
      : block.sectionLayout === 'imageLeft'
        ? 'row nowrap'
        : 'row-reverse nowrap';
  console.log('flexFlow IC', flexFlow);

  return (
    <div className={styles.layoutBlock}>
      <div className={styles.imageSide}>
        {block?.image && <CoverImage image={block.image} priority />}
      </div>
      <div className={styles.contentSide}>
        {block?.content?.length && (
          <div className={styles.contentContainer}>
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
