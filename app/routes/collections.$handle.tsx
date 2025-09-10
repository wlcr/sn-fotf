import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import CollectionQuery from '~/graphql/queries/CollectionQuery';
import CollectionProductsGrid from '~/components/CollectionProductsGrid/CollectionProductsGrid';

// Sanity integration
import {COLLECTION_PAGE_QUERY} from '~/lib/sanity/queries';
// import PageBuilder from '~/components/sanity/PageBuilder';
import {CollectionPage} from '~/types/sanity';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';

// SEO integration
import {
  generateCollectionMetaTags,
  generateComprehensiveSEOTags,
  pageHasNonIndexableCollections,
} from '~/lib/seo';
import {shouldNoIndex} from '~/lib/seo/routes';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/types/sanity';

// Structured data integration
import {
  generateSiteStructuredData,
  generateBreadcrumbData,
  combineStructuredData,
} from '~/lib/seo/structured-data';
import StructuredData from '~/components/StructuredData';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  if (!data?.collection) {
    return [{title: 'Collection Not Found'}];
  }

  // Generate comprehensive SEO meta tags combining Shopify + Sanity data
  const metaTags = generateCollectionMetaTags(
    data.settings,
    data.sanityCollectionPage,
    {
      title: data.collection.title,
      description: data.collection.description,
      handle: data.collection.handle,
      image: data.collection.image?.url,
    },
    {
      name: data.shopData?.name,
      primaryDomain: data.shopData?.primaryDomain,
    },
  );

  // Check if page has non-indexable collection blocks
  const hasNonIndexableCollections = data.sanityCollectionPage?.pageBuilder
    ? pageHasNonIndexableCollections(data.sanityCollectionPage.pageBuilder)
    : false;

  // Check route-based SEO rules
  const routeShouldNoIndex = shouldNoIndex(location.pathname, data.settings);

  // Override robots directive if page contains non-indexable collections or route rules apply
  if ((hasNonIndexableCollections || routeShouldNoIndex) && metaTags.robots) {
    metaTags.robots = 'noindex, nofollow';
  }

  // Generate comprehensive meta tags with enhanced Open Graph and Twitter Cards
  const enhancedMetaTags = {
    ...metaTags,
    type: 'website' as const,
    image: data.collection.image?.url,
    keywords: [
      data.collection.title,
      'collection',
      'Sierra Nevada',
      'brewery products',
    ]
      .filter(Boolean)
      .slice(0, 10),
  };

  return generateComprehensiveSEOTags(enhancedMetaTags, data.settings, {
    name: data.shopData?.name,
    primaryDomain: data.shopData?.primaryDomain,
    brand: data.shopData?.brand,
  });
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // Create Sanity client for potential CollectionPage lookup
  const sanityClient = createSanityClient(context.env);

  // Strategy: Try to find Sanity CollectionPage first, then get Shopify collection
  // If no CollectionPage exists, just load Shopify collection directly

  // Step 1: Try to load Sanity CollectionPage using URL handle
  const sanityCollectionPage = await sanityServerQuery<CollectionPage | null>(
    sanityClient,
    COLLECTION_PAGE_QUERY,
    {handle},
    {
      displayName: 'CollectionPage Content',
      env: context.env,
    },
  ).catch((error) => {
    // Log Sanity query errors for debugging, but don't fail the page
    console.warn(
      'Failed to load CollectionPage from Sanity:',
      error instanceof Error ? error.message : String(error),
    );
    return null;
  });

  // Step 2: Determine which collection handle to use for Shopify query
  let collectionHandle = handle;
  if (sanityCollectionPage?.collectionHandle) {
    // If Sanity CollectionPage exists, use its collectionHandle for Shopify
    collectionHandle = sanityCollectionPage.collectionHandle;
  }

  // Step 3: Load Shopify collection, settings, and shop data in parallel
  // Use CollectionQuery from PR #11
  const [shopifyRes, settings, shopData] = await Promise.all([
    storefront.query(CollectionQuery, {
      variables: {handle: collectionHandle, ...paginationVariables},
    }),
    // Load global settings for SEO
    sanityServerQuery<Settings | null>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Settings',
        env: context.env,
      },
    ).catch((error) => {
      // Log Settings query errors for debugging, but don't fail the page
      console.warn(
        'Failed to load Settings from Sanity:',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }),
    // Load shop data for comprehensive SEO and structured data
    storefront.query(SHOP_SEO_QUERY).catch((error) => {
      console.warn(
        'Failed to load shop data for SEO:',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }),
  ]);

  const collection = shopifyRes.collection;
  if (!collection?.id) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {
    handle: collectionHandle,
    data: collection,
  });

  return {
    collection,
    sanityCollectionPage, // May be null if no CollectionPage exists
    settings, // For SEO meta tag generation
    shopData: shopData?.shop || null, // For comprehensive SEO and structured data
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection, sanityCollectionPage, settings, shopData} =
    useLoaderData<typeof loader>();

  // Use name and description overrides from Sanity if available
  const displayTitle = sanityCollectionPage?.nameOverride || collection.title;
  const displayDescription =
    sanityCollectionPage?.descriptionOverride || collection.description;

  // Generate structured data for this collection
  const baseUrl =
    shopData?.primaryDomain?.url || 'https://friends.sierranevada.com';

  const siteStructuredData = generateSiteStructuredData(settings, shopData);
  const breadcrumbData = generateBreadcrumbData(
    [
      {name: 'Home', url: '/'},
      {name: 'Collections', url: '/collections'},
      {name: displayTitle, url: `/collections/${collection.handle}`},
    ],
    baseUrl,
  );

  const allStructuredData = combineStructuredData(
    ...siteStructuredData,
    breadcrumbData,
  );

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        data={allStructuredData}
        id="collection-structured-data"
      />

      {/* Use the new CollectionProductsGrid from PR #11 */}
      <CollectionProductsGrid collection={collection} />

      {/* Render Sanity page builder content if available */}
      {sanityCollectionPage?.pageBuilder &&
        sanityCollectionPage.pageBuilder.length > 0 && (
          <PageBuilder
            parent={{
              _id: sanityCollectionPage._id,
              _type: sanityCollectionPage._type,
            }}
            pageBuilder={sanityCollectionPage.pageBuilder}
          />
        )}
    </>
  );
}

// GraphQL query for SEO shop data
const SHOP_SEO_QUERY = `#graphql
  query ShopSEO($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
        coverImage {
          image {
            url
          }
        }
        squareLogo {
          image {
            url
          }
        }
        shortDescription
        slogan
        colors {
          primary {
            background
          }
        }
      }
    }
  }
` as const;
