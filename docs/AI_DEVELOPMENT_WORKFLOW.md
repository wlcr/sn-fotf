# AI-Assisted Development Workflow

This document outlines the complete workflow for using AI assistants effectively to minimize code review iterations and produce production-ready code on the first attempt.

## Quick Start Checklist

Before asking AI for code:
- [ ] Run `npm run quality-check` to ensure current code passes
- [ ] Review [AI Prompt Engineering Guidelines](./AI_PROMPT_ENGINEERING.md)
- [ ] Gather project context (existing patterns, dependencies, constraints)
- [ ] Use the [PR Template](./.github/PULL_REQUEST_TEMPLATE.md) as a quality guide

## Development Workflow

### Phase 1: Pre-Development Planning

#### 1.1 Define Requirements Clearly
```markdown
Instead of: "Add authentication"
Use: "Add JWT-based authentication for React Router v7 routes with:
- Token storage in httpOnly cookies
- Route protection middleware  
- Automatic token refresh
- TypeScript interfaces for user data
- Error handling for auth failures"
```

#### 1.2 Gather Project Context
```bash
# Show current project structure
tree -L 3 -I node_modules

# Check existing patterns
grep -r "interface.*{" app/lib/ | head -5
grep -r "export.*function" app/lib/ | head -5

# Verify dependencies
npm list react-router @shopify/hydrogen
```

#### 1.3 Identify Integration Points
- Which existing utilities will this integrate with?
- What naming conventions should be followed?
- Are there performance requirements?
- What are the error handling patterns?

### Phase 2: AI-Assisted Development

#### 2.1 Craft High-Quality Prompts

Use the templates from [AI_PROMPT_ENGINEERING.md](./AI_PROMPT_ENGINEERING.md):

**Example Effective Prompt:**
```
CONTEXT:
- Project: React Router v7 + Hydrogen e-commerce (Shopify)
- TypeScript: Strict mode, no `any` types
- Environment: Browser + Server (Oxygen edge functions)
- Existing: app/lib/sanity.ts has similar patterns

TASK:
Create a type-safe product search utility that:
1. Integrates with Shopify GraphQL API
2. Provides client-side caching with sessionStorage
3. Handles server/client environment differences
4. Includes debouncing for real-time search

REQUIREMENTS:
- TypeScript: Strict interfaces, explicit return types
- Error Handling: Network failures, empty results, invalid queries
- Performance: Debounced requests, cache invalidation
- Documentation: JSDoc with usage examples
- Compatibility: Works in both SSR and client-side contexts

EXISTING PATTERNS:
[paste relevant existing code showing patterns]

OUTPUT: Complete implementation + usage examples + integration guide
```

#### 2.2 Review AI Output Immediately

Before accepting AI output, check:
- [ ] TypeScript interfaces are properly defined
- [ ] No `any` types without justification
- [ ] Error handling covers edge cases
- [ ] Platform detection is safe (no direct global access)
- [ ] Functions have JSDoc documentation
- [ ] Complex patterns have inline comments

#### 2.3 Request Improvements Iteratively

If the output isn't perfect, use targeted improvement prompts:
```
IMPROVEMENT NEEDED:
The error handling doesn't cover network timeout scenarios.

CURRENT CODE:
[paste the problematic section]

ENHANCEMENT REQUEST:
Add timeout handling with configurable timeout duration, retry logic for failed requests, and specific error types for different failure scenarios.

CONTEXT:
This will be used in e-commerce product search where reliability is critical.
```

### Phase 3: Quality Validation

#### 3.1 Automated Quality Checks
```bash
# Run all quality checks
npm run quality-check

# Fix auto-fixable issues
npm run lint:fix

# Check types specifically
npm run type-check
```

#### 3.2 Manual Code Review

Use the PR template checklist:
- [ ] AI Prompt Quality - Were prompts specific and context-rich?
- [ ] Code Quality Review - No TypeScript errors, proper imports?
- [ ] AI Output Refinement - Platform assumptions checked?
- [ ] Documentation Standards - Complex patterns explained?
- [ ] Cross-Environment Compatibility - Safe environment detection?

#### 3.3 Integration Testing
```bash
# Test the code in development
npm run dev

# Verify it works in different contexts
# - Server-side rendering
# - Client-side hydration  
# - Error scenarios
```

### Phase 4: Pre-Commit Process

#### 4.1 Self-Review Using PR Template
Go through the full [PR Template checklist](.github/PULL_REQUEST_TEMPLATE.md) before creating the PR.

#### 4.2 Commit with Quality Checks
```bash
# The pre-commit hook will automatically run:
git add .
git commit -m "feat: add type-safe product search utility

- Shopify GraphQL integration with proper error handling
- Client-side caching with sessionStorage fallbacks  
- Server/client environment compatibility
- Debounced search with configurable timeout
- Comprehensive TypeScript interfaces and JSDoc"

# Pre-commit hook runs automatically:
# ✅ TypeScript compilation
# ✅ ESLint with auto-fix
# ✅ Prettier formatting
```

## Common AI Development Patterns

### Pattern 1: Utility Function Development

```markdown
CONTEXT: [project context]
TASK: Create [specific utility] 
REQUIREMENTS:
- TypeScript: Strict interfaces, no any
- Error Handling: Input validation, graceful failures  
- Documentation: JSDoc + usage examples
- Testing: Edge case considerations
OUTPUT: Implementation + tests + integration guide
```

