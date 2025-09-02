import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from './CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {clsx} from 'clsx';
import {FetcherWithComponents} from 'react-router';
import styles from './CartSummary.module.css';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryClasses = clsx(
    styles.cartSummary,
    layout === 'page' ? styles.cartSummaryPage : styles.cartSummaryAside,
  );

  const titleClasses = clsx(
    styles.summaryTitle,
    layout === 'aside' ? styles.summaryTitleAside : undefined,
  );

  return (
    <div aria-labelledby="cart-summary" className={summaryClasses}>
      <h4 className={titleClasses}>Order Summary</h4>

      <dl className={styles.summaryLine}>
        <dt className={styles.summaryLabel}>Subtotal</dt>
        <dd className={styles.summaryValue}>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '—'
          )}
        </dd>
      </dl>

      <CartDiscounts discountCodes={cart.discountCodes} layout={layout} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} layout={layout} />

      {cart.cost?.totalAmount && (
        <dl className={styles.summaryLineTotal}>
          <dt className={styles.summaryLabel}>Total</dt>
          <dd className={styles.summaryValueTotal}>
            <Money data={cart.cost.totalAmount} />
          </dd>
        </dl>
      )}

      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={layout} />
    </div>
  );
}
function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
}) {
  if (!checkoutUrl) return null;

  const buttonClasses = clsx(
    styles.checkoutButton,
    layout === 'page' ? styles.checkoutButtonPage : styles.checkoutButtonAside,
  );

  return (
    <div className={styles.checkoutActions}>
      <a href={checkoutUrl} target="_self" className={buttonClasses}>
        Continue to Checkout
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  layout,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  layout: CartLayout;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className={styles.discountsSection}>
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <dl className={styles.discountLine}>
          <dt className={styles.summaryLabel}>Discount</dt>
          <dd>
            <UpdateDiscountForm>
              <div className={styles.discountLine}>
                <code className={styles.discountCode}>{codes.join(', ')}</code>
                <button
                  className={styles.discountRemove}
                  type="submit"
                  aria-label="Remove discount"
                >
                  Remove
                </button>
              </div>
            </UpdateDiscountForm>
          </dd>
        </dl>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className={styles.promoForm}>
          <div className={styles.promoInputGroup}>
            <input
              className={styles.promoInput}
              type="text"
              name="discountCode"
              placeholder="Discount code"
              aria-label="Enter discount code"
            />
            <button
              className={styles.promoSubmit}
              type="submit"
              aria-label="Apply discount code"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  layout,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  layout: CartLayout;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className={styles.giftCardSection}>
      {/* Have existing gift card applied, display it with a remove option */}
      {codes.length > 0 && (
        <dl className={styles.summaryLine}>
          <dt className={styles.summaryLabel}>Gift Card</dt>
          <dd>
            <UpdateGiftCardForm>
              <div className={styles.giftCardCodes}>
                <code className={styles.giftCardCode}>{codes.join(', ')}</code>
                <button
                  className={styles.discountRemove}
                  onSubmit={() => removeAppliedCode}
                  type="submit"
                  aria-label="Remove gift card"
                >
                  Remove
                </button>
              </div>
            </UpdateGiftCardForm>
          </dd>
        </dl>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className={styles.promoForm}>
          <div className={styles.promoInputGroup}>
            <input
              className={styles.promoInput}
              type="text"
              name="giftCardCode"
              placeholder="Gift card code"
              ref={giftCardCodeInput}
              aria-label="Enter gift card code"
            />
            <button
              className={styles.promoSubmit}
              type="submit"
              aria-label="Apply gift card code"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
