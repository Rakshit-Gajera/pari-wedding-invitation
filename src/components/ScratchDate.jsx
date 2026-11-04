import { useRef } from 'react';
import { wedding } from '../wedding.config.js';
import { heartValues } from '../lib/dates.js';
import { burst } from '../lib/sky.js';
import Reveal from './Reveal.jsx';
import ScratchHeart from './ScratchHeart.jsx';
import './ScratchDate.css';

const HEARTS = heartValues(wedding.weddingAt);

export default function ScratchDate() {
  const row = useRef(null);
  const revealed = useRef(0);

  // When the last heart opens, gold goes up from both sides of the screen.
  function onReveal() {
    revealed.current += 1;
    if (revealed.current === HEARTS.length) {
      const { top } = row.current.getBoundingClientRect();
      burst(30, top, 40);
      burst(window.innerWidth - 30, top, 40);
    }
  }

  return (
    <>
      <Reveal as="p" className="date__eyebrow">{wedding.date.eyebrow}</Reveal>
      <div ref={row}>
        <Reveal className="date__hearts">
          {HEARTS.map((heart) => (
            <ScratchHeart key={heart.label} label={heart.label} value={heart.value} onReveal={onReveal} />
          ))}
        </Reveal>
      </div>
      <Reveal as="p" className="date__hint">
        {wedding.date.hint} <i aria-hidden="true">&#10084;</i>
      </Reveal>
      <Reveal as="p" className="date__note">{wedding.date.note}</Reveal>
    </>
  );
}
