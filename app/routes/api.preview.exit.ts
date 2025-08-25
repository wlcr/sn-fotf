/**
 * API Route: Exit Sanity Preview Mode
 * 
 * This route disables preview mode by clearing the preview cookies and 
 * redirecting back to the normal site view.
 */

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

/**
 * Helper function to create secure cookie strings for clearing based on the request protocol
 */
function createClearCookie(name: string, isHttps: boolean): string {
  const secureFlag = isHttps ? '; Secure' : '';
  return `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureFlag}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') || '/';
  
  // Clear preview cookies and redirect
  const isHttps = url.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
  
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': redirect,
      'Set-Cookie': [
        createClearCookie('sanity-preview', isHttps),
        createClearCookie('sanity-preview-secret', isHttps)
      ].join(', ')
    }
  });
  
  return response;
}

// Type definitions for request body
interface PreviewExitBody {
  redirect?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    try {
      const body: unknown = await request.json();
      
      // Type guard to ensure body is an object
      const bodyData = (body && typeof body === 'object' ? body : {}) as PreviewExitBody;
      const redirect = bodyData.redirect || '/';
      
      const isHttps = new URL(request.url).protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
      
      return new Response(JSON.stringify({ 
        success: true,
        redirect 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': [
            createClearCookie('sanity-preview', isHttps),
            createClearCookie('sanity-preview-secret', isHttps)
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
