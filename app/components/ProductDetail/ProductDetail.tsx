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
// import PageBuilder from '~/components/sanity/PageBuilder';
import {ProductPage} from '~/studio/sanity.types';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import ProductQuery from '~/graphql/queries/ProductQuery';
import {Container, Grid} from '@radix-ui/themes';
import ProductMediaGallery from '~/components/ProductMediaGallery/ProductMediaGallery';
import {ProductFragment} from 'storefrontapi.generated';
import styles from './ProductDetail.module.css';

export type ProductDetailProps = {
  product: ProductFragment;
};

export default function ProductDetail({product}: ProductDetailProps) {
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

  return (
    <Container px={{initial: '5', sm: '6'}} py={{initial: '6', sm: '9'}}>
      <Grid columns={{initial: '1', sm: '43% 1fr'}} gap="5" align="start">
        <ProductMediaGallery media={product.media} />

        <Grid
          align="start"
          gap="5"
          px={{initial: '0', sm: '6'}}
          py={{initial: '0', sm: '5'}}
        >
          <Grid gap="3">
            <div className="heading-4">Chico, Lorem Ipsum</div>
            <h1 className="heading-1">{product.title}</h1>
            <ProductPrice
              className={styles.ProductDetailPrice}
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </Grid>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <div
            className="body-default"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          />
        </Grid>
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
      </Grid>
    </Container>
  );
}
