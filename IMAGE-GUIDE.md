# Purissa image replacement guide

Source images are organized in `public/assets/brand/`, `public/assets/events/`, and `public/assets/gallery/`. The build copies these into `dist/assets/`.

## Easiest replacement
Replace the image file while keeping its name and JPG format. Every page using it updates together. Keep a backup and deploy the updated site. Changes on your computer do not change the published site automatically.

- `brand/purissa-logo.jpg`: header and footer logo on every page; keep the complete logo and dark background.
- `events/candle-blessing-ceremony.jpg`: homepage introduction, event slide, and Rooted in Tradition. Replacing it updates all three locations.
- `events/master-handpoke-session.jpg`: first event slide on `events.html`.
- `gallery/`: photographs in slideshow order. The numbered prefix preserves the intended order; names describe the visible subject, not a verified spiritual design name.

The homepage previews reuse gallery images 14, 02, and 08. The third event slide reuses gallery image 13.

## Size and composition
Use sharp original photographs. Aim for 1600 px on the long edge for event images and 1000–1600 px for gallery photos. Avoid enlarging small files. Keep the subject away from extreme edges because layouts crop differently on mobile.

## Reordering or using different images
Edit image `src` values in `gallery.html` to reorder the gallery; groups contain three images. Edit `index.html` for the homepage introduction and previews. Edit `events.html` for event image backgrounds (`--slide-image`) and event details. Update alt text when the subject changes. Update this guide and `assets/image-manifest.json` when adding or renaming assets.

## Inventory

| File | Used on | Previous filename(s) |
|---|---|---|
| assets/brand/purissa-logo.jpg | faq.html, gallery.html, index.html, sak-yant.html | logo.jpg |
| assets/events/master-handpoke-session.jpg | index.html | master.jpg |
| assets/events/candle-blessing-ceremony.jpg | index.html, sak-yant.html | ritual.jpg |
| assets/gallery/01-paired-leg-sak-yant.jpg | gallery.html | work-01.jpg |
| assets/gallery/02-tiger-upper-arm.jpg | gallery.html, index.html | work-02.jpg, tiger.jpg |
| assets/gallery/03-ornamental-leg-panel.jpg | gallery.html | work-03.jpg |
| assets/gallery/04-vertical-side-torso.jpg | gallery.html | work-04.jpg |
| assets/gallery/05-chest-sacred-symbols.jpg | gallery.html | work-05.jpg |
| assets/gallery/06-standing-figure-upper-arm.jpg | gallery.html | work-06.jpg |
| assets/gallery/07-red-winged-figure.jpg | gallery.html | work-07.jpg |
| assets/gallery/08-radial-geometric-symbols.jpg | gallery.html, index.html | work-08.jpg, geometry.jpg |
| assets/gallery/09-dragon-leg-panel.jpg | gallery.html | work-09.jpg |
| assets/gallery/10-balanced-upper-back.jpg | gallery.html | work-10.jpg |
| assets/gallery/11-neck-and-shoulder-script.jpg | gallery.html | work-11.jpg |
| assets/gallery/12-small-upper-back-symbol.jpg | gallery.html | work-12.jpg |
| assets/gallery/13-dense-shoulder-panel.jpg | gallery.html, index.html | work-13.jpg, hero.jpg |
| assets/gallery/14-full-back-composition.jpg | gallery.html, index.html | work-14.jpg, back.jpg |
| assets/gallery/15-vertical-spine-script.jpg | gallery.html | work-15.jpg |
| assets/gallery/16-winged-back-composition.jpg | gallery.html | work-16.jpg |
| assets/gallery/17-seated-figure-detail.jpg | gallery.html | work-17.jpg |
| assets/gallery/18-script-forearm-sleeve.jpg | gallery.html | work-18.jpg |
| assets/gallery/19-large-back-temple-panel.jpg | gallery.html | work-19.jpg |
| assets/gallery/20-tiger-detail.jpg | gallery.html | work-20.jpg |
| assets/gallery/21-circular-tiger-emblem.jpg | gallery.html | work-21.jpg |
| assets/gallery/22-ganesha-detail.jpg | gallery.html | work-22.jpg |
| assets/gallery/23-ornamental-upper-arm.jpg | gallery.html | work-23.jpg |

Event imagery now appears on `events.html`; the candle ceremony image is also reused on Beranda and Sak Yant & Blessing. Refer to the updated JSON manifest for current page usage.

## React editing locations

Use `src/data/gallery.json` to change gallery order and captions, `src/data/eventSlides.json` for carousel text and images, and `src/data/site.js` for event list entries and the WhatsApp destination. Static homepage images are in `src/components/Sections.jsx`. Rebuild with `npm run build` after edits; never edit `dist` directly. The earlier HTML filenames in the inventory describe the previous version; React routes now render these sections from shared components.


## Admin editing
Open `/admin-room` → Edit Images. General Images offers Beranda / Seni sakral and Sak Yant & Blessing / Rooted in Tradition. Gallery Images shows every active gallery image; select one to edit title, alt text, caption, display order, replace it, or mark it removed. “Tambah gambar” opens the same editor with an empty preview. The preview is private until “Simpan perubahan”. Use the removed-images checkbox to restore saved deletions. Event Images redirects to Edit Events, whose selector includes the original event and any saved drafts/published events. Original asset files are retained as defaults; production edits are database records and R2 uploads, not modifications to packaged files.
