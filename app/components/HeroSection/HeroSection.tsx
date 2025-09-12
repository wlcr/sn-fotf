import Logo from '../Icons/Logo';
import FriendsOfFamily from '../SVG/FriendsOfFamily';
import styles from './HeroSection.module.css';

export type HeroSectionProps = {};

export default function HeroSection() {
  return (
    <div className={styles.HeroSection}>
      <div className={styles.HeroSectionLogos}>
        <div className={styles.HeroSectionLogo}>
          <Logo />
        </div>
        <div className={styles.HeroSectionFriendsLogo}>
          <FriendsOfFamily />
        </div>
      </div>
    </div>
  );
}
