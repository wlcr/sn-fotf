# GitHub Copilot Instructions for React Router v7 + Hydrogen + Sanity Project

This file provides context to GitHub Copilot for more accurate and helpful code reviews.

## Project Context

### Technology Stack

- **React Router**: v7.6.0 (not Remix, not Next.js)
- **Hydrogen**: 2025.5.0 (Shopify's React framework)
- **Radix UI Themes**: Layout primitives only (Container, Flex, Grid, Card)
- **Custom Components**: Brand-specific interactive elements (Button, Header, etc.)
- **TypeScript**: 5.2.2 with strict mode enabled
- **Sanity CMS**: Custom integration (not using hydrogen-sanity package)
- **Deployment**: Shopify Oxygen (edge functions)

### Architecture Patterns

#### React Router v7 Specific

- Use `loader` and `clientLoader` functions, not `getServerSideProps` or `getStaticProps`
- Route files use `+types` imports: `import type { Route } from './+types/filename'`
- Components export as default function, not named exports
- File-based routing with `$` for dynamic segments

#### TypeScript Standards

- Strict mode enabled with comprehensive quality checks
- No `any` types without explicit justification
- Prefer `type` imports: `import type { Foo } from 'bar'`
- Explicit return types for public functions
- Proper error handling with custom error classes

#### Sanity CMS Integration

- Custom integration using `@sanity/client` and `@sanity/preview-kit`
- Environment variables accessed safely across server/client
- GROQ queries have inline comments explaining complex patterns
- Image optimization with proper URL construction

#### Environment Safety

- Safe cross-environment variable access patterns
- No direct `window` or `process.env` usage without checks
- Proper server/client environment detection
- Edge function compatibility for Oxygen deployment

## Code Review Focus Areas

### What to Flag as Issues

1. **Framework Mismatches**: Using Next.js or old Remix patterns instead of React Router v7
2. **Type Safety**: `any` types without justification, missing interfaces
3. **Environment Issues**: Direct global access without safety checks
4. **Performance**: Missing error handling, inefficient patterns
5. **Documentation**: Complex patterns without explanatory comments

### What NOT to Flag

1. **Custom Sanity Integration**: We intentionally don't use `hydrogen-sanity` package
2. **Manual Environment Detection**: Oxygen-specific patterns are intentional
3. **Detailed GROQ Comments**: Complex queries need extensive documentation
4. **TypeScript Strictness**: Enhanced strict mode is intentional

### Pattern Recognition

#### ✅ Correct Patterns

```typescript
// React Router v7 loader pattern
export async function loader({ context }: Route.LoaderArgs) {
  const client = createSanityClient(context.env);
  return await sanityServerQuery(client, GROQ_QUERY);
}

// Hybrid styling approach - Radix for layout, custom for interactions
import { Container, Flex, Card } from '@radix-ui/themes';
import Button from '~/components/Button/Button';

<Container size="4">
  <Flex direction="column" gap="4">
    <Card>
      <Button appearance="dark" variant="solid" label="Custom Button" />
    </Card>
  </Flex>
</Container>

// Safe environment detection
const isClient = typeof window !== 'undefined';
const projectId = env?.SANITY_PROJECT_ID ||
  (isClient ? window.ENV?.SANITY_PROJECT_ID : process.env.SANITY_PROJECT_ID);

// Type-safe error handling
throw new SanityError('Helpful message', 500, query);
```

#### ❌ Patterns to Flag

```typescript
// Next.js patterns (wrong for this project)
export async function getServerSideProps() { }

// Using Radix interactive components (should use custom)
import { Button, Text, Heading } from '@radix-ui/themes'; // ❌ Wrong
<Button>Click me</Button> // ❌ Should use custom Button

// Unsafe global access
window.localStorage.setItem() // Should check availability first

// Missing types
function query(params: any): any { } // Should have proper interfaces
```

## Documentation Standards

### GROQ Query Comments

Complex GROQ patterns should have explanatory comments:

```groq
// GROQ conditional syntax: _type == "reference" => @->{...}
// IF the item is a reference type, THEN resolve it (@->) and return these fields
_type == "reference" => @->{
  title,
  "url": "/pages/" + slug.current  // Build URL from referenced page's slug
}
```

### Function Documentation

Public functions need JSDoc:

```typescript
/**
 * Create type-safe Sanity client for server-side queries
 *
 * @param env - Environment variables with proper typing
 * @param options - Optional client configuration overrides
 * @returns Configured Sanity client instance
 */
```

## Review Guidelines

### Priority Issues (Flag These)

1. Security: Unsafe environment variable access
2. Type Safety: Missing interfaces, `any` usage
3. Framework Compatibility: Wrong patterns for React Router v7
4. Performance: Missing error handling, inefficient queries
5. Documentation: Complex code without explanatory comments

### Low Priority (Don't Flag These)

1. Code organization preferences
2. Minor naming variations (if consistent within file)
3. Documentation style variations (if comprehensive)
4. Technology choices that are intentionally different from common patterns

### Specific to This Project

#### Environment Variable Access

- ✅ `typeof window !== 'undefined' ? window.ENV?.FOO : process.env.FOO`
- ❌ `window.ENV.FOO` or direct `process.env.FOO` without checks

#### React Router v7 Patterns

- ✅ `export async function loader({ context }: Route.LoaderArgs)`
- ❌ `export async function getServerSideProps()`

#### Sanity Integration

- ✅ Custom `@sanity/client` integration with our utilities
- ❌ Suggesting `hydrogen-sanity` package (known incompatible)

#### TypeScript Quality

- ✅ Strict interfaces, explicit return types, proper error classes
- ❌ `any` types, implicit returns, generic Error usage

## Success Metrics

Good code reviews should result in:

- Catching real compatibility issues (framework mismatches)
- Identifying type safety problems
- Flagging security concerns (unsafe environment access)
- Noting missing documentation for complex patterns

Avoid flagging:

- Intentional architectural decisions documented in this file
- Style preferences that don't affect functionality
- Technology choices that are project-appropriate

---

**Last Updated**: Based on React Router v7.6.0, Hydrogen 2025.5.0, and project patterns established in this PR.
