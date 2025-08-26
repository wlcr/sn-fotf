import {type PortableTextBlock} from '@portabletext/react';

import PortableText from './PortableText';
import {InfoSection} from 'studio/sanity.types';

type InfoProps = {
  block: InfoSection;
  index: number;
};

export default function CTA({block}: InfoProps) {
  return (
    <>
      <div>
        {block?.heading && <h2 className="h2">{block.heading}</h2>}
        {block?.subheading && <p className="p">{block.subheading}</p>}
      </div>
      {block?.content?.length && (
        <PortableText
          className=""
          value={block.content as PortableTextBlock[]}
        />
      )}
    </>
  );
}
