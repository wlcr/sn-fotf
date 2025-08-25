/**
 * API Route: Enable Sanity Preview Mode
 * 
 * This route enables preview mode by setting a preview cookie and redirecting
 * to the requested page. It's called from Sanity Studio's preview feature.
 * 
 * Usage from Sanity Studio:
 * https://your-site.com/api/preview/enter?secret=YOUR_SECRET&slug=page-slug&type=page
 */

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug');
  const type = url.searchParams.get('type') || 'page';
  
  // Check the secret
  if (!secret || secret !== context.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 });
  }
  
  // Determine the preview URL
  let previewPath = '/';
  if (slug && type) {
    // Map document types to URL patterns
    const typeToPath: Record<string, string> = {
      'page': '/pages',
      'post': '/blog',
      'event': '/events',
      'announcement': '/announcements'
    };
    
    const basePath = typeToPath[type] || `/${type}`;
    previewPath = `${basePath}/${slug}`;
  }
  
  // Set preview cookie and redirect
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': previewPath,
      'Set-Cookie': [
        `sanity-preview=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`, // 24 hours
        `sanity-preview-secret=${secret}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`
      ].join(', ')
    }
  });
  
  return response;
}

// Also handle POST requests for more complex preview scenarios
export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { secret, slug, type } = body;
      
      // Validate secret
      if (!secret || secret !== context.env.SANITY_PREVIEW_SECRET) {
        return new Response(JSON.stringify({ error: 'Invalid preview secret' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Return preview URL for client-side redirect
      const typeToPath: Record<string, string> = {
        'page': '/pages',
        'post': '/blog', 
        'event': '/events',
        'announcement': '/announcements'
      };
      
      const basePath = typeToPath[type] || `/${type}`;
      const previewUrl = slug ? `${basePath}/${slug}` : '/';
      
      return new Response(JSON.stringify({ 
        url: previewUrl,
        success: true 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': [
            `sanity-preview=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
            `sanity-preview-secret=${secret}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`
          ].join(', ')
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request body' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}
