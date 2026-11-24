#!/usr/bin/env node
// Canonical VLG validator: SDP inventory plus COVIL game contract.
import {validateSDPVLG} from './validate-sdp-vlg.mjs';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
export const validateBytes=validateSDPVLG;
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 try{if(!process.argv[2])throw Error('Usage: node tools/validate-vlg.mjs FILE.vlg');
 console.log(JSON.stringify(validateBytes(await readFile(process.argv[2])),null,2));}
 catch(e){console.error('INVALID VLG:',e.message);process.exitCode=1;}
}
