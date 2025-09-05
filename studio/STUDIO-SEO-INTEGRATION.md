# Studio SEO Integration Plan

This document outlines the plan to integrate our comprehensive SEO testing system directly into the Sanity Studio interface.

## 🎯 **Goal**

Enable content managers to run real SEO tests from within the Studio and see actionable reporting without needing terminal access.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Sanity Studio │────│  Studio Tool     │────│  SEO API Route  │
│   Interface     │    │  Component       │    │  /studio/seo    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  Existing       │
                                               │  seo-test.js    │
                                               │  Logic          │
                                               └─────────────────┘
```

## 📋 **Implementation Phases**

### **Phase 2A: SEO API Route**

Create an API endpoint that Studio can call to run SEO tests:

**File**: `app/routes/studio.seo.tsx`

```typescript
// Endpoint: POST /studio/seo
// Body: { url?: string, pages?: string[], strategy?: string }
// Returns: SEO test results in Studio-friendly format
```

### **Phase 2B: Studio Tool Component**

Create a custom Sanity Studio tool for SEO testing:

**File**: `studio/tools/SeoTestTool.tsx`

```typescript
// - Real-time SEO testing interface
// - Strategy preview and validation
// - Scorecard with actionable recommendations
// - Export capabilities for reports
```

### **Phase 2C: Settings Integration**

Integrate SEO testing directly into the Settings document:

**File**: `studio/schemaTypes/singletons/settings.tsx`

```typescript
// - "Test Current Settings" button
// - Real-time strategy impact preview
// - Quick validation of robots.txt
```

## 🎨 **Studio UI Components**

### **1. SEO Dashboard Tool**

A dedicated Studio tool accessible from the main navigation:

```
🔍 SEO Testing & Reports
├── 📊 Current Strategy Overview
├── 🚀 Run Full Site Test
├── 📱 Test Specific Pages
├── 📈 Historical Reports
└── ⚙️ Test Configuration
```

### **2. Settings Integration**

Within the Settings document SEO section:

```
🚨 Search Engine Visibility Controls
├── 📋 Current SEO Strategy: [Marketing Mode] ✅
├── 📊 Impact Preview: [Dynamic preview as we built]
├── 🧪 [Test Current Settings] ← NEW BUTTON
└── 📈 Last Test Results: [90/100] - 2 hours ago
```

### **3. Page-Level SEO Widgets**

For individual pages/products:

```
📄 Page SEO Status
├── Title: ✅ Optimal (52 chars)
├── Description: ⚠️ Too short (89 chars)
├── Open Graph: ✅ Complete
└── 🧪 [Test This Page]
```

## 🔧 **Technical Implementation**

### **API Route Structure**

```typescript
export async function action({request}: ActionFunctionArgs) {
  const {url, pages, testType} = await request.json();

  // Import our existing SEO test logic
  const tester = new SEOTester({baseUrl: url});
  const results = await tester.runTests(pages);

  // Format for Studio consumption
  return json({
    score: calculateOverallScore(results),
    categories: formatCategoryResults(results),
    recommendations: generateRecommendations(results),
    timestamp: new Date().toISOString(),
  });
}
```

### **Studio Tool Component**

```typescript
export default function SeoTestTool() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    const response = await fetch('/studio/seo', {
      method: 'POST',
      body: JSON.stringify({url: 'https://friends.sierranevada.com'})
    });
    const data = await response.json();
    setResults(data);
    setIsLoading(false);
  };

  return (
    <Card>
      <SeoScorecard results={results} />
      <Button onClick={runTest} disabled={isLoading}>
        {isLoading ? 'Running Tests...' : 'Run SEO Test'}
      </Button>
    </Card>
  );
}
```

## 📊 **SEO Scorecard Design**

### **Visual Score Display**

```
┌─────────────────────────────────────┐
│  🎯 Overall SEO Score: 87/100      │
│  ████████████████████░░░            │
│                                     │
│  📊 Category Breakdown:             │
│  ✅ Meta Tags & Titles    92/100    │
│  ✅ Open Graph & Social   88/100    │
│  ⚠️  Structured Data      75/100    │
│  ✅ Performance & Tech    95/100    │
│  ✅ Members-Only Features 100/100   │
└─────────────────────────────────────┘
```

### **Actionable Recommendations**

```
💡 Recommendations to improve your score:

🔧 Structured Data (25 points available)
  • Add Product schema to product pages
  • Include Organization schema on homepage

⚡ Performance (5 points available)
  • Enable compression on CSS files
  • Add cache headers to static assets

🎯 Next Actions:
  1. Test individual product pages
  2. Review robots.txt strategy
  3. Check mobile performance
```

## 🚦 **User Experience Flow**

### **Content Manager Workflow**

1. **Navigate to SEO tool** in Studio sidebar
2. **See current strategy overview** and last test results
3. **Click "Run Full Test"** to test live site
4. **Review scorecard** with specific scores and recommendations
5. **Test changes** by adjusting settings and re-running
6. **Export report** for stakeholders/developers

### **Developer Workflow**

1. **Make SEO implementation changes** in code
2. **Test locally** using existing npm scripts
3. **Deploy changes** to staging/production
4. **Validate in Studio** that changes improved scores
5. **Monitor ongoing** SEO health through Studio

## 🔐 **Security & Performance**

### **Rate Limiting**

- Limit Studio SEO tests to prevent abuse
- Cache results for 5-10 minutes to avoid redundant testing
- Queue long-running tests with progress indicators

### **Authentication**

- Only allow SEO testing for authenticated Studio users
- Consider IP restrictions for production testing
- Log test runs for audit trail

### **Error Handling**

- Graceful degradation when site is unreachable
- Clear error messages for common issues (DNS, SSL, etc.)
- Fallback to cached results when tests fail

## 📈 **Future Enhancements**

### **Advanced Features**

- **Historical tracking** - Chart SEO scores over time
- **Automated testing** - Weekly scheduled tests with email reports
- **Competitive analysis** - Compare against competitor sites
- **Page-specific testing** - Test individual products/collections
- **A/B testing** - Compare different SEO strategies

### **Integration Opportunities**

- **Shopify integration** - Pull product performance data
- **Google Analytics** - Show correlation between SEO and traffic
- **Search Console** - Import real search performance data
- **Slack notifications** - Alert team to SEO score changes

## 🎯 **Success Metrics**

### **For Content Managers**

- ✅ Can run SEO tests without developer help
- ✅ Understand impact of their content decisions
- ✅ Improve SEO scores over time
- ✅ Export reports for stakeholders

### **For Developers**

- ✅ Catch SEO regressions before they go live
- ✅ Validate that changes improve actual SEO
- ✅ Maintain high SEO standards automatically
- ✅ Spend less time on manual SEO testing

## 🚀 **Next Steps**

1. **Create SEO API route** (`app/routes/studio.seo.tsx`)
2. **Build basic Studio tool** with test runner
3. **Integrate scorecard display** with our existing test logic
4. **Add "Test Settings" button** to Settings document
5. **Polish UI/UX** and add error handling
6. **Document usage** for content managers
7. **Deploy and iterate** based on feedback

This integration will make SEO testing accessible to content managers while ensuring our technical implementation stays solid and reliable.
