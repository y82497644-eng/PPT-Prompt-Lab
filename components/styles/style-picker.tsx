"use client";

import { useState } from "react";

const styles = [
  { id: "data", name: "数据报告", note: "推荐", className: "mini-data" }, { id: "business", name: "商业简报", note: "", className: "mini-business" }, { id: "editorial", name: "编辑留白", note: "", className: "mini-editorial" },
  { id: "warm", name: "温暖叙事", note: "", className: "mini-warm" }, { id: "mono", name: "黑白观点", note: "", className: "mini-mono" }, { id: "campus", name: "清新校园", note: "", className: "mini-campus" },
];
export function StylePicker() {
  const [selected, setSelected] = useState("data"); const [expanded, setExpanded] = useState(false); const visible = expanded ? styles : styles.slice(0, 3);
  return <section className="style-section"><div className="section-heading"><div><p className="eyebrow">推荐给你</p><h2>选择画面的气质</h2></div>{!expanded && <button className="text-button" onClick={() => setExpanded(true)}>查看全部风格 →</button>}</div><div className="style-grid">{visible.map(style => <button key={style.id} className={`style-option ${selected === style.id ? "selected" : ""}`} onClick={() => setSelected(style.id)}><span className={`mini-slide ${style.className}`}><i className="mini-label">{style.id === "data" ? "2026" : "STORY"}</i><b>{style.id === "business" ? "清晰决策" : style.id === "mono" ? "观点" : "核心标题"}</b><span className="mini-visual"><i></i><i></i><i></i></span></span><strong>{style.name}{style.note && <em>★ {style.note}</em>}</strong></button>)}</div></section>;
}
