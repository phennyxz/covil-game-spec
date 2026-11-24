#!/usr/bin/env node
// Canonical VLG builder: SDP Core ZIP + COVIL game profile.
import {buildSDPVLG} from './build-sdp-vlg.mjs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
export async function build(source,output,options={}){return buildSDPVLG(source,output,options);}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const [source,output,...args]=process.argv.slice(2);const get=x=>{const i=args.indexOf(x);return i<0?undefined:args[i+1]};
 if(!source||!output){console.error('Usage: node tools/covil-build.mjs SOURCE OUTPUT.vlg [--creator-id ID --creator-name NAME]');process.exitCode=2;}
 else try{console.log(JSON.stringify(await build(source,output,{creatorId:get('--creator-id'),creatorName:get('--creator-name')}),null,2));}
 catch(e){console.error('COVIL BUILD FAILED:',e.message);process.exitCode=1;}
}
