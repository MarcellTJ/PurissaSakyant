import { useContent } from '../content.jsx';
import legacyEvent from '../data/legacyEvent.json';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navigation, whatsappUrl, eventList, contact } from '../data/site.js';
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header>
        <Link
          className="brand"
          to="/"
          aria-label="Purissa beranda"
          onClick={() => setOpen(false)}
        >
          <img
            className="logo"
            src="/assets/brand/purissa-logo.jpg"
            alt="Purissa Sakyant"
            width="190"
            height="76"
          />
        </Link>
        <nav className={open ? 'open' : ''} aria-label="Navigasi utama">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a className="nav-cta" href={whatsappUrl}>
          Booking WhatsApp <span>↗</span>
        </a>
        <button
          className="menu"
          aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="brand" to="/" aria-label="Purissa beranda">
          <img
            className="logo"
            src="/assets/brand/purissa-logo.jpg"
            alt="Purissa Sakyant"
            width="160"
            height="70"
          />
        </Link>
        <nav className="footer-navigation" aria-label="Navigasi footer">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div
          className="footer-socials"
          role="group"
          aria-label="Media sosial resmi Purissa"
        >
          {contact.socialProfiles.map((profile) => (
            <a
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={profile.name + ' resmi Purissa (buka tab baru)'}
            >
              <BrandIcon name={profile.name} />
              <span>{profile.name}</span>
              <span className="footer-external" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Purissa Sakyant</span>
        <span>Jakarta Barat, Indonesia</span>
      </div>
    </footer>
  );
}
export function Booking() {
  return (
    <section className="booking" id="booking">
      <div className="eyebrow">YOUR JOURNEY STARTS HERE</div>
      <h2>
        Make it <em>meaningful.</em>
      </h2>
      <p>
        Sebuah percakapan adalah langkah pertama.
        <br />
        Mari temukan karya yang berarti untuk Anda.
      </p>
      <div className="booking-actions">
        <a className="button gold" href={whatsappUrl}>
          <BrandIcon name="WhatsApp" />
          Booking via WhatsApp <span aria-hidden="true">↗</span>
        </a>
        <Link className="button email-booking" to="/socials#email">
          <MailIcon />
          Booking via Email <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {!contact.email && (
        <p className="booking-email-note">
          Pengiriman email segera tersedia. Untuk booking saat ini, hubungi
          WhatsApp.
        </p>
      )}
      <small>JAKARTA BARAT · +62 899 177 8888</small>
    </section>
  );
}
export function BrandIcon({ name }) {
  const file = {
    Instagram: 'instagram',
    TikTok: 'tiktok',
    WhatsApp: 'whatsapp',
  }[name];
  return (
    <img
      className={'brand-icon brand-icon-' + file}
      src={'/assets/social/' + file + '.svg'}
      alt=""
      aria-hidden="true"
      width="28"
      height="28"
    />
  );
}
export function MailIcon() {
  return (
    <svg
      className="mail-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
export function Marquee() {
  const [paused, setPaused] = useState(false);
  const items = [
    'Sak Yant & Blessing Saney',
    'Jakarta Barat',
    'Teknik Handpoke',
    'Konsultasi Desain',
    'Seni Sakral Thailand',
    'Purissa Sakyant',
  ];
  return (
    <section
      className={'marquee-strip' + (paused ? ' is-paused' : '')}
      aria-label="Purissa Sakyant highlights"
    >
      <div className="marquee-window">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="marquee-row"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {items.map((item) => (
                <li key={item}>
                  {item}
                  <span aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        className="marquee-pause"
        aria-label={paused ? 'Putar teks berjalan' : 'Jeda teks berjalan'}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? '▶' : 'Ⅱ'}
      </button>
    </section>
  );
}
export function EventList() {
  const { events } = useContent();
  const legacy = events.find((event) => event.id === legacyEvent.id);
  const listed = eventList
    .filter((item) => item.id !== '2025' || legacy)
    .map((item) =>
      item.id === '2025' && legacy?.updatedAt
        ? {
            ...item,
            title: legacy.title,
            description: legacy.hook,
            eyebrow: legacy.startDate,
            date: legacy.endDate,
          }
        : item,
    );
  return (
    <section className="home-events section" id="events">
      <div className="section-top">
        <div>
          <div className="eyebrow">EVENT PURISSA</div>
          <h2>
            Pertemuan yang
            <br />
            <em>membawa cerita.</em>
          </h2>
        </div>
        <Link className="text-link" to="/events">
          Semua informasi event <span>↗</span>
        </Link>
      </div>
      <div className="event-list">
        {listed.map((event) => (
          <Link className="event-list-row" key={event.id} to={event.to}>
            <div className="event-list-date">
              <span>{event.eyebrow}</span>
              <strong>{event.date}</strong>
            </div>
            <div className="event-list-detail">
              <span className={'event-tag' + (event.past ? ' past' : '')}>
                {event.status}
              </span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
            <span className="event-row-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function Lightbox({ image, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (image) dialog.current.showModal();
    else dialog.current.close();
  }, [image]);
  return (
    <dialog
      ref={dialog}
      id="lightbox"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label="Detail karya Purissa"
    >
      <button className="close" aria-label="Tutup foto" onClick={onClose}>
        ×
      </button>
      {image && (
        <>
          <img src={image.src} alt={image.alt} />
          {(image.title || image.caption) && (
            <div className="lightbox-caption">
              <strong>{image.title}</strong>
              {image.caption && <p>{image.caption}</p>}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
