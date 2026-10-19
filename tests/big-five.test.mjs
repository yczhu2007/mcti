import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,traits,items,evaluate,questionScore,rankItems} from '../dist/data.js';
import {softmax,matchVector,prototypeConfig,cosineSimilarity} from '../dist/personality.js';
import {describePersonality} from '../dist/interpretation.js';

test('30 sourced IPIP adaptations balance five dimensions and mixed formats',()=>{
 assert.equal(questions.length,30);assert.deepEqual(traits.map(t=>t.key),['O','C','E','A','N']);
 assert.equal(new Set(questions.map(q=>q.id)).size,30);assert.equal(new Set(questions.map(q=>q.text)).size,30);
 for(let d=0;d<5;d++){
  const qs=questions.filter(q=>q.dimension===d);assert.equal(qs.length,6);
  assert.equal(qs.filter(q=>q.type==='single').length,2);assert.equal(qs.filter(q=>q.type==='binary').length,1);assert.equal(qs.filter(q=>q.type==='scale').length,3);
  assert.ok(new Set(qs.map(q=>q.facet)).size>=5);for(const q of qs){assert.ok(q.original);assert.match(q.source,/^https:\/\/ipip.ori.org\//);assert.equal(q.reverse,q.keyed==='minus');}
 }
 for(const q of questions){assert.equal(q.options.length,{single:4,binary:2,scale:5}[q.type]);assert.equal(Math.min(...q.options.map((_,i)=>questionScore(q,[i]))),1);assert.equal(Math.max(...q.options.map((_,i)=>questionScore(q,[i]))),5);}
 assert.ok(questions.some(q=>q.reverse));
 for(let i=0;i<questions.length-2;i++)assert.ok(new Set(questions.slice(i,i+3).map(q=>q.type)).size>1);
});
const answerAt=(q,target)=>[q.options.findIndex((_,i)=>Math.abs(questionScore(q,[i])-target)<1e-12)];
test('mixed formats and reverse scoring have equal question weights and complete validation',()=>{
 for(const target of [1,5]){
  const r=evaluate(questions.map(q=>answerAt(q,target)));
  r.means.forEach(v=>assert.ok(Math.abs(v-target)<1e-12));r.vector.forEach(v=>assert.ok(Math.abs(v-(target-3)/2)<1e-12));
 }
 const counts=Array(5).fill(0),neutral=questions.map(q=>answerAt(q,counts[q.dimension]++<3?1:5));
 evaluate(neutral).vector.forEach(v=>assert.ok(Math.abs(v)<1e-12));
 for(const q of questions){
  for(const a of [null,[],[0,1],[-1],[q.options.length],[1.5]])assert.throws(()=>questionScore(q,a));
  if(q.reverse)q.options.forEach((o,i)=>assert.equal(questionScore(q,[i]),6-o.value));
 }
 for(const a of [[],Array(20).fill([0]),Array(30).fill(null)])assert.throws(()=>evaluate(a));
});
test('16 unique even-parity prototypes balance every dimension with minimum distance two',()=>{
 assert.equal(items.length,16);assert.deepEqual(Object.keys(prototypeConfig).sort(),items.map(i=>i.id).sort());
 const codes=Object.values(prototypeConfig);assert.equal(new Set(codes).size,16);
 for(const code of codes){assert.match(code,/^[01]{5}$/);assert.equal([...code].filter(b=>b==='1').length%2,0);}
 for(let d=0;d<5;d++)assert.equal(codes.filter(c=>c[d]==='1').length,8);
 for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)assert.ok([...codes[i]].filter((b,d)=>b!==codes[j][d]).length>=2);
 for(const item of items)assert.equal(rankItems(item.profile)[0].item.id,item.id);
 for(const item of items){
  const answers=questions.map(q=>{const target=item.profile[q.dimension]>0?5:1;return answerAt(q,target);});
  assert.equal(evaluate(answers).ranking[0].item.id,item.id);
 }
});
test('high, low, mixed, neutral, tied and close vectors keep honest discrimination',()=>{
 const low=matchVector(Array(5).fill(-.8),items);assert.equal(low.ranking[0].prototypeCode,'00000');assert.ok(low.discrimination.gap>0);
 const high=matchVector(Array(5).fill(.8),items);assert.equal(high.tiedFirst.length,5);assert.equal(high.discrimination.status,'tied');
 const neutral=matchVector(Array(5).fill(0),items);assert.equal(neutral.tiedFirst.length,16);neutral.ranking.forEach(r=>assert.equal(r.weight,1/16));
 const mixed=matchVector([.7,.4,-.3,.6,-.1],items);assert.equal(mixed.ranking[0].prototypeCode,'11011');
 const tie=matchVector([0,0,-1,-1,-1],items);assert.equal(tie.tiedFirst.length,2);
 const close=matchVector([.001,.001,-1,-1,-1],items);assert.equal(close.discrimination.status,'low');assert.ok(close.discrimination.gap>0);
 assert.deepEqual(matchVector(Array(5).fill(0),items),neutral);
 const boundary=matchVector([.0625,.0625,-1,-1,-1],items,{gapThreshold:.05});assert.equal(boundary.discrimination.status,'separated');
});
test('stable softmax, raw-score ranking, contributions and temperature invariance',()=>{
 const x=[.7,.4,-.3,.6,-.1];const a=matchVector(x,items),b=matchVector(x,items,{temperature:.5});
 assert.deepEqual(a.ranking.map(r=>r.item.id),b.ranking.map(r=>r.item.id));assert.deepEqual(a.discrimination,b.discrimination);
 for(const r of a.ranking){assert.ok(r.weight>=0);assert.ok(Math.abs(r.rawScore-r.contributions.reduce((s,c)=>s+c,0))<1e-12);}
 assert.ok(Math.abs(a.ranking.reduce((s,r)=>s+r.weight,0)-1)<1e-12);
 assert.deepEqual(softmax([10000,10000]),[.5,.5]);assert.throws(()=>softmax([1],0));
 for(const v of [[],[0,0,0,0,NaN],[2,0,0,0,0]])assert.throws(()=>matchVector(v,items));
});

test('absolute closeness stays available alongside direction-based matching',()=>{
 for(const vector of [Array(5).fill(0),[.7,.4,-.3,.6,-.1],items[0].profile]){
  const r=matchVector(vector,items);
  r.ranking.forEach((v,i)=>{
   const fit=vector.map((x,j)=>100-Math.abs((x+1)*50-(v.item.profile[j]+1)*50));
   assert.deepEqual(v.dimensionMatches,fit);assert.ok(Math.abs(v.absoluteMatch-fit.reduce((s,x)=>s+x)/5)<1e-10);
   assert.ok(v.match>=0&&v.match<=100);if(i)assert.ok(r.ranking[i-1].match+1e-10>=v.match);
  });
 }
 matchVector(Array(5).fill(0),items).ranking.forEach(r=>assert.equal(r.match,50));
 assert.equal(matchVector(items[0].profile,items).ranking[0].match,100);
});
test('personality narrative describes behavior and follows all five actual traits',()=>{
 const a=describePersonality([85,75,20,80,25]),b=describePersonality([20,25,85,30,80]);
 assert.notEqual(a.summary,b.summary);assert.equal(a.dimensions.length,5);
 assert.match(a.summary,/独处|安静|熟悉/);assert.match(b.summary,/表达|交流|人群|互动/);
 for(const report of [a,b,describePersonality(Array(5).fill(50))]){
  assert.doesNotMatch(report.summary,/贡献|原型|得分|向量|排名|维度偏/);
  report.dimensions.forEach(d=>{assert.ok(d.title&&d.description&&d.tip);});
 }
 const neutral=describePersonality(Array(5).fill(50));assert.ok(neutral.dimensions.every(d=>d.side==='middle'));
});

test('different complete answer sets produce different five-axis shapes without stretching scores',()=>{
 const profiles=[[85,75,20,30,20],[20,30,85,80,75]];
 const results=profiles.map(target=>evaluate(questions.map(q=>[q.options.map((_,i)=>({i,distance:Math.abs(questionScore(q,[i])-(1+target[q.dimension]/25))})).sort((a,b)=>a.distance-b.distance)[0].i])));
 for(const r of results)assert.ok(Math.max(...r.scores)-Math.min(...r.scores)>40);
 assert.notEqual(results[0].ranking[0].item.id,results[1].ranking[0].item.id);
 assert.notEqual(describePersonality(results[0].scores).summary,describePersonality(results[1].scores).summary);
});

test('cosine matches use all five centered traits and preserve magnitude and ambiguity',()=>{
 assert.ok(Math.abs(cosineSimilarity([1,0,0,0,0],[1,1,1,1,1])-1/Math.sqrt(5))<1e-12);
 assert.equal(cosineSimilarity([0,0,0,0,0],[1,1,1,1,1]),0);
 const p=items[0].profile;
 const strong=matchVector(p.map(x=>x*.8),items),weak=matchVector(p.map(x=>x*.01),items);
 assert.ok(Math.abs(strong.ranking[0].match-100)<1e-10);assert.ok(Math.abs(weak.ranking[0].match-100)<1e-10);
 assert.ok(Math.abs(strong.ranking[0].absoluteMatch-90)<1e-10);
 assert.ok(Math.abs(weak.ranking[0].absoluteMatch-50.5)<1e-10);
 assert.equal(weak.discrimination.lowSignal,true);assert.equal(weak.discrimination.status,'low');
 assert.ok(weak.signalStrength<strong.signalStrength);
 for(const r of [strong,weak,matchVector(Array(5).fill(0),items)])r.ranking.forEach(v=>assert.ok(Number.isFinite(v.match)&&v.match>=0&&v.match<=100));
 // A generic near-midpoint synthetic profile remains a close raw-score result.
 const near=matchVector([.1,.2,-.4,-.05,.3],items);
 assert.equal(near.discrimination.status,'low');
 near.ranking.forEach((r,i)=>{if(i)assert.ok(near.ranking[i-1].absoluteMatch+1e-10>=r.absoluteMatch);});
 const numericalZero=matchVector(Array(5).fill(1e-15),items);
 numericalZero.ranking.forEach(r=>assert.equal(r.match,50));
 assert.deepEqual(numericalZero.ranking.map(r=>r.item.id),items.map(i=>i.id));
});
test('narrative copy states habits directly',async()=>{
 const {readFile}=await import('node:fs/promises');
 for(const file of ['interpretation.js','data.js','app.js']){
  const content=await readFile(new URL('../dist/'+file,import.meta.url),'utf8');
  assert.doesNotMatch(content,/不是[^。\n]{0,50}而是|并不[^。\n]{0,35}只是|不需要一直待在人群里|不一定需要站到最显眼的位置/);
 }
});
