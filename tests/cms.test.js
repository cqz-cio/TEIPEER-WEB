import test from 'node:test'
import assert from 'node:assert/strict'
import { createCmsClient, validatePageResponse, isImageUrl } from '../src/cms/client.js'
import { cmsProxyOptions } from '../deploy/cms-proxy.js'

const content = () => ({ pageKey: 'home', locale: 'zh-CN', version: 1, content: {
  schemaVersion: 1, modules: { hero: { title: '已发布标题', subtitle: '', body: '',
    image: { url: '/assets/banner.jpg', alt: '背景图' } } },
} })
const response = data => ({ ok: true, json: async () => ({ code: 0, data }) })

test('public request never sends admin cookies or preview credentials', async () => {
  let call
  const client = createCmsClient({ fetchImpl: async (...args) => { call = args; return response(content()) } })
  assert.equal((await client.getPublishedPage('zh-CN')).pageKey, 'home')
  assert.match(call[0], /pageKey=home&locale=zh-CN$/)
  assert.equal(call[1].credentials, 'omit')
  assert.equal(call[1].cache, 'no-store')
  assert.equal(call[1].headers['X-Page-Preview-Session'], undefined)
})
test('preview exchanges a one-time ticket then uses a header, not a URL bearer', async () => {
  const calls = []
  const client = createCmsClient({ fetchImpl: async (...args) => { calls.push(args); return response({}) } })
  await client.exchangePreviewTicket('ticket')
  await client.getPreviewPage('session')
  assert.equal(calls[0][1].method, 'POST')
  assert.equal(JSON.parse(calls[0][1].body).ticket, 'ticket')
  assert.equal(calls[1][1].headers['X-Page-Preview-Session'], 'session')
  assert.equal(calls[1][0].includes('session'), false)
})
test('ERP errors and HTTP failures never masquerade as successful content', async () => {
  const business = createCmsClient({ fetchImpl: async () => ({ ok: true, json: async () => ({ code: 1070008004, msg: '未发布' }) }) })
  await assert.rejects(business.getPublishedPage('en'), { code: 1070008004 })
  const http = createCmsClient({ fetchImpl: async () => ({ ok: false, status: 503 }) })
  await assert.rejects(http.getPublishedPage('en'), { code: 503 })
})
test('request aborts on its finite deadline', async () => {
  const client = createCmsClient({ timeoutMs: 5, fetchImpl: (_path, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
  }) })
  await assert.rejects(client.getPublishedPage('en'), /aborted/)
})
test('incompatible page content and unsafe media are rejected', () => {
  assert.equal(validatePageResponse(content()).version, 1)
  for (const url of ['javascript:alert(1)', '//evil.example/x', '/assets/../secret', '/assets/%2e%2e/secret',
    'https://user:pass@example.com/x', 'https://example.com/x?token=secret', '/assets/a\\b.jpg']) {
    assert.equal(isImageUrl(url), false, url)
  }
  const invalid = content()
  invalid.content.schemaVersion = 2
  assert.throws(() => validatePageResponse(invalid), /不兼容/)
})
test('proxy requires a real tenant and rejects credential-bearing upstreams', () => {
  assert.equal(cmsProxyOptions({}), undefined)
  assert.throws(() => cmsProxyOptions({ VITE_CMS_ENABLED: 'true' }), /CMS_TENANT_ID/)
  assert.throws(() => cmsProxyOptions({ CMS_UPSTREAM: 'http://user:password@localhost', CMS_TENANT_ID: '500' }), /Invalid/)
})

test('managed HTTP media is accepted only on HTTP test pages', () => {
  const media = 'http://124.220.2.69/admin-api/infra/file/1/get/website-media/163/abc/image.png'
  assert.equal(isImageUrl(media, 'http:'), true)
  assert.equal(isImageUrl(media, 'https:'), false)
  assert.equal(isImageUrl('http://example.com/arbitrary.jpg', 'http:'), false)
  assert.equal(isImageUrl(media + '?token=x', 'http:'), false)
  assert.equal(isImageUrl(media.replace('/abc/', '/../../abc/'), 'http:'), false)
})
test('proxy pins site and page, strips admin identity, and cannot forward arbitrary routes', () => {
  const proxy = cmsProxyOptions({ CMS_TENANT_ID: '500', CMS_UPSTREAM: 'http://localhost:48080' })
  assert.equal(proxy.rewrite('/cms-api/admin-api/system/user'), '/__cms_route_not_allowed__')
  const path = new URL(proxy.rewrite('/cms-api/seo/page/public?siteId=999&pageKey=secret&locale=en'), 'http://local')
  assert.equal(path.searchParams.get('siteId'), '1')
  assert.equal(path.searchParams.get('pageKey'), 'home')
  assert.equal(path.pathname, '/app-api/seo/page/public')
  const headers = new Map([['authorization', 'admin'], ['cookie', 'session'], ['visit-tenant-id', '1'], ['tenant-visit-id', '1']])
  proxy.configure({ on: (_event, handler) => handler({
    setHeader: (key, value) => headers.set(key, value),
    removeHeader: key => headers.delete(key),
  }) })
  assert.deepEqual([...headers], [['tenant-id', '500']])
})
