import type {Transition, Variants} from 'motion/react';
import {easeInOut, easeOut} from 'motion/react';

export type {Transition, Variants};

// =============================================================================
// SHARED ANIMATION CONSTANTS
// =============================================================================
// Only truly reusable values that multiple components might use

/**
 * Common easing curves - using Motion's easing functions
 * These are properly typed and will work with Motion's Transition type
 */
export const EASINGS = {
  smooth: easeInOut,
  snappy: easeOut,
  bouncy: easeOut,
} as const;

/**
 * Common duration ranges - components can pick what feels right
 */
export const DURATIONS = {
  instant: 0,
  quick: 0.2,
  fast: 0.3,
  medium: 0.5,
  slow: 0.8,
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
// The real value - accessibility and convenience functions

/**
 * Makes any transition respect reduced motion preferences
 * This is the main utility that makes animations accessible
 */
export function withReducedMotion(
  prefersReducedMotion: boolean,
  transition: Transition,
): Transition {
  return prefersReducedMotion ? {duration: 0} : transition;
}

/**
 * Makes any variants respect reduced motion preferences
 */
export function withReducedMotionVariants(
  prefersReducedMotion: boolean,
  variants: Variants,
): Variants {
  if (!prefersReducedMotion) return variants;

  // Convert all animations to instant
  const instantVariants: Variants = {};
  Object.entries(variants).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      instantVariants[key] = {...value, transition: {duration: 0}};
    } else {
      instantVariants[key] = value;
    }
  });

  return instantVariants;
}

/**
 * Makes hover animations respect reduced motion preferences
 */
export function withReducedMotionHover<T extends Record<string, any>>(
  prefersReducedMotion: boolean,
  hoverAnimation: T,
): T | {} {
  return prefersReducedMotion ? {} : hoverAnimation;
}

/**
 * Quick helper to build a transition with common values
 * Usage: buildTransition(0.4, easeInOut) or buildTransition(DURATIONS.fast, EASINGS.smooth)
 */
export function buildTransition(
  duration: number,
  ease = EASINGS.smooth,
): Transition {
  return {duration, ease};
}

/**
 * Quick helper to build slide-in variants
 * Usage: buildSlideVariants(100, 'y') for slide from top
 * Usage: buildSlideVariants(-100, 'x') for slide from left
 */
export function buildSlideVariants(
  distance: number,
  axis: 'x' | 'y' = 'y',
): Variants {
  return {
    hidden: {[axis]: -distance, opacity: 0},
    visible: {[axis]: 0, opacity: 1},
  };
}
