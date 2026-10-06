#!/usr/bin/env python3
"""Document, inventory, verify and zip a captured public site (standard library)."""
import csv
import hashlib
import html
import json
import shutil
import sys
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
OUT = Path(sys.argv[1]).resolve()
SITE = OUT / 'sito'
resources = json.loads((OUT / 'inventario/risorse.json').read_text())
pages = json.loads((OUT / 'inventario/pagine.json').read_text())
media = json.loads((OUT / 'inventario/media-wordpress.json').read_text())
api = json.loads((OUT / 'inventario/api-riepilogo.json').read_text())
good = [r for r in resources if r['status'] == 'ok']
failed = [r for r in resources if r['status'] != 'ok']
types = Counter(r.get('contentType', '').split(';')[0] for r in good)
source_map = {r['url']: r for r in good}

def write(name, text):
    dest = OUT / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding='utf-8')

def digest(file):
    h = hashlib.sha256()
    with file.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()

def esc(text):
    return html.escape(str(text), quote=True)

write('inventario/errori-download.json', json.dumps(failed,ensure_ascii=False,indent=2)+'\n')

write('AVVIA-ANTEPRIMA.py', '''#!/usr/bin/env python3
"""Avvia il sito statico in locale. Python 3, nessun pacchetto aggiuntivo."""
import functools
import http.server
import pathlib
import webbrowser

directory = pathlib.Path(__file__).resolve().parent / 'sito'
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
server = http.server.ThreadingHTTPServer(('127.0.0.1', 8766), handler)
print('Sito: http://127.0.0.1:8766 — termina con Ctrl+C', flush=True)
webbrowser.open('http://127.0.0.1:8766')
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
''')
write('AVVIA-MAC.command', '#!/bin/zsh\ncd -- "$(dirname -- "$0")"\npython3 AVVIA-ANTEPRIMA.py\n')
(OUT / 'AVVIA-MAC.command').chmod(0o755)
write('AVVIA-WINDOWS.bat', '@echo off\r\ncd /d "%~dp0"\r\npy -3 AVVIA-ANTEPRIMA.py\r\npause\r\n')
write('VERIFICA-INTEGRITA.py', '''#!/usr/bin/env python3
import hashlib
import pathlib
import sys
root = pathlib.Path(__file__).resolve().parent
errors = []
count = 0
for line in (root / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
    expected, name = line.split('  ', 1)
    file = root / name
    if not file.is_file():
        errors.append('MANCANTE: ' + name)
        continue
    h = hashlib.sha256()
    with file.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    if h.hexdigest() != expected:
        errors.append('MODIFICATO: ' + name)
    count += 1
print(f'Controllati {count} file; errori: {len(errors)}')
for error in errors:
    print(error)
sys.exit(bool(errors))
''')

