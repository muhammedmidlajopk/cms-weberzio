export const DEFAULT_ROBOTS = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: {{origin}}/sitemap.xml
`;

export const DEFAULT_LLMS = `# {{siteName}}

> {{tagline}}

## Pages

- [Home]({{origin}}/): {{homeDescription}}
`;

export function buildSitemap(origin, routes = ["/"]) {
  const now = new Date().toISOString();
  const urls = routes
    .map((r) => {
      const entry = typeof r === "string" ? { path: r } : r;
      const loc = `${origin}${entry.path}`;
      const lastmod = entry.lastmod || now;
      const changefreq = entry.changefreq
        ? `\n    <changefreq>${entry.changefreq}</changefreq>`
        : "";
      const priority = entry.priority
        ? `\n    <priority>${entry.priority}</priority>`
        : "";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>${changefreq}${priority}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}
