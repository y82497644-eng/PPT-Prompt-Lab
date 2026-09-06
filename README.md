# PPT Prompt Lab v1.2

在线仓库目标地址：`https://y82497644-eng.github.io/PPT-Prompt-Lab/`

v1.2 把产品从“PPT 提示词生成器”升级为“高颜值 + 真可编辑 PPT 工作流入口”。

## v1.2 新增

- 首页定位改为：高颜值 + 真可编辑
- 三种创作入口：主题创作 / 文档转 PPT / 旧 PPT 改版
- 可编辑输出要求：文字、图表、模块、禁止整页截图
- 生成完整制作指令 / 精简制作指令
- 可编辑 PPT 路线导航：Google Slides + Gemini / PPT Master / Oh My PPT
- PPT Skills：Dashi PPT Skill / Slides Skill Pack / slide-skill
- 自动把当前 brief 转成 Codex / Claude Code / Cursor 的 Agent 指令
- “可编辑性三项验收”：文字、图表、模块
- 明确说明本站当前不直接托管大模型和第三方 Skill

## 本地运行

直接打开 `index.html`，或：

```bash
python -m http.server 8000
```

## 部署到现有 GitHub Pages

覆盖仓库根目录中的：

- `index.html`
- `style.css`
- `app.js`
- `README.md`

`.gitignore` 可以保留不动。

提交后 GitHub Pages 会自动重新部署，公网 URL 不变。

## 当前产品边界

v1.2 仍是静态 MVP，不直接解析 PDF / DOCX / PPTX，不直接调用模型生成 PPTX。上传文件控件只记录文件名并写进 Agent 指令。

下一阶段只有在真实用户验证后才考虑：

- 文件解析
- 大模型 API
- 直接生成 PPTX
- 用户账号
- 历史记录
- 支付 / 模板商店
