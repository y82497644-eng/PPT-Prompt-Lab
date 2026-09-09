const $=id=>document.getElementById(id);
const fields={sourceType:$("sourceType"),scene:$("scene"),pages:$("pages"),topic:$("topic"),goal:$("goal"),audience:$("audience"),style:$("style"),mustKeep:$("mustKeep"),extra:$("extra"),sourceFile:$("sourceFile")};
const safe=(v,f="未特别说明")=>String(v||"").trim()||f;
let mode="full",latestData=null,creativeRound=0;

const profiles=[
["编辑式强对比","像高端商业杂志专题：大标题、大留白、强对比、少卡片，允许不对称构图。"],
["数据纪实","让数据、地图、时间线、证据链成为主角，不用装饰性卡片凑版面。"],
["发布会极简","一页只讲一个强信息，允许巨型数字、单图、单句和参数对比。"],
["战略叙事","结论先行，用因果链、竞争格局、路线图和决策框架组织内容，拒绝连续卡片页。"],
["视觉论文","图片、引用、证据、数据与章节节奏交替，强调叙事推进。"],
["实验网格","允许更大胆的网格比例、留白和模块尺度变化，但保持商业可读性。"]
];
const stories=[
"结论先行：先给最终判断，再用证据、原因、影响和行动逐层证明。",
"问题—冲突—证据—解法：先建立矛盾，再揭示原因与解决路径。",
"过去—现在—未来：用变化解释趋势，把未来行动作为落点。",
"宏观—中观—微观：从行业环境进入竞争格局，再落到具体对象。",
"现象—机制—后果—选择：先展示现象，再解释底层机制与决策。",
"对比叙事：围绕 A/B、前后、国内外、旧模式/新模式建立主线。"
];
const layouts=[
"封面宣言","Hero Metric 巨型数字","单图全幅","编辑式左右分栏","单图表聚焦","Annotated Visual 标注图",
"时间轴","流程路径","Before / After","双对象对比","证据墙","矩阵 / 坐标","Small Multiples 小图组",
"问题剖面","全幅引用","路线图","结尾决策页"
];

function injectCreativeControls(){
  const grid=document.querySelector(".form-panel .grid");
  if(!grid||$("creativeMode"))return;
  const anchor=fields.mustKeep.closest("label");
  const items=[
    ["creativeMode","创意方向",`<select id="creativeMode"><option value="auto">自动匹配主题</option><option value="0">编辑式强对比</option><option value="1">数据纪实</option><option value="2">发布会极简</option><option value="3">战略叙事</option><option value="4">视觉论文</option><option value="5">实验网格</option></select>`],
    ["storyMode","叙事结构",`<select id="storyMode"><option value="auto">自动选择</option><option value="0">结论先行</option><option value="1">问题—冲突—证据—解法</option><option value="2">过去—现在—未来</option><option value="3">宏观—中观—微观</option><option value="4">现象—机制—后果—选择</option><option value="5">对比叙事</option></select>`],
    ["layoutDiversity","版式变化强度",`<select id="layoutDiversity"><option value="balanced">平衡</option><option value="high" selected>高：明显避免重复</option><option value="experimental">实验：允许大胆构图</option></select>`],
    ["tasteReference","参考审美 / 不想像什么",`<input id="tasteReference" type="text" placeholder="例如：像 Monocle，不要咨询公司四卡片模板" />`]
  ];
  items.forEach(([id,label,html])=>{const el=document.createElement("label");el.className="field";el.innerHTML=`<span>${label}</span>${html}`;grid.insertBefore(el,anchor);});
  const btn=$("generateBtn");
  btn.textContent="生成「不套模板」PPT 创意制作方案";
  const shuffle=document.createElement("button");
  shuffle.id="shuffleCreativeBtn";shuffle.type="button";shuffle.className="text-button";
  shuffle.style.cssText="width:100%;margin-top:10px;padding:11px 14px";
  shuffle.textContent="↻ 换一套创意方向";
  btn.insertAdjacentElement("afterend",shuffle);
  shuffle.addEventListener("click",()=>{creativeRound++;render();});
  const v=document.querySelector(".hero .eyebrow");
  if(v)v.textContent=v.textContent.replace("v1.2","v1.3");
}

