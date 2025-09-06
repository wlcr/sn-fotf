# Rubato Wines Reference - Migration Patterns & Components

This document captures proven patterns, architectural decisions, and key components from the Rubato Wines project that should be migrated to the Sierra Nevada - Friends of the Family storefront.

## 🎯 **Project Context**

**Source**: Rubato Wines (Shopify Hydrogen storefront for wine retailer)
**Target**: Sierra Nevada - Friends of the Family (members-only brewery storefront)
**Migration Goal**: Leverage proven patterns while adapting for brewery context and member-only functionality

---

## 🚨 **CRITICAL: Data Source Migration**

### **⚠️ Data Structure Requirements**

When migrating components from Rubato Wines to this project:

**❌ DO NOT assume Shopify data structures**

- Rubato used Shopify metafields and native Shopify data
- This project uses **Sanity CMS as the primary data source**
- Data structures will **NOT be one-to-one** matches

**✅ MUST align with Sanity schemas**

- All migrated components must consume **Sanity CMS data**
- Review existing Sanity schema types in `studio/schemaTypes/`
- Update Sanity schemas as needed to support migrated components
- Use TypeScript types generated from Sanity schemas

**🔄 Migration Process for Data-Driven Components**

1. **Identify data requirements** of the Rubato component
2. **Map to existing Sanity schemas** or create new ones
3. **Update Sanity schema** if additional fields are needed
4. **Regenerate TypeScript types** with `npm run codegen:sanity`
5. **Adapt component** to use Sanity data structure
6. **Update queries** to use GROQ instead of GraphQL

---

## ✅ **Core Components to Migrate**

### **1. Layout Components**

- [ ] **Header Component**
  - **Data Source**: Sanity `header` singleton + `settings`
  - **Rubato used**: Shopify shop data + metafields
  - **Needs**: Navigation links, logo, member auth state
- [ ] **Footer Component**
  - **Data Source**: Sanity `footer` singleton + `settings`
  - **Rubato used**: Shopify shop data + static links
  - **Needs**: Brand info, legal pages, social links

- [ ] **Layout Wrapper**
  - **Data Source**: Sanity `settings` for global configuration
  - **Rubato used**: Static configuration + Shopify policies
  - **Needs**: Consistent page structure and spacing

### **2. Cart System**

- [ ] **Cart Drawer/Aside** - Slide-out cart with overlay
- [ ] **Cart Component** - Cart line items, quantity controls
- [ ] **Cart Summary** - Totals, discounts, checkout CTA
- [ ] **Cart State Management** - Add/remove/update items

> **Note**: Cart components still use **Shopify Cart API** for commerce data, but UI content (messaging, CTAs, etc.) should come from **Sanity settings**.

### **3. Layout CSS Class System**

- [ ] **Container Classes** - Consistent max-width and centering
- [ ] **Spacing Utilities** - Consistent padding/margin patterns
- [ ] **Grid Layouts** - Product grids, collection grids
- [ ] **Responsive Breakpoints** - Mobile-first responsive classes

---

## 🗄️ **Data Migration Strategy**

### **1. Content Components (Sanity-driven)**

```typescript
// Example: Header component data mapping

// Rubato Wines (Shopify metafields)
interface RubatoHeaderData {
  shop: {
    name: string;
    primaryDomain: {url: string};
    brand: {logo: {image: {url: string}}};
  };
  menu: {items: ShopifyMenuItem[]};
}

// SN-FOTF (Sanity CMS)
interface SanityHeaderData {
  header: {
    logo?: SanityImage;
    navigation?: NavigationItem[];
  };
  settings: {
    siteName: string;
    siteUrl: string;
  };
}
```

### **2. Schema Alignment Process**

For each migrated component:

1. **Document Rubato data requirements**:

   ```typescript
   // What data did the Rubato component need?
   interface RubatoComponentData {
     // List all data fields the component consumed
   }
   ```

2. **Review existing Sanity schemas**:

   ```bash
   # Check existing schemas
   ls studio/schemaTypes/
   # Review generated types
   cat studio/sanity.types.ts
   ```

3. **Identify schema gaps**:

   ```typescript
   // What's missing in current Sanity schemas?
   interface MissingSanityFields {
     // Fields needed but not yet in Sanity
   }
   ```

