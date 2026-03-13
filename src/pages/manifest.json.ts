import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const siteEntry = await getEntry('settings', 'site');
  const siteName = (siteEntry!.data as { name: string }).name;

  const manifest = {
    name: siteName,
    short_name: siteName,
    start_url: '/',
    display: 'standalone',
    background_color: '#F3F9F9',
    theme_color: '#235265',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
};
