import {Suspense} from 'react';

import ResolvedLink from '@/components/ResolvedLink';
import {CallToAction} from 'studio/sanity.types';
import {Button, Card, Flex, Heading, Text} from '@radix-ui/themes';

type CtaProps = {
  block: CallToAction;
  index: number;
};

export default function CTA({block}: CtaProps) {
  return (
    <Card
      size="3"
      variant="classic"
      style={{backgroundColor: 'var(--accent-7)'}}
    >
      <Flex direction="column" gap="5" align="start">
        <Heading as="h2" size="8">
          {block.heading}
        </Heading>

        <Text as="div" size="5">
          {block.text}
        </Text>

        <Suspense fallback={null}>
          <Button variant="solid" size="4" asChild>
            <ResolvedLink link={block.link}>{block.buttonText}</ResolvedLink>
          </Button>
        </Suspense>
      </Flex>
    </Card>
  );
}
