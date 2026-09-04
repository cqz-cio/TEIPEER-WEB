# 腾讯云 CI/CD 部署

本项目使用两个独立的 GitHub Actions 工作流：

1. `CI` 构建并校验网站，但不保存构建 Artifact。
2. 用户手动启动 `Deploy to Tencent Cloud` 后，工作流查询 `main` 最近一次成功的 push CI，检出对应的准确 commit，临时重新构建并直接上传腾讯云。

CD 的临时 `dist` 和压缩包只存在于 GitHub Runner 的生命周期内，不会上传到 GitHub Artifact。腾讯云服务器保留最近 3 个发布版本。

## 1. 创建专用部署密钥

在可信电脑上生成一对只用于本项目的密钥，不要给私钥设置密码：

```powershell
ssh-keygen -t ed25519 -C "github-actions-tripeer" -f "$env:USERPROFILE\.ssh\tripeer_github_actions"
```

- `tripeer_github_actions` 是私钥。
- `tripeer_github_actions.pub` 是公钥。
- 私钥不能提交到 Git 仓库。

## 2. 初始化腾讯云服务器

先将本次脚本推送到 GitHub。在腾讯云控制台选择“免密连接（TAT）”，登录服务器后只下载两个部署脚本，避免克隆完整的大体积仓库：

```bash
mkdir -p ~/tripeer-bootstrap
cd ~/tripeer-bootstrap
curl -fsSLO https://raw.githubusercontent.com/cqz-cio/TEIPEER-WEB/main/deploy/bootstrap-server.sh
curl -fsSLO https://raw.githubusercontent.com/cqz-cio/TEIPEER-WEB/main/deploy/remote-deploy.sh
DEPLOY_PUBLIC_KEY='粘贴 tripeer_github_actions.pub 的完整内容' sudo -E bash bootstrap-server.sh
```

初始化脚本会：

- 保留现有的端口 80 配置。
- 在端口 18081 创建独立的 Nginx 站点。
- 创建 `/var/www/tripeer`。
- 安装受限的 CI 发布命令。
- 添加 GitHub Actions 专用 SSH 公钥。
- 输出需要保存到 GitHub Secrets 的服务器 Host Key。

## 3. 配置 GitHub Secrets

打开仓库的 `Settings → Secrets and variables → Actions`，创建：

- `TENCENT_SSH_PRIVATE_KEY`：`tripeer_github_actions` 私钥的完整内容。
- `TENCENT_SSH_KNOWN_HOSTS`：初始化脚本最后输出的整行内容。

服务器密码、SSH 私钥和其他凭据都不应写入工作流或源码。

## 4. 发布规则

- Pull Request 会执行 CI，但不会部署。
- 推送到 `main` 后执行 CI。
- CD 不会被 CI 自动触发，只能在 GitHub Actions 页面手动启动。
- 手动启动 CD 后，它会查询 `main` 最近一次成功的 push CI。
- CD 使用该成功 CI 的 commit SHA，不会错误部署后来发生变化或尚未通过 CI 的代码。

## 5. 网络放行

腾讯云轻量应用服务器防火墙需要允许 TCP `18081`。

部署后的访问地址：<http://124.220.2.69:18081/>

配置正式域名后，可以通过独立 `server_name` 共用标准的 80/443 端口，并增加 HTTPS。