### Pattern 2: Integration Development

```markdown
CONTEXT: [existing architecture]
TASK: Integrate [external service/API]
REQUIREMENTS:
- Follow existing patterns in [similar integration]
- Environment compatibility: [browser/server needs]
- Error handling: [specific failure scenarios]
- Performance: [caching, optimization needs]
OUTPUT: Complete integration + configuration + usage examples
```

### Pattern 3: Bug Fix with Prevention

```markdown
PROBLEM: [detailed bug description]
CURRENT CODE: [paste problematic code]
ROOT CAUSE: [analysis of why it happened]
FIX REQUIREMENTS:
- Address root cause
- Add prevention (validation, types, tests)
- Maintain backward compatibility
- Document the fix
OUTPUT: Fixed code + tests + prevention measures
```

## AI-Specific Quality Guidelines

### For AI Assistants: Best Practices

When working with this codebase:

1. **Always Use TypeScript Interfaces**
   ```typescript
   // ✅ Good
   interface SearchResult {
     products: Product[];
     totalCount: number;
     hasNextPage: boolean;
   }
   
   // ❌ Bad
   function search(): any
   ```

2. **Include Error Handling from Start**
   ```typescript
   // ✅ Good  
   export async function searchProducts(query: string): Promise<SearchResult> {
     try {
       if (!query.trim()) {
         throw new SearchError('Query cannot be empty', 'INVALID_INPUT');
       }
       // implementation
     } catch (error) {
       if (error instanceof SearchError) throw error;
       throw new SearchError('Search failed', 'UNKNOWN_ERROR', error);
     }
   }
   ```

3. **Safe Environment Detection**
   ```typescript
   // ✅ Good
   const isClient = typeof window !== 'undefined';
   
   // ❌ Bad  
   window.localStorage // Direct access without checking
   ```

4. **Comprehensive Documentation**
   ```typescript
   /**
    * Search products with debounced queries and caching
    * 
    * @param query - Search term (min 2 characters)
    * @param options - Search configuration options
    * @returns Promise resolving to search results
    * 
    * @example
    * ```typescript
    * const results = await searchProducts('shirts', { 
    *   debounceMs: 300,
    *   useCache: true 
    * });
    * ```
    */
   ```

## Success Metrics

### Goals for AI-Generated Code

- **First-Time PR Approval Rate**: >90%
- **TypeScript Errors**: 0 on first submission  
- **Documentation Coverage**: 100% for public APIs
- **Error Handling Coverage**: All edge cases covered
- **Cross-Platform Compatibility**: Works in all deployment environments

### Tracking Improvements

After each AI-assisted development session:

1. **Record Success Rate**
   - Did the code pass all quality checks?
   - How many review iterations were needed?
   - Which prompt patterns worked best?

2. **Update Guidelines**
   - Add successful prompt patterns to templates
   - Document new quality check discoveries  
   - Update framework-specific guidelines

3. **Share Learnings**
   - Update team documentation
   - Share effective prompting strategies
   - Build library of proven patterns

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: AI generates generic, non-project-specific code
**Solution**: Provide more context about existing patterns
```markdown
EXISTING PATTERNS:
```typescript
// Show actual code from the project
export function existingSimilarUtility() {
  // implementation that shows the pattern
}
```
```

#### Issue: TypeScript errors in AI-generated code
**Solution**: Be explicit about TypeScript requirements
```markdown
TYPESCRIPT REQUIREMENTS:
- Strict mode enabled (no any, implicit returns, etc.)
- Use exact interfaces matching existing patterns
- Explicit return types for all public functions
- Import types using `import type` syntax
```

#### Issue: Missing error handling
**Solution**: Provide error handling examples
```markdown
ERROR HANDLING PATTERN:
```typescript
try {
  // operation
} catch (error) {
  console.error('Operation failed:', error);
  throw new CustomError('Helpful message', 'ERROR_CODE', error);
}
```
```

#### Issue: Platform compatibility problems
**Solution**: Specify environment requirements clearly
```markdown
ENVIRONMENT COMPATIBILITY:
- Must work in browser and server (Oxygen edge functions)
- Use typeof checks for browser APIs
- Safe environment variable access patterns
- No direct global variable access
```

## Integration with Existing Tools

### ESLint Integration
Our ESLint config catches common AI-generated issues:
- `@typescript-eslint/no-explicit-any` - Prevents `any` usage
- `no-unused-vars` - Catches unused imports  
- `no-restricted-globals` - Prevents unsafe global access

### TypeScript Integration  
Enhanced TypeScript settings catch:
- `noImplicitAny` - Requires explicit typing
- `noUnusedLocals` - Finds unused variables
- `strictNullChecks` - Prevents null/undefined errors

### Pre-commit Hooks
Automatic quality gates:
- Type checking on all staged files
- Linting with auto-fix
- Prettier formatting
- Framework-specific pattern validation

---

## Summary

The key to successful AI-assisted development is:

1. **Invest time in quality prompts** - Specific, context-rich requests
2. **Use automated quality gates** - Catch issues before human review  
3. **Follow established patterns** - Show AI existing code conventions
4. **Document everything** - Request documentation from the start
5. **Test thoroughly** - Validate across all deployment environments

The goal is **production-ready code on first attempt** - worth the upfront investment in process and tooling.
