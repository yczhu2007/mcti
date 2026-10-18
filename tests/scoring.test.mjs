import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {traits,questions,items,questionScore,evaluate,rankItems,resultReview} from '../dist/data.js';

test('32 questions cover every trait and format, scenario choices always have four options',()=>{
 assert.equal(questions.length,32);assert.equal(traits.length,8);assert.equal(new Set(questions.map(q=>q.id)).size,32);
 for(let d=0;d<8;d++){const qs=questions.filter(q=>q.dimension===d);assert.equal(qs.length,4);assert.equal(new Set(qs.map(q=>q.type)).size,4);}
 for(const type of ['binary','single','multi','scale'])assert.equal(questions.filter(q=>q.type===type).length,8);
 for(const q of questions)assert.equal(q.options.length,{binary:2,single:4,multi:5,scale:5}[q.type]);
});
function possible(q){const options=q.options.map((_,i)=>[i]);if(q.type==='multi')return options.flatMap(([i])=>options.filter(([j])=>j>i).map(([j])=>[i,j]));return options;}
test('every format has normalized 0–100 range; invalid or partial answers are rejected',()=>{
 for(const q of questions){const values=possible(q).map(a=>questionScore(q,a));assert.ok(Math.abs(Math.min(...values))<1e-8,q.id);assert.ok(Math.abs(Math.max(...values)-100)<1e-8,q.id);
  for(const invalid of [null,[],[-1],[99],[0,0],[0,1,2]])assert.throws(()=>questionScore(q,invalid),q.id);
 }
 assert.throws(()=>evaluate([]));assert.throws(()=>evaluate(Array(32).fill(null)));
});
test('reverse questions measure the same trait in the opposite wording direction',()=>{
 const reversed=questions.filter(q=>q.type==='scale'&&q.reverse);assert.equal(reversed.length,3);
 reversed.forEach(q=>{assert.equal(questionScore(q,[0]),100);assert.equal(questionScore(q,[4]),0);});
});
test('all traits can reach both boundaries independently with equal question weights',()=>{
 for(const target of [0,100]){
  const answers=questions.map(q=>possible(q).find(a=>Math.abs(questionScore(q,a)-target)<1e-8));
  const result=evaluate(answers);result.scores.forEach(v=>assert.ok(Math.abs(v-target)<1e-8));
  result.ranking.forEach(r=>assert.ok(r.match>=0&&r.match<=100));
 }
});
test('16 distinct profiles rank themselves first; every item is reachable through actual answer combinations',()=>{
 assert.equal(items.length,16);assert.equal(new Set(items.map(i=>JSON.stringify(i.profile))).size,16);
 for(const item of items){assert.equal(rankItems(item.profile)[0].item.id,item.id);assert.equal(rankItems(item.profile)[0].match,100);
  const answers=questions.map(q=>possible(q).sort((a,b)=>Math.abs(questionScore(q,a)-item.profile[q.dimension])-Math.abs(questionScore(q,b)-item.profile[q.dimension]))[0]);
  assert.equal(evaluate(answers).ranking[0].item.id,item.id,`${item.name} must be reachable`);
 }
});
test('scoring is deterministic, tied ordering stable, all item images have PNG headers',async()=>{
 assert.deepEqual(rankItems(Array(8).fill(50)),rankItems(Array(8).fill(50)));
 for(const item of items){const buf=await readFile(new URL(`../dist/assets/${item.id}.png`,import.meta.url));assert.equal(buf.subarray(1,4).toString(),'PNG');}
});
test('result commentary reflects actual answers including balanced and low profiles',()=>{
 const item=items.find(i=>i.id==='invisibility_potion');
 assert.match(resultReview([19,48,65,48,69,29,42,67],item),/细节觉察和临场应变/);
 assert.match(resultReview(Array(8).fill(0),item),/按需要逐步准备/);
 assert.match(resultReview(Array(8).fill(50),item),/多种做法/);
});
