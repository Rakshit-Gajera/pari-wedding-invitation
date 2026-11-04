import { wedding } from '../wedding.config.js';
import ornament from '../assets/ornament-burst-mobile.webp';
import EventCard from './EventCard.jsx';
import Reveal from './Reveal.jsx';
import './Celebrations.css';

function inPairs(items) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default function Celebrations() {
  const rows = inPairs(wedding.events);
  return (
    <section className="celebrate">
      <Reveal as="h2" className="celebrate__title">{wedding.celebrations.title}</Reveal>
      <Reveal as="p" className="celebrate__sub">{wedding.celebrations.sub}</Reveal>
      <div className="celebrate__rows">
        {rows.map((row) => (
          <div className="celebrate__row" key={row[0].name}>
            {row.map((event) => (
              <EventCard key={event.name} event={event} />
            ))}
            {row.length === 2 && (
              <>
                <img className="celebrate__burst celebrate__burst--left" src={ornament} alt="" loading="lazy" />
                <img className="celebrate__burst celebrate__burst--right" src={ornament} alt="" loading="lazy" />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
