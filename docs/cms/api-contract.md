# ERP CMS 接口与代码实施约定

状态：完整设计契约；首屏子集已实现，实际接口与限制见 [首批状态](first-slice-status.md)。下文的通用页面列表、历史恢复、多资源组合预览等仍属后续计划。现有 Blog/导航接口继续保留。

## 1. 数据结构

拟新增 `website_page`：id、tenant_id、site_id、page_key、locale、schema_version、draft_json、draft_version、published_revision_id、审计字段。唯一键为 tenant_id + site_id + page_key + locale。

拟新增 `website_page_revision`：id、tenant_id、page_id、revision、schema_version、content_json、发布人、发布时间。发布快照不可变，引用关系检查租户一致性。

共享内容 site-global 复用页面存储，但不是可导航页面。共享正文通过结构定义中的显式引用指定；API 返回解析后的内容及版本来源。预览快照需要同时固定所有被引用资源。

页面结构定义放在 ERP 模板资源中，通过接口提供给后台编辑器；前端维护受版本控制的组件绑定。构建/联调检查 pageKey、moduleKey、字段名及 schemaVersion 一致。ERP 不抓取前端源码、HTML 或截图来猜测模块。

示例为正式内容接口 `data` 中的对象，实际继续使用 ERP 的 CommonResult 包装：

```json
{
  "pageKey": "home",
  "locale": "zh-CN",
  "version": 1,
  "content": {
    "schemaVersion": 1,
    "modules": {
      "hero": {
        "title": "示例标题（仅说明数据形状）",
        "subtitle": "示例副标题",
        "body": "示例正文",
        "image": {
          "url": "/assets/trade-2026/home-hero-port.jpg",
          "alt": "港口作业"
        }
      }
    }
  }
}
```

初始化内容从源码提取，不采用上面的示例文案。

## 2. 新增后台接口

统一前缀 `/admin-api/seo/page`。需要 ERP 登录及对应权限；tenantId 从验证后的租户上下文取得，不信任请求体声明。

| 方法与路径 | 主要参数 | Service 函数 | 权限 |
| --- | --- | --- | --- |
| GET `/list` | siteId、locale | getPageList | seo:page:query |
| GET `/schema` | siteId、pageKey | getPageSchema | seo:page:query |
| GET `/draft` | siteId、pageKey、locale | getDraft | seo:page:query |
| PUT `/draft` | siteId、pageKey、locale、expectedVersion、content | saveDraft | seo:page:update |
| POST `/publish` | siteId、pageKey、locale、expectedVersion | publishPage | seo:page:publish |
| GET `/history` | siteId、pageKey、locale | getPublishHistory | seo:page:query |
| POST `/restore-draft` | siteId、pageKey、locale、revisionId、expectedVersion | restoreDraft | seo:page:update |
| POST `/preview-ticket` | siteId、pageKey、locale、expectedVersion、可选资源版本选择 | createPreviewTicket | seo:page:preview；所选其他资源另验权限 |

`getDraft` 纯读取，不通过 GET 隐式创建或写入记录。页面由初始化流程创建；找不到时明确返回未初始化。

`saveDraft`：检查权限与归属 → 校验 schema、字段和媒体引用 → 以 expectedVersion 条件更新 → draft_version 递增并返回新值。版本不匹配返回可识别的冲突码；不能返回保存成功。

`publishPage`：事务内锁定记录/条件检查版本 → 校验内容 → 插入发布快照 → 更新 published_revision_id → 记录审计 → 提交。失败完整回滚。当前语言的发布不影响其他语言。只有提交后才触发缓存失效。

`restoreDraft`：读取同租户同页面的历史快照，校验/迁移 schema，使用版本条件写入新草稿。恢复不直接覆盖正式版本。

`createPreviewTicket`：验证操作者对所选页面及资源的权限；将草稿内容复制为短期不可变快照，记录相关已发布资源版本。生成高熵一次性 ticket，有限 TTL；原子兑换，不能重复使用。预览数据可存 Redis，TTL 到期自动清理。

## 3. 新增官网接口

统一前缀 `/app-api/seo/page`。公开访问不携带 ERP 管理员令牌。

| 方法与路径 | 输入 | 输出 |
| --- | --- | --- |
| GET `/public` | siteId、pageKey、locale；租户上下文 | 已发布页面 content 和版本；从不返回 draft_json |
| POST `/preview/exchange` | ticket | 短期 previewSession、过期时间、pageKey、locale |
| GET `/preview` | `X-Page-Preview-Session` 请求头 | 经授权的页面快照与公共资源快照包 |

预览响应采用 `Cache-Control: private, no-store`，并设置禁止搜索索引的响应头。会话绑定租户、站点、语言、入口页面、允许资源及配置的预览来源。ticket/会话不写入日志、localStorage、Git。

整页预览的数据包包括 page、site-global、navigation、按需 articles 及版本清单。权限之外的资源不能读草稿；所需文章内容按明确 ID/列表固定，不能用“读取最新草稿”代替快照。预览中进入未授权页面时明确提示重新生成预览或转普通正式访问，不静默扩大权限。

初期公开页面内容响应禁用缓存；后续如缓存，缓存键必须包含 tenantId/siteId/pageKey/locale/版本，并配套导航、文章与共享内容更新后的失效策略。浏览器正常刷新才读取新内容，不默认实现实时推送。

## 4. 复用和扩展现有模块

已核对的现有接口：

