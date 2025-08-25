'use client';

import {ReactNode, forwardRef} from 'react';
import {Accordion as AccordionRx} from 'radix-ui';
import styles from './Accordion.module.css';
import {ChevronDownIcon} from 'lucide-react';
import {clsx} from 'clsx';
import {Theme} from '@radix-ui/themes';

type AccordionProps = {
  children: ReactNode;
};

export const Accordion = ({children}: AccordionProps) => (
  <AccordionRx.Root
    className={styles.Root}
    type="single"
    defaultValue="item-1"
    collapsible
  >
    <Theme>{children}</Theme>
  </AccordionRx.Root>
);

type AccordionItemProps = {
  triggerText: string;
  children: ReactNode;
  value: string;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof AccordionRx.Item>;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({triggerText, children, className, value, ...props}, forwardedRef) => (
    <AccordionRx.Item
      className={clsx(styles.Item, className)}
      value={value}
      {...props}
      ref={forwardedRef}
    >
      <AccordionTrigger>{triggerText}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionRx.Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';

type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof AccordionRx.Trigger>;

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({children, className, ...props}, forwardedRef) => (
    <AccordionRx.Header className={styles.Header}>
      <AccordionRx.Trigger
        className={clsx(styles.Trigger, className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className={styles.Chevron} aria-hidden />
      </AccordionRx.Trigger>
    </AccordionRx.Header>
  ),
);

AccordionTrigger.displayName = 'AccordionTrigger';

type AccordionContentProps = {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof AccordionRx.Content>;

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({children, className, ...props}, forwardedRef) => (
    <AccordionRx.Content
      className={clsx(styles.Content, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className={styles.ContentText}>{children}</div>
    </AccordionRx.Content>
  ),
);

AccordionContent.displayName = 'AccordionContent';

export default Accordion;
