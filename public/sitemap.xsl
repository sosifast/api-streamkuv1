<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - DB Movie</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 2rem;
          }
          a {
            color: #ef4444;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .header {
            margin-bottom: 2rem;
            background: #fff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          h1 {
            margin: 0 0 1rem 0;
            color: #111;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: left;
            padding: 1rem;
            font-weight: 600;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 1rem;
            border-bottom: 1px solid #f1f5f9;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          .alternates {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .alt-tag {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>XML Sitemap</h1>
          <p>This is an XML Sitemap generated to follow strict Google SERP SEO standards, including complete i18n alternate language routing.</p>
          <p>
            Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Freq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  
                  <xsl:if test="xhtml:link">
                    <div class="alternates">
                      <xsl:for-each select="xhtml:link">
                        <span class="alt-tag">
                          <b><xsl:value-of select="@hreflang"/>: </b>
                          <a href="{@href}"><xsl:value-of select="@href"/></a>
                        </span>
                      </xsl:for-each>
                    </div>
                  </xsl:if>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
