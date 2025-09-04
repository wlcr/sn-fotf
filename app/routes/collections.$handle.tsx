import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

// Sanity integration
import {collectionPageQuery} from 'studio/queries';
import PageBuilder from '~/components/sanity/PageBuilder';
import {CollectionPage} from '~/studio/sanity.types';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';

// SEO integration
import {
  generateCollectionMetaTags,
  seoMetaTagsToRemixMeta,
  pageHasNonIndexableCollections,
} from '~/lib/seo';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/studio/sanity.types';

export const meta: MetaFunction<typeof loader> = ({data}) => {
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
    },
  );

  // Check if page has non-indexable collection blocks
  const hasNonIndexableCollections = data.sanityCollectionPage?.pageBuilder
    ? pageHasNonIndexableCollections(data.sanityCollectionPage.pageBuilder)
    : false;

  // Override robots directive if page contains non-indexable collections
  if (hasNonIndexableCollections && metaTags.robots) {
    metaTags.robots = 'noindex, nofollow';
  }

  return seoMetaTagsToRemixMeta(metaTags);
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
    collectionPageQuery,
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

  // Step 3: Load Shopify collection and settings in parallel
  const [shopifyRes, settings] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
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
  const {collection, sanityCollectionPage} = useLoaderData<typeof loader>();

  // Use name and description overrides from Sanity if available
  const displayTitle = sanityCollectionPage?.nameOverride || collection.title;
  const displayDescription =
    sanityCollectionPage?.descriptionOverride || collection.description;

  return (
    <>
      <div className="collection">
        <h1>{displayTitle}</h1>
        {displayDescription && (
          <p className="collection-description">{displayDescription}</p>
        )}
        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName="products-grid"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>

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

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