4. **Update Sanity schemas as needed**:

   ```typescript
   // Add new fields to existing schemas or create new ones
   // in studio/schemaTypes/
   ```

5. **Regenerate types and update component**:
   ```bash
   npm run codegen:sanity
   ```

### **3. Query Pattern Migration**

```typescript
// Rubato Wines (Shopify GraphQL)
const RUBATO_QUERY = `
  query ShopInfo {
    shop {
      name
      primaryDomain { url }
      brand { logo { image { url } } }
    }
  }
`;

// SN-FOTF (Sanity GROQ)
const SANITY_QUERY = `
  {
    "header": *[_type == "header"][0],
    "settings": *[_type == "settings"][0]
  }
`;
```

---

## 🎨 **Styling Architecture to Migrate**

### **1. Global Styles Organization**

- [ ] **Move Rubato global CSS** to this project's global styles
- [ ] **Extract component styles** from current `app.css` to CSS Modules
- [ ] **Organize global styles** into logical files (tokens, base, utilities)
- [ ] **Remove component-specific styles** from global CSS

### **2. PostCSS + Open Props Setup**

- [ ] **PostCSS configuration** from Rubato (custom media queries, preset-env)
- [ ] **Open Props integration** strategy (selective imports, brand overrides)
- [ ] **Design token system** (colors, spacing, typography, breakpoints)
- [ ] **Custom media queries** for consistent responsive design

### **3. CSS Modules + Component Pattern**

- [ ] **Component CSS Module structure** (BEM-like naming, state classes)
- [ ] **clsx utility integration** for conditional classes
- [ ] **Component composition patterns** (variant props, size props, state props)
- [ ] **TypeScript prop interfaces** for styling props

---

## 🔧 **Tooling & Dependencies to Migrate**

### **1. SVG Icon System**

- [ ] **vite-plugin-svgr setup** for SVG-as-React-components
- [ ] **Icon component library** with consistent sizing and styling
- [ ] **Icon CSS module patterns** for reusable icon styles
- [ ] **TypeScript integration** for SVG imports

### **2. PostCSS Pipeline**

- [ ] **postcss-import** - CSS file importing
- [ ] **postcss-custom-media** - Custom breakpoint definitions
- [ ] **postcss-preset-env** - Modern CSS feature support
- [ ] **postcss-pxtorem** - Automatic rem conversion for better accessibility
- [ ] **@csstools/postcss-global-data** - Global custom media queries

### **3. Utility Libraries**

- [ ] **clsx** - Conditional class name utility
- [ ] **open-props** - Design token system
- [ ] Additional UI utilities as needed

---

## 🏗 **Architecture Patterns to Migrate**

### **1. Component Structure**

```
app/components/
├── Header/
│   ├── Header.tsx           # Uses Sanity data
│   ├── Header.module.css
│   └── index.ts
├── Footer/
│   ├── Footer.tsx           # Uses Sanity data
│   ├── Footer.module.css
│   └── index.ts
├── Cart/
│   ├── Cart.tsx             # Shopify Cart API + Sanity UI content
│   ├── CartDrawer.tsx
│   ├── CartSummary.tsx
│   ├── Cart.module.css
│   └── index.ts
```

### **2. Layout Classes Pattern**

- [ ] **Container system** - `.container`, `.container-narrow`, `.container-wide`
- [ ] **Spacing system** - `.section-padding`, `.content-spacing`
- [ ] **Grid utilities** - `.grid-products`, `.grid-collections`
- [ ] **Responsive utilities** - Consistent breakpoint usage

### **3. Component API Patterns**

```typescript
// Standard component prop patterns from Rubato
// BUT data comes from Sanity, not Shopify
interface ComponentProps {
  data: SanityComponentData;    # Sanity data instead of Shopify
  className?: string;           # Allow style overrides
  children?: ReactNode;         # Composition pattern
  variant?: 'primary' | 'secondary'; # Style variants
  size?: 'small' | 'medium' | 'large'; # Size variants
  isActive?: boolean;           # State-based styling
  isDisabled?: boolean;         # Accessibility states
}
```

---

## 🎯 **Brand Adaptations Needed**

### **1. Visual Identity**

