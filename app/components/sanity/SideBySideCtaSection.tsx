import {SideBySideCta} from 'studio/sanity.types';
import styles from './Sections.module.css';
import Cta from './Cta';

type SideBySideCtaBlockProps = {
  block: SideBySideCta;
  index: number;
};

export default function SideBySideCtaBlock({block}: SideBySideCtaBlockProps) {
  if (!block.sideA || !block.sideB) {
    return null;
  }

  return (
    <div className={styles.sectionGrid}>
      <Cta block={block.sideA} index={1} />
      <Cta block={block.sideB} index={2} />
    </div>
  );
}
