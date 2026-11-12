import { useDeferredValue, useEffect, useState } from 'react';
import { api, prepareImage } from '../adminApi.js';
import { contentSaved } from '../content.jsx';
import { HomeIntro, Philosophy } from './Sections.jsx';
const newImage = (position) => ({
  title: '',
  alt: '',
  caption: '',
  position,
  src: '',
  uploadId: null,
  deleted: false,
  kind: 'gallery',
});
export default function ImageManager({ session, onDirtyChange, onEvents }) {
  const [menu, setMenu] = useState('menu'),
    [images, setImages] = useState([]),
    [draft, setDraft] = useState(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [removed, setRemoved] = useState(false);
  const preview = useDeferredValue(draft);
  useEffect(() => {
    let active = true;
    api('images')
      .then((data) => {
        if (active) setImages(data.images);
      })
      .catch((e) => setError(e.message));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);
  function leave() {
    return (
      !dirty ||
      window.confirm('Tinggalkan perubahan gambar yang belum disimpan?')
    );
  }
  function open(next, image = null) {
    if (!leave()) return;
    setMenu(next);
    setDraft(image ? { ...image } : null);
    setDirty(false);
    setError('');
    setNotice('');
  }
  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setNotice('');
  }
  async function replace(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const blob = await prepareImage(file);
      const url = URL.createObjectURL(blob);
      setDraft((current) => ({ ...current, src: url }));
      try {
        const data = await api('uploads', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/webp',
            'X-CSRF-Token': session.csrf,
          },
          body: blob,
        });
        setDraft((current) => ({
          ...current,
          src: data.image.url,
          uploadId: data.image.id,
        }));
        setDirty(true);
      } catch (e) {
        setDraft((current) => ({ ...current, src: draft.src }));
        throw e;
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const data = await api(
        'images' + (draft.id ? '/' + encodeURIComponent(draft.id) : ''),
        {
          method: draft.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': session.csrf,
          },
          body: JSON.stringify(draft),
        },
      );
      setDraft(data.image);
      setImages((current) =>
        [
          ...current.filter((image) => image.id !== data.image.id),
          data.image,
        ].sort((a, b) => a.position - b.position),
      );
      setDirty(false);
      contentSaved();
      setNotice(
        data.image.deleted
          ? 'Gambar dihapus dari galeri. Anda dapat memulihkannya dari gambar yang dihapus.'
          : 'Perubahan gambar tersimpan dan tampil di website.',
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const gallery = images.filter((image) => image.kind === 'gallery'),
    general = images.filter((image) => image.kind === 'general');
  const messages = (
    <>
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
    </>
  );
  if (menu === 'menu')
    return (
      <>
        <div className="admin-heading">
          <div>
            <div className="eyebrow">MEDIA LIBRARY</div>
            <h1>Edit Images</h1>
            <p>Pilih bagian website yang ingin Anda perbarui.</p>
          </div>
        </div>
        {messages}
        <div className="admin-image-menu">
          {[
            [
              'general',
              '01',
              'Edit General Images',
              'Beranda dan Sak Yant & Blessing.',
            ],
            [
              'gallery',
              '02',
              'Edit Gallery Images',
              'Lihat, edit, tambah, dan hapus karya galeri.',
            ],
            [
              'events',
              '03',
              'Edit Event Images',
              'Kelola gambar melalui editor event.',
            ],
          ].map(([key, number, title, description]) => (
            <button
              key={key}
              disabled={busy || uploading || !images.length}
              onClick={() =>
                key === 'events'
                  ? onEvents()
                  : open(key, key === 'general' ? general[0] : null)
              }
            >
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
              <b>→</b>
            </button>
          ))}
        </div>
      </>
    );
  if (menu === 'gallery')
    return (
      <>
        <button className="admin-back" onClick={() => open('menu')}>
          ← Edit Images
        </button>
        <div className="admin-heading">
          <div>
            <div className="eyebrow">MEDIA LIBRARY / GALLERY</div>
            <h1>Gallery Images</h1>
            <p>Klik gambar untuk membuka layar edit dan live preview.</p>
          </div>
          <button
            className="button gold"
            onClick={() =>
              open(
                'gallery-edit',
                newImage(
                  Math.max(-1, ...gallery.map((image) => image.position)) + 1,
                ),
              )
            }
          >
            ＋ Tambah gambar
          </button>
        </div>
        <label className="admin-show-removed">
          <input
            type="checkbox"
            checked={removed}
            onChange={(e) => setRemoved(e.target.checked)}
          />{' '}
          Tampilkan gambar yang dihapus
        </label>
        {messages}
        <div className="admin-media-grid">
          {gallery
            .filter((image) => removed || !image.deleted)
            .map((image) => (
              <button
                key={image.id}
                onClick={() => open('gallery-edit', image)}
                className={image.deleted ? 'removed' : ''}
              >
                <img src={image.src} alt={image.alt} />
                <span>
                  <strong>{image.title}</strong>
                  <small>
                    {image.deleted
                      ? 'Dihapus · klik untuk pulihkan'
                      : 'Urutan ' + (image.position + 1) + ' · Edit gambar ↗'}
                  </small>
                </span>
              </button>
            ))}
        </div>
        {!gallery.filter((image) => removed || !image.deleted).length && (
          <p>Belum ada gambar di galeri ini.</p>
        )}
      </>
    );
  return (
    <>
      <button
        className="admin-back"
        disabled={busy || uploading}
        onClick={() => open(menu === 'general' ? 'menu' : 'gallery')}
      >
        ← {menu === 'general' ? 'Edit Images' : 'Gallery Images'}
      </button>
      <div className="admin-heading">
        <div>
          <div className="eyebrow">
            MEDIA LIBRARY / {menu === 'general' ? 'GENERAL' : 'GALLERY'}
          </div>
          <h1>
            {menu === 'general'
              ? 'General Images'
              : draft?.id
                ? 'Edit Gallery Image'
                : 'Add Gallery Image'}
          </h1>
          <p>
            Preview bersifat pribadi. Website berubah hanya setelah disimpan.
          </p>
        </div>
        <span className="admin-status">
          {dirty ? 'Belum disimpan' : 'Tersimpan'}
        </span>
      </div>
      {menu === 'general' && (
        <div className="admin-event-picker">
          <label>
            Pilih bagian
            <select
              value={draft?.id || ''}
              disabled={busy || uploading}
              onChange={(e) =>
                open(
                  'general',
                  general.find((image) => image.id === e.target.value),
                )
              }
            >
              {general.map((image) => (
                <option key={image.id} value={image.id}>
                  {image.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {draft && preview ? (
        <div className="admin-editor-grid image-editor-grid">
          <form className="admin-editor" onSubmit={save}>
            <h2>Detail gambar</h2>
            <label>
              Judul / nama gambar
              <input
                required
                maxLength="120"
                value={draft.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </label>
            <label>
              Teks alternatif (alt)
              <textarea
                required
                maxLength="300"
                rows="2"
                value={draft.alt}
                onChange={(e) => update('alt', e.target.value)}
              />
              <small>Deskripsi gambar untuk aksesibilitas.</small>
            </label>
            <label>
              Caption
              <textarea
                maxLength="500"
                rows="3"
                value={draft.caption}
                onChange={(e) => update('caption', e.target.value)}
              />
            </label>
            {menu !== 'general' && (
              <label>
                Urutan tampilan
                <input
                  type="number"
                  min="1"
                  max="10001"
                  required
                  value={draft.position + 1}
                  onChange={(e) =>
                    update('position', Number(e.target.value) - 1)
                  }
                />
              </label>
            )}
            <label className="admin-upload">
              {uploading
                ? 'Mengunggah…'
                : draft.src
                  ? 'Ganti gambar / Replace image'
                  : 'Pilih gambar'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy || uploading}
                onChange={replace}
              />
              <small>
                JPG, PNG, WebP · maksimal 5 MB. Belum tampil publik sampai
                disimpan.
              </small>
            </label>
            {menu !== 'general' && (
              <button
                type="button"
                className={draft.deleted ? 'button' : 'button admin-delete'}
                disabled={busy || uploading}
                onClick={() => update('deleted', !draft.deleted)}
              >
                {draft.deleted ? '↶ Pulihkan gambar' : 'Hapus dari galeri'}
              </button>
            )}
            {messages}
            <div className="admin-actions">
              <button
                className="button gold"
                disabled={busy || uploading || !dirty}
              >
                {busy ? 'Menyimpan…' : 'Simpan perubahan'}
              </button>
              <button
                type="button"
                className="button"
                disabled={busy || uploading || !dirty}
                onClick={() => {
                  const original = images.find(
                    (image) => image.id === draft.id,
                  );
                  if (original) {
                    setDraft({ ...original });
                    setDirty(false);
                    setNotice('Perubahan dibatalkan.');
                  } else open('gallery');
                }}
              >
                Batalkan
              </button>
            </div>
          </form>
          <section className="admin-preview">
            <div className="admin-preview-toolbar">
              <div>
                <div className="eyebrow">LIVE PREVIEW</div>
                <p>Hanya preview · belum mengubah website.</p>
              </div>
            </div>
            {menu === 'general' ? (
              <div
                className="admin-section-preview"
                onClickCapture={(e) => e.preventDefault()}
              >
                {draft.id === 'home-intro' ? (
                  <HomeIntro imageOverride={preview} />
                ) : (
                  <Philosophy imageOverride={preview} />
                )}
              </div>
            ) : (
              <div
                className={
                  'admin-gallery-preview' +
                  (preview.deleted ? ' is-deleted' : '')
                }
              >
                {preview.deleted && (
                  <div className="admin-delete-preview">
                    Gambar akan dihapus dari galeri saat Anda menyimpan.
                  </div>
                )}
                {preview.src ? (
                  <img
                    src={preview.src}
                    alt={preview.alt || 'Preview gambar'}
                  />
                ) : (
                  <div className="managed-event-placeholder">
                    Pilih gambar untuk melihat preview.
                  </div>
                )}
                <div>
                  <span className="eyebrow">PURISSA COLLECTION</span>
                  <h2>{preview.title || 'Judul gambar'}</h2>
                  <p>{preview.caption || 'Caption gambar'}</p>
                  <small>Alt: {preview.alt || 'Deskripsi gambar'}</small>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <p>Memuat gambar…</p>
      )}
    </>
  );
}
