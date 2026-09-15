import { pathToFileURL } from 'node:url'

export function renderCmsProxy({ tenantId, upstream }) {
  if (!/^[1-9][0-9]*$/.test(String(tenantId))) throw new Error('Invalid CMS tenant')
  const target = new URL(upstream)
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password || target.pathname !== '/' || target.search || target.hash) throw new Error('Invalid upstream')
  const routes = [
    ['seo/page/public', 'GET', '?siteId=1&pageKey=home&locale=$arg_locale'],
    ['seo/page/preview', 'GET', ''], ['seo/page/preview/exchange', 'POST', ''],
    ['seo/navigation/public', 'GET', '?siteId=1&locale=$arg_locale'],
    ['seo/blog/public', 'GET', '?siteId=1&locale=$arg_locale&page=$arg_page&pageSize=24'],
    ['seo/site-preview/exchange', 'POST', ''], ['seo/site-preview/snapshot', 'GET', ''],
    ['statistics/website-traffic/config', 'GET', ''], ['statistics/website-traffic/track', 'POST', ''],
    ['statistics/consent/evidence', 'POST', ''], ['statistics/consent/withdraw', 'POST', ''],
  ]
  const headers = `    client_max_body_size 16k;
    proxy_set_header tenant-id ${tenantId};
    proxy_set_header Authorization "";
    proxy_set_header Cookie "";
    proxy_set_header visit-tenant-id "";
    proxy_set_header tenant-visit-id "";
    proxy_set_header Origin $scheme://$http_host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_hide_header Cache-Control;
    add_header Cache-Control "private, no-store" always;
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
    proxy_connect_timeout 5s;
    proxy_read_timeout 15s;`
  return '# BEGIN TRIPEER CMS PROXY\n' + routes.map(([path, method, query]) => `location = /cms-api/${path} {
    limit_except ${method} { deny all; }
    proxy_pass ${target.origin}/app-api/${path}${query};
${headers}
}`).join('\n') + `
location ~ ^/cms-api/seo/blog/public/(?<cms_slug>[a-z0-9]+(?:-[a-z0-9]+)*)$ {
    limit_except GET { deny all; }
    proxy_pass ${target.origin}/app-api/seo/blog/public/$cms_slug?siteId=1&locale=$arg_locale;
${headers}
}
location /cms-api/ { return 404; }
# END TRIPEER CMS PROXY
`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(renderCmsProxy({ tenantId: process.env.CMS_TENANT_ID, upstream: process.env.CMS_UPSTREAM }))
}
