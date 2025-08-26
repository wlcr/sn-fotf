import {
  PortableText,
  PortableTextBlock,
  PortableTextComponents,
} from '@portabletext/react';

/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import ResolvedLink from './ResolvedLink';
import {AnchorLink} from './AnchorLink';

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
      h1: ({children, value}) => (
        <h1 className="h1">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </h1>
      ),
      h2: ({children, value}) => (
        <h2 className="h2">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </h2>
      ),
      h3: ({children, value}) => (
        <h3 className="h3">
          {children}
          {!!autoAnchors && <AnchorLink value={value} />}
        </h3>
      ),
      h4: ({children}) => <h4 className="h4">{children}</h4>,
      h5: ({children}) => <h5 className="h5">{children}</h5>,
      h6: ({children}) => <h6 className="h6">{children}</h6>,
      p: ({children}) => <p className="p">{children}</p>,
    },
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>;
      },
    },
  };

  return (
    <div className={['portable-copy', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  );
}
