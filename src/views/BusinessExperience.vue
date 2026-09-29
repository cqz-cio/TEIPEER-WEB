<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { companyCopy } from '../company-copy.js'
import { useRoute } from 'vue-router'
import {
  PhArrowRight as ArrowRight,
  PhBoat as Boat,
  PhGift as Gift,
  PhHouseLine as HouseLine,
  PhMagnifyingGlass as MagnifyingGlass,
  PhPackage as Package,
  PhPencilLine as PencilLine,
  PhShieldCheck as ShieldCheck,
  PhUsersThree as UsersThree,
} from '@phosphor-icons/vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { t, locale } = useI18n()
const route = useRoute()

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      heroTitle: 'Core Business',
      heroSubtitle: 'From product requirements to export delivery',
      sectionTitle: 'Core Business',
      overviewTitle: 'Connecting Product Requirements, Supply and Export Delivery',
      overviewParagraphs: companyCopy.en.paragraphs.slice(0, 3),
      learnMore: 'Learn more',
      cards: [
        ['Disposable Food Packaging', 'Paper cups, meal containers, takeaway boxes, cutlery, straws, napkins, bakery packaging, aluminum foil containers and biodegradable packaging for foodservice, retail, hotels and takeaway businesses.', 'trade-2026/home-business-food-packaging.webp', HouseLine, 'business-categories'],
        ['Solid Wood Furniture', 'Dining tables and chairs, bed frames, bedside tables, wardrobes, bookcases, coffee tables and custom solid wood furniture for home retailers, hotel projects, brands, importers and e-commerce sellers.', 'trade-2026/home-business-solid-wood.webp', HouseLine, 'business-categories'],
        ['Product & Packaging Customization', 'Sample, label, packaging structure and carton coordination that turns brand and channel requirements into production-ready details.', 'trade-2026/home-business-customization.webp', Gift, 'business-customization'],
        ['International Trade & Order Services', 'Quotation, sampling, production follow-up, quality checks, documentation, customs and shipping coordination across the order lifecycle.', 'trade-2026/home-business-order-coordination.webp', Package, 'business-supply'],
      ],
      matrixTitle: 'Product Category Matrix',
      matrixIntro: 'Our core business comprises disposable food packaging and solid wood furniture, supported by flexible coordination services. Product selection, specifications and target-market compliance standards are subject to final confirmation for each inquiry.',
      matrix: [
        ['Disposable Food Packaging', [['Paper Products', 'trade-2026/matrix-paper-hygiene.jpg'], ['Plastic Products', 'trade-2026/matrix-disposable-use.jpg'], ['Wooden Products', 'trade-2026/matrix-commercial-supplies.jpg']], PencilLine],
        ['Solid Wood Furniture', [['Dining Room Furniture', 'trade-2026/matrix-storage.jpg'], ['Living Room Furniture', 'trade-2026/matrix-kitchen.jpg'], ['Bedroom Furniture', 'trade-2026/matrix-cleaning.jpg']], HouseLine],
      ],
      customizationTitle: 'From Specifications and Samples to Packaging Execution',
      customizationIntro: 'Customization begins with practical order information. We translate the target market, application, specifications, pack count, labeling and timing into details that suppliers can execute, then coordinate samples, revisions and production confirmation.',
      customizationImageAlt: 'Product samples and packaging coordination',
      customizationSteps: [
        ['01', 'Requirement Definition', 'Confirm the target market, application, dimensions, material, pack count, quantity, target price and delivery window.'],
        ['02', 'Product & Packaging Direction', 'Coordinate feasible product, label, inner-pack and carton options based on available supply resources.'],
        ['03', 'Sampling & Detail Approval', 'Review samples and confirm material, size, appearance, construction, labels, packaging and key acceptance points.'],
        ['04', 'Production & Delivery Alignment', 'Freeze the approved version and align production, quality checks, packing, documents and shipment milestones.'],
      ],
      capabilityTitle: 'Supply-chain Service Capabilities',
      capabilityIntro: 'We connect customer requirements with suitable supply resources and export execution. Clear inputs, visible milestones and timely feedback keep products, packaging, quality and delivery aligned.',
      capabilities: [
        ['Requirement Alignment', 'Clarify applications, specifications, materials, packaging, quantity and delivery goals.', UsersThree],
        ['Product Matching', 'Compare product fit, process, MOQ, timing and supplier coordination requirements.', MagnifyingGlass],
        ['Sampling & Approval', 'Coordinate samples and convert approved details into an executable order baseline.', PencilLine],
        ['Quality Checks', 'Check critical product, packaging and shipment details against confirmed requirements.', ShieldCheck],
        ['Export Delivery', 'Coordinate documents, customs, shipping arrangements and milestone feedback.', Boat],
      ],
      processTitle: 'From Inquiry to Delivery',
      processIntro: 'A clear cooperation process keeps decisions, samples, production and delivery aligned from the first inquiry to after-sales follow-up.',
      process: [
        ['Requirement Alignment', 'Share application, specifications, packaging, quantity, market and target date'],
        ['Proposal & Quotation', 'Confirm product direction, commercial terms, sample plan and estimated timing'],
        ['Sampling & Approval', 'Review product and packaging details and freeze the approved reference'],
        ['Order & Production', 'Confirm order information and follow materials, production and packing milestones'],
        ['Inspection & Shipment', 'Check finished goods and packaging and coordinate documents and shipment'],
        ['Delivery & Follow-up', 'Track key transport milestones and record feedback for the next order'],
      ],
      ctaTitle: t('contact.title'),
      ctaBody: t('contact.body'),
      ctaButton: t('contact.cta'),
    }
  }

  return {
    heroTitle: '业务介绍',
    heroSubtitle: '从产品需求到出口交付',
    sectionTitle: '业务介绍',
    overviewTitle: '连接产品需求、供应资源与出口交付',
    overviewParagraphs: companyCopy.zh.paragraphs.slice(0, 3),
    learnMore: '了解更多',
    cards: [
      ['一次性食品包装产品', '涵盖纸杯、餐盒、外卖打包盒、刀叉勺、吸管、餐巾纸、烘焙包装、铝箔容器及环保可降解包装，服务餐饮、零售、酒店与外卖等场景。', 'trade-2026/home-business-food-packaging.webp', HouseLine, 'business-categories'],
      ['实木家具', '涵盖餐桌椅、床架、床头柜、衣柜、书架、茶几及定制实木家具，服务家居零售、酒店工程、品牌商、进口商和跨境电商卖家。', 'trade-2026/home-business-solid-wood.webp', HouseLine, 'business-categories'],
      ['产品与包装定制', '通过样品、标签、包装结构和装箱方式的确认，把品牌和渠道要求落实为可执行细节。', 'trade-2026/home-business-customization.webp', Gift, 'business-customization'],
      ['国际贸易与订单服务', '贯通询价、打样、生产跟进、质量检查、单证、报关及出运安排，让订单执行保持清晰。', 'trade-2026/home-business-order-coordination.webp', Package, 'business-supply'],
    ],
    matrixTitle: '产品品类矩阵',
    matrixIntro: '公司核心业务包含一次性食品包装产品与实木家具两大板块，可提供灵活协同服务。产品选型、规格参数及目标市场合规标准，均以询盘最终确认内容为准。',
    matrix: [
      ['一次性食品包装产品', [['纸类产品', 'trade-2026/matrix-paper-hygiene.jpg'], ['塑料产品', 'trade-2026/matrix-disposable-use.jpg'], ['木质产品', 'trade-2026/matrix-commercial-supplies.jpg']], PencilLine],
      ['实木家具', [['餐厅家具', 'trade-2026/matrix-storage.jpg'], ['客厅家具', 'trade-2026/matrix-kitchen.jpg'], ['卧室家具', 'trade-2026/matrix-cleaning.jpg']], HouseLine],
    ],
    customizationTitle: '从规格与样品确认到包装落地',
    customizationIntro: '定制从具体订单信息开始。我们把目标市场、使用场景、产品规格、包装数量、标签与交期转化为供应商可执行的细节，再协调样品、修改与量产确认。',
    customizationImageAlt: '产品样品与包装协同',
    customizationSteps: [
      ['01', '需求与规格确认', '明确目标市场、使用场景、尺寸、材料、包装数量、采购量、目标价格和交付窗口。'],
      ['02', '产品与包装方向', '结合可用供应资源，协调产品、标签、内包装、外箱与装箱方式的可行方案。'],
      ['03', '打样与细节定稿', '通过样品确认材料、尺寸、外观、结构、标签、包装和关键验收点。'],
      ['04', '量产与交付协同', '冻结确认版本，同步生产、质量检查、装箱、单证和出运节点。'],
    ],
    capabilityTitle: '供应链服务能力',
    capabilityIntro: '从客户要求到合适的供应资源和出口执行，我们以清晰输入、可见节点和及时反馈，让产品、包装、质量与交付保持一致。',
    capabilities: [
      ['需求沟通', '明确用途、规格、材料、包装、数量与交付目标', UsersThree],
      ['产品匹配', '综合产品适配、工艺、起订量、交期和协同要求', MagnifyingGlass],
      ['打样确认', '协调样品并把确认细节转化为订单执行基准', PencilLine],
      ['质量检查', '按确认要求核对关键产品、包装与出货信息', ShieldCheck],
      ['出口交付', '协调单证、报关、出运安排与关键状态反馈', Boat],
    ],
    processTitle: '从询盘到交付',
    processIntro: '清晰的合作流程让需求、样品、生产和交付始终保持同步，从首次询盘到售后支持都有明确节点。',
    process: [
      ['询盘沟通', '提供用途、规格、包装、数量、目标市场与交期'],
      ['方案与报价', '确认产品方向、商务条款、样品计划与预计周期'],
      ['打样与确认', '核对产品和包装细节，冻结可执行的确认版本'],
      ['订单与生产', '确认订单信息，跟进物料、生产与装箱节点'],
      ['质检与出运', '核对成品与包装，协调单证和出货安排'],
      ['交付与复盘', '跟踪运输关键节点，记录反馈并服务后续订单'],
    ],
    ctaTitle: t('contact.title'),
    ctaBody: t('contact.body'),
    ctaButton: t('contact.cta'),
  }
})

