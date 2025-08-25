/**
 * Sanity Live Preview Components
 * 
 * These components provide live preview functionality for content editors,
 * including preview mode detection, live queries, and preview controls.
 */

import { useEffect, useState } from 'react';
import { useLiveQuery } from '@sanity/preview-kit';
import { createSanityClient, createSanityPreviewClient } from '~/lib/sanity';

/**
 * Hook to detect if we're in preview mode
 */
export function usePreviewMode() {
  const [isPreview, setIsPreview] = useState(false);
  
  useEffect(() => {
    // Check for preview query parameter or cookie
    const urlParams = new URLSearchParams(window.location.search);
    const hasPreviewParam = urlParams.get('preview');
    
    const hasPreviewCookie = document.cookie
      .split(';')
      .some(cookie => cookie.trim().startsWith('sanity-preview=true'));
    
    setIsPreview(Boolean(hasPreviewParam || hasPreviewCookie));
  }, []);
  
  return isPreview;
}

/**
 * Live Query Hook for React Router v7
 * 
 * This hook enables live updates from Sanity when in preview mode.
 * It falls back to the initial data when not in preview mode.
 */
interface UseSanityLiveQueryOptions {
  enabled?: boolean;
  projectId: string;
  dataset?: string;
  token?: string;
}

export function useSanityLiveQuery<T = any>(
  query: string,
  params: Record<string, any>,
  initial: T,
  options: UseSanityLiveQueryOptions
): T {
  const [data, setData] = useState<T>(initial);
  const [client, setClient] = useState<any>(null);
  const isPreview = usePreviewMode();
  
  useEffect(() => {
    if (!isPreview || !options.enabled || !options.token) {
      setData(initial);
      return;
    }
    
    // Create preview client for live queries
    const previewClient = createSanityPreviewClient({
      SANITY_PROJECT_ID: options.projectId,
      SANITY_DATASET: options.dataset || 'production',
      SANITY_API_TOKEN: options.token
    });
    
    setClient(previewClient);
  }, [isPreview, options.enabled, options.projectId, options.dataset, options.token, initial]);
  
  // Use Sanity's live query hook when in preview mode
  const liveData = useLiveQuery(initial, query, params, { client });
  
  return isPreview && options.enabled && client ? liveData : data;
}

/**
 * Preview Mode Banner Component
 * 
 * Shows a banner to content editors when in preview mode with option to exit.
 */
export function PreviewModeBanner() {
  const isPreview = usePreviewMode();
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isPreview || !isVisible) return null;
  
  const handleExitPreview = async () => {
    try {
      const response = await fetch('/api/preview/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirect: window.location.pathname })
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to exit preview mode:', error);
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-2 text-sm font-medium">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>Preview Mode Active - You are viewing draft content</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className="text-black/70 hover:text-black"
            aria-label="Hide banner"
          >
            Hide
          </button>
          <button
            onClick={handleExitPreview}
            className="bg-black text-yellow-400 px-3 py-1 rounded text-xs font-medium hover:bg-black/80 transition-colors"
          >
            Exit Preview
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Live Content Wrapper Component
 * 
 * Wraps content that should have live preview updates.
 */
interface LiveContentProps {
  children: React.ReactNode;
  query: string;
  params: Record<string, any>;
  initial: any;
  enabled?: boolean;
  projectId: string;
  dataset?: string;
  token?: string;
}

export function LiveContent({
  children,
  query,
  params,
  initial,
  enabled = true,
  projectId,
  dataset,
  token
}: LiveContentProps) {
  const liveData = useSanityLiveQuery(
    query,
    params,
    initial,
    { enabled, projectId, dataset, token }
  );
  
  // Clone children and inject live data
  return (
    <>
      {typeof children === 'function' 
        ? (children as any)(liveData)
        : children
      }
    </>
  );
}

/**
 * Preview Script Component
 * 
 * Includes the necessary scripts for Sanity's live preview functionality.
 * Should be included in the root layout when preview mode is active.
 */
export function PreviewScripts() {
  const isPreview = usePreviewMode();
  
  if (!isPreview) return null;
  
  return (
    <>
      {/* Sanity Preview Kit Scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            console.log('%c Sanity Preview Mode Active ', 'background: #f7df1e; color: #000; padding: 2px 4px; border-radius: 2px; font-weight: bold;');
            console.log('Live preview is enabled. Content will update in real-time as you edit in Sanity Studio.');
          `
        }}
      />
    </>
  );
}

/**
 * Preview Status Indicator
 * 
 * Small indicator showing preview status (useful for development)
 */
export function PreviewStatusIndicator() {
  const isPreview = usePreviewMode();
  
  // Only show in development - we'll rely on the build process to set this
  const IS_PRODUCTION = typeof window !== 'undefined' 
    ? window.ENV?.NODE_ENV === 'production'
    : false;
  
  if (IS_PRODUCTION) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        isPreview 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-500 text-white'
      }`}>
        {isPreview ? '🟢 Live Preview' : '⚪ Standard Mode'}
      </div>
    </div>
  );
}
