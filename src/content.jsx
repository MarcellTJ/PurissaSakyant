import { createContext, useContext, useEffect, useState } from 'react';
import defaults from './data/imageDefaults.json';
import legacyEvent from './data/legacyEvent.json';
const ContentContext = createContext({
  images: defaults,
  events: [{ ...legacyEvent, updatedAt: 0 }],
});
export function ContentProvider({ children }) {
  const [images, setImages] = useState(defaults),
    [events, setEvents] = useState([{ ...legacyEvent, updatedAt: 0 }]);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [content, eventData] = await Promise.all([
          fetch('/api/content', { cache: 'no-store' }).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch('/api/events', { cache: 'no-store' }).then((r) =>
            r.ok ? r.json() : null,
          ),
        ]);
        if (active) {
          if (content) setImages(content.images);
          if (eventData) setEvents(eventData.events);
        }
      } catch {}
    }
    load();
    window.addEventListener('focus', load);
    window.addEventListener('purissa:content-saved', load);
    return () => {
      active = false;
      window.removeEventListener('focus', load);
      window.removeEventListener('purissa:content-saved', load);
    };
  }, []);
  return (
    <ContentContext.Provider value={{ images, events }}>
      {children}
    </ContentContext.Provider>
  );
}
export const useContent = () => useContext(ContentContext);
export const useGeneralImage = (id) =>
  useContent().images.find((image) => image.id === id) ||
  defaults.find((image) => image.id === id);
export function contentSaved() {
  window.dispatchEvent(new Event('purissa:content-saved'));
}
