import {Suspense} from 'react';

import ResolvedLink from './ResolvedLink';
import {CallToAction} from 'studio/sanity.types';
import {Box, Button, Card, Flex, Heading, Text} from '@radix-ui/themes';
import {PortableText} from '@portabletext/react';
import {urlForImage} from '~/lib/sanity/urlForImage';

type CtaProps = {
  block: CallToAction;
  index: number;
};

export default function CTA({block}: CtaProps) {
  const backgroundImageUrl = urlForImage(block.backgroundImage)
    ?.width(800)
    .height(800)
    .auto('format')
    .url();

  return (
    <Box
      style={
        {
          '--backgroundImage': `url(${backgroundImageUrl})`,
          backgroundImage: 'var(--backgroundImage)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          padding: 'var(--space-4)',
        } as React.CSSProperties
      }
    >
      <Flex direction="column" gap="5" align="start">
        <Heading as="h2" size="8">
          {block.heading}
        </Heading>

        <Text as="div" size="5">
          <PortableText value={block.content} />
        </Text>

        <Suspense fallback={null}>
          <Button variant="solid" size="4" asChild>
            <ResolvedLink link={block.link}>{block.buttonText}</ResolvedLink>
          </Button>
        </Suspense>
      </Flex>
    </Box>
  );
}
