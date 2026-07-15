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
    .map(
      (r) =>
        `  <url>\n    <loc>${origin}${r}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`
    )
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
