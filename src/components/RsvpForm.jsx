import { useRef, useState } from 'react';
import { wedding } from '../wedding.config.js';
import { replyMessage, replyProblem, whatsappLink } from '../lib/links.js';
import { CallIcon, WhatsAppIcon } from './Icons.jsx';
import Reveal from './Reveal.jsx';
import './RsvpForm.css';

const COUNTRY_CODES = ['+91', '+1', '+44', '+971', '+61', '+65'];

function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className="rsvp__chip" aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

export default function RsvpForm() {
  const { rsvp, events } = wedding;
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const [form, setForm] = useState({ name: '', code: '+91', phone: '', events: [], note: '', website: '' });
  const [problem, setProblem] = useState('');
  const [sentLink, setSentLink] = useState('');
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggleEvent = (name) =>
    setForm((current) => ({
      ...current,
      events: current.events.includes(name) ? current.events.filter((e) => e !== name) : [...current.events, name]
    }));

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const issue = replyProblem(form);
    if (issue) {
      setProblem(issue.message);
      setSentLink('');
      setSaved(false);
      (issue.field === 'name' ? nameRef : phoneRef).current.focus();
      return;
    }
    setProblem('');
    const reply = { ...form, name: form.name.trim(), note: form.note.trim() };
    const link = whatsappLink(rsvp.whatsapp, replyMessage(reply, wedding));

    // With a sheet set up, the reply is saved there. Without one, or if saving fails, WhatsApp takes over.
    if (rsvp.sheetUrl) {
      setSending(true);
      try {
        await fetch(rsvp.sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...reply, phone: `${reply.code} ${reply.phone.trim()}` })
        });
        setSaved(true);
        setSentLink('');
        setSending(false);
        return;
      } catch {
        setSending(false);
      }
    }
    setSaved(false);
    setSentLink(link);
    window.open(link, '_blank', 'noopener');
  }

  return (
    <Reveal as="form" className="rsvp" noValidate onSubmit={submit}>
      <h3 className="rsvp__title">{rsvp.title}</h3>

      <label className="rsvp__label" htmlFor="rsvp-name">
        Your Name <em>*</em>
      </label>
      <input
        ref={nameRef}
        className="rsvp__input"
        id="rsvp-name"
        autoComplete="name"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
      />

      <label className="rsvp__label" htmlFor="rsvp-phone">
        Phone Number <em>*</em>
      </label>
      <div className="rsvp__phone">
        <select className="rsvp__input" aria-label="Country code" value={form.code} onChange={(e) => set('code', e.target.value)}>
          {COUNTRY_CODES.map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>
        <input
          ref={phoneRef}
          className="rsvp__input"
          id="rsvp-phone"
          type="tel"
          inputMode="tel"
          placeholder="98765 43210"
          autoComplete="tel-national"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </div>

      <p className="rsvp__label">Which events will you be attending?</p>
      <div className="rsvp__chips">
        {events.map(({ name }) => (
          <Chip key={name} selected={form.events.includes(name)} onClick={() => toggleEvent(name)}>
            {name}
          </Chip>
        ))}
      </div>

      <label className="rsvp__label" htmlFor="rsvp-note">
        A Little Note For Us
      </label>
      <textarea
        className="rsvp__input rsvp__note"
        id="rsvp-note"
        placeholder={rsvp.notePlaceholder}
        value={form.note}
        onChange={(e) => set('note', e.target.value)}
      />

      <input className="rsvp__trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set('website', e.target.value)} />

      <button className="rsvp__send" type="submit" disabled={sending}>
        {sending ? 'Sending...' : rsvp.send}
      </button>

      <div className="rsvp__status" aria-live="polite">
        {problem && <p className="rsvp__problem">{problem}</p>}
        {saved && <p className="rsvp__thanks">Thank you! We have received your reply. We look forward to seeing you.</p>}
        {sentLink && (
          <p className="rsvp__thanks">
            Thank you! Press send in WhatsApp to finish. If it did not open,{' '}
            <a href={sentLink} target="_blank" rel="noopener noreferrer">
              tap here
            </a>
            .
          </p>
        )}
      </div>

      <div className="rsvp__contact">
        <div>
          <b>{rsvp.contact.name}</b>
          <span>{rsvp.contact.role}</span>
        </div>
        <div className="rsvp__contact-buttons">
          <a href={`tel:${rsvp.contact.phone}`} aria-label={`Call ${rsvp.contact.name}`}>
            <CallIcon />
          </a>
          <a href={whatsappLink(rsvp.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${rsvp.contact.name}`}>
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
