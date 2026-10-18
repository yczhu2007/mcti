export const traits = [
  {name:'前瞻筹划',short:'筹划',color:'#b4d878',description:'为未来留出余地，把准备做在前面。',low:'更愿意把精力放在眼前，按需要逐步准备。'},
  {name:'机制钻研',short:'钻研',color:'#65c8be',description:'不只想知道怎么用，也想弄清为什么。',low:'更看重直接体验，让实际用途带路。'},
  {name:'创意联想',short:'创意',color:'#caabef',description:'把熟悉的东西重新组合，发现另一种可能。',low:'更愿意深挖成熟做法，让好方法发挥作用。'},
  {name:'行动决断',short:'决断',color:'#edb77a',description:'在不完全确定时，也能选定方向开始推进。',low:'愿意多留一点观察时间，等判断更清楚。'},
  {name:'细节觉察',short:'觉察',color:'#83b9e5',description:'注意微小差异，从不起眼的地方发现线索。',low:'习惯先抓住全貌，再按需要聚焦细节。'},
  {name:'群体照应',short:'照应',color:'#e5a1b3',description:'把他人的需要和共同体验纳入自己的选择。',low:'更习惯让每个人照顾自己的需求，保留空间。'},
  {name:'自主边界',short:'自主',color:'#c7ca8c',description:'重视自己的节奏，也知道哪些空间想留给自己。',low:'更愿意共享安排，在相互参与中找到节奏。'},
  {name:'临场应变',short:'应变',color:'#89d2d5',description:'当现场发生变化，愿意调整路径继续前进。',low:'倾向先恢复熟悉的节奏，再继续向前。'},
];

