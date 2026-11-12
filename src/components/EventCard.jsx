import { whatsappUrl } from '../data/site.js';
export function dateRange(event) {
  if (
    !event.startDate ||
    Number.isNaN(new Date(event.startDate + 'T00:00:00Z').getTime())
  )
    return 'Tanggal event';
  const format = (value) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(value + 'T00:00:00Z'));
  return (
    format(event.startDate) +
    (event.endDate && event.endDate !== event.startDate
      ? ' — ' + format(event.endDate)
      : '')
  );
}
export default function EventCard({ event, preview = false }) {
  return (
    <article className="managed-event">
      {event.images?.[0]?.url ? (
        <img
          className="managed-event-cover"
          src={event.images[0].url}
          alt={event.images[0].caption || event.title || 'Event Purissa'}
        />
      ) : (
        <div className="managed-event-placeholder">
          Gambar event akan tampil di sini
        </div>
      )}
      <div className="managed-event-content">
        <div className="eyebrow">EVENT PURISSA · {dateRange(event)}</div>
        <h2>{event.title || 'Judul event Anda'}</h2>
        <p className="managed-event-hook">
          {event.hook || 'Tulis hook untuk mengundang perhatian.'}
        </p>
        <p className="managed-event-caption">
          {event.caption ||
            'Cerita dan informasi lengkap event akan tampil di sini.'}
        </p>
        {event.images?.[0]?.caption && (
          <p className="image-note">{event.images[0].caption}</p>
        )}
        {event.images?.length > 1 && (
          <div className="managed-event-gallery">
            {event.images.slice(1).map((image) => (
              <figure key={image.id}>
                <img src={image.url} alt={image.caption || event.title} />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        {preview ? (
          <span className="button gold">Booking via WhatsApp ↗</span>
        ) : (
          <a className="button gold" href={whatsappUrl}>
            Booking via WhatsApp ↗
          </a>
        )}
      </div>
    </article>
  );
}
