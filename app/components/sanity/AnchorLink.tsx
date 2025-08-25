import { Hash } from 'lucide-react';
import { PortableTextBlock } from 'next-sanity';

interface AnchorLinkProps {
  value: PortableTextBlock;
}

export const AnchorLink = ({ value }: AnchorLinkProps) => {
  return (
    <a href={`#${value?._key}`} className="anchor-link">
      <Hash size="24" />
    </a>
  );
};
