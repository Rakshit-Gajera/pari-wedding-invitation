import { useEffect, useRef } from 'react';
import { startSky } from '../lib/sky.js';

export default function Petals() {
  const canvas = useRef(null);
  useEffect(() => startSky(canvas.current), []);
  return <canvas ref={canvas} className="petals" aria-hidden="true" />;
}
