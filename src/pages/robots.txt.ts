import type { APIRoute } from 'astro';
import { getSiteData } from '../lib/data';

export const GET: APIRoute = async () => {
  const site = await getSiteData();
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${site.url}/sitemap-index.xml`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