image_files = sum(n for t, n in types.items() if t.startswith('image/'))
pdf_files = types.get('application/pdf', 0)
font_files = sum(n for t, n in types.items() if 'font' in t)
total_bytes = sum(r['bytes'] for r in good)
date = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
write('LEGGIMI-RIPRISTINO.md', f'''# Backup pubblico — Studio Dentistico Federzoni Granata

Fonte: https://studiodentisticofederzonigranata.it/
Acquisizione: 15 settembre 2026. Pacchetto generato: {date}.

## Cosa contiene

- **sito/**: copia statica pronta da caricare nella radice di un hosting web; HTML, immagini, CSS, JavaScript, font e documenti.
- **originali/**: risposte HTML, CSS, JavaScript e sitemap originali, prima degli adattamenti per l'uso statico. I file binari originali sono in **sito/**, secondo i percorsi in inventario/risorse.json.
- **testi/**: testi delle pagine in file TXT separati.
- **wordpress-pubblico/**: risposte dell'API pubblica WordPress, con pagine, articoli, categorie, tag, metadati e libreria multimediale. I file con suffisso `-dati.json` contengono JSON normalizzato; le risposte senza suffisso conservano anche eventuali avvisi emessi dal sito.
- **inventario/**: provenienza di ogni file, elenco pagine, media, dipendenze esterne, errori e controlli.
- **INDICE-BACKUP.html**: indice consultabile e galleria della libreria multimediale.
- **verifica/**: schermate e risultati delle verifiche nel browser, se presenti.
- **strumenti/**: script utilizzati per l'acquisizione e il confezionamento.
- **SHA256SUMS.txt** e **VERIFICA-INTEGRITA.py**: controllo dell'integrità dei file.

## Copertura rilevata

- {api.get('pages', {}).get('count', 0)} pagine WordPress pubblicate.
- {api.get('posts', {}).get('count', 0)} articoli pubblicati.
- {len(pages)} URL HTML acquisiti, inclusi archivi, tag e pagine collegate.
- {len(media)} elementi registrati nella libreria multimediale pubblica.
- {len(good)} risorse scaricate correttamente; {image_files} file immagine, {pdf_files} PDF, {font_files} file font.
- {total_bytes / 1024 / 1024:.1f} MiB scaricati, prima della compressione e dei file di inventario.
- {len(failed)} URL non acquisiti: vedere **inventario/errori-download.json** e il rapporto di verifica. Alcuni URL possono essere riferimenti non più esistenti o stringhe tecniche nei JavaScript.

La copertura riguarda ciò che è pubblicamente disponibile tramite sitemap, collegamenti, HTML/CSS/JavaScript e API WordPress al momento dell'acquisizione. Non è possibile individuare dal solo URL eventuali file privati, bozze, contenuti non collegati e non esposti dalle API, oppure tutte le possibili varianti generate dal server.

## Aprire la copia sul computer

1. Estrarre completamente lo ZIP.
2. Con Python 3 installato, eseguire **AVVIA-MAC.command** su Mac, **AVVIA-WINDOWS.bat** su Windows, oppure `python3 AVVIA-ANTEPRIMA.py` dal terminale nella cartella estratta.
3. Aprire **http://127.0.0.1:8766**. Per chiudere il server premere Ctrl+C nel terminale.

Aprire direttamente `sito/index.html` può limitare JavaScript e collegamenti assoluti: il server locale è il metodo verificato. `INDICE-BACKUP.html` si può aprire direttamente per consultare i file.

## Riattivare il sito in emergenza

1. Preparare una cartella vuota su un hosting statico o su un web server con HTTPS.
2. Caricare **il contenuto di sito/** nella radice pubblica del dominio: `index.html`, `wp-content`, `wp-includes`, `_esterni`, `_backup` e tutte le cartelle delle pagine.
3. Configurare `index.html` come documento predefinito e preservare i percorsi. La cartella deve essere la radice del sito, non una sottocartella.
4. Verificare homepage, menu, casi clinici, sedi, immagini, documenti e contatti prima di indirizzare il dominio al nuovo hosting.
5. Per riusare il dominio originale, configurare i suoi record DNS e il certificato HTTPS presso il provider. Il backup non modifica DNS o hosting.

Non caricare in pubblico l'intera cartella del backup: per pubblicare basta **sito/**. Nessuna compilazione e nessun database sono necessari per questa copia statica.

## Funzioni e adattamenti della copia statica

- Gli URL dei file acquisiti puntano alla copia locale.
- Le immagini adattive e quelle caricate in ritardo usano file locali; quando possibile si usa l'originale ad alta risoluzione. Il taglio di alcune miniature può differire dal ritaglio generato da WordPress.
- Il codice del tema necessario al menu e alle gallerie è conservato. Le animazioni dipendenti da funzionalità server possono differire.
- I moduli di contatto non inviano: mostrano telefono, email e WhatsApp. Questo evita che un messaggio sembri inviato senza poter essere consegnato.
- Le integrazioni di tracciamento, il relativo banner cookie e le funzioni amministrative sono disattivati nella copia statica. Le loro impostazioni restano nelle risposte originali archiviate.
- Le mappe JavaScript nelle pagine delle sedi sono sostituite da collegamenti alle indicazioni Google Maps; le mappe incorporate della landing restano servizi esterni.
- YouTube, Google Maps, social, WhatsApp e gli altri servizi esterni richiedono Internet e la disponibilità del fornitore. I video ospitati su YouTube sono conservati come riferimenti/embed, non come file video autonomi. Le loro copie originali richiedono l'esportazione dall'account proprietario.

## Per ripristinare integralmente WordPress

Questo è un **backup pubblico con copia statica di emergenza**, non un backup amministrativo WordPress. Per recuperare anche editor, configurazioni, invio email, plugin e database occorrono dall'hosting:

1. Un archivio completo dei file del sito, incluso `wp-content` con temi, plugin e uploads, e le configurazioni server necessarie.
2. Un export SQL completo del database WordPress.
3. Configurazione del dominio/DNS, versione PHP e impostazioni SMTP o del servizio email, conservate in modo appropriato.
4. Eventuali backup di servizi esterni e degli originali video.

L'export JSON delle API pubbliche è utile per recuperare testi e metadati, ma non sostituisce il database SQL. Dal solo URL pubblico non si possono scaricare PHP eseguibile lato server, credenziali, opzioni private e database.

## Verificare la conservazione

Eseguire `python3 VERIFICA-INTEGRITA.py`. Il risultato atteso è zero errori. Il file `.zip.sha256` accanto allo ZIP permette anche il controllo dell'archivio completo. Conservare una copia dello ZIP su un supporto o spazio diverso da questo computer.
''')

