import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import Button from './Button/Button';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const {open} = useAside();

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        // Open cart drawer when item is successfully added
        const isAdding = fetcher.state === 'submitting';
        const wasAdding = fetcher.state === 'idle' && fetcher.data;

        if (wasAdding && !isAdding) {
          // Use setTimeout to avoid state updates during render
          setTimeout(() => open('cart'), 0);
        }

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            <Button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
