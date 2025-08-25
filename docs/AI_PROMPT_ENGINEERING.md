# AI Prompt Engineering Guidelines

This guide helps developers craft effective prompts when working with AI assistants to generate high-quality code that passes review on the first iteration.

## Table of Contents

- [Core Principles](#core-principles)
- [Prompt Structure Templates](#prompt-structure-templates)  
- [Context Preparation](#context-preparation)
- [Quality Requirements](#quality-requirements)
- [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
- [Framework-Specific Guidelines](#framework-specific-guidelines)
- [Examples](#examples)

## Core Principles

### 1. **Specificity Over Brevity**
❌ Bad: "Create a Sanity integration"
✅ Good: "Create a Sanity CMS integration for React Router v7 + Hydrogen with TypeScript interfaces, error handling, client/server query patterns, and inline documentation"

### 2. **Context is King** 
Always provide:
- Current project architecture (React Router v7 + Hydrogen)
- Existing patterns and naming conventions
- TypeScript requirements and strictness level
- Platform constraints (browser/server compatibility)
- Performance considerations

### 3. **Documentation-First Approach**
❌ Bad: "Generate the code"
✅ Good: "Generate the code with comprehensive JSDoc, inline comments explaining complex patterns, and usage examples"

### 4. **Error Handling from Start**
❌ Bad: "Create a utility function"  
✅ Good: "Create a utility function with proper error handling, input validation, graceful fallbacks, and helpful error messages"

## Prompt Structure Templates

### Template 1: New Feature/Integration

```
CONTEXT:
- Project: React Router v7 + Hydrogen (Shopify)
- TypeScript: Strict mode enabled
- Architecture: [describe current patterns]
- Dependencies: [list relevant packages]

TASK: 
Create [specific feature] that:
1. [Primary functionality]
2. [Secondary requirements]  
3. [Integration points]

REQUIREMENTS:
- TypeScript: Use proper interfaces, no `any` types
- Error Handling: Comprehensive with helpful messages
- Documentation: JSDoc + inline comments for complex logic
- Compatibility: Works in browser + server environments
- Testing: Include edge case considerations
- Performance: [specific performance needs]

PATTERNS TO FOLLOW:
- Naming: [show existing naming pattern]
- Architecture: [show existing architectural pattern]
- Import style: [show existing import style]

OUTPUT REQUIREMENTS:
- Complete implementation with types
- Usage examples
- Integration instructions
- Explanation of design decisions
```

### Template 2: Bug Fix/Refactor

```
PROBLEM:
[Detailed description of the issue]

CURRENT CODE:
```[language]
[paste current code]
```

CONSTRAINTS:
- Cannot break existing API
- Must maintain performance characteristics
- Follow existing patterns in codebase

FIX REQUIREMENTS:
- Address root cause, not just symptoms
- Add prevention mechanisms (validation, types)
- Include tests for the bug scenario
- Document why the bug occurred

CONTEXT:
[Relevant codebase patterns and constraints]
```

### Template 3: Code Review Improvements

```
REVIEW FEEDBACK:
[Paste specific feedback from code review]

CURRENT IMPLEMENTATION:
```[language]
[paste current code]
```

IMPROVEMENT REQUIREMENTS:
- Address each point from review feedback
- Maintain existing functionality
- Follow project's coding standards
- Add documentation where requested
- Improve type safety
- Enhanced error handling

CODEBASE CONTEXT:
[Show existing patterns that should be followed]
```

## Context Preparation

### Before Writing Prompts

1. **Gather Project Context**
   ```bash
   # Show project structure
   tree -L 3 -I node_modules
   
   # Show existing patterns
   grep -r "interface.*{" app/lib/ | head -5
   grep -r "export.*function" app/lib/ | head -5
   ```

2. **Identify Existing Patterns**
   - How are TypeScript interfaces defined?
   - What error handling patterns are used?
   - How are utilities documented?
   - What naming conventions exist?

3. **Check Dependencies & Versions**
   ```bash
   # Show relevant package versions
   npm list react-router @shopify/hydrogen
   ```

### Context Variables to Include

```markdown
**Project Stack:**
- React Router: 7.6.0
- Hydrogen: 2025.5.0
- TypeScript: 5.2.2 (strict mode)
- Environment: Browser + Server (Oxygen)

**Existing Patterns:**
- Error handling: Custom error classes with helpful messages
- Type safety: Strict interfaces, no `any` types
- Documentation: JSDoc + inline comments for complex logic
- Naming: camelCase for functions, PascalCase for interfaces
- Imports: Type imports using `import type`

**Platform Constraints:**
- Must work in browser and server environments
- Safe environment variable access
- No direct global access (window, document, etc.)
```

## Quality Requirements

### Always Include in Prompts

1. **Type Safety**
   ```
   - Create proper TypeScript interfaces for all data structures
   - No `any` types unless absolutely necessary (with justification)
   - Use generic types for reusable utilities
   - Explicit return types for public functions
   ```

2. **Error Handling**  
   ```
   - Validate all inputs
   - Handle edge cases (null, undefined, empty arrays)
   - Provide helpful error messages
   - Use custom error classes where appropriate
   - Graceful fallbacks for non-critical failures
   ```

3. **Documentation**
   ```
   - JSDoc for all public functions
   - Inline comments explaining complex logic
   - Usage examples for non-trivial utilities
   - Document why, not just what
   ```

4. **Cross-Platform Compatibility**
   ```
   - Safe environment detection patterns
   - No direct global variable access
   - Proper browser API availability checks
   - Server/client environment handling
   ```

## Common Pitfalls to Avoid

### ❌ Vague Requirements Lead to Generic Solutions
```
Bad: "Create a data fetching utility"
Result: Generic fetch wrapper that doesn't fit project needs
```

### ❌ Missing Framework Context
```
Bad: "Create React Router routes" 
Result: Routes using old Remix patterns instead of v7 patterns
```

### ❌ Forgetting Platform Constraints
```
Bad: "Create a storage utility"
Result: Direct localStorage usage without availability checks
```

### ❌ No Error Handling Guidance
```
Bad: "Create an API client"
Result: Basic fetch calls with no error handling or validation
```

### ❌ Documentation as Afterthought
```
Bad: "Create utility functions"
Result: Code without comments that needs documentation review rounds
```

## Framework-Specific Guidelines

### React Router v7 + Hydrogen

```markdown
**Always Specify:**
- Use React Router v7 patterns (not Remix or Next.js)
- Hydrogen caching strategies (CacheLong, CacheShort, etc.)
- Proper loader/clientLoader patterns
- Type imports from 'react-router' package
- Shopify Storefront API patterns

**Example Context:**
```typescript
// Show existing Route type usage
import type { Route } from './+types/example';

export async function loader({ context }: Route.LoaderArgs) {
  // Existing pattern
}
```

### Sanity CMS Integration

```markdown
**Always Specify:**
- GROQ query patterns with inline comments
- Type-safe Sanity client configuration
- Environment variable access patterns
- Image URL optimization requirements
- Preview mode handling requirements

**Example Context:**
```typescript
// Show existing GROQ patterns
const EXAMPLE_QUERY = `
  // Comment explaining the pattern
  *[_type == "example"]{
    field1,
    reference->{ field2 } // Explain reference resolution
  }
`;
```

## Examples

### Example 1: High-Quality Integration Prompt

```
CONTEXT:
- Project: React Router v7 + Hydrogen e-commerce site
- TypeScript: Strict mode, no `any` types allowed
- Environment: Browser + Server (Shopify Oxygen)
- Existing pattern: Utilities in app/lib/ with comprehensive error handling

TASK:
Create a type-safe email validation utility that integrates with our forms

REQUIREMENTS:
- TypeScript: Strict interface for validation result
- Validation: Email format, common domain checks, length limits  
- Error Handling: Detailed validation failure reasons
- Performance: Efficient for real-time validation
- Documentation: JSDoc + usage examples
- Testing: Consider edge cases (unicode, unusual formats)

INTEGRATION:
- Must work with existing form patterns
- Compatible with React Router form actions
- Follows project's utility naming conventions

EXISTING PATTERNS:
```typescript
// Show existing validation utility structure
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
```

OUTPUT REQUIREMENTS:
- Complete TypeScript implementation
- Interface definitions
- Usage examples for forms
- JSDoc documentation
- Explanation of validation rules chosen
```

### Example 2: Code Review Fix Prompt

```
REVIEW FEEDBACK:
"The GROQ query syntax is complex and difficult to understand. Add inline comments explaining the reference resolution pattern."

CURRENT CODE:
```typescript
NAVIGATION: `*[_type == "navigation"][0]{
  mainNavigation[] {
    _type == "reference" => @->{
      title,
      "url": "/pages/" + slug.current
    }
  }
}`
```

IMPROVEMENT REQUIREMENTS:
- Add detailed inline comments explaining GROQ syntax
- Explain the @-> reference resolution operator
- Document the conditional pattern logic
- Make it accessible to developers unfamiliar with GROQ
- Maintain the same functionality

CONTEXT:
This is part of a Sanity CMS integration where navigation items can be either direct URLs or references to page documents. The query needs to handle both cases and build appropriate URLs.
```

## Testing Your Prompts

### Before Submitting to AI

1. **Completeness Check**
   - [ ] Project context provided?
   - [ ] Existing patterns shown?
   - [ ] Quality requirements specified?
   - [ ] Framework version specified?
   - [ ] Error handling requirements included?

2. **Specificity Check**
   - [ ] Clear, specific task description?
   - [ ] Expected output format defined?
   - [ ] Integration points identified?
   - [ ] Edge cases considered?

3. **Context Validation**
   - [ ] Showed relevant existing code?
   - [ ] Explained architectural constraints?
   - [ ] Provided naming convention examples?
   - [ ] Specified TypeScript requirements?

## Success Metrics

Good prompts should result in code that:

- ✅ Passes TypeScript compilation without errors
- ✅ Follows existing project patterns
- ✅ Includes comprehensive documentation
- ✅ Handles errors gracefully
- ✅ Works across deployment environments
- ✅ Passes code review on first submission

## Continuous Improvement

### After Each AI Interaction

1. **Review the Output Quality**
   - What worked well?
   - What needed clarification?
   - Which requirements were missed?

2. **Refine Your Prompting**
   - Add missing context to your templates
   - Improve requirement specifications
   - Update examples with successful patterns

3. **Document Learnings**
   - Update this guide with new insights
   - Share effective prompt patterns with team
   - Build a library of successful prompt templates

---

**Remember:** The goal is to get production-ready code on the first attempt. Invest time in crafting detailed, context-rich prompts to avoid multiple review cycles.
