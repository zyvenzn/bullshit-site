import { useEffect, useState } from 'react';
import { SITE } from '../config/site.js';
import './Countdown.css';

const pad = (n) => String(n).padStart(2, '0');

function getLeft(target) {
  const s = Math.floor(Math.max(0, target - Date.now()) / 1000);
  return {
    done: s === 0,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Countdown() {
  const target = new Date(SITE.launchAt).getTime();
  const [left, setLeft] = useState(() => getLeft(target));

  useEffect(() => {
    if (Number.isNaN(target)) return undefined;
    const id = setInterval(() => setLeft(getLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (Number.isNaN(target)) return null;

  return (
    <section className="cd" aria-label="Launch countdown">
      <p className="cd__eyebrow">LAUNCH · 1 NOV 2026 · 14:00 UTC</p>
      {left.done ? (
        <p className="cd__done">THE TIME HAS COME. WATCH X FOR THE OFFICIAL LAUNCH.</p>
      ) : (
        <div className="cd__row" role="timer">
          {[['DAYS', left.d], ['HRS', left.h], ['MIN', left.m], ['SEC', left.s]].map(([l, v]) => (
            <div className="cd__box" key={l}>
              <span className="cd__num">{pad(v)}</span>
              <span className="cd__lbl">{l}</span>
            </div>
          ))}
        </div>
      )}
      <p className="cd__note">Target time, may change. Not financial advice.</p>
    </section>
  );
}