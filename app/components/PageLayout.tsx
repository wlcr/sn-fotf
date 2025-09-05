import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {
  Header as SanityHeader,
  Footer as SanityFooter,
  Settings,
} from '~/studio/sanity.types';
import {Aside} from '~/components/Aside';
import {CartAside} from '~/components/CartAside/CartAside';
import {Footer} from '~/components/Footer/Footer';
import {Header} from '~/components/Header/Header';
import {SearchAside} from '~/components/SearchAside/SearchAside';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: SanityFooter | null;
  header: SanityHeader | null;
  settings: Settings | null;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  settings,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      {header && <Header header={header} cart={cart} />}
      <main id="main-content">{children}</main>
      {footer && <Footer footer={footer} />}
    </Aside.Provider>
  );
}

// Mobile menu aside removed - will be handled by Header component internally
// when we implement mobile menu functionality
