export class CmsError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'CmsError'
    this.code = code
  }
}

export function createCmsClient({ baseUrl = '/cms-api', fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  async function request(path, { body, session, sessionHeader = 'X-Page-Preview-Session', signal } = {}) {
    const controller = new AbortController()
    const abort = () => controller.abort()
    if (signal?.aborted) abort()
    signal?.addEventListener('abort', abort, { once: true })
    const timer = setTimeout(abort, timeoutMs)
    try {
      const response = await fetchImpl(baseUrl + path, {
        method: body ? 'POST' : 'GET',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'same-origin',
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(session ? { [sessionHeader]: session } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
      if (!response.ok) throw new CmsError('官网内容暂时无法加载，请重试。', response.status)
      const result = await response.json()
      if (result.code !== 0) throw new CmsError(result.msg || '官网内容读取失败。', result.code)
      return result.data
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
    }
  }
  return {
    getNavigation(locale, signal) { return request('/seo/navigation/public?siteId=1&locale=' + encodeURIComponent(locale), { signal }) },
    getArticles(locale, page = 1, signal) { return request('/seo/blog/public?siteId=1&pageSize=24&page=' + page + '&locale=' + encodeURIComponent(locale), { signal }) },
    getArticle(slug, locale, signal) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new CmsError('文章地址无效。')
      return request('/seo/blog/public/' + slug + '?siteId=1&locale=' + encodeURIComponent(locale), { signal })
    },
    exchangeSiteTicket(ticket, signal) { return request('/seo/site-preview/exchange', { body: { ticket }, signal }) },
    getSitePreview(session, signal) { return request('/seo/site-preview/snapshot', { session, sessionHeader: 'X-Site-Preview-Session', signal }) },
    getPublishedPage(locale, signal) {
      return request('/seo/page/public?siteId=1&pageKey=home&locale=' + encodeURIComponent(locale), { signal })
    },
    exchangePreviewTicket(ticket, signal) {
      return request('/seo/page/preview/exchange', { body: { ticket }, signal })
    },
    getPreviewPage(session, signal) {
      return request('/seo/page/preview', { session, signal })
    },
  }
}

export function validatePageResponse(data) {
  const hero = data?.content?.modules?.hero
  if (data?.pageKey !== 'home' || !['zh-CN', 'en'].includes(data?.locale)
      || data?.content?.schemaVersion !== 1 || !hero
      || ![hero.title, hero.subtitle, hero.body, hero.image?.url, hero.image?.alt].every(v => typeof v === 'string')
      || !hero.title.trim() || !isImageUrl(hero.image.url)) {
    throw new CmsError('官网内容格式不兼容，请联系管理员。', 'INVALID_CONTENT')
  }
  return data
}

export function isImageUrl(value, pageProtocol = globalThis.location?.protocol) {
  if (typeof value !== 'string') return false
  if (value.startsWith('/assets/') && !/[\\\\%?#]/.test(value) && !value.includes('..')) return true
  try {
    const url = new URL(value)
    const testMedia = pageProtocol === 'http:' && url.protocol === 'http:'
      && /^\/admin-api\/infra\/file\/[0-9]+\/get\/website-media\/[0-9]+\/[A-Za-z0-9/.-]+$/.test(url.pathname)
      && !value.includes('..')
    return (url.protocol === 'https:' || testMedia) && !url.username && !url.password && !url.search && !url.hash
  } catch { return false }
}
