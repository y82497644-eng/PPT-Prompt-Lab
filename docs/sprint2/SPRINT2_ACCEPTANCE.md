# Sprint 2 Acceptance

- Next.js App Router 可以启动与构建。
- 首页创建结构化 Project，并将上传文件安全保存到本项目目录。
- 文字型 PDF、DOCX 和 PPTX 可提取正文，并保留页码、段落或 slide provenance。
- 有密钥时使用 OpenAI ResearchProvider；无密钥时使用 MockResearchProvider。
- 来源、Claim 与 Storyboard 进入统一领域模型。
- Storyboard 支持编辑、新增、删除、排序、来源查看与仅重写当前页。
- 项目状态写入本地 ProjectRepository，刷新后可恢复。
- JobState 使用真实服务端状态，不使用虚假百分比。
- 当前不包含图片搜索、PPTX、账号、支付或完整在线编辑器。

当前阻塞：环境没有 `OPENAI_API_KEY`，真实 Web Research 和 FILE+WEB 在线闭环尚未验收，因此 Sprint 2 不能标记 DONE。