- [ ] **Color palette** - Replace wine colors with Sierra Nevada brewery colors
- [ ] **Typography** - Adapt fonts to match SN brand guidelines
- [ ] **Logo integration** - Sierra Nevada branding in header/footer
- [ ] **Photography style** - Brewery/beer imagery vs. wine imagery

### **2. Content Adaptations**

- [ ] **Navigation structure** - Beer/brewery categories vs. wine categories
- [ ] **Footer links** - Brewery-specific pages (tours, history, sustainability)
- [ ] **Cart messaging** - Beer/brewery terminology
- [ ] **Member-specific elements** - "Friends of the Family" branding

### **3. Functionality Differences**

- [ ] **Age verification** - Beer vs. wine legal requirements
- [ ] **Shipping restrictions** - Different state regulations for beer
- [ ] **Product attributes** - IBU, ABV, beer styles vs. wine attributes
- [ ] **Member perks** - Brewery-specific member benefits

---

## 🚀 **Migration Priority**

### **Phase 1: Foundation** (Current)

- [x] Basic project setup and Sanity CMS integration
- [ ] Global styles migration from Rubato
- [ ] PostCSS and tooling setup
- [ ] SVG icon system setup

### **Phase 2: Schema & Data Setup**

- [ ] **Review all Rubato component data requirements**
- [ ] **Map to existing Sanity schemas**
- [ ] **Update Sanity schemas** for missing fields
- [ ] **Create new schemas** as needed for SN-specific content

### **Phase 3: Core Components**

- [ ] **Header component** with Sanity data integration
- [ ] **Footer component** with Sanity data integration
- [ ] **Layout wrapper** with Sanity settings
- [ ] **Basic cart drawer** with Sanity UI content

### **Phase 4: Cart System**

- [ ] **Full cart component** with Sanity messaging
- [ ] **Cart state management** and persistence
- [ ] **Cart summary** with brewery-specific Sanity content
- [ ] **Checkout integration** with Sanity UI strings

### **Phase 5: Polish & Optimization**

- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Members-only specific features

---

## 📊 **Success Criteria**

### **Data Integration**

- [ ] **All components use Sanity data** where appropriate
- [ ] **No hardcoded Shopify data structures** in migrated components
- [ ] **TypeScript types align** with Sanity schema
- [ ] **GROQ queries** replace GraphQL where needed

### **Component Migration**

- [ ] All major layout components migrated and branded
- [ ] Cart system fully functional with SN branding
- [ ] Consistent spacing and layout patterns applied
- [ ] CSS Modules architecture implemented

### **Styling System**

- [ ] Global styles properly organized and separated from components
- [ ] Design token system implemented with SN brand colors
- [ ] Responsive design system with consistent breakpoints
- [ ] SVG icon system with brewery-appropriate icons

### **Performance & Quality**

- [ ] No component styling in global CSS
- [ ] Type-safe component props and styling
- [ ] Consistent code patterns across all components
- [ ] Production-ready performance metrics

---

## 📝 **Notes & Considerations**

### **Key Differences from Rubato**

- **Different CMS**: Sanity CMS vs. Shopify metafields for content
- **Data structure changes**: Not one-to-one mapping from Shopify to Sanity
- **Members-only access**: Add authentication-aware components
- **Brewery context**: Beer-specific product attributes and messaging
- **Different product types**: Beer, merchandise, experiences vs. wine
- **Regulatory differences**: Beer shipping and age verification requirements

### **Technical Debt to Avoid**

- **No hardcoded Shopify data assumptions** - Always use Sanity for content
- **No mixing of global and component styles** - Keep clear separation
- **Consistent naming conventions** - Follow established patterns
- **Proper TypeScript integration** - Type all props and state
- **Accessibility from start** - Don't retrofit accessibility later

### **Schema Evolution Strategy**

- **Start with existing schemas** - Extend rather than recreate
- **Document schema changes** - Keep migration notes
- **Version schema updates** - Use Sanity's migration tools if needed
- **Test data requirements** - Ensure all component needs are met

---

This reference document will guide the migration of proven patterns from Rubato Wines while ensuring proper adaptation for Sanity CMS data structures and the Sierra Nevada brewery context with members-only functionality.
