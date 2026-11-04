import { useEffect, useState } from 'react';
import { wedding } from './wedding.config.js';
import { useMusic } from './hooks/useMusic.js';
import ornament from './assets/ornament-burst-mobile.webp';
import endScene from './assets/countdown-scene-mobile.webp';
import Celebrations from './components/Celebrations.jsx';
import Countdown from './components/Countdown.jsx';
import HeroScene, { heroImages } from './components/HeroScene.jsx';
import MeetCouple from './components/MeetCouple.jsx';
import MusicButton from './components/MusicButton.jsx';
import OpeningVeil from './components/OpeningVeil.jsx';
import Petals from './components/Petals.jsx';
import Reveal from './components/Reveal.jsx';
import RsvpForm from './components/RsvpForm.jsx';
import ScratchDate from './components/ScratchDate.jsx';
import VenueCard from './components/VenueCard.jsx';

export default function App() {
  const [opened, setOpened] = useState(false);
  const music = useMusic(wedding.music);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    heroImages.forEach((src) => {
      new Image().src = src;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('locked', !opened);
    document.documentElement.classList.toggle('open', opened);
  }, [opened]);

  function openInvitation() {
    music.start();
    window.scrollTo(0, 0);
    setOpened(true);
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="heart-shape" clipPathUnits="objectBoundingBox">
            <path d="M.5 .98C.28 .8 .02 .6 .01 .32C0 .12 .15 0 .29 0C.39 0 .46 .06 .5 .14C.54 .06 .61 0 .71 0C.85 0 1 .12 .99 .32C.98 .6 .72 .8 .5 .98Z" />
          </clipPath>
        </defs>
      </svg>

      <OpeningVeil onOpen={openInvitation} />
      <Petals />

      <div className="shell">
        <main className="page">
          <HeroScene />

          <section className="details">
            <ScratchDate />
            <MeetCouple />
          </section>

          <Celebrations />

          <section className="peach">
            <div className="run">
              <VenueCard />
              <Reveal as="img" className="ornament" src={ornament} alt="" loading="lazy" />
              <RsvpForm />
              <Reveal as="img" className="ornament" src={ornament} alt="" loading="lazy" />
              <Countdown />
            </div>
            <img className="end-scene" src={endScene} alt="An elephant in a lotus lake beside a pavilion" loading="lazy" />
          </section>
        </main>
      </div>

      {!music.broken && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </>
  );
}
