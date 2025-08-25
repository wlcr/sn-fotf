import {type PortableTextBlock} from '@portabletext/react';

import PortableText from './PortableText';
import {ContentSection} from 'studio/sanity.types';
import {Box, Button, Flex, Text} from '@radix-ui/themes';
import {Suspense} from 'react';
import ResolvedLink from './ResolvedLink';
import styles from './ImageContentSection.module.css';
import clsx from 'clsx';
import {TextProps} from '@radix-ui/themes';

type ContentSectionProps = {
  block: ContentSection;
  index: number;
};

export default function ContentSectionBlock({block}: ContentSectionProps) {
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

  return (
    <Box className={styles.layoutBlock}>
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
            <PortableText value={block.content as PortableTextBlock[]} />
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
