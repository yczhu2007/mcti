import {readFile,writeFile} from 'node:fs/promises';
import {items,questions,questionScore,evaluate} from '../dist/data.js';
import {matchVector} from '../dist/personality.js';
import {describePersonality} from '../dist/interpretation.js';
const legacy=JSON.parse(await readFile(new URL('../docs/legacy-profiles.json',import.meta.url),'utf8'));
const oldRank=scores=>legacy.map(item=>({id:item.id,score:100-Math.sqrt(item.profile.reduce((s,v,i)=>s+(v-scores[i])**2,0)/8)})).sort((a,b)=>b.score-a.score);
const cases=[
 {name:'居中',oldScores:Array(8).fill(50),vector:Array(5).fill(0)},
 {name:'全部偏高',oldScores:Array(8).fill(90),vector:Array(5).fill(.8)},
 {name:'全部偏低',oldScores:Array(8).fill(10),vector:Array(5).fill(-.8)},
 {name:'混合示例',oldScores:[85,70,35,80,45,70,35,80],vector:[.7,.4,-.3,.6,-.1]},
];
const result=cases.map(({name,oldScores,vector})=>{
 const old=oldRank(oldScores),next=matchVector(vector,items);
 return {name,oldScores,vector,oldTop3:old.slice(0,3),oldGap:old[0].score-old[1].score,newTop3:next.top3.map(r=>({id:r.item.id,rawScore:r.rawScore,match:r.match,absoluteMatch:r.absoluteMatch,weight:r.weight,rank:r.rank})),discrimination:next.discrimination,tiedFirst:next.tiedFirst};
});
// These independent synthetic answer draws are not paired people or validation data.
let seed=20261019;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const oldGaps=[],newGaps=[];let low=0,ties=0;
for(let i=0;i<1000;i++){
 const scores=Array.from({length:8},()=>Array.from({length:4},()=>Math.floor(random()*5)*25).reduce((a,b)=>a+b)/4);
 const old=oldRank(scores);oldGaps.push(old[0].score-old[1].score);
 const next=evaluate(questions.map(q=>[Math.floor(random()*q.options.length)]));
 newGaps.push(next.discrimination.gap);low+=next.discrimination.status!=='separated';ties+=next.tiedFirst.length>1;
}
const median=a=>{a.sort((x,y)=>x-y);return (a[499]+a[500])/2;};
const summary={seed:20261019,samples:1000,note:'Independent synthetic score/answer draws. Old eight traits and new five traits are different constructs; gaps have different units. No accuracy claim.',oldMedianGapPercentagePoints:median(oldGaps),newMedianRawGap:median(newGaps),newLowOrTied:low,newTied:ties};
await writeFile(new URL('../docs/simulation-results.json',import.meta.url),JSON.stringify({cases:result,summary},null,2)+'\n');
const counts=Array(5).fill(0);
const balanced=questions.map(q=>{const target=counts[q.dimension]++<3?1:5;return [q.options.findIndex((_,i)=>Math.abs(questionScore(q,[i])-target)<1e-12)];});
await writeFile(new URL('../docs/result-example.json',import.meta.url),JSON.stringify(evaluate(balanced),null,2)+'\n');
const examples=[[90,70,15,40,5],[20,30,85,80,75]].map(target=>{
 const answers=questions.map(q=>[q.options.map((_,i)=>({i,d:Math.abs(questionScore(q,[i])-(1+target[q.dimension]/25))})).sort((a,b)=>a.d-b.d)[0].i]);
 const evaluated=evaluate(answers);
 return {synthetic:true,target,answers,scores:evaluated.scores,summary:describePersonality(evaluated.scores).summary,top3:evaluated.top3.map(r=>({id:r.item.id,name:r.item.name,match:r.match,absoluteMatch:r.absoluteMatch,rank:r.rank}))};
});
await writeFile(new URL('../docs/personality-examples.json',import.meta.url),JSON.stringify({note:'Synthetic answer sets for regression checks, not a real user or validation sample.',examples},null,2)+'\n');
await writeFile(new URL('../docs/selected-question-sources.json',import.meta.url),JSON.stringify(questions.map(({id,original,source,facet,keyed,type,text})=>({id,original,source,facet,keyed,type,text})),null,2)+'\n');
console.table(result.map(r=>({case:r.name,oldTop3:r.oldTop3.map(x=>x.score.toFixed(2)).join(' / '),newWeights:r.newTop3.map(x=>(x.weight*100).toFixed(2)).join(' / '),rawGap:r.discrimination.gap.toFixed(3),status:r.discrimination.status,tiedFirst:r.tiedFirst.length})));
console.log(summary);
