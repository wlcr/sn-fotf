import type {FC} from 'react';
import {Link} from 'react-router';
import {clsx} from 'clsx';
import {urlForImage} from '~/lib/sanity';
import {linkResolver} from '~/lib/sanity/linkResolver';
import type {Footer as FooterType} from '~/types/sanity';
import styles from './Footer.module.css';

export interface FooterProps {
  footer: FooterType;
  className?: string;
}

export const Footer: FC<FooterProps> = ({footer, className}) => {
  const {logo, internalLinks, externalLinks} = footer;

  return (
    <footer className={clsx(styles.footer, className)} role="contentinfo">
      <div className={styles.footerContainer}>
        {/* Logo - Always centered and on its own line */}
        <div className={styles.logoSection}>
          {logo ? (
            <Link
              to="/"
              className={styles.logoLink}
              aria-label="Go to homepage"
            >
              <img
                src={
                  urlForImage(logo)
                    ?.width(120)
                    .height(60)
                    .auto('format')
                    .url() || ''
                }
                alt={logo.alt || 'Site logo'}
                className={styles.logo}
                width={120}
                height={60}
              />
            </Link>
          ) : (
            <Link
              to="/"
              className={styles.logoTextLink}
              aria-label="Go to homepage"
            >
              <span className={styles.logoText}>Sierra Nevada</span>
            </Link>
          )}
        </div>

        {/* Internal Links - Centered in a line below the logo */}
        {internalLinks && internalLinks.length > 0 && (
          <nav
            className={styles.internalLinksSection}
            aria-label="Site navigation"
          >
            <ul className={styles.linksList}>
              {internalLinks.map((item, index) => {
                const href = linkResolver(item.link);

                if (!href) return null;

                return (
                  <li key={index} className={styles.linkItem}>
                    <Link
                      to={href}
                      className={styles.internalLink}
                      {...(item.link?.openInNewTab && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Decorative Line Divider - Hardcoded */}
        <hr className={styles.divider} aria-hidden="true" />

        {/* External Links - Centered under the line divider */}
        {externalLinks && externalLinks.length > 0 && (
          <nav
            className={styles.externalLinksSection}
            aria-label="External links"
          >
            <ul className={styles.linksList}>
              {externalLinks.map((item, index) => {
                const href = linkResolver(item.link);

                if (!href) return null;

                return (
                  <li key={index} className={styles.linkItem}>
                    <Link
                      to={href}
                      className={styles.externalLink}
                      {...(item.link?.openInNewTab && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Copyright/Legal Text */}
        <div className={styles.copyrightSection}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} Sierra Nevada Brewing Co. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
