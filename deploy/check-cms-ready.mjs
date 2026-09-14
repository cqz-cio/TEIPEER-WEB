import { pathToFileURL } from 'node:url'
import { createCmsClient, validatePageResponse } from '../src/cms/client.js'

// Run before replacing the live release: enabling CMS requires both languages.
export async function checkCmsReady({ enabled, siteUrl, fetchImpl = globalThis.fetch }) {
  if (enabled !== 'true') {
    if (enabled && enabled !== 'false') throw new Error('VITE_CMS_ENABLED must be true or false')
    return { cmsEnabled: false, pages: [] }
  }
  const site = new URL(siteUrl)
  if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password
      || site.pathname !== '/' || site.search || site.hash) throw new Error('Invalid CMS_SITE_URL')
  const client = createCmsClient({ baseUrl: site.origin + '/cms-api', fetchImpl })
  const pages = []
  for (const locale of ['zh-CN', 'en']) {
    const page = validatePageResponse(await client.getPublishedPage(locale))
    if (page.locale !== locale || page.siteId !== 1 || !Number.isInteger(page.version) || page.version < 1) {
      throw new Error('CMS published page identity/version mismatch: ' + locale)
    }
    pages.push({ locale, version: page.version })
  }
  return { cmsEnabled: true, pages }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await checkCmsReady({ enabled: process.env.VITE_CMS_ENABLED, siteUrl: process.env.CMS_SITE_URL })))
  } catch (error) {
    console.error('CMS is not ready; the current website release has not been replaced: ' + error.message)
    process.exitCode = 1
  }
}
