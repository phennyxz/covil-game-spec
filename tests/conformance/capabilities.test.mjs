import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const root=new URL("../../",import.meta.url);
const registry=JSON.parse(await readFile(new URL("schemas/capabilities.registry.json",root),"utf8"));
const example=JSON.parse(await readFile(new URL("examples/hello-vlg/manifest.json",root),"utf8"));
const idPattern=/^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)+$/;
test("registry has unique well-formed capability IDs and valid categories",()=>{
 assert.equal(registry.registryVersion,"0.1");
 const ids=registry.capabilities.map(x=>x.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const c of registry.capabilities){
  assert.match(c.id,idPattern);
  assert.equal(c.id.split(".")[0],c.category);
  assert.ok(["core","extension"].includes(c.tier));
  assert.ok(["host","mediated","permission","sensitive"].includes(c.access));
  assert.ok(typeof c.description==="string"&&c.description.length>10);
 }
});
test("required base capabilities are registered",()=>{
 const ids=new Set(registry.capabilities.map(x=>x.id));
 for(const id of ["input.buttons","output.graphics"])assert.ok(ids.has(id));
});
test("example declares only known capabilities",()=>{
 const ids=new Set(registry.capabilities.map(x=>x.id));
 for(const id of [...example.capabilities.required,...example.capabilities.optional])assert.ok(ids.has(id));
});
