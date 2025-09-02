import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {clsx} from 'clsx';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from './CartLineItem';
import {CartSummary} from './CartSummary';
import styles from './Cart.module.css';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  const mainClasses = clsx(
    styles.cartMain,
    layout === 'page' ? styles.cartMainPage : styles.cartMainAside,
  );

  const detailsClasses = clsx(
    styles.cartDetails,
    layout === 'page' ? styles.cartDetailsPage : styles.cartDetailsAside,
  );

  const linesClasses = clsx(
    styles.cartLines,
    layout === 'page' ? styles.cartLinesPage : styles.cartLinesAside,
  );

  return (
    <div className={mainClasses}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {cartHasItems && (
        <div className={detailsClasses}>
          <div className={linesClasses} aria-labelledby="cart-lines">
            <ul
              className={clsx(
                styles.cartLinesList,
                layout === 'page' ? styles.cartLinesListPage : undefined,
              )}
            >
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();

  const emptyClasses = clsx(
    styles.emptyCart,
    layout === 'page' ? styles.emptyCartPage : styles.emptyCartAside,
  );

  return (
    <div hidden={hidden} className={emptyClasses}>
      <p className={styles.emptyCartMessage}>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className={styles.emptyCartAction}
      >
        Continue shopping
      </Link>
    </div>
  );
}
