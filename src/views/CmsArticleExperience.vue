<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { createCmsClient, isImageUrl } from '../cms/client.js'
import { validateArticle } from '../cms/navigation.js'
import { previewActive, previewArticle } from '../cms/preview-context.js'
const route = useRoute()
const { locale } = useI18n()
const article = ref(null)
const error = ref('')
const loading = ref(false)
let controller, generation = 0
const hero = computed(() => isImageUrl(article.value?.heroImage) ? article.value.heroImage : isImageUrl(article.value?.coverImage?.url) ? article.value.coverImage.url : '')
watch([() => route.params.slug, locale, previewActive], async () => {
  const current = ++generation; controller?.abort(); article.value = null; error.value = ''; loading.value = true
  try {
    if (previewActive.value && previewArticle.value?.slug === route.params.slug) article.value = previewArticle.value
    else {
      controller = new AbortController()
      const result = await createCmsClient().getArticle(String(route.params.slug), locale.value === 'zh' ? 'zh-CN' : 'en', controller.signal)
      if (current !== generation) return
      if (!result) throw new Error(locale.value === 'zh' ? '文章尚未发布或已下线。' : 'This article is not available.')
      article.value = validateArticle(result)
    }
    document.title = article.value.seoTitle || article.value.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', article.value.seoDescription || article.value.summary)
  } catch (err) { if (current === generation) error.value = err.message }
  finally { if (current === generation) loading.value = false }
}, { immediate: true })
onBeforeUnmount(() => { generation++; controller?.abort() })
</script>
<template>
  <SiteHeader />
  <main class="knowledge-page">
    <div class="knowledge-shell">
      <p v-if="loading" role="status">{{ locale === 'zh' ? '正在读取文章…' : 'Loading…' }}</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <article v-else-if="article" class="cms-article">
        <span class="knowledge-label">{{ article.label }}</span><h1>{{ article.title }}</h1>
        <p>{{ article.summary }}</p><time>{{ article.displayDate }}</time>
        <img v-if="hero" :src="hero" :alt="article.coverImage?.alt || article.title" />
        <section v-for="(section, index) in article.sections" :key="index"><h2>{{ section.title }}</h2><p v-for="(paragraph, i) in section.paragraphs" :key="i">{{ paragraph }}</p></section>
        <RouterLink :to="{ name: 'insight-company' }">{{ locale === 'zh' ? '返回新闻动态' : 'Back to news' }}</RouterLink>
      </article>
    </div>
  </main><SiteFooter />
</template>
<style scoped>
.cms-article { max-width: 900px; margin: auto; padding: 56px 0; }
.cms-article h1 { font-size: clamp(30px, 4vw, 52px); line-height: 1.2; margin: 20px 0; }
.cms-article p { line-height: 1.9; white-space: pre-line; margin: 20px 0; }
.cms-article img { width: 100%; max-height: 520px; object-fit: cover; margin: 28px 0; }
.cms-article section { margin: 36px 0; }
</style>
