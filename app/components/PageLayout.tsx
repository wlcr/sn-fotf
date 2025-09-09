import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {
  Header as SanityHeader,
  Footer as SanityFooter,
  Settings,
} from '~/types/sanity';
import {Aside} from '~/components/Aside';
import {CartAside} from '~/components/CartAside/CartAside';
import {Footer} from '~/components/Footer/Footer';
import {Header} from '~/components/Header/Header';
import {SearchAside} from '~/components/SearchAside/SearchAside';
import {SkipLink} from '~/components/SkipLink';
import {CustomerProvider} from '~/context/Customer';
import type {CustomerDetailsQuery} from 'customer-accountapi.generated';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: SanityFooter | null;
  header: SanityHeader | null;
  settings: Settings | null;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  customer: CustomerDetailsQuery['customer'] | null;
  eligibleToPurchaseTag: string | null;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  customer,
  settings,
  isLoggedIn,
  publicStoreDomain,
  eligibleToPurchaseTag,
}: PageLayoutProps) {
  return (
    <CustomerProvider
      customer={customer}
      eligibleToPurchaseTag={eligibleToPurchaseTag}
    >
      <Aside.Provider>
        <CartAside cart={cart} />
        <SearchAside />
        <SkipLink />
        {header && <Header header={header} cart={cart} settings={settings} />}
        <main id="main-content">{children}</main>
        {footer && <Footer footer={footer} />}
      </Aside.Provider>
    </CustomerProvider>
  );
}

// Mobile menu aside removed - will be handled by Header component internally
// when we implement mobile menu functionality
