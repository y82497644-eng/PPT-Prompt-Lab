const $ = (id) => document.getElementById(id);

const fields = {
  sourceType: $("sourceType"), scene: $("scene"), pages: $("pages"), topic: $("topic"), goal: $("goal"),
  audience: $("audience"), style: $("style"), mustKeep: $("mustKeep"), extra: $("extra"), sourceFile: $("sourceFile")
};
let mode = "full";
let latestData = null;
const safe = (value, fallback = "未特别说明") => String(value || "").trim() || fallback;

function collectData(){
  return {
    sourceType: fields.sourceType.value,
    scene: fields.scene.value,
    pages: fields.pages.value,
    topic: fields.topic.value,
    goal: fields.goal.value,
    audience: fields.audience.value,
    style: fields.style.value,
    mustKeep: fields.mustKeep.value,
    extra: fields.extra.value,
    sourceFile: fields.sourceFile.files?.[0]?.name || "无",
    editableText: $("editableText").checked,
    editableCharts: $("editableCharts").checked,
    editableShapes: $("editableShapes").checked,
    avoidImageDeck: $("avoidImageDeck").checked
  };
}

function editableRequirements(d){
  const req=[];
  if(d.editableText) req.push("所有标题和正文必须保持为可单独编辑的文本对象");
  if(d.editableCharts) req.push("图表应尽量使用可修改数据的原生图表/可替换结构，不要把图表烘焙成截图");
  if(d.editableShapes) req.push("卡片、形状、模块必须保持为独立对象，可移动、缩放和重排");
  if(d.avoidImageDeck) req.push("禁止把整页设计导出为单张图片再塞进 PPTX 冒充可编辑 PPT");
  return req.length ? req.map((x,i)=>`${i+1}. ${x}`).join("\n") : "无额外可编辑要求";
}

function buildFullPrompt(d){
  return `你是一名资深演示设计师、信息架构师和 PowerPoint 制作工程师。\n\n请根据下面需求，完成一套“高颜值 + 真可编辑”的 PPT 制作方案。重点不是快速生成一堆页面，而是让最后的 PPTX 在 PowerPoint / WPS 中仍然可以继续返工。\n\n【项目 brief】\n- 创作方式：${d.sourceType}\n- 使用场景：${d.scene}\n- 主题：${safe(d.topic,"请根据材料提炼主题")}\n- 页数：约 ${d.pages} 页\n- 目标受众：${safe(d.audience)}\n- 核心目标：${safe(d.goal)}\n- 视觉风格：${d.style}\n- 参考文件：${d.sourceFile}\n- 必须保留：${safe(d.mustKeep,"无")}\n- 补充要求：${safe(d.extra,"无")}\n\n【硬性可编辑要求】\n${editableRequirements(d)}\n\n【内容与叙事要求】\n1. 先提炼“听众最终只需要记住的一句话”，再设计整套 PPT 主线。\n2. 每页只承担一个主要信息任务；标题必须尽量写成结论句，而不是“背景 / 现状 / 分析 / 总结”等空标题。\n3. 先确定页面角色：封面、问题、证据、方案、数据、对比、流程、路线图、结论等，再选择版式。\n4. 如果材料里有数据、引用、政策、案例，不得编造；缺少数据就明确标注待补。\n5. 不要为了“高级感”堆无意义渐变、玻璃拟态、发光线条、随机图标或 AI 装饰。\n6. 视觉统一：同一套字体、色板、圆角、间距和图表语言贯穿整套。\n\n【高颜值设计要求】\n- 默认 16:9；\n- 建立 1 个主色 + 1 个强调色 + 中性色系统；\n- 每页保留充分留白，正文控制在演示可读范围；\n- 数据页优先用“结论 + 关键数字 + 图表”结构；\n- 图文页优先使用真实图片 / 产品截图 / 信息图，而不是装饰性图库；\n- 重要数字、结论、关键词必须形成明显视觉层级。\n\n【请按以下格式输出】\n\n一、整套 PPT 定位\n- 一句话核心信息\n- 受众与使用场景\n- 演讲结束后希望受众采取的行动\n- 整体故事线\n\n二、逐页设计方案（第 1 页到第 ${d.pages} 页）\n每页必须包含：\n- 页码 / 页面角色\n- 结论式标题\n- 具体内容\n- 推荐布局\n- 推荐图表 / 图片 / 视觉元素\n- 哪些元素必须保持原生可编辑\n- 演讲者提示（必要时）\n\n三、视觉系统\n- 配色\n- 字体层级\n- 间距与网格\n- 图表样式\n- 图片风格\n- 禁止出现的低质设计元素\n\n四、可编辑交付规范\n- PPTX 中哪些元素必须是文本框、形状、表格、图表等原生对象\n- 哪些元素允许使用图片\n- 不允许出现整页截图式 PPT\n\n五、交付前 QA\n随机抽至少 3 页检查：\n1. 标题 / 正文能否直接编辑；\n2. 图表能否修改数据或替换；\n3. 一个内容模块能否整块移动。\n同时检查：内容溢出、低对比度、重复页面、AI 套话、事实错误、字体缺失。\n\n如果你具备生成 PPTX 的能力，请直接生成可编辑 PPTX；如果当前只能输出方案，请明确告诉我下一步用什么工具 / Skill 执行，不要把整页图片式 PPT 称为“可编辑 PPT”。`;
}

