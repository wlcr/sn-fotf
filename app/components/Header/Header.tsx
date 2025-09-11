import type {FC} from 'react';
import {Link, NavLink, Await} from 'react-router';
import {clsx} from 'clsx';
import {Suspense, useState, useEffect} from 'react';
import {motion} from 'motion/react';
import {getSanityImageUrlWithEnv} from '~/lib/sanity';
import {useAside} from '~/components/Aside';
import type {Header as HeaderType, Settings} from '~/types/sanity';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import styles from './Header.module.css';
import Logo from '../Icons/LogoOptimized';
import Button from '../Button/Button';
import {useCustomer} from '~/context/Customer';
import ResolvedLink from '../ResolvedLink';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {
  withReducedMotion,
  buildTransition,
  buildSlideVariants,
  DURATIONS,
  EASINGS,
} from '~/utils/motion';

export interface HeaderProps {
  header: HeaderType;
  cart?: Promise<CartApiQueryFragment | null>;
  settings?: Settings | null;
  className?: string;
}

// Header-specific animation configuration
// Easy to adjust without affecting other components
const HEADER_ANIMATION = {
  delay: 800, // ms delay before header appears
  slideDistance: 100, // px to slide down from
  duration: 0.4, // seconds for animation
  easing: EASINGS.smooth,
};

export const Header: FC<HeaderProps> = ({
  header,
  cart,
  settings,
  className,
}) => {
  const {mainMenu, logo, ctaButton} = header;
  const {customer, isEligible} = useCustomer();
  const {open} = useAside();
  const greeting = settings?.customerGreeting || 'Welcome';
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  // Header entrance animation with configurable delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, HEADER_ANIMATION.delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.header
      className={clsx(styles.Header, className)}
      role="banner"
      initial={{y: -HEADER_ANIMATION.slideDistance, opacity: 0}}
      animate={{
        y: isVisible ? 0 : -HEADER_ANIMATION.slideDistance,
        opacity: isVisible ? 1 : 0,
      }}
      transition={withReducedMotion(
        prefersReducedMotion,
        buildTransition(HEADER_ANIMATION.duration, HEADER_ANIMATION.easing),
      )}
    >
      <div className={styles.HeaderLeft}>
        {ctaButton?.enabled && ctaButton.text && ctaButton.link ? (
          <ResolvedLink link={ctaButton.link}>
            <Button appearance="light" variant="outline">
              {ctaButton.text}
            </Button>
          </ResolvedLink>
        ) : (
          <Button appearance="light" variant="outline">
            Shop Now
          </Button>
        )}
      </div>

      <div className={styles.HeaderCenter}>
        <div className={styles.HeaderLogo}>
          <Link to="/">
            {logo && logo.asset ? (
              <img
                src={getSanityImageUrlWithEnv(logo, {
                  width: 200,
                  height: 80,
                  fit: 'max',
                  format: 'auto',
                  quality: 85,
                })}
                alt={logo.alt || 'Site logo'}
                className={styles.logoImage}
              />
            ) : (
              <Logo />
            )}
          </Link>
        </div>
      </div>

      <div className={styles.HeaderRight}>
        <nav>
          <ul className={styles.HeaderUtilityList}>
            {/* Dynamic Navigation Menu */}
            {mainMenu?.map((item, index: number) => (
              <li key={index}>
                {item.link ? (
                  <ResolvedLink link={item.link}>{item.title}</ResolvedLink>
                ) : (
                  <span>{item.title}</span>
                )}
              </li>
            ))}

            {/* Customer Account/Login */}
            {customer ? (
              <li>
                <a
                  href="https://sierranevada.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    styles.customerAccountLink,
                    isEligible
                      ? styles.customerEligible
                      : styles.customerNotEligible,
                  )}
                >
                  {customer.imageUrl && (
                    <img
                      src={customer.imageUrl}
                      alt={`${customer.firstName || 'Customer'} avatar`}
                      className={styles.customerAvatar}
                    />
                  )}
                  <span className={styles.customerGreeting}>
                    {greeting}
                    {customer.firstName ? `, ${customer.firstName}` : ''}
                  </span>
                </a>
              </li>
            ) : (
              <li>
                <NavLink to="/account" className={styles.loginLink}>
                  Login
                </NavLink>
              </li>
            )}

            {/* TODO: Review cart toggle implementation from Rubato Wines site */}
            {/* Cart functionality was fully built out there - reuse that implementation */}
            <li>
              <button
                onClick={() => open('cart')}
                className={styles.cartButton}
                aria-label="Open cart"
              >
                Cart
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};