// Every trait gets one question of every format; formats rotate in the visible order.
const bank = [
 [
  ['周末要去一个陌生的地方，你更享受哪种出发方式？',['先看好路线和几个落脚点','先确定目的地，细节到了再说']],
  ['下周要组织一次小聚，今天有一点空闲，你会先做什么？',['把时间、地点和备选安排理一遍','只把最关键的时间地点定下来','先问问大家想法，过两天再决定','等临近那天，按当时的情况安排']],
  ['一件重要的事还有一周开始，你最想先做哪两件事？',['列出需要准备的东西','想好出状况时的备选方案','确认眼下必须知道的信息','先处理今天已经排好的事情','留些时间，等新信息出现再安排']],
  ['比起提前安排后面的事，我更喜欢只确定眼前这一步。'],
 ],
 [
  ['遇到一个很好用的新工具，你更容易满足于哪种状态？',['已经能顺手解决我的问题','知道它为什么能这样解决问题']],
  ['一个常用功能突然失效，暂时又不着急使用，你会怎么做？',['先换个工具，把它放一边','找一个能恢复使用的办法就好','对比几种情况，看看问题在哪','尝试复现它，弄清触发的条件']],
  ['接触一个新爱好，哪些过程最能让你投入？选两项。',['直接体验它带来的乐趣','学会几招马上能用的技巧','跟着完整教程走一遍','比较不同方法为何效果不同','拆开关键步骤，试出背后的规律']],
  ['即使已经知道怎样操作，我仍会想弄懂背后的原理。'],
 ],
 [
  ['手里有一套熟悉的材料，你更想做哪件事？',['照成熟的做法，把它做得更好','换个组合，看看能做出什么']],
  ['朋友让你设计一次普通的生日活动，你第一反应是？',['选一个大家都喜欢的经典安排','在熟悉的安排里加一个小变化','把两种不相关的活动拼在一起','先想几个从没试过的玩法再挑']],
  ['一份任务允许自由发挥，你最想把时间花在哪两处？',['尝试一个完全不同的表达形式','把不同领域的点子组合起来','在现有方案上改一点细节','精修一个已经确定的好方案','研究优秀范例，再照着完成']],
  ['看到一个东西时，我经常会想到它原本用途之外的用法。'],
 ],
 [
  ['几个方案各有好处，信息暂时也不会更多，你通常更愿意？',['先选一个可行的，边做边确认','再留点时间，让判断更清楚']],
  ['一群人讨论了很久，还没决定下一步，你更可能？',['继续听听，看看有没有遗漏','帮忙补充信息，让选择更清楚','推荐一个方案，请大家确认','在自己的职责内先把第一步启动']],
  ['一个想法刚出现时，你最自然的两种反应是？',['先做个小版本试一试','找一件今天就能推进的事','和别人聊聊，再决定下一步','比较几个选项的得失','先放一放，观察它是否值得投入']],
  ['没有十足把握时，我通常也能选一个方向先开始。'],
 ],
 [
  ['走进一家去过几次的店，你更容易注意到？',['今天整体的气氛和感觉','摆设、声音或某个位置的小变化']],
  ['看完一段短视频后，朋友问你记住了什么，你更接近？',['大致讲了什么、整体什么感觉','最突出的几个画面或情节','人物的表情、措辞或背景变化','画面里很小的线索，以及前后的差别']],
  ['挑选一件日常用品时，你通常会关注哪两件事？',['第一眼的整体感觉','它是否满足主要用途','常见评价里反复出现的点','接缝、手感或按键这些小地方','不同版本之间不明显的差别']],
  ['熟悉的环境发生细小变化时，我往往不会马上注意到。'],
 ],
 [
  ['和朋友一起出门，你通常更接近哪种状态？',['留意大家是否都跟得上、玩得舒服','各自表达需要，想分开逛也很自然']],
  ['聚会里有个人一直没怎么参与，你更可能？',['让对方按自己的方式待着','留个能加入的位置，等对方自己决定','找个轻松的话题，单独和对方聊聊','调整一下活动，让对方更容易参与']],
  ['大家一起完成一件事，你最自然会做哪两件事？',['留意有没有人需要搭把手','调整分工，让大家都更舒服','把自己的进度同步给大家','专注完成分配给我的部分','让每个人自主处理自己的部分']],
  ['做共同的决定时，我会主动想到不太发声的人的需要。'],
 ],
 [
  ['难得有一整天空闲，你更喜欢？',['和亲近的人一起商量怎么过','保留一段由自己决定、不被安排的时间']],
  ['朋友临时提出改变你原本的个人安排，你通常？',['一起行动也很好，很容易就改了','看看双方需要，倾向配合对方','愿意调整一部分，但保留重要安排','先保护自己的安排，另约合适时间']],
  ['和别人长期相处时，你最重视哪两种体验？',['彼此有不必解释的独处时间','重要的个人选择由自己决定','需要时能互相商量','生活安排尽量一起决定','多数经历都能一起参与']],
  ['即使关系很亲近，我也希望保留一些只属于自己的空间。'],
 ],
 [
  ['原定活动突然取消，你的注意力更容易转向？',['先看看有没有办法恢复原来的安排','看看眼下还能临时换成什么有趣的事']],
  ['到现场才发现条件和预想不同，你会先？',['找办法尽量还原原来的做法','暂停一下，把新安排完整想清楚','保留目标，调整其中几个步骤','直接利用现场条件，换条路试着做']],
  ['一次出行遇到临时变化，你最可能做哪两件事？',['利用眼下的机会，换一种玩法','边尝试边调整后续安排','先弄清现在有哪些可行选择','重新做一份清楚的安排再行动','尽量找回原先熟悉的路线']],
  ['事情脱离原来的安排时，我需要较长时间才能重新进入状态。'],
 ],
];
const kinds=['binary','single','multi','scale'];
const reverse = new Set([0,4,7]);
function makeQuestion(d,t){
 const [text,labels]=bank[d][t];
 const q={id:`d${d}-${t}`,dimension:d,type:kinds[t],text,reverse:t===3&&reverse.has(d)};
 if(t===3)q.options=['很不符合','不太符合','介于两者','比较符合','非常符合'].map((label,i)=>({label,value:q.reverse?100-i*25:i*25}));
 else {
  const descending=t===0?[0,3,5].includes(d):t===1?d===0:[0,2,3,5,6,7].includes(d);
  const values=t===0?[0,100]:t===1?[0,100/3,200/3,100]:[0,25,50,75,100];
  q.options=labels.map((label,i)=>({label,value:descending?values[values.length-1-i]:values[i]}));
  // Keep answer position unrelated to trait intensity while preserving repeatability.
  if(t!==3){const offset=(d*3+t)%q.options.length;q.options=[...q.options.slice(offset),...q.options.slice(0,offset)];}
 }
 return q;
}
export const questions=Array.from({length:4},(_,round)=>Array.from({length:8},(_,d)=>makeQuestion(d,(round+d+1)%4))).flat();

