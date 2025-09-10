import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import type {SanityDocument} from '@sanity/client';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';

import type {Homepage, Settings} from '~/types/sanity';
// import PageBuilder from '~/components/sanity/PageBuilder';
import {HOME_QUERY, SETTINGS_QUERY} from '~/lib/sanity/queries';
// import PageSectionsBuilder from '~/components/sanity/PageSectionsBuilder';
import StyleGuide from '~/components/StyleGuide';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import Sections from '~/components/Sections';
export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  // Create Sanity client
  const sanityClient = createSanityClient(context.env);

  const [{collections}, siteSettings, homepage, customer] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Fetch Sanity site settings for global content
    sanityServerQuery<Settings>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Site Settings',
        env: context.env,
      },
    ).catch((error) => {
      console.error('Failed to load Sanity site settings:', error);
      return null; // Continue without Sanity data if it fails
    }),
    // Fetch Sanity homepage content
    sanityServerQuery<Homepage | null>(
      sanityClient,
      HOME_QUERY,
      {},
      {
        displayName: 'Homepage Content',
        env: context.env,
      },
    ).catch((error) => {
      console.error('Failed to load Sanity homepage content:', error);
      return null; // Continue without homepage data if it fails
    }),
    // Fetch customer data to determine if they can access account features
    context.customerAccount.query(CUSTOMER_DETAILS_QUERY).catch((error) => {
      console.error('error fetching customer', error);
      return null;
    }), // Preload customer data for account access
  ]);

  return {
    featuredCollection: collections.nodes[0],
    siteSettings,
    homepage,
    customer: customer?.data?.customer || null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  console.log('homepage', data.homepage);
  console.log('customer', data.customer);

  /**
   * Determine if customer is eligible to purchase (based on tags).
   *
   * Customer must be authenticated
   *
   * TODO: Connect this eligibility check to ProductForm/AddToCartButton components
   * TODO: Update tag logic in customerIsEligibleToPurchase function as needed
   */
  const eligibleToPurchase = customerIsEligibleToPurchase(
    data.customer?.tags || null,
  );
  return (
    <div className="home">
      {data?.homepage?.sections && (
        <Sections sections={data.homepage.sections} />
      )}
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment | undefined;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

function customerIsEligibleToPurchase(tags: string[] | null) {
  if (!tags) return false;
  return tags.includes('eligible_to_purchase');
}
