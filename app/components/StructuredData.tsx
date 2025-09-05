/**
 * StructuredData Component
 *
 * React component for rendering JSON-LD structured data in the document head.
 * Compatible with React Router v7 and integrates with Sanity CMS SEO controls.
 *
 * This component automatically respects Sanity global SEO settings and will
 * not render structured data if the site is set to be non-discoverable.
 */

import type {BaseStructuredData} from '~/lib/seo/structured-data';
import {structuredDataToJsonLd} from '~/lib/seo/structured-data';

interface StructuredDataProps {
  /**
   * Array of structured data objects to render as JSON-LD
   * Can be empty array if SEO controls prevent generation
   */
  data: BaseStructuredData[];

  /**
   * Optional ID for the script tag (useful for debugging)
   */
  id?: string;
}

/**
 * Renders structured data as JSON-LD script tags
 *
 * @example
 * ```tsx
 * // In a route component
 * const structuredData = generateSiteStructuredData(settings, shop);
 *
 * return (
 *   <div>
 *     <StructuredData data={structuredData} />
 *     <h1>Page Content</h1>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With product data
 * const productStructuredData = generateProductData(product, settings);
 * const breadcrumbData = generateBreadcrumbData(breadcrumbs, baseUrl);
 * const siteData = generateSiteStructuredData(settings, shop);
 *
 * const allStructuredData = combineStructuredData(
 *   ...siteData,
 *   productStructuredData,
 *   breadcrumbData
 * );
 *
 * return (
 *   <div>
 *     <StructuredData data={allStructuredData} id="product-structured-data" />
 *     <ProductDisplay product={product} />
 *   </div>
 * );
 * ```
 */
export default function StructuredData({data, id}: StructuredDataProps) {
  // Don't render anything if no structured data provided
  // This happens when Sanity SEO controls prevent generation
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((structuredData, index) => {
        // Generate unique key for each structured data object
        const key = `${structuredData['@type']}-${index}`;
        const scriptId = id ? `${id}-${index}` : `structured-data-${key}`;

        return (
          <script
            key={key}
            id={scriptId}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: structuredDataToJsonLd(structuredData),
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Hook to combine multiple structured data sources
 * Useful for components that need to merge site-wide and page-specific data
 *
 * @example
 * ```tsx
 * const {structuredData} = useStructuredData([
 *   ...generateSiteStructuredData(settings, shop),
 *   generateProductData(product, settings),
 *   generateBreadcrumbData(breadcrumbs, baseUrl)
 * ]);
 *
 * return <StructuredData data={structuredData} />;
 * ```
 */
export function useStructuredData(dataObjects: (BaseStructuredData | null)[]): {
  structuredData: BaseStructuredData[];
  hasData: boolean;
} {
  const structuredData = dataObjects.filter(
    (data): data is BaseStructuredData => data !== null,
  );

  return {
    structuredData,
    hasData: structuredData.length > 0,
  };
}

/**
 * Debug component that shows structured data in development
 * Only renders in development mode and when console debugging is enabled
 *
 * @example
 * ```tsx
 * return (
 *   <div>
 *     <StructuredData data={structuredData} />
 *     <StructuredDataDebug data={structuredData} />
 *     <PageContent />
 *   </div>
 * );
 * ```
 */
export function StructuredDataDebug({data}: {data: BaseStructuredData[]}) {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Only show if there's data to debug
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <details
      style={{
        margin: '1rem 0',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>
        📊 Structured Data Debug ({data.length} items)
      </summary>
      <div style={{marginTop: '1rem'}}>
        {data.map((item, index) => {
          // Generate better key using type and content hash if possible
          const itemKey = `debug-${item['@type']}-${(item as any).name || (item as any).url || (item as any).identifier || index}`;
          return (
            <div key={itemKey} style={{marginBottom: '1rem'}}>
              <h4 style={{margin: '0.5rem 0', color: '#0066cc'}}>
                {item['@type']} Schema
              </h4>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  maxHeight: '200px',
                }}
              >
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          );
        })}
      </div>
    </details>
  );
}

/**
 * Type guard to check if structured data is valid
 */
export function isValidStructuredData(data: any): data is BaseStructuredData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data['@context'] === 'string' &&
    typeof data['@type'] === 'string'
  );
}

/**
 * Validates an array of structured data objects
 * Useful for development debugging and testing
 */
export function validateStructuredDataArray(data: unknown[]): {
  valid: BaseStructuredData[];
  invalid: unknown[];
  errors: string[];
} {
  const valid: BaseStructuredData[] = [];
  const invalid: unknown[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    if (isValidStructuredData(item)) {
      valid.push(item);
    } else {
      invalid.push(item);
      errors.push(`Item at index ${index} is not valid structured data`);
    }
  });

  return {valid, invalid, errors};
}
