/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from 'next-sanity';

import ResolvedLink from '@/components/ResolvedLink';
import { AnchorLink } from './AnchorLink';
import { Heading, Text } from '@radix-ui/themes';

export default function CustomPortableText({
  className,
  value,
  autoAnchors,
}: {
  className?: string;
  value: PortableTextBlock[];
  autoAnchors?: boolean;
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value }) => (
        <Heading as="h1">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </Heading>
      ),
      h2: ({ children, value }) => (
        <Heading as="h2">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </Heading>
      ),
      h3: ({ children, value }) => (
        <Heading as="h3">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </Heading>
      ),
      h4: ({ children }) => (
        <Heading as="h4">{children}</Heading>
      ),
      h5: ({ children }) => (
        <Heading as="h5">{children}</Heading>
      ),
      h6: ({ children }) => (
        <Heading as="h6">{children}</Heading>
      ),
      p: ({ children }) => <Text as="p">{children}</Text>,
    },
    marks: {
      link: ({ children, value: link }) => {
        return (
          <ResolvedLink link={link}>
            {children}
          </ResolvedLink>
        );
      },
    },
  };

  return (
    <div
      className={['portable-copy', className]
        .filter(Boolean)
        .join(' ')}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}
