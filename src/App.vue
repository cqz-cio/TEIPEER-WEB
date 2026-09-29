<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { companyCopy } from './company-copy.js'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroVideo from './components/HeroVideo.vue'
import CultureValues from './components/CultureValues.vue'
import { usePageContent } from './cms/usePageContent.js'
import {
  PhArrowRight as ArrowRight,
  PhPackage as Package,
  PhCheckCircle as CheckCircle,
  PhHouseLine as HouseLine,
  PhFileText as FileText,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhMountains as Mountains,
  PhTarget as Target,
} from '@phosphor-icons/vue'

const { t, tm, locale } = useI18n()
const { hero, loading: cmsLoading, error: cmsError, reload: reloadCms } = usePageContent()
const facts = computed(() =>
  locale.value === 'zh'
    ? [
        { value: '10年', label: '贸易执行积累', icon: CheckCircle },
        { value: '一次性食品包装', label: '餐饮包装供应', icon: Package },
        { value: '实木家具', label: '品质家具供应', icon: HouseLine },
        { value: '订单协同', label: '从需求到交付', icon: FileText },
        { value: '海外市场', label: '出口服务经验', icon: GlobeHemisphereEast },
      ]
    : [
        { value: '10 Years', label: 'Trade Execution', icon: CheckCircle },
        { value: 'Food Packaging', label: 'Disposable Food Packaging', icon: Package },
        { value: 'Solid Wood Furniture', label: 'Quality Furniture Supply', icon: HouseLine },
        { value: 'Order Coordination', label: 'Requirement to Delivery', icon: FileText },
        { value: 'Overseas Markets', label: 'Export Service', icon: GlobeHemisphereEast },
      ],
)

const businessItems = computed(() => {
  const zh = [
    {
      title: '一次性食品包装产品',
      subtitle: 'Disposable Food Packaging',
      body: '涵盖纸杯、餐盒、外卖打包盒、刀叉勺、吸管、餐巾纸、烘焙包装、铝箔容器及环保可降解包装，服务餐饮、零售、酒店与外卖等场景。',
      image: '/assets/trade-2026/product-paper-disposable.jpg',
    },
    {
      title: '实木家具',
      subtitle: 'Solid Wood Furniture',
      body: '涵盖餐桌椅、床架、床头柜、衣柜、书架、茶几及定制实木家具，服务家居零售、酒店工程、品牌商、进口商和跨境电商卖家。',
      image: '/assets/trade-2026/product-home-daily.jpg',
    },
    {
      title: '产品与包装定制',
      subtitle: 'Product & Packaging Customization',
      body: '围绕品牌、标签、包装结构与装箱方式推进样品确认，并衔接后续批量生产。',
      image: '/assets/trade-2026/product-packaging-custom.jpg',
    },
    {
      title: '国际贸易与订单协同',
      subtitle: 'International Trade & Order Coordination',
      body: '连接询价、打样、生产跟进、质量检查、贸易单证与出运安排，让订单状态保持清晰。',
      image: '/assets/trade-2026/product-trade-order.jpg',
    },
  ]
  const en = [
    {
      title: 'Disposable Food Packaging',
      subtitle: 'Paper · Plastic · Wood',
      body: 'Paper cups, meal containers, takeaway boxes, cutlery, straws, napkins, bakery packaging, aluminum foil containers and biodegradable packaging for foodservice, retail, hotels and takeaway businesses.',
      image: '/assets/trade-2026/product-paper-disposable.jpg',
    },
    {
      title: 'Solid Wood Furniture',
      subtitle: 'Dining Room · Living Room · Bedroom',
      body: 'Dining tables and chairs, bed frames, bedside tables, wardrobes, bookcases, coffee tables and custom solid wood furniture for home retailers, hotel projects, brands, importers and e-commerce sellers.',
      image: '/assets/trade-2026/product-home-daily.jpg',
    },
    {
      title: 'Product & Packaging Customization',
      subtitle: 'Branding · Labels · Packing',
      body: 'Coordinating branding, labels, packaging structures, carton requirements and sample approval before production.',
      image: '/assets/trade-2026/product-packaging-custom.jpg',
    },
    {
      title: 'International Trade & Order Coordination',
      subtitle: 'Sampling · Quality · Documentation · Delivery',
      body: 'Connecting quotation, sampling, production follow-up, quality checks, trade documents and shipping arrangements.',
      image: '/assets/trade-2026/product-trade-order.jpg',
    },
  ]
  return locale.value === 'zh' ? zh : en
})

