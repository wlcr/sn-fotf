import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useLocation,
} from 'react-router';
import favicon from '~/assets/favicon.svg?url';
import {HEADER_QUERY, FOOTER_QUERY, SETTINGS_QUERY} from '~/lib/sanity/queries';
import {
  createSanityClient,
  validateSanityEnv,
  sanityServerQuery,
} from '~/lib/sanity';
import type {
  Header as SanityHeader,
  Footer as FooterType,
  Settings,
} from '~/types/sanity';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';
import {Theme} from '@radix-ui/themes';
import radixStyles from '@radix-ui/themes/styles.css?url';
import themeStyles from './styles/themes.css?url';
import variableStyles from './styles/variables.css?url';
import {CUSTOMER_DETAILS_QUERY} from './graphql/customer-account/CustomerDetailsQuery';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {env} = context;

  // Create Sanity client for server-side queries
  const sanityEnv = validateSanityEnv(env);
  const sanityClient = createSanityClient(sanityEnv);

  const [header, footer, settings, customer] = await Promise.all([
    sanityServerQuery<SanityHeader>(
      sanityClient,
      HEADER_QUERY,
      {},
      {
        displayName: 'Header Query',
        env: sanityEnv,
      },
    ),
    sanityServerQuery<FooterType>(
      sanityClient,
      FOOTER_QUERY,
      {},
      {
        displayName: 'Footer Query',
        env: sanityEnv,
      },
    ),
    sanityServerQuery<Settings>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Settings Query',
        env: sanityEnv,
      },
    ),
    // Fetch customer data to determine if they can access account features
    // Expected to fail for unauthenticated users
    // TODO: Performance Consideration - Defer customer data loading
    // 9. Customer data is currently loaded in root loader (blocking initial page render)
    //    - Consider if customer eligibility is critical for first paint
    //    - Could defer this to client-side or use React.lazy loading
    //    - Measure impact on Time to First Byte (TTFB) and Core Web Vitals
    //    - Consider loading customer data only when needed (e.g., account-related pages)
    context.customerAccount
      .query(CUSTOMER_DETAILS_QUERY)
      .catch((error: unknown) => {
        // Log unexpected errors in development for debugging
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          process.env.NODE_ENV === 'development' &&
          !errorMessage.includes('Unauthenticated')
        ) {
          console.warn('Customer query failed:', errorMessage);
        }
        return null;
      }),
  ]);

  return {
    header: header || null,
    footer: footer || null,
    settings: settings || null,
    customer: customer?.data?.customer || null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
  };
}

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    eligibleToPurchaseTag: env.PUBLIC_FOTF_ELIGIBLE_TO_PURCHASE_TAG || null,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const location = useLocation();
  // Always call hooks at the top level (React Hooks rule)
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  const isStudioRoute = location.pathname.startsWith('/studio');

  // For studio routes, render minimal layout without site chrome
  if (isStudioRoute) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="robots" content="noindex, nofollow" />
          <title>Content Studio</title>
          <Meta />
          <Links />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              * { box-sizing: border-box; }
              html, body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
              #studio-container { height: 100vh; width: 100vw; }
            `,
            }}
          />
        </head>
        <body>
          <div id="studio-container">{children}</div>
          <Scripts nonce={nonce} />
        </body>
      </html>
    );
  }

  // Regular site layout
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={radixStyles}></link>
        <link rel="stylesheet" href={themeStyles}></link>
        <link rel="stylesheet" href={variableStyles}></link>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/uqh3oqk.css"
        ></link>
        <Meta />
        <Links />
      </head>
      <body>
        <Theme accentColor="green">
          {data ? (
            <Analytics.Provider
              cart={data.cart}
              shop={data.shop}
              consent={data.consent}
            >
              <PageLayout {...data}>{children}</PageLayout>
            </Analytics.Provider>
          ) : (
            children
          )}
        </Theme>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const location = useLocation();
  const isStudioRoute = location.pathname.startsWith('/studio');
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Studio-specific error layout
  if (isStudioRoute) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="robots" content="noindex, nofollow" />
          <title>Studio Error</title>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              * { box-sizing: border-box; }
              html, body { margin: 0; padding: 0; height: 100vh; font-family: system-ui, sans-serif; }
              .studio-error { 
                height: 100vh; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                padding: 20px; 
              }
              .studio-error-content { 
                text-align: center; 
                max-width: 600px; 
              }
            `,
            }}
          />
        </head>
        <body>
          <div className="studio-error">
            <div className="studio-error-content">
              <h1>Studio Error</h1>
              <h2>Error {errorStatus}</h2>
              {errorMessage && <p>{errorMessage}</p>}
              <p>
                <a
                  href="/studio"
                  style={{color: '#0066cc', textDecoration: 'none'}}
                >
                  ← Back to Studio
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Regular site error layout
  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
