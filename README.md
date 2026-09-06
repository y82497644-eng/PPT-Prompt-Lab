# PPT Prompt Lab

一个无需后端、无需 API Key 的 PPT 提示词生成器 MVP。

## 当前功能

- 选择使用场景
- 输入主题、目标、受众、视觉风格
- 生成完整版 / 精简版 PPT 提示词
- 一键复制
- 内置 3 个示例
- 响应式设计，可直接部署到 GitHub Pages

## 本地运行

直接双击 `index.html` 即可打开。

也可以使用任意静态服务器，例如：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## GitHub Pages 部署

1. 在 GitHub 新建一个公开仓库，例如 `ppt-prompt-lab`
2. 上传本目录中的：
   - `index.html`
   - `style.css`
   - `app.js`
3. 进入仓库 `Settings`
4. 打开 `Pages`
5. 在 `Build and deployment` 中选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. 保存后，GitHub 会生成公网访问地址

## MVP 验证目标

第一阶段不要急着接大模型 API，也不要先做登录、支付和复杂后台。

先验证：
- 是否有人愿意用
- 哪类 PPT 场景使用最多
- 用户生成后是否会复制
- 用户愿不愿意为高质量模板或高级版本付费

建议首批指标：
- 20 个真实用户
- 5 个用户访谈
- 记录至少 10 次真实使用反馈
- 测试 3 次付费意愿

## 下一阶段候选

只有当第一阶段出现真实使用后，再考虑：
- AI 自动扩写
- 行业模板库
- 账号系统
- 收藏历史
- 付费模板
- 小红书渠道落地页
- 数据统计
