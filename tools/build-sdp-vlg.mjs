import {build} from './legacy-covil-build.mjs';
import {readZip,writeZip} from './zip.mjs';
import {readFile,writeFile,mkdtemp,rm,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join,dirname,resolve,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateSDPVLG} from './validate-sdp-vlg.mjs';
const digest=b=>createHash('sha256').update(b).digest('hex');
const compare=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
export async function buildSDPVLG(source,output,{creatorId,creatorName}={}){
 const sourcePath=resolve(source), targetPath=resolve(output);
 const rel=relative(sourcePath,targetPath);
 if(rel===''||(!rel.startsWith('..'+sep)&&rel!=='..'&&!rel.startsWith(sep)))throw Error('Output must be outside source directory');
 const tmp=await mkdtemp(join(tmpdir(),'sdp-vlg-'));
 try{
  const legacy=join(tmp,'legacy.vlg');await build(source,legacy);
  const files=readZip(await readFile(legacy));files.delete('integrity.json');
  const m=JSON.parse(files.get('manifest.json').toString('utf8'));
  creatorId=creatorId??m.id; creatorName=creatorName??m.name;
  if(typeof creatorId!=='string'||!creatorId.trim()||typeof creatorName!=='string'||!creatorName.trim())throw Error('Creator ID and name required');
  const sdp={sdpVersion:'0.1',id:m.id,name:m.name,version:m.version,kind:'game',purpose:'Jogo Web para ambiente COVIL',creator:{id:creatorId.trim(),name:creatorName.trim()},profiles:[{id:'org.covil.runtime',version:'0.1',config:{entry:m.entry,requiredCapabilities:m.capabilities.required,optionalCapabilities:m.capabilities.optional,actions:m.input.actions}}]};
  files.set('sdp.json',Buffer.from(JSON.stringify(sdp,null,2)+'\n'));
  const inv=[...files].sort(([a],[b])=>compare(a,b)).map(([path,bytes])=>({path,size:bytes.length,sha256:digest(bytes)}));
  files.set('integrity.json',Buffer.from(JSON.stringify({sdpVersion:'0.1',algorithm:'sha256',files:inv},null,2)+'\n'));
  const zip=writeZip([...files].sort(([a],[b])=>compare(a,b)));
  validateSDPVLG(zip);await mkdir(dirname(resolve(output)),{recursive:true});await writeFile(output,zip);
  return {output:resolve(output),id:m.id,files:inv.length,bytes:zip.length,signature:'absent'};
 }finally{await rm(tmp,{recursive:true,force:true});}
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const [source,output,...args]=process.argv.slice(2);const arg=x=>{const i=args.indexOf(x);return i<0?undefined:args[i+1];};
 if(!source||!output){console.error('Usage: node tools/build-sdp-vlg.mjs SOURCE OUTPUT.vlg --creator-id ID --creator-name NAME');process.exitCode=2;}
 else try{console.log(JSON.stringify(await buildSDPVLG(source,output,{creatorId:arg('--creator-id'),creatorName:arg('--creator-name')}),null,2));}
 catch(e){console.error('SDP VLG BUILD FAILED:',e.message);process.exitCode=1;}
}
