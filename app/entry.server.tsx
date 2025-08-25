import type {AppLoadContext} from '@shopify/remix-oxygen';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  // Production-ready CSP configuration with Klaviyo and external service support
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // External services that Hydrogen doesn't automatically include
    connectSrc: ['https://www.klaviyo.com', 'https://*.klaviyo.com'],
    scriptSrc: ['https://www.klaviyo.com', 'https://*.klaviyo.com'],
    // Comprehensive img-src support (Hydrogen doesn't reliably auto-generate this)
    imgSrc: [
      'https://cdn.sanity.io',
      'https://www.klaviyo.com',
      'https://*.klaviyo.com',
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'http://localhost:*',
      'data:',
    ],
    // Required for Shopify store video content
    mediaSrc: [`https://${context.env.PUBLIC_STORE_DOMAIN}`],
    // Required for React Router v7 module scripts and Shopify tracking
    scriptSrcElem: [
      'https://www.klaviyo.com',
      'https://*.klaviyo.com',
      'https://cdn.shopify.com',
      "'self'",
      'http://localhost:*',
      "'unsafe-inline'", // Required for React Router v7 inline script compatibility
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  // Add data: URI support to font-src for inline fonts
  const modifiedHeader = header.includes('font-src')
    ? header.replace(/font-src ([^;]+)/, 'font-src $1 data:')
    : header + "; font-src 'self' data:";

  responseHeaders.set('Content-Security-Policy', modifiedHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