const currentKey = computed(() => route.meta.businessKey || 'overview')
</script>

<template>
  <a class="skip-link" href="#business-main">{{ locale === 'zh' ? '跳转到主要内容' : 'Skip to content' }}</a>
  <SiteHeader />

  <main id="business-main" class="business-page">
    <section class="business-hero" aria-labelledby="business-hero-title">
      <div class="business-hero-media" aria-hidden="true">
        <img src="/assets/trade-2026/business-hero-products.jpg" alt="" />
        <img src="/assets/trade-2026/business-hero-shipping.jpg" alt="" />
      </div>
      <div class="business-hero-shade" aria-hidden="true"></div>
      <div class="business-hero-copy">
        <h1 id="business-hero-title">{{ content.heroTitle }}</h1>
        <p>{{ content.heroSubtitle }}</p>
      </div>
    </section>

    <section class="business-shell business-overview-layout">
      <article class="business-overview-content">
        <template v-if="currentKey === 'overview'">
          <header class="business-heading"><h2>{{ content.overviewTitle }}</h2></header>
          <div class="business-intro-copy">
            <p v-for="paragraph in content.overviewParagraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
          <section class="business-feature-grid" :aria-label="content.sectionTitle">
            <article v-for="card in content.cards" :key="card[0]" class="business-feature-card">
              <img :src="'/assets/' + card[2]" :alt="card[0]" />
              <div class="business-feature-body">
                <div class="business-feature-icon"><component :is="card[3]" :size="28" weight="regular" /></div>
                <h3>{{ card[0] }}</h3>
                <p>{{ card[1] }}</p>
                <RouterLink :to="{ name: card[4] }">{{ content.learnMore }} <ArrowRight :size="14" /></RouterLink>
              </div>
            </article>
          </section>
        </template>

        <template v-else-if="currentKey === 'categories'">
          <header class="business-heading"><h2>{{ content.matrixTitle }}</h2></header>
          <div class="business-intro-copy business-page-intro"><p>{{ content.matrixIntro }}</p></div>
          <div class="business-matrix-grid">
            <article v-for="column in content.matrix" :key="column[0]" class="business-matrix-column">
              <header><component :is="column[2]" :size="25" /><h3>{{ column[0] }}</h3></header>
              <div v-for="item in column[1]" :key="item[0]" class="business-matrix-item">
                <img :src="'/assets/' + item[1]" :alt="item[0]" />
                <strong>{{ item[0] }}</strong>
              </div>
            </article>
          </div>
        </template>

        <template v-else-if="currentKey === 'customization'">
          <header class="business-heading"><h2>{{ content.customizationTitle }}</h2></header>
          <div class="business-intro-copy business-page-intro"><p>{{ content.customizationIntro }}</p></div>
          <div class="business-customization-layout">
            <figure><img src="/assets/trade-2026/business-customization.jpg" :alt="content.customizationImageAlt" /></figure>
            <div class="business-customization-steps">
              <article v-for="step in content.customizationSteps" :key="step[0]">
                <span>{{ step[0] }}</span>
                <div><h3>{{ step[1] }}</h3><p>{{ step[2] }}</p></div>
              </article>
            </div>
          </div>
        </template>

        <template v-else-if="currentKey === 'supply'">
          <header class="business-heading"><h2>{{ content.capabilityTitle }}</h2></header>
          <div class="business-intro-copy business-page-intro"><p>{{ content.capabilityIntro }}</p></div>
          <div class="business-capability-grid">
            <article v-for="(item, index) in content.capabilities" :key="item[0]" class="business-capability-item">
              <component :is="item[2]" :size="48" weight="thin" />
              <h3>{{ item[0] }}</h3>
              <p>{{ item[1] }}</p>
              <ArrowRight v-if="index < content.capabilities.length - 1" class="business-capability-arrow" :size="30" weight="thin" aria-hidden="true" />
            </article>
          </div>
        </template>

        <template v-else>
          <header class="business-heading"><h2>{{ content.processTitle }}</h2></header>
          <div class="business-intro-copy business-page-intro"><p>{{ content.processIntro }}</p></div>
          <ol class="business-process-list">
            <li v-for="(item, index) in content.process" :key="item[0]">
              <div class="business-process-track"><span>{{ index + 1 }}</span></div>
              <h3>{{ item[0] }}</h3>
              <p>{{ item[1] }}</p>
            </li>
          </ol>
        </template>
      </article>
    </section>

    <section class="business-shell business-cta">
      <div><h2>{{ content.ctaTitle }}</h2><p>{{ content.ctaBody }}</p></div>
      <RouterLink :to="{ name: 'contact' }">{{ content.ctaButton }} <ArrowRight :size="20" /></RouterLink>
    </section>
  </main>

  <SiteFooter />
</template>
