import {traits,questions,items,evaluate,questionScore,hitTraits,resultReview} from './data.js';

const main=document.querySelector('main');
const dialog=document.querySelector('dialog');
const storageKey='mcti-quest-v1';
const kindNames={binary:'二选一',single:'情境单选',multi:'限选多选',scale:'倾向量表'};
const state={screen:'home',index:0,answers:Array(32).fill(null),result:null};
let toastTimer,previewUrl;
function isAnswered(i){try{questionScore(questions[i],state.answers[i]);return true;}catch{return false;}}
function answeredCount(){return questions.filter((_,i)=>isAnswered(i)).length;}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({version:1,index:state.index,answers:state.answers,completed:!!state.result}));}catch{/* Browsing still works when storage is unavailable. */}}
function restore(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved?.version!==1||!Array.isArray(saved.answers)||saved.answers.length!==32)return;
 state.answers=saved.answers.map((a,i)=>Array.isArray(a)&&a.length<=(questions[i].type==='multi'?2:1)&&new Set(a).size===a.length&&a.every(n=>Number.isInteger(n)&&questions[i].options[n])?a:null);
 state.index=Number.isInteger(saved.index)?Math.max(0,Math.min(31,saved.index)):0;
 if(saved.completed&&answeredCount()===32){state.result=evaluate(state.answers);state.screen='result';}
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
 <div class="hero-meta"><span><b>32</b> 道日常选择</span><span>约 <b>5–8</b> 分钟</span><span><b>16</b> 件本命道具</span></div>
 ${answered&&!state.result?`<p class="quiz-note" style="text-align:left;margin-top:15px">上次已完成 ${answered}/32 题，进度已为你保留。</p>`:''}
 </div><div class="hero-art" role="img" aria-label="草方块浮空岛，上面有树、末影箱和下界传送门"><span class="art-label">OVERWORLD / INVENTORY</span><img class="island" src="./assets/island.png" alt="" fetchpriority="high"><img class="float-item pearl" src="./assets/ender_pearl.png" alt=""><img class="float-item elytra" src="./assets/elytra.png" alt=""><img class="float-item totem" src="./assets/totem_of_undying.png" alt=""><span class="spark a"></span><span class="spark b"></span><span class="art-coordinate">X: ? &nbsp; Y: ? &nbsp; Z: YOU</span></div></section>
 <section class="inventory-section" aria-labelledby="inventory-title"><div class="section-label"><h2 id="inventory-title"><span>▦</span> 十六件道具，等待认领</h2><span>你的那一格，会是什么？</span></div><div class="inventory">${items.map((item,i)=>`<button class="slot" data-item="${item.id}" data-label="${item.name}" aria-label="了解${item.name}">${itemImage(item)}<span class="slot-number">${i+1}</span></button>`).join('')}</div></section>
 <section class="journey-strip" aria-label="探索步骤"><div class="journey-step"><span class="step-number">01 /</span><div><h3>凭直觉，作出选择</h3><p>四种题型穿插，没有标准答案。</p></div></div><div class="journey-step"><span class="step-number">02 /</span><div><h3>拼出你的特质轮廓</h3><p>八个观察角度，呈现不同的你。</p></div></div><div class="journey-step"><span class="step-number">03 /</span><div><h3>领取本命道具</h3><p>解锁专属解读，保存你的道具卡。</p></div></div></section>`;
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
 main.innerHTML=`<section class="quiz-shell" aria-label="道具测评"><div class="quiz-toolbar"><button class="back-link" data-action="home">← 返回首页</button><span>探索进度 &nbsp; ${String(state.index+1).padStart(2,'0')} / 32</span></div><div class="progress-track" role="progressbar" aria-label="已完成题目" aria-valuenow="${answeredCount()}" aria-valuemin="0" aria-valuemax="32"><span style="width:${answeredCount()/32*100}%"></span></div>
 <div class="quiz-card"><div class="question-meta"><span class="question-number">QUESTION ${String(state.index+1).padStart(2,'0')}</span><span class="question-kind">${kindNames[q.type]}</span></div><h1 tabindex="-1" id="question-title">${q.text}</h1><p class="question-hint" id="question-hint">${hint}</p><div class="options ${q.type}" role="group" aria-labelledby="question-title" aria-describedby="question-hint">${q.options.map((o,i)=>`<button class="option ${answer.includes(i)?'selected':''}" data-option="${i}" aria-pressed="${answer.includes(i)}"><span class="option-letter">${q.type==='scale'?i+1:String.fromCharCode(65+i)}</span><span>${o.label}</span>${answer.includes(i)?'<span class="option-check" aria-hidden="true">✓</span>':''}</button>`).join('')}</div>${q.type==='scale'?'<div class="scale-endpoints"><span>不符合我的习惯</span><span>符合我的习惯</span></div>':''}<p class="form-error" role="status" id="answer-status"></p>
 <div class="quiz-bottom"><button class="back-link" data-action="previous" ${state.index===0?'disabled':''}>← 上一题</button><div class="question-dots" aria-hidden="true">${questions.map((_,i)=>`<i class="${isAnswered(i)?'done ':''}${i===state.index?'current':''}"></i>`).join('')}</div><button class="pixel-button" data-action="next" ${valid?'':'disabled'}>${state.index===31?'领取道具':'下一题'} <span class="arrow">→</span></button></div><p class="quiz-note">选择不会自动跳转，可以慢慢想，也可以返回修改。进度保存在当前浏览器。</p></div></section>`;
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
 if(state.index<31){state.index++;persist();renderQuestion();focusQuestion();window.scrollTo({top:0,behavior:'instant'});}
 else{try{state.result=evaluate(state.answers);persist();go('result');}catch{state.index=state.answers.findIndex(a=>!a);renderQuestion();toast('还有题目没有完成，请补充选择');}}
}
function previous(){if(state.index>0){state.index--;persist();renderQuestion();focusQuestion();}}
function renderCollection(){main.innerHTML=`<section class="collection"><div class="eyebrow">THE ITEM COLLECTION</div><h1 class="page-heading">每件道具，都有自己的用处。</h1><p class="collection-intro">有的适合启程，有的适合守护，有的能把一个新点子变成现实。看看这些熟悉的物品，藏着怎样的做事方式。</p><div class="collection-grid">${items.map(item=>`<button class="collection-card" data-item="${item.id}">${itemImage(item,'loading="lazy"')}<h2>${item.name}</h2><p>${item.core}</p><span class="tag">${item.tags.join(' · ')}</span></button>`).join('')}</div><div class="result-actions"><button class="pixel-button" data-action="start">${state.result?'查看我的道具':'寻找我的本命道具'} <span class="arrow">→</span></button></div></section>`;}
function explainItem(id){const item=items.find(i=>i.id===id);if(!item)return;showDialog(item.name,`<div class="dialog-body">${itemImage(item,'class="dialog-item-image"')}<p style="text-align:center;color:${item.color}">${item.core}</p><div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><h3>道具档案</h3><p>${item.review}</p><p style="font-size:12px">这是道具的特质设定。完成探索后，可以查看它与你的适配程度。</p></div>`);}
function about(){showDialog('这次探索怎么玩？',`<div class="dialog-body"><p>如果只能带走一件 MC 道具，哪件会与你的做事方式合拍？从 32 个日常选择出发，看看你的随身装备。</p><h3>八个角度，分别观察</h3><div class="trait-chips">${traits.map(t=>`<span class="tag">${t.name}</span>`).join('')}</div><p>每个角度都有四道题，分别采用二选一、四项情境单选、五项选二和五档倾向量表。独立计分，你可以同时有很强的筹划习惯和应变倾向。</p><h3>匹配度怎样产生？</h3><p>将八项得分与 16 件道具各自的特质档案比较，用均方根距离计算接近程度。题目等权，多选题会归一化。越接近，匹配度越高；TOP3 也可能很接近或并列。</p><h3>按真实的自己选择</h3><p>得分高低表示倾向强弱，不代表能力或优劣。这是娱乐与自我探索体验，匹配度是本站规则下的接近程度，不是心理诊断或统计概率。</p><h3>你的进度与结果图</h3><p>回答只保存在当前浏览器，不上传服务器。结果图片在设备上生成，可以直接保存到设备。重新测试会清除本次回答。</p><h3>素材鸣谢</h3><p>道具材质来自 <a href="https://github.com/InventivetalentDev/minecraft-assets" target="_blank" rel="noopener">Minecraft 资源整理</a>，字体使用 <a href="https://github.com/TakWolf/fusion-pixel-font" target="_blank" rel="noopener">缝合像素字体</a>（OFL）。浮空岛与方块图标由本项目绘制、组合。Minecraft 属于 Mojang / Microsoft，本项目为非官方同人作品。</p></div>`);}
function renderResult(){
 if(!state.result){go('home');return;}
 const {scores,ranking}=state.result,{item,match}=ranking[0],hits=hitTraits(scores,item);
 const near=ranking[0].match-ranking[1].match<2;
 main.innerHTML=`<section class="results"><div class="result-topline"><div class="eyebrow">QUEST COMPLETE / 道具已解锁</div><button class="back-link" data-action="home">返回首页 ↗</button></div><div class="result-grid"><article class="reward-card" style="--item-color:${item.color}"><div class="reward-kicker">你的本命道具</div><div class="reward-image-box">${itemImage(item)}</div><h1>${item.name}</h1><div class="item-english">${item.english}</div><p class="item-core">${item.core}</p><div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="match-line"><div><span>道具匹配度</span><p>根据你的 32 次日常选择</p></div><strong>${Math.round(match)}<span>%</span></strong></div><p class="match-small">${near?'你的前几件道具适配度接近，看看 TOP3 的不同侧面。':'这是本次回答与道具特质档案的接近程度。'}</p></article>
 <div class="result-right"><article class="result-panel"><h2 class="panel-heading"><span>01 /</span> 为什么是这件道具？</h2><p class="review">${resultReview(scores,item)}</p><p class="item-tip">给你的一个小提示：${item.tip}</p></article><article class="result-panel"><h2 class="panel-heading"><span>02 /</span> 命中的特质</h2><div class="hit-list">${hits.length?hits.map(h=>`<div class="hit-row"><strong>${h.trait.name}<br><span style="font-size:11px;color:#9caf84">${Math.round(h.score)} / 100</span></strong><p>${h.trait.description}</p></div>`).join(''):'<p class="review">你的特质组合比较柔和，暂时没有特别突出的单项命中。这件道具来自整体轮廓的接近，而不是某一个标签。</p>'}</div></article></div></div>
 <section class="profile-section"><h2 class="panel-heading"><span>03 /</span> 你的八维特质轮廓</h2><div class="profile-layout"><canvas class="radar" width="840" height="700" role="img" aria-label="八维评分雷达图，具体得分见旁边的评分列表"></canvas><div class="score-list">${traits.map((t,i)=>`<div class="score-row"><span>${t.name}</span><span class="score-bar"><i style="width:${scores[i]}%;background:${t.color}"></i></span><span>${Math.round(scores[i])}</span></div>`).join('')}</div></div><p class="profile-note">数值表示本次回答中表现出的倾向强度。每个维度独立计分，可以同时高，也可以同时低。</p></section>
 <section class="top-section"><div class="section-label"><h2><span>04 /</span> 最佳匹配 TOP 3</h2><span>同一个你，也有不同的装备选择。</span></div><div class="top-items">${ranking.slice(0,3).map((r,i)=>`<article class="top-item">${itemImage(r.item)}<div><div class="rank-label">${String(i+1).padStart(2,'0')} / ${i===0?'本命道具':'同样合拍'}</div><h3>${r.item.name}</h3><div class="top-match">${Math.round(r.match)}% 匹配${i>0&&Math.round(r.match)===Math.round(ranking[i-1].match)?' · 接近并列':''}</div><p>${r.item.tags.join(' · ')}</p></div></article>`).join('')}</div></section>
 <div class="result-actions"><button class="pixel-button" data-action="save">保存图片 <span class="arrow">↓</span></button><button class="pixel-button secondary" data-action="restart">重新开始测试 <span class="arrow">↻</span></button></div><p class="result-footnote">一次选择描绘的是当下的倾向，无法概括完整的你。匹配度依据本站道具设定计算，供娱乐与自我探索。</p></section>`;
 drawRadar(document.querySelector('.radar'),scores);
}
function drawRadar(canvas,scores){
 const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2+5,r=Math.min(w*.31,h*.32);ctx.clearRect(0,0,w,h);
 const point=(i,radius)=>[cx+Math.cos(-Math.PI/2+i*Math.PI/4)*radius,cy+Math.sin(-Math.PI/2+i*Math.PI/4)*radius];
 for(let level=1;level<=4;level++){ctx.beginPath();for(let i=0;i<8;i++){const [x,y]=point(i,r*level/4);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.strokeStyle='#435238';ctx.lineWidth=1.5;ctx.stroke();}
 for(let i=0;i<8;i++){const [x,y]=point(i,r);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle='#3a4932';ctx.stroke();}
 ctx.beginPath();scores.forEach((score,i)=>{const [x,y]=point(i,r*score/100);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.fillStyle='#b5d77c29';ctx.fill();ctx.strokeStyle='#b5d77c';ctx.lineWidth=3;ctx.stroke();
 scores.forEach((score,i)=>{const [x,y]=point(i,r*score/100);ctx.fillStyle='#d4e9a9';ctx.fillRect(x-4,y-4,8,8);});
 ctx.font='24px Pixel, sans-serif';ctx.fillStyle='#bdcbae';ctx.textBaseline='middle';
 traits.forEach((t,i)=>{const [x,y]=point(i,r+45);ctx.textAlign=i===0||i===4?'center':i<4?'left':'right';ctx.fillText(t.name,x,y);});
 ctx.textAlign='left';ctx.fillStyle='#839675';ctx.font='17px Pixel, sans-serif';ctx.fillText('0',cx+9,cy+15);ctx.fillText('100',cx+9,cy-r+10);
}
async function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('道具图片读取失败'));image.src=src;});}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const char of text){if(ctx.measureText(line+char).width>maxWidth&&line){ctx.fillText(line,x,y);line=char;y+=lineHeight;}else line+=char;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
async function makeShareImage(){
 await document.fonts.ready;
 const {scores,ranking}=state.result,{item,match}=ranking[0];
 const icons=await Promise.all(ranking.slice(0,3).map(r=>loadImage(`./assets/${r.item.id}.png`)));
 const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1630;
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#171e18';c.fillRect(0,0,900,1630);
 c.strokeStyle='#51623d';c.lineWidth=3;c.strokeRect(24,24,852,1582);c.strokeStyle='#34452d';c.strokeRect(34,34,832,1562);
 c.textAlign='left';c.fillStyle='#b5d77c';c.font='34px Pixel';c.fillText('MCTI.',62,89);c.font='18px Pixel';c.fillStyle='#a8b797';c.textAlign='right';c.fillText('你的本命道具 / ITEM DISCOVERED',838,86);
 c.strokeStyle='#3b4c32';c.beginPath();c.moveTo(62,112);c.lineTo(838,112);c.stroke();
 c.textAlign='center';c.font='22px Pixel';c.fillStyle='#c1d6a0';c.fillText('如果只能带走一件 MC 道具',450,166);
 c.fillStyle='#232f21';c.fillRect(335,195,230,230);c.drawImage(icons[0],365,225,170,170);
 c.font='58px Pixel';c.fillStyle=item.color;c.fillText(item.name,450,502);c.font='19px Pixel';c.fillStyle='#a1af92';c.fillText(item.english,450,541);
 c.font='25px Pixel';c.fillStyle='#e1e7d3';c.fillText(item.core,450,590);
 c.font='22px Pixel';c.fillStyle='#aabb94';c.fillText('道具匹配度',360,654);c.font='44px Pixel';c.fillStyle='#b5d77c';c.fillText(`${Math.round(match)}%`,565,658);
 c.textAlign='left';c.font='23px Pixel';c.fillStyle='#c1cdb2';wrapText(c,resultReview(scores,item),77,720,746,37);
 c.fillStyle='#b5d77c';c.font='24px Pixel';c.fillText('你的八维特质轮廓',77,946);
 traits.forEach((t,i)=>{const col=i%2,row=Math.floor(i/2),x=77+col*397,y=1000+row*67;c.fillStyle='#bdcbb0';c.font='21px Pixel';c.fillText(t.name,x,y);c.textAlign='right';c.fillStyle=t.color;c.fillText(String(Math.round(scores[i])),x+340,y);c.textAlign='left';c.fillStyle='#34432b';c.fillRect(x,y+16,340,8);c.fillStyle=t.color;c.fillRect(x,y+16,340*scores[i]/100,8);});
 c.fillStyle='#b5d77c';c.font='24px Pixel';c.fillText('最佳匹配 TOP 3',77,1301);
 ranking.slice(0,3).forEach((r,i)=>{const x=77+i*257;c.fillStyle='#253020';c.fillRect(x,1323,232,146);c.drawImage(icons[i],x+15,1342,56,56);c.fillStyle='#e3e7d6';c.font='21px Pixel';c.fillText(r.item.name,x+14,1430);c.fillStyle='#b5d77c';c.font='23px Pixel';c.fillText(`${Math.round(r.match)}%`,x+93,1377);});
 c.textAlign='center';c.fillStyle='#9daf89';c.font='17px Pixel';c.fillText('32 次日常选择 · 8 项独立特质 · 16 件随身装备',450,1521);c.font='16px Pixel';c.fillStyle='#89997c';c.fillText('匹配度为道具设定的接近程度，供娱乐与自我探索。',450,1557);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片生成失败')),'image/png'));
}
async function saveImage(button){
 button.disabled=true;const original=button.innerHTML;button.textContent='正在制作道具卡…';
 try{const blob=await makeShareImage();if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(blob);
 showDialog('你的道具卡已准备好',`<p class="dialog-message">下载 PNG 保存到设备；手机也可以长按下方图片保存。</p><img class="share-preview" src="${previewUrl}" alt="包含本命道具、匹配度、评语、八维评分和 TOP3 的结果卡"><div class="dialog-actions"><a class="pixel-button small" href="${previewUrl}" download="MCTI-${state.result.ranking[0].item.name}.png">下载 PNG 图片 ↓</a></div>`);
 }catch(error){toast('图片暂时未能生成，请稍后重试');console.error(error);}finally{button.disabled=false;button.innerHTML=original;}
}
function restart(){state.index=0;state.answers=Array(32).fill(null);state.result=null;persist();go('quiz');focusQuestion();}
document.addEventListener('click',e=>{
 const option=e.target.closest('[data-option]');if(option){selectOption(Number(option.dataset.option));return;}
 const item=e.target.closest('[data-item]');if(item){explainItem(item.dataset.item);return;}
 const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
 const actions={home:()=>go('home'),collection:()=>go('collection'),about,start,next,previous,restart,save:()=>saveImage(button)};
 actions[button.dataset.action]?.();
});
restore();render();document.fonts.ready.then(()=>{if(state.screen==='result')drawRadar(document.querySelector('.radar'),state.result.scores);});
