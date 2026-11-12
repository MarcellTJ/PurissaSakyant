import { copyFile, writeFile } from 'node:fs/promises';
for (const route of ['sak-yant', 'gallery', 'events', 'faq', 'socials'])
  await copyFile('dist/index.html', `dist/${route}.html`);
await writeFile('dist/_redirects', '/* /index.html 200\n');
