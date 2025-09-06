import {useEffect, useState} from 'react';

// Types for Sanity Studio components
interface StudioComponent {
  (props: {
    config: any;
    unstable_noAuthBoundary?: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    unstable_globalErrorHandler?: (error: unknown) => boolean;
  }): JSX.Element;
}

interface SanityConfig {
  // Add specific config properties if needed
  [key: string]: any;
}

// No server-side loader - this route is client-only to avoid
// including Sanity Studio in the server bundle

export default function StudioPage() {
  // Only render on client to avoid any server-side issues
  const [isClient, setIsClient] = useState(false);
  const [Studio, setStudio] = useState<StudioComponent | null>(null);
  const [config, setConfig] = useState<SanityConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only proceed if we're on the client
    if (!isClient) return;

    // Set up browser globals that Sanity Studio needs
    if (typeof window !== 'undefined') {
      (window as any).global = (window as any).global || window;
      if (!(window as any).process) {
        (window as any).process = {env: {NODE_ENV: 'development'}};
      }
    }

    async function loadStudio() {
      try {
        console.log('Loading Sanity Studio...');

        // Only load if we're in the browser
        if (typeof window === 'undefined') {
          console.warn('Studio loading called on server - skipping');
          return;
        }

        const [
          {Studio: StudioComponent, defineConfig},
          schemaTypes,
          seoPlugin,
          studioStructure,
        ] = await Promise.all([
          import('sanity').then((sanityModule) => ({
            Studio: sanityModule.Studio,
            defineConfig: sanityModule.defineConfig,
          })),
          import('../lib/studio-schema.client').then((module) =>
            module.createSchemaTypes(),
          ),
          import('../lib/studio-schema.client').then((module) =>
            module.createSeoPlugin(),
          ),
          import('../lib/studio-schema.client').then((module) =>
            module.createStudioStructure(),
          ),
        ]);

        // Try to load structure tool and vision tool
        let structureTool = null;
        let visionTool = null;
        try {
          const structureModule = await import('sanity/structure');
          structureTool = structureModule.structureTool;
        } catch {
          console.warn('Structure tool not available');
        }

        try {
          const visionModule = await import('@sanity/vision');
          visionTool = visionModule.visionTool;
        } catch {
          console.warn('Vision tool not available');
        }

        // Create full studio configuration with actual schema
        const studioConfig = defineConfig({
          name: 'friends-of-the-family',
          title: 'Friends of the Family Studio',
          projectId: 'rimuhevv',
          dataset: 'production',
          apiVersion: '2025-01-01',
          basePath: '/studio',
          plugins: [
            structureTool
              ? structureTool(
                  studioStructure ? {structure: studioStructure} : {},
                )
              : null,
            visionTool ? visionTool() : null,
            seoPlugin, // Add SEO testing plugin
          ].filter(Boolean),
          schema: {
            types: schemaTypes as any,
          },
        });

        console.log('Studio loaded with full schema');
        setStudio(() => StudioComponent);
        setConfig(studioConfig);
      } catch (err) {
        console.error('Failed to load Studio:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Studio');
      }
    }

    loadStudio();
  }, [isClient]);

  // Server-side: render nothing to avoid any imports
  if (!isClient) {
    return null;
  }

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
        unstable_globalErrorHandler={(error: unknown) => {
          console.error('Studio error (handled):', error);
          return true; // Prevent error from bubbling up
        }}
      />
    </div>
  );
}
