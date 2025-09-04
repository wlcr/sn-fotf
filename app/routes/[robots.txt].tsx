import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {parseGid} from '@shopify/hydrogen';

// SEO integration
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import {
  SETTINGS_QUERY,
  isSiteDiscoverable,
  isRobotsCrawlingAllowed,
} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/studio/sanity.types';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Load Shopify shop data and SEO settings in parallel
  const sanityClient = createSanityClient(context.env);

  const [shopifyRes, settings] = await Promise.all([
    context.storefront.query(ROBOTS_QUERY),
    sanityServerQuery<Settings | null>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Settings for robots.txt',
        env: context.env,
      },
    ).catch(() => null),
  ]);

  const shopId = parseGid(shopifyRes.shop.id).id;
  const body = robotsTxtData({
    url: url.origin,
    shopId,
    settings, // Pass settings to influence robots.txt generation
  });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 1}`, // Reduce cache time for dynamic content
    },
  });
}

function robotsTxtData({
  url,
  shopId,
  settings,
}: {
  shopId?: string;
  url?: string;
  settings?: Settings | null;
}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  // Check SEO settings for site discoverability
  const siteDiscoverable = isSiteDiscoverable(settings || null);
  const crawlingAllowed = isRobotsCrawlingAllowed(settings || null);

  // If site is not discoverable, block all crawling
  if (!siteDiscoverable) {
    return `
# Friends of the Family - Members Only Site
# Global SEO setting: Site not discoverable
User-agent: *
Disallow: /

# Block all search engines from indexing
Crawl-delay: 86400
`.trim();
  }

  // If crawling not allowed, limit to homepage only
  if (!crawlingAllowed) {
    return `
# Friends of the Family - Limited Crawling
# Global SEO setting: Limited crawling allowed
User-agent: *
Disallow: /
Allow: /$ # Allow homepage only

# Slow down crawling for privacy
Crawl-delay: 3600

${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}
`.trim();
  }

  // Standard Shopify robots.txt with Friends of the Family modifications
  return `
# Friends of the Family - Standard Shopify Rules + SEO Settings
User-agent: *
${generalDisallowRules({sitemapUrl, shopId})}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/**
 * This function generates disallow rules that generally follow what Shopify's
 * Online Store has as defaults for their robots.txt
 */
function generalDisallowRules({
  shopId,
  sitemapUrl,
}: {
  shopId?: string;
  sitemapUrl?: string;
}) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Allow: /search/
Disallow: /search/?*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;
