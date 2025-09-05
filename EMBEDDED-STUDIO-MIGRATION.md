# Embedded Studio Migration Plan (Sanity v4.6.0)

## 🎯 **Why Embed the Studio**

### **Current Pain Points with Separate Studio**

- ❌ CORS issues when Studio calls app APIs
- ❌ Different domains complicate authentication
- ❌ Preview functionality requires complex setup
- ❌ SEO testing requires external API calls

### **Benefits of Embedded Studio (Sanity v4 Modern Approach)**

- ✅ **Same origin** - No CORS issues for API calls
- ✅ **Shared authentication** - Studio inherits app sessions
- ✅ **Better previews** - Direct access to app routes
- ✅ **Seamless API access** - Studio can call app APIs directly
- ✅ **Single deployment** - Easier production management

## 🏗️ **Modern Sanity v4.6.0 Embedded Setup**

### **Step 1: Create Studio Route**

**File**: `app/routes/studio.$.tsx`

```typescript
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Studio} from 'sanity';
import {config} from '~/lib/sanity';
import studioConfig from '../../studio/sanity.config';

// This handles all studio routes: /studio, /studio/desk, etc.
export async function loader({request}: LoaderFunctionArgs) {
  // Optional: Add authentication check
  // const isAuthenticated = await checkStudioAuth(request);
  // if (!isAuthenticated) throw redirect('/login');

  return null; // Studio handles its own routing
}

export default function StudioPage() {
  return (
    <div style={{height: '100vh'}}>
      <Studio
        config={studioConfig}
        unstable_noAuthBoundary // Modern v4 pattern
      />
    </div>
  );
}
```

### **Step 2: Update Studio Config for Embedding**

**File**: `studio/sanity.config.ts`

```typescript
export default defineConfig({
  name: 'sn-friends-of-the-family',
  title: 'SN - Friends of the Family',

  projectId,
  dataset,
  apiVersion,

  // Remove basePath for embedded setup
  // basePath: '/studio', // DELETE THIS LINE

  plugins: [
    structureTool({structure}),
    visionTool(),
    // Add custom SEO tool
    customTool({
      name: 'seo-testing',
      title: 'SEO Testing',
      component: SeoTestingTool, // We'll create this
    }),
  ],

  // Modern preview configuration
  document: {
    productionUrl: async (prev, {document}) => {
      const baseUrl = 'https://friends.sierranevada.com';

      // Generate preview URLs for different document types
      switch (document._type) {
        case 'product':
          return `${baseUrl}/products/${document.handle}`;
        case 'collection':
          return `${baseUrl}/collections/${document.handle}`;
        case 'page':
          return `${baseUrl}/${document.slug?.current}`;
        default:
          return `${baseUrl}`;
      }
    },
  },

  // Enable modern preview features
  studio: {
    components: {
      navbar: CustomNavbar, // Add SEO status indicator
    },
  },
});
```

### **Step 3: Create SEO Testing Tool (Modern v4 Pattern)**

**File**: `studio/tools/SeoTestingTool.tsx`

```typescript
import React, {useState} from 'react';
import {Card, Button, Stack, Text, Flex} from '@sanity/ui';
import {ChartUpwardIcon} from '@sanity/icons';

interface SeoTestResult {
  score: number;
  categories: Record<string, {score: number; maxScore: number}>;
  recommendations: string[];
  timestamp: string;
}

export default function SeoTestingTool() {
  const [results, setResults] = useState<SeoTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSeoTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This works because studio is embedded - same origin!
      const response = await fetch('/studio/seo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          url: window.location.origin,
          testType: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SeoTestResult = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <ChartUpwardIcon />
          <Text size={3} weight="bold">SEO Testing & Analysis</Text>
        </Flex>

        <Text size={1}>
          Test your site's SEO implementation and get actionable recommendations.
        </Text>

        <Button
          onClick={runSeoTest}
          disabled={isLoading}
          tone="primary"
          mode="default"
          loading={isLoading}
          text={isLoading ? 'Running Tests...' : 'Run Full SEO Test'}
        />

        {error && (
          <Card tone="critical" padding={3}>
            <Text size={1}>Error: {error}</Text>
          </Card>
        )}

        {results && <SeoScorecard results={results} />}
      </Stack>
    </Card>
  );
}

// SEO Scorecard Component
function SeoScorecard({results}: {results: SeoTestResult}) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'positive';
    if (score >= 70) return 'caution';
    return 'critical';
  };

  return (
    <Card tone={getScoreColor(results.score)} padding={4}>
      <Stack space={3}>
        <Text size={4} weight="bold">
          SEO Score: {results.score}/100
        </Text>

        <Stack space={2}>
          <Text size={2} weight="bold">Category Breakdown:</Text>
          {Object.entries(results.categories).map(([category, data]) => (
            <Flex key={category} justify="space-between">
              <Text size={1}>{category}</Text>
              <Text size={1}>{data.score}/{data.maxScore}</Text>
            </Flex>
          ))}
        </Stack>

        {results.recommendations.length > 0 && (
          <Stack space={2}>
            <Text size={2} weight="bold">Recommendations:</Text>
            {results.recommendations.map((rec, index) => (
              <Text key={index} size={1}>• {rec}</Text>
            ))}
          </Stack>
        )}

        <Text size={0} muted>
          Last tested: {new Date(results.timestamp).toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}
```

