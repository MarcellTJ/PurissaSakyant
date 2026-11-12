import test from 'node:test';
import assert from 'node:assert/strict';
import { Miniflare } from 'miniflare';
import { readFile, readdir } from 'node:fs/promises';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
test('Server authentication, uploads, private drafts and publication', async () => {
  const salt = randomBytes(16),
    password = randomBytes(16).toString('hex');
  const mf = new Miniflare({
    modules: true,
    scriptPath: 'dist/server/index.js',
    compatibilityDate: '2026-01-01',
    d1Databases: ['DB'],
    d1Persist: '.local/d1-' + randomBytes(3).toString('hex'),
    r2Buckets: ['BUCKET'],
    r2Persist: '.local/r2',
    bindings: {
      ADMIN_USERNAME: 'test_admin',
      ADMIN_PASSWORD_HASH:
        'pbkdf2-sha256$100000$' +
        salt.toString('hex') +
        '$' +
        pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex'),
      ADMIN_RATE_KEY: randomBytes(32).toString('hex'),
    },
  });
  try {
    const db = await mf.getD1Database('DB');
    for (const file of (await readdir('drizzle'))
      .filter((f) => f.endsWith('.sql'))
      .sort())
      for (const sql of (await readFile('drizzle/' + file, 'utf8')).split(
        '--> statement-breakpoint',
      ))
        if (sql.trim()) await db.prepare(sql).run();
    let cookie = '',
      csrf = '';
    const req = (path, method = 'GET', body, extra = {}) =>
      mf.dispatchFetch('https://test.local' + path, {
        method,
        headers: {
          Origin: 'https://test.local',
          Cookie: cookie,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
          ...extra,
        },
        ...(body !== undefined
          ? { body: typeof body === 'string' ? body : JSON.stringify(body) }
          : {}),
      });
    assert.equal((await req('/api/admin/events')).status, 401);
    assert.equal(
      (
        await req(
          '/api/admin/login',
          'POST',
          { username: 'test_admin', password },
          { Origin: 'https://evil.local' },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await req('/api/admin/login', 'POST', {
          username: 'test_admin',
          password: 'wrong',
        })
      ).status,
      401,
    );
    let response = await req('/api/admin/login', 'POST', {
      username: 'test_admin',
      password,
    });
    assert.equal(response.status, 200);
    cookie = response.headers.get('Set-Cookie').split(';')[0];
    assert.match(response.headers.get('Set-Cookie'), /HttpOnly/);
    assert.match(response.headers.get('Set-Cookie'), /Secure/);
    csrf = (await response.json()).csrf;
    assert.equal((await req('/api/admin/session')).status, 200);
    const event = {
      title: "Purissa's <script>alert(1)</script>",
      hook: 'A meaningful meeting',
      startDate: '2026-12-01',
      endDate: '2026-12-03',
      caption: 'Information and location',
      status: 'draft',
      images: [],
    };
    assert.equal(
      (
        await req('/api/admin/events', 'POST', event, {
          'X-CSRF-Token': 'wrong',
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await req('/api/admin/events', 'POST', {
          ...event,
          startDate: '9999-99-99',
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await req('/api/admin/events', 'POST', {
          ...event,
          endDate: '2026-01-01',
        })
      ).status,
      400,
    );
    response = await req('/api/admin/events', 'POST', event);
    assert.equal(response.status, 200);
    let saved = (await response.json()).event;
    assert.equal(
      (await (await req('/api/events')).json()).events.filter(
        (item) => item.id !== '3c917bfd-67b6-4e17-9607-6419e5cf5cc8',
      ).length,
      0,
    );
    assert.equal(
      (
        await req('/api/admin/events/' + saved.id, 'PUT', {
          ...event,
          status: 'published',
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await req(
          '/api/admin/uploads',
          'POST',
          '<svg onload="alert(1)"></svg>',
          { 'Content-Type': 'image/svg+xml' },
        )
      ).status,
      400,
    );
    const image = await readFile('public/assets/brand/purissa-logo.jpg');
    response = await mf.dispatchFetch('https://test.local/api/admin/uploads', {
      method: 'POST',
      headers: {
        Origin: 'https://test.local',
        Cookie: cookie,
        'X-CSRF-Token': csrf,
        'Content-Type': 'image/jpeg',
      },
      body: image,
    });
    assert.equal(response.status, 201);
    const uploaded = (await response.json()).image;
    assert.equal(
      (await mf.dispatchFetch('https://test.local' + uploaded.url)).status,
      404,
    );
    assert.equal((await req(uploaded.url)).status, 200);
    response = await req('/api/admin/events/' + saved.id, 'PUT', {
      ...event,
      status: 'published',
      images: [uploaded],
    });
    assert.equal(response.status, 200);
    const list = await (await req('/api/events')).json();
    assert.equal(list.events.length, 2);
    assert.equal(
      list.events.find((item) => item.id === saved.id).title,
      event.title,
    );
    assert.equal(
      (await mf.dispatchFetch('https://test.local' + uploaded.url)).status,
      200,
    );
    const before = (await (await req('/api/content')).json()).images;
    assert.equal(before.length, 25);
    assert.equal(before.filter((image) => image.kind === 'gallery').length, 23);
    const existing = (
      await (await req('/api/admin/events')).json()
    ).events.find((item) => item.id === '3c917bfd-67b6-4e17-9607-6419e5cf5cc8');
    assert.equal(
      existing.images[0].url,
      '/assets/events/master-handpoke-session.jpg',
    );
    assert.equal(
      (
        await req('/api/admin/events/' + existing.id, 'PUT', {
          ...existing,
          hook: 'Updated legacy hook',
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await req('/api/admin/events/' + existing.id, 'PUT', {
          ...existing,
          images: [
            { ...existing.images[0], url: 'https://evil.local/injected.svg' },
          ],
        })
      ).status,
      400,
    );
    const general = before.find((image) => image.id === 'home-intro');
    assert.equal(
      (
        await req(
          '/api/admin/images/' + general.id,
          'PUT',
          { ...general, title: 'Updated name' },
          { 'X-CSRF-Token': 'bad' },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await req('/api/admin/images/' + general.id, 'PUT', {
          ...general,
          deleted: true,
        })
      ).status,
      400,
    );
    const pendingResponse = await mf.dispatchFetch(
      'https://test.local/api/admin/uploads',
      {
        method: 'POST',
        headers: {
          Origin: 'https://test.local',
          Cookie: cookie,
          'X-CSRF-Token': csrf,
          'Content-Type': 'image/jpeg',
        },
        body: image,
      },
    );
    const pending = (await pendingResponse.json()).image;
    assert.equal(
      (await mf.dispatchFetch('https://test.local' + pending.url)).status,
      404,
    );
    assert.deepEqual(
      (await (await req('/api/content')).json()).images,
      before,
      'Staged upload does not change public content',
    );
    response = await req('/api/admin/images/' + general.id, 'PUT', {
      ...general,
      src: 'https://evil.local/file',
      uploadId: pending.id,
      caption: 'New hero caption',
    });
    assert.equal(response.status, 200);
    const publicGeneral = (
      await (await req('/api/content')).json()
    ).images.find((image) => image.id === general.id);
    assert.equal(publicGeneral.src, pending.url);
    assert.equal(publicGeneral.caption, 'New hero caption');
    assert.equal(
      (await mf.dispatchFetch('https://test.local' + pending.url)).status,
      200,
    );
    const item = before.find((image) => image.kind === 'gallery');
    response = await req('/api/admin/images/' + item.id, 'PUT', {
      ...item,
      title: 'Updated gallery title',
      alt: 'Updated accessible description',
      caption: 'Updated caption',
    });
    assert.equal(response.status, 200);
    assert.equal(
      (
        await req('/api/admin/images/' + item.id, 'PUT', {
          ...item,
          deleted: true,
        })
      ).status,
      200,
    );
    assert.equal(
      (await (await req('/api/content')).json()).images.some(
        (image) => image.id === item.id,
      ),
      false,
    );
    assert.equal(
      (await (await req('/api/admin/images')).json()).images.find(
        (image) => image.id === item.id,
      ).deleted,
      true,
    );
    assert.equal(
      (
        await req('/api/admin/images/' + item.id, 'PUT', {
          ...item,
          deleted: false,
        })
      ).status,
      200,
    );
    assert.equal(
      (await (await req('/api/content')).json()).images.filter(
        (image) => image.kind === 'gallery',
      ).length,
      23,
    );
    response = await req('/api/admin/images', 'POST', {
      title: 'New gallery work',
      alt: 'New image description',
      caption: 'New caption',
      position: 23,
      uploadId: pending.id,
      deleted: false,
    });
    assert.equal(response.status, 200);
    assert.equal(
      (await (await req('/api/content')).json()).images.filter(
        (image) => image.kind === 'gallery',
      ).length,
      24,
    );
    assert.equal(
      (
        await req('/api/admin/images', 'POST', {
          title: 'Invalid',
          alt: 'Invalid',
          caption: '',
          position: 24,
          src: 'javascript:alert(1)',
          deleted: false,
        })
      ).status,
      400,
    );
    assert.equal((await req('/api/admin/logout', 'POST')).status, 200);
    assert.equal((await req('/api/admin/events')).status, 401);
    cookie = '';
    csrf = '';
    for (let i = 0; i < 5; i++)
      assert.equal(
        (
          await req('/api/admin/login', 'POST', {
            username: 'test_admin',
            password: 'bad',
          })
        ).status,
        401,
      );
    assert.equal(
      (
        await req('/api/admin/login', 'POST', {
          username: 'test_admin',
          password,
        })
      ).status,
      429,
    );
    assert.match(
      (await mf.dispatchFetch('https://test.local/admin-room')).headers.get(
        'X-Robots-Tag',
      ),
      /noindex/,
    );
    assert.equal((await mf.dispatchFetch('https://test.local/')).status, 200);
  } finally {
    await mf.dispose();
  }
});
