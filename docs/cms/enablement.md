# 官网 CMS 启用与部署

官网：`http://124.220.2.69:18081`。测试 ERP：`http://124.220.2.69/admin/`。
2026-09-14 已核实测试 ERP 的 Flyway V050 成功，TRIPEER 实际 tenantId 为 `163`。

## 首次准备

1. 管理员在 TRIPEER 租户中将站点 1 的官网地址和草稿预览地址都设置为 `http://124.220.2.69:18081`。
2. 在页面内容中分别初始化并发布 `home / zh-CN`、`home / en`，使用官网原有内容作为第一版。
3. 官网 Nginx 按 `deploy/cms-proxy.nginx.example` 配置三个允许访问的接口，替换实际 tenantId 和 ERP 上游地址。本测试环境上游为 `http://127.0.0.1:48081`。2026-09-14 已安装该转发，原配置保存在测试服务器 `/var/backups/tripeer-cms/`。
4. 配置官网 GitHub Repository Variables（不是密码，不必放入 Secrets）：

   | 变量 | 本测试环境取值 |
   | --- | --- |
   | `VITE_CMS_ENABLED` | `true` |
   | `CMS_UPSTREAM` | `http://127.0.0.1:48081` |
   | `CMS_TENANT_ID` | `163` |

   上游地址用于构建配置校验及本地 Vite 代理，不会替代服务器 Nginx 配置；浏览器始终请求同源 `/cms-api`。

## 发布检查

- CI 与 Deploy to Tencent Cloud 的构建步骤读取相同的三个变量。未设置开关时默认为关闭。
- CI 运行 CMS 客户端和部署就绪检查的自动测试。
- 部署在上传/切换版本之前调用 `deploy/check-cms-ready.mjs`。CMS 开启时，中英文首页均须通过官网代理返回正确的站点、语言、版本及内容结构；否则部署失败，当前官网版本不切换。
- 修改变量不会自动更新已部署的网页；需等待最新源码 CI 成功，再手动执行 Deploy to Tencent Cloud，`dry_run=false`。
- 日常内容修改在 ERP 中保存、预览、发布，官网刷新读取新发布版本，不需要每次构建部署。

## 暂停 CMS

将 `VITE_CMS_ENABLED` 设置为 `false` 后重新部署官网，可恢复原有静态首屏。ERP 中的草稿和发布历史保留。不要删除租户或重置数据库来关闭官网 CMS。

## 验证边界

代码和 Nginx 配置完成不代表内容已发布。必须完成管理员站点设置、两个语言的初始发布及真实预览验证后，才能记录启用成功。品牌运营登录账号需要管理员单独创建并分配角色，不能把角色编码当作账号登录。
