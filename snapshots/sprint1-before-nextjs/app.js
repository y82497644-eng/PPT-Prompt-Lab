const state={route:"home",style:"editorial",files:[],slides:[],dragIndex:null};
const styles=[
  {id:"editorial",name:"编辑留白",note:"克制清晰",bg:"#eee9df",ink:"#292722",accent:"#d6533f"},
  {id:"business",name:"商务简报",note:"稳重专业",bg:"#e5e7e3",ink:"#25302d",accent:"#59746b"},
  {id:"warm",name:"温暖叙事",note:"自然亲和",bg:"#f1dfce",ink:"#4a2f25",accent:"#c4643f"},
  {id:"mono",name:"黑白观点",note:"大胆直接",bg:"#dededb",ink:"#121212",accent:"#121212"},
  {id:"campus",name:"清新校园",note:"轻快明亮",bg:"#e7eee4",ink:"#304235",accent:"#d18a32"},
  {id:"data",name:"数据报告",note:"理性有序",bg:"#e9e7df",ink:"#29333a",accent:"#b74a38"}
];
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];

function renderStyles(){
  $("#styleGrid").innerHTML=styles.map(style=>`<button class="style-card ${style.id===state.style?"is-selected":""}" data-style="${style.id}" aria-pressed="${style.id===state.style}"><span class="style-thumb" style="background:${style.bg};color:${style.ink}"><strong style="color:${style.accent}">Aa</strong><span></span></span><span class="style-label">${style.name}<small>${style.note}</small></span></button>`).join("");
  $$(".style-card").forEach(card=>card.addEventListener("click",()=>{state.style=card.dataset.style;renderStyles();}));
}

function routeTo(route){
  state.route=route;
  $$(".view").forEach(view=>view.classList.toggle("is-active",view.dataset.view===route));
  const activeStep=route==="home"?1:route==="storyboard"?2:3;
  $$(".step").forEach(step=>step.classList.toggle("is-active",Number(step.dataset.step)===activeStep));
  window.scrollTo({top:0,behavior:"smooth"});
}

function buildSlides(topic){
  const subject=topic.replace(/[。！？].*$/,"").slice(0,34)||"新的演示主题";
  return [
    ["开场","为什么现在需要重新认识「${subject}」","用一个明确的问题或变化，引出整份演示的核心。"],
    ["背景","变化已经发生，并正在影响每个人","交代必要背景，让听众快速进入同一个语境。"],
    ["现状","三个信号说明趋势正在加速","用三个清晰证据建立可信度和紧迫感。"],
    ["洞察","真正值得关注的不是表象，而是结构变化","提炼资料中的关键矛盾与机会。"],
    ["方案","从一个可执行的小切口开始","呈现核心方法、步骤与落地路径。"],
    ["价值","这套方案带来三项直接改变","从效率、体验与结果三个维度说明价值。"],
    ["行动","下一步，让想法真正发生","给出清晰的行动建议与结束语。"]
  ].map((item,index)=>({id:Date.now()+index,kicker:item[0],title:item[1].replace("${subject}",subject),body:item[2]}));
}

function updateFiles(fileList){
  state.files=[...fileList];
  $("#fileList").innerHTML=state.files.map(file=>`<span class="file-pill">${escapeHtml(file.name)} · ${formatSize(file.size)}</span>`).join("");
  $("#fileNote").textContent=state.files.length?`已添加 ${state.files.length} 个文件`:"支持 PDF、Word、PPT、文本";
}

function startStoryboard(){
  const topic=$("#topicInput").value.trim();
  if(!topic&&!state.files.length){$("#inputError").textContent="先写下一个主题，或添加一份资料。";$("#topicInput").focus();return;}
  $("#inputError").textContent="";
  const title=topic||state.files[0].name.replace(/\.[^.]+$/,"");
  state.slides=buildSlides(title);
  $("#deckTitle").textContent=title.slice(0,48);
  renderSlides();routeTo("storyboard");
}

