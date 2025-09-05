import {Suspense} from 'react';

import ResolvedLink from './ResolvedLink';
import {CallToAction} from 'studio/sanity.types';
import {PortableText} from '@portabletext/react';
import {urlForImage} from '~/lib/sanity';
import styles from './SideBySideCtaSection.module.css';

type CtaProps = {
  block: CallToAction;
};

export default function CTA({block}: CtaProps) {
  const backgroundImageUrl = urlForImage(block.backgroundImage)
    ?.width(800)
    .height(800)
    .auto('format')
    .url();

  return (
    <div
      className={styles.ctaWrapper}
      style={
        {
          '--backgroundImage': `url(${backgroundImageUrl})`,
          backgroundImage: 'var(--backgroundImage)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        } as React.CSSProperties
      }
    >
      <div className={styles.cta}>
        <h2 className="h2">{block.heading}</h2>

        {block.content && (
          <div className="text" style={{fontSize: 'var(--text-size-5)'}}>
            <PortableText value={block.content} />
          </div>
        )}

        <Suspense fallback={null}>
          <ResolvedLink className="button" link={block.button.link}>
            {block.button.buttonText}
          </ResolvedLink>
        </Suspense>
      </div>
    </div>
  );
}
