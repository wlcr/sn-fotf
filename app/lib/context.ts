import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {createSanityContext} from 'hydrogen-sanity';
/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  /**
   * Sanity implementation docs:
   * https://github.com/sanity-io/hydrogen-sanity/
   */

  // 1. Configure the Sanity Loader and preview mode
  const sanity = createSanityContext({
    request,
    // To use the Hydrogen cache for queries
    cache,
    waitUntil,

    // Sanity client configuration
    client: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      apiVersion: env.SANITY_API_VERSION || '2024-10-28',
      useCdn: process.env.NODE_ENV === 'production',

      // In preview mode, `stega` will be enabled automatically
      // If you need to configure the client's steganography settings,
      // you can do so here
      // stega: {
      //   logger: console
      // }
    },

    // You can also initialize a client and pass it instead
    // client: createClient({
    //   projectId: env.SANITY_PROJECT_ID,
    //   dataset: env.SANITY_DATASET,
    //   apiVersion: env.SANITY_API_VERSION || '2023-03-30',
    //   useCdn: process.env.NODE_ENV === 'production',
    // }),

    // Optionally, set a default cache strategy, defaults to `CacheLong`
    // strategy: CacheShort() | null,

    // Optionally, enable Visual Editing
    // See "Visual Editing" section below to setup the preview route
  });

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    sanity,
  };
}
