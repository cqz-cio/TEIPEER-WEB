<script setup>
import { useI18n } from 'vue-i18n'
import { PhArrowRight as ArrowRight } from '@phosphor-icons/vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import MidAutumnStory from '../components/MidAutumnStory.vue'

const { t, locale } = useI18n()
</script>

<template>
  <a class="skip-link" href="#company-news-main">{{ locale === 'zh' ? '跳转到主要内容' : 'Skip to content' }}</a>
  <SiteHeader />
  <main id="company-news-main" class="knowledge-page company-news-page">
    <section class="knowledge-hero company-news-hero">
      <div class="insights-hero-media" aria-hidden="true">
        <img src="/assets/trade-2026/company-city-panorama.png" alt="" width="2848" height="800" fetchpriority="high" />
      </div>
      <div class="knowledge-hero-overlay"></div>
      <div class="knowledge-hero-copy">
        <span>COMPANY NEWS</span>
        <h1>{{ locale === 'zh' ? '公司动态' : 'Company News' }}</h1>
        <p>{{ locale === 'zh' ? '记录团队点滴，共享温暖时光' : 'Sharing the moments that bring our team together' }}</p>
      </div>
    </section>

    <MidAutumnStory />

    <section class="knowledge-shell business-cta">
      <div><h2>{{ t('contact.title') }}</h2><p>{{ t('contact.body') }}</p></div>
      <RouterLink :to="{ name: 'contact' }">{{ t('contact.cta') }} <ArrowRight :size="20" /></RouterLink>
    </section>
  </main>
  <SiteFooter />
</template>

<style scoped>
.company-news-page { --knowledge-shell: 1320px; }
.company-news-page :deep(.knowledge-shell),
.company-news-page .knowledge-hero-copy { width: min(calc(100% - 120px), var(--knowledge-shell)); }
.company-news-hero { min-height: clamp(280px, 25vw, 360px); }
.company-news-hero .knowledge-hero-overlay { background: rgba(7, 28, 57, .28); }
.company-news-hero .knowledge-hero-copy h1 { font-size: clamp(42px, 4.45vw, 64px); }
.company-news-hero .knowledge-hero-copy p { font-size: clamp(20px, 2vw, 28px); }
.company-news-hero .insights-hero-media img { object-position: center bottom; }
.company-news-page .business-cta { margin-block: 32px 28px; }

@media (max-width: 1100px) {
  .company-news-page :deep(.knowledge-shell),
  .company-news-page .knowledge-hero-copy { width: min(calc(100% - 64px), var(--knowledge-shell)); }
}

@media (max-width: 760px) {
  .company-news-page :deep(.knowledge-shell),
  .company-news-page .knowledge-hero-copy { width: calc(100% - 44px); }
  .company-news-hero { min-height: 132px; }
  .company-news-hero .knowledge-hero-copy { text-align: left; }
  .company-news-hero .knowledge-hero-copy > span { display: none; }
  .company-news-hero .knowledge-hero-copy h1 { font-size: 29px; line-height: 1.3; }
  .company-news-hero .knowledge-hero-copy p { margin-top: 9px; font-size: 15px; line-height: 1.5; }
  .company-news-page .business-cta { margin-block: 24px; }
}
</style>
