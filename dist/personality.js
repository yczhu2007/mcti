// Editorial item associations with mathematical prototypes; not validated personality types.
// Bit order is O-C-E-A-N. Every code has even parity.
export const prototypeConfig = {
 respawn_anchor:'11000',enchanting_table:'10001',command_block:'11101',slime_block:'10100',
 sculk_sensor:'11011',ender_chest:'00011',beacon:'11110',elytra:'10111',
 shulker_box:'01001',totem_of_undying:'01010',netherite_pickaxe:'01100',conduit:'01111',
 diamond_sword:'00000',invisibility_potion:'10010',ender_pearl:'00101',wind_charge:'00110',
};
export const matchingConfig=Object.freeze({temperature:0.10,gapThreshold:0.06,tieTolerance:1e-12,lowSignalThreshold:0.15});
export const decodePrototype=code=>Array.from(code,bit=>bit==='1'?1:-1);
export function softmax(scores,temperature=matchingConfig.temperature){
 if(!Number.isFinite(temperature)||temperature<=0||!scores.length||scores.some(s=>!Number.isFinite(s)))throw new Error('无效的权重参数');
 const max=Math.max(...scores),exps=scores.map(s=>Math.exp((s-max)/temperature)),sum=exps.reduce((a,b)=>a+b,0);
 return exps.map(v=>v/sum);
}
export function prototypeScore(vector,prototype){return vector.reduce((sum,x,j)=>sum+x*prototype[j],0)/5;}
// Cosine compares direction; absoluteMatch and signalStrength retain magnitude.
export function cosineSimilarity(a,b){
 const normA=Math.hypot(...a),normB=Math.hypot(...b);
 if(normA<=1e-12||normB<=1e-12)return 0;
 return Math.max(-1,Math.min(1,a.reduce((sum,x,j)=>sum+x*b[j],0)/normA/normB));
}
export function matchVector(vector,items,options={}){
 if(!Array.isArray(vector)||vector.length!==5||vector.some(x=>!Number.isFinite(x)||Math.abs(x)>1))throw new Error('人格向量必须为五个[-1,1]连续数值');
 const config={...matchingConfig,...options};
 if(!Number.isFinite(config.gapThreshold)||config.gapThreshold<0||!Number.isFinite(config.tieTolerance)||config.tieTolerance<0||!Number.isFinite(config.lowSignalThreshold)||config.lowSignalThreshold<0||config.lowSignalThreshold>1)throw new Error('无效的区分度参数');
 const signalStrength=Math.hypot(...vector)/Math.sqrt(5),lowSignal=signalStrength<config.lowSignalThreshold;
 const ranking=items.map((item,order)=>{
  const dimensionMatches=vector.map((x,j)=>100-Math.abs((x+1)*50-(item.profile[j]+1)*50));
  const cosine=cosineSimilarity(vector,item.profile);
  return {item,order,prototypeCode:item.prototypeCode,rawScore:prototypeScore(vector,item.profile),contributions:vector.map((x,j)=>x*item.profile[j]/5),dimensionMatches,absoluteMatch:dimensionMatches.reduce((s,v)=>s+v,0)/5,cosine,match:(1+cosine)*50};
 });
 const weights=softmax(ranking.map(r=>r.rawScore),config.temperature);
 ranking.forEach((r,i)=>{r.weight=weights[i];});
 // Raw scores determine order; original item order is the deterministic exact-tie fallback.
 ranking.sort((a,b)=>Math.abs(b.rawScore-a.rawScore)<=config.tieTolerance?a.order-b.order:b.rawScore-a.rawScore);
 ranking.forEach((r,i)=>{r.rank=i===0||Math.abs(r.rawScore-ranking[i-1].rawScore)>config.tieTolerance?i+1:ranking[i-1].rank;});
 const gap=Math.max(0,ranking[0].rawScore-ranking[1].rawScore);
 const tiedFirst=ranking.filter(r=>Math.abs(r.rawScore-ranking[0].rawScore)<=config.tieTolerance).map(r=>r.item.id);
 return {matchingMethod:'centered-cosine-v1',signalStrength,ranking,top3:ranking.slice(0,3),tiedFirst,config,discrimination:{gap,threshold:config.gapThreshold,lowSignal,status:tiedFirst.length>1?'tied':lowSignal||gap+config.tieTolerance<config.gapThreshold?'low':'separated'}};
}
