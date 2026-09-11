# 官网内容与 ERP 编辑字段对应表

状态：拟定契约，尚未写入运行代码或数据库。来源为 2026-09-11 本地官网源码。

## 统一命名规则

- `pageKey` 表示页面；`modules.<moduleKey>.<field>` 表示页面中的内容。例：`home` + `modules.hero.title`。
- 页面 API 的内容放在 `content` 中，Vue 获取时解包为 `page`，绑定 `page.modules.hero.title`。不在数据库里存 DOM 选择器。
- 结构定义包含中文编辑名称、类型、长度限制、必填项、允许链接类型、数组项字段和 schemaVersion。
- `image` 是 `{ url, alt }`；`link` 是受校验的站内 pageKey/anchor 或 HTTPS 外链。站内路由交给官网解析。
- 数组项有稳定 `id`，初始保持当前条目数量和顺序。新增/删除/排序只有在组件验证支持后才开放。
- 字体、CSS 类、图标组件、动画、断点不是运营字段。UI 提示文字继续使用前端 i18n。

## 首页：pageKey = home

| ERP 编辑位置 | 拟定字段 | 现有来源 | 接入备注 |
| --- | --- | --- | --- |
| 首屏 / 主标题 | `modules.hero.title` | `messages.js` 的 `hero.title`；App.vue h1 | 第一批闭环字段 |
| 首屏 / 副标题与正文 | `modules.hero.subtitle`, `body` | `hero.subtitle`, `hero.body` | 中英文分别导入 |
| 首屏 / 小标题 | `modules.hero.kicker`, `kickerSuffix` | App.vue 的 RELIABLE TRADE 和语言分支 | 不误用当前未渲染的 hero.eyebrow |
| 首屏 / 背景图 | `modules.hero.image` | `/assets/trade-2026/home-hero-port.jpg` 及 alt | 第一批闭环字段；路径相对官网 |
| 首屏 / 按钮 | `modules.hero.ctaLabel`, `ctaLink` | `hero.cta` 和 `#business` | 使用 home + business 锚点，不能误判为普通页面路径 |
| 公司数据 | `modules.facts.items[].{id,value,label}` | App.vue `facts` | 图标由代码按 id 映射 |
| 公司介绍 | `modules.about.title`, `paragraphs`, `image`, `ctaLabel`, `ctaLink` | messages.about + 首页图片与 about-profile 路由 | 两段正文保持顺序 |
| 主营业务 | `modules.business.title`, `items[].{id,title,image,link}` | App.vue `businessItems` 和对应路由数组 | 当前卡片未显示 subtitle/body，不默认开放没有显示位置的字段 |
| 企业文化 | `modules.culture.title`, `subtitle`, `missionLabel`, `missionText`, `visionLabel`, `visionText`, `image`, `values`, `ctaLabel`, `ctaLink` | App.vue、messages.purpose、cultureValues | 当前内容作为首页摘要，独立于详情正文 |
| 新闻动态 | `modules.news.title`, `selection`, `ctaLabel`, `ctaLink` | App.vue `insights` | selection 只存已发布文章引用/分类规则，正文由 Blog 管理 |
| 联系引导 | `modules.contact.eyebrow`, `title`, `body`, `ctaLabel`, `ctaLink` | messages.contact 和页面链接 | 文案可编辑不代表表单提交已启用 |

现有 hero.title 和 subtitle 中存在字面量 `\\n`。导入时明确换行规范并核对当前表现，不能不经检查改变显示；API 采用真实换行字符，组件按现有版式处理。

## 路由和页面目录

页面目录列出真实内容页；`/about`、`/business`、`/capabilities`、`/news` 为重定向，不创建重复正文。未知路由不是首页内容记录。

