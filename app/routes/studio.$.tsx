import {useEffect, useState} from 'react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  // Optional: Add authentication check for production
  return null;
}

export default function StudioPage() {
  const [Studio, setStudio] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up browser globals that Sanity Studio needs
    if (typeof window !== 'undefined') {
      (window as any).global = (window as any).global || window;
      if (!(window as any).process) {
        (window as any).process = {env: {NODE_ENV: 'development'}};
      }
    }

    async function loadStudio() {
      try {
        console.warn('Loading Sanity Studio...');

        const [{Studio: StudioComponent}, studioConfig] = await Promise.all([
          import('sanity'),
          import('../../studio/sanity.config'),
        ]);

        console.warn('Studio loaded successfully');
        setStudio(() => StudioComponent);
        setConfig(studioConfig.default);
      } catch (err) {
        console.error('Failed to load Studio:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Studio');
      }
    }

    loadStudio();
  }, []);

  if (error) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: 20,
        }}
      >
        <div style={{textAlign: 'center', maxWidth: 600}}>
          <h1>Studio Loading Error</h1>
          <p>Failed to load Sanity Studio: {error}</p>
          <p>
            <a href="/" style={{color: '#0066cc', textDecoration: 'none'}}>
              ← Back to Site
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!Studio || !config) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 20}}>Loading Sanity Studio...</div>
          <div
            style={{
              width: 40,
              height: 40,
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0066cc',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <Studio
        config={config}
        unstable_noAuthBoundary
        // Additional props to help with auth issues
        unstable_globalErrorHandler={(error: unknown) => {
          console.warn('Studio error (handled):', error);
          // Return true to prevent the error from bubbling up
          return true;
        }}
        // Navigation handler for debugging if needed
        // onNavigate={(route) => console.log('Studio navigating to:', route)}
      />
    </div>
  );
}
