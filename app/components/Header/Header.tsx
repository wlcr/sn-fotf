import type {FC} from 'react';
import {Link, NavLink, Await} from 'react-router';
import {clsx} from 'clsx';
import {Suspense} from 'react';
import {urlForImage} from '~/lib/sanity';
import {useAside} from '~/components/Aside';
import type {Header as HeaderType} from '~/studio/sanity.types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import styles from './Header.module.css';
import Logo from '../Icons/LogoOptimized';
import Button from '../Button/Button';

export interface HeaderProps {
  header: HeaderType;
  cart?: Promise<CartApiQueryFragment | null>;
  className?: string;
}

export const Header: FC<HeaderProps> = ({header, cart, className}) => {
  const {logo, ctaButton, announcementBar} = header;

  return (
    <>
      <header className={clsx(styles.Header, className)} role="banner">
        <div className={styles.HeaderLeft}>
          <Button label="Shop Now" appearance="light" variant="outline" />
        </div>
        <div className={styles.HeaderCenter}>
          <div className={styles.HeaderLogo}>
            <Logo />
          </div>
        </div>
        <div className={styles.HeaderRight}>
          <nav>
            <ul className={styles.HeaderUtilityList}>
              <li>How it works</li>
              <li>FAQ</li>
              <li>Cart</li>
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

const CartToggle: FC<{cart: CartApiQueryFragment | null}> = ({cart}) => {
  const {open} = useAside();
  const cartCount = cart?.totalQuantity || 0;

  return (
    <button
      className={styles.utilityLink}
      aria-label={`Open shopping cart with ${cartCount} items`}
      onClick={() => open('cart')}
    >
      <span className={styles.utilityText}>Cart</span>
      <div className={styles.cartIconWrapper}>
        <CartIcon className={styles.utilityIcon} aria-hidden={true} />
        {cartCount > 0 && (
          <span
            className={styles.cartCount}
            aria-label={`${cartCount} items in cart`}
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
    </button>
  );
};

const CartToggleFallback: FC = () => {
  const {open} = useAside();

  return (
    <button
      className={styles.utilityLink}
      aria-label="Open shopping cart"
      onClick={() => open('cart')}
    >
      <span className={styles.utilityText}>Cart</span>
      <CartIcon className={styles.utilityIcon} aria-hidden={true} />
    </button>
  );
};