const insights = computed(() => {
  const zh = [
    { title: '从宁波出发：十年贸易执行中的积累', body: '从询价、样品到单证和出运，回顾全品轩如何在真实订单中逐步完善服务方式。', date: '2026-08-28', image: '/assets/trade-2026/insight-history-ningbo.jpg' },
    { title: '一次性食品包装产品的采购关注点', body: '从材料、尺寸、包装到使用场景，梳理海外采购中需要前置确认的关键内容。', date: '2026-08-20', image: '/assets/trade-2026/insight-sourcing-material.jpg' },
    { title: '从样品到出货：五个质量确认节点', body: '把产品要求落实到样品、物料、生产、包装和出货检查，降低订单执行偏差。', date: '2026-08-12', image: '/assets/trade-2026/insight-quality-check.jpg' },
  ]
  const en = [
    { title: 'From Ningbo: A Decade of Trade Execution', body: 'How real orders have shaped our approach to quotation, sampling, documentation and export delivery.', date: '2026-08-28', image: '/assets/trade-2026/insight-history-ningbo.jpg' },
    { title: 'Sourcing Disposable Food Packaging', body: 'Key questions around materials, dimensions, packaging and applications before an order begins.', date: '2026-08-20', image: '/assets/trade-2026/insight-sourcing-material.jpg' },
    { title: 'From Sample to Shipment: Five Quality Checkpoints', body: 'Connecting samples, materials, production, packaging and final checks to reduce execution variance.', date: '2026-08-12', image: '/assets/trade-2026/insight-quality-check.jpg' },
  ]
  return locale.value === 'zh' ? zh : en
})

watch(
  locale,
  () => {
    document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  },
  { immediate: true },
)
</script>

