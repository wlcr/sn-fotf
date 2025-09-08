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

import {productPageQuery} from 'studio/queries';
import PageBuilder from '~/components/sanity/PageBuilder';
import {ProductPage} from '~/studio/sanity.types';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import ProductQuery from '~/graphql/queries/ProductQuery';
import {Container, Grid} from '@radix-ui/themes';
import ProductMediaGallery from '~/components/ProductMediaGallery/ProductMediaGallery';
import ProductDetail from '~/components/ProductDetail/ProductDetail';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/** SANITY: include these queries in loadCriticalData() */

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
  // Create Sanity client
  const sanityClient = createSanityClient(context.env);

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Step 1: Fetch productPage from Sanity
  // const sanityRes = await loadQuery<SanityDocument>(productPageQuery, {handle});

  const sanityProductPage = await sanityServerQuery<ProductPage | null>(
    sanityClient,
    productPageQuery,
    {
      handle,
    },
    {
      displayName: 'ProductPage Content',
      env: context.env,
    },
  ).catch((error) => {
    console.error('Failed to load Sanity ProductPage content:', error);
    return null; // Continue without ProductPage data if it fails
  });

  console.log('sanityProductPage', sanityProductPage);

  if (!sanityProductPage) {
    throw new Response('Not Found', {status: 404});
  }

  // Step 2: Extract productHandle and fetch Shopify product
  const productHandle = sanityProductPage.productHandle;
  if (!productHandle) {
    throw new Error('No product handle found in Sanity response');
  }

  const shopifyRes = await storefront.query(ProductQuery, {
    variables: {
      handle: productHandle,
      selectedOptions: getSelectedProductOptions(request),
    },
  });
  const product = shopifyRes.product;
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
    sanityProductPage,
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

export default function MembershipHandle() {
  const {product, sanityProductPage} = useLoaderData<typeof loader>();

  return <ProductDetail product={product} />;
}
