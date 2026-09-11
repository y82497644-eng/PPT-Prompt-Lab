# Security

- API Key 仅从服务端 `process.env.OPENAI_API_KEY` 读取。
- `.env*` 默认忽略，仓库只保留空值 `.env.example`。
- 上传仅允许 PDF、DOCX、PPTX、TXT、MD，单文件上限 20MB。
- 文件使用 UUID 重命名，原文件名不会参与磁盘路径。
- 上传目录固定为 `data/uploads`。
- PDF 解析使用 `pdfjs-dist`；DOCX/PPTX 使用 `fflate` 在内存解包，不创建 C 盘 parser 临时目录。
- 项目 JSON 固定为 `data/local`。
- 当前不提供任意 URL 下载能力；外部请求只能经批准的 ResearchProvider。
- npm cache、TEMP、TMP、Next cache 和测试产物均要求位于 `D:\AIProjects`。
