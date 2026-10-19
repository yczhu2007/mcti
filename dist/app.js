import {traits,questions,items,evaluate,questionScore,hitTraits,itemConnection,itemPortrait} from './data.js';

import {describePersonality} from './interpretation.js';

const main=document.querySelector('main');
const dialog=document.querySelector('dialog');
const storageKey='mcti-ipip-selected-30-v4';
const kindNames={binary:'二选一',single:'情境单选',multi:'限选多选',scale:'倾向量表'};
const state={screen:'home',index:0,answers:Array(questions.length).fill(null),result:null};
let toastTimer,previewUrl;
function isAnswered(i){try{questionScore(questions[i],state.answers[i]);return true;}catch{return false;}}
function answeredCount(){return questions.filter((_,i)=>isAnswered(i)).length;}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({version:4,index:state.index,answers:state.answers,completed:!!state.result}));}catch{/* Browsing still works when storage is unavailable. */}}
function restore(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved?.version!==4||!Array.isArray(saved.answers)||saved.answers.length!==questions.length)return;
 state.answers=saved.answers.map((a,i)=>Array.isArray(a)&&a.length<=(questions[i].type==='multi'?2:1)&&new Set(a).size===a.length&&a.every(n=>Number.isInteger(n)&&questions[i].options[n])?a:null);
 state.index=Number.isInteger(saved.index)?Math.max(0,Math.min(questions.length-1,saved.index)):0;
 if(saved.completed&&answeredCount()===questions.length){state.result=evaluate(state.answers);state.screen='result';}
 }catch{/* A missing or old save starts a fresh session. */}}
