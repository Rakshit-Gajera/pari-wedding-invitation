import { useEffect, useRef } from 'react';
import { wedding } from '../wedding.config.js';
import sky from '../assets/hero-sky.webp';
import sun from '../assets/hero-sun.webp';
import mountains from '../assets/hero-mountains.webp';
import clouds from '../assets/hero-clouds.webp';
import temple from '../assets/hero-temple-mobile.webp';
import arch from '../assets/top-arch-screenshot.webp';
import BlessingCard from './BlessingCard.jsx';
import './HeroScene.css';

// Fetched while the veil is up, so the scene is ready the moment it lifts.
export const heroImages = [sky, sun, mountains, clouds, temple, arch];

const ORBS = [[20, 13], [52, 33.5], [70, 22], [66, 27.5], [14, 44], [24, 30], [78, 40], [72, 47]];
const STARS = [[46, 19], [44, 39], [88, 26]];

export default function HeroScene() {
  const cloudsRef = useRef(null);
  const mountainsRef = useRef(null);

  // The far sky drifts slower than the page, and the scroll cue leaves once the guest moves.
  useEffect(() => {
    let queued = false;
    const update = () => {
      queued = false;
      const y = window.scrollY;
      document.documentElement.classList.toggle('scrolled', y > 60);
      if (y < window.innerHeight * 1.2) {
        cloudsRef.current.style.translate = `0 ${y * 0.28}px`;
        mountainsRef.current.style.translate = `0 ${y * 0.14}px`;
      }
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="scene">
      <div className="scene__sky">
        <img className="scene__layer scene__backdrop" src={sky} alt="" />
        <img className="scene__sun" src={sun} alt="" />
        <img ref={mountainsRef} className="scene__layer scene__mountains" src={mountains} alt="" />
        <img ref={cloudsRef} className="scene__layer scene__clouds" src={clouds} alt="" />
      </div>
      <div className="scene__garden" aria-hidden="true" />
      <div className="scene__temple">
        <img src={temple} alt="A couple walking toward a temple along a flower-lined path" />
      </div>
      <div className="scene__flag" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <path d="M4 44V0" stroke="#B9832A" strokeWidth="2" />
          <g className="scene__cloth">
            <path d="M5 3L42 7L33 15L41 25L5 24Z" fill="#EB5B16" stroke="#C4420A" strokeWidth=".6" />
            <text x="17" y="19" fontSize="11" fontFamily="Noto Serif Gujarati,serif" fontWeight="700" fill="#FFF3D0" textAnchor="middle">
              શ્રી
            </text>
          </g>
        </svg>
      </div>
      <img className="scene__arch" src={arch} alt="" />

      <div className="scene__names">
        <h1>
          <span className="scene__name scene__name--first script">{wedding.bride}</span>
          <span className="scene__amp script">&amp;</span>
          <span className="scene__name scene__name--second script">{wedding.groom}</span>
        </h1>
        {ORBS.map(([x, y], i) => (
          <i key={`orb${i}`} className="scene__orb" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `-${(i * 0.7).toFixed(1)}s` }} />
        ))}
        {STARS.map(([x, y], i) => (
          <svg key={`star${i}`} className="scene__star" viewBox="0 0 24 24" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `-${i * 1.2}s` }} aria-hidden="true">
            <path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7L12 17l-6.3 3.8 1.6-7L2 9.6 9 9z" />
          </svg>
        ))}
      </div>

      <div className="scene__cue" aria-hidden="true">
        <svg viewBox="0 0 24 12">
          <path d="M3 2l9 8 9-8" fill="none" stroke="#7A4A2A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>SCROLL TO CONTINUE</span>
      </div>

      <BlessingCard />
    </section>
  );
}
