import {Link, useNavigate} from 'react-router';
import {
  CartForm,
  type MappedProductOptions,
  type OptimisticCartLineInput,
} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {Grid} from '@radix-ui/themes';
import ProductOptions from './ProductOptions/ProductOptions';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const lines: Array<OptimisticCartLineInput> = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
    : [];

  return (
    <Grid gap="5">
      <ProductOptions options={productOptions} />

      <Grid gap="2">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onAddToCart={() => console.log('something added to cart')}
          lines={lines}
          variant="outline"
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
        {selectedVariant?.availableForSale && (
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onAddToCart={() => console.log('something added to cart')}
            lines={lines}
            variant="solid"
          >
            Buy now
          </AddToCartButton>
        )}
      </Grid>
    </Grid>
  );
}
