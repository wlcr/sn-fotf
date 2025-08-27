import {useState, useCallback} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {clsx} from 'clsx';
import accordionStyles from './FaqAccordion.module.css';
import {FaqSection} from 'studio/sanity.types';
import {PortableText} from '@portabletext/react';

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
  items: FaqSection['faqItems'];
  className?: string;
  allowMultiple?: boolean;
};

export function FaqAccordion({
  items,
  className,
  allowMultiple = false,
}: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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

  // Early return for empty state
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(accordionStyles.accordion, className)}
      role="presentation"
    >
      {items.map((item) => {
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
          </div>
        );
      })}
    </div>
  );
}