### **Step 4: Create SEO API Route**

**File**: `app/routes/studio.seo.tsx`

```typescript
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {createSanityClient} from '~/lib/sanity';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';

// Import our existing SEO testing logic
import {SEOTester} from '../../scripts/seo-test.js'; // We'll need to convert this to TS

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const {url, testType = 'full'} = await request.json();

    // Get current settings from Sanity
    const sanityClient = createSanityClient(context.env);
    const settings = await sanityClient.fetch(SETTINGS_QUERY);

    // Run SEO tests using our existing logic
    const tester = new SEOTester({
      baseUrl: url || request.url.replace('/studio/seo', ''),
      verbose: false,
    });

    const results = await tester.runTests(['/', '/products', '/collections']);

    // Format results for Studio
    const overallScore = calculateOverallScore(results);
    const categoryBreakdown = formatCategoryResults(results);
    const recommendations = generateRecommendations(results, settings);

    return json({
      score: overallScore,
      categories: categoryBreakdown,
      recommendations,
      timestamp: new Date().toISOString(),
      settingsUsed: {
        seoStrategy: settings?.globalSeoControls?.seoStrategy || 'marketing',
        emergencyMode:
          settings?.globalSeoControls?.emergencyPrivateMode || false,
      },
    });
  } catch (error) {
    console.error('SEO test error:', error);
    return json(
      {error: error instanceof Error ? error.message : 'SEO test failed'},
      {status: 500},
    );
  }
}

// Helper functions
function calculateOverallScore(results: any[]): number {
  const validResults = results.filter((r) => !r.error);
  if (validResults.length === 0) return 0;

  const totalScore = validResults.reduce((sum, r) => sum + r.score, 0);
  return Math.round(totalScore / validResults.length);
}

function formatCategoryResults(
  results: any[],
): Record<string, {score: number; maxScore: number}> {
  // Extract category scores from test results
  const categories: Record<string, {scores: number[]; maxScores: number[]}> =
    {};

  results.forEach((result) => {
    if (result.tests) {
      Object.entries(result.tests).forEach(
        ([category, data]: [string, any]) => {
          if (!categories[category]) {
            categories[category] = {scores: [], maxScores: []};
          }
          categories[category].scores.push(data.score);
          categories[category].maxScores.push(data.maxScore);
        },
      );
    }
  });

  // Average the scores
  return Object.fromEntries(
    Object.entries(categories).map(([category, {scores, maxScores}]) => [
      category,
      {
        score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        maxScore: Math.round(
          maxScores.reduce((a, b) => a + b, 0) / maxScores.length,
        ),
      },
    ]),
  );
}

function generateRecommendations(results: any[], settings: any): string[] {
  const recommendations: string[] = [];

  // Analyze results and generate actionable recommendations
  const avgScore = calculateOverallScore(results);

  if (avgScore < 70) {
    recommendations.push('Focus on improving meta tags and titles');
    recommendations.push('Add missing Open Graph tags');
  }

  if (avgScore < 90) {
    recommendations.push('Optimize meta description lengths');
    recommendations.push('Add structured data to product pages');
  }

  // Strategy-specific recommendations
  if (settings?.globalSeoControls?.seoStrategy === 'private') {
    recommendations.push(
      'Consider switching to Marketing Mode for better discoverability',
    );
  }

  return recommendations;
}
```

