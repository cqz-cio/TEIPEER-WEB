import { createRouter, createWebHashHistory } from 'vue-router'

const aboutMeta = (key, zh, en, zhDescription, enDescription) => ({
  aboutKey: key,
  aboutTitle: { zh, en },
  aboutDescription: { zh: zhDescription, en: enDescription },
})

const businessMeta = (key, zh, en, zhDescription, enDescription) => ({
  businessKey: key,
  businessTitle: { zh, en },
  businessDescription: { zh: zhDescription, en: enDescription },
})


const capabilityMeta = (key, zh, en, zhDescription, enDescription) => ({
  capabilityKey: key,
  capabilityTitle: { zh, en },
  capabilityDescription: { zh: zhDescription, en: enDescription },
})

const insightMeta = (key, zh, en, zhDescription, enDescription) => ({
  insightKey: key,
  insightTitle: { zh, en },
  insightDescription: { zh: zhDescription, en: enDescription },
})

export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 84, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home' },
    {
      path: '/about/profile',
      name: 'about-profile',
      meta: aboutMeta(
        'profile',
        '公司概况｜宁波全品轩国际贸易有限公司',
        'Company Profile | Ningbo Tripeer International Trading Co., Ltd.',
        '了解宁波全品轩国际贸易有限公司的企业定位、业务范围与国际贸易服务能力。',
        'Learn about Tripeer, our business scope and international trade service capabilities.',
      ),
    },
    {
      path: '/about/history',
      name: 'about-history',
      meta: aboutMeta(
        'history',
        '发展历程｜宁波全品轩国际贸易有限公司',
        'Our Journey | Ningbo Tripeer International Trading Co., Ltd.',
        '回顾全品轩自2016年成立以来在消费品国际贸易与供应链服务领域的积累。',
        'Explore Tripeer’s journey in consumer-goods trade and supply-chain services since 2016.',
      ),
    },
    {
      path: '/about/mission',
      name: 'about-mission',
      meta: aboutMeta(
        'mission',
        '使命愿景｜宁波全品轩国际贸易有限公司',
        'Mission & Vision | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩连接优质制造与全球需求的使命、愿景与服务原则。',
        'Discover Tripeer’s mission, vision and service principles for connecting quality manufacturing with global demand.',
      ),
    },
    {
      path: '/about/markets',
      name: 'about-markets',
      meta: aboutMeta(
        'markets',
        '海外市场｜宁波全品轩国际贸易有限公司',
        'Overseas Markets | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩立足宁波、面向海外市场的客户协同方式与国际贸易执行能力。',
        'Learn how Tripeer works with overseas markets through responsive sourcing and trade execution.',
      ),
    },
    { path: '/about', redirect: { name: 'about-profile' } },
    {
      path: '/business/overview',
      name: 'business-overview',
      meta: businessMeta(
        'overview',
        '业务概览｜宁波全品轩国际贸易有限公司',
        'Business Overview | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩的消费品供应、制造协同与全球交付服务。',
        'Explore Tripeer’s consumer-goods sourcing, manufacturing coordination and global delivery services.',
      ),
    },
    {
      path: '/business/categories',
      name: 'business-categories',
      meta: businessMeta(
        'categories',
        '产品品类｜宁波全品轩国际贸易有限公司',
        'Product Categories | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩的纸制与一次性日用品、家居日用、办公及定制项目方向。',
        'Explore Tripeer’s paper-based and disposable products, household essentials, office and customized project categories.',
      ),
    },
    {
      path: '/business/customization',
      name: 'business-customization',
      meta: businessMeta(
        'customization',
        '定制与开发｜宁波全品轩国际贸易有限公司',
        'Customization & Development | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩从需求定义、产品开发到打样量产的定制服务。',
        'Learn about Tripeer’s customization process from requirements and development to sampling and production.',
      ),
    },
    {
      path: '/business/supply',
      name: 'business-supply',
      meta: businessMeta(
        'supply',
        '供应链服务｜宁波全品轩国际贸易有限公司',
        'Supply-chain Services | Ningbo Tripeer International Trading Co., Ltd.',
        '了解全品轩的寻源、质量管理、出口与全球交付能力。',
        'Explore Tripeer’s sourcing, quality management, export and global delivery capabilities.',
      ),
    },
    {
      path: '/business/workflow',
      name: 'business-workflow',
      meta: businessMeta(
        'workflow',
        '合作流程｜宁波全品轩国际贸易有限公司',
        'Cooperation Process | Ningbo Tripeer International Trading Co., Ltd.',
        '了解从需求沟通、方案报价到全球交付的合作流程。',
        'Understand the cooperation process from requirements and quotation to global delivery.',
      ),
    },
    { path: '/business', redirect: { name: 'business-overview' } },

    {
      path: '/capabilities/development-sourcing',
      name: 'capability-development',
      meta: capabilityMeta('development', '产品匹配与寻源｜宁波全品轩国际贸易有限公司', 'Product Matching & Sourcing | Tripeer', '了解全品轩从需求分析、产品方向、供应资源匹配到打样确认的寻源方式。', 'Explore Tripeer’s product matching and sourcing process, from requirements to supplier coordination and sampling.'),
    },
    {
      path: '/capabilities/supply-integration',
      name: 'capability-supply',
      meta: capabilityMeta('supply', '订单与供应协同｜宁波全品轩国际贸易有限公司', 'Order & Supply Coordination | Tripeer', '了解全品轩如何连接供应商沟通、采购、生产、包装和物流节点。', 'Explore how Tripeer connects supplier communication, procurement, production, packaging and logistics milestones.'),
    },
    {
      path: '/capabilities/quality-management',
      name: 'capability-quality',
      meta: capabilityMeta('quality', '质量管理｜宁波全品轩国际贸易有限公司', 'Quality Management | Tripeer', '了解全品轩从样品确认、生产过程到出货检验与异常追踪的质量管理机制。', 'Learn about Tripeer’s quality controls from sample approval and production checks to final inspection and corrective follow-up.'),
    },
    {
      path: '/capabilities/trade-execution',
      name: 'capability-trade',
      meta: capabilityMeta('trade', '国际贸易执行｜宁波全品轩国际贸易有限公司', 'International Trade Execution | Tripeer', '了解全品轩在订单、单证、报关、运输跟踪与全球交付方面的国际贸易执行能力。', 'Explore Tripeer’s international trade execution across orders, documentation, customs, shipment tracking and global delivery.'),
    },
    { path: '/capabilities', redirect: { name: 'capability-development' } },
    {
      path: '/news/company',
      name: 'insight-company',
      meta: insightMeta('company', '贸易实践｜宁波全品轩国际贸易有限公司', 'Trade Practice | Tripeer', '了解全品轩自2016年以来在消费品国际贸易与出口订单执行中的经验。', 'Explore Tripeer’s experience in consumer-goods trade and export order execution since 2016.'),
    },
    {
      path: '/news/events',
      name: 'insight-events',
      meta: insightMeta('events', '客户与项目协同｜宁波全品轩国际贸易有限公司', 'Customer & Project Coordination | Tripeer', '了解全品轩在需求沟通、产品筛选和样品确认中的项目协同方式。', 'Explore Tripeer’s approach to requirements, product selection and sample coordination.'),
    },
    {
      path: '/news/insights',
      name: 'insight-industry',
      meta: insightMeta('industry', '行业洞察｜宁波全品轩国际贸易有限公司', 'Industry Insights | Tripeer', '关注消费品、采购、产品开发与国际贸易领域的趋势和实践。', 'Discover perspectives on consumer goods, sourcing, product development and international trade.'),
    },
    {
      path: '/news/responsibility',
      name: 'insight-responsibility',
      meta: insightMeta('responsibility', '责任与可持续｜宁波全品轩国际贸易有限公司', 'Responsibility & Sustainability | Tripeer', '了解全品轩在合规经营、负责任采购与可持续协同方面的理念和实践。', 'Learn about Tripeer’s approach to compliance, responsible sourcing and sustainable collaboration.'),
    },
    { path: '/news', redirect: { name: 'insight-company' } },
    {
      path: '/contact',
      name: 'contact',
      meta: {
        contactTitle: {
          zh: '联系我们｜宁波全品轩国际贸易有限公司',
          en: 'Contact Us | Ningbo Tripeer International Trading Co., Ltd.',
        },
        contactDescription: {
          zh: '联系宁波全品轩国际贸易有限公司，提交产品采购、定制开发、供应链服务或国际贸易合作需求。',
          en: 'Contact Tripeer about product sourcing, customization, supply-chain services or international trade cooperation.',
        },
      },
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
})