```text
GET  /app-api/seo/blog/public
GET  /app-api/seo/blog/public/{slug}
POST /admin-api/seo/blog/preview-ticket
POST /app-api/seo/blog/preview/exchange
GET  /app-api/seo/blog/preview

GET  /app-api/seo/navigation/public
GET  /admin-api/seo/navigation/draft
PUT  /admin-api/seo/navigation/draft
POST /admin-api/seo/navigation/publish
POST /admin-api/seo/navigation/preview-ticket
POST /app-api/seo/navigation/preview/exchange
GET  /app-api/seo/navigation/preview
```

现有 Blog 列表接口缺少分类筛选参数，需要扩展；同阶段增加公开的已发布文章搜索条件。现有 Blog 和导航预览会话的资源范围不同，统一整页预览应通过有权限校验的服务组合快照，而不是混用现有 token。

导航模板新增 TRIPEER_CORPORATE 与本站页面映射。站点设置增加 previewBaseUrl 并与 siteUrl 分离；现有 Blog/nav 预览地址生成器也要适配这个入口。初期保留原有接口，避免影响家具站点。

SEO 继续复用现有解析接口，开发时确认实体类型与 pageKey 的映射。不要直接把 pageKey 字符串塞进要求数值 entityId 的参数。

## 5. 预期代码改动位置

以下路径中“新增”是计划文件名，开始实现时可按仓库习惯细化。

| 仓库 | 位置 | 工作 |
| --- | --- | --- |
| 官网 | 新增 `src/cms/client.js` | 请求封装、ERP 错误码处理、超时、预览请求头；公开和预览请求分开 |
| 官网 | 新增 `src/cms/page-registry.js` | pageKey → 路由/组件/内容引用映射 |
| 官网 | 新增 `src/cms/usePageContent.js` | 加载当前页面和语言、取消过期请求、防止数据串页 |
| 官网 | 新增 `src/cms/preview-context.js` | ticket 兑换、内存会话、预览资源快照与过期处理 |
| 官网 | 新增 `src/cms/useSiteContent.js` | 页头/页脚共享信息、导航、文章引用的统一数据来源 |
| 官网 | `src/App.vue`、各 Experience 组件 | 保留结构样式，将对应字段改为 CMS 绑定 |
| 官网 | `src/AppShell.vue`、`src/router-full.js` | 预览入口、文章详情分发、404，避免默认渲染错误组件 |
| 官网 | `src/components/SiteHeader.vue`、`SiteFooter.vue` | 导航/全局信息绑定，公共内容共享 |
| 官网 | `src/components/SiteSearch.vue`、`src/search-data.js` | 已发布内容搜索来源和失效处理 |
| 官网 | `vite.config.js`、部署代理配置 | 同源 CMS 代理、站点上下文、接口白名单 |
| ERP 服务端 | yudao-module-seo 新增 page controller/service/DO/mapper/VO | 页面结构、草稿、发布和预览 |
| ERP 服务端 | 模板资源、数据库迁移 | TRIPEER 页面 schema、数据表、菜单权限；迁移编号实施时分配 |
| ERP 服务端 | Blog/navigation/config 模块 | 分类、语言、模板、预览地址和资源组合 |
| ERP 管理端 | 新增页面内容管理视图/API | 页面选择、语言、表单、版本冲突、预览/发布/历史 |
| ERP 管理端 | 现有 Blog/导航/站点设置视图 | 去除固定英文限制、绑定本站模板与预览地址 |

## 6. 本地接口连通与部署

官网浏览器请求 `/cms-api/...`，Vite 在本地转发到已确认版本的测试 ERP；部署后由网站服务器承担同等代理。仅暴露需要的公共和凭证保护的预览路径，不代理 `/admin-api`。

代理固定本站 tenant-id，覆盖浏览器同名请求头，并剥离不应透传的租户访问覆盖头。pageKey/siteId 等仍由后端验证属于本站；公开租户 ID 本身不是密码，也不能替代管理授权。

地址/标识可通过部署环境变量配置；任何会被 Vite 打包到浏览器的变量均视为公开信息。SSH、数据库密码及任何服务秘密只能用于服务端或部署环境。

Hash 路由阶段建议预览入口格式为 `/#/cms-preview?ticket=...`。ticket 位于 fragment 内，由前端路由读取并在兑换后删除；不要再附加第二个 `#`。页面来源由会话确定，不信任地址中任意 pageKey。刷新丢失内存会话时提示从 ERP 重新打开。

若后续改 History 路由，统一调整预览 URL 构建、静态服务器回退和旧链接兼容；不能只修改 router 一处。

## 7. 实现时必须覆盖的错误边界

- 未初始化、未发布、错误语言、未知 schemaVersion 分别处理，不用本地样例冒充线上正式内容。
- 保存冲突、发布失败、预览过期必须明确反馈，不能继续显示成功状态。
- 普通文本采用 Vue 转义输出；文章富文本使用统一允许列表清理。图片与链接做协议和长度校验，不允许把任意代码当内容执行。
- 预览与正式数据的缓存、Store 和搜索必须隔离；结束预览立即清空相关内存上下文。
- 新增图片引用必须校验媒体归属；私有或临时签名 URL 不能直接作为长期发布地址。
- 导入可见文案后检查首页字面换行、共享文化内容、未使用字段、没有正文的新闻卡片和未启用联系方式。

这些约定在第一个首页闭环验收后再扩展，避免先改完所有页面才发现接口契约不一致。
