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
import {PRODUCT_PAGE_QUERY} from '~/lib/sanity/queries';
import PageBuilder from '~/components/sanity/PageBuilder';
import {ProductPage} from '~/types/sanity';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';

// SEO integration
import {
  generateProductMetaTags,
  generateComprehensiveSEOTags,
  pageHasNonIndexableCollections,
} from '~/lib/seo';
import {shouldNoIndex} from '~/lib/seo/routes';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/types/sanity';

// Structured data integration
import {
  generateSiteStructuredData,
  generateProductData,
  generateBreadcrumbData,
  combineStructuredData,
} from '~/lib/seo/structured-data';
import StructuredData from '~/components/StructuredData';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
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
      image: data.product.selectedOrFirstAvailableVariant?.image?.url,
    },
    {
      name: data.shopData?.name,
      primaryDomain: data.shopData?.primaryDomain,
    },
  );

  // Check if page has non-indexable collection blocks
  const hasNonIndexableCollections = data.sanityProductPage?.pageBuilder
    ? pageHasNonIndexableCollections(data.sanityProductPage.pageBuilder)
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
    type: 'product' as const,
    image: data.product.selectedOrFirstAvailableVariant?.image?.url,
    keywords: [
      data.product.title,
      data.product.vendor || 'Sierra Nevada',
      data.product.productType,
      ...(data.product.tags || []),
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
    PRODUCT_PAGE_QUERY,
    {handle},
    {
      displayName: 'ProductPage Content',
      env: context.env,
    },
  ).catch((error) => {
    // Log Sanity query errors for debugging, but don't fail the page
    console.warn(
      'Failed to load ProductPage from Sanity:',
      error instanceof Error ? error.message : String(error),
    );
    return null;
  });

  // Step 2: Determine which product handle to use for Shopify query
  let productHandle = handle;
  if (sanityProductPage?.productHandle) {
    // If Sanity ProductPage exists, use its productHandle for Shopify
    productHandle = sanityProductPage.productHandle;
  }

  // Step 3: Load Shopify product and settings in parallel, plus shop data for SEO
  const [shopifyRes, settings, shopData] = await Promise.all([
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
    shopData: shopData?.shop || null, // For comprehensive SEO and structured data
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
  const {product, sanityProductPage, settings, shopData} =
    useLoaderData<typeof loader>();

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

  // Generate structured data for this product
  const baseUrl =
    shopData?.primaryDomain?.url || 'https://friends.sierranevada.com';

  const siteStructuredData = generateSiteStructuredData(settings, shopData);
  const productStructuredData = generateProductData(
    {
      name: displayTitle,
      description: product.description,
      image: selectedVariant?.image?.url,
      brand: product.vendor || 'Sierra Nevada Brewing Co.',
      sku: selectedVariant?.sku || undefined,
      price: selectedVariant?.price?.amount,
      currency: selectedVariant?.price?.currencyCode,
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.handle}`,
    },
    settings,
  );

  const breadcrumbData = generateBreadcrumbData(
    [
      {name: 'Home', url: '/'},
      {name: 'Products', url: '/products'},
      {name: displayTitle, url: `/products/${product.handle}`},
    ],
    baseUrl,
  );

  const allStructuredData = combineStructuredData(
    ...siteStructuredData,
    productStructuredData,
    breadcrumbData,
  );

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={allStructuredData} id="product-structured-data" />

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
    productType
    tags
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
