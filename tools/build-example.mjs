import {readFile, mkdir, writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {writeZip} from "./zip.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const names=["manifest.json","index.html","game.js","style.css"];
const entries=[];const files=[];
for(const name of names){
 const data=await readFile(resolve(root,"examples/hello-vlg",name));
 entries.push([name,data]);files.push({path:name,size:data.length,sha256:createHash("sha256").update(data).digest("hex")});
}
const integrity=Buffer.from(JSON.stringify({schemaVersion:"0.1",algorithm:"sha256",files},null,2)+"\n");
entries.push(["integrity.json",integrity]);
await mkdir(resolve(root,"dist"),{recursive:true});
const path=resolve(root,"dist/hello-vlg.vlg");
await writeFile(path,writeZip(entries));
console.log("Built",path);
