import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contact, whatsappUrl } from '../data/site.js';
import { BrandIcon, MailIcon } from './Shared.jsx';
export default function SocialsPage() {
  const [status, setStatus] = useState('');
  const [copyFailed, setCopyFailed] = useState(false);
  async function handleMessage(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject')).trim();
    const body = `Nama: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\nTelepon: ${String(data.get('phone')).trim() || '—'}\n\n${String(data.get('message')).trim()}`;
    if (event.nativeEvent.submitter?.value === 'send' && contact.email) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus(
        'Draf dibuka di aplikasi email Anda. Pesan belum dikirim dari situs ini.',
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(subject + '\n\n' + body);
      setCopyFailed(false);
      setStatus(
        'Draf pesan disalin. Pesan belum dikirim; Anda dapat menempelkannya di WhatsApp.',
      );
    } catch {
      setCopyFailed(true);
      setStatus(
        'Tidak dapat menyalin otomatis. Anda dapat memilih dan menyalin isi pesan secara manual.',
      );
    }
  }
  return (
    <>
      <section className="socials-intro section">
        <div className="socials-intro-copy">
          <div className="eyebrow">SOCIALS & KONTAK PURISSA</div>
          <h1>
            Mari terhubung.
            <br />
            <em>Mulai percakapan.</em>
          </h1>
          <p>
            Punya pertanyaan tentang Sak Yant, blessing, atau event? Ceritakan
            kepada kami. Pilih kanal yang paling nyaman untuk Anda.
          </p>
          <Link className="text-link" to="#email">
            Tulis pesan <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="social-channels">
          <a className="social-channel whatsapp-channel" href={whatsappUrl}>
            <BrandIcon name="WhatsApp" />
            <div>
              <span className="channel-eyebrow">BOOKING & KONSULTASI</span>
              <h2>WhatsApp</h2>
              <p>+62 899 177 8888</p>
            </div>
            <span className="channel-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          {contact.socialProfiles.map((profile) => (
            <a
              className="social-channel"
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                profile.name +
                ' resmi Purissa ' +
                profile.handle +
                ' (buka tab baru)'
              }
            >
              <BrandIcon name={profile.name} />
              <div>
                <span className="channel-eyebrow">AKUN RESMI PURISSA</span>
                <h2>{profile.name}</h2>
                <p>{profile.handle}</p>
              </div>
              <span className="channel-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="email-section section" id="email">
        <div className="email-intro">
          <div className="eyebrow">PESAN UNTUK PURISSA</div>
          <h2>
            Ceritakan
            <br />
            <em>rencana Anda.</em>
          </h2>
          <p>
            Mulai dari ide desain, pertanyaan tentang blessing, hingga rencana
            mengikuti event. Tuliskan pesan Anda di sini.
          </p>
          <div className="email-availability" id="email-availability">
            <MailIcon />
            <div>
              <strong>
                {contact.email ? 'Email Purissa' : 'Email segera tersedia'}
              </strong>
              <p>
                {contact.email
                  ? contact.email
                  : 'Alamat email belum tersedia. Formulir ini belum dapat mengirim pesan. Anda dapat menyalin draf dan menghubungi kami melalui WhatsApp.'}
              </p>
            </div>
          </div>
          <a className="text-link" href={whatsappUrl}>
            Hubungi lewat WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
        <form
          className="email-form"
          onSubmit={handleMessage}
          aria-labelledby="email-form-title"
          aria-describedby="email-availability"
        >
          <div className="email-form-heading">
            <MailIcon />
            <h3 id="email-form-title">Pesan baru</h3>
            <span>{contact.email ? 'Siap ditulis' : 'Draf pesan'}</span>
          </div>
          <div className="email-form-fields">
            <div className="form-two-columns">
              <label htmlFor="contact-name">
                Nama <span aria-hidden="true">*</span>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Nama Anda"
                  required
                  maxLength="100"
                />
              </label>
              <label htmlFor="contact-email">
                Email Anda <span aria-hidden="true">*</span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  required
                  maxLength="254"
                />
              </label>
            </div>
            <label htmlFor="contact-phone">
              Nomor telepon <span className="field-optional">opsional</span>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+62"
                maxLength="30"
              />
            </label>
            <label htmlFor="contact-subject">
              Subjek <span aria-hidden="true">*</span>
              <select
                id="contact-subject"
                name="subject"
                defaultValue="Booking Sak Yant"
                required
              >
                <option>Booking Sak Yant</option>
                <option>Konsultasi desain</option>
                <option>Blessing tanpa tato</option>
                <option>Informasi event</option>
                <option>Pertanyaan lainnya</option>
              </select>
            </label>
            <label htmlFor="contact-message">
              Pesan <span aria-hidden="true">*</span>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Ceritakan ide atau pertanyaan Anda…"
                rows="7"
                required
                maxLength="5000"
              />
            </label>
            <div className="email-form-actions">
              <button
                className="button gold"
                type="submit"
                name="action"
                value="copy"
              >
                Salin draf <span aria-hidden="true">↗</span>
              </button>
              <button
                className="button send-email"
                type="submit"
                name="action"
                value="send"
                disabled={!contact.email}
              >
                {contact.email
                  ? 'Buka di aplikasi email'
                  : 'Kirim email · Segera tersedia'}
              </button>
            </div>
            <p className="form-status" role="status">
              {status || 'Draf tidak disimpan atau dikirim otomatis.'}
            </p>
            {copyFailed && (
              <p className="form-copy-help">
                Pilih teks di kolom pesan lalu salin secara manual.
              </p>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
