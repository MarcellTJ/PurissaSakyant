import { Miniflare } from 'miniflare';
import { readFile, readdir } from 'node:fs/promises';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
const salt = randomBytes(16);
const password =
  process.env.PURISSA_LOCAL_PASSWORD || randomBytes(12).toString('hex');
const mf = new Miniflare({
  modules: true,
  scriptPath: 'dist/server/index.js',
  compatibilityDate: '2026-01-01',
  host: '127.0.0.1',
  port: 8765,
  d1Databases: ['DB'],
  d1Persist: '.local/d1-' + randomBytes(3).toString('hex'),
  r2Buckets: ['BUCKET'],
  r2Persist: '.local/r2',
  bindings: {
    LOCAL_DEV: 'true',
    ADMIN_USERNAME: 'purissa_admin',
    ADMIN_PASSWORD_HASH:
      'pbkdf2-sha256$100000$' +
      salt.toString('hex') +
      '$' +
      pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex'),
    ADMIN_RATE_KEY: randomBytes(32).toString('hex'),
  },
});
const db = await mf.getD1Database('DB');
for (const file of (await readdir('drizzle'))
  .filter((f) => f.endsWith('.sql'))
  .sort()) {
  for (const statement of (await readFile('drizzle/' + file, 'utf8')).split(
    '--> statement-breakpoint',
  ))
    if (statement.trim()) await db.prepare(statement).run();
}
console.log('Preview ready:', String(await mf.ready));
console.log('Local preview username: purissa_admin');
console.log('Local preview password:', password);
process.on('SIGINT', async () => {
  await mf.dispose();
  process.exit();
});
