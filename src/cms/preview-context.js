import { shallowRef } from 'vue'
import { createCmsClient, validatePageResponse, CmsError } from './client.js'

export const previewPage = shallowRef(null)
let pending = null
let generation = 0
let expiryTimer
const client = createCmsClient()

export function clearPreview() {
  generation++
  pending?.abort()
  pending = null
  clearTimeout(expiryTimer)
  previewPage.value = null
}

export async function startPreview(ticket) {
  clearPreview()
  const current = generation
  const controller = new AbortController()
  pending = controller
  if (!/^ppv_[A-Za-z0-9_-]{43}$/.test(ticket || '')) throw new CmsError('请从 ERP 重新打开预览。')
  const grant = await client.exchangePreviewTicket(ticket, controller.signal)
  if (grant.pageKey !== 'home' || !/^pps_[A-Za-z0-9_-]{43}$/.test(grant.previewSession || '')) {
    throw new CmsError('预览凭证无效，请从 ERP 重新打开。')
  }
  const data = validatePageResponse(await client.getPreviewPage(grant.previewSession, controller.signal))
  if (current !== generation) return null
  if (data.locale !== grant.locale) throw new CmsError('预览语言不匹配。')
  previewPage.value = data
  // The bearer is deliberately never persisted; the page snapshot lives only in memory.
  const ttl = Math.min(Number(grant.expiresIn) || 0, 900)
  if (ttl <= 0) { clearPreview(); throw new CmsError('预览已过期。') }
  expiryTimer = setTimeout(clearPreview, ttl * 1000)
  pending = null
  return data
}
