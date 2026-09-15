import test from 'node:test'
import assert from 'node:assert/strict'
import { createCmsClient } from '../src/cms/client.js'
import { validateNavigation, validateArticle } from '../src/cms/navigation.js'
import { pageView, randomId, createAnalyticsClient } from '../src/cms/analytics.js'
import { cmsProxyOptions } from '../deploy/cms-proxy.js'
import { renderCmsProxy } from '../deploy/render-cms-proxy.mjs'

const result = data => ({ ok: true, json: async () => ({ code: 0, data }) })
const navigation = () => ({ navigationTemplate: 'TRIPEER_CORPORATE', locale: 'en', items: [
  { key: 'ABOUT', label: 'About', itemType: 'DIRECTORY', href: '', children: [{ key: 'PROFILE', label: 'Profile', itemType: 'ROUTE', href: '/about/profile', children: [] }] },
] })
test('navigation preserves nested order and rejects foreign routes and incompatible locales', () => {
  assert.equal(validateNavigation(navigation(), 'en').items[0].children[0].href, '/about/profile')
  for (const href of ['javascript:alert(1)', '//evil.example/', '/admin', '/products', '/cms-preview', '/contact?ticket=secret']) {
    const nav = navigation(); nav.items[0].children[0].href = href
    assert.throws(() => validateNavigation(nav, 'en'))
  }
  assert.throws(() => validateNavigation(navigation(), 'zh-CN'))
})
test('article accepts structured text but not arbitrary HTML payload shapes', () => {
  const article = { slug: 'my-news', title: 'News', summary: '', sections: [{ title: 'Text', paragraphs: ['<script>literal text</script>'] }] }
  assert.equal(validateArticle(article), article)
  assert.throws(() => validateArticle({ ...article, sections: [{ title: 'x', paragraphs: [null] }] }))
})
test('site preview bearer stays in dedicated header, public requests have none', async () => {
  const calls = []
  const client = createCmsClient({ fetchImpl: async (...args) => { calls.push(args); return result({}) } })
  await client.exchangeSiteTicket('ticket'); await client.getSitePreview('session'); await client.getNavigation('en'); await client.getArticle('sample', 'en')
  assert.equal(calls[1][1].headers['X-Site-Preview-Session'], 'session')
  assert.equal(calls[1][0].includes('session'), false)
  assert.equal(calls[2][1].headers['X-Site-Preview-Session'], undefined)
  assert.equal(calls.every(c => c[1].credentials === 'omit'), true)
})
test('page views exclude previews, missing consent and potentially identifying query strings', () => {
  const settings = { consent: true, id: () => 'test-id' }
  assert.equal(pageView('/contact', settings).eventType, 5)
  for (const path of ['/cms-preview', '/preview/blog', '/contact?email=a@b', '/#token', '//host/x', '/%2e%2e']) assert.equal(pageView(path, settings), null)
  assert.equal(pageView('/', { ...settings, preview: true }), null)
  assert.equal(pageView('/blog/product-preview', settings).pagePath, '/blog/product-preview')
  assert.equal(pageView('/', { consent: false }), null)
  assert.match(randomId(), /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
})
test('analytics sends bounded page events without admin credentials, URL queries or marketing consent', async () => {
  const calls = []
  const client = createAnalyticsClient({ fetchImpl: async (...args) => { calls.push(args); return result({}) } })
  await client.consent('v1')
  await client.track(pageView('/contact', { consent: true }), { visitor: 'visitor', session: 'session', evidence: 'proof' })
  const consent = JSON.parse(calls[0][1].body)
  assert.equal(consent.analytics, true); assert.equal(consent.marketing, false)
  assert.equal(calls[1][1].credentials, 'omit'); assert.equal(calls[1][1].referrerPolicy, 'no-referrer')
  assert.equal(JSON.parse(calls[1][1].body).pagePath, '/contact')
  assert.equal(calls[1][1].headers.Authorization, undefined)
})
test('new proxy routes pin the tenant/site and cannot proxy CMS mutations or arbitrary paths', () => {
  const proxy = cmsProxyOptions({ CMS_TENANT_ID: '163', CMS_UPSTREAM: 'http://localhost:48081' })
  assert.equal(proxy.rewrite('/cms-api/seo/blog/public/my-news?siteId=999&locale=en'), '/app-api/seo/blog/public/my-news?siteId=1&locale=en')
  assert.equal(proxy.rewrite('/cms-api/seo/blog/create'), '/__cms_route_not_allowed__')
  assert.equal(proxy.rewrite('/cms-api/seo/site-preview/ticket'), '/__cms_route_not_allowed__')
  const config = renderCmsProxy({ tenantId: '163', upstream: 'http://127.0.0.1:48081' })
  assert.match(config, /limit_except POST/); assert.match(config, /proxy_set_header tenant-id 163/)
  assert.match(config, /Origin \$scheme:\/\/\$http_host/)
  assert.doesNotMatch(config, /admin-api/)
  assert.throws(() => renderCmsProxy({ tenantId: '1;evil', upstream: 'http://local' }))
})
test('preview snapshot survives route-independent reads, clears on expiry/exit and never persists tokens', async () => {
  const page = { siteId: 1, pageKey: 'home', locale: 'en', version: 1, content: { schemaVersion: 1, modules: { hero: { title: 'Draft', subtitle: '', body: '', image: { url: '/assets/x.jpg', alt: '' } } } } }
  const original = globalThis.fetch
  globalThis.fetch = async url => result(url.endsWith('/exchange') ? { previewSession: 'sps_' + 'b'.repeat(43), expiresIn: 1, locale: 'en' } : { page, navigation: navigation(), article: null })
  const preview = await import('../src/cms/preview-context.js')
  globalThis.fetch = original
  try {
    await preview.startPreview('spv_' + 'a'.repeat(43))
    assert.equal(preview.previewActive.value, true); assert.equal(preview.previewPage.value.content.modules.hero.title, 'Draft')
    assert.equal(preview.previewNavigation.value.items[0].label, 'About')
    await new Promise(resolve => setTimeout(resolve, 1050))
    assert.equal(preview.previewExpired.value, true); assert.equal(preview.previewPage.value, null)
    assert.equal(preview.previewNavigation.value, null)
  } finally { preview.clearPreview() }
  assert.equal(preview.previewActive.value, false)
})