function hash(s){let h=0;for(const c of String(s||""))h=(h*31+c.charCodeAt(0))>>>0;return h}
function getProfile(d){const i=d.creativeMode==="auto"?(hash(d.topic+d.scene)+creativeRound)%profiles.length:Number(d.creativeMode);return profiles[i]||profiles[0]}
function getStory(d){const i=d.storyMode==="auto"?(hash(d.topic+d.goal)+creativeRound)%stories.length:Number(d.storyMode);return stories[i]||stories[0]}
function editReq(d){
 const a=[];if(d.editableText)a.push("所有标题和正文保持为可单独编辑文本对象");
 if(d.editableCharts)a.push("图表优先使用可修改数据的原生图表，不烘焙成截图");
 if(d.editableShapes)a.push("形状、模块、标注保持独立对象，可移动、缩放和重排");
 if(d.avoidImageDeck)a.push("禁止把整页设计导出为单张图片塞进 PPTX");
 return a.length?a.map((x,i)=>`${i+1}. ${x}`).join("\n"):"无额外可编辑要求";
}
function collectData(){return{
 sourceType:fields.sourceType.value,scene:fields.scene.value,pages:fields.pages.value,topic:fields.topic.value,goal:fields.goal.value,
 audience:fields.audience.value,style:fields.style.value,mustKeep:fields.mustKeep.value,extra:fields.extra.value,
 sourceFile:fields.sourceFile.files?.[0]?.name||"无",editableText:$("editableText").checked,editableCharts:$("editableCharts").checked,
 editableShapes:$("editableShapes").checked,avoidImageDeck:$("avoidImageDeck").checked,
 creativeMode:$("creativeMode")?.value||"auto",storyMode:$("storyMode")?.value||"auto",
 layoutDiversity:$("layoutDiversity")?.value||"high",tasteReference:$("tasteReference")?.value||""
}}
function diversity(v){
 if(v==="experimental")return"相邻页面构图必须明显不同，允许不对称网格、极端留白、超大字号与跨区构图。";
 if(v==="balanced")return"连续两页不得同构；卡片式页面最多占总页数 25%。";
 return"连续两页不得同构；三卡片/四卡片/指标卡合计最多 2 页；至少 40% 页面使用非卡片式结构。";
}
function antiTemplate(){return`1. 禁止默认使用“顶部标题 + 4 个数字卡片 + 3 个内容卡片”的万能商业模板。
2. 禁止连续两页使用相同数量、尺寸和排列方式的卡片。
3. 除非内容天然需要分类，否则不要用三等分、四等分卡片强行装信息。
4. 目录、四象限、时间轴、流程图都不是必选项；只有叙事确实需要才使用。
5. 统一的是设计语言，不是页面骨架。
6. 每页先问“观众最该看到什么”，再决定布局；禁止先选模板再塞内容。
7. 至少设计 2 张“签名页”：换成别的主题就不成立。
8. 至少 1 页让领域原生素材成为主视觉：地图、设备结构、产品图、照片、政策原文、数据曲线、技术路径或真实案例。
9. 每页最多一个主要视觉焦点，不平均分配视觉权重。
10. 如果只能靠通用卡片表达，先改写内容结构。`}

