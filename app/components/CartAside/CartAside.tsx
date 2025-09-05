import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside} from '../Aside';
import {CartMain} from '../Cart/CartMain';
import styles from './CartAside.module.css';

interface CartAsideProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export function CartAside({cart}: CartAsideProps) {
  return (
    <Aside className={styles.CartAside} type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
