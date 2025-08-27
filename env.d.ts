/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {
  HydrogenContext,
  HydrogenSessionData,
  HydrogenEnv,
} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/lib/context';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Window ENV object for client-side environment variables
   * Populated by server-side rendering in root.tsx
   *
   * Note: Sanity project ID and dataset are hardcoded in the app, not passed as env vars
   */
  interface Window {
    ENV: {
      NODE_ENV?: string;
      MODE?: string;
      PUBLIC_BASE_URL?: string;
      VERCEL_ENV?: string;
      [key: string]: string | undefined;
    };
  }

  interface Env extends HydrogenEnv {
    // declare additional Env parameter use in the fetch handler and Remix loader context here

    // Sanity CMS environment variables (only secrets need to be env vars)
    // Project ID, dataset, and API version are hardcoded in app/lib/sanity.ts
    SANITY_API_TOKEN?: string; // For preview mode
    SANITY_PREVIEW_SECRET?: string; // For preview authentication
    SANITY_REVALIDATE_SECRET?: string; // For webhook validation
    SANITY_STUDIO_URL?: string; // For development

    // Other environment variables
    PUBLIC_BASE_URL?: string;
  }
}

declare module 'react-router' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
  }

  // TODO: remove this once we've migrated our loaders to `Route.LoaderArgs`
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated our loaders to `Route.ActionArgs`
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}
