import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {writeZip} from "../../tools/zip.mjs";
import {validateBytes} from "../../tools/validate-vlg.mjs";
const manifest={schemaVersion:"0.1",id:"org.example.test",name:"Test",version:"1.0.0",entry:"index.html",runtime:"web",display:{mode:"emulator",orientation:"portrait",aspectRatio:"4:3"},input:{actions:["pause"]},capabilities:{storage:"none",network:"none"}};
function archive({badHash=false,extra=false,path="index.html"}={}){
 const payload=Buffer.from("<!doctype html><title>Test</title>");
 const m=Buffer.from(JSON.stringify(manifest));
 const files=[["manifest.json",m],[path,payload]];
 const inventory={schemaVersion:"0.1",algorithm:"sha256",files:files.map(([p,b])=>({path:p,size:b.length,sha256:badHash?"0".repeat(64):createHash("sha256").update(b).digest("hex")}))};
 files.push(["integrity.json",Buffer.from(JSON.stringify(inventory))]);
 if(extra)files.push(["extra.js",Buffer.from("bad")]);
 return writeZip(files);
}
test("valid minimal package",()=>assert.equal(validateBytes(archive()).id,"org.example.test"));
test("reject hash mismatch",()=>assert.throws(()=>validateBytes(archive({badHash:true})),/Integrity mismatch/));
test("reject unlisted file",()=>assert.throws(()=>validateBytes(archive({extra:true})),/Unlisted payload/));
test("reject traversal",()=>assert.throws(()=>validateBytes(archive({path:"../index.html"})),/Unsafe filename/));
test("reject duplicate path",()=>assert.throws(()=>validateBytes(writeZip([["x",Buffer.from("a")],["x",Buffer.from("b")]])),/Duplicate/));
