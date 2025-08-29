import {PortableTextBlock} from '@portabletext/react';

interface AnchorLinkProps {
  value: PortableTextBlock;
}

export const AnchorLink = ({value}: AnchorLinkProps) => {
  return (
    <a href={`#${value?._key}`} className="anchor-link">
      #
    </a>
  );
};
