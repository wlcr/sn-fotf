# Migration Plan: Rubato Wines → SN - Friends of the Family

## ✅ Components to Migrate

### Core Utilities
- [ ] `~/lib/utils.ts` - General utility functions
- [ ] `~/lib/const.ts` - Constants and configurations
- [ ] Error handling improvements
- [ ] TypeScript type definitions

### Layout & Navigation
- [ ] Enhanced header/navigation components
- [ ] Footer improvements
- [ ] Layout optimizations
- [ ] Mobile menu enhancements

### Cart & Commerce
- [ ] Cart functionality improvements
- [ ] Enhanced cart components
- [ ] Checkout optimizations
- [ ] Cart state management

### Product & Collection Pages
- [ ] Product detail page enhancements (excluding homepage-specific components)
- [ ] Collection page improvements
- [ ] Product filtering/sorting
- [ ] Product image galleries
- [ ] Product variants handling

### UI Components
- [ ] Button components
- [ ] Form components
- [ ] Modal/dialog components
- [ ] Loading states
- [ ] Error boundaries

### Styling & Assets
- [ ] CSS modules and styling improvements
- [ ] Responsive design enhancements
- [ ] Typography improvements
- [ ] Color schemes (adapted for SN brand)

### Performance & SEO
- [ ] SEO optimizations
- [ ] Performance improvements
- [ ] Analytics setup (Klaviyo integration)
- [ ] Structured data

## ❌ Components to Exclude

### Wine Club Features
- `~/lib/features/wineClubFeature.ts`
- `~/components/WineClubTemplate.tsx`
- Vinoshipper integration components
- Wine club specific routes

### Homepage Specific
- Homepage hero components
- Homepage product grids
- Homepage marketing sections
- Homepage-specific queries

### Metafields System
- Metafields utilities
- Metafields-based content management
- Shop metafields configuration

### Account Management
- Custom account pages
- Account components
- Order history components
- Profile management components
- Address management components
- **Note**: Will use native Shopify account pages (unstyled)

## 🔄 Adaptations Needed

### CMS Integration
- Replace metafields with Sanity CMS integration
- Update content fetching logic
- Adapt page templates for Sanity content

### Branding
- Update color schemes for Sierra Nevada
- Adapt typography to match SN brand
- Update logos and brand assets

### Members-Only Features
- Add authentication requirements
- Implement member verification
- Add member-only content sections

### Account Integration
- Configure navigation to native Shopify account pages
- Handle member authentication flow on the storefront
- Accept that account pages will have different styling

## 📋 Next Steps

1. Start with core utilities and layout components
2. Migrate cart and commerce functionality  
3. Adapt product/collection pages
4. Configure native Shopify account page navigation
5. Add Sanity CMS integration
6. Apply Sierra Nevada branding
7. Implement members-only features

## Notes

- All migrations should maintain the improved CSP configuration
- Update dependencies as needed
- Test thoroughly in the new environment
- Maintain TypeScript strict mode
- Keep performance optimizations
- Account pages will redirect to Shopify's domain (no custom styling possible)
