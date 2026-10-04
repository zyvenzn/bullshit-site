import { useEffect, useRef } from 'react';
import { hasFinePointer, prefersReducedMotion } from '../hooks.js';

/**
 * Cursor-reactive embers. A small canvas that only runs its animation loop
 * while particles are alive. Disabled on touch devices and for users who
 * prefer reduced motion, so mobile stays light.
 */
export default function CursorSparks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasFinePointer() || prefersReducedMotion()) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    const parts = [];
    const MAX = 70;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (t) => {
      const dt = Math.min((t - last) / 16.67, 3) || 1;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.022 * dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        p.vy += 0.05 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };

    const spawn = (x, y) => {
      for (let i = 0; i < 2 && parts.length < MAX; i++) {
        parts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -Math.random() * 1.2,
          s: Math.random() < 0.3 ? 5 : 3,
          c: Math.random() < 0.7 ? '#ff2a3d' : '#f1e8d6',
          life: 0.9 + Math.random() * 0.3,
        });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    let lastSpawn = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - lastSpawn < 28) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="sparks" aria-hidden="true" />;
}
