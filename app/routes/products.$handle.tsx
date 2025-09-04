import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// Sanity integration
import {productPageQuery} from 'studio/queries';
import PageBuilder from '~/components/sanity/PageBuilder';
import {ProductPage} from '~/studio/sanity.types';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';

// SEO integration
import {
  generateProductMetaTags,
  seoMetaTagsToRemixMeta,
  pageHasNonIndexableCollections,
} from '~/lib/seo';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/studio/sanity.types';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.product) {
    return [{title: 'Product Not Found'}];
  }

  // Generate comprehensive SEO meta tags combining Shopify + Sanity data
  const metaTags = generateProductMetaTags(
    data.settings,
    data.sanityProductPage,
    {
      title: data.product.title,
      description:
        data.product.description || data.product.seo?.description || undefined,
      handle: data.product.handle,
    },
  );

  // Check if page has non-indexable collection blocks
  const hasNonIndexableCollections = data.sanityProductPage?.pageBuilder
    ? pageHasNonIndexableCollections(data.sanityProductPage.pageBuilder)
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Create Sanity client for potential ProductPage lookup
  const sanityClient = createSanityClient(context.env);

  // Strategy: Try to find Sanity ProductPage first, then get Shopify product
  // If no ProductPage exists, just load Shopify product directly

  // Step 1: Try to load Sanity ProductPage using URL handle
  const sanityProductPage = await sanityServerQuery<ProductPage | null>(
    sanityClient,
    productPageQuery,
    {handle},
    {
      displayName: 'ProductPage Content',
      env: context.env,
    },
  ).catch(() => null); // Don't fail if Sanity query fails

  // Step 2: Determine which product handle to use for Shopify query
  let productHandle = handle;
  if (sanityProductPage?.productHandle) {
    // If Sanity ProductPage exists, use its productHandle for Shopify
    productHandle = sanityProductPage.productHandle;
  }

  // Step 3: Load Shopify product and settings in parallel
  const [shopifyRes, settings] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions: getSelectedProductOptions(request),
      },
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
    ).catch(() => null),
  ]);

  const product = shopifyRes.product;
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle: productHandle, data: product});

  return {
    product,
    sanityProductPage, // May be null if no ProductPage exists
    settings, // For SEO meta tag generation
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product, sanityProductPage} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // Use name override from Sanity if available
  const displayTitle = sanityProductPage?.nameOverride || title;

  return (
    <>
      <div className="product">
        <ProductImage image={selectedVariant?.image} />
        <div className="product-main">
          <h1>{displayTitle}</h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <br />
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
          <br />
          <br />
          <p>
            <strong>Description</strong>
          </p>
          <br />
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          <br />
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>

      {/* Render Sanity page builder content if available */}
      {sanityProductPage?.pageBuilder &&
        sanityProductPage.pageBuilder.length > 0 && (
          <PageBuilder
            parent={{
              _id: sanityProductPage._id,
              _type: sanityProductPage._type,
            }}
            pageBuilder={sanityProductPage.pageBuilder}
          />
        )}
    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
