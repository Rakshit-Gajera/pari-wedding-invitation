import { wedding } from '../wedding.config.js';
import frame from '../assets/gold-frame-ornate.webp';
import './OpeningVeil.css';

const FIRST_WORD_AT = 1.1;
const WORD_GAP = 0.05;

/** The first thing a guest sees: the invitation's own art, waiting behind a soft shade. */
export default function OpeningVeil({ onOpen }) {
  const { opening, meet } = wedding;
  return (
    <div className="veil">
      <div className="veil__stage">
        <div className="veil__content">
          <p className="veil__line">
            {opening.line} <i aria-hidden="true">&#10084;</i>
          </p>
          <p className="veil__note">{opening.note}</p>
          <p className="veil__title script">
            <span>{meet.title[0]}</span>
            <span>{meet.title[1]}</span>
          </p>
          <div className="veil__frame">
            <img src={frame} alt="" />
            <p className="veil__words">
              {meet.words.split(' ').map((word, i) => (
                <span key={`${word}${i}`} style={{ animationDelay: `${(FIRST_WORD_AT + i * WORD_GAP).toFixed(2)}s` }}>
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="veil__mandap" aria-hidden="true" />
        <div className="veil__shade" aria-hidden="true" />
        <button className="veil__button" type="button" onClick={onOpen}>
          OPEN INVITATION
        </button>
      </div>
    </div>
  );
}
