import { useEffect, useRef, useState } from 'react';
import { burst } from '../lib/sky.js';

const WIDTH = 200;
const HEIGHT = 190;
const CLEARED_ENOUGH = 0.36;
const ENOUGH_RUBS = 3;

function paintFoil(canvas) {
  const ctx = canvas.getContext('2d');
  const foil = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  foil.addColorStop(0, '#F7DFA2');
  foil.addColorStop(0.35, '#D9A441');
  foil.addColorStop(0.6, '#FBE7B0');
  foil.addColorStop(1, '#B9832A');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = foil;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(255,250,225,.5)';
  for (let i = 0; i < 90; i += 1) ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 2, 2);
  ctx.globalCompositeOperation = 'destination-out';
}

function clearedShare(canvas) {
  const { data } = canvas.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT);
  let clear = 0;
  let total = 0;
  for (let i = 3; i < data.length; i += 32) {
    total += 1;
    if (data[i] < 40) clear += 1;
  }
  return clear / total;
}

/** One heart of gold foil that a finger rubs away to show part of the date. */
export default function ScratchHeart({ label, value, onReveal }) {
  const canvasRef = useRef(null);
  const rubbing = useRef(false);
  const rubs = useRef(0);
  const [state, setState] = useState('covered');

  useEffect(() => paintFoil(canvasRef.current), []);

  function reveal() {
    if (state !== 'covered') return;
    setState('clearing');
    const box = canvasRef.current.getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, 20);
    onReveal();
    setTimeout(() => setState('open'), 520);
  }

  function wipe(event) {
    const canvas = canvasRef.current;
    const box = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(((event.clientX - box.left) / box.width) * WIDTH, ((event.clientY - box.top) / box.height) * HEIGHT, 36, 0, Math.PI * 2);
    ctx.fill();
  }

  function finishRub() {
    if (!rubbing.current) return;
    rubbing.current = false;
    rubs.current += 1;
    if (rubs.current >= ENOUGH_RUBS || clearedShare(canvasRef.current) > CLEARED_ENOUGH) reveal();
  }

  return (
    <div className="heart">
      <div className="heart__face">
        <span className="heart__label">{label}</span>
        <span className="heart__value">{value}</span>
        {state !== 'open' && (
          <canvas
            ref={canvasRef}
            className={state === 'clearing' ? 'heart__foil heart__foil--clearing' : 'heart__foil'}
            width={WIDTH}
            height={HEIGHT}
            role="button"
            tabIndex={0}
            aria-label={`Scratch to reveal the ${label.toLowerCase()}`}
            onPointerDown={(event) => {
              rubbing.current = true;
              event.currentTarget.setPointerCapture?.(event.pointerId);
              wipe(event);
            }}
            onPointerMove={(event) => {
              if (rubbing.current) wipe(event);
            }}
            onPointerUp={finishRub}
            onPointerCancel={finishRub}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                reveal();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