function buildCompactPrompt(d){
  return `请制作一套约 ${d.pages} 页的高颜值、可编辑 ${d.scene} PPT。\n\n主题：${safe(d.topic)}\n创作方式：${d.sourceType}\n参考文件：${d.sourceFile}\n目标：${safe(d.goal)}\n受众：${safe(d.audience)}\n风格：${d.style}\n必须保留：${safe(d.mustKeep,"无")}\n补充：${safe(d.extra,"无")}\n\n可编辑要求：\n${editableRequirements(d)}\n\n先梳理故事线，再逐页输出“结论式标题 / 内容 / 布局 / 视觉元素 / 可编辑对象”。不要编造数据，不要做成整页截图式 PPT。最后必须随机抽 3 页检查文字、图表和模块是否仍可编辑。`;
}

function render(){
  latestData=collectData();
  if(!latestData.topic.trim()){
    fields.topic.focus();
    fields.topic.placeholder="请先输入 PPT 主题，例如：AI教育产品融资路演";
    return;
  }
  const text=mode==="full"?buildFullPrompt(latestData):buildCompactPrompt(latestData);
  $("resultText").textContent=text;
  $("charCount").textContent=`${text.length} 字符`;
  $("emptyState").classList.add("hidden");
  $("resultWrap").classList.remove("hidden");
}

$("generateBtn").addEventListener("click",render);
$("fullBtn").addEventListener("click",()=>{mode="full";$("fullBtn").classList.add("active");$("compactBtn").classList.remove("active");if(latestData)render();});
$("compactBtn").addEventListener("click",()=>{mode="compact";$("compactBtn").classList.add("active");$("fullBtn").classList.remove("active");if(latestData)render();});

async function copyText(text,button,normal){
  try{await navigator.clipboard.writeText(text)}catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove()}
  button.textContent="已复制";setTimeout(()=>button.textContent=normal,1200);
}
$("copyBtn").addEventListener("click",()=>copyText($("resultText").textContent,$("copyBtn"),"复制制作指令"));

document.querySelectorAll(".source-tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".source-tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");fields.sourceType.value=btn.dataset.source;
}));

$("resetBtn").addEventListener("click",()=>{
  fields.scene.value="课程汇报";fields.pages.value="10";fields.topic.value="";fields.goal.value="";fields.audience.value="";fields.style.selectedIndex=0;fields.mustKeep.value="";fields.extra.value="";fields.sourceFile.value="";fields.sourceType.value="主题创作";
  ["editableText","editableCharts","editableShapes","avoidImageDeck"].forEach(id=>$(id).checked=true);
  document.querySelectorAll(".source-tab").forEach((x,i)=>x.classList.toggle("active",i===0));
  latestData=null;$("resultWrap").classList.add("hidden");$("emptyState").classList.remove("hidden");
});

