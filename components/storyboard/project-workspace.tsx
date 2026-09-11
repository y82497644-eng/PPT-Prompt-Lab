"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { JobState } from "@/domain/job-state";
import type { Project } from "@/domain/project";
import type { StoryboardSlide } from "@/domain/storyboard";
import { JobProgress } from "@/components/progress/job-progress";
import { SourceDrawer } from "@/components/sources/source-drawer";
import { SlideThumbnail } from "./slide-thumbnail";

export function ProjectWorkspace({ initialProject }: { initialProject: Project }) {
  const projectId = initialProject.id;
  const [project, setProject] = useState<Project>(initialProject); const [job, setJob] = useState<JobState | null>(null); const [drawerIds, setDrawerIds] = useState<string[] | null>(null); const [dragIndex, setDragIndex] = useState<number | null>(null); const [error] = useState("");
  const loadProject = useCallback(async () => { const response = await fetch(`/api/projects/${projectId}`, { cache: "no-store" }); if (!response.ok) throw new Error("无法读取项目"); setProject(await response.json()); }, [projectId]);
  useEffect(() => { if (!job || ["STORYBOARD_READY", "FAILED", "CANCELLED"].includes(job.status)) return; const timer = window.setInterval(async () => { const response = await fetch(`/api/jobs/${job.id}`, { cache: "no-store" }); const next = await response.json(); setJob(next); if (next.status === "STORYBOARD_READY") await loadProject(); }, 700); return () => window.clearInterval(timer); }, [job, loadProject]);
  async function beginResearch() { const response = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId }) }); setJob(await response.json()); }
  async function saveSlides(slides: StoryboardSlide[]) { if (!project?.storyboard) return; const next = { ...project, storyboard: { ...project.storyboard, slides: slides.map((slide, order) => ({ ...slide, order })) } }; setProject(next); await fetch(`/api/projects/${projectId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storyboard: next.storyboard }) }); }
  function editSlide(index: number, field: "headline" | "summary", value: string) { if (!project?.storyboard) return; const slides = [...project.storyboard.slides]; slides[index] = { ...slides[index], [field]: value }; setProject({ ...project, storyboard: { ...project.storyboard, slides } }); }
  async function regenerate(slideId: string) { const response = await fetch(`/api/storyboard/${projectId}/regenerate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slideId }) }); const slide = await response.json(); if (!project?.storyboard) return; await saveSlides(project.storyboard.slides.map(item => item.id === slideId ? slide : item)); }
  if (error) return <main className="workspace"><p className="error">{error}</p></main>;
  const storyboard = project.storyboard;
  return <main className="workspace">
    <section className="project-head"><div><Link href="/" className="back">← 返回首页</Link><p className="eyebrow">你的演示</p><h1>{project.title}</h1><div className="brief-line"><span>{project.brief.deckType}</span><span>约 {project.brief.pageRange} 页</span><span>给{project.brief.audience}</span>{project.brief.needsRecentResearch && <span>需要近期资料</span>}<button>修改</button></div></div>{!storyboard && !job && <button className="primary" onClick={beginResearch}>开始整理资料 →</button>}</section>
    {project.files.length > 0 && <section className="file-statuses">{project.files.map(file => <span key={file.id} className={file.parseStatus === "FAILED" ? "failed" : ""}>{file.parseStatus === "PENDING" ? "正在读取资料" : file.parseError === "NO_EXTRACTABLE_TEXT" ? "这个 PDF 暂时无法读取正文" : file.parseStatus === "READY" ? `已读取 ${file.originalName}` : `${file.originalName} 暂时无法读取`}</span>)}</section>}
    {!storyboard && job && <JobProgress job={job} />}
    {!storyboard && !job && <section className="ready-card"><div><p className="eyebrow">我们建议这样开始</p><h2>先核对信息，再形成故事线</h2><p>我们会从你的主题和资料中提取关键事实，记录来源，然后生成可以调整的页面大纲。</p></div><button className="primary" onClick={beginResearch}>开始整理 →</button></section>}
    {storyboard && <><section className="story-head"><div><p className="eyebrow">我们建议这样讲</p><h2>{strategyName(storyboard.strategy)}</h2><p>{storyboard.rationale}</p></div><button className="secondary" onClick={beginResearch}>换一种讲法</button></section><div className="slide-list">{storyboard.slides.map((slide, index) => <article key={slide.id} className="slide-row" draggable onDragStart={() => setDragIndex(index)} onDragOver={event => event.preventDefault()} onDrop={() => { if (dragIndex === null) return; const slides = [...storyboard.slides]; const [moved] = slides.splice(dragIndex, 1); slides.splice(index, 0, moved); setDragIndex(null); void saveSlides(slides); }}><span className="drag">⠿</span><span className="slide-no">{String(index + 1).padStart(2, "0")}</span><SlideThumbnail slide={slide} /><div className="slide-fields"><span>{slide.role} · {slide.narrativeBeat}</span><textarea value={slide.headline} onChange={event => editSlide(index, "headline", event.target.value)} onBlur={() => saveSlides(storyboard.slides)} /><textarea value={slide.summary} onChange={event => editSlide(index, "summary", event.target.value)} onBlur={() => saveSlides(storyboard.slides)} /><small>{slide.visualIntent} · {slide.suggestedLayout}{slide.signatureSlide ? " · 重点页面" : ""}</small></div><div className="slide-tools"><button onClick={() => setDrawerIds(slide.sourceRefs)}>{slide.sourceRefs.length} 个来源</button><button onClick={() => regenerate(slide.id)}>↻ 重写本页</button><button aria-label="删除页面" onClick={() => saveSlides(storyboard.slides.filter(item => item.id !== slide.id))}>×</button></div></article>)}</div><button className="add-slide" onClick={() => saveSlides([...storyboard.slides, newSlide(storyboard.slides.length)])}>＋ 新增页面</button></>}
    {drawerIds && <SourceDrawer sources={project.sources.filter(source => drawerIds.includes(source.id))} onClose={() => setDrawerIds(null)} />}
  </main>;
}

function strategyName(strategy: string) { return ({ CONCLUSION_FIRST: "先说结论，再给证据", PROBLEM_SOLUTION: "从问题走向解决", PAST_PRESENT_FUTURE: "用时间讲清变化", MARKET_FUNNEL: "从大趋势收束到机会", COMPARE: "在对比中形成判断", TEACHING: "从问题到理解与应用" } as Record<string, string>)[strategy]; }
function newSlide(order: number): StoryboardSlide { return { id: crypto.randomUUID(), order, role: "CASE", narrativeBeat: "补充说明", headline: "点击输入这一页的核心结论", summary: "补充支持这项结论的必要内容。", claimIds: [], sourceRefs: [], visualIntent: "保持一个主要视觉焦点", suggestedLayout: order % 2 ? "case-spotlight" : "evidence-split", signatureSlide: false, needsReview: true }; }
