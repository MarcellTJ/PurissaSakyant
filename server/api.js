const TRUSTED_IMAGES = new Set([
  '/assets/events/candle-blessing-ceremony.jpg',
  '/assets/events/master-handpoke-session.jpg',
  '/assets/gallery/01-paired-leg-sak-yant.jpg',
  '/assets/gallery/02-tiger-upper-arm.jpg',
  '/assets/gallery/03-ornamental-leg-panel.jpg',
  '/assets/gallery/04-vertical-side-torso.jpg',
  '/assets/gallery/05-chest-sacred-symbols.jpg',
  '/assets/gallery/06-standing-figure-upper-arm.jpg',
  '/assets/gallery/07-red-winged-figure.jpg',
  '/assets/gallery/08-radial-geometric-symbols.jpg',
  '/assets/gallery/09-dragon-leg-panel.jpg',
  '/assets/gallery/10-balanced-upper-back.jpg',
  '/assets/gallery/11-neck-and-shoulder-script.jpg',
  '/assets/gallery/12-small-upper-back-symbol.jpg',
  '/assets/gallery/13-dense-shoulder-panel.jpg',
  '/assets/gallery/14-full-back-composition.jpg',
  '/assets/gallery/15-vertical-spine-script.jpg',
  '/assets/gallery/16-winged-back-composition.jpg',
  '/assets/gallery/17-seated-figure-detail.jpg',
  '/assets/gallery/18-script-forearm-sleeve.jpg',
  '/assets/gallery/19-large-back-temple-panel.jpg',
  '/assets/gallery/20-tiger-detail.jpg',
  '/assets/gallery/21-circular-tiger-emblem.jpg',
  '/assets/gallery/22-ganesha-detail.jpg',
  '/assets/gallery/23-ornamental-upper-arm.jpg',
]);
const encoder = new TextEncoder();
const SESSION_MS = 6 * 60 * 60 * 1000;
const MAX_IMAGE = 5 * 1024 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const hex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
const unhex = (value) =>
  Uint8Array.from(value.match(/.{2}/g) || [], (value) => parseInt(value, 16));
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)));
export async function digest(value) {
  return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}
function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
export async function verifyPassword(password, record) {
  const [algorithm, iterations, salt, expected] = record.split('$');
  if (
    algorithm !== 'pbkdf2-sha256' ||
    iterations !== '100000' ||
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{64}$/.test(expected)
  )
    throw new Error('Invalid password configuration');
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const result = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: unhex(salt) },
    key,
    256,
  );
  return equal(hex(result), expected);
}
function local(request, env) {
  return (
    env.LOCAL_DEV === 'true' &&
    ['localhost', '127.0.0.1'].includes(new URL(request.url).hostname)
  );
}
function cookieName(request, env) {
  return local(request, env) ? 'purissa_admin_local' : '__Host-purissa_admin';
}
function cookie(request, env, value, maxAge = 21600) {
  return `${cookieName(request, env)}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${local(request, env) ? '' : '; Secure'}`;
}
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}
function checkOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = [new URL(request.url).origin, env.PUBLIC_ORIGIN].filter(
    Boolean,
  );
  if (!origin || !allowed.includes(origin))
    throw new HttpError(403, 'This request is not allowed.');
}
async function readBody(request, limit) {
  const declared = Number(request.headers.get('Content-Length'));
  if (declared > limit) throw new HttpError(413, 'The request is too large.');
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader(),
    chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new HttpError(413, 'The request is too large.');
    }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