// Curated item affinity profiles, not personality categories or diagnostic norms.
export const items=[
 {id:'respawn_anchor',name:'重生锚',english:'RESPAWN ANCHOR',core:'把未来的退路，变成此刻的底气。',tags:['长线布局','提前准备'],profile:[95,65,40,55,65,30,85,50],color:'#b9a1eb',review:'你习惯把视线放得远一点。别人看到的是眼前的一步，你已经在为之后的转折留出空间。重生锚适合这样的你：准备不是犹豫，而是让出发更有底气。',tip:'偶尔也给计划留一个空位，让意外的风景进入。'},
 {id:'enchanting_table',name:'附魔台',english:'ENCHANTING TABLE',core:'有趣的答案，藏在机制深处。',tags:['研究机制','探索组合'],profile:[65,95,80,30,75,30,75,45],color:'#bda1eb',review:'你不满足于“能用就好”。拆解原理、比较差异，再试出一个意想不到的组合，是你投入一件事的方式。附魔台像你的工作台：知识积累起来，普通材料也能拥有新可能。',tip:'把研究中的小发现拿出来试一次，体验也会给你答案。'},
 {id:'command_block',name:'命令方块',english:'COMMAND BLOCK',core:'把一个想法，推进成共同的现实。',tags:['统筹调度','推动执行'],profile:[85,65,60,95,50,70,55,60],color:'#e8b080',review:'面对零散的想法，你倾向于找出方向、安排步骤，再推动事情真正发生。命令方块适合你组织和调度的节奏：让复杂的事情有顺序，让大家的努力能落到同一个目标上。',tip:'推进之前给不同意见一点空间，执行会更顺畅。'},
 {id:'slime_block',name:'黏液块',english:'SLIME BLOCK',core:'换一种组合，世界就有新玩法。',tags:['发散试验','创造玩法'],profile:[30,75,95,70,40,40,60,90],color:'#b4d878',review:'在你眼里，东西未必只有说明书上的用法。试一试、拼一拼，甚至借一次失误弹向另一个方向，都能让你兴奋。黏液块适合你的创造方式：让点子彼此连接，再把可能性弹得更远。',tip:'给最喜欢的那个点子多一点打磨，它值得被完成。'},
 {id:'sculk_sensor',name:'幽匿感测体',english:'SCULK SENSOR',core:'别人略过的细节，你听见了。',tags:['敏锐观察','捕捉信号'],profile:[65,65,45,25,95,65,70,55],color:'#78c5c5',review:'你常常先观察，再作判断。一点语气变化、一个不起眼的细节，都可能被你放进更完整的理解里。幽匿感测体适合你的敏锐：安静地接收信号，也在合适的时候作出回应。',tip:'不必回应每一个信号，选择哪些值得投入也是一种能力。'},
 {id:'ender_chest',name:'末影箱',english:'ENDER CHEST',core:'重要的东西，有自己的位置。',tags:['内在价值','个人边界'],profile:[60,45,65,30,65,45,95,40],color:'#a39be0',review:'你重视的东西，未必需要所有人理解。自己的节奏、珍惜的关系和不想被打扰的空间，都值得认真安放。末影箱适合你：走到哪里，都能带着属于自己的那一部分。',tip:'遇到可信任的人，可以慢慢打开一格空间。'},
 {id:'beacon',name:'信标',english:'BEACON',core:'自己发光，也让身边的人走得更远。',tags:['引领鼓舞','帮助成长'],profile:[70,40,65,80,60,95,40,55],color:'#8fd8d4',review:'你关注的不只是事情有没有完成，还有大家能不能一起走下去。把方向说清楚、给人一点支持、看见他人的进步，是你自然会做的事。信标适合你把个人行动变成共同力量的方式。',tip:'照亮别人时，也为自己的需要留一点能量。'},
 {id:'elytra',name:'鞘翅',english:'ELYTRA',core:'边界之外，还有下一片风景。',tags:['自由探索','追逐可能'],profile:[35,55,90,60,40,55,90,80],color:'#c7b4e1',review:'比起一直停在确定的地方，你更愿意看看别处还有什么。新的路线、不同的经历和自己选择方向的自由，都能给你能量。鞘翅适合你的探索欲：不急着把世界定型，先让自己飞出去。',tip:'给喜欢的风景一个落脚点，自由也可以有补给站。'},
 {id:'shulker_box',name:'潜影盒',english:'SHULKER BOX',core:'准备妥当，走到哪里都有章法。',tags:['整理有序','准备充分'],profile:[95,55,25,50,95,40,65,25],color:'#b89ad4',review:'你擅长把零散的东西整理成能随时取用的秩序。关键时刻不慌张，往往来自日常的认真安排。潜影盒适合你：把需要的资源带在身边，让每次出发都有扎实的准备。',tip:'有些不影响目标的小变化，可以不必马上归位。'},
 {id:'totem_of_undying',name:'不死图腾',english:'TOTEM OF UNDYING',core:'关键时刻，你是让人安心的存在。',tags:['可靠守护','关键托底'],profile:[80,30,30,50,85,95,40,45],color:'#d9c482',review:'你可能不总是站在最显眼的位置，却会记得别人的难处，并在需要的时候接住局面。不死图腾适合你踏实的关心：把支持变成具体行动，让重要的人多一份安心。',tip:'可靠不代表每次都要独自承担，接受帮助也很自然。'},
 {id:'netherite_pickaxe',name:'下界合金镐',english:'NETHERITE PICKAXE',core:'一下一下，把目标挖成现实。',tags:['务实高效','持续推进'],profile:[85,55,25,95,70,35,60,40],color:'#b3a8ac',review:'你倾向于把问题落实到“下一步能做什么”。找到方法、保持节奏、持续推进，比空转更让你踏实。下界合金镐适合你的做事方式：不必每一下都惊艳，稳定的行动同样能穿过坚硬的阻碍。',tip:'忙着推进时，偶尔确认一下目标是否仍值得投入。'},
 {id:'conduit',name:'潮涌核心',english:'CONDUIT',core:'好的环境，让每个人都自在一点。',tags:['照应群体','共同环境'],profile:[80,45,45,40,75,95,25,65],color:'#7ed4ca',review:'你愿意留意共同生活里的小事：谁不太方便、哪里还能调整、怎样让大家舒服一点。潮涌核心适合你温和而持续的影响：改善周围的环境，让支持自然地发生在日常。',tip:'共同环境里也有你的位置，把自己的偏好说出来。'},
 {id:'diamond_sword',name:'钻石剑',english:'DIAMOND SWORD',core:'保持冷静，让技巧说话。',tags:['冷静实操','掌握技巧'],profile:[40,80,30,85,80,25,80,75],color:'#78d9ce',review:'你更相信上手之后得到的判断。看清局面、掌握技巧，再做出简洁有效的行动，是你熟悉的节奏。钻石剑适合你的专注：不需要太多铺陈，在真正需要的时候稳稳发挥。',tip:'把自己的经验讲给别人听，也能让技巧更清晰。'},
 {id:'invisibility_potion',name:'隐身药水',english:'INVISIBILITY POTION',core:'按自己的节奏，认真感受世界。',tags:['自主低调','个人体验'],profile:[25,35,70,30,85,35,95,70],color:'#a7bed6',review:'你喜欢保留自己的节奏，按真实的感受决定靠近什么、离开什么。不必一直被看见，也能把体验过得很丰富。隐身药水适合你：给自己留出空间，更自由地观察和选择。',tip:'当你希望被理解时，也可以主动让重要的人看见。'},
 {id:'ender_pearl',name:'末影珍珠',english:'ENDER PEARL',core:'看准落点，就迈出那一步。',tags:['果断行动','承担风险'],profile:[25,45,50,95,65,30,80,95],color:'#6ac4ac',review:'当机会就在眼前，你更愿意选定方向、采取行动，再根据落地后的情况调整。末影珍珠适合你的果断：用一次实际的尝试跨过犹豫，也愿意承担选择带来的变化。',tip:'出手前多看一眼落点，会让勇气更有把握。'},
 {id:'wind_charge',name:'风弹',english:'WIND CHARGE',core:'接住当下，把现场变得有意思。',tags:['即兴活跃','现场体验'],profile:[20,30,90,80,50,80,45,95],color:'#c4dcde',review:'你能从当下的气氛里找到灵感，也愿意用一个点子或一次行动让现场活起来。风弹适合你的轻快：顺势而起，把眼前的瞬间变成值得记住的共同体验。',tip:'留意大家的节奏，让热闹也有舒服的落点。'},
];

