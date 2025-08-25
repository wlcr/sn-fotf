import { type PortableTextBlock } from 'next-sanity';

import PortableText from '@/components/PortableText';
import { InfoSection } from '@/sanity.types';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

type InfoProps = {
  block: InfoSection;
  index: number;
};

export default function CTA({ block }: InfoProps) {
  return (
    <Box>
      <Flex direction="column" gap="5">
        <div>
          {block?.heading && (
            <Heading as="h2" size="7">
              {block.heading}
            </Heading>
          )}
          {block?.subheading && (
            <Text as="p" size="5">
              {block.subheading}
            </Text>
          )}
        </div>
        {block?.content?.length && (
          <PortableText
            className=""
            value={block.content as PortableTextBlock[]}
          />
        )}
      </Flex>
    </Box>
  );
}
