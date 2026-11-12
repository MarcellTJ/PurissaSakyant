import { useContent } from '../content.jsx';
import legacyEvent from '../data/legacyEvent.json';
import EventCard from './EventCard.jsx';
export default function PublishedEvents() {
  const { events: allEvents } = useContent();
  const events = allEvents.filter((event) => event.id !== legacyEvent.id);
  if (!events.length) return null;
  return (
    <section className="section published-events">
      <div className="eyebrow">PERTEMUAN BERIKUTNYA</div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
}
