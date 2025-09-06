# Pull Request Template

## Description

Brief description of what this PR accomplishes.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## AI-Assisted Development Checklist

> This section helps ensure AI-generated code meets quality standards

### AI Prompt Quality

- [ ] Used specific, detailed prompts with context about the codebase
- [ ] Specified desired code patterns, naming conventions, and architectural constraints
- [ ] Requested inline documentation and error handling from the start
- [ ] Asked for TypeScript interfaces and type safety considerations
- [ ] Included examples of existing patterns to maintain consistency

### Code Quality Review

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No `any` types without explicit justification and comments
- [ ] All imports are actually used (no unused imports)
- [ ] Function/component names match file naming patterns consistently
- [ ] Complex logic has comprehensive inline documentation
- [ ] Error handling is robust and follows project patterns

### AI Output Refinement

- [ ] Reviewed AI suggestions for platform-specific assumptions (e.g., browser vs server)
- [ ] Verified environment detection patterns work across deployment targets
- [ ] Checked that generated code follows project's architectural patterns
- [ ] Ensured generated utilities have proper input validation
- [ ] Confirmed complex patterns (like GROQ queries) are well-documented

### Documentation Standards

- [ ] Complex patterns explained with inline comments written during development
- [ ] Public functions have JSDoc with proper parameter and return type documentation
- [ ] Integration patterns include usage examples
- [ ] README or guide documentation updated if introducing new concepts
- [ ] Code comments explain _why_, not just _what_

### Cross-Environment Compatibility

- [ ] Server/client environment detection uses safe patterns
- [ ] No hardcoded platform assumptions or globals
- [ ] Environment variables accessed with proper fallbacks
- [ ] Browser APIs checked for availability before use
- [ ] Node.js specific code properly isolated

### Testing & Validation

- [ ] Code runs without errors in development environment
- [ ] Edge cases identified and handled (null/undefined, empty arrays, etc.)
- [ ] Integration points tested with actual data/APIs where possible
- [ ] Error scenarios produce helpful error messages
- [ ] Performance implications considered for large-scale usage

### Framework-Specific Checks (React Router v7 + Hydrogen + Radix UI)

- [ ] Uses correct React Router v7 patterns (not Remix or Next.js patterns)
- [ ] Hydrogen caching strategies properly implemented
- [ ] Server/client data loading patterns follow framework best practices
- [ ] Type imports use proper React Router v7 types
- [ ] Shopify-specific integrations use current API versions
- [ ] Radix UI used only for layout primitives (Container, Flex, Grid, Card)
- [ ] Custom components used for interactive/branded elements (Button, Header, etc.)
- [ ] No use of Radix Button, Text, Heading components (use custom instead)

### Component Architecture Validation

- [ ] Radix UI components used appropriately (layout only, not interactive)
- [ ] Custom components used for brand-specific elements
- [ ] No mixing of Radix interactive components with custom brand elements
- [ ] Layout components use proper Radix theme tokens (size, variant, etc.)
- [ ] Accessibility patterns maintained across both Radix and custom components

### Review-Ready Validation

- [ ] Ran all quality check scripts locally (`npm run quality-check`)
- [ ] Self-reviewed the diff for obvious issues before creating PR
- [ ] Tested the functionality end-to-end in development
- [ ] Confirmed no development artifacts (console.logs, commented code) remain
- [ ] Verified commit messages are clear and descriptive

## How to Test

Step-by-step instructions for testing this PR:

1.
2.
3.

## Screenshots (if applicable)

Add screenshots or recordings demonstrating the changes.

## Additional Notes

Any additional context, concerns, or considerations for reviewers.

---

## For Reviewers: AI-Generated Code Review Focus Areas

When reviewing AI-assisted PRs, pay special attention to:

1. **Type Safety**: Look for overly permissive types (`any`, `unknown`) without justification
2. **Error Handling**: Verify error scenarios are handled gracefully with helpful messages
3. **Platform Assumptions**: Check for hardcoded browser/server assumptions
4. **Documentation Quality**: Ensure complex patterns are explained, not just implemented
5. **Naming Consistency**: Verify naming follows project conventions consistently
6. **Framework Patterns**: Confirm AI used current framework patterns, not outdated ones