const examples={
  business:{scene:"商业路演",pages:"10",topic:"AI教育产品融资路演",goal:"让早期投资人快速理解市场机会、产品差异化、商业模式与增长潜力",audience:"早期投资人",style:"商务咨询、蓝灰配色、数据优先",mustKeep:"产品名称、核心商业模式、已有用户数据",extra:"首页不要堆字；市场机会、产品流程、竞争壁垒和融资用途必须突出；所有图表可改数据"},
  class:{scene:"课程汇报",pages:"12",topic:"低空经济行业趋势分析",goal:"让老师快速理解行业定义、政策驱动、产业链、市场空间与主要风险",audience:"大学老师与同学",style:"学术专业、图表清晰、严谨克制",mustKeep:"课程名称、成员信息、参考资料",extra:"强调信息来源，不编造数据；一页一个观点；图表必须可编辑"},
  contest:{scene:"竞赛答辩",pages:"15",topic:"校园智能服务项目答辩",goal:"在有限时间证明问题真实、方案可落地、技术路线清楚且具有推广价值",audience:"竞赛评委",style:"深色科技、未来感、强视觉对比",mustKeep:"项目名称、团队成员、技术架构、测试结果",extra:"强化问题、方案、技术实现、创新点、验证结果与落地价值；避免无意义科技装饰"}
};
document.querySelectorAll(".example-card").forEach(btn=>btn.addEventListener("click",()=>{
  const d=examples[btn.dataset.example];Object.entries(d).forEach(([k,v])=>{if(fields[k])fields[k].value=v});window.scrollTo({top:$("generator").offsetTop-18,behavior:"smooth"});setTimeout(render,250);
}));

document.querySelectorAll(".mini-copy").forEach(btn=>btn.addEventListener("click",()=>{
  const t=$(btn.dataset.copyTarget)?.textContent||"";copyText(t,btn,"复制");
}));

const skillNames={dashi:"Dashi PPT Skill",slides:"Slides Skill Pack",quality:"slide-skill"};
const skillDirections={
  dashi:"使用 Dashi PPT Skill 生成浏览器可编辑的演示稿，确认后导出真实 PPTX；生成后优先在编辑控制台完成文字、模块、图表与主题调整。",
  slides:"先运行 narrative 收紧故事线，再 build deck 输出 PPTX；交付前运行 slop-check，发现问题后用 revise 返工。",
  quality:"对现有演示稿做质量检查，重点执行一页一个重点、结构清晰、简洁表达，并报告需要拆页或删除的内容。"
};
function buildSkillPrompt(key){
  const d=collectData();const agent=$("agentSelect").value;
  return `你现在运行在 ${agent} 中。\n\n请使用「${skillNames[key]}」处理下面的 PPT 任务。\n${skillDirections[key]}\n\n【任务】\n- 场景：${d.scene}\n- 主题：${safe(d.topic)}\n- 页数：约 ${d.pages} 页\n- 受众：${safe(d.audience)}\n- 目标：${safe(d.goal)}\n- 风格：${d.style}\n- 参考文件：${d.sourceFile}\n- 必须保留：${safe(d.mustKeep,"无")}\n- 补充：${safe(d.extra,"无")}\n\n【硬性要求】\n${editableRequirements(d)}\n\n请先确认内容结构，再开始生成。不得编造数据。交付前随机抽 3 页检查：文字能否直接改、图表能否改数据或替换、模块能否整块移动；如果做不到，请明确说明限制。`;
}
function showSkillPrompt(key){$("skillSelect").value=key;$("skillPromptText").textContent=buildSkillPrompt(key);$("skillPromptWrap").classList.remove("hidden");$("skillPromptWrap").scrollIntoView({behavior:"smooth",block:"center"});}
$("skillPromptBtn").addEventListener("click",()=>showSkillPrompt($("skillSelect").value));
document.querySelectorAll(".skill-use-btn").forEach(btn=>btn.addEventListener("click",()=>showSkillPrompt(btn.dataset.skill)));
$("copySkillPromptBtn").addEventListener("click",()=>copyText($("skillPromptText").textContent,$("copySkillPromptBtn"),"复制 Agent 指令"));
