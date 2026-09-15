import { CmsError } from './client.js'
const paths = new Set(['/', '/about/profile', '/about/history', '/about/markets', '/business', '/business/overview', '/news/company', '/news/insights', '/culture', '/contact'])
export function validateNavigation(value, locale) {
  if (!value) return null
  if (value.navigationTemplate !== 'TRIPEER_CORPORATE' || value.locale !== locale || !Array.isArray(value.items)) throw new CmsError('导航内容不兼容。')
  let count = 0
  const walk = (items, depth = 1) => {
    if (!Array.isArray(items) || depth > 3) throw new CmsError('导航层级不兼容。')
    return items.map(item => {
      if (++count > 100 || typeof item.key !== 'string' || typeof item.label !== 'string' || !item.label.trim()
          || (item.itemType !== 'DIRECTORY' && !paths.has(item.href))) throw new CmsError('导航链接不兼容。')
      const children = item.children?.length ? walk(item.children, depth + 1) : []
      return { key: item.key, label: item.label, href: item.itemType === 'DIRECTORY' ? '' : item.href, children }
    }).filter(item => item.href || item.children.length)
  }
  return { ...value, items: walk(value.items) }
}
export function validateArticle(value) {
  if (!value || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug || '') || typeof value.title !== 'string'
      || typeof value.summary !== 'string' || !Array.isArray(value.sections)
      || value.sections.some(s => typeof s.title !== 'string' || !Array.isArray(s.paragraphs) || s.paragraphs.some(p => typeof p !== 'string'))) throw new CmsError('文章内容不兼容。')
  return value
}
