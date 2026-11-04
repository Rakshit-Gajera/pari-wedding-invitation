import { useCallback, useEffect, useRef, useState } from 'react';

/** Looping background music: starts on a tap, fades in, and rests while the page is hidden. */
export function useMusic({ file, volume }) {
  const audioRef = useRef(null);
  const wanted = useRef(false);
  const fade = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}${file}`);
    audio.loop = true;
    audio.preload = 'auto';
    // "playing" only fires once sound is really coming out, so the button never claims otherwise.
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setBroken(true);
    audio.addEventListener('playing', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audioRef.current = audio;

    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (wanted.current) audio.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      audio.removeEventListener('playing', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      clearInterval(fade.current);
    };
  }, [file]);

  // play() has to run inside the tap itself, or phones will refuse to make a sound.
  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wanted.current = true;
    clearInterval(fade.current);
    audio.volume = 0;
    audio.play().catch(() => {
      wanted.current = false;
    });
    fade.current = setInterval(() => {
      const next = Math.min(volume, audio.volume + volume / 24);
      audio.volume = next;
      if (next >= volume) clearInterval(fade.current);
    }, 60);
  }, [volume]);

  const stop = useCallback(() => {
    wanted.current = false;
    clearInterval(fade.current);
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (wanted.current) stop();
    else start();
  }, [start, stop]);

  return { playing, broken, start, toggle };
}
