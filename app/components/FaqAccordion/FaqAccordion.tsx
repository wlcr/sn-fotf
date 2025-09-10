import {useState, useEffect, useRef, useCallback} from 'react';
import {clsx} from 'clsx';
import accordionStyles from './FaqAccordion.module.css';
import type {FaqSection as FaqSectionData} from '~/types/sanity';
import {PortableText} from '@portabletext/react';

// Dynamic imports for motion components to avoid server-side inclusion
let motion: any = null;
let AnimatePresence: any = null;

// Client-side only motion loading
const loadMotion = async () => {
  if (typeof window !== 'undefined' && !motion) {
    const motionModule = await import('motion/react');
    motion = motionModule.motion;
    AnimatePresence = motionModule.AnimatePresence;
  }
};

// Animation configuration
const ANIMATION_CONFIG = {
  duration: 0.3,
  ease: [0.4, 0.0, 0.2, 1] as const,
} as const;

// Animated plus/X icon component
interface PlusXIconProps {
  className?: string;
  isOpen: boolean;
  'aria-hidden'?: boolean;
}

function PlusXIcon({
  className,
  isOpen,
  'aria-hidden': ariaHidden = true,
}: PlusXIconProps) {
  return (
    <div
      className={clsx(className, isOpen && accordionStyles.open)}
      aria-hidden={ariaHidden}
    >
      <span
        className={clsx(
          accordionStyles.iconLine,
          accordionStyles.iconLineHorizontal,
        )}
        aria-hidden="true"
      />
      <span
        className={clsx(
          accordionStyles.iconLine,
          accordionStyles.iconLineVertical,
        )}
        aria-hidden="true"
      />
    </div>
  );
}

type FaqAccordionProps = {
  items: FaqSectionData['faqItems'];
  className?: string;
  allowMultiple?: boolean;
};

export function FaqAccordion({
  items,
  className,
  allowMultiple = false,
}: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [motionLoaded, setMotionLoaded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Load motion components on client-side
  useEffect(() => {
    loadMotion().then(() => {
      setMotionLoaded(true);
    });
  }, []);

  // Memoized helper functions
  const isItemOpen = useCallback(
    (itemId: string) => openItems.has(itemId),
    [openItems],
  );

  const toggleItem = useCallback(
    (itemId: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);

        if (newSet.has(itemId)) {
          // Close this item
          newSet.delete(itemId);
        } else {
          // Open this item
          if (!allowMultiple) {
            // If not allowing multiple, close all others
            newSet.clear();
          }
          newSet.add(itemId);
        }

        return newSet;
      });
    },
    [allowMultiple],
  );

  // Close accordion when clicking outside (optional behavior)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      accordionRef.current &&
      !accordionRef.current.contains(event.target as Node)
    ) {
      setOpenItems(new Set());
    }
  }, []);

  useEffect(() => {
    // Only add listener if we have items
    if (items?.length === 0) return;

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside, items?.length]);

  // Early return for empty state
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={accordionRef}
      className={clsx(accordionStyles.accordion, className)}
      role="presentation"
    >
      {items.map((item, index) => {
        const itemId = item._key;
        const isOpen = isItemOpen(itemId);
        const contentId = `accordion-content-${itemId}`;
        const headerId = `accordion-header-${itemId}`;

        return (
          <div key={itemId} className={accordionStyles.accordionItem}>
            <button
              id={headerId}
              className={accordionStyles.accordionHeader}
              onClick={() => toggleItem(itemId)}
              aria-expanded={isOpen}
              aria-controls={contentId}
              type="button"
            >
              <span className={accordionStyles.accordionTitle}>
                {item.question}
              </span>
              <PlusXIcon
                className={accordionStyles.accordionIcon}
                isOpen={isOpen}
              />
            </button>

            {/* Conditional rendering based on motion availability */}
            {motionLoaded && motion && AnimatePresence ? (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={contentId}
                    className={accordionStyles.accordionContent}
                    role="region"
                    aria-labelledby={headerId}
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{
                      duration: ANIMATION_CONFIG.duration,
                      ease: ANIMATION_CONFIG.ease,
                      height: {duration: ANIMATION_CONFIG.duration},
                    }}
                    style={{overflow: 'hidden'}}
                  >
                    <div className={accordionStyles.accordionContentInner}>
                      <PortableText value={item.answer ?? []} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              // Fallback without animation for server-side rendering
              isOpen && (
                <div
                  id={contentId}
                  className={accordionStyles.accordionContent}
                  role="region"
                  aria-labelledby={headerId}
                  style={{overflow: 'hidden'}}
                >
                  <div className={accordionStyles.accordionContentInner}>
                    <PortableText value={item.answer ?? []} />
                  </div>
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
