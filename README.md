# 页间（PPT Prompt Lab）

页间是一个 Next.js Web App，核心流程是需求理解、资料读取、资料研究、来源记录、叙事规划与 Storyboard 确认。

## 本地开发

项目要求 Node.js 24，并将 npm cache、`TEMP` 和 `TMP` 指向 `D:\AIProjects\_cache`。配置完成后运行：

```bash
npm run dev
```

运行模式由 `APP_ENV` 控制，可选 `development`、`preview`、`production`。研究模式由 `RESEARCH_MODE` 控制，可选 `mock`、`real`。`real` 模式必须配置服务端 `OPENAI_API_KEY`，否则返回 `RESEARCH_PROVIDER_NOT_CONFIGURED`，不会静默改用样例数据。

## Cloud Preview（Render）

Cloud Preview 仅用于验证公网 Next.js 流程，不是生产部署：

1. 将确认过的代码提交到 GitHub。
2. 在 Render Dashboard 选择 **New Web Service**。
3. 连接本项目 GitHub Repository，并选择 `main` 分支。
4. Runtime 选择 **Node**。
5. Build Command 填写 `npm install && npm run build`。
6. Start Command 填写 `npm start`。
7. Health Check Path 填写 `/api/health`。
8. 配置以下环境变量：

```text
NODE_VERSION=24
APP_ENV=preview
RESEARCH_MODE=mock
```

Preview 暂时使用 Render 实例的 ephemeral storage：Project JSON 保存于 `data/local`，上传文件保存于 `data/uploads`。重新部署、实例重启或平台回收实例后，Project 和 Upload 都可能丢失；多实例之间也不会共享数据。不要把该模式作为生产持久化方案。

当 `APP_ENV=production` 时，当前代码会拒绝启用本地 ProjectRepository、LocalFileStorage 和本地 Job Runner；`RESEARCH_MODE=mock` 同样会被拒绝。正式云存储、数据库和任务系统属于后续阶段。

## 上传范围

- 支持文字型 PDF、DOCX、PPTX、TXT 和 MD。
- 单个文件最大 20MB，服务端继续校验扩展名、MIME 和保存路径。
- Cloud Preview 的上传内容不会长期保存。

## 当前边界

- 不生成 PPTX
- 不搜索或编排图片
- 不包含账号、支付或在线 PowerPoint 编辑器
- 不提供生产级持久化或分布式任务执行

Sprint 1 完整快照位于 `snapshots/sprint1-before-nextjs`。`legacy-static` 仅保留 Sprint 1 历史原型；根目录旧 `index.html`、`style.css` 和 `app.js` 不属于 Next.js 正式入口，也不会干扰 `next build` 或 `next start`。
