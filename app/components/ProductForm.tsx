import {Link, useNavigate} from 'react-router';
import {useEffect, useRef} from 'react';
import {
  CartForm,
  type MappedProductOptions,
  type OptimisticCartLineInput,
} from '@shopify/hydrogen';
import {type FetcherWithComponents} from 'react-router';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {Grid} from '@radix-ui/themes';
import ProductOptions from './ProductOptions/ProductOptions';

// Component to handle cart opening after successful add
function AddToCartWithEffect({
  fetcher,
  open,
  disabled,
  loading,
  lines,
  variant,
  children,
  loadingText,
}: {
  fetcher: FetcherWithComponents<any>;
  open: (type: 'cart') => void;
  disabled: boolean;
  loading: boolean;
  lines: Array<OptimisticCartLineInput>;
  variant: 'text' | 'solid' | 'outline' | 'round' | 'round-outline' | undefined;
  children: React.ReactNode;
  loadingText?: string;
}) {
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      console.log('Item added to cart, opening drawer');
      open('cart');
    }
  }, [fetcher.state, fetcher.data, open]);

  return (
    <AddToCartButton
      disabled={disabled}
      loading={loading}
      lines={lines}
      variant={variant}
      loadingText={loadingText}
    >
      {children}
    </AddToCartButton>
  );
}

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  // TODO: Add customer eligibility logic here
  // - Check if customer is eligible to purchase (use customerIsEligibleToPurchase from context)
  // - Display custom messaging for ineligible customers using customerGreeting from Sanity
  // - Disable/hide add-to-cart buttons for ineligible customers

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
        <CartForm
          route="/cart"
          inputs={{lines}}
          action={CartForm.ACTIONS.LinesAdd}
        >
          {(fetcher) => (
            <AddToCartWithEffect
              fetcher={fetcher}
              open={open}
              disabled={
                !selectedVariant ||
                !selectedVariant.availableForSale ||
                fetcher.state !== 'idle'
              }
              loading={fetcher.state === 'submitting'}
              lines={lines}
              variant="outline"
            >
              {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
            </AddToCartWithEffect>
          )}
        </CartForm>
        {selectedVariant?.availableForSale && (
          <CartForm
            route="/cart"
            inputs={{lines}}
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher) => (
              <AddToCartWithEffect
                fetcher={fetcher}
                open={open}
                disabled={
                  !selectedVariant ||
                  !selectedVariant.availableForSale ||
                  fetcher.state !== 'idle'
                }
                loading={fetcher.state === 'submitting'}
                lines={lines}
                variant="solid"
                loadingText="Processing..."
              >
                Buy now
              </AddToCartWithEffect>
            )}
          </CartForm>
        )}
      </Grid>
    </Grid>
  );
}
