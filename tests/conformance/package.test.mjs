import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {writeZip} from "../../tools/zip.mjs";
import {validateBytes} from "../../tools/legacy-validate-vlg.mjs";
const manifest={schemaVersion:"0.1",id:"org.example.test",name:"Test",version:"1.0.0",entry:"index.html",runtime:"web",display:{mode:"emulator",orientation:"portrait",aspectRatio:"4:3"},input:{actions:["pause"]},capabilities:{required:["input.buttons","output.graphics"],optional:[]}};
function archive({badHash=false,extra=false,path="index.html",capabilities=manifest.capabilities}={}){
 const payload=Buffer.from("<!doctype html><title>Test</title>");
 const m=Buffer.from(JSON.stringify({...manifest,capabilities}));
 const files=[["manifest.json",m],[path,payload]];
 const inventory={schemaVersion:"0.1",algorithm:"sha256",files:files.map(([p,b])=>({path:p,size:b.length,sha256:badHash?"0".repeat(64):createHash("sha256").update(b).digest("hex")}))};
 files.push(["integrity.json",Buffer.from(JSON.stringify(inventory))]);
 if(extra)files.push(["extra.js",Buffer.from("bad")]);
 return writeZip(files);
}
test("legacy regression: valid minimal package",()=>assert.equal(validateBytes(archive()).id,"org.example.test"));
test("reject hash mismatch",()=>assert.throws(()=>validateBytes(archive({badHash:true})),/Integrity mismatch/));
test("reject unlisted file",()=>assert.throws(()=>validateBytes(archive({extra:true})),/Unlisted payload/));
test("reject traversal",()=>assert.throws(()=>validateBytes(archive({path:"../index.html"})),/Unsafe filename/));
test("reject duplicate path",()=>assert.throws(()=>validateBytes(writeZip([["x",Buffer.from("a")],["x",Buffer.from("b")]])),/Duplicate/));

test("accept optional unknown capability identifier",()=>assert.equal(validateBytes(archive({capabilities:{required:[],optional:["future.feature"]}})).id,"org.example.test"));
test("reject legacy capability representation",()=>assert.throws(()=>validateBytes(archive({capabilities:{storage:"none",network:"none"}})),/Invalid capabilities/));
test("reject missing capability lists",()=>assert.throws(()=>validateBytes(archive({capabilities:{required:[]}})),/Invalid capabilities/));
test("reject duplicate required capability",()=>assert.throws(()=>validateBytes(archive({capabilities:{required:["input.buttons","input.buttons"],optional:[]}})),/Invalid capabilities/));
test("reject capability in both lists",()=>assert.throws(()=>validateBytes(archive({capabilities:{required:["input.buttons"],optional:["input.buttons"]}})),/Invalid capabilities/));
test("reject malformed capability name",()=>assert.throws(()=>validateBytes(archive({capabilities:{required:["input buttons"],optional:[]}})),/Invalid capabilities/));
test("reject unexpected capability property",()=>assert.throws(()=>validateBytes(archive({capabilities:{required:[],optional:[],storage:"none"}})),/Invalid capabilities/));
