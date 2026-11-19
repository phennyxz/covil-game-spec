#!/usr/bin/env node
// COVIL 0.1 experimental unsigned developer-mode builder (Node 20+, no npm).
import {readdir, readFile, lstat, mkdir, writeFile, realpath} from "node:fs/promises";
import {createHash} from "node:crypto";
import {resolve, relative, join, dirname, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {writeZip} from "./zip.mjs";
import {validateBytes} from "./validate-vlg.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_FILES = 1000, MAX_FILE = 16 * 1024 * 1024, MAX_TOTAL = 64 * 1024 * 1024;
const reserved = new Set(["integrity.json", "signature.json", "covil-core.mjs"]);

async function build(sourceDir, outputFile) {
  const source = resolve(sourceDir);
  const output = resolve(outputFile);
  const sourceStat = await lstat(source);
  if (!sourceStat.isDirectory() || sourceStat.isSymbolicLink()) throw Error("Source must be a real directory");
  const sourceReal = await realpath(source);
  const outRelative = relative(sourceReal, output);
  if (!outRelative.startsWith(".." + sep) && outRelative !== ".." && !outRelative.startsWith(sep)) {
    throw Error("Output must be outside source directory");
  }
  const names = [];
  async function walk(directory, prefix = "") {
    const items = await readdir(directory, {withFileTypes: true});
    items.sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    for (const item of items) {
      const rel = prefix ? prefix + "/" + item.name : item.name;
      if (item.isSymbolicLink()) throw Error("Symlinks forbidden: " + rel);
      if (item.isDirectory()) { await walk(join(directory, item.name), rel); continue; }
      if (!item.isFile()) throw Error("Unsupported filesystem entry: " + rel);
      if (rel.includes("\\") || rel.split("/").some(s => !s || s === "." || s === "..") || rel.includes("\0")) throw Error("Unsafe filename: " + rel);
      if (reserved.has(rel)) throw Error("Reserved file must not be supplied by game: " + rel);
      names.push(rel);
      if (names.length > MAX_FILES - 2) throw Error("Too many files");
    }
  }
  await walk(source);
  if (!names.includes("manifest.json")) throw Error("Missing manifest.json");
  const manifest = JSON.parse(await readFile(join(source,"manifest.json"),"utf8"));
  if (manifest.schemaVersion !== "0.1" || manifest.runtime !== "web" || typeof manifest.entry !== "string" || !names.includes(manifest.entry)) {
    throw Error("Invalid or incomplete COVIL 0.1 manifest/entry");
  }
  const sdk = await readFile(join(root,"sdk/covil-core.mjs"));
  const entries = [];
  let total = 0;
  for (const name of names) {
    const data = await readFile(join(source,...name.split("/")));
    if (data.length > MAX_FILE) throw Error("File too large: " + name);
    total += data.length;
    entries.push([name,data]);
  }
  if (sdk.length > MAX_FILE) throw Error("SDK too large");
  total += sdk.length;
  if (total > MAX_TOTAL) throw Error("Package exceeds resource limits");
  entries.push(["covil-core.mjs",sdk]);
  entries.sort(([a],[b])=>a<b?-1:a>b?1:0);
  const files = entries.map(([path,data])=>({
    path,size:data.length,sha256:createHash("sha256").update(data).digest("hex")
  }));
  const integrity = Buffer.from(JSON.stringify({schemaVersion:"0.1",algorithm:"sha256",files},null,2)+"\n");
  entries.push(["integrity.json",integrity]);
  const archive = writeZip(entries);
  // Validator remains the source of truth for the supported prototype subset.
  validateBytes(archive);
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,archive);
  return {output,files:files.length,bytes:archive.length};
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [source,output] = process.argv.slice(2);
  if (!source || !output) {
    console.error("Usage: node tools/covil-build.mjs SOURCE_DIRECTORY OUTPUT.vlg");
    process.exitCode = 2;
  } else {
    try {console.log(JSON.stringify(await build(source,output),null,2));}
    catch(error) {console.error("COVIL BUILD FAILED:",error.message);process.exitCode=1;}
  }
}
export {build};
