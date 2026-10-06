// Read-only public WordPress archive. No credentials, POSTs, or site mutations.
// Usage: node scripts/backup-live-site.mjs [output directory] [--render-only]
import * as cheerio from 'cheerio';
import {mkdir, readFile, writeFile, rm} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const ORIGIN = 'https://studiodentisticofederzonigranata.it';
const HOST = new URL(ORIGIN).hostname;
const OUT = path.resolve(process.argv[2] || 'output/backup-federzoni-granata-2026-09-15');
const SITE = path.join(OUT, 'sito');
const STATE = path.join(OUT, 'inventario', 'risorse.json');
const entries = new Map();
const queue = new Set();
const external = new Map();
const pages = [];
const media = [];
const apiSummary = {};
const renderOnly = process.argv.includes('--render-only');
const sha = data => createHash('sha256').update(data).digest('hex');
const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
const assetRE = /\.(?:avif|gif|ico|jpe?g|png|svg|webp|pdf|mp4|m4v|mov|webm|mp3|ogg|wav|woff2?|ttf|eot|otf|css|js|json|xml|xsl|txt)(?:$|\?)/i;
const cssRE = /url\(\s*(['"]?)(.*?)\1\s*\)|@import\s+['"]([^'"]+)['"]/gi;
const trackerRE = /googletagmanager|google-analytics|facebook\.com\/tr|connect\.facebook|hs-scripts|hs-analytics|hubspot|doubleclick|recaptcha/i;
const externalAssetHosts = new Set(['fonts.googleapis.com','fonts.gstatic.com','s.w.org','secure.gravatar.com','i.ytimg.com','i1.ytimg.com','i2.ytimg.com','i3.ytimg.com','i4.ytimg.com','img.youtube.com','yt3.ggpht.com','cdn.jsdelivr.net','cdnjs.cloudflare.com']);

async function save(file, data) { await mkdir(path.dirname(file), {recursive:true}); await writeFile(file,data); }
async function json(file, data) { await save(file, JSON.stringify(data,null,2)+'\n'); }
function normalize(input, base=ORIGIN) {
  if (!input || /^(data:|blob:|mailto:|tel:|javascript:|#)/i.test(input.trim())) return null;
  try {
    const u = new URL(input.replaceAll('\\/','/').replaceAll('&amp;','&').replaceAll('&#038;','&').trim(), base);
    if (!['http:','https:'].includes(u.protocol)) return null;
    u.hash='';
    if (u.hostname === HOST || u.hostname === 'www.'+HOST) {
      u.hostname=HOST; u.protocol='https:';
      for (const key of [...u.searchParams.keys()]) if (/^(utm_|fbclid|gclid|ver$)/.test(key)) u.searchParams.delete(key);
    }
    return u.href;
  } catch { return null; }
}
function own(u) { return new URL(u).hostname === HOST; }
function enqueue(input, base=ORIGIN, reason='asset') {
  const url=normalize(input,base); if(!url) return;
  const u=new URL(url);
  if (!own(url)) {
    if (!external.has(url)) external.set(url,new Set()); external.get(url).add(base);
    if (trackerRE.test(url) || !externalAssetHosts.has(u.hostname)) return;
    if (reason==='page' && !assetRE.test(url)) return;
  } else if (/\/(wp-admin|wp-login\.php|xmlrpc\.php)|\/wp-json\/|[?&](replytocom|s|preview|share|add-to-cart)=/.test(url)) return;
  if (!entries.has(url)) { entries.set(url,{url,reason,status:'pending',sources:[base]}); queue.add(url); }
  else if(!entries.get(url).sources.includes(base)) entries.get(url).sources.push(base);
}
async function request(url) {
  let error;
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; OwnerAuthorizedBackup/1.0)','Accept':'*/*'},signal:AbortSignal.timeout(45000),redirect:'follow'});
      const data=Buffer.from(await response.arrayBuffer());
      if(response.status>=500 || response.status===429) throw new Error('HTTP '+response.status);
      return {response,data};
    } catch(e) { error=e; if(attempt<2) await new Promise(r=>setTimeout(r,750*(attempt+1))); }
  }
  throw error;
}
function localPath(url,type='') {
  const u=new URL(url);
  let p=decodeURIComponent(u.pathname).split('/').map(s=>s.replace(/[<>:"\\|?*\x00-\x1f]/g,'_')).filter(s=>s!=='.'&&s!=='..').join('/').replace(/^\/+/, '');
  if(!own(url)) p='_esterni/'+u.hostname+'/'+p;
  if(type.includes('text/html')) p = p.endsWith('.html') ? p : p.replace(/\/$/,'')+'/index.html';
  else if(!p || p.endsWith('/')) p += 'index';
  if(p.startsWith('/')) p=p.slice(1);
  if(!own(url) && type.includes('text/css') && !p.endsWith('.css')) p+='.css';
  if(u.search) {const ext=path.posix.extname(p);p=p.slice(0,p.length-ext.length)+'--'+sha(u.search).slice(0,12)+ext;}
  return p;
}
function discoverCSS(text,base) { for(const m of text.matchAll(cssRE)) enqueue(m[2]||m[3],base); }
function absoluteURLs(text,base) {
  const decoded=text.replaceAll('\\/','/').replaceAll('&quot;','"');
  for(const m of decoded.matchAll(/https?:\/\/[^\s"'<>\\)\]}]+/g)) if(assetRE.test(m[0])) enqueue(m[0],base);
  for(const m of decoded.matchAll(/["'](\/wp-(?:content|includes)\/[^"'<>\s]+)["']/g)) if(assetRE.test(m[1])) enqueue(m[1],base);
}
function discoverHTML(html,base) {
  const $=cheerio.load(html);
  $('a[href],area[href]').each((i,el)=>enqueue($(el).attr('href'),base,'page'));
  $('*').each((i,el)=> {
    for(const [key,val] of Object.entries(el.attribs||{})) {
      if(['src','poster','data-src','data-guid','data-lazy-src','data-original','data-background','data-bg','data-thumb','data-thumbnail'].includes(key)) enqueue(val,base);
      else if(/srcset$/.test(key)) for(const item of val.split(',')) enqueue(item.trim().split(/\s+/)[0],base);
      else if(key==='style') discoverCSS(val,base);
      else if(key.startsWith('data-') && /https?:|\/wp-content\//.test(val)) absoluteURLs(val,base);
    }
  });
  $('link[href]').each((i,el)=> { if(/stylesheet|icon|preload|manifest/.test($(el).attr('rel')||'')) enqueue($(el).attr('href'),base); });
  $('meta[property="og:image"],meta[name="twitter:image"]').each((i,el)=>enqueue($(el).attr('content'),base));
  $('style').each((i,el)=>discoverCSS($(el).html()||'',base));
  absoluteURLs(html,base);
  $('iframe').each((i,el)=> { const u=normalize($(el).attr('src')||$(el).attr('data-src'),base);if(u){if(!external.has(u))external.set(u,new Set());external.get(u).add(base);} });
}
async function download(url) {
  const e=entries.get(url);
  try {
    const {response,data}=await request(url);
    e.httpStatus=response.status; e.finalUrl=response.url; e.contentType=response.headers.get('content-type')||'';
    e.bytes=data.length; e.sha256Original=sha(data); e.fetchedAt=new Date().toISOString();
    if(!response.ok){e.status='error';e.error='HTTP '+response.status;return;}
    e.path=localPath(url,e.contentType); e.status='ok';
    const textual=/text\/html|text\/css|javascript|application\/json|xml/.test(e.contentType);
    e.originalPath=(textual?'originali/':'sito/')+e.path;
    await save(path.join(OUT,e.originalPath),data);
    if(textual) await save(path.join(SITE,e.path),data);
    const text=textual?data.toString('utf8'):'';
    if(e.contentType.includes('text/html')) discoverHTML(text,response.url);
    else if(e.contentType.includes('text/css')) discoverCSS(text,response.url);
    else if(/javascript/.test(e.contentType)) absoluteURLs(text,response.url);
    else if(/xml/.test(e.contentType)) {
      const $=cheerio.load(text,{xmlMode:true}); $('loc,image\\:loc').each((i,el)=>enqueue($(el).text(),url,'sitemap'));
    }
  } catch(error) {e.status='error';e.error=error.message;}
}
async function apiCollection(name,route=name) {
  let count=1;const all=[];
  for(let p=1;p<=count;p++) {
    const url=`${ORIGIN}/wp-json/wp/v2/${route}?per_page=100&page=${p}`;
    const {response,data}=await request(url);
    await save(path.join(OUT,'wordpress-pubblico',`${name}-${p}.json`),data);
    if(!response.ok){apiSummary[name]={status:response.status};break;}
    const raw=data.toString('utf8');
    // Some public API responses have a WordPress plugin warning before the JSON.
    const start=raw.indexOf('[{');
    const items=JSON.parse(start>0?raw.slice(start):raw);if(!Array.isArray(items)) break;
    await json(path.join(OUT,'wordpress-pubblico',`${name}-${p}-dati.json`),items);
    count=Number(response.headers.get('x-wp-totalpages')||1);all.push(...items);
  }
  apiSummary[name]={...apiSummary[name],count:all.length};
  return all;
}
async function gather() {
  const old=await readFile(STATE,'utf8').then(JSON.parse).catch(()=>[]);
  for(const e of old) {entries.set(e.url,e);if(e.status==='pending')queue.add(e.url);}
  enqueue(ORIGIN+'/');enqueue(ORIGIN+'/robots.txt');enqueue(ORIGIN+'/sitemap_index.xml');
  const browserSeeds=await readFile(path.join(OUT,'inventario','browser-risorse.json'),'utf8').then(JSON.parse).catch(()=>[]);
  for(const url of browserSeeds)enqueue(url,ORIGIN,'browser-resource');
  for(const name of (process.argv.includes('--resume')?[]:['pages','posts','categories','tags','media'])) {
    console.log('Catalogo pubblico: '+name);
    const items=await apiCollection(name);
    if(name==='media') {
      media.push(...items);
      for(const m of items) {
        enqueue(m.source_url,ORIGIN+'/wp-json/wp/v2/media','media-original');
        if(m.guid?.rendered && assetRE.test(m.guid.rendered))enqueue(m.guid.rendered,ORIGIN,'media-original');
        for(const size of Object.values(m.media_details?.sizes||{})) enqueue(size.source_url,ORIGIN,'media-variant');
        if(m.media_details?.original_image && m.source_url) enqueue(new URL(m.media_details.original_image,m.source_url).href,ORIGIN,'media-original');
        absoluteURLs(m.description?.rendered||'',ORIGIN);
      }
    } else for(const item of items) { if(item.link)enqueue(item.link,ORIGIN,'public-'+name);absoluteURLs(item.content?.rendered||'',ORIGIN); }
  }
  if(!process.argv.includes('--resume')) {
    await json(path.join(OUT,'inventario','media-wordpress.json'),media);
    await json(path.join(OUT,'inventario','api-riepilogo.json'),apiSummary);
  }
  let done=0;
  while(queue.size) {
    const batch=[...queue].slice(0,5);batch.forEach(x=>queue.delete(x));
    await Promise.all(batch.map(download)); done+=batch.length;
    await json(STATE,[...entries.values()]);
    if(done%25===0||!queue.size)console.log(`Risorse elaborate: ${done}; restanti: ${queue.size}; errori: ${[...entries.values()].filter(e=>e.status==='error').length}`);
    if(entries.size>12000)throw new Error('Limite di 12000 URL raggiunto: controllare la coda.');
  }
}
function lookup(raw,base) {return entries.get(normalize(raw,base));}
function rewriteURL(raw,base,current) {
  if(!raw || raw.startsWith('#'))return raw;
  const e=lookup(raw,base);
  if(e?.status==='unexpected-content' && /\.(png|gif|jpe?g|svg|webp)(?:$|\?)/i.test(e.url))return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  if(!e||e.status!=='ok')return raw;
  let rel=path.posix.relative(path.posix.dirname(current),e.path)||path.posix.basename(e.path);
  rel=rel.split('/').map(encodeURIComponent).join('/');
  try {rel+=new URL(raw.replaceAll('\\/','/'),base).hash;}catch{}
  return rel;
}
function rewriteCSS(text,base,current) {return text.replace(cssRE,(all,q,url,imp)=> imp ? '@import "'+rewriteURL(imp,base,current)+'"' : 'url("'+rewriteURL(url,base,current)+'")');}
function rewriteAbsolute(text,base,current) {
  let rewritten=text.replace(/https?:\\\/\\\/[^\s"'<>]+|https?:\/\/[^\s"'<>\\)\]}]+/g,(raw)=> {
    const escaped=raw.includes('\\/');const plain=raw.replaceAll('\\/','/');const e=lookup(plain,base);
    if(!e||e.status!=='ok')return raw;
    // Inline scripts resolve against document; external scripts also use root paths.
    let result='/'+e.path;try{result+=new URL(plain).hash;}catch{}
    return escaped?result.replaceAll('/','\\/'):result;
  });
  for(const dir of ['/wp-content/','/wp-includes/']) for(const protocol of ['http:','https:']) {
    const from=protocol+'//'+HOST+dir;
    rewritten=rewritten.replaceAll(from,dir).replaceAll(from.replaceAll('/','\\/'),dir.replaceAll('/','\\/'));
  }
  return rewritten;
}
const restoreScript = `// Static emergency copy: local UI, external services remain online.
window.FG_STATIC_BACKUP=true;
document.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();alert('Per contattare lo studio usa telefono, email o WhatsApp. Il modulo online richiede il ripristino del server WordPress.');},true);
document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('form').forEach(function(f){f.removeAttribute('action');f.removeAttribute('method');});
 document.querySelectorAll('.ht_ctc_chat').forEach(function(el){el.style.display='block';el.addEventListener('click',function(){window.open('https://wa.me/393516737049','_blank','noopener');});});
});
`;
async function render() {
  await save(path.join(SITE,'_backup/emergenza.js'),restoreScript);
  for(const e of entries.values()) {
    if(e.status==='ok' && e.contentType.includes('text/html') && /\.(png|gif|jpe?g|svg|webp)(?:$|\?)/i.test(e.url)) {
      e.status='unexpected-content';e.error='Il server restituisce HTML al posto dell’immagine richiesta (fallback alla homepage).';
      await rm(path.join(SITE,e.path),{force:true});
    }
  }
  const excludedScripts=new Set();
  for(const e of entries.values()) {
    if(e.status==='ok' && /javascript/.test(e.contentType)) {
      const source=await readFile(path.join(OUT,e.originalPath),'utf8');
      const handles=source.match(/^\/\*\*handles:([^*]+)\*\*\//)?.[1]||'';
      if(/(?:^|,)(pys|moove_gdpr_frontend|gdpr_cc_addon_frontend|contact-form-7|uncode-google-maps)(?:,|$)/.test(handles))excludedScripts.add(e.url);
    }
  }
  for(const e of entries.values()) {
    if(e.status!=='ok')continue;
    if(!e.originalPath.startsWith('originali/')) continue;
    const text=await readFile(path.join(OUT,e.originalPath),'utf8');
    let output=text;
    if(e.contentType.includes('text/html')) {
      const $=cheerio.load(text);
      const body=$('body').clone();body.find('script,style,noscript,svg').remove();
      const item={url:e.url,path:e.path,title:clean($('title').text()),description:$('meta[name="description"]').attr('content')||'',headings:$('h1,h2,h3,h4,h5,h6').map((i,n)=>({level:Number(n.tagName[1]),text:clean($(n).text())})).get(),text:body.text().replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n\n').trim(),images:$('img').map((i,n)=>({src:$(n).attr('data-guid')||$(n).attr('data-src')||$(n).attr('src'),alt:$(n).attr('alt')||''})).get(),links:$('a[href]').map((i,n)=>({href:$(n).attr('href'),text:clean($(n).text())})).get(),forms:$('form').length};
      pages.push(item);
      await save(path.join(OUT,'testi',e.path.replace(/\.html$/,'.txt')),item.title+'\n'+item.url+'\n\n'+item.text+'\n');
      // Remove live tracking/admin services from the deployable copy; original HTML is untouched.
      $('base,link[rel="pingback"],link[rel="EditURI"],link[rel="https://api.w.org/"],link[rel="alternate"],link[rel="shortlink"],link[rel="dns-prefetch"],#wpadminbar,#moove_gdpr_cookie_info_bar,#moove_gdpr_cookie_modal').remove();
      $('script').each((i,el)=> {
        const src=$(el).attr('src')||'';const code=$(el).html()||'';
        if (excludedScripts.has(normalize(src,e.url)) || trackerRE.test(src) || /maps\.googleapis\.com/.test(src) || /PixelYourSite|pysFacebookRest|var pysOptions|var moove_frontend_gdpr_scripts|gtag\(|gtm\.start|_hsq|var recaptchaIds/.test(code) || /ai-uncode\.min\.js/.test(src)) $(el).remove();
      });
      $('iframe,img').each((i,el)=>{if(trackerRE.test($(el).attr('src')||$(el).attr('data-src')||''))$(el).remove();});
      $('[data-lat][data-lon]').each((i,el)=> {
        const n=$(el),lat=n.attr('data-lat'),lon=n.attr('data-lon');
        n.removeClass('uncode-gmaps-canvas').removeAttr('data-lat data-lon');
        n.html(`<div style="padding:28px;background:#eef6fb;color:#10283d"><p>Consulta l’indirizzo e le indicazioni per raggiungere lo studio.</p><a href="https://www.google.com/maps?q=${encodeURIComponent(lat+','+lon)}" target="_blank" rel="noopener">Apri la mappa e le indicazioni</a></div>`);
      });
      // Resolve original images locally instead of WordPress adaptive-image AJAX.
      $('[data-guid]').each((i,el)=> {
        const n=$(el),guid=n.attr('data-guid'),entry=lookup(guid,e.url);
        if(entry?.status==='ok') {
          if(el.tagName==='img') {n.attr('src',guid);n.removeAttr('srcset data-srcset data-lazy-src data-src');n.addClass('lazyloaded');}
          else if(n.hasClass('background-inner')) n.attr('style',(n.attr('style')||'').replace(/background-image\s*:[^;]+;?/i,'')+`;background-image:url("${guid}");`);
        }
        n.removeClass('adaptive-async lazyload lazyloading').removeAttr('data-uniqueid');
      });
      $('img[data-src]').each((i,el)=> {$(el).attr('src',$(el).attr('data-src')).removeAttr('data-src').removeClass('lazyload lazyloading').addClass('lazyloaded');});
      $('*').each((i,el)=> {
        const n=$(el);
        for(const [key,val] of Object.entries(el.attribs||{})) {
          if(['src','href','poster','data-src','data-guid','data-lazy-src','data-original','data-bg','data-background','data-thumb','data-thumbnail','content','data-href'].includes(key)) n.attr(key,rewriteURL(val,e.url,e.path));
          else if(/srcset$/.test(key))n.attr(key,val.split(',').map(part=>{const [u,...rest]=part.trim().split(/\s+/);return [rewriteURL(u,e.url,e.path),...rest].join(' ');}).join(', '));
          else if(key==='style')n.attr(key,rewriteCSS(val,e.url,e.path));
          else if(key.startsWith('data-')&&/https?:/.test(val))n.attr(key,rewriteAbsolute(val,e.url,e.path));
        }
        n.removeAttr('integrity');
      });
      $('style').each((i,el)=>$(el).html(rewriteCSS($(el).html()||'',e.url,e.path)));
      $('script:not([src])').each((i,el)=>$(el).html(rewriteAbsolute($(el).html()||'',e.url,e.path)));
      $('form').each((i,el)=> {
        const n=$(el);n.removeAttr('action method');
        n.find('input[type="submit"],button[type="submit"]').attr('disabled','disabled');
        n.prepend('<div class="fg-emergency-contact" style="padding:16px;margin-bottom:20px;background:#eef6fb;color:#10283d"><p>Per informazioni e appuntamenti contatta lo studio: <a href="tel:+39059345557">Modena 059 345557</a> · <a href="tel:+390522436618">Reggio Emilia 0522 436618</a> · <a href="mailto:info.federzonigranata@gmail.com">Email</a> · <a href="https://wa.me/393516737049">WhatsApp</a>.</p><small>Il modulo è temporaneamente disattivato.</small></div>');
      });
      $('head').prepend('<script src="'+path.posix.relative(path.posix.dirname(e.path),'_backup/emergenza.js')+'"></script>');
      output=$.html();
    } else if(e.contentType.includes('text/css')) output=rewriteCSS(text,e.url,e.path);
    else if(/javascript/.test(e.contentType)) {
      output=rewriteAbsolute(text,e.url,e.path);
      // The theme assumes every CSS background URL is absolute; relative paths
      // otherwise become their first character, leaving the hero hidden.
      if(e.path.endsWith('/uncode/library/js/init.min.js'))output=output.replaceAll('image.src=url[0]','image.src=Array.isArray(url)?url[0]:url');
    }
    await save(path.join(SITE,e.path),output);
  }
  await json(path.join(OUT,'inventario','pagine.json'),pages);
  await json(path.join(OUT,'inventario','dipendenze-esterne.json'),[...external].map(([url,sources])=>({url,sources:[...sources]})));
  await json(path.join(OUT,'inventario','errori-download.json'),[...entries.values()].filter(e=>e.status!=='ok'));
  await json(STATE,[...entries.values()]);
  console.log(JSON.stringify({output:OUT,pages:pages.length,resources:[...entries.values()].filter(e=>e.status==='ok').length,failed:[...entries.values()].filter(e=>e.status!=='ok').length},null,2));
}
await mkdir(OUT,{recursive:true});
if(renderOnly) {
  for(const e of JSON.parse(await readFile(STATE,'utf8')))entries.set(e.url,e);
  const ext=await readFile(path.join(OUT,'inventario','dipendenze-esterne.json'),'utf8').then(JSON.parse).catch(()=>[]);
  for(const e of ext)external.set(e.url,new Set(e.sources));
} else await gather();
await render();
