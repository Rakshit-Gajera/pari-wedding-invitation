/** 2026-11-23T14:00:00+05:30 becomes 20261123T083000Z, which every calendar understands. */
function stamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function eventTimes(event) {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + event.minutes * 6e4);
  return { from: stamp(start), to: stamp(end) };
}

function titleFor(event, wedding) {
  return `${wedding.bride} & ${wedding.groom}: ${event.name}`;
}

export function googleCalendarLink(event, wedding) {
  const venue = event.venue ?? wedding.venue;
  const { from, to } = eventTimes(event);
  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: titleFor(event, wedding),
    dates: `${from}/${to}`,
    location: `${venue.name}, ${venue.address}`,
    details: `Directions: ${venue.map}`
  });
  return `https://calendar.google.com/calendar/render?${query}`;
}

/** A calendar file for iPhones, which open it straight into the Calendar app. */
export function icsFile(event, wedding) {
  const venue = event.venue ?? wedding.venue;
  const { from, to } = eventTimes(event);
  const escape = (text) => text.replace(/([,;\\])/g, '\\$1');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Parita and Deep//Wedding Invite//EN',
    'BEGIN:VEVENT',
    `UID:${from}-${event.name.replace(/\s+/g, '-')}@invite`,
    `DTSTAMP:${from}`,
    `DTSTART:${from}`,
    `DTEND:${to}`,
    `SUMMARY:${escape(titleFor(event, wedding))}`,
    `LOCATION:${escape(`${venue.name}, ${venue.address}`)}`,
    `DESCRIPTION:${escape(`Directions: ${venue.map}`)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function replyMessage(form, wedding) {
  return [
    `Namaste! ${form.name} is coming to ${wedding.bride} and ${wedding.groom}'s wedding.`,
    `Phone: ${form.code} ${form.phone}`,
    form.events.length ? `Attending: ${form.events.join(', ')}` : '',
    form.note ? `Note: ${form.note}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}

export function whatsappLink(number, message) {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** Checks a reply and returns what to fix, or nothing when it is ready to send. */
export function replyProblem(form) {
  if (!form.name.trim()) return { field: 'name', message: 'Please add your name.' };
  const digits = form.phone.replace(/\D/g, '');
  const tooShort = form.code === '+91' ? digits.length !== 10 : digits.length < 7 || digits.length > 14;
  if (tooShort) return { field: 'phone', message: 'Please add a valid phone number.' };
  return null;
}
