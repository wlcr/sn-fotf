import getVimeoId from '~/lib/vimeo/getVimeoId';
import Logo from '../Icons/Logo';
import FriendsOfFamily from '../SVG/FriendsOfFamily';
import styles from './HeroSection.module.css';
import {HeroSection as HeroSectionData} from '~/studio/sanity.types';
import makeVimeoEmbedUrl from '~/lib/vimeo/makeVimeoEmbedUrl';

export type HeroSectionProps = {
  section: HeroSectionData;
};

export default function HeroSection({section}: HeroSectionProps) {
  const mobileVimeoId = getVimeoId(section.mobileVimeoUrl);
  const desktopVimeoId = getVimeoId(section.desktopVimeoUrl);
  const mobileVimeoUrl = makeVimeoEmbedUrl(mobileVimeoId);
  const desktopVimeoUrl = makeVimeoEmbedUrl(desktopVimeoId);

  console.log({mobileVimeoId, desktopVimeoId});

  return (
    <div className={styles.HeroSection}>
      <div className={styles.HeroSectionVideo}>
        <div className={styles.HeroSectionVideoMobile}>
          <iframe src={mobileVimeoUrl} title={section.title}></iframe>
        </div>
        <div className={styles.HeroSectionVideoDesktop}>
          <iframe src={desktopVimeoUrl} title={section.title}></iframe>
        </div>
      </div>
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
