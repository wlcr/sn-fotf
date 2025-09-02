import type {FC} from 'react';
import {Link, NavLink} from 'react-router';
import {clsx} from 'clsx';
import {urlForImage} from '~/lib/sanity';
import type {Header as HeaderType} from '~/studio/sanity.types';
import styles from './Header.module.css';

export interface HeaderProps {
  header: HeaderType;
  className?: string;
}

export const Header: FC<HeaderProps> = ({header, className}) => {
  const {logo, ctaButton, announcementBar} = header;

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className={styles.skipLink} tabIndex={0}>
        Skip to main content
      </a>

      {/* Announcement Bar */}
      {announcementBar?.enabled && announcementBar.text && (
        <div className={styles.announcementBar} role="banner">
          {announcementBar.link ? (
            <Link
              to={announcementBar.link.href || '#'}
              className={styles.announcementLink}
              {...(announcementBar.link.openInNewTab && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              {announcementBar.text}
            </Link>
          ) : (
            <span className={styles.announcementText}>
              {announcementBar.text}
            </span>
          )}
        </div>
      )}

      {/* Main Header */}
      <header className={clsx(styles.header, className)} role="banner">
        <div className={styles.headerContainer}>
          {/* CTA Button - Desktop: Left, Mobile: First in bottom row */}
          {ctaButton?.enabled && ctaButton.text && ctaButton.link && (
            <div className={styles.ctaButtonWrapper}>
              <Link
                to={ctaButton.link.href || '#'}
                className={clsx(styles.ctaButton, 'button')}
                {...(ctaButton.link.openInNewTab && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
              >
                {ctaButton.text}
              </Link>
            </div>
          )}

          {/* Logo - Always centered */}
          <div className={styles.logoWrapper}>
            {logo ? (
              <Link
                to="/"
                className={styles.logoLink}
                aria-label="Go to homepage"
              >
                <img
                  src={
                    urlForImage(logo)
                      ?.width(200)
                      .height(80)
                      .auto('format')
                      .url() || ''
                  }
                  alt={logo.alt || 'Site logo'}
                  className={styles.logo}
                  width={200}
                  height={80}
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

          {/* Utility Links - Desktop: Right, Mobile: Second in bottom row */}
          <nav
            className={styles.utilityNav}
            aria-label="Account and cart navigation"
          >
            <ul className={styles.utilityList}>
              <li className={styles.utilityItem}>
                <NavLink
                  to="/account"
                  className={({isActive}) =>
                    clsx(
                      styles.utilityLink,
                      isActive && styles.utilityLinkActive,
                    )
                  }
                  aria-label="Go to your account"
                >
                  <span className={styles.utilityText}>Account</span>
                  <AccountIcon
                    className={styles.utilityIcon}
                    aria-hidden={true}
                  />
                </NavLink>
              </li>
              <li className={styles.utilityItem}>
                <button
                  className={styles.utilityLink}
                  aria-label="Open shopping cart"
                  onClick={() => {
                    // Cart toggle logic will be added when cart component is created
                    console.log('Toggle cart');
                  }}
                >
                  <span className={styles.utilityText}>Cart</span>
                  <CartIcon className={styles.utilityIcon} aria-hidden={true} />
                  {/* Cart count badge will be added when cart state is implemented */}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

// Temporary icon components - replace with actual SVG icons when available
const AccountIcon: FC<{className?: string; 'aria-hidden'?: boolean}> = ({
  className,
  'aria-hidden': ariaHidden,
}) => (
  <svg
    className={className}
    aria-hidden={ariaHidden}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      fill="currentColor"
    />
  </svg>
);

const CartIcon: FC<{className?: string; 'aria-hidden'?: boolean}> = ({
  className,
  'aria-hidden': ariaHidden,
}) => (
  <svg
    className={className}
    aria-hidden={ariaHidden}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6zm0 3a1 1 0 112 0 1 1 0 01-2 0z"
      fill="currentColor"
    />
  </svg>
);
