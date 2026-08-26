import { NextRequest } from "next/server";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const locales = ['en', 'id', 'nl', 'ja', 'zh', 'ar', 'de', 'af'];

  const paths = [
    { url: '', changefreq: 'weekly', priority: 1.0 },
    { url: '/docs', changefreq: 'weekly', priority: 0.8 },
    { url: '/plans', changefreq: 'weekly', priority: 0.8 },
    { url: '/auth/login', changefreq: 'monthly', priority: 0.5 },
    { url: '/auth/register', changefreq: 'monthly', priority: 0.5 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  const date = new Date().toISOString();

  for (const path of paths) {
    for (const locale of locales) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${locale}${path.url}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>${path.changefreq}</changefreq>\n`;
      xml += `    <priority>${path.priority}</priority>\n`;

      // Add all alternates
      for (const altLocale of locales) {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}${path.url}" />\n`;
      }
      // Add x-default
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en${path.url}" />\n`;

      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