## 🔧 **Migration Steps**

### **Step 1: Create studio route** (`app/routes/studio.$.tsx`)

### **Step 2: Update studio config** (remove `basePath`)

### **Step 3: Create SEO tool** (`studio/tools/SeoTestingTool.tsx`)

### **Step 4: Create API route** (`app/routes/studio.seo.tsx`)

### **Step 5: Update package.json Scripts**

**Current scripts that need updating:**

```json
{
  "scripts": {
    // REMOVE these separate studio scripts:
    // "studio:dev": "sanity start --port 3333",
    // "studio:build": "sanity build",
    // "studio:clean": "rm -rf .sanity node_modules/.vite node_modules/.cache && echo '🧹 Sanity cache cleared'",
    // "studio:restart": "npm run studio:clean && npm run studio:dev",

    // KEEP existing app scripts (they now serve both app + embedded studio):
    "build": "shopify hydrogen build --codegen",
    "dev": "shopify hydrogen dev --codegen", // Now serves studio at /studio
    "preview": "shopify hydrogen preview --build",

    // ADD new combined scripts:
    "studio:types": "sanity schema extract --path=./studio/schema.json --enforce-required-fields && sanity typegen generate",
    "studio:clean": "rm -rf .sanity studio/.sanity && echo '🧹 Studio cache cleared'",

    // UPDATE sanity codegen to use new script name:
    "sanity:codegen": "npm run studio:types",

    // KEEP all other scripts unchanged:
    "test": "vitest",
    "test:seo": "vitest run tests/unit/seo tests/integration/seo",
    "seo:test": "node scripts/seo-test.js"
    // ... etc
  }
}
```

**Updated development workflow:**

- `npm run dev` → Serves both app (localhost:3000) AND studio (localhost:3000/studio)
- `npm run build` → Builds both app and embedded studio
- `npm run studio:types` → Updates Sanity types (replaces old sanity:codegen)
- `npm run studio:clean` → Cleans Sanity cache only

### **Step 6: Update Environment Variables**

Since studio is embedded, update environment handling:

**.env.local changes:**

```bash
# REMOVE (no longer needed):
# SANITY_STUDIO_URL=http://localhost:3333

# UPDATE (studio now embedded):
SANITY_STUDIO_URL=http://localhost:3000/studio

# PRODUCTION:
SANITY_STUDIO_URL=https://friends.sierranevada.com/studio
```

### **Step 7: Test embedded setup locally**

### **Step 7: Directory Structure Changes**

**What stays the same:**

```
studio/
├── sanity.config.ts     ← Keep (just remove basePath)
├── schemaTypes/         ← Keep all schemas
├── structure.ts         ← Keep
└── components/          ← Keep existing components
```

**What gets added:**

```
studio/
└── tools/               ← NEW: Custom studio tools
    └── SeoTestingTool.tsx ← NEW: SEO testing interface

app/routes/
├── studio.$.tsx         ← NEW: Embedded studio route
└── studio.seo.tsx       ← NEW: SEO testing API
```

**Root sanity.config.ts:**

- Keep as-is (it just re-exports studio/sanity.config.ts)
- This maintains CLI compatibility

### **Step 8: Test embedded setup locally**

### **Step 9: Update deployment configuration**

## 🎯 **Modern Benefits This Unlocks**

### **SEO Testing Integration**

- ✅ **Real-time testing** from Studio interface
- ✅ **No CORS issues** - same origin API calls
- ✅ **Settings integration** - test current strategy impact
- ✅ **Actionable recommendations** with Studio-friendly UI

### **Preview Functionality**

- ✅ **Better preview URLs** - shared domain/session
- ✅ **Live editing** works seamlessly
- ✅ **Authentication sharing** - no separate login

### **Development Experience**

- ✅ **Single dev server** - `npm run dev` serves both
- ✅ **Shared TypeScript** types and utilities
- ✅ **Unified deployment** - single build process

This is definitely the right approach for Sanity v4.6.0!