export function questionScore(q,answer){
 if(!Array.isArray(answer)||answer.length!==(q.type==='multi'?2:1)||new Set(answer).size!==answer.length||answer.some(i=>!Number.isInteger(i)||!q.options[i]))throw new Error('请完成当前选择');
 const avg=answer.reduce((sum,i)=>sum+q.options[i].value,0)/answer.length;
 return q.type==='multi'?(avg-12.5)/75*100:avg;
}
export function evaluate(answers){
 if(!Array.isArray(answers)||answers.length!==questions.length)throw new Error('请完成全部题目');
 const scores=traits.map(()=>0);
 questions.forEach((q,i)=>{scores[q.dimension]+=questionScore(q,answers[i])/4;});
 return {scores,ranking:rankItems(scores)};
}
export function rankItems(scores){
 return items.map((item,order)=>({item,order,match:100-Math.sqrt(item.profile.reduce((s,v,i)=>s+(v-scores[i])**2,0)/8)})).sort((a,b)=>b.match-a.match||a.order-b.order);
}
export function hitTraits(scores,item){
 return traits.map((trait,i)=>({trait,index:i,score:scores[i],affinity:item.profile[i]})).filter(t=>t.affinity>=65&&t.score>=55).sort((a,b)=>(b.score+b.affinity)-(a.score+a.affinity)).slice(0,3);
}
export function resultReview(scores,item){
 const hits=hitTraits(scores,item);
 if(hits.length){
  const main=hits.slice(0,2);
  return `你的回答里，${main.map(h=>h.trait.name).join('和')}较为明显。${main.map(h=>h.trait.description).join('')}这些选择与${item.name}的部分特点相呼应，让它在整体轮廓上成为这次最合拍的装备。`;
 }
 const low=traits.map((trait,i)=>({trait,score:scores[i]})).filter(t=>t.score<=40).sort((a,b)=>a.score-b.score).slice(0,2);
 return `${low.length?low.map(t=>t.trait.low).join(''):'你的选择没有集中在某一项很强的倾向上，而是在不同情境中保留了多种做法。'}综合八项得分，${item.name}的特质档案与你最接近。这次匹配来自整体组合，你也可以在 TOP3 中看看自己的其他侧面。`;
}
