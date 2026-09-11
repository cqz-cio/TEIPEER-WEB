// Shared by Vite development/preview. Server-side values must never be VITE_* secrets.
export function cmsProxyOptions(env) {
  if (env.VITE_CMS_ENABLED !== 'true' && !env.CMS_UPSTREAM) return undefined
  const upstream = new URL(env.CMS_UPSTREAM || 'http://127.0.0.1:48080')
  if (!['http:', 'https:'].includes(upstream.protocol) || upstream.username || upstream.password
      || upstream.pathname !== '/' || upstream.search || upstream.hash) throw new Error('Invalid CMS_UPSTREAM')
  if (!/^[1-9][0-9]*$/.test(env.CMS_TENANT_ID || '')) throw new Error('CMS_TENANT_ID is required when CMS is enabled')
  const allowed = new Set(['/cms-api/seo/page/public', '/cms-api/seo/page/preview', '/cms-api/seo/page/preview/exchange'])
  return {
    target: upstream.origin,
    changeOrigin: true,
    rewrite(path) {
      const url = new URL(path, 'http://proxy.invalid')
      if (!allowed.has(url.pathname)) return '/__cms_route_not_allowed__'
      if (url.pathname.endsWith('/public')) {
        url.searchParams.set('siteId', '1')
        url.searchParams.set('pageKey', 'home')
      }
      return '/app-api' + url.pathname.slice('/cms-api'.length) + url.search
    },
    configure(proxy) {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.setHeader('tenant-id', env.CMS_TENANT_ID)
        for (const header of ['authorization', 'cookie', 'visit-tenant-id', 'tenant-visit-id']) proxyReq.removeHeader(header)
      })
    },
  }
}
