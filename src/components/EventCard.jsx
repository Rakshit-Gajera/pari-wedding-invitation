import { wedding } from '../wedding.config.js';
import { eventDate, eventTime } from '../lib/dates.js';
import { googleCalendarLink, icsFile } from '../lib/links.js';
import frame from '../assets/event-card-frame.webp';
import { CalendarIcon } from './Icons.jsx';
import Reveal from './Reveal.jsx';

const IS_APPLE_PHONE = /iP(hone|ad|od)/.test(navigator.userAgent);

// iPhones open a calendar file straight in the Calendar app; everyone else gets Google Calendar.
function addToAppleCalendar(event, data) {
  event.preventDefault();
  const url = URL.createObjectURL(new Blob([icsFile(data, wedding)], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.name}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function EventCard({ event }) {
  return (
    <Reveal as="article" className="event">
      <div className="event__frame">
        <img src={frame} alt="" loading="lazy" />
        <div className="event__text">
          <p className="event__date">{eventDate(event.start)}</p>
          <h3 className={event.name.length > 8 ? 'event__name event__name--long' : 'event__name'}>{event.name}</h3>
          <p className="event__time">{eventTime(event.start)}</p>
        </div>
      </div>
      <a
        className="event__button"
        href={googleCalendarLink(event, wedding)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={IS_APPLE_PHONE ? (click) => addToAppleCalendar(click, event) : undefined}
      >
        <CalendarIcon />
        Add to Calendar
      </a>
    </Reveal>
  );
}
