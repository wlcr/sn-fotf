import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import Button from './Button/Button';
import {useEffect} from 'react';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onAddToCart,
  variant = 'solid',
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onAddToCart?: () => void;
  variant?:
    | 'text'
    | 'solid'
    | 'outline'
    | 'round'
    | 'round-outline'
    | undefined;
}) {
  const {open} = useAside();

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        // Open cart drawer when item is successfully added
        const isAdding = fetcher.state === 'submitting';
        const wasAdding = fetcher.state === 'idle' && fetcher.data;

        if (wasAdding) onAddToCart?.();

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            <Button
              type="submit"
              disabled={disabled ?? fetcher.state !== 'idle'}
              variant={variant}
              width="full"
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
