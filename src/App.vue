<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import {
  PhArrowRight as ArrowRight,
  PhCalendarBlank as CalendarBlank,
  PhCheckCircle as CheckCircle,
  PhHouseLine as HouseLine,
  PhFileText as FileText,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhMountains as Mountains,
  PhNotePencil as NotePencil,
  PhChartLineUp as ChartLineUp,
  PhShieldCheck as ShieldCheck,
  PhTarget as Target,
  PhUsersThree as UsersThree,
} from '@phosphor-icons/vue'

const { t, locale } = useI18n()
const facts = computed(() =>
  locale.value === 'zh'
    ? [
        { value: '2016', label: '成立于宁波', icon: CalendarBlank },
        { value: '10年', label: '贸易执行积累', icon: CheckCircle },
        { value: '家居用品', label: '品质家居供应', icon: HouseLine },
        { value: '订单协同', label: '从需求到交付', icon: FileText },
        { value: '海外市场', label: '出口服务经验', icon: GlobeHemisphereEast },
      ]
    : [
        { value: '2016', label: 'Founded in Ningbo', icon: CalendarBlank },
        { value: '10 Years', label: 'Trade Execution', icon: CheckCircle },
        { value: 'Home Essentials', label: 'Quality Home Supply', icon: HouseLine },
        { value: 'Order Coordination', label: 'Requirement to Delivery', icon: FileText },
        { value: 'Overseas Markets', label: 'Export Service', icon: GlobeHemisphereEast },
      ],
)

const businessItems = computed(() => {
  const zh = [
    {
      title: '纸制与一次性日用品',
      subtitle: 'Paper-based & Disposable Products',
      body: '围绕卫生、清洁及日常使用场景，协调产品规格、材料、折叠方式、包装数量与定制要求。',
      image: '/assets/trade-2026/product-paper-disposable.jpg',
    },
    {
      title: '家居用品',
      subtitle: 'Home Essentials',
      body: '根据客户市场与渠道需求，提供厨房、收纳、清洁及卫浴等家居用品的采购与出口协同。',
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
      title: 'Paper-based & Disposable Products',
      subtitle: 'Hygiene · Cleaning · Daily Use',
      body: 'Coordinating specifications, materials, folding, pack counts and customization for hygiene, cleaning and daily-use applications.',
      image: '/assets/trade-2026/product-paper-disposable.jpg',
    },
    {
      title: 'Home Essentials',
      subtitle: 'Storage · Kitchen · Cleaning · Living',
      body: 'Sourcing and export coordination for kitchen, storage, cleaning and bathroom essentials based on market and channel needs.',
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

const cultureValues = computed(() => {
  const zh = [
    { title: '可靠', body: '重视承诺，让合作可预期。', icon: ShieldCheck },
    { title: '专业', body: '清晰流程，细致执行。', icon: NotePencil },
    { title: '协同', body: '及时沟通，高效配合。', icon: UsersThree },
    { title: '长期', body: '持续改进，共创长期价值。', icon: ChartLineUp },
  ]
  const en = [
    { title: 'Reliability', body: 'Honor commitments. Make cooperation dependable.', icon: ShieldCheck },
    { title: 'Professionalism', body: 'Clear processes. Careful execution.', icon: NotePencil },
    { title: 'Collaboration', body: 'Timely communication. Effective teamwork.', icon: UsersThree },
    { title: 'Long-term Focus', body: 'Keep improving. Create lasting value together.', icon: ChartLineUp },
  ]
  return locale.value === 'zh' ? zh : en
})

const insights = computed(() => {
  const zh = [
    { title: '从宁波出发：十年贸易执行中的积累', body: '从询价、样品到单证和出运，回顾全品轩如何在真实订单中逐步完善服务方式。', date: '2026-08-28', image: '/assets/trade-2026/insight-history-ningbo.jpg' },
    { title: '纸制与一次性日用品的采购关注点', body: '从材料、尺寸、包装到使用场景，梳理海外采购中需要前置确认的关键内容。', date: '2026-08-20', image: '/assets/trade-2026/insight-sourcing-material.jpg' },
    { title: '从样品到出货：五个质量确认节点', body: '把产品要求落实到样品、物料、生产、包装和出货检查，降低订单执行偏差。', date: '2026-08-12', image: '/assets/trade-2026/insight-quality-check.jpg' },
  ]
  const en = [
    { title: 'From Ningbo: A Decade of Trade Execution', body: 'How real orders have shaped our approach to quotation, sampling, documentation and export delivery.', date: '2026-08-28', image: '/assets/trade-2026/insight-history-ningbo.jpg' },
    { title: 'Sourcing Paper-based & Disposable Daily-use Products', body: 'Key questions around materials, dimensions, packaging and applications before an order begins.', date: '2026-08-20', image: '/assets/trade-2026/insight-sourcing-material.jpg' },
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
    <section id="home" class="hero-section">
      <img class="hero-media" src="/assets/trade-2026/home-hero-port.jpg" alt="Container vessel and port operations in Ningbo" />
      <div class="hero-wash" aria-hidden="true"></div>
      <div class="container hero-content">
        <p class="hero-kicker">RELIABLE TRADE <span>{{ locale === 'zh' ? '清晰协同' : 'ORDER COORDINATION' }}</span></p>
        <h1>{{ t('hero.title') }}</h1>
        <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
        <p class="hero-body">{{ t('hero.body') }}</p>
        <a class="primary-button" href="#business">
          {{ t('hero.cta') }}
          <ArrowRight :size="20" weight="bold" />
        </a>
      </div>
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
          <p>{{ t('about.paragraph1') }}</p>
          <p>{{ t('about.paragraph2') }}</p>
          <RouterLink class="primary-button about-button" :to="{ name: 'about-profile' }">{{ t('about.cta') }} <ArrowRight :size="18" /></RouterLink>
        </div>
        <figure class="about-figure">
          <img src="/assets/trade-2026/home-about-team.jpg" :alt="t('about.imageAlt')" />
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
            <img :src="item.image" :alt="item.title" />
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
        <div class="culture-values">
          <article v-for="item in cultureValues" :key="item.title" class="culture-value">
            <component :is="item.icon" :size="60" weight="thin" aria-hidden="true" />
            <div><h3>{{ item.title }}</h3><p>{{ item.body }}</p></div>
          </article>
        </div>
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
            <img :src="item.image" :alt="item.title" />
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