with (OUT / 'inventario/risorse.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['url','status','httpStatus','path','contentType','bytes','sha256Original'], extrasaction='ignore')
    writer.writeheader()
    writer.writerows(resources)

page_html = ''.join(f'<li><a href="sito/{esc(p["path"])}">{esc(p["title"])}</a> <small>{esc(p["url"])}</small> <a href="testi/{esc(p["path"].replace(".html", ".txt"))}">Testo TXT</a></li>' for p in pages)
gallery = []
for m in media:
    url = m.get('source_url','').replace('http://', 'https://')
    r = source_map.get(url)
    if not r:
        continue
    title = html.unescape(m.get('title',{}).get('rendered',''))
    if m.get('mime_type','').startswith('image/'):
        thumb_url = m.get('media_details',{}).get('sizes',{}).get('thumbnail',{}).get('source_url',url).replace('http://','https://')
        thumb = source_map.get(thumb_url,r)
        body = f'<img loading="lazy" src="sito/{esc(thumb["path"])}" alt="{esc(m.get("alt_text",title))}">'
    else:
        body = f'<span>{esc(m.get("mime_type","Documento"))}</span>'
    gallery.append(f'<a class="media" href="sito/{esc(r["path"])}">{body}<span>{esc(title)}</span></a>')
write('INDICE-BACKUP.html', f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Indice backup Federzoni Granata</title><style>[hidden]{{display:none!important}}body{{font:16px/1.5 system-ui,sans-serif;max-width:1200px;margin:40px auto;padding:0 24px;color:#10283d;background:#f7fafc}}a{{color:#256d95}}li{{margin:14px 0}}small{{display:block;color:#5f6f7c;overflow-wrap:anywhere}}.gallery{{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:18px}}.media{{display:flex;flex-direction:column;padding:12px;background:white;border:1px solid #d9e7f2;overflow-wrap:anywhere}}.media img{{height:140px;width:100%;object-fit:contain}}.media span{{padding-top:10px}}nav{{display:flex;flex-wrap:wrap;gap:24px;padding:20px 0}}input{{padding:12px;width:min(90%,600px);font:inherit}}</style></head><body><h1>Archivio del sito Federzoni Granata</h1><p>Acquisito il 15 settembre 2026 · {len(pages)} URL HTML · {len(media)} elementi multimediali · {len(good)} risorse</p><nav><a href="LEGGIMI-RIPRISTINO.md">Istruzioni di ripristino</a><a href="sito/index.html">Homepage salvata</a><a href="#pagine">Pagine e testi</a><a href="#immagini">Libreria multimediale</a><a href="inventario/risorse.csv">Inventario CSV</a></nav><p>Per navigare il sito con JavaScript, avviare AVVIA-ANTEPRIMA.py e aprire http://127.0.0.1:8766. Questo indice e i singoli file possono essere consultati direttamente.</p><label for="filter">Cerca pagine o immagini</label><br><input id="filter" type="search" placeholder="Nome, titolo o parola chiave"><h2 id="pagine">Pagine e testi</h2><ul>{page_html}</ul><h2 id="immagini">Libreria multimediale</h2><div class="gallery">{''.join(gallery)}</div><script>document.querySelector('#filter').addEventListener('input',e=>{{const q=e.target.value.toLowerCase();document.querySelectorAll('li,.media').forEach(el=>el.hidden=!el.textContent.toLowerCase().includes(q));}});</script></body></html>''')

(OUT / 'strumenti').mkdir(exist_ok=True)
for filename in ['backup-live-site.mjs','package-site-backup.py','verify-site-backup.mjs']:
    source = SCRIPTS / filename
    dest = OUT / 'strumenti' / filename
    if source != dest:
        shutil.copy2(source, dest)
write('strumenti/package.json', json.dumps({'private': True, 'type': 'module', 'dependencies': {'cheerio':'1.2.0'}}, indent=2)+'\n')
write('strumenti/LEGGIMI.md', 'Gli script documentano il metodo. Per una nuova acquisizione eseguire con Node.js 22 o successivo e la dipendenza cheerio installata: `node backup-live-site.mjs /percorso/nuovo-backup`. Il ripristino della copia esistente non richiede Node.js né questi strumenti.\n')

invalid_originals = [r['url'] for r in good if digest(OUT / r['originalPath']) != r['sha256Original']]
if invalid_originals:
    raise SystemExit('File originali con checksum non valido: '+str(invalid_originals))
write('inventario/integrita-originali.json', json.dumps({'checked':len(good),'mismatches':invalid_originals,'verifiedAt':date},indent=2)+'\n')
files = sorted(p for p in OUT.rglob('*') if p.is_file() and p.name != 'SHA256SUMS.txt' and p.name != '.DS_Store')
write('SHA256SUMS.txt', ''.join(f'{digest(p)}  {p.relative_to(OUT).as_posix()}\n' for p in files))
archive = OUT.with_suffix('.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
    for p in sorted(OUT.rglob('*')):
        if p.is_file() and p.name != '.DS_Store':
            z.write(p, Path(OUT.name) / p.relative_to(OUT))
with zipfile.ZipFile(archive) as z:
    if z.testzip() is not None:
        raise SystemExit('Errore di integrità nello ZIP')
archive.with_suffix('.zip.sha256').write_text(digest(archive)+'  '+archive.name+'\n')
print(json.dumps({'zip':str(archive),'bytes':archive.stat().st_size,'files':len(files)+1,'pages':len(pages),'images':image_files,'media':len(media),'resources':len(good),'failed':len(failed),'originalChecksums':'PASS','zipCRC':'PASS'},indent=2))
