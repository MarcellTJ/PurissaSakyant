# Purissa React application

React + Vite + React Router. All pages are included in the application bundle; moving between tabs keeps the header and footer mounted. Images are warmed in the background. Static URLs and old .html links continue to work.

## Development

- npm ci
- npm run dev
- npm run build
- npm run preview

## Editing content

- src/data/site.js: navigation, WhatsApp booking destination, event list, and contact details. Set contact.email when ready; Instagram and TikTok URLs are stored in contact.socialProfiles.
- src/data/eventSlides.json: event carousel content and photographs.
- src/data/gallery.json: ordered gallery image list and captions.
- src/data/faq.json: questions and answers.
- src/components/SocialsPage.jsx: Socials page and the message draft form. Sending stays disabled while contact.email is null; once set, email opens in the visitor's own email application. No server delivery service is configured.
- src/components/Sections.jsx: informational sections and homepage content.
- public/assets/brand, events, gallery, social: organized original image files.
- src/styles.css: established design styles; src/react.css: React layout and responsive fixes.

Replace an image in public/assets while keeping its filename, then rebuild. Never edit dist directly: it is generated build output. See IMAGE-GUIDE.md for the image inventory.

## Deployment

The existing .openai/hosting.json points to dist. The build emits the application and compatibility HTML entrypoints. _redirects routes direct page requests back to the application shell. No secrets or server services are required. The earlier ZIP backup is separate and unchanged.


## Admin Room
The unlisted `/admin-room` route is a server-authenticated event workspace. It is deliberately absent from public navigation. Drafts are private; publishing adds events to Beranda and Event. Events and sessions persist in the D1 `DB` binding, images in R2 `BUCKET`. The existing Sites audience still applies.

Production secrets are configured through Sites environment variables, never the client or repository: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_RATE_KEY`; `PUBLIC_ORIGIN` is the deployed origin. The password format is `pbkdf2-sha256$100000$<16-byte hex salt>$<32-byte hex digest>`. Rotating the hash invalidates existing sessions. HTTPS session cookies are HttpOnly, SameSite Strict, expire after six hours, and contain only an opaque token. Mutations require matching origin and a session CSRF token. Login attempts and uploads are rate limited. Image uploads are restricted to JPG/PNG/WebP, 5 MB each, six per event; the editor resizes and re-encodes them. Text is rendered as text, never HTML.

Run `npm run build`, then `npm test` for the Worker integration checks. `npm run preview` starts a local Worker with a fresh local database, the username `purissa_admin`, and a randomly generated local-only password printed in the terminal. Set `PURISSA_LOCAL_PASSWORD` in the process environment to choose a local password. Local storage is excluded from source. `npm run dev` serves only the frontend; use preview to test authentication and uploads. SQL migrations under `drizzle/` are deployed before the Worker; never edit a migration already applied in production.


### Event and image editors
`Edit Events` loads saved events, including the original 2025 event, from a selector. `Edit Images` provides the two general-image slots, the complete gallery library, and a shortcut to event editing. The general-image previews reuse the real Beranda and Rooted in Tradition sections. Existing layout and prose are preserved. Gallery fields include title, alternative text, caption, and display order. Replacement uploads remain private until a saved record references them. Public content reads only saved records from `/api/content`; typing, replacing, and marking deletion never writes a public record. Gallery deletion is a soft removal; use “Tampilkan gambar yang dihapus” to select and restore an image. Originals and uploaded objects are retained. The frontend has bundled defaults for temporary API failures. `src/data/imageDefaults.json` documents the original image slots and gallery; production overrides live in D1 `site_images`. The original event's static imagery remains allowlisted; arbitrary image URLs are rejected.
