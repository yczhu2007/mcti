import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {items} from '../dist/data.js';

test('all 16 inventory sprites match their recorded source and native dimensions',async()=>{
 const sources=JSON.parse(await readFile(new URL('../dist/assets/inventory-sources.json',import.meta.url),'utf8'));
 assert.deepEqual(sources.map(s=>s.id).sort(),items.map(i=>i.id).sort());
 for(const source of sources){
  const data=await readFile(new URL(`../dist/assets/${source.id}.png`,import.meta.url));
  assert.equal(createHash('sha256').update(data).digest('hex'),source.sha256,source.id);
  assert.match(source.file,/^Invicon_.*\.(png|gif)$/);
  const width=data.readUInt32BE(16),height=data.readUInt32BE(20);
  assert.ok([16,32].includes(width),source.id);assert.equal(height,width);
 }
});
