# 页间（PPT Prompt Lab）

一个面向普通学生和办公用户的消费级 AI PPT Web App 原型。

## Sprint 1

- 极简主题输入与资料上传 UI
- 6 种可视化风格选择
- Storyboard 页面编辑、新增、删除与拖拽排序
- 单页重新生成交互
- 生成进度与预览 Prototype
- 桌面端、平板与移动端响应式适配

当前版本不调用 AI API，不包含数据库、登录、支付或 PPTX 生成。

## 项目结构

```text
.
├── index.html          # 新版应用入口
├── style.css           # 新版视觉系统与响应式样式
├── app.js              # 原型状态与交互逻辑
└── legacy-static/      # 首次部署的 Prompt 生成器备份
```

## 本地运行

项目无第三方依赖，可以直接打开 `index.html`，或使用已有静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署

继续兼容 GitHub Pages 从 `main` 分支根目录部署。仓库历史和远程配置保持不变。
