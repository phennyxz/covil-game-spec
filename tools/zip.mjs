// Minimal ZIP reader/writer for the experimental VLG tooling; no external dependencies.
import { inflateRawSync } from "node:zlib";
const u16=(b,o)=>b.readUInt16LE(o), u32=(b,o)=>b.readUInt32LE(o);
export function crc32(bytes) {
 let c=0xffffffff; for(const x of bytes){c^=x;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}
 return (c^0xffffffff)>>>0;
}
export function writeZip(entries) {
 const locals=[],central=[];let offset=0;
 for(const [name,data] of entries){
  const n=Buffer.from(name),b=Buffer.from(data),crc=crc32(b);
  const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);
  h.writeUInt32LE(crc,14);h.writeUInt32LE(b.length,18);h.writeUInt32LE(b.length,22);h.writeUInt16LE(n.length,26);
  locals.push(h,n,b);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);
  c.writeUInt16LE(0x800,8);c.writeUInt32LE(crc,16);c.writeUInt32LE(b.length,20);c.writeUInt32LE(b.length,24);
  c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);
  offset+=h.length+n.length+b.length;
 }
 const centralSize=central.reduce((s,b)=>s+b.length,0),end=Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);
 end.writeUInt32LE(centralSize,12);end.writeUInt32LE(offset,16);
 return Buffer.concat([...locals,...central,end]);
}
export function readZip(buf,{maxEntries=1000,maxFile=16*1024*1024,maxTotal=64*1024*1024}={}) {
 if(buf.length>64*1024*1024)throw Error("Archive too large");
 let eocd=-1;for(let i=buf.length-22;i>=Math.max(0,buf.length-65557);i--){if(u32(buf,i)===0x06054b50&&i+22+u16(buf,i+20)===buf.length){eocd=i;break;}}
 if(eocd<0)throw Error("Invalid ZIP end record");
 if(u16(buf,eocd+4)||u16(buf,eocd+6)||u16(buf,eocd+8)!==u16(buf,eocd+10))throw Error("Multi-disk ZIP unsupported");
 const count=u16(buf,eocd+10),size=u32(buf,eocd+12),start=u32(buf,eocd+16);
 if(count>maxEntries||start+size!==eocd)throw Error("Invalid central directory");
 let p=start,total=0;const out=new Map();
 for(let i=0;i<count;i++){
  if(p+46>eocd||u32(buf,p)!==0x02014b50)throw Error("Invalid central entry");
  const flags=u16(buf,p+8),method=u16(buf,p+10),crc=u32(buf,p+16),compressed=u32(buf,p+20),uncompressed=u32(buf,p+24);
  const nlen=u16(buf,p+28),extra=u16(buf,p+30),comment=u16(buf,p+32),local=u32(buf,p+42);
  if(p+46+nlen+extra+comment>eocd)throw Error("Truncated central entry");
  const name=buf.subarray(p+46,p+46+nlen).toString("utf8");p+=46+nlen+extra+comment;
  if(!name||name.includes("\\")||name.includes("\0")||name.startsWith("/")||name.endsWith("/")||name.split("/").some(s=>!s||s==="."||s==="..")||!Buffer.from(name).equals(buf.subarray(p-(nlen+extra+comment),p-(extra+comment))))throw Error("Unsafe filename");
  if(out.has(name)||flags&1||!(flags&0x800)||![0,8].includes(method))throw Error("Duplicate, encrypted, non-UTF8 or unsupported entry");
  if(uncompressed>maxFile||(total+=uncompressed)>maxTotal||compressed===0&&uncompressed!==0||compressed>0&&uncompressed/compressed>200)throw Error("ZIP resource limit");
  if(local+30>start||u32(buf,local)!==0x04034b50)throw Error("Invalid local header");
  const ln=u16(buf,local+26),le=u16(buf,local+28),begin=local+30+ln+le;
  if(begin+compressed>start||u16(buf,local+8)!==method||!buf.subarray(local+30,local+30+ln).equals(Buffer.from(name)))throw Error("Local header mismatch");
  const raw=buf.subarray(begin,begin+compressed),data=method===0?raw:inflateRawSync(raw,{maxOutputLength:maxFile});
  if(data.length!==uncompressed||crc32(data)!==crc)throw Error("CRC or length mismatch");
  out.set(name,data);
 }
 if(p!==eocd)throw Error("Central directory trailing data");
 return out;
}
