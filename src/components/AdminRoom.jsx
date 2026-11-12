import { api, prepareImage } from '../adminApi.js';
import ImageManager from './ImageManager.jsx';
import { contentSaved } from '../content.jsx';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard.jsx';
import '../admin.css';
const blank = () => ({
  title: '',
  hook: '',
  startDate: '',
  endDate: '',
  caption: '',
  images: [],
  status: 'draft',
});
export default function AdminRoom() {
  const [session, setSession] = useState(undefined),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [draft, setDraft] = useState(blank),
    [events, setEvents] = useState([]),
    [notice, setNotice] = useState(''),
    [uploading, setUploading] = useState(false),
    [mobile, setMobile] = useState(false),
    [dirty, setDirty] = useState(false),
    [mode, setMode] = useState('add'),
    [imageDirty, setImageDirty] = useState(false);
  const preview = useDeferredValue(draft),
    urls = useRef(new Set());
  useEffect(() => {
    document.title = 'Admin Room — Purissa';
    api('session')
      .then(setSession)
      .catch(() => setSession(null));
    return () => {
      urls.current.forEach(URL.revokeObjectURL);
    };
  }, []);
  useEffect(() => {
    if (session)
      api('events')
        .then((data) => setEvents(data.events))
        .catch((e) => setError(e.message));
  }, [session]);
  useEffect(() => {
    if (!dirty && !imageDirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, imageDirty]);
  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setNotice('');
  }
  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      setSession(
        await api('login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.get('username'),
            password: data.get('password'),
          }),
        }),
      );
      event.target.reset();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api('logout', {
        method: 'POST',
        headers: { 'X-CSRF-Token': session.csrf },
      });
      setSession(null);
      setDraft(blank());
      setDirty(false);
    } catch (e) {
      setError(e.message);
    }
  }
  async function upload(event) {
    const files = [...event.target.files];
    event.target.value = '';
    if (files.length + draft.images.length > 6) {
      setError('Maksimal enam gambar per event.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const blob = await prepareImage(file);
        const url = URL.createObjectURL(blob);
        urls.current.add(url);
        const temporary = crypto.randomUUID();
        setDraft((current) => ({
          ...current,
          images: [
            ...current.images,
            { id: temporary, url, caption: '', pending: true },
          ],
        }));
        try {
          const data = await api('uploads', {
            method: 'POST',
            headers: {
              'X-CSRF-Token': session.csrf,
              'Content-Type': 'image/webp',
            },
            body: blob,
          });
          setDraft((current) => ({
            ...current,
            images: current.images.map((image) =>
              image.id === temporary ? data.image : image,
            ),
          }));
          setDirty(true);
        } catch (e) {
          setDraft((current) => ({
            ...current,
            images: current.images.filter((image) => image.id !== temporary),
          }));
          throw e;
        } finally {
          URL.revokeObjectURL(url);
          urls.current.delete(url);
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }
  async function save(status) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const data = await api('events' + (draft.id ? '/' + draft.id : ''), {
        method: draft.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': session.csrf,
        },
        body: JSON.stringify({ ...draft, status }),
      });
      setDraft(data.event);
      contentSaved();
      setDirty(false);
      setEvents((current) => [
        data.event,
        ...current.filter((event) => event.id !== data.event.id),
      ]);
      setNotice(
        status === 'published'
          ? 'Event telah dipublikasikan di Beranda dan tab Event.'
          : 'Draft tersimpan. Belum tampil di halaman publik.',
      );
    } catch (e) {
      setError(e.message);
      if (e.status === 401) setSession(null);
    } finally {
      setBusy(false);
    }
  }
  function select(event) {
    if (dirty && !window.confirm('Tinggalkan perubahan yang belum disimpan?'))
      return;
    setMode(event.id ? 'edit' : 'add');
    setDraft(event);
    setDirty(false);
    setError('');
    setNotice('');
  }
  function navigateMode(next) {
    if (
      (dirty || imageDirty) &&
      !window.confirm('Tinggalkan perubahan yang belum disimpan?')
    )
      return;
    setDirty(false);
    setImageDirty(false);
    setError('');
    setNotice('');
    setMode(next);
    if (next === 'add') setDraft(blank());
    if (next === 'edit') setDraft(events[0] || blank());
  }
  if (session === undefined)
    return <main className="admin-loading">Membuka Admin Room…</main>;
  if (!session)
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <img src="/assets/brand/purissa-logo.jpg" alt="Purissa" />
          <div className="eyebrow">PRIVATE WORKSPACE</div>
          <h1>Admin Room</h1>
          <p>Masuk untuk mengelola event Purissa.</p>
          <form onSubmit={login}>
            <label>
              Username
              <input
                name="username"
                autoComplete="username"
                required
                maxLength="64"
                autoCapitalize="none"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength="128"
              />
            </label>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <button className="button gold" disabled={busy}>
              {busy ? 'Memeriksa…' : 'Masuk →'}
            </button>
          </form>
          <Link to="/">← Kembali ke website</Link>
        </div>
      </main>
    );
  return (
    <main className="admin-room">
      <aside className="admin-sidebar">
        <img src="/assets/brand/purissa-logo.jpg" alt="Purissa" />
        <span className="eyebrow">ADMIN WORKSPACE</span>
        <h2>Dashboard</h2>
        <nav className="admin-menu" aria-label="Admin menu">
          {[
            ['add', '＋ Add Events'],
            ['edit', '✎ Edit Events'],
            ['images', '▧ Edit Images'],
          ].map(([key, label]) => (
            <button
              key={key}
              className="admin-tab"
              aria-current={mode === key ? 'page' : undefined}
              disabled={busy || uploading}
              onClick={() => navigateMode(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-side-bottom">
          <span>{session.username}</span>
          <Link to="/events">Lihat website ↗</Link>
          <button onClick={logout}>Keluar</button>
        </div>
      </aside>
      <div className="admin-workspace">
        {mode === 'images' ? (
          <ImageManager
            session={session}
            onDirtyChange={setImageDirty}
            onEvents={() => navigateMode('edit')}
          />
        ) : (
          <>
            <div className="admin-heading">
              <div>
                <div className="eyebrow">EVENT MANAGEMENT</div>
                <h1>{mode === 'edit' ? 'Edit Events' : 'Add Events'}</h1>
                <p>Susun cerita Anda. Lihat hasilnya, lalu publikasikan.</p>
              </div>
              <span className="admin-status">
                {dirty
                  ? 'Perubahan belum disimpan'
                  : draft.status === 'published'
                    ? 'Published'
                    : 'Draft'}
              </span>
            </div>
            {mode === 'edit' && (
              <div className="admin-event-picker">
                <label>
                  Pilih event
                  <select
                    value={draft.id || ''}
                    onChange={(e) => {
                      const event = events.find(
                        (item) => item.id === e.target.value,
                      );
                      if (event) select(event);
                    }}
                  >
                    <option value="" disabled>
                      Pilih event untuk diedit
                    </option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} ·{' '}
                        {event.status === 'published' ? 'Published' : 'Draft'}
                      </option>
                    ))}
                  </select>
                </label>
                {!events.length && (
                  <p>Belum ada event. Gunakan Add Events untuk memulai.</p>
                )}
              </div>
            )}
            {(mode === 'add' || draft.id) && (
              <div className="admin-editor-grid">
                <section className="admin-editor">
                  <h2>Detail event</h2>
                  <label>
                    Judul event
                    <input
                      value={draft.title}
                      onChange={(e) => update('title', e.target.value)}
                      maxLength="120"
                      placeholder="Nama pertemuan atau event"
                      required
                    />
                  </label>
                  <label>
                    Hook
                    <textarea
                      value={draft.hook}
                      onChange={(e) => update('hook', e.target.value)}
                      maxLength="240"
                      rows="2"
                      placeholder="Kalimat singkat yang menarik perhatian"
                      required
                    />
                  </label>
                  <div className="admin-date-fields">
                    <label>
                      Tanggal mulai
                      <input
                        type="date"
                        value={draft.startDate}
                        onChange={(e) => update('startDate', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Tanggal selesai
                      <input
                        type="date"
                        min={draft.startDate}
                        value={draft.endDate}
                        onChange={(e) => update('endDate', e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Caption / informasi event
                    <textarea
                      value={draft.caption}
                      onChange={(e) => update('caption', e.target.value)}
                      maxLength="5000"
                      rows="6"
                      placeholder="Ceritakan detail, lokasi, dan informasi yang perlu diketahui peserta…"
                      required
                    />
                  </label>
                  <div className="admin-upload-heading">
                    <h3>Gambar event</h3>
                    <span>{draft.images.length}/6</span>
                  </div>
                  <label className="admin-upload">
                    {uploading ? 'Mengunggah gambar…' : '＋ Pilih gambar'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      disabled={uploading || draft.images.length >= 6}
                      onChange={upload}
                    />
                    <small>
                      JPG, PNG, WebP · maksimal 5 MB / gambar. Gambar pertama
                      menjadi cover.
                    </small>
                  </label>
                  <div className="admin-image-list">
                    {draft.images.map((image, index) => (
                      <div className="admin-image-row" key={image.id}>
                        <img src={image.url} alt={'Gambar ' + (index + 1)} />
                        <label>
                          {index === 0 ? 'Cover' : 'Gambar ' + (index + 1)}
                          <input
                            aria-label={'Caption gambar ' + (index + 1)}
                            value={image.caption}
                            maxLength="300"
                            placeholder="Caption gambar (opsional)"
                            onChange={(e) =>
                              update(
                                'images',
                                draft.images.map((item) =>
                                  item.id === image.id
                                    ? { ...item, caption: e.target.value }
                                    : item,
                                ),
                              )
                            }
                          />
                        </label>
                        <button
                          disabled={uploading}
                          onClick={() =>
                            update(
                              'images',
                              draft.images.filter(
                                (item) => item.id !== image.id,
                              ),
                            )
                          }
                          aria-label={'Hapus gambar ' + (index + 1)}
                        >
                          ×
                        </button>
                        {index > 0 && (
                          <button
                            disabled={uploading}
                            onClick={() =>
                              update('images', [
                                image,
                                ...draft.images.filter(
                                  (item) => item.id !== image.id,
                                ),
                              ])
                            }
                          >
                            Jadikan cover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {error && (
                    <p role="alert" className="admin-error">
                      {error}
                    </p>
                  )}
                  {notice && (
                    <p role="status" className="admin-success">
                      {notice}
                    </p>
                  )}
                  <div className="admin-actions">
                    <button
                      className="button"
                      disabled={busy || uploading}
                      onClick={() => save('draft')}
                    >
                      {busy ? 'Menyimpan…' : 'Simpan draft'}
                    </button>
                    <button
                      className="button gold"
                      disabled={busy || uploading}
                      onClick={() => save('published')}
                    >
                      {draft.status === 'published'
                        ? 'Perbarui event'
                        : 'Publikasikan ↗'}
                    </button>
                  </div>
                  <small>
                    Draft hanya terlihat oleh admin. Publikasi menampilkan event
                    di website.
                  </small>
                </section>
                <section className="admin-preview">
                  <div className="admin-preview-toolbar">
                    <div>
                      <span className="eyebrow">LIVE PREVIEW</span>
                      <p>Berubah mengikuti setiap input.</p>
                    </div>
                    <div>
                      <button
                        aria-pressed={!mobile}
                        onClick={() => setMobile(false)}
                      >
                        Desktop
                      </button>
                      <button
                        aria-pressed={mobile}
                        onClick={() => setMobile(true)}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>
                  <div
                    className={
                      'admin-preview-frame' + (mobile ? ' mobile' : '')
                    }
                  >
                    <EventCard event={preview} preview />
                  </div>
                </section>
              </div>
            )}
            <section className="admin-saved">
              <div className="admin-heading">
                <h2>Event tersimpan</h2>
                <button className="button" onClick={() => select(blank())}>
                  ＋ Event baru
                </button>
              </div>
              {!events.length ? (
                <p>Belum ada event. Draft pertama Anda akan muncul di sini.</p>
              ) : (
                events.map((event) => (
                  <button
                    className="admin-saved-row"
                    key={event.id}
                    onClick={() => select(event)}
                  >
                    <span>
                      <strong>{event.title}</strong>
                      <small>
                        {event.startDate} — {event.endDate}
                      </small>
                    </span>
                    <span>
                      {event.status === 'published' ? 'Published' : 'Draft'} →
                    </span>
                  </button>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
