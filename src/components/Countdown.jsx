import { useEffect, useState } from 'react';
import { wedding } from '../wedding.config.js';
import { timeLeft } from '../lib/dates.js';
import Reveal from './Reveal.jsx';
import './Countdown.css';

const CIRCUMFERENCE = 2 * Math.PI * 22;
const DAYS_ON_RING = 60;

function Ring({ value, outOf, label }) {
  return (
    <div className="ring">
      <div className="ring__dial">
        <svg viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="22" fill="none" stroke="#F4E2C2" strokeWidth="3.6" />
          <circle
            className="ring__arc"
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="#DDAA4E"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - Math.min(value / outOf, 1))}
          />
        </svg>
        <b>{String(value).padStart(2, '0')}</b>
      </div>
      <small>{label}</small>
    </div>
  );
}

export default function Countdown() {
  const { countdown, weddingAt } = wedding;
  const [left, setLeft] = useState(() => timeLeft(weddingAt));

  useEffect(() => {
    const timer = setInterval(() => setLeft(timeLeft(weddingAt)), 1000);
    return () => clearInterval(timer);
  }, [weddingAt]);

  return (
    <>
      <Reveal as="h2" className="countdown__title">{left.finished ? countdown.doneTitle : countdown.title}</Reveal>
      <Reveal as="p" className="countdown__sub">{countdown.sub}</Reveal>
      <Reveal as="svg" className="countdown__rule" viewBox="0 0 180 10" aria-hidden="true">
        <path d="M2 5H78M102 5H178" stroke="#C99A3A" strokeWidth="1.2" />
        <path d="M90 0L96 5L90 10L84 5Z" fill="#E7C88A" stroke="#C99A3A" />
        <circle cx="2" cy="5" r="2" fill="#C99A3A" />
        <circle cx="178" cy="5" r="2" fill="#C99A3A" />
      </Reveal>
      <Reveal className="countdown__rings">
        <Ring value={left.days} outOf={DAYS_ON_RING} label="Days" />
        <Ring value={left.hours} outOf={24} label="Hours" />
        <Ring value={left.minutes} outOf={60} label="Minutes" />
        <Ring value={left.seconds} outOf={60} label="Seconds" />
      </Reveal>
      <Reveal as="p" className="countdown__closing">
        {countdown.closing.map((line, i) => (
          <span key={line}>
            {line}
            {i === countdown.closing.length - 1 && <i aria-hidden="true"> &#10084;</i>}
          </span>
        ))}
      </Reveal>
    </>
  );
}
