# Documentation - Sierra Nevada Friends of the Family

**Essential Documentation for Developers**

## 📚 Core Documentation

- **[📖 Project README](../README.md)** - Start here: Overview, setup, and quick start
- **[🏗️ Sanity CMS Guide](./SANITY_GUIDE.md)** - Complete CMS integration and content setup
- **[🔍 SEO Implementation](./SEO_GUIDE.md)** - SEO features, testing, and optimization
- **[🤖 AI Development](./AI_DEVELOPMENT.md)** - AI-assisted development workflow
- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

## 🎯 Feature Guides

- **[Search Implementation](../guides/search/)** - Search functionality
- **[Predictive Search](../guides/predictiveSearch/)** - Real-time search features

## 🚀 Quick Start

1. **Read [main README](../README.md)** for project overview and initial setup
2. **Follow environment setup** with `shopify hydrogen env pull`
3. **Start development**: `npm run dev`
4. **Access embedded Studio**: http://localhost:3000/studio

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start app + embedded Studio
npm run quality-check    # TypeScript + ESLint validation

# Testing
npm run seo:test         # Full SEO testing suite
npm run seo:test:local   # Test local development

# Code generation
npm run codegen          # Shopify GraphQL types
npm run sanity:codegen   # Sanity CMS types
```

---

**Technology Stack**: React Router v7 + Hydrogen 2025.5.0 + Sanity CMS + Oxygen deployment

_Everything you need is in these 5 core docs. No hunting required._