function fullPrompt(d){
 const p=getProfile(d),s=getStory(d);
 return`你不是“PPT 模板填充器”。你是创意总监、信息设计师、编辑设计师、数据可视化设计师和 PowerPoint 工程师。

任务：为下面主题创造一套“只有它自己才成立”的视觉叙事系统，并最终输出高颜值、真实可编辑 PPTX。

【Brief】
- 创作方式：${d.sourceType}
- 场景：${d.scene}
- 主题：${safe(d.topic,"请根据材料提炼主题")}
- 页数：约 ${d.pages} 页
- 受众：${safe(d.audience)}
- 目标：${safe(d.goal)}
- 基础风格：${d.style}
- 参考文件：${d.sourceFile}
- 必须保留：${safe(d.mustKeep,"无")}
- 补充：${safe(d.extra,"无")}

【本项目创意方向】
- 视觉策略：${p[0]} —— ${p[1]}
- 叙事策略：${s}
- 参考审美：${safe(d.tasteReference,"由主题本身推导")}
- 版式变化：${diversity(d.layoutDiversity)}

【第一步：先做创意诊断，禁止立刻排页】
1. 找出主题最独特的 3 个内容资产：关键数字、地域、产业结构、技术对象、人物、冲突、政策或时间变化。
2. 找出 2–3 个领域原生视觉元素，不能是通用科技图标。
3. 提出 3 套完全不同的视觉概念，每套一句话说明。
4. 选择最强的一套作为 Design DNA，不默认选最安全的一套。
5. 明确：换成另一个主题时，这套 Design DNA 哪些部分必须变化。

【Design DNA】
必须给出：核心视觉母题；与主题有关的 HEX 配色；标题/正文字体气质；网格策略；图片策略；图表策略；最多 1–2 个重复识别元素；2 张签名页概念。

【反模板硬约束】
${antiTemplate()}

【候选版式语言】
${layouts.map((x,i)=>`${i+1}. ${x}`).join("\n")}
这些只是候选语言，不是固定模板；允许创造新结构。

【第二步：先输出版式序列】
先只输出第 1–${d.pages} 页：页码 / 页面任务 / 主视觉媒介 / 构图类型。
规则：
- 相邻两页构图不能重复；
- 同一种构图最多 2 次；
- 卡片网格若被使用，必须解释为什么比图表、路径、单图或直接排版更合适；
- 至少 1 个强节奏转折页：全幅图、巨型数字、单句判断或章节页；
- 不要求每页信息密度相同。

【第三步：再逐页展开】
每页输出：
1. 页码 + 页面任务
2. 真正有信息量的结论式标题
3. 观众这一页只需记住什么
4. 具体内容 / 数据 / 证据 / 图片类型
5. 主视觉媒介
6. 元素在画面中的空间关系，禁止只写“左右布局/卡片布局”
7. 为什么这种构图最适合这一页
8. 哪些对象必须原生可编辑
9. 与上一页的视觉节奏有什么不同

【事实】
有真实数据、政策、案例时才用；禁止为了“专业感”编造精确数字、机构、引用和时间。缺数据写 [待补数据]。

【可编辑要求】
${editReq(d)}

【交付前反模板 QA】
必须检查并返工不合格页面：
- 是否连续同构？
- 三卡片/四卡片是否超过 2 页？
- 是否存在换个主题也能原样套用的页面？
- 是否真的有 2 张签名页？
- 是否至少一个领域原生视觉资产成为主角？
- 是否每页都能解释“为什么这样排”？
- 是否存在无意义渐变、发光线、玻璃拟态、随机图标？
- 标题/正文是否可编辑、图表可改、模块可移动？

如果能生成 PPTX，直接生成真实可编辑 PPTX；否则按以上步骤输出制作方案。`;
}

function compactPrompt(d){
 const p=getProfile(d),s=getStory(d);
 return`为“${safe(d.topic)}”制作约 ${d.pages} 页 ${d.scene} PPT，禁止套通用商务模板。
受众：${safe(d.audience)}
目标：${safe(d.goal)}
基础风格：${d.style}
创意方向：${p[0]}——${p[1]}
叙事：${s}
参考审美：${safe(d.tasteReference,"从主题本身推导")}
必须保留：${safe(d.mustKeep,"无")}
补充：${safe(d.extra,"无")}

先提出 3 套视觉概念，选 1 套 Design DNA，再排页面。
硬规则：
- 连续两页不得同构；
- 三卡片/四卡片/指标卡合计最多 2 页；
- 至少 2 张“换成别的主题就不成立”的签名页；
- 至少 1 页以领域原生素材为主视觉；
- 不先选模板再塞内容；
- 缺数据标 [待补数据]，禁止编造；
- ${diversity(d.layoutDiversity)}
- ${editReq(d).replace(/\n/g,"；")}

逐页输出：页面任务 / 结论标题 / 主视觉媒介 / 空间构图 / 为什么这样排 / 可编辑对象。
最后做反模板 QA，发现重复骨架必须返工。`;
}

