import type { Source } from "@/domain/source";

export function SourceDrawer({ sources, onClose }: { sources: Source[]; onClose: () => void }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="source-drawer" onClick={event => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">来源记录</p><h2>这页内容从哪里来</h2></div><button onClick={onClose}>×</button></div>{sources.length ? <div className="source-list">{sources.map(source => <article key={source.id}><span>{source.sourceType === "FILE" ? "来自你的资料" : source.sourceType === "MOCK" ? "待核对资料" : "来自公开网页"}</span><h3>{source.title}</h3><p>{source.publisher}{source.publishedAt ? ` · ${source.publishedAt}` : ""}{source.section ? ` · ${source.section}` : ""}</p>{source.excerpt && <p>{source.excerpt}</p>}{source.url?.startsWith("http") && <a href={source.url} target="_blank" rel="noreferrer">打开来源 ↗</a>}</article>)}</div> : <p className="empty-copy">这页暂时没有可展示的来源。</p>}</aside></div>;
}
