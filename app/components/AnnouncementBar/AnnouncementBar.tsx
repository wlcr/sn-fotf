import type {FC} from 'react';
import {clsx} from 'clsx';
import {PortableText} from '@portabletext/react';
import type {AnnouncementBar as AnnouncementBarType} from '~/types/sanity';
import ResolvedLink from '../sanity/ResolvedLink';
import styles from './AnnouncementBar.module.css';

export interface AnnouncementBarProps {
  announcementBar: AnnouncementBarType;
  className?: string;
}

export const AnnouncementBar: FC<AnnouncementBarProps> = ({
  announcementBar,
  className,
}) => {
  // Don't render if disabled or no content
  if (!announcementBar?.enabled || !announcementBar.content) {
    return null;
  }

  const content = (
    <div className={styles.AnnouncementBarText}>
      <PortableText
        value={announcementBar.content}
        components={{
          marks: {
            link: ({children, value}) => (
              <ResolvedLink link={value} className={styles.InlineLink}>
                {children}
              </ResolvedLink>
            ),
          },
        }}
      />
    </div>
  );

  return (
    <div
      data-announcement-bar
      className={clsx(styles.AnnouncementBar, className)}
      role="banner"
    >
      {announcementBar.wrapperLink ? (
        <ResolvedLink
          link={announcementBar.wrapperLink}
          className={styles.AnnouncementBarLink}
        >
          {content}
        </ResolvedLink>
      ) : (
        content
      )}
    </div>
  );
};
