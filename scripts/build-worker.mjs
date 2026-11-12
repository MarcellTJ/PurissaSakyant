import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import path from 'node:path';
const dist = path.resolve('dist'),
  assets = {};
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'server' || entry.name === '.openai') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (types[path.extname(file)])
      assets['/' + path.relative(dist, file).replaceAll('\\', '/')] = {
        type: types[path.extname(file)],
        body: (await readFile(file)).toString('base64'),
      };
  }
}
await walk(dist);
await mkdir(path.join(dist, 'server'), { recursive: true });
const api = (await readFile('server/api.js', 'utf8')).replace(/^export /gm, '');
await writeFile(
  path.join(dist, 'server/index.js'),
  'const ASSETS=' +
    JSON.stringify(assets) +
    ';\n' +
    api +
    '\n' +
    (await readFile('server/worker.js', 'utf8')),
);
await mkdir(path.join(dist, '.openai'), { recursive: true });
await cp('.openai/hosting.json', path.join(dist, '.openai/hosting.json'));
await cp('drizzle', path.join(dist, '.openai/drizzle'), { recursive: true });
console.log('Worker built with embedded assets and database migrations.');
