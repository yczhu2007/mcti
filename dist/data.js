import {describePersonality} from './interpretation.js';
import {traits,questions,questionScore,scoreScale,questionnaireVersion} from './questionnaire.js';
import {prototypeConfig,decodePrototype,matchVector} from './personality.js';
export {traits,questions,questionScore};

const itemDefinitions=[
 {id:'respawn_anchor',name:'重生锚',english:'RESPAWN ANCHOR',core:'把未来的退路，变成此刻的底气。',tags:['长线布局','提前准备'],color:'#b9a1eb',review:'你习惯把视线放得远一点。别人看到的是眼前的一步，你已经在为之后的转折留出空间。重生锚适合这样的你：提前准备，让出发更有底气。',tip:'偶尔也给计划留一个空位，让意外的风景进入。'},
 {id:'enchanting_table',name:'附魔台',english:'ENCHANTING TABLE',core:'有趣的答案，藏在机制深处。',tags:['研究机制','探索组合'],color:'#bda1eb',review:'你愿意花时间弄清一个工具背后的原理。拆解原理、比较差异，再试出一个意想不到的组合，是你投入一件事的方式。附魔台像你的工作台：知识积累起来，普通材料也能拥有新可能。',tip:'把研究中的小发现拿出来试一次，体验也会给你答案。'},
 {id:'command_block',name:'命令方块',english:'COMMAND BLOCK',core:'把一个想法，推进成共同的现实。',tags:['统筹调度','推动执行'],color:'#e8b080',review:'面对零散的想法，你倾向于找出方向、安排步骤，再推动事情真正发生。命令方块适合你组织和调度的节奏：让复杂的事情有顺序，让大家的努力能落到同一个目标上。',tip:'推进之前给不同意见一点空间，执行会更顺畅。'},
 {id:'slime_block',name:'黏液块',english:'SLIME BLOCK',core:'换一种组合，世界就有新玩法。',tags:['发散试验','创造玩法'],color:'#b4d878',review:'在你眼里，东西未必只有说明书上的用法。试一试、拼一拼，甚至借一次失误弹向另一个方向，都能让你兴奋。黏液块适合你的创造方式：让点子彼此连接，再把可能性弹得更远。',tip:'给最喜欢的那个点子多一点打磨，它值得被完成。'},
 {id:'sculk_sensor',name:'幽匿感测体',english:'SCULK SENSOR',core:'别人略过的细节，你听见了。',tags:['敏锐观察','捕捉信号'],color:'#78c5c5',review:'你常常先观察，再作判断。一点语气变化、一个不起眼的细节，都可能被你放进更完整的理解里。幽匿感测体适合你的敏锐：安静地接收信号，也在合适的时候作出回应。',tip:'把精力留给值得回应的信号，也给自己留些安静。'},
 {id:'ender_chest',name:'末影箱',english:'ENDER CHEST',core:'重要的东西，有自己的位置。',tags:['内在价值','个人边界'],color:'#a39be0',review:'你重视的东西，未必需要所有人理解。自己的节奏、珍惜的关系和不想被打扰的空间，都值得认真安放。末影箱适合你：走到哪里，都能带着属于自己的那一部分。',tip:'遇到可信任的人，可以慢慢打开一格空间。'},
 {id:'beacon',name:'信标',english:'BEACON',core:'自己发光，也让身边的人走得更远。',tags:['引领鼓舞','帮助成长'],color:'#8fd8d4',review:'你关注的不只是事情有没有完成，还有大家能不能一起走下去。把方向说清楚、给人一点支持、看见他人的进步，是你自然会做的事。信标适合你把个人行动变成共同力量的方式。',tip:'照亮别人时，也为自己的需要留一点能量。'},
 {id:'elytra',name:'鞘翅',english:'ELYTRA',core:'边界之外，还有下一片风景。',tags:['自由探索','追逐可能'],color:'#c7b4e1',review:'比起一直停在确定的地方，你更愿意看看别处还有什么。新的路线、不同的经历和自己选择方向的自由，都能给你能量。鞘翅适合你的探索欲：顺着好奇心，让自己先飞出去。',tip:'给喜欢的风景一个落脚点，自由也可以有补给站。'},
 {id:'shulker_box',name:'潜影盒',english:'SHULKER BOX',core:'准备妥当，走到哪里都有章法。',tags:['整理有序','准备充分'],color:'#b89ad4',review:'你擅长把零散的东西整理成能随时取用的秩序。关键时刻不慌张，往往来自日常的认真安排。潜影盒适合你：把需要的资源带在身边，让每次出发都有扎实的准备。',tip:'遇到小变化时，可以先照顾好目标，再慢慢整理细节。'},
 {id:'totem_of_undying',name:'不死图腾',english:'TOTEM OF UNDYING',core:'关键时刻，你是让人安心的存在。',tags:['可靠守护','关键托底'],color:'#d9c482',review:'你会记得别人的难处，也愿意在需要的时候接住局面。不死图腾适合你踏实的关心：把支持变成具体行动，让重要的人多一份安心。',tip:'接受帮助，让彼此的支持持续得更久。'},
 {id:'netherite_pickaxe',name:'下界合金镐',english:'NETHERITE PICKAXE',core:'一下一下，把目标挖成现实。',tags:['务实高效','持续推进'],color:'#b3a8ac',review:'你倾向于把问题落实到“下一步能做什么”。找到方法、保持节奏、持续推进，比空转更让你踏实。下界合金镐适合你的做事方式：稳定的行动，能一点点穿过坚硬的阻碍。',tip:'忙着推进时，偶尔确认一下目标是否仍值得投入。'},
 {id:'conduit',name:'潮涌核心',english:'CONDUIT',core:'好的环境，让每个人都自在一点。',tags:['照应群体','共同环境'],color:'#7ed4ca',review:'你愿意留意共同生活里的小事：谁不太方便、哪里还能调整、怎样让大家舒服一点。潮涌核心适合你温和而持续的影响：改善周围的环境，让支持自然地发生在日常。',tip:'共同环境里也有你的位置，把自己的偏好说出来。'},
 {id:'diamond_sword',name:'钻石剑',english:'DIAMOND SWORD',core:'保持冷静，让技巧说话。',tags:['冷静实操','掌握技巧'],color:'#78d9ce',review:'你更相信上手之后得到的判断。看清局面、掌握技巧，再做出简洁有效的行动，是你熟悉的节奏。钻石剑适合你的专注：在真正需要的时候，让熟练的技巧稳稳发挥。',tip:'把自己的经验讲给别人听，也能让技巧更清晰。'},
 {id:'invisibility_potion',name:'隐身药水',english:'INVISIBILITY POTION',core:'按自己的节奏，认真感受世界。',tags:['自主低调','个人体验'],color:'#a7bed6',review:'你喜欢保留自己的节奏，按真实的感受决定靠近什么、离开什么。留一点安静的空间，也能把体验过得很丰富。隐身药水适合你：给自己留出空间，更自由地观察和选择。',tip:'当你希望被理解时，也可以主动让重要的人看见。'},
 {id:'ender_pearl',name:'末影珍珠',english:'ENDER PEARL',core:'看准落点，就迈出那一步。',tags:['果断行动','承担风险'],color:'#6ac4ac',review:'当机会就在眼前，你更愿意选定方向、采取行动，再根据落地后的情况调整。末影珍珠适合你的果断：用一次实际的尝试跨过犹豫，也愿意承担选择带来的变化。',tip:'出手前多看一眼落点，会让勇气更有把握。'},
 {id:'wind_charge',name:'风弹',english:'WIND CHARGE',core:'接住当下，把现场变得有意思。',tags:['即兴活跃','现场体验'],color:'#c4dcde',review:'你能从当下的气氛里找到灵感，也愿意用一个点子或一次行动让现场活起来。风弹适合你的轻快：顺势而起，把眼前的瞬间变成值得记住的共同体验。',tip:'留意大家的节奏，让热闹也有舒服的落点。'},
];