function render(){
 latestData=collectData();
 if(!latestData.topic.trim()){fields.topic.focus();fields.topic.placeholder="请先输入 PPT 主题，例如：印尼光伏出口";return}
 const text=mode==="full"?fullPrompt(latestData):compactPrompt(latestData);
 $("resultText").textContent=text;$("charCount").textContent=`${text.length} 字符 · 创意轮次 ${creativeRound+1}`;
 $("emptyState").classList.add("hidden");$("resultWrap").classList.remove("hidden");
}
$("generateBtn").addEventListener("click",render);
$("fullBtn").addEventListener("click",()=>{mode="full";$("fullBtn").classList.add("active");$("compactBtn").classList.remove("active");if(latestData)render()});
$("compactBtn").addEventListener("click",()=>{mode="compact";$("compactBtn").classList.add("active");$("fullBtn").classList.remove("active");if(latestData)render()});

async function copyText(text,button,normal){try{await navigator.clipboard.writeText(text)}catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove()}button.textContent="已复制";setTimeout(()=>button.textContent=normal,1200)}
$("copyBtn").addEventListener("click",()=>copyText($("resultText").textContent,$("copyBtn"),"复制制作指令"));

document.querySelectorAll(".source-tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".source-tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");fields.sourceType.value=btn.dataset.source}));

$("resetBtn").addEventListener("click",()=>{
 fields.scene.value="课程汇报";fields.pages.value="10";fields.topic.value="";fields.goal.value="";fields.audience.value="";
 fields.style.selectedIndex=0;fields.mustKeep.value="";fields.extra.value="";fields.sourceFile.value="";fields.sourceType.value="主题创作";
 ["editableText","editableCharts","editableShapes","avoidImageDeck"].forEach(id=>$(id).checked=true);
 if($("creativeMode"))$("creativeMode").value="auto";if($("storyMode"))$("storyMode").value="auto";
 if($("layoutDiversity"))$("layoutDiversity").value="high";if($("tasteReference"))$("tasteReference").value="";
 creativeRound=0;document.querySelectorAll(".source-tab").forEach((x,i)=>x.classList.toggle("active",i===0));
 latestData=null;$("resultWrap").classList.add("hidden");$("emptyState").classList.remove("hidden");
});

document.querySelectorAll(".mini-copy").forEach(btn=>btn.addEventListener("click",()=>copyText($(btn.dataset.copyTarget)?.textContent||"",btn,"复制")));

const skillNames={dashi:"Dashi PPT Skill",slides:"Slides Skill Pack",quality:"slide-skill"};
const skillDirections={
 dashi:"生成浏览器可编辑演示稿并导出真实 PPTX；优先执行本项目 Design DNA 和版式序列，不调用默认通用模板。",
 slides:"先 narrative 收紧故事线，再 build deck；构建时避免连续同构，最后运行 slop-check 并 revise。",
 quality:"重点识别模板化卡片、重复骨架、无意义图标和“换主题仍成立”的页面，并直接提出返工方案。"
};
function buildSkillPrompt(key){
 const d=collectData(),p=getProfile(d),s=getStory(d),agent=$("agentSelect").value;
 return`你现在运行在 ${agent}。请使用「${skillNames[key]}」完成 PPT。
${skillDirections[key]}

主题：${safe(d.topic)}
场景：${d.scene}
页数：约 ${d.pages} 页
受众：${safe(d.audience)}
目标：${safe(d.goal)}
基础风格：${d.style}
创意方向：${p[0]}
叙事：${s}
参考文件：${d.sourceFile}
必须保留：${safe(d.mustKeep,"无")}
补充：${safe(d.extra,"无")}

反模板要求：
${antiTemplate()}

可编辑要求：
${editReq(d)}

执行前提出 3 套视觉概念并选择 Design DNA；再生成版式序列，确保相邻页面不重复。交付前检查并返工。`;
}
function showSkillPrompt(key){$("skillSelect").value=key;$("skillPromptText").textContent=buildSkillPrompt(key);$("skillPromptWrap").classList.remove("hidden");$("skillPromptWrap").scrollIntoView({behavior:"smooth",block:"center"})}
$("skillPromptBtn").addEventListener("click",()=>showSkillPrompt($("skillSelect").value));
document.querySelectorAll(".skill-use-btn").forEach(btn=>btn.addEventListener("click",()=>showSkillPrompt(btn.dataset.skill)));
$("copySkillPromptBtn").addEventListener("click",()=>copyText($("skillPromptText").textContent,$("copySkillPromptBtn"),"复制 Agent 指令"));

injectCreativeControls();
