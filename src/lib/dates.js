const ZONE = 'Asia/Kolkata';

function parts(iso, options) {
  const out = {};
  new Intl.DateTimeFormat('en-US', { timeZone: ZONE, ...options })
    .formatToParts(new Date(iso))
    .forEach((p) => {
      out[p.type] = p.value;
    });
  return out;
}

function ordinal(day) {
  const n = Number(day);
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
}

/** "23rd Nov 2026" */
export function eventDate(iso) {
  const p = parts(iso, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${ordinal(p.day)} ${p.month} ${p.year}`;
}

/** "02:00 PM" */
export function eventTime(iso) {
  const p = parts(iso, { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${p.hour}:${p.minute} ${p.dayPeriod.toUpperCase()}`;
}

/** The three scratch hearts: day, month and year of the wedding. */
export function heartValues(iso) {
  const p = parts(iso, { day: 'numeric', month: 'short', year: 'numeric' });
  return [
    { label: 'DAY', value: p.day },
    { label: 'MONTH', value: p.month.toUpperCase() },
    { label: 'YEAR', value: p.year }
  ];
}

/** Days, hours, minutes and seconds left until a moment, never below zero. */
export function timeLeft(iso, now = Date.now()) {
  let left = Math.max(0, new Date(iso).getTime() - now);
  const finished = left === 0;
  const days = Math.floor(left / 864e5);
  left -= days * 864e5;
  const hours = Math.floor(left / 36e5);
  left -= hours * 36e5;
  const minutes = Math.floor(left / 6e4);
  left -= minutes * 6e4;
  return { days, hours, minutes, seconds: Math.floor(left / 1e3), finished };
}
