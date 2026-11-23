import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildSDPVLG} from '../../tools/build-sdp-vlg.mjs';
import {validateSDPVLG} from '../../tools/validate-sdp-vlg.mjs';
import {readZip,writeZip} from '../../tools/zip.mjs';
test('build SDP-backed VLG with complete inventory and COVIL profile',async()=>{
 const tmp=await mkdtemp(join(tmpdir(),'covil-test-'));
 try{const out=join(tmp,'game.vlg');const built=await buildSDPVLG('examples/hello-vlg',out,{creatorId:'example.author',creatorName:'Example Author'});
 const bytes=await readFile(out);const verified=validateSDPVLG(bytes);assert.equal(verified.id,built.id);
 const files=readZip(bytes);const s=JSON.parse(files.get('sdp.json'));assert.equal(s.kind,'game');assert.equal(s.profiles[0].id,'org.covil.runtime');
 files.set('unlisted.txt',Buffer.from('bad'));assert.throws(()=>validateSDPVLG(writeZip([...files])),/Inventory count mismatch/);
 }finally{await rm(tmp,{recursive:true,force:true});}
});
test('creator is required',async()=>await assert.rejects(buildSDPVLG('examples/hello-vlg','unused.vlg'),/Creator/));
