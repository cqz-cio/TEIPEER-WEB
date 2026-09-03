<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import {
  PhArrowRight as ArrowRight,
  PhCalendarBlank as CalendarBlank,
  PhCheckCircle as CheckCircle,
  PhCube as Cube,
  PhFileText as FileText,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhHandshake as Handshake,
  PhMagnifyingGlass as MagnifyingGlass,
  PhPackage as Package,
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
        { value: '日用消费品', label: '产品供应方向', icon: Cube },
        { value: '订单协同', label: '从需求到交付', icon: FileText },
        { value: '海外市场', label: '出口服务经验', icon: GlobeHemisphereEast },
      ]
    : [
        { value: '2016', label: 'Founded in Ningbo', icon: CalendarBlank },
        { value: '10 Years', label: 'Trade Execution', icon: CheckCircle },
        { value: 'Daily-use Goods', label: 'Product Focus', icon: Cube },
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
      title: '家居及日用消费品',
      subtitle: 'Home & Daily Essentials',
      body: '根据客户市场与渠道需求，提供厨房、清洁、收纳及相关日用消费品的采购与出口协同。',
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
      title: 'Home & Daily Essentials',
      subtitle: 'Storage · Kitchen · Cleaning · Living',
      body: 'Sourcing and export coordination for kitchen, cleaning, storage and related daily-use products based on market and channel needs.',
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

const capabilities = computed(() => {
  const zh = [
    { title: '产品匹配与寻源', body: '从使用场景、规格、目标价格与交期出发，匹配更适合项目的产品和供应资源。', icon: MagnifyingGlass },
    { title: '订单与供应协同', body: '统一样品、数量、包装和生产节点，减少客户、供应商与物流之间的信息偏差。', icon: UsersThree },
    { title: '质量检查与跟进', body: '把确认样品和产品要求转化为检查重点，并跟踪出货前发现的问题。', icon: ShieldCheck },
    { title: '出口执行与交付', body: '衔接订单、单证、报关与运输安排，持续反馈关键状态和交付进展。', icon: GlobeHemisphereEast },
  ]
  const en = [
    { title: 'Product Matching & Sourcing', body: 'Matching products and supply resources to the use case, specifications, target price and delivery plan.', icon: MagnifyingGlass },
    { title: 'Order & Supply Coordination', body: 'Aligning samples, quantities, packaging and production milestones across the order.', icon: UsersThree },
    { title: 'Quality Checks & Follow-up', body: 'Turning approved requirements into practical checks and following issues before shipment.', icon: ShieldCheck },
    { title: 'Export Execution & Delivery', body: 'Connecting orders, documents, customs and transport with visible milestone updates.', icon: GlobeHemisphereEast },
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
          <a class="primary-button about-button" href="#capabilities">{{ t('about.cta') }} <ArrowRight :size="18" /></a>
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
          <article v-for="item in businessItems" :key="item.title" class="business-card">
            <img :src="item.image" :alt="item.title" />
            <div class="business-card-body">
              <h3>{{ item.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="capabilities" class="section capabilities-section">
      <div class="container">
        <div class="section-heading compact-heading">
          <h2>{{ locale === 'zh' ? '核心能力' : 'Core Capabilities' }}</h2>
        </div>
        <div class="capability-grid">
          <RouterLink v-for="(item, index) in capabilities" :key="item.title" class="capability-item" :to="{ name: ['capability-development', 'capability-supply', 'capability-quality', 'capability-trade'][index] }">
            <div class="capability-topline"><component :is="item.icon" :size="42" /></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <section id="purpose" class="purpose-section">
      <div class="container purpose-layout">
        <div class="purpose-copy">
          <article>
            <Target :size="34" weight="duotone" />
            <div><span>{{ t('purpose.mission') }}</span><p>{{ t('purpose.missionText') }}</p></div>
          </article>
          <article>
            <Handshake :size="34" weight="duotone" />
            <div><span>{{ t('purpose.vision') }}</span><p>{{ t('purpose.visionText') }}</p></div>
          </article>
        </div>
        <img class="map-image" src="/assets/trade-2026/home-overseas-coordination.jpg" :alt="t('purpose.mapAlt')" />
      </div>
    </section>

    <section id="insights" class="section insights-section">
      <div class="container">
        <div class="section-heading heading-row insights-heading">
          <div><h2>{{ locale === 'zh' ? '贸易实践' : 'Trade Practice' }}</h2></div>
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













