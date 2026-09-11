import { HomeComposer } from "@/components/home/home-composer";
import { StylePicker } from "@/components/styles/style-picker";

export default function HomePage() {
  return <main className="home-page">
    <section className="home-hero"><p className="eyebrow">页间 · 演示创作</p><h1>把你的资料，变成一份<br />真正好看的 PPT。</h1><p className="lead">输入主题，或上传 Word / PDF / PPT。<br />帮你整理内容、寻找资料，再完成故事线和设计。</p></section>
    <HomeComposer />
    <StylePicker />
    <footer className="trust"><span>先看页面大纲</span><span>来源可以追溯</span><span>内容随时能修改</span></footer>
  </main>;
}
