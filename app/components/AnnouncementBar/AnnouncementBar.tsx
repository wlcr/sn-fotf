import type {FC} from 'react';
import {clsx} from 'clsx';
import type {Header as HeaderType} from '~/types/sanity';
import ResolvedLink from '../sanity/ResolvedLink';
import styles from './AnnouncementBar.module.css';

export interface AnnouncementBarProps {
  announcementBar: HeaderType['announcementBar'];
  className?: string;
}

export const AnnouncementBar: FC<AnnouncementBarProps> = ({
  announcementBar,
  className,
}) => {
  // Don't render if disabled or no text
  if (!announcementBar?.enabled || !announcementBar.text) {
    return null;
  }

  return (
    <div className={clsx(styles.AnnouncementBar, className)} role="banner">
      {announcementBar.link ? (
        <ResolvedLink
          link={announcementBar.link}
          className={styles.AnnouncementBarLink}
        >
          <p className={styles.AnnouncementBarText}>{announcementBar.text}</p>
        </ResolvedLink>
      ) : (
        <p className={styles.AnnouncementBarText}>{announcementBar.text}</p>
      )}
    </div>
  );
};
