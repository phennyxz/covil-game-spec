import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readZip,writeZip} from './zip.mjs';
import {validateBytes as validateLegacyGame} from './legacy-validate-vlg.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const sort=(a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b));
const fail=m=>{throw Error(m)};
export function validateSDPVLG(bytes){
 const files=readZip(Buffer.from(bytes));
 if(!files.has('sdp.json')||!files.has('manifest.json')||!files.has('integrity.json'))fail('Missing SDP/VLG metadata');
 if(files.has('signature.json'))fail('Signed packages not supported by experimental validator');
 const s=JSON.parse(files.get('sdp.json')),m=JSON.parse(files.get('manifest.json')),i=JSON.parse(files.get('integrity.json'));
 if(s.sdpVersion!=='0.1'||s.kind!=='game'||!s.id||s.id!==m.id||s.name!==m.name||s.version!==m.version||!s.purpose||!s.creator?.id||!s.creator?.name)fail('Invalid SDP game declaration');
 if(m.schemaVersion!=='0.1'||m.runtime!=='web'||!files.has(m.entry)||!m.entry.endsWith('.html')||!m.display||!m.input||!Array.isArray(m.input.actions)||!m.capabilities||!Array.isArray(m.capabilities.required)||!Array.isArray(m.capabilities.optional))fail('Invalid VLG game manifest');
 const p=s.profiles?.find(p=>p.id==='org.covil.runtime'&&p.version==='0.1');
 const expected={entry:m.entry,requiredCapabilities:m.capabilities.required,optionalCapabilities:m.capabilities.optional,actions:m.input.actions};
 if(!p||JSON.stringify(p.config)!==JSON.stringify(expected))fail('SDP/COVIL profile mismatch');
 if(i.sdpVersion!=='0.1'||i.algorithm!=='sha256'||!Array.isArray(i.files))fail('Invalid SDP inventory');
 const paths=[...files.keys()].filter(x=>x!=='integrity.json'&&x!=='signature.json').sort(sort);
 if(i.files.length!==paths.length)fail('Inventory count mismatch');
 i.files.forEach((f,n)=>{if(f.path!==paths[n]||!Number.isSafeInteger(f.size)||f.size<0||!/^[0-9a-f]{64}$/.test(f.sha256))fail('Invalid inventory entry');
 const b=files.get(f.path);if(b.length!==f.size||sha(b)!==f.sha256)fail('Integrity mismatch: '+f.path);});
 // Reuse strict legacy game-contract checks, but never its inventory/signature as SDP evidence.
 const gameEntries=[...files].filter(([name])=>!['sdp.json','integrity.json','signature.json'].includes(name));
 const legacyInventory=gameEntries.sort(([a],[b])=>sort(a,b)).map(([path,data])=>({path,size:data.length,sha256:sha(data)}));
 const legacyZip=writeZip([...gameEntries,['integrity.json',Buffer.from(JSON.stringify({schemaVersion:'0.1',algorithm:'sha256',files:legacyInventory}))]]);
 validateLegacyGame(legacyZip);
 return {id:s.id,version:s.version,files:paths.length,structure:'valid-experimental',signature:'absent'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 try{if(!process.argv[2])fail('Usage: node tools/validate-sdp-vlg.mjs FILE.vlg');console.log(JSON.stringify(validateSDPVLG(await readFile(process.argv[2])),null,2));}
 catch(e){console.error('INVALID SDP VLG:',e.message);process.exitCode=1;}
}
