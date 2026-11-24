import {build} from './covil-build.mjs';
import {resolve} from 'node:path';
const out=resolve('dist/hello-vlg.vlg');
console.log('Built',JSON.stringify(await build('examples/hello-vlg',out)));
