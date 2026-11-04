/* Pale blossoms drifting over the page, and the gold sparks thrown when a heart is revealed. */
let ctx = null;
let width = 0;
let height = 0;
let flakes = [];
let sparks = [];
let sprites = [];
let frame = 0;

const SPARK_COLOURS = ['#E7B745', '#FFD76A', '#F08AA8', '#FFF2C4'];

function blossom(colour) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 48;
  const c = sprite.getContext('2d');
  c.translate(24, 24);
  c.fillStyle = colour;
  for (let i = 0; i < 5; i += 1) {
    c.rotate(Math.PI * 0.4);
    c.beginPath();
    c.ellipse(0, -11, 6.6, 10.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = 'rgba(255,240,215,.9)';
  c.beginPath();
  c.arc(0, 0, 3.4, 0, Math.PI * 2);
  c.fill();
  return sprite;
}

function newFlake(fromTop) {
  return {
    x: Math.random() * width,
    y: fromTop ? -30 : Math.random() * height,
    size: 11 + Math.random() * 13,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.012,
    fall: 0.22 + Math.random() * 0.34,
    sway: Math.random() * Math.PI * 2,
    sprite: sprites[Math.floor(Math.random() * sprites.length)]
  };
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  flakes.forEach((f) => {
    f.y += f.fall;
    f.sway += 0.012;
    f.x += Math.sin(f.sway) * 0.28;
    f.angle += f.spin;
    if (f.y > height + 30) Object.assign(f, newFlake(true));
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.angle);
    ctx.drawImage(f.sprite, -f.size / 2, -f.size / 2, f.size, f.size);
    ctx.restore();
  });
  sparks = sparks.filter((p) => p.life > 0);
  sparks.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life -= 0.018;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.colour;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  frame = requestAnimationFrame(draw);
}

function fit(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

/** Starts the sky on a canvas and returns a function that stops it. */
export function startSky(canvas) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  ctx = canvas.getContext('2d');
  sprites = ['rgba(236,170,160,.4)', 'rgba(244,196,170,.4)', 'rgba(250,214,190,.46)'].map(blossom);
  const onResize = () => fit(canvas);
  fit(canvas);
  flakes = Array.from({ length: 16 }, () => newFlake(false));
  frame = requestAnimationFrame(draw);
  window.addEventListener('resize', onResize);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', onResize);
    ctx = null;
    sparks = [];
  };
}

/** Throws a handful of gold sparks from a point on screen. */
export function burst(x, y, count = 26) {
  if (!ctx) return;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3.4;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1,
      colour: SPARK_COLOURS[i % SPARK_COLOURS.length]
    });
  }
}
