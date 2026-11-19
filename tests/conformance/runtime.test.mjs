import test from "node:test";
import assert from "node:assert/strict";
import {MessageChannel} from "node:worker_threads";
import {createCovilRuntime} from "../../sdk/covil-core.mjs";
import {checkCapabilities} from "../../host/capability-preflight.mjs";
const sessionId = "test-session-123456789";
const base = {capabilities:{required:["input.buttons","output.graphics"],optional:["output.haptics","future.unknown"]}};
const known = ["input.buttons","output.graphics","output.haptics"];
test("preflight blocks missing required and tolerates missing optional",()=>{
 const ok=checkCapabilities(base,["input.buttons","output.graphics"],known);
 assert.equal(ok.compatible,true);
 assert.deepEqual(ok.missingOptional,["output.haptics","future.unknown"]);
 assert.deepEqual(ok.granted,["input.buttons","output.graphics"]);
 const no=checkCapabilities(base,["output.graphics"],known);
 assert.equal(no.compatible,false);
 assert.deepEqual(no.missingRequired,["input.buttons"]);
});
test("SDK init, ready, input, pause, resume and stop",async()=>{
 const {port1,port2}=new MessageChannel();
 const received=[];const actions=[];
 let api;
 const runtime=createCovilRuntime({port:port2,sessionId,init:async covil=>{
   api=covil;
   assert.equal(covil.has("input.buttons"),true);
   assert.equal(covil.has("output.haptics"),false);
   covil.controls.on("left",pressed=>actions.push(pressed));
 }});
 port1.on("message",message=>received.push(message));
 const send=(type,payload={})=>port1.postMessage({covil:"0.1",sessionId,id:"host-"+Math.random(),type,payload});
 const wait=async predicate=>{
   for(let i=0;i<100;i++){
     if(predicate())return;
     await new Promise(resolve=>setTimeout(resolve,2));
   }
   throw new Error("Timed out waiting for SDK");
 };
 try{
   send("host.init",{protocol:"0.1",capabilities:["input.buttons","output.graphics"],actions:["left"],viewport:{width:320,height:240,dpr:1,orientation:"landscape"}});
   await wait(()=>received.some(m=>m.type==="game.ready"));
   assert.equal(runtime.getState(),"ready");
   assert.throws(()=>api.controls.on("unknown",()=>{}),/Unknown action/);
   send("host.input",{action:"left",pressed:true});await new Promise(r=>setTimeout(r,5));
   assert.deepEqual(actions,[]);
   send("host.start");await wait(()=>runtime.getState()==="running");
   send("host.input",{action:"left",pressed:true});await wait(()=>actions.length===1);
   send("host.pause");await wait(()=>runtime.getState()==="paused");
   send("host.input",{action:"left",pressed:false});await new Promise(r=>setTimeout(r,5));
   assert.deepEqual(actions,[true]);
   send("host.resume");await wait(()=>runtime.getState()==="running");
   send("host.input",{action:"left",pressed:false});await wait(()=>actions.length===2);
   send("host.stop");await wait(()=>received.some(m=>m.type==="game.stopped"));
   assert.equal(runtime.getState(),"stopped");
   assert.deepEqual(actions,[true,false]);
 } finally {port1.close();port2.close();}
});
