# Data Model

`Project` 是聚合根，包含结构化 `Brief`、上传文件、来源、Claims 和 Storyboard。

- `Source` 保存标题、地址、发布者、时间、来源类型与可选可信度。
- `FILE Source` 不伪造 URL，保存 fileId、文件名、MIME、段落或页码/幻灯片号与摘录。
- `ParsedDocument` 保存全文、分段、页码/幻灯片号、警告和解析元数据。
- `Claim` 保存文字、类型、数字、来源引用、置信度与复核标记。
- `ConflictRecord` 原样保留相同主题的冲突数字及各自来源，不计算平均值。
- `StoryboardSlide` 保存角色、叙事节拍、标题、摘要、Claim、来源、视觉意图和建议版式。
- `DeckSpec`、`SlideSpec` 为后续设计与 PPTX 阶段预留，Sprint 2 不生成文件。
- 所有外部结构化结果进入业务逻辑前必须通过 Zod。

规则：事实或数字 Claim 没有有效来源时会被强制设置为 `needsReview=true`；冲突 Claim 同样需要复核。
