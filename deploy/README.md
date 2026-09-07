# 腾讯云 CI/CD 部署

本项目采用以下发布方式：

1. GitHub Actions CI 在 push 或 Pull Request 时构建并校验网站，不保存构建 Artifact。
2. 用户在 GitHub Actions 手动运行 Deploy to Tencent Cloud (local PC)，由本机 Windows Runner 调用 deploy/deploy-local.ps1；也可继续在本机直接运行脚本。
3. 本地 CD 查询 main 最近一次成功的 push CI，检出该 CI 的准确 commit，在隔离的临时工作树中重新构建，然后从本地网络上传腾讯云。
4. 腾讯云服务器激活新版本、执行健康检查，并保留最近 3 个版本供自动回滚。

本地 CD 不会修改当前开发目录、切换当前分支，也不会把构建产物保存到 GitHub Artifact。

## 1. 本地环境要求

部署电脑需要安装并配置：

- Git
- GitHub CLI，并已执行 gh auth login
- Node.js 22 或更高版本（CI 固定使用 Node.js 22）
- npm
- Windows OpenSSH Client，包含 ssh 和 scp
- tar

默认使用下面的 SSH 私钥：

    C:\Users\当前用户\.ssh\tripeer_github_actions

私钥不能提交到 Git 仓库，也不要发送给其他人。

## 2. 运行部署

在项目根目录打开 PowerShell：

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\deploy-local.ps1"

仅验证选定版本、依赖安装和构建，不上传服务器：

    powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\deploy\deploy-local.ps1" -DryRun

脚本会自动：

- 查询 main 最近一次成功的 push CI；
- 使用该 CI 的 commit SHA，而不是当前未验证的本地代码；
- 创建临时 Git worktree，不影响当前工作目录；
- 执行 npm ci 和 npm run build；
- 检查 dist/index.html 和 dist/assets；
- 创建临时 tar.gz；
- 从本机通过 scp 上传腾讯云；
- 调用服务器受限部署命令激活版本；
- 检查公网地址是否返回 HTTP 200；
- 删除本地临时工作树和压缩包。

## 3. 初始化腾讯云服务器

服务器已经初始化过时不需要重复执行本节。

首次初始化时，在腾讯云控制台使用终端登录服务器，只下载两个小脚本，避免在服务器克隆完整仓库：

    mkdir -p ~/tripeer-bootstrap
    cd ~/tripeer-bootstrap
    curl -fsSLO https://raw.githubusercontent.com/cqz-cio/TEIPEER-WEB/main/deploy/bootstrap-server.sh
    curl -fsSLO https://raw.githubusercontent.com/cqz-cio/TEIPEER-WEB/main/deploy/remote-deploy.sh
    DEPLOY_PUBLIC_KEY='粘贴 tripeer_github_actions.pub 的完整内容' sudo -E bash bootstrap-server.sh

初始化脚本会：

- 保留现有端口 80 配置；
- 在端口 18081 创建独立 Nginx 站点；
- 创建 /var/www/tripeer；
- 安装受限的发布命令；
- 为部署用户添加 SSH 公钥。

## 4. 发布与回滚规则

- CI 不会自动部署。
- CD 可在 GitHub Actions 手动启动，也可在本地手动启动。GitHub CD 仅允许 cqz-cio 从 main 触发，使用 tripeer-deploy 标签的 Windows Runner。PR CI 不使用本机 Runner。
- 只部署 main 最近一次成功 CI 对应的版本。
- 服务器健康检查失败时自动恢复上一个版本。
- 服务器默认只保留最近 3 个正式发布版本。
- GitHub 仓库中的 TENCENT_SSH_PRIVATE_KEY 和 TENCENT_SSH_KNOWN_HOSTS Secrets 不再被本地 CD 使用，可以删除。

## 5. 网站地址

腾讯云轻量应用服务器防火墙需要允许 TCP 18081。

部署地址：<http://124.220.2.69:18081/>

配置正式域名后，可以通过独立 server_name 共用标准的 80/443 端口，并增加 HTTPS。

## 6. GitHub 手动 CD 与本机 Runner

Runner 安装在 C:\actions-runner，以配置了 SSH 密钥的本机用户运行。工作流调用 D:\TEIPEER WEB\deploy\deploy-local.ps1，因此需要保留该目录。工作流使用临时 GITHUB_TOKEN 查询 CI，私钥从本机用户的 .ssh 目录读取。

本机计划任务 TRIPEER GitHub Runner 在用户登录后自动启动 Runner。注销、休眠或关机会使 Runner 离线。后台日志位于 C:\actions-runner\runner-background.log，详细日志位于 C:\actions-runner\_diag。

手动启动后台任务：

    Start-ScheduledTask -TaskName 'TRIPEER GitHub Runner'

查看后台任务状态：

    Get-ScheduledTask -TaskName 'TRIPEER GitHub Runner'

在 Actions 选择 Deploy to Tencent Cloud (local PC)，点击 Run workflow，选择 main。勾选 dry_run 只测试构建；不勾选则正式上传和激活。

电脑必须联网且 Runner 在线。电脑关机或休眠时无法接收任务，GitHub 会排队等待，超过平台排队期限会失败。

仓库公开，本机 Runner 必须只运行可信代码；新增或修改任何工作流时，不要把 PR 或外部贡献者的代码分配到本机 Runner。自定义标签只是任务路由，不能代替安全隔离。
