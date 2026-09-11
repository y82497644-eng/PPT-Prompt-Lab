# Job State

进度界面不使用百分比或计时器推演。客户端轮询服务端保存的 JobState，显示真实离散状态。

当前状态：`PROJECT_CREATED`、`UPLOAD_VALIDATING`、`FILE_PARSING`、`RESEARCH_PLANNING`、`WEB_SEARCHING`、`SOURCE_VERIFYING`、`STORYBOARD_DRAFTING`、`STORYBOARD_READY`、`FAILED`、`RETRYING`、`CANCELLED`。

当前本地模式由 Route Handler 启动后台任务，适合开发验证；部署到无常驻进程的平台前应替换为持久任务执行器。
