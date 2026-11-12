import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarousel } from '../hooks.js';
import { Lightbox } from './Shared.jsx';
import { useContent } from '../content.jsx';
import legacyEvent from '../data/legacyEvent.json';
import { dateRange } from './EventCard.jsx';
import originalSlides from '../data/eventSlides.json';
import { whatsappUrl } from '../data/site.js';
function Controls({ state, count, kind }) {
  const label = kind === 'hero' ? 'event' : 'koleksi';
  return (
    <div className={'soft-controls ' + kind + '-navigation'}>
      <button
        className="slide-arrow previous"
        aria-label={
          label === 'event' ? 'Event sebelumnya' : 'Koleksi sebelumnya'
        }
        onClick={() => state.go(state.index - 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>
      <button
        className="slide-arrow next"
        aria-label={
          label === 'event' ? 'Event berikutnya' : 'Koleksi berikutnya'
        }
        onClick={() => state.go(state.index + 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
      <div className="slide-pagination">
        <div className="slide-dots">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              aria-label={'Tampilkan slide ' + label + ' ' + (i + 1)}
              aria-pressed={state.index === i}
              onClick={() => state.go(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          className="slide-pause"
          aria-label={(state.paused ? 'Putar' : 'Jeda') + ' slideshow ' + label}
          onClick={state.setPaused}
        >
          {state.paused ? '▶' : 'Ⅱ'}
        </button>
      </div>
    </div>
  );
}
export function EventCarousel() {
  const { events } = useContent();
  const event = events.find((event) => event.id === legacyEvent.id);
  const slides = !event
    ? []
    : event.updatedAt
      ? event.images.map((image) => ({
          image: image.url,
          label: 'EVENT PURISSA',
          title: event.title,
          emphasis: '',
          date: dateRange(event),
          description: image.caption || event.caption,
        }))
      : originalSlides;
  const state = useCarousel(slides.length, 6500);
  if (!slides.length) return null;
  return (
    <section
      className="hero event-feature"
      id="events"
      aria-roledescription="carousel"
      aria-label="Sorotan event Purissa"
      {...state.bindings}
    >
      <div className="hero-slides">
        {slides.map((slide, i) => (
          <article
            key={slide.image}
            className={'hero-slide' + (state.index === i ? ' active' : '')}
            aria-hidden={state.index !== i}
            inert={state.index !== i}
          >
            <div
              className="hero-image"
              style={{ '--slide-image': `url(${slide.image})` }}
            />
            <div className="hero-content">
              <div className="eyebrow">{slide.label}</div>
              <h2>
                {slide.title}
                <em>{slide.emphasis}</em>
              </h2>
              <div className="event-date">{slide.date}</div>
              <p>{slide.description}</p>
              <div className="actions">
                <a className="button gold" href={whatsappUrl}>
                  Tanya event berikutnya <span>↗</span>
                </a>
                <Link className="text-link" to="/gallery">
                  Lihat galeri <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Controls state={state} count={slides.length} kind="hero" />
      <span className="hero-location">JAKARTA BARAT, INDONESIA</span>
    </section>
  );
}
export function Gallery() {
  const { images: allImages } = useContent();
  const images = allImages.filter((image) => image.kind === 'gallery');
  const groups = Array.from(
    { length: Math.ceil(images.length / 3) },
    (_, page) =>
      Array.from(
        { length: Math.min(3, images.length) },
        (_, i) => images[(page * 3 + i) % images.length],
      ),
  );
  const [selected, setSelected] = useState(null);
  const state = useCarousel(groups.length, 5500, Boolean(selected));
  if (!images.length)
    return (
      <section className="section">
        <p>Galeri akan segera diperbarui.</p>
      </section>
    );
  return (
    <>
      <section
        className="collection section"
        id="collection"
        {...state.bindings}
      >
        <div
          className="collection-carousel"
          aria-roledescription="carousel"
          aria-label="Galeri karya Sakyant"
        >
          {groups.map((group, i) => (
            <div
              key={i}
              className={
                'gallery gallery-page' + (state.index === i ? ' active' : '')
              }
              aria-hidden={state.index !== i}
              inert={state.index !== i}
            >
              {group.map((image) => (
                <button
                  className="art"
                  key={image.id}
                  onClick={() => setSelected(image)}
                >
                  <img
                    src={image.src}
                    loading={state.index === i ? 'eager' : 'lazy'}
                    alt={image.alt}
                  />
                  <span>
                    <small>PURISSA / {image.id.slice(0, 2)}</small>
                    {image.title} <b>↗</b>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <Controls state={state} count={groups.length} kind="gallery" />
        <div className="gallery-note">
          <span>Klik foto untuk melihat detail ↗</span>
          <span className="gallery-count" aria-live="polite">
            {String(state.index + 1).padStart(2, '0')} /{' '}
            {String(groups.length).padStart(2, '0')}
          </span>
        </div>
      </section>
      <Lightbox image={selected} onClose={() => setSelected(null)} />
    </>
  );
}
