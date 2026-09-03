<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { locale } = useI18n()
const route = useRoute()

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      heroTitle: 'Core Business',
      heroSubtitle: 'From product requirements to export delivery',
      sectionTitle: 'Core Business',
      overviewTitle: 'Connecting Product Requirements, Supply and Export Delivery',
      overviewParagraphs: [
        'Founded in Ningbo in 2016, TRIPEER focuses on international trade in daily-use consumer goods. Publicly visible activity is centered on paper-based and disposable daily-use products, while related household and customized products are coordinated according to customer projects.',
        'We do more than pass along a product list. Starting with the market, application, specifications, packaging, quantity and timing, we connect product matching, samples, supplier communication, production follow-up, quality checks, documents and export delivery.',
        'Our role is to keep requirements and execution aligned, helping importers, wholesalers and channel partners reduce information gaps and move each order forward with clearer milestones.',
      ],
      learnMore: 'Learn more',
      cards: [
        ['Paper-based & Disposable Products', 'Products for hygiene, cleaning and daily-use applications, coordinated around material, dimensions, folding, pack counts and packaging requirements.', 'trade-2026/product-paper-disposable.jpg', HouseLine, 'business-categories'],
        ['Home & Daily-use Consumer Goods', 'Selected kitchen, storage, cleaning, bathroom and related products sourced according to market, channel and order needs.', 'trade-2026/product-home-daily.jpg', PencilLine, 'business-categories'],
        ['Product & Packaging Customization', 'Sample, label, packaging structure and carton coordination that turns brand and channel requirements into production-ready details.', 'trade-2026/product-packaging-custom.jpg', Gift, 'business-customization'],
        ['International Trade & Order Services', 'Quotation, sampling, production follow-up, quality checks, documentation, customs and shipping coordination across the order lifecycle.', 'trade-2026/product-trade-order.jpg', Package, 'business-supply'],
      ],
      matrixTitle: 'Product Category Matrix',
      matrixIntro: 'Our product structure starts with publicly visible paper-based and disposable daily-use products, while retaining flexibility for related household, office and customized projects. Final availability, specifications and compliance requirements are confirmed for each inquiry.',
      matrix: [
        ['Paper & Disposable Daily Use', [['Paper hygiene products', 'trade-2026/matrix-paper-hygiene.jpg'], ['Disposable daily-use products', 'trade-2026/matrix-disposable-use.jpg'], ['Commercial-use supplies', 'trade-2026/matrix-commercial-supplies.jpg']], PencilLine],
        ['Home & Daily Essentials', [['Storage & organization', 'trade-2026/matrix-storage.jpg'], ['Kitchen & table', 'trade-2026/matrix-kitchen.jpg'], ['Cleaning & bathroom', 'trade-2026/matrix-cleaning.jpg']], HouseLine],
        ['Office & Customized Projects', [['Stationery & office', 'trade-2026/matrix-office.jpg'], ['Combination products', 'trade-2026/matrix-combination.jpg'], ['Labels & custom packaging', 'trade-2026/matrix-packaging.jpg']], Gift],
      ],
      customizationTitle: 'From Specifications and Samples to Packaging Execution',
      customizationIntro: 'Customization begins with practical order information. We translate the target market, application, specifications, pack count, labeling and timing into details that suppliers can execute, then coordinate samples, revisions and production confirmation.',
      customizationImageAlt: 'Product samples and packaging coordination',
      customizationSteps: [
        ['01', 'Requirement Definition', 'Confirm the target market, application, dimensions, material, pack count, quantity, target price and delivery window.'],
        ['02', 'Product & Packaging Direction', 'Coordinate feasible product, label, inner-pack and carton options based on available supply resources.'],
        ['03', 'Sampling & Detail Approval', 'Review samples and confirm material, size, appearance, folding, labels, packaging and key acceptance points.'],
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
      ctaTitle: 'Have a sourcing requirement or cooperation idea?',
      ctaBody: 'Share a product name or reference image, specifications, quantity, packaging and target date. We will assess the request and recommend a practical next step.',
      ctaButton: 'Talk to us',
    }
  }

  return {
    heroTitle: '主营业务',
    heroSubtitle: '从产品需求到出口交付',
    sectionTitle: '主营业务',
    overviewTitle: '连接产品需求、供应资源与出口交付',
    overviewParagraphs: [
      '宁波全品轩国际贸易有限公司成立于2016年，专注日用消费品国际贸易。公开可见业务以纸制与一次性日用品为基础，并根据客户项目协调家居日用、办公及相关定制产品。',
      '我们不只是转发产品目录，而是从目标市场、使用场景、规格、包装、数量和交期出发，连接产品匹配、样品确认、供应商沟通、生产跟进、质量检查、贸易单证与出口交付。',
      '全品轩的角色，是让客户要求与订单执行保持一致，帮助海外进口商、批发商和渠道客户减少信息偏差，以更清晰的节点推进每一笔合作。',
    ],
    learnMore: '了解更多',
    cards: [
      ['纸制与一次性日用品', '围绕卫生、清洁及日常使用场景，根据材料、尺寸、折叠、包装数量和定制要求协调产品与订单。', 'trade-2026/product-paper-disposable.jpg', HouseLine, 'business-categories'],
      ['家居及日用消费品', '根据市场、渠道和订单需求，协调厨房、收纳、清洁、卫浴及相关日用产品的采购与出口。', 'trade-2026/product-home-daily.jpg', PencilLine, 'business-categories'],
      ['产品与包装定制', '通过样品、标签、包装结构和装箱方式的确认，把品牌和渠道要求落实为可执行细节。', 'trade-2026/product-packaging-custom.jpg', Gift, 'business-customization'],
      ['国际贸易与订单服务', '贯通询价、打样、生产跟进、质量检查、单证、报关及出运安排，让订单执行保持清晰。', 'trade-2026/product-trade-order.jpg', Package, 'business-supply'],
    ],
    matrixTitle: '产品品类矩阵',
    matrixIntro: '以公开可见的纸制与一次性日用品为基础，同时保留家居日用、办公及定制项目所需要的灵活协同能力。具体产品、规格与目标市场合规要求，以每次询盘确认结果为准。',
    matrix: [
      ['纸制与一次性日用品', [['纸制卫生用品', 'trade-2026/matrix-paper-hygiene.jpg'], ['一次性日用产品', 'trade-2026/matrix-disposable-use.jpg'], ['商用场景耗材', 'trade-2026/matrix-commercial-supplies.jpg']], PencilLine],
      ['家居及日用消费品', [['收纳整理', 'trade-2026/matrix-storage.jpg'], ['厨房与餐桌用品', 'trade-2026/matrix-kitchen.jpg'], ['清洁与卫浴用品', 'trade-2026/matrix-cleaning.jpg']], HouseLine],
      ['办公与定制项目', [['文具及办公用品', 'trade-2026/matrix-office.jpg'], ['组合与渠道产品', 'trade-2026/matrix-combination.jpg'], ['标签与定制包装', 'trade-2026/matrix-packaging.jpg']], Gift],
    ],
    customizationTitle: '从规格与样品确认到包装落地',
    customizationIntro: '定制从具体订单信息开始。我们把目标市场、使用场景、产品规格、包装数量、标签与交期转化为供应商可执行的细节，再协调样品、修改与量产确认。',
    customizationImageAlt: '产品样品与包装协同',
    customizationSteps: [
      ['01', '需求与规格确认', '明确目标市场、使用场景、尺寸、材料、包装数量、采购量、目标价格和交付窗口。'],
      ['02', '产品与包装方向', '结合可用供应资源，协调产品、标签、内包装、外箱与装箱方式的可行方案。'],
      ['03', '打样与细节定稿', '通过样品确认材料、尺寸、外观、折叠、标签、包装和关键验收点。'],
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
    ctaTitle: '有采购需求或合作意向？',
    ctaBody: '请提供产品名称或参考图片、规格、数量、包装与目标交期，我们将评估需求并给出可执行的下一步建议。',
    ctaButton: '立即咨询',
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
