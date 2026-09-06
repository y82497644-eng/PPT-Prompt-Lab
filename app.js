const $ = (id) => document.getElementById(id);

const fields = {
  scene: $("scene"),
  pages: $("pages"),
  topic: $("topic"),
  goal: $("goal"),
  audience: $("audience"),
  style: $("style"),
  mustKeep: $("mustKeep"),
  extra: $("extra"),
};

let mode = "full";
let latestData = null;

function safe(value, fallback = "未特别说明") {
  const v = String(value || "").trim();
  return v || fallback;
}

function buildFullPrompt(data) {
  return `你是一名资深的商业演示设计师、信息架构师与PPT内容策划专家。

请围绕以下需求，生成一套完整、专业、可直接执行的PPT方案。

【基础信息】
- 使用场景：${data.scene}
- PPT主题：${safe(data.topic, "请根据需求自行概括主题")}
- 页数：约 ${data.pages} 页
- 目标受众：${safe(data.audience)}
- 核心目标：${safe(data.goal)}
- 视觉风格：${data.style}
- 必须保留的信息：${safe(data.mustKeep, "无")}
- 补充要求：${safe(data.extra, "无")}

【总体要求】
1. 先梳理整套PPT的核心叙事逻辑，不要简单堆砌信息。
2. 全套内容必须围绕一个清晰主线展开，每一页只承担一个主要信息任务。
3. 避免大段文字，优先使用结论式标题、数据、图表、对比、流程图、时间轴、矩阵、卡片等视觉结构。
4. 每页标题必须体现结论，而不是仅写“背景”“现状”“分析”等空泛词。
5. 视觉表达要符合“${data.style}”的方向，避免模板化、廉价渐变和明显AI生成感。
6. 如果存在数据，明确建议适合使用的图表类型；如果缺少数据，不得编造事实或数字。
7. 对必须保留的信息不得擅自修改其含义；必要时只调整版式与层级。
8. 默认采用16:9横版演示文稿，确保投影和电脑端阅读清晰。

【请按以下格式输出】

一、整套PPT定位
- 一句话核心信息
- 目标受众
- 希望受众看完后产生的认知/行动
- 整体叙事结构

二、逐页方案
请按第1页到第${data.pages}页依次输出，每页包含：
- 页码
- 页面标题
- 本页核心结论
- 需要呈现的具体内容
- 推荐版式
- 推荐图表/视觉元素
- 视觉重点
- 演讲者备注（如有必要）

三、统一视觉规范
- 配色建议
- 字体层级
- 标题字号逻辑
- 正文字号逻辑
- 图表风格
- 图片风格
- 留白与对齐原则
- 禁止出现的低质设计元素

四、最终检查
检查：
- 是否逻辑完整
- 是否存在重复页面
- 是否有无法验证的数据
- 是否每页都能用一句话说清楚
- 是否符合${data.scene}的真实使用场景

不要只给提纲，要给出足够具体、可直接用于制作PPT的内容与版式指令。`;
}

function buildCompactPrompt(data) {
  return `请作为资深PPT策划与视觉设计师，为我生成一套约${data.pages}页的${data.scene}PPT。

主题：${safe(data.topic)}
目标：${safe(data.goal)}
受众：${safe(data.audience)}
风格：${data.style}
必须保留：${safe(data.mustKeep, "无")}
补充要求：${safe(data.extra, "无")}

要求：
- 先确定整套PPT的主线和逻辑结构；
- 每页只表达一个主要结论；
- 标题必须结论化，避免“背景/分析/总结”等空泛标题；
- 少用大段文字，多用图表、对比、流程、时间轴、卡片、矩阵等结构；
- 有数据时注明适合的图表类型，没有数据时不要编造；
- 默认16:9；
- 避免模板感、廉价渐变和明显AI风；
- 不得擅自修改必须保留的信息。

请按“页码 / 页面标题 / 核心结论 / 具体内容 / 推荐版式 / 视觉元素”逐页输出，并最后补充统一配色、字体和版式规范。`;
}

function collectData() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, el]) => [key, el.value])
  );
}

function render() {
  latestData = collectData();
  if (!latestData.topic.trim()) {
    fields.topic.focus();
    fields.topic.setAttribute("placeholder", "请先输入PPT主题，例如：新能源汽车行业趋势分析");
    return;
  }

  const text = mode === "full"
    ? buildFullPrompt(latestData)
    : buildCompactPrompt(latestData);

  $("resultText").textContent = text;
  $("charCount").textContent = `${text.length} 字符`;
  $("emptyState").classList.add("hidden");
  $("resultWrap").classList.remove("hidden");
}

$("generateBtn").addEventListener("click", render);

$("copyBtn").addEventListener("click", async () => {
  const text = $("resultText").textContent;
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "已复制";
    setTimeout(() => ($("copyBtn").textContent = "复制提示词"), 1400);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    $("copyBtn").textContent = "已复制";
    setTimeout(() => ($("copyBtn").textContent = "复制提示词"), 1400);
  }
});

$("shortBtn").addEventListener("click", () => {
  mode = "full";
  $("shortBtn").classList.add("active");
  $("compactBtn").classList.remove("active");
  if (latestData) render();
});

$("compactBtn").addEventListener("click", () => {
  mode = "compact";
  $("compactBtn").classList.add("active");
  $("shortBtn").classList.remove("active");
  if (latestData) render();
});

$("resetBtn").addEventListener("click", () => {
  $("topic").value = "";
  $("goal").value = "";
  $("audience").value = "";
  $("mustKeep").value = "";
  $("extra").value = "";
  $("scene").value = "课程汇报";
  $("pages").value = "10";
  $("style").selectedIndex = 0;
  latestData = null;
  $("resultWrap").classList.add("hidden");
  $("emptyState").classList.remove("hidden");
});

const examples = {
  business: {
    scene: "商业路演",
    pages: "10",
    topic: "AI教育产品融资路演",
    goal: "向早期投资人说明市场痛点、产品差异化、商业模式与增长潜力",
    audience: "早期投资人",
    style: "商务蓝灰、克制专业、咨询公司风格",
    mustKeep: "产品名称、核心商业模式、已有用户数据",
    extra: "首页不要堆字；重点页突出市场机会、产品流程、竞争壁垒、商业模式和融资用途"
  },
  class: {
    scene: "课程汇报",
    pages: "12",
    topic: "低空经济行业趋势分析",
    goal: "让老师快速理解行业定义、政策驱动、产业链、市场空间和主要风险",
    audience: "大学课程教师与同学",
    style: "数据可视化优先、图表清晰",
    mustKeep: "课程名称、成员信息、参考资料",
    extra: "强调信息来源，不编造数据；每页控制在一个核心观点"
  },
  contest: {
    scene: "竞赛答辩",
    pages: "15",
    topic: "校园智能服务项目答辩",
    goal: "在有限答辩时间内证明问题真实、方案可落地、技术路线清晰且具有推广价值",
    audience: "竞赛评委",
    style: "深色科技感、未来感、强视觉冲击",
    mustKeep: "项目名称、团队成员、技术架构、测试结果",
    extra: "强调问题、方案、技术实现、创新点、验证结果和落地价值；不要出现无意义科技装饰"
  }
};

document.querySelectorAll(".example-card").forEach((button) => {
  button.addEventListener("click", () => {
    const data = examples[button.dataset.example];
    Object.entries(data).forEach(([key, value]) => {
      if (fields[key]) fields[key].value = value;
    });
    window.scrollTo({ top: document.querySelector(".workspace").offsetTop - 20, behavior: "smooth" });
    setTimeout(render, 250);
  });
});