| 实际路径 | pageKey | 组件 / 主要编辑内容 |
| --- | --- | --- |
| `/` | `home` | App.vue；见首页表 |
| `/about/profile` | `about-profile` | AboutExperience；标题、介绍段落、事实、服务流程 |
| `/about/history` | `about-history` | AboutExperience；标题、介绍、发展节点 |
| `/about/mission` | `about-mission` | AboutExperience；使命、愿景、原则 |
| `/culture` | `culture` | AboutExperience；正文引用 about-mission，路由标题独立 |
| `/about/markets` | `about-markets` | AboutExperience；市场介绍、地图说明、客户类型 |
| `/business/overview` | `business-overview` | BusinessExperience；概述、业务卡片 |
| `/business/categories` | `business-categories` | BusinessExperience；品类矩阵、说明 |
| `/business/customization` | `business-customization` | BusinessExperience；定制开发步骤 |
| `/business/supply` | `business-supply` | BusinessExperience；供应协同能力 |
| `/business/workflow` | `business-workflow` | BusinessExperience；合作步骤 |
| `/capabilities/development-sourcing` | `capability-development` | CapabilityExperience；介绍、流程、能力说明 |
| `/capabilities/supply-integration` | `capability-supply` | CapabilityExperience；介绍、流程、能力说明 |
| `/capabilities/quality-management` | `capability-quality` | CapabilityExperience；介绍、流程、能力说明 |
| `/capabilities/trade-execution` | `capability-trade` | CapabilityExperience；介绍、流程、能力说明 |
| `/news/company` | `news-company` | InsightsExperience；页面说明 + Blog category=company |
| `/news/events` | `news-events` | InsightsExperience；客户与项目协同说明 + category=events |
| `/news/insights` | `news-industry` | InsightsExperience；行业说明 + category=industry |
| `/news/responsibility` | `news-responsibility` | InsightsExperience；责任说明 + category=responsibility |
| `/contact` | `contact` | ContactExperience；引导文案；联系资料引用 site-global |
| 拟新增 `/news/article/:slug` | 由 Blog slug 定位 | 新增文章详情组件，内容不写入 website_page |

内页字段在扩展阶段逐一按实际模板固化：hero、intro、items/steps、CTA。不能把相同组件的不同路由直接当成同一条内容。共享模块通过显式引用处理；culture 保存正文时编辑的是 about-mission，ERP 须显示“与使命愿景共用”。

## 全站公共资源

| 资源 | 管理字段 | 内容来源 / 存储安排 |
| --- | --- | --- |
| 站点身份 | siteName、siteUrl、previewBaseUrl、template、defaultLocale | 扩展现有站点设置；只有 previewBaseUrl 等缺失字段新增 |
| 品牌与联系资料 | logo、公司名称、简介、地点、联系方式、社交链接、备案与版权 | `site-global` 共享内容记录，复用页面草稿/发布机制；SiteHeader、SiteFooter、ContactExperience 引用 |
| 主导航与页脚导航 | 名称、页面目标、层级、顺序、可见性 | 复用导航模块；需支持不同位置，先核对现有数据模型再添加 placement，避免重复正文存储 |
| 友情链接 | 名称、地址、启用状态 | site-global，未确认的链接保持停用 |
| 文章 | 标题、slug、分类、摘要、正文、封面、时间、语言 | 复用 Blog；首页与新闻页引用同一数据 |
| SEO | title、description、OG 图片、发布状态 | 复用 SEO 模块；建立 pageKey 到实体的映射，不与页面正文维护两份 meta |
| 站内搜索 | 页面目录、已发布文章标题/摘要 | 替换或补充 search-data.js；过滤下线与草稿，限定站点/语言 |

公共资源发布影响多个页面，应在编辑器中明确显示。预览文化页时必须同时解析其共享正文的版本；不能预览时读草稿、发布时意外读取另一个最新版本。

## 初始内容导入规则

1. 从实际渲染表达式追溯内容。messages 中未使用的键、卡片未显示的属性不等于当前网页可编辑字段。
2. zh 映射 zh-CN；en 保持 en。逐语言生成，保留现有内容，不自动编造翻译。
3. 图片初期可使用现有 `/assets/...`；ERP 缩略图按所配置官网地址解析。需要多人编辑时，将新增图片上传到双方可访问的媒体存储，记录稳定地址。
4. 初始化程序使用 tenantCode + siteId + pageKey + locale 查找记录，默认只插入缺失项。已有草稿、版本和运营修改不可被覆盖。
5. 文章卡片仅有标题、摘要等信息，缺少完整正文时导入为草稿并列出待补项，不自动发布。
6. 导入后生成只含记录数、资源 key、缺失字段的报告，不包含账户秘密。对比当前官网后才能初始化正式版本。
