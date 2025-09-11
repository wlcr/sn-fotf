# Animation System

This project uses [Motion](https://motion.dev/) (the successor to Framer Motion) for smooth, accessible animations with proper SSR support.

## Philosophy

- **Accessibility First**: All animations respect `prefers-reduced-motion` preferences
- **Component-Local Config**: Each component defines its own animation settings for maximum flexibility
- **Shared Utilities**: Common patterns and accessibility helpers are centralized
- **Performance Focused**: Animations are optimized and only run when beneficial

## Quick Start

```tsx
import {motion} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {
  withReducedMotion,
  buildTransition,
  EASINGS,
  DURATIONS,
} from '~/utils/motion';

// Component-local animation config (recommended)
const COMPONENT_ANIMATION = {
  duration: DURATIONS.medium, // 0.5s
  easing: EASINGS.smooth, // easeInOut
  slideDistance: 50, // px
};

function MyComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{y: -COMPONENT_ANIMATION.slideDistance, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={withReducedMotion(
        prefersReducedMotion,
        buildTransition(
          COMPONENT_ANIMATION.duration,
          COMPONENT_ANIMATION.easing,
        ),
      )}
    >
      Content
    </motion.div>
  );
}
```

## Motion Integration

### Installation & Setup

Motion is pre-installed and configured for SSR compatibility:

- ✅ Server-side rendering support
- ✅ Proper Vite configuration
- ✅ TypeScript integration

### Basic Usage

```tsx
import {motion} from 'motion/react';

// Basic animation
<motion.div animate={{x: 100}} transition={{duration: 0.5}}>
  Animated content
</motion.div>;
```

## Accessibility System

### Reduced Motion Hook

Always use the `usePrefersReducedMotion` hook to respect user preferences:

```tsx
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';

function Component() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use the hook to conditionally apply animations
  const animationProps = prefersReducedMotion
    ? {transition: {duration: 0}} // Instant
    : {transition: {duration: 0.3}}; // Animated
}
```

### Accessibility Utilities

The `~/utils/motion` file provides accessibility helpers:

```tsx
import {withReducedMotion, withReducedMotionVariants} from '~/utils/motion';

// For transitions
const transition = withReducedMotion(prefersReducedMotion, {
  duration: 0.5,
  ease: easeInOut,
});

// For variants
const variants = withReducedMotionVariants(prefersReducedMotion, {
  hidden: {opacity: 0, y: -20},
  visible: {opacity: 1, y: 0},
});
```

## Animation Patterns

### Component-Local Configuration (Recommended)

Keep animation settings close to where they're used for easy tuning:

```tsx
// At the top of your component file
const ANIMATION_CONFIG = {
  delay: 200, // ms
  duration: 0.4, // seconds
  slideDistance: 100, // px
  easing: EASINGS.smooth, // Motion easing function
};

function Header() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.header
      initial={{y: -ANIMATION_CONFIG.slideDistance, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={withReducedMotion(
        prefersReducedMotion,
        buildTransition(ANIMATION_CONFIG.duration, ANIMATION_CONFIG.easing),
      )}
    >
      Header content
    </motion.header>
  );
}
```

### Shared Constants

Use shared constants for consistency across components:

```tsx
import {DURATIONS, EASINGS} from '~/utils/motion';

const myTransition = {
  duration: DURATIONS.fast, // 0.3s
  ease: EASINGS.smooth, // easeInOut
};
```

### Common Animation Builders

#### buildTransition()

Quick transition builder with accessibility:

```tsx
import {buildTransition, EASINGS} from '~/utils/motion';

const transition = withReducedMotion(
  prefersReducedMotion,
  buildTransition(0.5, EASINGS.snappy),
);
```

#### buildSlideVariants()

Pre-built slide animation patterns:

```tsx
import {buildSlideVariants, withReducedMotionVariants} from '~/utils/motion';

const slideVariants = withReducedMotionVariants(
  prefersReducedMotion,
  buildSlideVariants(100, 'y'), // Slide from top
);
```

## Available Constants

### Durations

```tsx
import {DURATIONS} from '~/utils/motion';

DURATIONS.instant; // 0s
DURATIONS.quick; // 0.2s
DURATIONS.fast; // 0.3s
DURATIONS.medium; // 0.5s
DURATIONS.slow; // 0.8s
```

### Easing Functions

```tsx
import {EASINGS} from '~/utils/motion';

EASINGS.smooth; // easeInOut - natural, balanced
EASINGS.snappy; // easeOut - quick start, slow end
EASINGS.bouncy; // easeOut - energetic feel
```

## Real-World Examples

### Header Entrance Animation

```tsx
// app/components/Header/Header.tsx
const HEADER_ANIMATION = {
  delay: 800,           // Wait before appearing
  slideDistance: 100,   // Slide down from above viewport
  duration: 0.4,        // Smooth entrance timing
  easing: EASINGS.smooth,
};

<motion.header
  initial={{ y: -HEADER_ANIMATION.slideDistance, opacity: 0 }}
  animate={{ y: isVisible ? 0 : -HEADER_ANIMATION.slideDistance, opacity: isVisible ? 1 : 0 }}
  transition={withReducedMotion(prefersReducedMotion, buildTransition(HEADER_ANIMATION.duration, HEADER_ANIMATION.easing))}
>
```

### Hover Animations

```tsx
import {withReducedMotionHover} from '~/utils/motion';

<motion.button
  whileHover={withReducedMotionHover(prefersReducedMotion, {
    scale: 1.05,
    transition: {duration: 0.2},
  })}
>
  Button
</motion.button>;
```

## Best Practices

### ✅ Do

- Always use `usePrefersReducedMotion` hook
- Keep animation config close to components
- Use shared utilities for common patterns
- Set reasonable durations (0.2s - 0.8s for most UI)
- Test with reduced motion enabled

### ❌ Don't

- Create rigid centralized animation systems
- Ignore accessibility preferences
- Use overly long animations (>1s for UI elements)
- Animate too many elements simultaneously
- Forget to test SSR compatibility

## Testing Animations

### Browser DevTools

1. Open DevTools → Settings → Rendering
2. Enable "Emulate CSS prefers-reduced-motion"
3. Test both "reduce" and "no-preference" states

### Accessibility Testing

```bash
# Test with reduced motion simulation
# Your animations should become instant (duration: 0)
```

## Performance Tips

- Use `transform` and `opacity` properties (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change: transform` for complex animations
- Remove animations after they complete

## Migration Guide

When adding animations to existing components:

1. **Add the hook**: Import and use `usePrefersReducedMotion`
2. **Create config**: Add component-local animation configuration
3. **Wrap with Motion**: Replace HTML elements with `motion.*` equivalents
4. **Add accessibility**: Use `withReducedMotion` utility
5. **Test**: Verify with reduced motion preferences

---

For more advanced Motion features, see the [Motion documentation](https://motion.dev/docs).
