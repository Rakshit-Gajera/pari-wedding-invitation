import { useCallback, useState } from 'react';
import { wedding } from '../wedding.config.js';
import frame from '../assets/gold-frame-ornate.webp';
import Reveal from './Reveal.jsx';
import './MeetCouple.css';

export default function MeetCouple() {
  const [seen, setSeen] = useState(false);
  const onSeen = useCallback(() => setSeen(true), []);
  return (
    <>
      <Reveal as="h2" className={`meet__title script${seen ? ' meet__title--in' : ''}`} onSeen={onSeen}>
        <span>{wedding.meet.title[0]}</span>
        <span>{wedding.meet.title[1]}</span>
      </Reveal>
      <Reveal className="meet__frame">
        <img src={frame} alt="" loading="lazy" />
        <p className="meet__words">{wedding.meet.words}</p>
      </Reveal>
    </>
  );
}