function renderSlides(){
  const list=$("#slidesList");list.innerHTML="";
  const style=styles.find(item=>item.id===state.style);
  state.slides.forEach((slide,index)=>{
    const card=$("#slideTemplate").content.firstElementChild.cloneNode(true);
    card.dataset.index=index;card.querySelector(".slide-number").textContent=String(index+1).padStart(2,"0");
    card.querySelector(".slide-preview").style.cssText=`background:${style.bg};color:${style.ink}`;
    card.querySelector(".mini-kicker").textContent=slide.kicker;card.querySelector(".mini-kicker").style.color=style.accent;
    card.querySelector(".mini-title").textContent=slide.title;
    card.querySelector(".slide-kicker").value=slide.kicker;card.querySelector(".slide-title").value=slide.title;card.querySelector(".slide-body").value=slide.body;
    card.querySelectorAll("input,textarea").forEach(input=>input.addEventListener("input",event=>updateSlide(index,event.target.className,event.target.value)));
    card.querySelector(".delete").addEventListener("click",()=>{if(state.slides.length===1)return;state.slides.splice(index,1);renderSlides();});
    card.querySelector(".regenerate").addEventListener("click",event=>regenerateSlide(index,event.currentTarget));
    card.addEventListener("dragstart",()=>{state.dragIndex=index;card.classList.add("is-dragging")});
    card.addEventListener("dragend",()=>{card.classList.remove("is-dragging");$$(".slide-card").forEach(item=>item.classList.remove("drag-over"));});
    card.addEventListener("dragover",event=>{event.preventDefault();card.classList.add("drag-over")});
    card.addEventListener("dragleave",()=>card.classList.remove("drag-over"));
    card.addEventListener("drop",event=>{event.preventDefault();const target=Number(card.dataset.index);const [moved]=state.slides.splice(state.dragIndex,1);state.slides.splice(target,0,moved);renderSlides();});
    list.appendChild(card);
  });
  $("#slideCount").textContent=state.slides.length;
}

function updateSlide(index,className,value){
  const field=className.includes("kicker")?"kicker":className.includes("title")?"title":"body";
  state.slides[index][field]=value;
  const card=$$(".slide-card")[index];
  if(field==="kicker")card.querySelector(".mini-kicker").textContent=value;
  if(field==="title")card.querySelector(".mini-title").textContent=value;
}

function regenerateSlide(index,button){
  const variants=["换一个更直接的角度说明核心问题","用对比让这一页的结论更有力量","把复杂内容收束成一个清晰判断"];
  button.disabled=true;button.firstChild.textContent="…";
  setTimeout(()=>{state.slides[index].title=variants[index%variants.length];state.slides[index].body="已重新整理本页表达。你可以继续点击文字修改内容。";renderSlides();},650);
}

function addSlide(){state.slides.push({id:Date.now(),kicker:"新页面",title:"点击输入这一页的核心结论",body:"补充支持这个结论的必要内容。"});renderSlides();setTimeout(()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}),0);}

function runProgress(){
  routeTo("progress");let value=0;const stages=[[18,"分析页面结构"],[42,"匹配视觉版式"],[68,"整理文字层级"],[88,"检查整体节奏"],[100,"准备完成"]];
  const timer=setInterval(()=>{value=Math.min(100,value+2);const stage=stages.find(item=>value<=item[0])||stages.at(-1);$("#progressBar").style.width=`${value}%`;$("#progressPercent").textContent=`${value}%`;$("#progressStage").textContent=stage[1];if(value===100){clearInterval(timer);$("#progressTitle").textContent="演示文稿已经准备好";$("#progressMessage").textContent="页面结构、内容层级和视觉节奏已完成。";$("#previewBtn").classList.remove("hidden");renderPreview();}},70);
}

function renderPreview(){
  const style=styles.find(item=>item.id===state.style);
  $("#previewStage").innerHTML=state.slides.map(slide=>`<article class="preview-slide" style="background:${style.bg};color:${style.ink}"><small style="color:${style.accent}">${escapeHtml(slide.kicker)}</small><h2>${escapeHtml(slide.title)}</h2><p>${escapeHtml(slide.body)}</p></article>`).join("");
}

function resetProject(){state.files=[];state.slides=[];$("#topicInput").value="";updateFiles([]);$("#previewBtn").classList.add("hidden");$("#progressBar").style.width="0";routeTo("home");}
function formatSize(bytes){return bytes<1024*1024?`${Math.max(1,Math.round(bytes/1024))} KB`:`${(bytes/1024/1024).toFixed(1)} MB`;}
function escapeHtml(value){const element=document.createElement("div");element.textContent=value;return element.innerHTML;}

renderStyles();
$("#fileInput").addEventListener("change",event=>updateFiles(event.target.files));
$("#startBtn").addEventListener("click",startStoryboard);
$("#topicInput").addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&event.key==="Enter")startStoryboard();});
$("#addSlideBtn").addEventListener("click",addSlide);
$("#generateBtn").addEventListener("click",runProgress);
$("#previewBtn").addEventListener("click",()=>routeTo("preview"));
$("#newProjectBtn").addEventListener("click",resetProject);
$$('[data-route]').forEach(button=>button.addEventListener("click",()=>routeTo(button.dataset.route)));
