import {ImageContentSection} from 'studio/sanity.types';
import {Box, Button, Flex, Text, TextProps} from '@radix-ui/themes';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import CoverImage from './CoverImage';
import styles from './ImageContentSection.module.css';
import clsx from 'clsx';
import PortableText from './PortableText';

type ImageContentSectionProps = {
  block: ImageContentSection;
  index: number;
};

export default function ImageContentSectionBlock({
  block,
}: ImageContentSectionProps) {
  const typeSize = block.typeSize ? block.typeSize : 3;
  const buttonSize = typeSize >= 5 ? '3' : '2';
  const buttonTextSize = typeSize >= 5 ? '4' : typeSize.toString();

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
        ? 'end'
        : 'start';

  const LayoutClasses = clsx(styles.layoutBlock, {
    [styles.imageLeft]: block.sectionLayout === 'imageLeft',
    [styles.imageRight]: block.sectionLayout === 'imageRight',
    [styles.imageAbove]: block.sectionLayout === 'imageAbove',
  });

  return (
    <Box className={LayoutClasses}>
      <Box className={styles.imageSide}>
        {block?.image && <CoverImage image={block.image} priority />}
      </Box>
      <Flex
        direction="column"
        justify={{initial: 'start', md: 'center'}}
        align={{initial: 'start', md: flexAlign}}
        gap={{initial: '5', md: '7'}}
        className={clsx(styles.contentSide)}
      >
        {block?.content?.length && (
          <Text
            as="div"
            align={{initial: 'left', md: textAlign}}
            size={typeSize.toString() as TextProps['size']}
          >
            <PortableText value={block.content} />
          </Text>
        )}
        {block?.button && block.button.link && block.button.buttonText && (
          <Suspense fallback={null}>
            <Button variant="solid" size={buttonSize} asChild>
              <ResolvedLink link={block.button.link}>
                <Text size={buttonTextSize as TextProps['size']}>
                  {block.button.buttonText}
                </Text>
              </ResolvedLink>
            </Button>
          </Suspense>
        )}
      </Flex>
    </Box>
  );
}