function toast(message){clearTimeout(toastTimer);const box=document.querySelector('#toast');box.textContent=message;box.classList.add('visible');toastTimer=setTimeout(()=>box.classList.remove('visible'),3200);}
function itemImage(item,extra=''){return `<img src="./assets/${item.id}.png" alt="${item.name}" ${extra}>`;}
function showDialog(title,html){document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();}
function closeDialog(){dialog.close();}
document.querySelector('.close-button').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;}});
function go(screen){state.screen=screen;render();window.scrollTo({top:0,behavior:'instant'});}
function render(){
 document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.action===(state.screen==='collection'?'collection':'home')));
 if(state.screen==='home')renderHome();
 else if(state.screen==='quiz')renderQuestion();
 else if(state.screen==='collection')renderCollection();
 else renderResult();
}
function renderHome(){
 const answered=answeredCount();
 main.innerHTML=`<section class="hero" aria-labelledby="hero-title"><div class="hero-copy">
 <div class="edition"><b>PLAYER DISCOVERY</b><span>·</span> 道具适配计划 / VOL. 01</div>
 <div class="eyebrow">你的冒险，自有装备。</div>
 <h1 id="hero-title">如果只能带走<br>一件 <em>MC 道具</em>，<br>你会是哪一件？</h1>
 <p class="hero-intro">有人是照亮伙伴的信标，有人是奔向远方的鞘翅。<br><span>让日常里的选择，找到属于你的那一格。</span></p>
 <div class="hero-actions"><button class="pixel-button" data-action="start">${answered&& !state.result?'继续探索':'开始探索'} <span class="arrow">→</span></button><button class="text-link" data-action="about">这次探索怎么玩？</button></div>
 <div class="hero-meta"><span><b>30</b> 道日常选择</span><span>约 <b>5–7</b> 分钟</span><span><b>16</b> 件本命道具</span></div>
 ${answered&&!state.result?`<p class="quiz-note" style="text-align:left;margin-top:15px">上次已完成 ${answered}/${questions.length} 题，进度已为你保留。</p>`:''}
 </div><div class="hero-art" role="img" aria-label="草方块浮空岛，上面有树、末影箱和下界传送门"><span class="art-label">OVERWORLD / INVENTORY</span><img class="island" src="./assets/island.png" alt="" fetchpriority="high"><img class="float-item pearl" src="./assets/ender_pearl.png" alt=""><img class="float-item elytra" src="./assets/elytra.png" alt=""><img class="float-item totem" src="./assets/totem_of_undying.png" alt=""><span class="spark a"></span><span class="spark b"></span><span class="art-coordinate">X: ? &nbsp; Y: ? &nbsp; Z: YOU</span></div></section>
 <section class="inventory-section" aria-labelledby="inventory-title"><div class="section-label"><h2 id="inventory-title"><span>▦</span> 十六件道具，等待认领</h2><span>你的那一格，会是什么？</span></div><div class="inventory">${items.map((item,i)=>`<button class="slot" data-item="${item.id}" data-label="${item.name}" aria-label="了解${item.name}">${itemImage(item)}<span class="slot-number">${i+1}</span></button>`).join('')}</div></section>
 <section class="journey-strip" aria-label="探索步骤"><div class="journey-step"><span class="step-number">01 /</span><div><h3>凭直觉，作出选择</h3><p>情境、二选一与五档选择交错出现。</p></div></div><div class="journey-step"><span class="step-number">02 /</span><div><h3>拼出你的特质轮廓</h3><p>用五维雷达图，看看你的性格轮廓。</p></div></div><div class="journey-step"><span class="step-number">03 /</span><div><h3>领取本命道具</h3><p>解锁专属解读，保存你的道具卡。</p></div></div></section>`;
}
function start(){
 if(state.result){go('result');return;}
 const firstMissing=questions.findIndex((_,i)=>!isAnswered(i));
 if(!isAnswered(state.index)&&firstMissing>=0)state.index=firstMissing;
 go('quiz');focusQuestion();
}
function focusQuestion(){document.querySelector('.quiz-card h1')?.focus({preventScroll:true});}
function renderQuestion(){
 const q=questions[state.index],answer=state.answers[state.index]||[],valid=answer.length===(q.type==='multi'?2:1);
 const hint=q.type==='multi'?`选择最符合你的两项 · 已选 ${answer.length}/2 项`:q.type==='scale'?'按照平时的真实感受，选择一个程度。':'选择更接近平时自己的那一项。';
 main.innerHTML=`<section class="quiz-shell" aria-label="道具测评"><div class="quiz-toolbar"><button class="back-link" data-action="home">← 返回首页</button><span>探索进度 &nbsp; ${String(state.index+1).padStart(2,'0')} / ${questions.length}</span></div><div class="progress-track" role="progressbar" aria-label="已完成题目" aria-valuenow="${answeredCount()}" aria-valuemin="0" aria-valuemax="${questions.length}"><span style="width:${answeredCount()/questions.length*100}%"></span></div>
 <div class="quiz-card"><div class="question-meta"><span class="question-number">QUESTION ${String(state.index+1).padStart(2,'0')}</span><span class="question-kind">${kindNames[q.type]}</span></div><h1 tabindex="-1" id="question-title">${q.text}</h1><p class="question-hint" id="question-hint">${hint}</p><div class="options ${q.type}" role="group" aria-labelledby="question-title" aria-describedby="question-hint">${q.options.map((o,i)=>`<button class="option ${answer.includes(i)?'selected':''}" data-option="${i}" aria-pressed="${answer.includes(i)}"><span class="option-letter">${q.type==='scale'?i+1:String.fromCharCode(65+i)}</span><span>${o.label}</span>${answer.includes(i)?'<span class="option-check" aria-hidden="true">✓</span>':''}</button>`).join('')}</div>${q.type==='scale'?'<div class="scale-endpoints"><span>不符合我的习惯</span><span>符合我的习惯</span></div>':''}<p class="form-error" role="status" id="answer-status"></p>
 <div class="quiz-bottom"><button class="back-link" data-action="previous" ${state.index===0?'disabled':''}>← 上一题</button><div class="question-dots" aria-hidden="true">${questions.map((_,i)=>`<i class="${isAnswered(i)?'done ':''}${i===state.index?'current':''}"></i>`).join('')}</div><button class="pixel-button" data-action="next" ${valid?'':'disabled'}>${state.index===questions.length-1?'领取道具':'下一题'} <span class="arrow">→</span></button></div><p class="quiz-note">按平时的自己选择，选定后点击下一题，进度保存在当前浏览器。</p></div></section>`;
}
function selectOption(index){
 const q=questions[state.index];let answer=[...(state.answers[state.index]||[])];
 if(q.type==='multi'){
  if(answer.includes(index))answer=answer.filter(i=>i!==index);
  else if(answer.length<2)answer.push(index);
  else{document.querySelector('#answer-status').textContent='已选两项。先取消一项，就可以更换选择。';return;}
 }else answer=[index];
 state.answers[state.index]=answer;persist();renderQuestion();document.querySelector(`[data-option="${index}"]`)?.focus({preventScroll:true});
}
function next(){
 try{questionScore(questions[state.index],state.answers[state.index]);}catch{toast('请先完成当前选择');return;}
 if(state.index<questions.length-1){state.index++;persist();renderQuestion();focusQuestion();window.scrollTo({top:0,behavior:'instant'});}
 else{try{state.result=evaluate(state.answers);persist();go('result');}catch{state.index=state.answers.findIndex(a=>!a);renderQuestion();toast('还有题目没有完成，请补充选择');}}
}
function previous(){if(state.index>0){state.index--;persist();renderQuestion();focusQuestion();}}
function renderCollection(){main.innerHTML=`<section class="collection"><div class="eyebrow">THE ITEM COLLECTION</div><h1 class="page-heading">每件道具，都有自己的用处。</h1><p class="collection-intro">有的适合启程，有的适合守护，有的能把一个新点子变成现实。看看这些熟悉的物品，藏着怎样的做事方式。</p><div class="collection-grid">${items.map(item=>`<button class="collection-card" data-item="${item.id}">${itemImage(item,'loading="lazy"')}<h2>${item.name}</h2><p>${item.core}</p><span class="tag">${item.tags.join(' · ')}</span></button>`).join('')}</div><div class="result-actions"><button class="pixel-button" data-action="start">${state.result?'查看我的道具':'寻找我的本命道具'} <span class="arrow">→</span></button></div></section>`;}
function explainItem(id){const item=items.find(i=>i.id===id);if(!item)return;showDialog(item.name,`<div class="dialog-body">${itemImage(item,'class="dialog-item-image"')}<p style="text-align:center;color:${item.color}">${item.core}</p><div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><h3>道具档案</h3><p>${item.review}</p><p style="font-size:12px">这是道具的特质设定。完成探索后，可以查看它与你的适配程度。</p></div>`);}
function about(){showDialog('题目与匹配说明',`<div class="dialog-body"><p>30道题参考公开IPIP题库筛选，涵盖好奇心、做事习惯、社交、相处和压力反应。情境单选四项，穿插二选一和五档选择。请按平时的自己回答，选择最接近真实习惯的一项。</p><h3>题目从哪里来？</h3><p>参考 <a href="https://github.com/rubynor/bigfive-web" target="_blank" rel="noopener">bigfive-web</a> 与 <a href="https://github.com/kholia/IPIP-NEO-PI" target="_blank" rel="noopener">IPIP-NEO-PI</a> 的题库结构，主要选自 <a href="https://ipip.ori.org/30FacetNEO-PI-RItems.htm" target="_blank" rel="noopener">IPIP-NEO-120公开条目</a>，另选一条 <a href="https://ipip.ori.org/newBigFive5broadKey.htm" target="_blank" rel="noopener">Big-Five Markers</a> 的反思题。每题的原文、出处和计分方向保存在题库中。</p><p>本站筛选了部分条目，并进行了中文和题型改编，适用于这套娱乐与自我探索体验。IPIP条目可自由使用，见 <a href="https://ipip.ori.org/newPermission.htm" target="_blank" rel="noopener">官方授权</a>。</p><h3>轮廓匹配度是什么意思？</h3><p>将你的五维刻度以50为中点，转换为有方向的倾向，再用余弦相似度比较你和道具的五维方向。方向完全相同记100%，相互垂直记50%，完全相反记0%。TOP3采用同一规则排序。</p><p>方法参考 <a href="https://github.com/YSocialTwin/YSimulator/blob/main/docs/features/RECOMMENDATION_SYSTEMS.md" target="_blank" rel="noopener">YSocial的人格轮廓推荐方法</a> 与 <a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank" rel="noopener">余弦相似度定义</a>。本站采用五维人格方向部分，自行实现计算。</p><h3>怎样保留实际倾向的强弱？</h3><p>主卡同时显示绝对契合度：每项用100减去你的刻度与道具刻度的距离，再将五项取平均。雷达图沿用实际五维得分。轮廓匹配度比较方向，绝对契合度对照实际强弱。</p><p>整体倾向接近中间时，页面会提示方向指标对小变化更敏感。完全居中时，所有候选统一记50%并列。候选接近程度继续依据原始分差判断。百分比用于本站道具比较，供娱乐与自我探索。</p><h3>怎样阅读性格图？</h3><p>五项人格分别计分，保留你实际作答的差异。开放性涉及想象、体验和观念；尽责性涉及做事习惯；外向性涉及交流与参与；宜人性涉及信任、体谅与合作；情绪敏感度对应大五人格的神经质方向。各个方向都对应不同习惯，适合结合自己的日常经历阅读。</p><h3>进度和图片</h3><p>回答只保存在当前浏览器。可以返回修改、重新开始，也可以预览并保存带有匹配度、性格解读、雷达图和TOP3的道具卡。</p><h3>素材鸣谢</h3><p>道具图标采用 <a href="https://minecraft.wiki/" target="_blank" rel="noopener">Minecraft Wiki</a> 收录的原版游戏物品栏精灵图，字体使用 <a href="https://github.com/TakWolf/fusion-pixel-font" target="_blank" rel="noopener">缝合像素字体</a>（OFL）。浮空岛由本项目使用原版材质绘制。Minecraft 属于 Mojang / Microsoft，本项目为非官方同人作品。</p></div>`);}
function renderResult(){
 if(!state.result){go('home');return;}
 const {scores,ranking,discrimination,tiedFirst,signalStrength}=state.result,{item,match,absoluteMatch}=ranking[0],report=describePersonality(scores),hits=hitTraits(scores,item);
 const near=discrimination.status!=='separated';
 const statusText=discrimination.status==='tied'?`并列第一：${ranking.filter(r=>tiedFirst.includes(r.item.id)).map(r=>r.item.name).join('、')}。` : near?'前几件道具匹配接近，你可以对照它们的不同特点。':'按五维方向相似程度，在16件道具中排名第一。';
 main.innerHTML=`<section class="results"><div class="result-topline"><div class="eyebrow">QUEST COMPLETE / 道具已解锁</div><button class="back-link" data-action="home">返回首页 ↗</button></div><div class="result-grid"><article class="reward-card" style="--item-color:${item.color}"><div class="reward-kicker">${tiedFirst.length>1?'并列主候选 · 展示项':'你的本命道具'}</div><div class="reward-image-box">${itemImage(item)}</div><h1>${item.name}</h1><div class="item-english">${item.english}</div><p class="item-core">${item.core}</p><div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="match-line"><div><span>轮廓匹配度</span><p>五维倾向的方向相似程度</p></div><strong>${match.toFixed(1)}<span>%</span></strong></div><p class="match-small">${statusText} 原绝对契合度 ${absoluteMatch.toFixed(1)}%。${discrimination.lowSignal?'整体倾向接近中间，方向指标对小变化较敏感。':''}</p></article>
 <div class="result-right"><article class="result-panel"><h2 class="panel-heading"><span>01 /</span> 你的性格，放进日常里</h2><p class="review">${report.summary}</p><p class="item-tip">给你的提醒：${report.tip}</p></article><article class="result-panel"><h2 class="panel-heading"><span>02 /</span> 为什么是${item.name}？</h2><p class="review">${itemConnection(scores,item)}</p><div class="tags">${hits.map(h=>`<span class="tag">${report.dimensions[h.index].title}</span>`).join('')}</div></article></div></div>
 <section class="profile-section"><h2 class="panel-heading"><span>03 /</span> 你的五维人格轮廓</h2><div class="profile-layout"><canvas class="radar" width="840" height="700" role="img" aria-label="五维评分雷达图，具体得分见旁边的评分列表"></canvas><div class="score-list">${traits.map((t,i)=>`<div class="score-row"><span>${t.name}</span><span class="score-bar"><i style="width:${scores[i]}%;background:${t.color}"></i></span><span>${Math.round(scores[i])}</span></div>`).join('')}</div></div><p class="profile-note">数值表示本次回答中表现出的倾向强度。0～100表示你在这次回答中更靠近哪一端。图形可以均衡，也可以有明显起伏；情绪敏感度越高，表示对压力和评价越容易有反应。</p></section>
 <section class="personality-details result-panel"><h2 class="panel-heading"><span>04 /</span> 五个侧面，具体看看</h2><div class="personality-grid">${report.dimensions.map(d=>`<article class="personality-reading"><div class="eyebrow">${d.name}</div><h3>${d.title}</h3><p>${d.description}</p></article>`).join('')}</div></section>
 <section class="top-section"><div class="section-label"><h2><span>05 /</span> 最佳匹配 TOP 3</h2><span>五维共同参与，按轮廓匹配度从高到低排序。</span></div><div class="top-items">${ranking.slice(0,3).map(r=>`<article class="top-item">${itemImage(r.item)}<div><div class="rank-label">${String(r.rank).padStart(2,'0')} / ${r.rank===1?'主候选':'候选装备'}</div><h3>${r.item.name}</h3><div class="top-match">${r.match.toFixed(1)}% 轮廓匹配度</div><p>绝对契合度 ${r.absoluteMatch.toFixed(1)}%</p><p>道具画像：${itemPortrait(r.item)}${ranking.filter(v=>v.rank===r.rank).length>1?' · 并列':''}</p><p>${r.item.tags.join(' · ')}</p></div></article>`).join('')}</div></section>
 <details class="result-panel"><summary>查看两种指标的算法与全部16件道具</summary><p>轮廓匹配度 = (1 + 五维余弦相似度) × 50；它衡量偏向方向的接近程度。绝对契合度保留原刻度下的强弱比较：五项“100 − 刻度差”的平均值。两者在当前等长道具原型下保持相同排名。</p><p>本次倾向幅度为 ${(signalStrength*100).toFixed(1)}%（五维相对中点的均方根幅度）。较小的幅度意味着方向指标对小变化更敏感。候选接近提示沿用原始分差，工程阈值等待后续数据校准。</p><p>分项绝对契合度依次为：开放性 / 尽责性 / 外向性 / 宜人性 / 情绪敏感度。</p>${ranking.map(r=>`<p>${r.rank}. ${r.item.name} · <strong>轮廓 ${r.match.toFixed(1)}%</strong> · 绝对 ${r.absoluteMatch.toFixed(1)}%<br><small>分项绝对契合度：${r.dimensionMatches.map(v=>v.toFixed(1)+'%').join(' / ')}</small></p>`).join('')}<p>首两名轮廓匹配度相差 ${(ranking[0].match-ranking[1].match).toFixed(2)} 个百分点；原始分差 ${discrimination.gap.toFixed(3)}，接近阈值 ${discrimination.threshold}。</p></details><div class="result-actions"><button class="pixel-button" data-action="save">保存图片 <span class="arrow">↓</span></button><button class="pixel-button secondary" data-action="restart">重新开始测试 <span class="arrow">↻</span></button></div><p class="result-footnote">这次选择描绘了当下的倾向，可以结合日常经历一起理解。题目参考IPIP公开题库改编，物品关联属于创作。此版本适用于娱乐与自我探索。</p></section>`;
 drawRadar(document.querySelector('.radar'),scores);
}
function drawRadar(canvas,scores){
 const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2+5,r=Math.min(w*.31,h*.32);ctx.clearRect(0,0,w,h);
 const point=(i,radius)=>[cx+Math.cos(-Math.PI/2+i*2*Math.PI/traits.length)*radius,cy+Math.sin(-Math.PI/2+i*2*Math.PI/traits.length)*radius];
 for(let level=1;level<=4;level++){ctx.beginPath();for(let i=0;i<traits.length;i++){const [x,y]=point(i,r*level/4);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle='#435238';ctx.lineWidth=1.5;ctx.stroke();}
 for(let i=0;i<traits.length;i++){const [x,y]=point(i,r);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle='#3a4932';ctx.stroke();}
 ctx.beginPath();scores.forEach((score,i)=>{const [x,y]=point(i,r*score/100);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fillStyle='#b5d77c29';ctx.fill();ctx.strokeStyle='#b5d77c';ctx.lineWidth=3;ctx.stroke();
 scores.forEach((score,i)=>{const [x,y]=point(i,r*score/100);ctx.fillStyle='#d4e9a9';ctx.fillRect(x-4,y-4,8,8);});
 ctx.font='24px Pixel, sans-serif';ctx.fillStyle='#bdcbae';ctx.textBaseline='middle';
 traits.forEach((t,i)=>{const [x,y]=point(i,r+45);ctx.textAlign=Math.abs(x-cx)<1?'center':x>cx?'left':'right';ctx.fillText(t.name,x,y);});
 ctx.textAlign='left';ctx.fillStyle='#839675';ctx.font='17px Pixel, sans-serif';ctx.fillText('0',cx+9,cy+15);ctx.fillText('100',cx+9,cy-r+10);
}
async function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('道具图片读取失败'));image.src=src;});}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const char of text){if(ctx.measureText(line+char).width>maxWidth&&line&&!/[，。！？；：、）》」』】]/.test(char)){ctx.fillText(line,x,y);line=char;y+=lineHeight;}else line+=char;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
async function makeShareImage(){
 await document.fonts.ready;
 const {scores,ranking,discrimination,tiedFirst}=state.result,{item,match,absoluteMatch}=ranking[0],report=describePersonality(scores);
 const icons=await Promise.all(ranking.slice(0,3).map(r=>loadImage(`./assets/${r.item.id}.png`)));
 const canvas=document.createElement('canvas');canvas.width=900;canvas.height=2060;
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#171e18';c.fillRect(0,0,900,2060);
 c.strokeStyle='#51623d';c.lineWidth=3;c.strokeRect(24,24,852,2012);c.strokeStyle='#34452d';c.strokeRect(34,34,832,1992);
 c.textAlign='left';c.fillStyle='#b5d77c';c.font='34px Pixel';c.fillText('MCTI.',62,89);c.font='18px Pixel';c.fillStyle='#a8b797';c.textAlign='right';c.fillText(tiedFirst.length>1?'并列候选 / ITEM CANDIDATES':'你的本命道具 / ITEM DISCOVERED',838,86);
 c.strokeStyle='#3b4c32';c.beginPath();c.moveTo(62,112);c.lineTo(838,112);c.stroke();
 c.textAlign='center';c.font='22px Pixel';c.fillStyle='#c1d6a0';c.fillText('如果只能带走一件 MC 道具',450,166);
 c.fillStyle='#232f21';c.fillRect(335,195,230,230);c.drawImage(icons[0],365,225,170,170);
 c.font='58px Pixel';c.fillStyle=item.color;c.fillText(item.name,450,502);c.font='19px Pixel';c.fillStyle='#a1af92';c.fillText(item.english,450,541);
 c.font='25px Pixel';c.fillStyle='#e1e7d3';c.fillText(item.core,450,590);
 c.font='22px Pixel';c.fillStyle='#aabb94';c.fillText('轮廓匹配度',330,654);c.font='44px Pixel';c.fillStyle='#b5d77c';c.fillText(`${match.toFixed(1)}%`,570,658);
 c.font='17px Pixel';c.fillStyle='#aabb94';c.fillText(tiedFirst.length>1?`${tiedFirst.length}件道具并列第一` : discrimination.status==='low'?'前几件道具匹配接近，可以一起看看':'五维方向相似程度，保留真实倾向幅度',450,690);c.font='16px Pixel';c.fillText(`绝对契合度 ${absoluteMatch.toFixed(1)}%${discrimination.lowSignal?' · 中间倾向，方向指标较敏感':''}`,450,719);
 c.textAlign='left';c.font='24px Pixel';c.fillStyle='#b5d77c';c.fillText('你的性格，放进日常里',77,752);
 c.font='22px Pixel';c.fillStyle='#c1cdb2';const end=wrapText(c,report.summary,77,797,746,34);
 c.font='18px Pixel';c.fillStyle='#a8b797';wrapText(c,`给你的提醒：${report.tip}`,77,end+14,746,28);
 c.fillStyle='#b5d77c';c.font='24px Pixel';c.fillText('你的五维人格轮廓',77,1090);
 const radar=document.createElement('canvas');radar.width=840;radar.height=700;drawRadar(radar,scores);c.drawImage(radar,125,1100,650,542);
 c.font='17px Pixel';c.fillStyle='#bdcbb0';c.textAlign='center';c.fillText(traits.map((t,i)=>`${t.name} ${Math.round(scores[i])}`).join('  ·  '),450,1675);
 c.textAlign='left';c.fillStyle='#b5d77c';c.font='24px Pixel';c.fillText('最佳匹配 TOP 3',77,1750);
 ranking.slice(0,3).forEach((r,i)=>{const x=77+i*257;c.fillStyle='#253020';c.fillRect(x,1775,232,155);c.drawImage(icons[i],x+15,1790,56,56);c.fillStyle='#b5d77c';c.font='27px Pixel';c.fillText(`${r.match.toFixed(1)}%`,x+92,1827);c.fillStyle='#e3e7d6';c.font='21px Pixel';c.fillText(r.item.name,x+14,1882);c.font='16px Pixel';c.fillText(`第${r.rank}名${ranking.filter(v=>v.rank===r.rank).length>1?' · 并列':''}`,x+14,1911);});
 c.textAlign='center';c.fillStyle='#9daf89';c.font='17px Pixel';c.fillText('30 道IPIP题目改编 · 5 项人格特质 · 16 件随身装备',450,1970);c.font='16px Pixel';c.fillStyle='#89997c';c.fillText('轮廓指标比较五维方向，绝对契合度保留强弱，供娱乐与自我探索。',450,2007);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片生成失败')),'image/png'));
}
async function saveImage(button){
 button.disabled=true;const original=button.innerHTML;button.textContent='正在制作道具卡…';
 try{const blob=await makeShareImage();if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(blob);
 showDialog('你的道具卡已准备好',`<p class="dialog-message">下载 PNG 保存到设备；手机也可以长按下方图片保存。</p><img class="share-preview" src="${previewUrl}" alt="包含轮廓匹配度、绝对契合度、性格解读、五维雷达图和 TOP3 的结果卡"><div class="dialog-actions"><a class="pixel-button small" href="${previewUrl}" download="MCTI-${state.result.ranking[0].item.name}.png">下载 PNG 图片 ↓</a></div>`);
 }catch(error){toast('图片暂时未能生成，请稍后重试');console.error(error);}finally{button.disabled=false;button.innerHTML=original;}
}
function restart(){state.index=0;state.answers=Array(questions.length).fill(null);state.result=null;persist();go('quiz');focusQuestion();}
document.addEventListener('click',e=>{
 const option=e.target.closest('[data-option]');if(option){selectOption(Number(option.dataset.option));return;}
 const item=e.target.closest('[data-item]');if(item){explainItem(item.dataset.item);return;}
 const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
 const actions={home:()=>go('home'),collection:()=>go('collection'),about,start,next,previous,restart,save:()=>saveImage(button)};
 actions[button.dataset.action]?.();
});
restore();render();document.fonts.ready.then(()=>{if(state.screen==='result')drawRadar(document.querySelector('.radar'),state.result.scores);});
