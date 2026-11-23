import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {readZip} from "./zip.mjs";
export function validateBytes(bytes){
 const entries=readZip(Buffer.from(bytes));
 if(!entries.has("manifest.json")||!entries.has("integrity.json"))throw Error("Missing metadata");
 if(entries.has("signature.json"))throw Error("Signatures are not supported by this prototype");
 const manifest=JSON.parse(entries.get("manifest.json").toString("utf8"));
 const required=["schemaVersion","id","name","version","entry","runtime","display","input","capabilities"];
 const allowed=[...required,"metadata"];
 if(required.some(k=>!(k in manifest))||Object.keys(manifest).some(k=>!allowed.includes(k)))throw Error("Manifest fields invalid");
 if(manifest.schemaVersion!=="0.1"||manifest.runtime!=="web"||! /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(manifest.id)||!manifest.name||!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version))throw Error("Invalid manifest identity");
 if(typeof manifest.entry!=="string"||! /^(?!\/)(?!.*(?:^|\/)\.\.?\/)[A-Za-z0-9_./-]+\.html$/.test(manifest.entry)||!entries.has(manifest.entry))throw Error("Invalid entrypoint");
 if(!["emulator","mobile","adaptive"].includes(manifest.display?.mode)||!["portrait","landscape","any"].includes(manifest.display?.orientation)||! /^[1-9]\d*:[1-9]\d*$/.test(manifest.display?.aspectRatio))throw Error("Invalid display");
 if(!Array.isArray(manifest.input?.actions)||new Set(manifest.input.actions).size!==manifest.input.actions.length||manifest.input.actions.some(x=>typeof x!=="string"||! /^[a-z][a-z0-9_-]*$/.test(x)))throw Error("Invalid input");
 const caps=manifest.capabilities;
 const capabilityId=/^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)+$/;
 if(!caps||typeof caps!=="object"||Array.isArray(caps)||
    Object.keys(caps).length!==2||!Object.hasOwn(caps,"required")||!Object.hasOwn(caps,"optional")||
    !Array.isArray(caps.required)||!Array.isArray(caps.optional))throw Error("Invalid capabilities");
 const allCaps=[...caps.required,...caps.optional];
 if(allCaps.some(x=>typeof x!=="string"||x.length>128||!capabilityId.test(x))||
    new Set(allCaps).size!==allCaps.length)throw Error("Invalid capabilities");

 if(Object.hasOwn(manifest,"metadata")) {
  const m=manifest.metadata;
  const keys=["title","description","languages","genres","tags","ageRating","content"];
  const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
  const exact=(o,ks)=>isObj(o)&&Object.keys(o).length===ks.length&&ks.every(k=>Object.hasOwn(o,k));
  const str=(x,max)=>typeof x==="string"&&x.length>0&&x.length<=max;
  const arr=(x,re,max)=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(v=>typeof v==="string"&&v.length<=max&&re.test(v));
  const age=["system","value","status"], content=["violence","userInteraction","advertising","inAppPurchases"];
  if(!exact(m,keys)||!str(m.title,160)||!str(m.description,2000)||!arr(m.languages,/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/,40)||m.languages.length===0||!arr(m.genres,/^[a-z][a-z0-9_-]*$/,40)||!arr(m.tags,/^[a-z][a-z0-9_-]*$/,40)||!exact(m.ageRating,age)||!str(m.ageRating.system,40)||!str(m.ageRating.value,40)||!["self_declared","official","unknown"].includes(m.ageRating.status)||!exact(m.content,content)||content.some(k=>m.content[k]!==null&&typeof m.content[k]!=="boolean"))throw Error("Invalid editorial metadata");
 }
 const inventory=JSON.parse(entries.get("integrity.json").toString("utf8"));
 if(inventory.schemaVersion!=="0.1"||inventory.algorithm!=="sha256"||!Array.isArray(inventory.files))throw Error("Invalid integrity manifest");
 const listed=new Set();
 for(const f of inventory.files){
  if(!f||typeof f.path!=="string"||listed.has(f.path)||!entries.has(f.path)||!Number.isSafeInteger(f.size)||f.size<0||! /^[0-9a-f]{64}$/.test(f.sha256))throw Error("Invalid inventory entry");
  listed.add(f.path);const bytes=entries.get(f.path);
  if(bytes.length!==f.size||createHash("sha256").update(bytes).digest("hex")!==f.sha256)throw Error("Integrity mismatch: "+f.path);
 }
 for(const name of entries.keys())if(name!=="integrity.json"&&!listed.has(name))throw Error("Unlisted payload: "+name);
 return {id:manifest.id,version:manifest.version,files:listed.size,signature:"not-verified"};
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href){
 try{const path=process.argv[2];if(!path)throw Error("Usage: node tools/validate-vlg.mjs FILE.vlg");
 console.log(JSON.stringify(validateBytes(await readFile(path)),null,2));}
 catch(e){console.error("INVALID VLG:",e.message);process.exitCode=1;}
}
