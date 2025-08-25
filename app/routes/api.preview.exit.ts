/**
 * API Route: Exit Sanity Preview Mode
 * 
 * This route disables preview mode by clearing the preview cookies and 
 * redirecting back to the normal site view.
 */

import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') || '/';
  
  // Clear preview cookies and redirect
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': redirect,
      'Set-Cookie': [
        'sanity-preview=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
        'sanity-preview-secret=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      ].join(', ')
    }
  });
  
  return response;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const redirect = body.redirect || '/';
      
      return new Response(JSON.stringify({ 
        success: true,
        redirect 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': [
            'sanity-preview=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
            'sanity-preview-secret=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
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
