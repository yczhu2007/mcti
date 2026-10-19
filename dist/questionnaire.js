// Selected from the public-domain IPIP-NEO-120 and Big-Five marker items.
// Chinese wording and mixed response formats are site adaptations, not a validated scale.
export const traits = [
 {key:'O',name:'开放性',color:'#caabef',description:'愿意琢磨新想法，也容易被想象和美感吸引。',low:'更相信熟悉的经验，喜欢具体、能落地的东西。'},
 {key:'C',name:'尽责性',color:'#b4d878',description:'做事有交代，愿意把安排和收尾照顾好。',low:'喜欢给行动留些余地，不愿被安排得太满。'},
 {key:'E',name:'外向性',color:'#edb77a',description:'愿意主动交流，在人群中表达自己。',low:'更享受安静和独处，熟悉以后才慢慢打开。'},
 {key:'A',name:'宜人性',color:'#e5a1b3',description:'相处时会顾及别人的处境，愿意先给人信任。',low:'有自己的判断，不会为了和气轻易让步。'},
 {key:'N',name:'情绪敏感度',color:'#83b9e5',description:'容易留意到压力和不安，需要一点时间消化。',low:'遇到波折时比较沉得住气，情绪不容易被带走。'},
];
const neo='https://ipip.ori.org/30FacetNEO-PI-RItems.htm';
const markers='https://ipip.ori.org/newBigFive5broadKey.htm';
// Each entry keeps the original item, its source key and facet for inspection.
const bank = [
 [
  {original:'Have a vivid imagination.',keyed:'plus',facet:'O1 想象',text:'读到一个故事，或者听别人讲经历时，你脑海里的画面通常是？',labels:['主要记住发生了什么，很少出现画面','偶尔浮现几个片段','人物和场景会慢慢清晰起来','像在脑中放电影，连细节也能想象出来']},
  {original:'See beauty in things that others might not notice.',keyed:'plus',facet:'O2 审美',text:'我常会在别人没有留意的地方发现美，比如光影、声音或细小的纹理。'},
  {original:'Prefer to stick with things that I know.',keyed:'minus',facet:'O4 尝新',text:'两种安排都方便、也都负担得起，你通常更偏向？',labels:['熟悉的选择，知道自己会喜欢','没体验过的选择，想看看有什么不同']},
  {original:'Avoid philosophical discussions.',keyed:'minus',facet:'O5 观念探索',text:'聊到“人为什么会这样想”之类没有直接答案的问题时，我通常想尽快换个话题。'},
  {original:'Spend time reflecting on things.',keyed:'plus',facet:'O 反思',source:markers,text:'一件事情告一段落后，你通常会花多少心思回想它？',labels:['结束就翻篇，把注意力放在接下来的事','偶尔想起一个片段','会想想自己和别人为什么那样做','常会反复琢磨不同角度，想通后还想再聊聊']},
  {original:'Rarely notice my emotional reactions.',keyed:'minus',facet:'O3 内在感受',text:'事情发生时，我很少留意自己究竟有什么情绪反应。'},
 ],
 [
  {original:'Complete tasks successfully.',keyed:'plus',facet:'C1 胜任感',text:'回想最近几次由你负责到底的事情，通常怎样收尾？',labels:['常没能完成，需要别人接着处理','能完成一部分，有些事情会留着','大多能完成，遇到问题会找办法','通常能按要求做完，也会处理好遗留问题']},
  {original:'Leave my belongings around.',keyed:'minus',facet:'C2 秩序',text:'用完东西后，我经常随手一放，过后才想起来它还没归位。'},
  {original:'Keep my promises.',keyed:'plus',facet:'C3 守诺',text:'答应别人一件小事，没有人提醒时，你通常更接近？',labels:['我仍会记着，尽量按约定做到','有时会先忙别的，过后才想起这件事']},
  {original:'Work hard.',keyed:'plus',facet:'C4 投入',text:'为了做好自己认定的事情，我愿意持续投入时间和精力。'},
  {original:'Have difficulty starting tasks.',keyed:'minus',facet:'C5 自律',text:'一件该做的事已经摆在面前，你通常多久能真正开始？',labels:['通常能直接开始，较快进入状态','稍作准备就能开始','常先处理其他事情，拖一会儿才开始','即使知道该做，也经常迟迟迈不出第一步']},
  {original:'Jump into things without thinking.',keyed:'minus',facet:'C6 审慎',text:'我有时还没想清楚可能的后果，就已经答应或开始行动了。'},
 ],
 [
  {original:'Make friends easily.',keyed:'plus',facet:'E1 亲近感',text:'来到一个新集体，你通常怎样认识新朋友？',labels:['需要相处很久，才会和少数人熟起来','有人主动接近时，我比较容易回应','会主动找合得来的人聊聊','通常很快就能聊开，结识不少人']},
  {original:'Prefer to be alone.',keyed:'minus',facet:'E2 群体偏好',text:'自由安排休息时间时，我通常更愿意一个人待着。'},
  {original:'Wait for others to lead the way.',keyed:'minus',facet:'E3 主动表达',text:'大家都还没决定下一步时，你更常？',labels:['先看看别人怎么带头，再接着参与','先提出一个方向，让大家有个起点']},
  {original:'Like to take it easy.',keyed:'minus',facet:'E4 活动节奏',text:'我喜欢放慢生活节奏，不想让空闲时间塞满各种活动。'},
  {original:'Seek adventure.',keyed:'plus',facet:'E5 刺激寻求',text:'有机会参加一项风险可控、带点刺激的体验，你通常？',labels:['更愿意选安稳轻松的活动','看别人体验就已经觉得不错','愿意先做些准备，再亲自试试','很容易心动，愿意主动报名体验']},
  {original:'Radiate joy.',keyed:'plus',facet:'E6 积极情绪',text:'我开心起来时，身边的人通常也很容易被我的兴致带动。'},
 ],
 [
  {original:'Trust others.',keyed:'plus',facet:'A1 信任',text:'和一个刚认识、还不了解的人合作，你通常从哪里开始？',labels:['先核实和观察，信任需要慢慢建立','先给一点空间，看对方怎么做','一般会先相信对方，再根据实际调整','通常愿意先信任对方，不会预设坏意']},
  {original:'Use others for my own ends.',keyed:'minus',facet:'A2 真诚',text:'我有时会为了达到自己的目的利用别人。'},
  {original:'Am concerned about others.',keyed:'plus',facet:'A3 关心',text:'日常相处中，你的注意力更常放在？',labels:['除了自己的事，也会留意别人过得怎样','先照顾好自己的事，别人需要时再开口']},
  {original:'Get back at others.',keyed:'minus',facet:'A4 合作',text:'被人冒犯以后，我常会想着找机会还回去。'},
  {original:'Boast about my virtues.',keyed:'minus',facet:'A5 谦逊',text:'聊到自己做得不错的事情，你通常会怎样讲？',labels:['除非别人问起，否则不太主动提','简单讲讲发生了什么','会着重讲自己做得好的部分','很愿意多讲讲自己的长处，希望大家知道']},
  {original:'Feel sympathy for those who are worse off than myself.',keyed:'plus',facet:'A6 同情',text:'看到处境比自己困难的人，我通常会真切地替对方难受。'},
 ],
 [
  {original:'Worry about things.',keyed:'plus',facet:'N1 担忧',text:'事情的结果还没确定时，你脑中通常更接近哪种状态？',labels:['先做眼前能做的，不太反复担心','偶尔想到可能的问题，随后能放下','会多想几种不好的可能，时不时挂心','常常反复担心，很难把注意力移开']},
  {original:'Am not easily annoyed.',keyed:'minus',facet:'N2 烦躁',text:'遇到让人不顺心的小事，我通常不太容易被惹恼。'},
  {original:'Feel comfortable with myself.',keyed:'minus',facet:'N3 自我感受',text:'大多数时候，和自己相处的感觉更接近？',labels:['基本自在，能接受现在的自己','经常对自己不满意，容易和自己较劲']},
  {original:'Am afraid to draw attention to myself.',keyed:'plus',facet:'N4 自我意识',text:'成为大家注意的焦点时，我常会担心自己的表现，感到不自在。'},
  {original:'Rarely overindulge.',keyed:'minus',facet:'N5 克制',text:'遇到特别喜欢的吃喝或娱乐，你通常怎样把握分寸？',labels:['常常停不下来，过后才发现超出了原本打算','有时会多一点，需要提醒自己停下','大多能在满足以后收住','通常很容易适可而止，不太会过量']},
  {original:'Panic easily.',keyed:'plus',facet:'N6 压力应对',text:'突发情况一起出现时，我很容易慌张，一时不知道先处理什么。'},
 ],
];
export const questionnaireVersion='ipip-selected-30-v4';
const formats=['single','scale','binary','scale','single','scale'];
export const questions=Array.from({length:6},(_,round)=>traits.map((_,dimension)=>{
 const entryIndex=(round+dimension)%6,entry=bank[dimension][entryIndex],type=formats[entryIndex];
 const labels=entry.labels||['很不符合','不太符合','介于两者','比较符合','非常符合'];
 const values=type==='single'?[1,7/3,11/3,5]:type==='binary'?[5,1]:[1,2,3,4,5];
 let options=labels.map((label,i)=>({label,value:values[i]}));
 if(type!=='scale'){const offset=(round+dimension)%options.length;options=[...options.slice(offset),...options.slice(0,offset)];}
 return {id:`ipip-selected-${traits[dimension].key}-${entryIndex+1}`,dimension,type,facet:entry.facet,text:entry.text,original:entry.original,source:entry.source||neo,keyed:entry.keyed,reverse:entry.keyed==='minus',options};
})).flat();
export function questionScore(q,answer){
 if(!Array.isArray(answer)||answer.length!==1||!Number.isInteger(answer[0])||!q.options[answer[0]])throw new Error('请选择一项');
 const raw=q.options[answer[0]].value;return q.reverse?6-raw:raw;
}
export function normalizeMeans(means){return means.map(mean=>(mean-3)/2);}
export function scoreScale(answers){
 if(!Array.isArray(answers)||answers.length!==questions.length)throw new Error(`请完成全部${questions.length}题`);
 const totals=traits.map(()=>0),counts=traits.map(()=>0);
 questions.forEach((q,i)=>{totals[q.dimension]+=questionScore(q,answers[i]);counts[q.dimension]++;});
 const means=totals.map((sum,i)=>sum/counts[i]);
 return {means,vector:normalizeMeans(means)};
}
