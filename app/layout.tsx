import type { Metadata } from "next";
import Link from "next/link";
import { getRuntimeConfig } from "@/lib/config/runtime";
import "./globals.css";

export const metadata: Metadata = { title: "页间｜把资料变成好看的 PPT", description: "整理内容、寻找资料，再完成故事线和设计。" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { appEnvironment } = getRuntimeConfig();
  return <html lang="zh-CN"><body>{appEnvironment === "preview" && <aside className="preview-notice">预览版本 · 项目暂不长期保存</aside>}<header className="topbar"><Link className="brand" href="/"><span>页</span>页间</Link><p>先把故事讲清楚</p></header>{children}</body></html>;
}
