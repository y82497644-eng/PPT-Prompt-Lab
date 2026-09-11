# Sprint 2.1 Real-world Acceptance

## CASE A — 纯 Web Research

主题：2026 年印尼光伏市场分析，需要近期政策、市场数据和可靠来源。

状态：`BLOCKED`。

当前环境没有 `OPENAI_API_KEY`。真实 Responses API + Web Search 代码已核对并实现，且只接受工具输出中的 `url_citation`；本轮没有伪造联网结果，也没有用 Mock 标记为通过。

## CASE B — 上传 DOCX / PDF / PPTX

状态：`PASS`。

- `sample.pdf`：提取 1 页文字与数字 120 MW。
- `sample.docx`：提取标题、段落、列表与表格文字 80 MW。
- `sample.pptx`：逐页提取标题、文本框、表格文字与第 2 页 speaker notes。
- 文件段落、PDF 页和 PPTX slide 都生成 FILE Source。
- Claim 的 sourceIds 可以回溯到文件与页码/slide。
- 扫描/无文本 PDF 返回 `NO_EXTRACTABLE_TEXT`。

生产构建后的 HTTP Route Handler 上传验收结果：3 个文件全部为 `READY`，产生 7 条带位置的 FILE Source、7 条文件 Claim、12 页 Storyboard，其中 9 页携带 sourceRefs。单页 regenerate 后，仅目标页 ID 改变，其他页面保持不变。

## CASE C — 文件 + Web

状态：`BLOCKED`（真实在线验收）。

自动测试已验证 FILE 与 WEB Evidence 能进入同一个 Source Ledger 和 Storyboard，但当前没有 API Key，因此 WEB 部分使用测试 provider 数据而非真实联网结果，不能标记真实闭环通过。
