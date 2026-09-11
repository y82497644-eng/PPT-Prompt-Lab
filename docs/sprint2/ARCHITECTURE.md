# Sprint 2 Architecture

页间使用 Next.js App Router、React、TypeScript 和 Route Handlers。浏览器只负责用户输入与 Storyboard 编辑；文件写入、研究调用、来源核验和项目持久化只在服务端运行。

核心边界：

- `app`：页面与 HTTP 接口。
- `components`：消费级界面，不暴露内部技术概念。
- `domain`：Project、Source、Claim、Storyboard、DeckSpec、SlideSpec 与 JobState 的 Zod schema。
- `lib/research`：可替换的 ResearchProvider 与研究步骤。
- `lib/storage`：可替换的 ProjectRepository；当前实现为 D 盘 JSON。
- `lib/files`：受限上传与本地资料读取。
- `lib/narrative`、`lib/storyboard`：从 Brief + Evidence 形成故事线和页面大纲。

Sprint 1 保存在 `snapshots/sprint1-before-nextjs`，没有删除 Git 历史或 `legacy-static`。
