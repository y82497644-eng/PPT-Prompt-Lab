"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeComposer() {
  const router = useRouter(); const [topic, setTopic] = useState(""); const [files, setFiles] = useState<File[]>([]); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function createProject() {
    setBusy(true); setError("");
    try { const form = new FormData(); form.set("topic", topic); files.forEach(file => form.append("files", file)); const response = await fetch("/api/projects", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) throw new Error(data.error); localStorage.setItem("yejian:last-project", data.id); router.push(`/project/${data.id}`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "创建失败"); setBusy(false); }
  }
  return <section className="composer" aria-label="创建演示文稿">
    <textarea value={topic} onChange={event => setTopic(event.target.value)} placeholder="例如：为课程准备一份新能源汽车行业趋势报告……" maxLength={300} />
    {files.length > 0 && <div className="file-list">{files.map(file => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}</div>}
    <div className="composer-actions"><label className="upload">＋ 上传资料<input type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md" onChange={event => setFiles(Array.from(event.target.files || []))} /></label><small>PDF · Word · PPT · TXT · MD，单个不超过 20MB。预览版上传内容不会长期保存。</small><button className="primary" disabled={busy} onClick={createProject}>{busy ? "正在创建…" : "开始制作 →"}</button></div>
    {error && <p className="error">{error}</p>}
  </section>;
}
