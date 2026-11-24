import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp, mkdir, writeFile, readFile, rm, symlink} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {build} from "../../tools/covil-build.mjs";
import {validateBytes} from "../../tools/validate-vlg.mjs";
import {readZip} from "../../tools/zip.mjs";

const manifest = {
  schemaVersion:"0.1",id:"org.example.builder",name:"Builder Fixture",version:"1.0.0",
  entry:"index.html",runtime:"web",
  display:{mode:"adaptive",orientation:"any",aspectRatio:"1:1"},
  input:{actions:["left","right","start"]},
  capabilities:{required:["input.buttons","output.graphics"],optional:[]}
};
async function fixture(t) {
  const dir=await mkdtemp(join(tmpdir(),"covil-build-"));
  t.after(()=>rm(dir,{recursive:true,force:true}));
  const src=join(dir,"src");
  await mkdir(join(src,"assets"),{recursive:true});
  await writeFile(join(src,"manifest.json"),JSON.stringify(manifest));
  await writeFile(join(src,"index.html"),'<!doctype html><script type="module" src="game.js"></script>');
  await writeFile(join(src,"game.js"),'import {createCovilRuntime} from "./covil-core.mjs";');
  await writeFile(join(src,"assets","food.svg"),'<svg xmlns="http://www.w3.org/2000/svg"/>');
  return {dir,src,out:join(dir,"snake.vlg")};
}
test("generic builder includes nested assets, official SDK and valid hashes",async t=>{
  const {src,out}=await fixture(t);
  const result=await build(src,out);
  assert.equal(result.files,6);
  const bytes=await readFile(out);
  assert.equal(validateBytes(bytes).id,manifest.id);
  const entries=readZip(bytes);
  assert.ok(entries.has("assets/food.svg"));
  assert.ok(entries.has("covil-core.mjs"));
  assert.ok(entries.has("integrity.json"));
  assert.ok(entries.has("sdp.json"));
  assert.equal(JSON.parse(entries.get("integrity.json")).sdpVersion,"0.1");
});
test("generic builder is deterministic for identical inputs",async t=>{
  const {src,out,dir}=await fixture(t);
  await build(src,out);
  const first=await readFile(out);
  const second=join(dir,"second.vlg");
  await build(src,second);
  assert.deepEqual(await readFile(second),first);
});
test("reject reserved SDK and metadata supplied by game",async t=>{
  const {src,out}=await fixture(t);
  await writeFile(join(src,"covil-core.mjs"),"fake");
  await assert.rejects(build(src,out),/Reserved file/);
});
test("reject output inside source",async t=>{
  const {src}=await fixture(t);
  await assert.rejects(build(src,join(src,"game.vlg")),/outside source/);
});
test("reject symlinks",async t=>{
  const {src,out}=await fixture(t);
  await symlink(join(src,"game.js"),join(src,"alias.js"));
  await assert.rejects(build(src,out),/Symlinks forbidden/);
});
test("reject invalid manifest without writing output",async t=>{
  const {src,out}=await fixture(t);
  await writeFile(join(src,"manifest.json"),JSON.stringify({...manifest,capabilities:{required:["invalid"],optional:[]}}));
  await assert.rejects(build(src,out));
});
