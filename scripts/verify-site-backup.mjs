import * as cheerio from 'cheerio';
import {readFile, writeFile, stat} from 'node:fs/promises';
import path from 'node:path';

const out=path.resolve(process.argv[2]);
const root=path.join(out,'sito');
const entries=JSON.parse(await readFile(path.join(out,'inventario/risorse.json'),'utf8'));
const missing=new Map(),remote=new Map();
let checks=0;
async function check(raw,filename,kind) {
  if(!raw || /^(#|data:|mailto:|tel:|javascript:|blob:)/i.test(raw))return;
  let url;try{url=new URL(raw,'https://backup.local/'+filename);}catch{return;}
  if(url.hostname!=='backup.local'){
    if(!remote.has(url.href))remote.set(url.href,{url:url.href,kind,sources:new Set()});
    remote.get(url.href).sources.add(filename);return;
  }
  checks++;
  let dest=path.join(root,decodeURIComponent(url.pathname));
  let s=await stat(dest).catch(()=>null);
  if(s?.isDirectory()) {dest=path.join(dest,'index.html');s=await stat(dest).catch(()=>null);}
  if(!s?.isFile()) {
    const key=kind+':'+url.pathname;
    if(!missing.has(key))missing.set(key,{url:url.pathname,kind,sources:new Set()});
    missing.get(key).sources.add(filename);
  }
}
async function css(text,filename) {for(const m of text.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)|@import\s+['"]([^'"]+)['"]/gi))await check(m[2]||m[3],filename,'CSS');}
for(const e of entries.filter(e=>e.status==='ok')) {
  if(e.contentType.includes('text/html')) {
    const $=cheerio.load(await readFile(path.join(root,e.path),'utf8'));
    for(const el of $('*').toArray()) {
      const n=$(el);
      for(const attr of ['src','poster','data-src','data-guid','data-lazy-src'])await check(n.attr(attr),e.path,el.tagName+':'+attr);
      if(['a','link','area'].includes(el.tagName))await check(n.attr('href'),e.path,el.tagName+':href');
      if(n.attr('srcset')) for(const item of n.attr('srcset').split(','))await check(item.trim().split(/\s+/)[0],e.path,'srcset');
      if(n.attr('style'))await css(n.attr('style'),e.path);
    }
    for(const el of $('style').toArray())await css($(el).html(),e.path);
  } else if(e.contentType.includes('text/css'))await css(await readFile(path.join(root,e.path),'utf8'),e.path);
}
const serial=map=>[...map.values()].map(v=>({...v,sources:[...v.sources]}));
const report={checkedAt:new Date().toISOString(),localReferencesChecked:checks,missingLocal:serial(missing),externalReferences:serial(remote)};
await writeFile(path.join(out,'inventario/verifica-collegamenti.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({checked:checks,missing:report.missingLocal,externalCount:remote.size},null,2));
if(missing.size)process.exitCode=1;
