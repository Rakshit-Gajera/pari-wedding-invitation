import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { test } from 'node:test';
import { eventDate, eventTime, heartValues, timeLeft } from '../src/lib/dates.js';
import { googleCalendarLink, icsFile, replyMessage, replyProblem, whatsappLink } from '../src/lib/links.js';
import { wedding } from '../src/wedding.config.js';

test('function dates and times read as they do on the printed card', () => {
  const shown = wedding.events.map((e) => `${e.name}: ${eventDate(e.start)} ${eventTime(e.start)}`);
  assert.deepEqual(shown, [
    'Mandap Muhurat: 23rd Nov 2026 02:00 PM',
    'Haldi Rasam: 23rd Nov 2026 05:00 PM',
    'Jaan Aagman: 24th Nov 2026 05:00 PM',
    'Wedding Dinner: 24th Nov 2026 07:30 PM',
    'Hast Melap: 24th Nov 2026 07:45 PM'
  ]);
});

test('date endings are right for every kind of day', () => {
  const on = (day) => eventDate(`2026-11-${day}T12:00:00+05:30`);
  assert.equal(on('01'), '1st Nov 2026');
  assert.equal(on('02'), '2nd Nov 2026');
  assert.equal(on('03'), '3rd Nov 2026');
  assert.equal(on('11'), '11th Nov 2026');
  assert.equal(on('12'), '12th Nov 2026');
  assert.equal(on('13'), '13th Nov 2026');
  assert.equal(on('21'), '21st Nov 2026');
  assert.equal(on('30'), '30th Nov 2026');
});

test('the hearts spell out the wedding date', () => {
  assert.deepEqual(heartValues(wedding.weddingAt).map((h) => h.value), ['24', 'NOV', '2026']);
});

test('the countdown splits time correctly and stops at zero', () => {
  const at = '2026-11-24T19:45:00+05:30';
  const target = new Date(at).getTime();
  const later = 2 * 864e5 + 3 * 36e5 + 4 * 6e4 + 5e3;
  assert.deepEqual(timeLeft(at, target - later), { days: 2, hours: 3, minutes: 4, seconds: 5, finished: false });
  assert.deepEqual(timeLeft(at, target + 1000), { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true });
});

test('calendar links carry the right moment in universal time', () => {
  const link = new URL(googleCalendarLink(wedding.events[0], wedding));
  assert.equal(link.searchParams.get('dates'), '20261123T083000Z/20261123T093000Z');
  assert.equal(link.searchParams.get('text'), 'Parita & Deep: Mandap Muhurat');
  assert.match(link.searchParams.get('details'), /maps\.app\.goo\.gl\/jUpAzVYfySr2DNsH6/);
});

test('the calendar file is valid and escapes commas', () => {
  const ics = icsFile(wedding.events[4], wedding);
  assert.match(ics, /DTSTART:20261124T141500Z/);
  assert.match(ics, /DTEND:20261124T154500Z/);
  assert.match(ics, /LOCATION:Dreamland Party Plot\\, Section B\\, opposite/);
});

test('replies need a name and a real phone number', () => {
  const good = { name: 'Asha', code: '+91', phone: '98765 43210' };
  assert.equal(replyProblem(good), null);
  assert.equal(replyProblem({ ...good, name: '  ' }).field, 'name');
  assert.equal(replyProblem({ ...good, phone: '12345' }).field, 'phone');
  assert.equal(replyProblem({ ...good, code: '+1', phone: '415 555 0100' }), null);
});

test('a reply reaches Rakshit on WhatsApp with everything the guest chose', () => {
  assert.equal(wedding.rsvp.whatsapp, '919409681405');
  assert.equal(wedding.rsvp.contact.phone, '+919409681405');
  assert.equal(wedding.rsvp.contact.name, 'Rakshit Gajera');
  const message = replyMessage(
    { name: 'Asha', code: '+91', phone: '98765 43210', events: ['Haldi Rasam', 'Hast Melap'], note: 'Blessings' },
    wedding
  );
  assert.equal(
    message,
    "Namaste! Asha is coming to Parita and Deep's wedding.\nPhone: +91 98765 43210\nAttending: Haldi Rasam, Hast Melap\nNote: Blessings"
  );
  const link = new URL(whatsappLink(wedding.rsvp.whatsapp, message));
  assert.equal(link.pathname, '/919409681405');
  assert.equal(link.searchParams.get('text'), message);
});

test('functions run in order and every one has a time and length', () => {
  const starts = wedding.events.map((e) => new Date(e.start).getTime());
  assert.ok(starts.every((t) => !Number.isNaN(t)));
  assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
  assert.ok(wedding.events.every((e) => e.minutes > 0));
});

test('the song in the config ships with the site', () => {
  const song = statSync(new URL(`../public/${wedding.music.file}`, import.meta.url));
  assert.ok(song.size > 100_000, 'the song file looks empty');
  assert.ok(song.size < 5 * 1024 * 1024, 'the song is too large to start quickly on phones');
});
