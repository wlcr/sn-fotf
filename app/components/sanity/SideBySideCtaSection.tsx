import {CtaBlock} from '~/types/sanity';
import styles from './SideBySideCtaSection.module.css';
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
    <div className={styles.grid}>
      {block.ctas.map((cta) => (
        <Cta block={cta} key={cta._key} />
      ))}
    </div>
  );
}
