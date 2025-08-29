import {CtaBlock} from 'studio/sanity.types';
import styles from './Sections.module.css';
import Cta from './Cta';

type SideBySideCtaBlockProps = {
  block: CtaBlock;
  index: number;
};

export default function SideBySideCtaBlock({block}: SideBySideCtaBlockProps) {
  if (!block?.ctas || block.ctas.length === 0) {
    return null;
  }
  return (
    <div className={styles.sectionGrid}>
      {block.ctas.map((cta) => (
        <Cta block={cta} key={cta._key} />
      ))}
    </div>
  );
}
