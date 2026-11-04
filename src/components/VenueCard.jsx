import { wedding } from '../wedding.config.js';
import { useCopy } from '../hooks/useCopy.js';
import { CopyIcon, PinIcon, TickIcon } from './Icons.jsx';
import Reveal from './Reveal.jsx';
import './VenueCard.css';

export default function VenueCard() {
  const { copied, copy } = useCopy();
  const { venue } = wedding;
  return (
    <>
      <Reveal as="h2" className="venue__welcome">{wedding.welcome}</Reveal>
      <Reveal className="venue">
        <h3 className="venue__name">{venue.name}</h3>
        <p className="venue__covers">{venue.covers}</p>
        <p className="venue__address">{venue.address}</p>
        <div className="venue__actions">
          <a className="venue__go" href={venue.map} target="_blank" rel="noopener noreferrer">
            <PinIcon />
            Get Directions
          </a>
          <button
            className="venue__copy"
            type="button"
            aria-label={copied ? 'Address copied' : 'Copy the address'}
            onClick={() => copy(`${venue.name}, ${venue.address}`)}
          >
            {copied ? <TickIcon /> : <CopyIcon />}
          </button>
        </div>
      </Reveal>
    </>
  );
}
