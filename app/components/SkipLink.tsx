import type {FC, HTMLAttributes} from 'react';
import styles from './SkipLink.module.css';

interface SkipLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const SkipLink: FC<SkipLinkProps> = ({
  href = '#main-content',
  ...rest
}) => {
  return (
    <a
      data-skip-link
      href={href}
      className={styles.skipLink}
      tabIndex={0}
      {...rest}
    >
      Skip to main content
    </a>
  );
};
