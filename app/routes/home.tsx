import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {SanityDocument} from '@sanity/client';
import {loadQuery} from '~/lib/sanity/sanity.loader.server';
import {homeQuery} from 'studio/queries/index';
import PageBuilder from '~/components/sanity/PageBuilder';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.homepage.title ?? ''}`}];
};

/** SANITY: include these queries in loadCriticalData() */

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const [{data: homepage}] = await Promise.all([
    // Add other queries here, so that they are loaded in parallel
    loadQuery<SanityDocument>(homeQuery, {}),
  ]);

  if (!homepage) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    homepage,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  // TODO: implement useQuery for live Sanity content updates
  const {homepage} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>{homepage.title}</h1>
      </header>
      <main>
        <PageBuilder
          parent={{_id: homepage._id, _type: homepage._type}}
          pageBuilder={homepage.pageBuilder}
        />
      </main>
    </div>
  );
}
