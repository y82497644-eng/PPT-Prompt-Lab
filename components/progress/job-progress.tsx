import type { JobState, JobStatus } from "@/domain/job-state";

const stages: { status: JobStatus; label: string }[] = [
  { status: "PROJECT_CREATED", label: "已理解你的需求" }, { status: "UPLOAD_VALIDATING", label: "正在检查资料" }, { status: "FILE_PARSING", label: "正在读取资料" }, { status: "WEB_SEARCHING", label: "正在查找可靠资料" }, { status: "SOURCE_VERIFYING", label: "正在核对来源" }, { status: "STORYBOARD_DRAFTING", label: "正在整理故事线" }, { status: "STORYBOARD_READY", label: "故事线已经准备好" },
];
export function JobProgress({ job }: { job: JobState }) {
  const currentIndex = stages.findIndex(stage => stage.status === job.status);
  return <section className="job-card"><p className="eyebrow">正在准备</p><h2>{job.message}</h2><div className="job-stages">{stages.map((stage, index) => { const complete = job.completed.includes(stage.status) || job.status === "STORYBOARD_READY"; const current = index === currentIndex; return <div key={stage.status} className={complete ? "complete" : current ? "current" : "pending"}><span>{complete ? "✓" : current ? "●" : "○"}</span>{stage.label}</div>; })}</div>{job.status === "FAILED" && <p className="error">{job.error || "处理失败"}</p>}</section>;
}