async function readJson(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    throw new HttpError(415, 'Use a JSON request.');
  try {
    return JSON.parse(new TextDecoder().decode(await readBody(request, 30000)));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'The submitted data is invalid.');
  }
}
function text(value, name, max, required = true) {
  if (
    typeof value !== 'string' ||
    value.length > max ||
    (required && !value.trim())
  )
    throw new HttpError(400, `Please check ${name}.`);
  return value.trim();
}
export function validDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value + 'T00:00:00Z').getTime()) &&
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value
  );
}
export function validateEvent(data) {
  if (!data || typeof data !== 'object')
    throw new HttpError(400, 'The submitted data is invalid.');
  const title = text(data.title, 'the title', 120),
    hook = text(data.hook, 'the hook', 240),
    caption = text(data.caption, 'the caption', 5000);
  if (
    !validDate(data.startDate) ||
    !validDate(data.endDate) ||
    data.endDate < data.startDate
  )
    throw new HttpError(400, 'Choose a valid date range.');
  if (!['draft', 'published'].includes(data.status))
    throw new HttpError(400, 'Choose a valid event status.');
  if (!Array.isArray(data.images) || data.images.length > 6)
    throw new HttpError(400, 'Use up to six images.');
  if (data.status === 'published' && !data.images.length)
    throw new HttpError(400, 'Add at least one image before publishing.');
  const images = data.images.map((image) => {
    if (!UUID.test(image.id)) throw new HttpError(400, 'An image is invalid.');
    return {
      id: image.id,
      ...(TRUSTED_IMAGES.has(image.url) ? { url: image.url } : {}),
      caption: text(image.caption || '', 'the image caption', 300, false),
    };
  });
  if (new Set(images.map((image) => image.id)).size !== images.length)
    throw new HttpError(400, 'An image was added more than once.');
  return {
    title,
    hook,
    caption,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    images,
  };
}
export function imageMime(bytes) {
  if (
    bytes.length >= 12 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff &&
    bytes.at(-2) === 0xff &&
    bytes.at(-1) === 0xd9
  )
    return 'image/jpeg';
  if (
    bytes.length >= 24 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value) &&
    new TextDecoder().decode(bytes.slice(-8, -4)) === 'IEND'
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (view.getUint32(16) > 6000 || view.getUint32(20) > 6000)
      throw new HttpError(400, 'Image dimensions are too large.');
    return 'image/png';
  }
  if (
    bytes.length >= 12 &&
    new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
    new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP' &&
    new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(
      4,
      true,
    ) +
      8 ===
      bytes.length
  )
    return 'image/webp';
  throw new HttpError(400, 'Only valid JPG, PNG, or WebP images are accepted.');
}
async function session(request, env) {
  const raw = request.headers.get('Cookie') || '';
  const token = raw
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName(request, env) + '='))
    ?.split('=')[1];
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new HttpError(401, 'Please log in to continue.');
  const hash = await digest(token);
  const row = await env.DB.prepare(
    'SELECT * FROM admin_sessions WHERE token_hash = ? AND expires_at > ?',
  )
    .bind(hash, Date.now())
    .first();
  if (
    !row ||
    !equal(row.credential_version, await digest(env.ADMIN_PASSWORD_HASH || ''))
  )
    throw new HttpError(401, 'Please log in to continue.');
  return { ...row, tokenHash: hash };
}
async function writeSession(request, env) {
  checkOrigin(request, env);
  const current = await session(request, env);
  if (!equal(request.headers.get('X-CSRF-Token'), current.csrf))
    throw new HttpError(403, 'Your session needs to be refreshed.');
  return current;
}
function eventJson(row) {
  return {
    id: row.id,
    title: row.title,
    hook: row.hook,
    startDate: row.start_date,
    endDate: row.end_date,
    caption: row.caption,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: JSON.parse(row.images_json).map((image) => ({
      ...image,
      url: TRUSTED_IMAGES.has(image.url) ? image.url : '/media/' + image.id,
    })),
  };
}
async function login(request, env) {
  checkOrigin(request, env);
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_RATE_KEY)
    throw new HttpError(503, 'Admin login has not been configured.');
  const data = await readJson(request);
  if (!data || typeof data !== 'object')
    throw new HttpError(400, 'The submitted data is invalid.');
  const username = text(data.username, 'the username', 64),
    password = text(data.password, 'the password', 128);
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    (local(request, env) ? 'local' : 'unknown');
  const keys = [
    await digest(env.ADMIN_RATE_KEY + '|ip|' + ip),
    await digest(env.ADMIN_RATE_KEY + '|account'),
  ];
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const row = await env.DB.prepare(
      'SELECT * FROM login_attempts WHERE key = ?',
    )
      .bind(keys[i])
      .first();
    if (
      row &&
      now - row.window_start < WINDOW_MS &&
      row.attempts >= (i === 0 ? 5 : 40)
    )
      return json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        429,
        { 'Retry-After': '900' },
      );
  }
  await env.DB.batch(
    keys.map((key) =>
      env.DB.prepare(
        'INSERT INTO login_attempts (key, attempts, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN login_attempts.window_start < ? THEN 1 ELSE login_attempts.attempts + 1 END, window_start = CASE WHEN login_attempts.window_start < ? THEN excluded.window_start ELSE login_attempts.window_start END',
      ).bind(key, now, now - WINDOW_MS, now - WINDOW_MS),
    ),
  );
  const passwordOk = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
  const usernameOk = equal(
    await digest(username),
    await digest(env.ADMIN_USERNAME),
  );
  if (!passwordOk || !usernameOk)
    return json({ error: 'Invalid username or password.' }, 401);
  const token = random(),
    csrf = random(),
    expires = now + SESSION_MS;
  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(
      now,
    ),
    env.DB.prepare(
      'INSERT INTO admin_sessions (token_hash, csrf, credential_version, expires_at) VALUES (?, ?, ?, ?)',
    ).bind(
      await digest(token),
      csrf,
      await digest(env.ADMIN_PASSWORD_HASH),
      expires,
    ),
    env.DB.prepare('DELETE FROM login_attempts WHERE key = ?').bind(keys[0]),
  ]);
  return json({ username: env.ADMIN_USERNAME, csrf, expiresAt: expires }, 200, {
    'Set-Cookie': cookie(request, env, token),
  });
}
async function saveEvent(request, env, id) {
  await writeSession(request, env);
  const data = validateEvent(await readJson(request));
  for (const image of data.images) {
    if (TRUSTED_IMAGES.has(image.url)) continue;
    if (
      !(await env.DB.prepare('SELECT id FROM uploads WHERE id = ?')
        .bind(image.id)
        .first())
    )
      throw new HttpError(
        400,
        'An uploaded image could not be found. Please upload it again.',
      );
  }
  const now = Date.now();
  if (id) {
    if (!UUID.test(id)) throw new HttpError(404, 'Event not found.');
    const result = await env.DB.prepare(
      'UPDATE events SET title=?, hook=?, start_date=?, end_date=?, caption=?, images_json=?, status=?, updated_at=? WHERE id=?',
    )
      .bind(
        data.title,
        data.hook,
        data.startDate,
        data.endDate,
        data.caption,
        JSON.stringify(data.images),
        data.status,
        now,
        id,
      )
      .run();
    if (!result.meta.changes) throw new HttpError(404, 'Event not found.');
  } else {
    id = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO events (id,title,hook,start_date,end_date,caption,images_json,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    )
      .bind(
        id,
        data.title,
        data.hook,
        data.startDate,
        data.endDate,
        data.caption,
        JSON.stringify(data.images),
        data.status,
        now,
        now,
      )
      .run();
  }
  const row = await env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first();
  return json({ event: eventJson(row) }, id ? 200 : 201);
}
function imageRecord(row) {
  return {
    id: row.id,
    kind: row.kind,
    src: row.src,
    uploadId: row.upload_id,
    title: row.title,
    alt: row.alt,
    caption: row.caption,
    position: row.position,
    deleted: Boolean(row.deleted),
    updatedAt: row.updated_at,
  };
}
async function imageRecords(env, includeDeleted = false) {
  const rows = await env.DB.prepare(
    'SELECT * FROM site_images ' +
      (includeDeleted ? '' : 'WHERE deleted = 0 ') +
      'ORDER BY position ASC, id ASC',
  ).all();
  return rows.results.map(imageRecord);
}
async function saveSiteImage(request, env, id) {
  await writeSession(request, env);
  const data = await readJson(request);
  if (!data || typeof data !== 'object')
    throw new HttpError(400, 'Invalid image data.');
  let current = null;
  if (id) {
    current = await env.DB.prepare('SELECT * FROM site_images WHERE id = ?')
      .bind(id)
      .first();
    if (!current) throw new HttpError(404, 'Image not found.');
  }
  const kind = current?.kind || 'gallery';
  const title = text(data.title, 'the image title', 120),
    alt = text(data.alt, 'the alternative text', 300),
    caption = text(data.caption || '', 'the caption', 500, false);
  const position = Number(data.position);
  if (!Number.isInteger(position) || position < 0 || position > 10000)
    throw new HttpError(400, 'Choose a valid display order.');
  if (typeof data.deleted !== 'boolean')
    throw new HttpError(400, 'Invalid image status.');
  if (kind === 'general' && data.deleted)
    throw new HttpError(400, 'General images cannot be deleted.');
  let src = current?.src,
    uploadId = current?.upload_id || null;
  if (data.uploadId) {
    if (
      !UUID.test(data.uploadId) ||
      !(await env.DB.prepare('SELECT id FROM uploads WHERE id = ?')
        .bind(data.uploadId)
        .first())
    )
      throw new HttpError(400, 'Upload a valid image first.');
    uploadId = data.uploadId;
    src = '/media/' + uploadId;
  } else if (!current)
    throw new HttpError(400, 'Choose an image before saving.');
  else if (current.upload_id)
    throw new HttpError(400, 'The current image reference is invalid.');
  if (!src) throw new HttpError(400, 'Choose an image.');
  id = id || crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO site_images (id,kind,src,upload_id,title,alt,caption,position,deleted,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET src=excluded.src, upload_id=excluded.upload_id, title=excluded.title, alt=excluded.alt, caption=excluded.caption, position=excluded.position, deleted=excluded.deleted, updated_at=excluded.updated_at',
  )
    .bind(
      id,
      kind,
      src,
      uploadId,
      title,
      alt,
      caption,
      position,
      data.deleted ? 1 : 0,
      Date.now(),
    )
    .run();
  return json({
    image: imageRecord(
      await env.DB.prepare('SELECT * FROM site_images WHERE id = ?')
        .bind(id)
        .first(),
    ),
  });
}

