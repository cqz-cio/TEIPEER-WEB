import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createCmsClient } from './client.js'
import { validateNavigation } from './navigation.js'
import { previewActive, previewNavigation } from './preview-context.js'
export function useNavigation() {
  const { locale } = useI18n()
  const published = shallowRef(null)
  let controller
  let generation = 0
  watch([locale, previewActive], async () => {
    const current = ++generation
    controller?.abort(); published.value = null
    if (previewActive.value || import.meta.env.VITE_CMS_ENABLED !== 'true') return
    controller = new AbortController()
    const lang = locale.value === 'zh' ? 'zh-CN' : 'en'
    try {
      const value = validateNavigation(await createCmsClient().getNavigation(lang, controller.signal), lang)
      if (current === generation) published.value = value
    } catch { /* Keep the bundled navigation available during an upstream outage. */ }
  }, { immediate: true })
  onBeforeUnmount(() => { generation++; controller?.abort() })
  return computed(() => previewActive.value ? previewNavigation.value : published.value)
}
