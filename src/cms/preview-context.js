import { shallowRef, ref } from 'vue'
import { createCmsClient, validatePageResponse, CmsError } from './client.js'
import { validateNavigation, validateArticle } from './navigation.js'

export const previewPage = shallowRef(null)
export const previewNavigation = shallowRef(null)
export const previewArticle = shallowRef(null)
export const previewActive = ref(false)
export const previewExpired = ref(false)
let pending = null
let generation = 0
let expiryTimer
const client = createCmsClient()

export function clearPreview() {
  generation++
  pending?.abort(); pending = null
  clearTimeout(expiryTimer)
  previewPage.value = previewNavigation.value = previewArticle.value = null
  previewActive.value = previewExpired.value = false
}
export async function startPreview(ticket) {
  clearPreview()
  const current = generation
  const controller = new AbortController()
  pending = controller
  previewActive.value = true
  try {
    const site = /^spv_[A-Za-z0-9_-]{43}$/.test(ticket || '')
    if (!site && !/^ppv_[A-Za-z0-9_-]{43}$/.test(ticket || '')) throw new CmsError('请从 ERP 重新打开预览。')
    const grant = await (site ? client.exchangeSiteTicket(ticket, controller.signal) : client.exchangePreviewTicket(ticket, controller.signal))
    if (!(site ? /^sps_[A-Za-z0-9_-]{43}$/ : /^pps_[A-Za-z0-9_-]{43}$/).test(grant.previewSession || '')) throw new CmsError('预览凭证无效。')
    const snapshot = site ? await client.getSitePreview(grant.previewSession, controller.signal) : { page: await client.getPreviewPage(grant.previewSession, controller.signal) }
    const page = validatePageResponse(snapshot.page)
    if (page.locale !== grant.locale) throw new CmsError('预览语言不匹配。')
    const nav = site ? validateNavigation(snapshot.navigation, page.locale) : null
    const article = snapshot.article ? validateArticle(snapshot.article) : null
    const ttl = Math.min(Number(grant.expiresIn) || 0, 900)
    if (ttl <= 0) throw new CmsError('预览已过期。')
    if (current !== generation) return null
    previewPage.value = page; previewNavigation.value = nav; previewArticle.value = article
    // Credentials and drafts remain in memory only; navigation cannot extend their lifetime.
    expiryTimer = setTimeout(() => {
      clearPreview(); previewActive.value = true; previewExpired.value = true
    }, ttl * 1000)
    pending = null
    return { ...page, article }
  } catch (error) {
    if (current === generation) { clearPreview(); previewActive.value = true; previewExpired.value = true }
    throw error
  }
}