<template>
  <a class="skip-link" href="#main">{{ locale === 'zh' ? '跳至主要内容' : 'Skip to content' }}</a>
  <SiteHeader />

  <main id="main">
    <section v-if="hero" id="home" class="hero-section" aria-labelledby="home-title">
      <h1 id="home-title" class="hero-accessible-title">{{ hero.title }}</h1>
      <HeroVideo />
    </section>

    <section v-if="!hero" class="section container" aria-live="polite">
      <p v-if="cmsLoading">{{ locale === 'zh' ? '正在加载官网内容…' : 'Loading website content…' }}</p>
      <p v-else role="alert">{{ cmsError || (locale === 'zh' ? '预览不可用，请从 ERP 重新打开。' : 'Preview unavailable. Reopen it from the ERP.') }}</p>
      <button v-if="cmsError" type="button" class="primary-button" @click="reloadCms">{{ locale === 'zh' ? '重试' : 'Retry' }}</button>
    </section>

    <section id="facts" class="facts-section" aria-label="Company facts">
      <div class="container facts-grid">
        <article v-for="fact in facts" :key="fact.value" class="fact-item">
          <component :is="fact.icon" :size="34" weight="regular" aria-hidden="true" />
          <div><strong>{{ fact.value }}</strong><span>{{ fact.label }}</span></div>
        </article>
      </div>
    </section>

    <section id="about" class="section about-section">
      <div class="container split-layout">
        <div class="section-copy">
          <h2>{{ t('about.title') }}</h2>
          <p v-for="paragraph in tm('about.paragraphs').slice(0, 2)" :key="paragraph">{{ paragraph }}</p>
          <RouterLink class="primary-button about-button" :to="{ name: 'about-profile' }">{{ t('about.cta') }} <ArrowRight :size="18" /></RouterLink>
        </div>
        <figure class="about-figure">
          <img src="/assets/trade-2026/home-about-port.png" :alt="t('about.imageAlt')" loading="lazy" decoding="async" fetchpriority="low" />
        </figure>
      </div>
    </section>

    <section id="business" class="section business-section">
      <div class="container">
        <div class="section-heading compact-heading">
          <h2>{{ locale === 'zh' ? '主营业务' : 'Core Business' }}</h2>
        </div>
        <div class="business-grid">
          <RouterLink v-for="(item, index) in businessItems" :key="item.title" class="business-card" :to="{ name: ['business-categories', 'business-categories', 'business-customization', 'business-supply'][index] }">
            <img :src="item.image" :alt="item.title" loading="lazy" decoding="async" fetchpriority="low" />
            <div class="business-card-body">
              <h3>{{ item.title }}</h3>
              <ArrowRight :size="18" aria-hidden="true" />
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section id="culture" class="section home-culture" aria-labelledby="culture-title">
      <div class="container">
        <div class="culture-top">
          <div class="culture-copy">
            <header class="culture-heading">
              <h2 id="culture-title">{{ locale === 'zh' ? '企业文化' : 'Corporate Culture' }}</h2>
              <p>{{ locale === 'zh' ? 'CORPORATE CULTURE' : 'OUR MISSION & VALUES' }}</p>
              <span class="culture-accent" aria-hidden="true"></span>
            </header>
            <div class="culture-purpose">
              <article>
                <Target :size="68" weight="thin" aria-hidden="true" />
                <div><h3>{{ t('purpose.mission') }}</h3><p>{{ t('purpose.missionText') }}</p></div>
              </article>
              <article>
                <Mountains :size="68" weight="thin" aria-hidden="true" />
                <div><h3>{{ t('purpose.vision') }}</h3><p>{{ t('purpose.visionText') }}</p></div>
              </article>
            </div>
          </div>
          <img class="culture-image" src="/assets/trade-2026/home-overseas-coordination.jpg" :alt="locale === 'zh' ? '港口与集装箱货轮' : 'Container ship and port'" loading="lazy" />
        </div>
        <CultureValues :items="companyCopy[locale].values" :label="locale === 'zh' ? '价值观' : 'Our Values'" />
        <RouterLink class="text-link culture-link" :to="{ name: 'corporate-culture' }">{{ locale === 'zh' ? '了解企业文化' : 'Explore Our Culture' }} <ArrowRight :size="20" aria-hidden="true" /></RouterLink>
      </div>
    </section>
    <section id="insights" class="section insights-section">
      <div class="container">
        <div class="section-heading heading-row insights-heading">
          <div><h2>{{ locale === 'zh' ? '新闻动态' : 'News & Updates' }}</h2></div>
          <RouterLink class="text-link" :to="{ name: 'insight-company' }">{{ t('insights.more') }} <ArrowRight :size="18" /></RouterLink>
        </div>
        <div class="insights-grid">
          <RouterLink v-for="(item, index) in insights" :key="item.title" class="insight-card" :to="{ name: index === 0 ? 'insight-company' : 'insight-industry' }">
            <img :src="item.image" :alt="item.title" loading="lazy" decoding="async" fetchpriority="low" />
            <div class="insight-body">
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
              <time :datetime="item.date">{{ item.date }}</time>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="container contact-inner">
        <div><p>{{ t('contact.eyebrow') }}</p><h2>{{ t('contact.title') }}</h2><span>{{ t('contact.body') }}</span></div>
        <RouterLink class="light-button" :to="{ name: 'contact' }">
          {{ t('contact.cta') }}
          <ArrowRight :size="20" weight="bold" />
        </RouterLink>
      </div>
    </section>
  </main>

  <SiteFooter />
</template>