export async function handleApi(request, env) {
  const url = new URL(request.url),
    path = url.pathname;
  try {
    if (!env.DB)
      throw new HttpError(503, 'The event service is temporarily unavailable.');
    if (path === '/api/content' && request.method === 'GET')
      return json({ images: await imageRecords(env) });
    if (path === '/api/admin/images' && request.method === 'GET') {
      await session(request, env);
      return json({ images: await imageRecords(env, true) });
    }
    if (path === '/api/admin/images' && request.method === 'POST')
      return await saveSiteImage(request, env);
    if (path.startsWith('/api/admin/images/') && request.method === 'PUT')
      return await saveSiteImage(
        request,
        env,
        decodeURIComponent(path.slice('/api/admin/images/'.length)),
      );
    if (path === '/api/admin/login' && request.method === 'POST')
      return await login(request, env);
    if (path === '/api/admin/session' && request.method === 'GET') {
      const current = await session(request, env);
      return json({
        username: env.ADMIN_USERNAME,
        csrf: current.csrf,
        expiresAt: current.expires_at,
      });
    }
    if (path === '/api/admin/logout' && request.method === 'POST') {
      const current = await writeSession(request, env);
      await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?')
        .bind(current.tokenHash)
        .run();
      return json({ ok: true }, 200, {
        'Set-Cookie': cookie(request, env, '', 0),
      });
    }
    if (path === '/api/events' && request.method === 'GET') {
      const rows = await env.DB.prepare(
        "SELECT * FROM events WHERE status = 'published' ORDER BY start_date DESC, created_at DESC LIMIT 100",
      ).all();
      return json({ events: rows.results.map(eventJson) });
    }
    if (path === '/api/admin/events' && request.method === 'GET') {
      await session(request, env);
      const rows = await env.DB.prepare(
        'SELECT * FROM events ORDER BY updated_at DESC LIMIT 100',
      ).all();
      return json({ events: rows.results.map(eventJson) });
    }
    if (path === '/api/admin/events' && request.method === 'POST')
      return await saveEvent(request, env);
    if (path.startsWith('/api/admin/events/') && request.method === 'PUT')
      return await saveEvent(request, env, path.split('/').at(-1));
    if (path === '/api/admin/uploads' && request.method === 'POST') {
      await writeSession(request, env);
      if (!env.BUCKET)
        throw new HttpError(503, 'Image storage is temporarily unavailable.');
      const recent = await env.DB.prepare(
        'SELECT COUNT(*) AS count FROM uploads WHERE created_at > ?',
      )
        .bind(Date.now() - 60000)
        .first();
      if (recent.count >= 18)
        throw new HttpError(
          429,
          'Please wait a minute before uploading more images.',
        );
      const bytes = await readBody(request, MAX_IMAGE);
      const mime = imageMime(bytes);
      const id = crypto.randomUUID(),
        objectKey = 'events/' + id;
      await env.BUCKET.put(objectKey, bytes, {
        httpMetadata: { contentType: mime },
      });
      try {
        await env.DB.prepare(
          'INSERT INTO uploads (id, object_key, mime, size, created_at) VALUES (?, ?, ?, ?, ?)',
        )
          .bind(id, objectKey, mime, bytes.length, Date.now())
          .run();
      } catch (error) {
        await env.BUCKET.delete(objectKey);
        throw error;
      }
      return json({ image: { id, url: '/media/' + id, caption: '' } }, 201);
    }
    return json({ error: 'Endpoint not found.' }, 404);
  } catch (error) {
    if (error instanceof HttpError)
      return json({ error: error.message }, error.status);
    console.error('Admin API failure', path, error.name);
    return json(
      { error: 'The request could not be completed. Please try again.' },
      500,
    );
  }
}
export async function handleMedia(request, env) {
  const id = new URL(request.url).pathname.slice('/media/'.length);
  if (!UUID.test(id) || !['GET', 'HEAD'].includes(request.method))
    return new Response('Not found', { status: 404 });
  const upload = await env.DB.prepare('SELECT * FROM uploads WHERE id = ?')
    .bind(id)
    .first();
  if (!upload) return new Response('Not found', { status: 404 });
  const published = await env.DB.prepare(
    "SELECT id FROM events WHERE status = 'published' AND images_json LIKE ? LIMIT 1",
  )
    .bind('%' + id + '%')
    .first();
  const imagePublished = await env.DB.prepare(
    'SELECT id FROM site_images WHERE upload_id = ? AND deleted = 0 LIMIT 1',
  )
    .bind(id)
    .first();
  if (!published && !imagePublished) {
    try {
      await session(request, env);
    } catch {
      return new Response('Not found', { status: 404 });
    }
  }
  const object = await env.BUCKET.get(upload.object_key);
  if (!object) return new Response('Not found', { status: 404 });
  return new Response(request.method === 'HEAD' ? null : object.body, {
    headers: {
      'Content-Type': upload.mime,
      'Content-Length': String(upload.size),
      'Cache-Control':
        published || imagePublished
          ? 'public, max-age=3600'
          : 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });
}
