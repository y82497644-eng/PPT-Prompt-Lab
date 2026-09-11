# Research Pipeline

当前流水线：

1. Brief Interpreter 推断场景、受众、页数与时效需求。
2. DocumentParser 读取 TXT/MD、文字型 PDF、DOCX 段落/列表/表格和 PPTX 逐页文本/备注。
3. Research Planner 形成独立研究问题。
4. ResearchProvider 选择真实 OpenAI Web Search 或本地样例。
5. File Evidence Builder 把文件段落、PDF 页和 PPTX slide 转为 FILE Source 与 Claim。
6. Source Normalizer 合并并去重 FILE/WEB 来源。
7. Source Verifier 清理无效引用，标记无来源事实和数字。
8. Conflict Detector 保留冲突数字和各自出处。
9. Narrative Strategy 推荐故事结构。
10. Storyboard Builder 由经过核验的 Evidence 生成页面大纲。

设置 `OPENAI_API_KEY` 后由服务端 Responses API 执行 Web Search 与结构化输出；未设置时自动使用 MockResearchProvider。

当前环境没有 API Key，因此真实 Web Research 尚未在线验收，不能用 Mock 结果代替。
