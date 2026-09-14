import test from 'node:test'
import assert from 'node:assert/strict'
import { checkCmsReady } from '../deploy/check-cms-ready.mjs'

const published = locale => ({ siteId: 1, pageKey: 'home', locale, version: 1, content: {
  schemaVersion: 1, modules: { hero: { title: 'Published', subtitle: '', body: '', image: { url: '/assets/banner.jpg', alt: 'Banner' } } },
} })
const response = data => ({ ok: true, json: async () => ({ code: 0, data }) })

test('CMS disabled does not depend on ERP availability', async () => {
  assert.deepEqual(await checkCmsReady({ enabled: 'false', fetchImpl: () => { throw new Error('Must not call ERP') } }), { cmsEnabled: false, pages: [] })
  await assert.rejects(checkCmsReady({ enabled: 'yes' }), /true or false/)
})
test('activation requires both published languages through the website proxy', async () => {
  const paths = []
  const result = await checkCmsReady({ enabled: 'true', siteUrl: 'http://site.test:18081', fetchImpl: async (url, options) => {
    paths.push(url)
    assert.equal(options.credentials, 'omit')
    return response(published(new URL(url).searchParams.get('locale')))
  } })
  assert.equal(paths.length, 2)
  assert.ok(paths.every(path => path.startsWith('http://site.test:18081/cms-api/')))
  assert.deepEqual(result.pages.map(page => page.locale), ['zh-CN', 'en'])
})
test('unpublished English, proxy failures and wrong site prevent activation', async () => {
  const options = { enabled: 'true', siteUrl: 'http://site.test:18081' }
  await assert.rejects(checkCmsReady({ ...options, fetchImpl: async url => url.includes('locale=en')
    ? { ok: true, json: async () => ({ code: 1070008004, msg: 'Not published' }) }
    : response(published('zh-CN')) }), /Not published/)
  await assert.rejects(checkCmsReady({ ...options, fetchImpl: async () => ({ ok: false, status: 502 }) }))
  await assert.rejects(checkCmsReady({ ...options, fetchImpl: async () => response({ ...published('zh-CN'), siteId: 2 }) }), /identity/)
})
