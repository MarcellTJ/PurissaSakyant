import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
  Link,
} from 'react-router-dom';
import {
  Header,
  Footer,
  Booking,
  Marquee,
  EventList,
} from './components/Shared.jsx';
import { Gallery, EventCarousel } from './components/Carousels.jsx';
import * as Sections from './components/Sections.jsx';
import faq from './data/faq.json';
import images from './data/gallery.json';
import eventSlides from './data/eventSlides.json';
import { useReducedMotion } from './hooks.js';
import SocialsPage from './components/SocialsPage.jsx';
const AdminRoom = lazy(() => import('./components/AdminRoom.jsx'));
import PublishedEvents from './components/PublishedEvents.jsx';
const pages = {
  '/': { title: 'Purissa · Sak Yant & Blessing di Jakarta', Component: Home },
  '/sak-yant': {
    title: 'Mengenal Sak Yant & Blessing',
    Component: Information,
  },
  '/gallery': { title: 'Galeri Karya', Component: GalleryPage },
  '/events': { title: 'Event Sak Yant & Blessing', Component: EventsPage },
  '/faq': { title: 'Pertanyaan yang Sering Diajukan', Component: FaqPage },
  '/socials': {
    title: 'Socials & Kontak',
    Component: SocialsPage,
    showBooking: false,
  },
};
function Home() {
  return (
    <>
      <Sections.HomeIntro />
      <Marquee />
      <Sections.Explore />
      <Sections.HomeGallery />
      <PublishedEvents />
      <EventList />
    </>
  );
}
function Information() {
  return (
    <>
      <Sections.InfoIntro />
      <Sections.Philosophy />
      <Sections.Blessing />
      <Sections.Journey />
      <Sections.Process />
    </>
  );
}
function GalleryPage() {
  return (
    <>
      <Sections.GalleryIntro />
      <Gallery />
    </>
  );
}
function EventsPage() {
  return (
    <>
      <Sections.EventsIntro />
      <PublishedEvents />
      <Sections.EventSchedule />
      <Sections.ArchiveHeading />
      <EventCarousel />
    </>
  );
}
function FaqPage() {
  return (
    <>
      <Sections.FaqIntro />
      <section className="faq section">
        <div className="questions">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="page-intro section">
      <div className="eyebrow">HALAMAN TIDAK DITEMUKAN</div>
      <h1>
        Kembali ke
        <br />
        <em>perjalanan Anda.</em>
      </h1>
      <p>Halaman ini tidak tersedia.</p>
      <Link className="button gold" to="/">
        Kembali ke Beranda ↗
      </Link>
    </section>
  );
}
function LegacyRedirect() {
  const location = useLocation();
  const path =
    location.pathname === '/index.html'
      ? '/'
      : location.pathname.replace(/\.html$/, '');
  return <Navigate replace to={path + location.search + location.hash} />;
}
function PublicApp() {
  const location = useLocation(),
    navigationType = useNavigationType(),
    reduced = useReducedMotion();
  const [display, setDisplay] = useState(location),
    [phase, setPhase] = useState('');
  const main = useRef(null),
    positions = useRef(new Map()),
    previous = useRef(location);
  useEffect(() => {
    const sources = new Set([
      ...images.map((image) => image.src),
      ...eventSlides.map((slide) => slide.image),
      '/assets/events/candle-blessing-ceremony.jpg',
    ]);
    sources.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);
  useEffect(() => {
    if (location.key === display.key) return;
    positions.current.set(previous.current.key, window.scrollY);
    previous.current = location;
    if (reduced || location.pathname === display.pathname) {
      setDisplay(location);
      setPhase('');
      return;
    }
    setPhase('route-exit');
    const timer = setTimeout(() => {
      setDisplay(location);
      setPhase('route-enter');
    }, 180);
    return () => clearTimeout(timer);
  }, [location, reduced]);
  useLayoutEffect(() => {
    const page = pages[display.pathname];
    document.title = (page?.title || 'Purissa') + ' — Purissa Sakyant';
    const target =
      display.hash &&
      document.getElementById(decodeURIComponent(display.hash.slice(1)));
    const y = target
      ? target.getBoundingClientRect().top + window.scrollY - 90
      : navigationType === 'POP'
        ? positions.current.get(display.key) || 0
        : 0;
    window.scrollTo({ top: y, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [display]);
  return (
    <>
      <Header />
      <main
        ref={main}
        id="main"
        tabIndex="-1"
        className={'route-content ' + phase}
      >
        <Routes location={display}>
          {Object.entries(pages).map(
            ([path, { Component, showBooking = true }]) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Component />
                    {showBooking && <Booking />}
                  </>
                }
              />
            ),
          )}
          {[
            '/index.html',
            '/sak-yant.html',
            '/gallery.html',
            '/events.html',
            '/faq.html',
            '/socials.html',
          ].map((path) => (
            <Route key={path} path={path} element={<LegacyRedirect />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin-room"
        element={
          <Suspense
            fallback={
              <main className="admin-loading">Membuka Admin Room…</main>
            }
          >
            <AdminRoom />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicApp />} />
    </Routes>
  );
}
