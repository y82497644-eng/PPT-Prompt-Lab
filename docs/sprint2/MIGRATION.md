# Migration

迁移采用并行保留方式：根目录新增 Next.js 应用，旧静态文件仍留在 Git 工作区，Sprint 1 当前成果另存完整快照。

正式入口从 `file://index.html` 迁移为 Next.js HTTP 服务。旧 GitHub Pages 部署不会自动提供服务端 Research 能力；Sprint 2 需要支持 Node.js 的部署环境。

本轮没有 commit、push、rebase、reset、clean 或修改远程仓库。
