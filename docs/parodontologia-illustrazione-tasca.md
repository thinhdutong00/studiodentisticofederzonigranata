# Sequenza illustrata: tasca, sondaggio e risposta alle cure

Creata il 26 ottobre 2026 con lo strumento integrato imagegen, per la landing `/visita-parodontologia/`.

Le tre immagini mantengono la stessa inquadratura ravvicinata della medesima porzione di arcata. Lo stile è disegnato, con colori pastello e bordi locali morbidi; non ci sono contorni neri o blu sulle corone. Le tacche scure sulla sonda rappresentano le graduazioni dello strumento.

## File del progetto

- `public/assets/optimized/parodontologia-tasca-grafica.webp` — 1536 × 1024, circa 76 KB: tasca parodontale e depositi.
- `public/assets/optimized/parodontologia-sondaggio-grafico.webp` — 1536 × 1024, circa 86 KB: sondaggio della stessa zona.
- `public/assets/optimized/parodontologia-dopo-cure-grafica.webp` — 1536 × 1024, circa 74 KB: possibile miglioramento dopo la terapia.
- Originali PNG e versioni precedenti conservati in `output/imagegen/`; `output/` è escluso da Git.

Le immagini sono schemi didattici generati, non fotografie di pazienti o risultati clinici documentati. La terza mostra la rimozione dei depositi, tessuti meno infiammati e riduzione della tasca; non rappresenta una ricrescita automatica dell’osso perduto. La risposta individuale e le ulteriori cure dipendono dalla situazione clinica. I testi ricordano rivalutazione e mantenimento.

Riferimenti: [SIdP · Tasche parodontali e riduzione della profondità dopo le cure](https://www.gengive.org/cosa-sono-le-tasche-parodontali/), [SIdP · Terapia e mantenimento](https://www.gengive.org/parodontite-cura/), [EFP · Esame e sondaggio parodontale](https://www.efp.org/for-patients/what-is-periodontitis/).

## Prompt finale: tasca parodontale

Riferimento: la precedente illustrazione ravvicinata della tasca.

```text
Edit the referenced medical drawing. Preserve the EXACT close-up composition, cropped portion of dental arch, tooth shapes and positions, root anatomy, gum and bone contours, periodontal pocket and small ochre deposits. Keep the image clearly a TWO-DIMENSIONAL drawn medical graphic with flat pastel colors and restrained tonal shading.
Change only the rendering of edges: REMOVE EVERY black, navy or dark-blue contour line around crowns, roots and gums. Crowns must have soft warm ivory/beige boundaries, with subtle pale grey-beige separation between teeth. Tissue boundaries should use soft local colors, not dark ink. Separate shapes using gentle colored transitions. There must be no dark stroke tracing the outer perimeter of any tooth.
Retain a professional drawn/vector-like style, without realistic enamel or flesh texture, without glossy 3D rendering. Same pale blue-white background, same 3:2 framing with edge teeth partly outside the frame, no full arch, no tool, no text, no arrows, no labels, no watermark.
```

## Prompt finale: sondaggio

Riferimenti: precedente disegno del sondaggio e nuova immagine della tasca senza contorni scuri.

```text
Image 1 is the EDIT TARGET: the close-up medical drawing with a periodontal measuring probe. Image 2 is the approved SOFT-EDGE STYLE reference.
Keep the exact composition, cropped row of neighboring teeth, tooth and root geometry, gum and bone anatomy, periodontal pocket and probe position from image 1.
Remove all black/navy/dark-blue contour strokes around the tooth crowns, roots and gum surfaces. Match image 2: warm ivory/beige edges for teeth, muted coral-pink tissue boundaries and subtle local-color transitions, with no dark line tracing any tooth.
Keep the thin silver BLUNT periodontal measuring probe and its small black graduation bands, since these are marks on the instrument. The probe stays gently inserted between tooth root and gum, not penetrating the tooth or bone.
Maintain a clearly drawn TWO-DIMENSIONAL pastel medical illustration, no photographic texture, no glossy 3D render, same pale blue-white background and landscape 3:2 framing. No text, labels, numbers, arrows, watermark or additional objects.
```

## Prompt finale: dopo le cure

Riferimento: nuova immagine della tasca, per mantenere la stessa anatomia e inquadratura.

```text
Edit the referenced soft-edge medical drawing to create the THIRD FRAME of a consistent patient-education sequence: the SAME segment of dental arch AFTER SUCCESSFUL PERIODONTAL TREATMENT, in a stable, less inflamed condition.
Preserve the EXACT camera, crop, tooth positions and shapes, root geometry, background, 3:2 framing, flat drawn pastel style and soft ivory/beige edges. No dark outlines around crowns, roots or gums, no photographic textures, no 3D render.
Change the treated central site: remove ALL yellow/ochre calculus deposits so the root surface is clean; change swollen red gum to firm, lighter healthy pink gum that fits closely along the tooth; show the formerly deep pocket substantially reduced to a shallow gingival crevice. A modest apical shift of the gum margin is acceptable to illustrate pocket reduction with mild residual recession.
IMPORTANT ANATOMICAL CONSTRAINT: keep the pre-existing BONE HEIGHT AND BONE DEFECT CONTOUR the SAME as in the reference. Do not regenerate missing bone, raise the bone crest, cover the root with new bone or imply complete anatomical restoration. The change is in soft tissue inflammation and pocket depth, not miraculous bone regrowth. Keep the cutaway so the supporting structures are still comparable to the first frame.
No periodontal instrument, no arrows, text, numbers, labels, logos or watermark. This should read as a possible stable post-treatment result of the SAME teeth, not a new perfect mouth.
```
