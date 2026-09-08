# 腾讯云 CI/CD 部署

## 日常部署：只需在 GitHub 手动运行

1. 推送代码到 `main`，等 **CI** 通过。
2. 在仓库 **Actions → Deploy to Tencent Cloud → Run workflow** 选择 `main`。
3. 正式部署不勾选 `Build only`；勾选只重新构建，不连接服务器。
4. 查看运行摘要中的 CI 链接、准确 commit SHA 和部署结果。

CD 使用 **GitHub 云端 Ubuntu Runner**。电脑可以关机，不依赖 `C:\actions-runner`、本地项目路径或本机计划任务。旧 Runner 没有被此修改卸载或停止；已经排队的旧任务仍使用旧工作流，应手动取消，修改推送后重新 Run workflow，不要 Re-run 旧任务。

CI 与 CD 都不保存构建 Artifact。CD 使用 npm 下载缓存加速安装（这是依赖缓存，不是 `dist` 构建产物）。

## CD 做什么

1. 查询 `ci.yml` 中 `main` 最近创建且成功的 **push CI**，锁定该 run 的 SHA；排除 PR 和其他分支。最新提交 CI 尚未成功时，可能选择更早的成功版本，摘要会显示选择结果。
2. 使用该准确 SHA 重新执行 `npm ci`、`npm run build`，只在临时 Runner 上生成 `dist`。部署工具来自本次手动选择的可信 `main` 工作流版本，不使用旧 CI 版本中的部署脚本。
3. 检查 SSH、服务器 rsync 和现有受限发布命令，错误立即报告。
4. 在服务器 `/tmp/tripeer-upload-<release>.<随机字符>` 创建独立临时目录，并在服务器内复制当前网站文件作为增量基线。不硬链接、不写入正在服务的目录。
5. 用 rsync 校验文件内容，只上传新增/变化的内容。`--delete-delay` 只清理该临时目录里的旧文件，绝不对线上站点直接执行删除同步。
6. 在服务器本地生成兼容压缩包，调用现有 `/usr/local/sbin/tripeer-deploy`，沿用原有版本切换、本机健康检查失败回滚、默认保留 3 个版本逻辑。不经过公网上传整个压缩包。
7. 验证 `http://124.220.2.69:18081/deploy-version.txt` 返回本次准确版本标识，避免把旧站点的 HTTP 200 当成部署成功。
8. 清理临时目录、压缩包和 Runner 上的私钥/构建目录。每次部署尝试使用不同版本目录，不覆盖历史版本。

端口仍是 **18081**，不会修改已有 80 端口站点或重新写 Nginx 配置。公网验证失败时只报告失败，不擅自回滚：有可能只是公网防火墙/网络不可达，而服务器内已发布成功。服务器原有健康检查失败时仍由原有命令自动回滚。

## 一次性配置

### 1. GitHub Secrets

仓库 **Settings → Secrets and variables → Actions → Repository secrets** 需要：

| 名称 | 内容 |
| --- | --- |
| `TENCENT_SSH_PRIVATE_KEY` | `tripeer_github_actions` 私钥的完整内容，包括 BEGIN/END 行，不是 `.pub`，不是指纹。必须无口令。 |
| `TENCENT_SSH_KNOWN_HOSTS` | 从服务器可信终端取得的完整主机公钥行，包含 `124.220.2.69 ssh-ed25519 ...`。 |

之前已创建且仍有效的 Secrets 可以继续用。不要把私钥提交到仓库，也不要把服务器主机密钥验证改为关闭。

### 2. 已初始化服务器检查

在腾讯云控制台终端执行：

```bash
command -v rsync
test -x /usr/local/sbin/tripeer-deploy && echo 'Deploy helper OK'
```

如果没有 rsync，只需安装它（无需重新运行 bootstrap、改 Nginx 或重置 SSH）：

```bash
sudo apt-get update
sudo apt-get install -y rsync
```

脚本固定使用 `ubuntu@124.220.2.69:22`。腾讯云防火墙/系统防火墙需要允许部署来源通过 SSH 22，以及用户通过 TCP 18081 访问网站。若 SSH 仅允许本机 IP，云端 Runner 不在允许范围内，需先调整受控访问方案；不要为解决部署问题关闭整个防火墙。

### 3. 全新服务器初始化（现有服务器不必重做）

下载并检查本仓库的 `bootstrap-server.sh`、`remote-deploy.sh` 后，在两者所在目录执行：

```bash
DEPLOY_PUBLIC_KEY='粘贴部署公钥完整内容' sudo -E bash bootstrap-server.sh
```

初始化脚本安装 Nginx、curl、rsync，创建 `/var/www/tripeer` 和独立 18081 站点，安装受限发布命令及 SSH 公钥。必须先确认端口不被其他站点占用。

## 上传速度和排障

`Incremental upload, activate and verify` 日志会显示：

- SSH 连接/认证检查耗时；
- rsync 总文件量、实际传输文件量、发送/接收字节数、进度及平均传输速率；
- 增量上传耗时、服务器激活耗时和整体耗时。

rsync 按内容校验，忽略重新构建造成的时间戳变化，详见 [rsync 官方手册](https://download.samba.org/pub/rsync/rsync.1)。SSH 建连最长 10 秒；上传连续 60 秒无 I/O 或累计 5 分钟即失败；整个部署步骤最多 10 分钟，工作流最多 15 分钟。不自动退回全量 SCP，也不自动触发第二次部署。

当前服务器已有相同图片/字体时，首次使用本脚本也可复用这些资源。空站点或大量大资源发生变化时，仍需传输相应内容。增量上传减少传输量，但不保证跨网络速度一定达到 Cloudways 的 20 秒。

失败/取消时会尽力清理本次临时目录；机器断网或强制终止可能留下临时文件，日志会给出确切路径。不要递归删除 `/tmp` 或 `/var/www/tripeer` 根目录。

## 本地备用部署

原 `deploy-local.ps1` 保留为手动备用，不由 GitHub CD 调用，仍是本机全量 SCP：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\deploy-local.ps1"
```

需要 Git、GitHub CLI 登录、Node.js 22、npm、OpenSSH、tar 和本机部署私钥。不要与云端 CD 同时运行；GitHub concurrency 只串行化 GitHub 工作流，不能锁住手动本地部署。
