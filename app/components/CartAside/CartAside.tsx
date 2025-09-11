import {Await} from 'react-router';
import {Suspense, useEffect, useRef, useCallback} from 'react';
import {clsx} from 'clsx';
import {motion, AnimatePresence} from 'motion/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '../Aside';
import {CartMain} from '../Cart/CartMain';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import styles from './CartAside.module.css';

interface CartAsideProps {
  cart: Promise<CartApiQueryFragment | null>;
}

// Animation configurations (based on Rubato Wines)
const ANIMATION_CONFIG = {
  aside: {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1] as const,
  },
  overlay: {
    duration: 0.5,
    ease: [0.4, 0.0, 0.2, 1] as const,
  },
  reduced: {
    duration: 0.1,
    ease: 'linear' as const,
  },
} as const;

const FOCUS_DELAY = 100;

// Custom hooks for better organization
function useEscapeKey(expanded: boolean, close: () => void) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [expanded, close]);
}

function useBodyScrollLock(expanded: boolean) {
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);
}

function useFocusManagement(
  expanded: boolean,
  closeButtonRef: React.RefObject<HTMLButtonElement>,
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (expanded) {
      // Save the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Wait for animation to start before focusing
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, FOCUS_DELAY);
      return () => clearTimeout(timer);
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        const timer = setTimeout(() => {
          previousFocusRef.current?.focus();
        }, FOCUS_DELAY);
        return () => clearTimeout(timer);
      }
      // Return empty cleanup function if no focus restoration needed
      return () => {};
    }
  }, [expanded, closeButtonRef]);
}

function useAnimationConfig(prefersReducedMotion: boolean) {
  return {
    aside: prefersReducedMotion
      ? ANIMATION_CONFIG.reduced
      : ANIMATION_CONFIG.aside,
    overlay: prefersReducedMotion
      ? ANIMATION_CONFIG.reduced
      : ANIMATION_CONFIG.overlay,
  };
}

export function CartAside({cart}: CartAsideProps) {
  const {type, close} = useAside();
  const isCartOpen = type === 'cart';
  const prefersReducedMotion = usePrefersReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close function with debug logging
  const handleClose = useCallback(() => {
    console.log('handleClose called, current aside type:', type);
    close();
    console.log('close() function executed');
  }, [close, type]);

  const {aside: animationConfig, overlay: overlayConfig} =
    useAnimationConfig(prefersReducedMotion);

  // Custom hooks for side effects
  useEscapeKey(isCartOpen, handleClose);
  useBodyScrollLock(isCartOpen);
  useFocusManagement(isCartOpen, closeButtonRef);

  // Handle backdrop click with proper event delegation
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      // Only close if clicking the backdrop itself, not its children
      console.log('Backdrop click:', {
        target: event.target,
        currentTarget: event.currentTarget,
        equal: event.target === event.currentTarget,
      });
      if (event.target === event.currentTarget) {
        console.log('Attempting to close via backdrop');
        handleClose();
      } else {
        console.log('Backdrop click ignored - not on backdrop itself');
      }
    },
    [handleClose],
  );

  // Handle close button click with event prevention
  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      console.log('Close button clicked, attempting to close');
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    },
    [handleClose],
  );

  return (
    <AnimatePresence mode="wait">
      {isCartOpen && (
        <motion.div
          key="cart-aside"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{
            duration: overlayConfig.duration,
            ease: overlayConfig.ease,
          }}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          onClick={handleBackdropClick}
        >
          {/* Cart drawer with sophisticated animations */}
          <motion.aside
            className={clsx(styles.drawer, styles.cart)}
            initial={{
              x: '100%',
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              x: '50%',
              opacity: 0,
              scale: 0.98,
            }}
            transition={{
              duration: animationConfig.duration,
              ease: animationConfig.ease,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated header */}
            <motion.header
              className={styles.header}
              initial={{y: -20, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -10, opacity: 0}}
              transition={{
                duration: animationConfig.duration * 0.8,
                ease: animationConfig.ease,
                delay: 0.15,
              }}
            >
              <motion.h2
                id="cart-title"
                className={styles.title}
                initial={{scale: 0.9}}
                animate={{scale: 1}}
                exit={{scale: 0.95}}
                transition={{
                  duration: animationConfig.duration * 0.6,
                  ease: animationConfig.ease,
                  delay: 0.2,
                }}
              >
                Cart
              </motion.h2>
              <motion.button
                ref={closeButtonRef}
                className={styles.closeButton}
                onClick={handleCloseClick}
                aria-label="Close cart"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
                transition={{duration: 0.2, ease: 'easeOut'}}
              >
                ×
              </motion.button>
            </motion.header>

            {/* Cart content */}
            <main className={styles.content}>
              <Suspense
                fallback={
                  <div className={styles.loading}>
                    <div className={styles.loadingSpinner} />
                    <p>Loading cart...</p>
                  </div>
                }
              >
                <Await resolve={cart}>
                  {(cartData) => {
                    return <CartMain cart={cartData} layout="aside" />;
                  }}
                </Await>
              </Suspense>
            </main>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
