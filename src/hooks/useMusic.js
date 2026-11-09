import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_RETRIES = 3;

/** Looping background music: starts on a tap, fades in, and rests while the page is hidden. */
export function useMusic({ file, volume }) {
  const audioRef = useRef(null);
  const wanted = useRef(false);
  const fade = useRef(0);
  const retry = useRef(0);
  const retries = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}${file}`);
    audio.loop = true;
    audio.preload = 'auto';
    // "playing" only fires once sound is really coming out, so the button never claims otherwise.
    const onPlay = () => {
      retries.current = 0;
      setBroken(false);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    // A bad connection can fail the download once, so that alone must not end the music for good.
    const onError = () => {
      setBroken(true);
      if (!wanted.current || retries.current >= MAX_RETRIES) return;
      retries.current += 1;
      retry.current = setTimeout(() => {
        audio.load();
        audio.play().catch(() => {});
      }, retries.current * 1000);
    };
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
      clearTimeout(retry.current);
    };
  }, [file]);

  // play() has to run inside the tap itself, or phones will refuse to make a sound.
  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wanted.current = true;
    retries.current = 0;
    clearInterval(fade.current);
    clearTimeout(retry.current);
    audio.volume = 0;
    // A failed download stays failed until it is loaded again.
    if (audio.error) audio.load();
    audio.play().catch((err) => {
      // Only a refusal by the browser means no music. A failed download is retried by onError.
      if (err.name === 'NotAllowedError') wanted.current = false;
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
    clearTimeout(retry.current);
    audioRef.current?.pause();
  }, []);

  // Ask the audio itself, since a phone call or the phone's own rules can pause it without us.
  const toggle = useCallback(() => {
    if (audioRef.current?.paused) start();
    else stop();
  }, [start, stop]);

  return { playing, broken, start, toggle };
}