export const items=itemDefinitions.map(item=>({...item,prototypeCode:prototypeConfig[item.id],profile:decodePrototype(prototypeConfig[item.id])}));
export function evaluate(answers,options){
 const {means,vector}=scoreScale(answers);
 return {version:5,questionnaire:questionnaireVersion,dimensionOrder:traits.map(t=>t.key),means,vector,scores:vector.map(x=>(x+1)*50),...matchVector(vector,items,options)};
}
export function rankItems(vector,options){return matchVector(vector,items,options).ranking;}
export function hitTraits(scores,item){
 return traits.map((trait,i)=>({trait,index:i,score:scores[i],direction:item.profile[i]>0?'高分侧':'低分侧',description:item.profile[i]>0?trait.description:trait.low,contribution:(scores[i]/50-1)*item.profile[i]/5}))
 .filter(t=>t.contribution>1e-8).sort((a,b)=>b.contribution-a.contribution||a.index-b.index).slice(0,3);
}
const connections={
 respawn_anchor:'把再次出发的准备放在远行之前，像你愿意先想清楚、再投入的那一面',
 enchanting_table:'让一个普通的东西多出新的可能，很像你愿意停下来琢磨、慢慢发现新东西的样子',
 command_block:'把想法变成能执行的安排，像你愿意把事情接过来推进的那一面',
 slime_block:'能把已有的东西重新组合，很适合联想多、愿意试试另一种做法的你',
 sculk_sensor:'安静地接收周围的动静，呼应了你愿意留意、认真感受的一面',
 ender_chest:'让重要的东西有一个自己的位置，像你希望保留的个人空间',
 beacon:'让周围的人也获得支持，呼应你愿意参与、愿意照顾别人的那一面',
 elytra:'把视野带到熟悉的地方之外，像你对新体验和不同可能性的兴趣',
 shulker_box:'把需要的东西整理好再带走，呼应你对准备、秩序和交代的重视',
 totem_of_undying:'在关键时刻提供支持，像你愿意认真对待承诺、顾及身边人的那一面',
 netherite_pickaxe:'靠稳定的行动一点点推进，呼应你愿意把事情落实、持续做下去的习惯',
 conduit:'让共同的环境舒服一点，像你愿意照顾群体需要、为相处多做一点的样子',
 diamond_sword:'直接、专注，靠实际操作解决问题，像你更愿意独立处理眼前事情的那一面',
 invisibility_potion:'给人留出不被打扰的观察空间，呼应你对安静、自主和个人体验的偏爱',
 ender_pearl:'把一次决定变成真实的跨越，像你愿意参与、愿意先行动起来的那一面',
 wind_charge:'让现场突然多出一点变化，像你在互动中接住兴致、带来活力的样子',
};
export function itemConnection(scores,item){
 const report=describePersonality(scores),hits=hitTraits(scores,item).slice(0,2);
 if(!hits.length)return `你的回答靠近两端之间，几件道具都能找到相似之处。${item.name}先作为其中一件展示，你可以对照其他候选，看看哪种联想更像自己。`;
 return `你${hits.map(h=>report.dimensions[h.index].brief).join('，')}。${item.name}${connections[item.id]}。`;
}
export function itemPortrait(item){
 const poles=[['注重实际','好奇探索'],['随性灵活','有序推进'],['安静独立','主动交流'],['独立判断','体谅合作'],['情绪平稳','情绪敏锐']];
 return item.profile.map((v,i)=>poles[i][v>0?1:0]).join(' · ');
}
