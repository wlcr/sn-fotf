import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from './CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {clsx} from 'clsx';
import {ProductPrice} from '~/components/ProductPrice';
import {useAside} from '~/components/Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import styles from './CartLineItem.module.css';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const lineClasses = clsx(
    styles.cartLine,
    layout === 'page' ? styles.cartLinePage : styles.cartLineAside,
  );

  const imageClasses = clsx(
    styles.productImage,
    layout === 'page' ? styles.productImagePage : styles.productImageAside,
  );

  const titleClasses = clsx(
    styles.productTitle,
    layout === 'page' ? styles.productTitlePage : undefined,
  );

  const priceClasses = clsx(
    styles.productPrice,
    layout === 'page' ? styles.productPricePage : undefined,
  );

  const optionClasses = clsx(
    styles.productOption,
    layout === 'page' ? styles.productOptionPage : undefined,
  );

  return (
    <li
      key={id}
      className={lineClasses}
      data-optimistic={line.isOptimistic ? 'true' : 'false'}
    >
      {image && (
        <div className={imageClasses}>
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={layout === 'page' ? 120 : 80}
            loading="lazy"
            width={layout === 'page' ? 120 : 80}
          />
        </div>
      )}

      <div className={styles.productDetails}>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className={styles.productTitleLink}
        >
          <h3 className={titleClasses}>{product.title}</h3>
        </Link>

        <div className={priceClasses}>
          <ProductPrice price={line?.cost?.totalAmount} />
        </div>

        {selectedOptions.length > 0 && (
          <ul className={styles.productOptions}>
            {selectedOptions.map((option) => (
              <li key={option.name} className={optionClasses}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        )}

        <CartLineQuantity line={line} layout={layout} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayout;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className={styles.quantityControls}>
      <span className={styles.quantityLabel}>Qty: {quantity}</span>

      <div className={styles.quantityButtons}>
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            className={styles.quantityButton}
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            −
          </button>
        </CartLineUpdateButton>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className={styles.quantityButton}
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            +
          </button>
        </CartLineUpdateButton>
      </div>

      <CartLineRemoveButton
        lineIds={[lineId]}
        disabled={!!isOptimistic}
        layout={layout}
      />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
  layout,
}: {
  lineIds: string[];
  disabled: boolean;
  layout: CartLayout;
}) {
  const buttonClasses = clsx(
    styles.removeButton,
    layout === 'page' ? styles.removeButtonPage : undefined,
  );

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className={buttonClasses}
        aria-label="Remove item from cart"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
