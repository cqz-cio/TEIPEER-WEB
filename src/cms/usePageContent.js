import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { createCmsClient, validatePageResponse, CmsError } from './client.js'
import { previewPage } from './preview-context.js'

export function usePageContent() {
  const { locale, t } = useI18n()
  const route = useRoute()
  const page = ref(null)
  const loading = ref(false)
  const error = ref('')
  const preview = computed(() => route.name === 'cms-preview')
  const enabled = import.meta.env.VITE_CMS_ENABLED === 'true'
  let activeRequest
  let generation = 0
  const client = createCmsClient()
  const fallback = computed(() => ({
    title: t('hero.title'), subtitle: t('hero.subtitle'), body: t('hero.body'),
    image: { url: '/assets/trade-2026/home-hero-port.jpg', alt: 'Container vessel and port operations in Ningbo' },
  }))
  const hero = computed(() => {
    if (preview.value) return previewPage.value?.content.modules.hero || null
    return enabled ? page.value?.content.modules.hero || null : fallback.value
  })

  async function reload() {
    const current = ++generation
    activeRequest?.abort()
    page.value = null
    error.value = ''
    loading.value = false
    if (preview.value || !enabled) return
    const expectedLocale = locale.value === 'zh' ? 'zh-CN' : 'en'
    const controller = new AbortController()
    activeRequest = controller
    loading.value = true
    try {
      const result = validatePageResponse(await client.getPublishedPage(expectedLocale, controller.signal))
      if (result.locale !== expectedLocale) throw new CmsError('页面语言不匹配。')
      if (current === generation) page.value = result
    } catch (err) {
      if (current === generation && !controller.signal.aborted) error.value = err.message || '内容加载失败，请重试。'
      else if (current === generation) error.value = '内容加载超时，请重试。'
    } finally {
      if (current === generation) loading.value = false
    }
  }
  watch([locale, () => route.name], reload, { immediate: true })
  onBeforeUnmount(() => { generation++; activeRequest?.abort() })
  return { hero, loading, error, reload, preview }
}
