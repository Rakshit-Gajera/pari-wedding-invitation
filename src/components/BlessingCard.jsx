import { wedding } from '../wedding.config.js';
import Reveal from './Reveal.jsx';
import './BlessingCard.css';

export default function BlessingCard() {
  const { blessing, bride, groom } = wedding;
  return (
    <article className="blessing">
      <Reveal className="blessing__ganesh" role="img" aria-label="Lord Ganesha" />
      <Reveal as="p" className="blessing__shloka" lang="gu">
        {blessing.shloka.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </Reveal>
      <Reveal as="p" className="blessing__parents">{blessing.brideParents}</Reveal>
      <Reveal as="p" className="blessing__invite">{blessing.invite}</Reveal>
      <Reveal as="p" className="blessing__names script">
        <span className="blessing__big">{bride}</span>
        <span className="blessing__and">with</span>
        <span className="blessing__big">{groom}</span>
      </Reveal>
      <Reveal as="p" className="blessing__label">{blessing.groomLabel}</Reveal>
      <Reveal as="p" className="blessing__groom-parents">
        {blessing.groomParents.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </Reveal>
    </article>
  );
}
