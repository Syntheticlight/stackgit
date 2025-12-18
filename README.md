# StackGit

**StackGit** 是 StackEdit 的 Serverless 版本，专为 **Cloudflare Pages** 部署优化。
它移除了对后端服务器（Python/Go）的依赖，利用 Cloudflare Functions 处理 OAuth 认证，实现真正的“零成本、免运维”部署。

## 目录结构
*   `index.html`: 前端入口。
*   `static/`: 前端静态资源 (JS, CSS, Fonts)。
*   `functions/`: 后端 API 逻辑 (Cloudflare Workers)。
    *   `conf.js`: 返回配置信息。
    *   `oauth2/[[path]].js`: 处理所有 `/oauth2/*` 的 OAuth 登录请求 (GitHub, Gitee 等)。

## 部署指南 (推荐)

### 方法一：Git 自动部署 (最简单)
1.  Fork 或 Clone 本项目到你的 GitHub。
2.  登录 Cloudflare Dashboard，进入 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
3.  选择你的 `stackgit` 仓库。
4.  **Build settings**:
    *   Framework preset: `None`
    *   Build command: (留空)
    *   Build output directory: (留空，或者填 `.`)
5.  点击 **Save and Deploy**。

### 方法二：Wrangler 命令行
```bash
npm install -g wrangler
wrangler pages deploy . --project-name stackgit
```

## 配置环境变量
部署完成后，必须在 Cloudflare Pages 项目设置中配置环境变量以支持第三方登录：

| 变量名 | 说明 |
| :--- | :--- |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GITEE_CLIENT_ID` | (可选) Gitee Client ID |
| `GITEE_CLIENT_SECRET` | (可选) Gitee Client Secret |

**注意**: OAuth App 的 Callback URL 应设置为 `https://你的项目名.pages.dev/oauth2/callback`。
