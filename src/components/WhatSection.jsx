import bull from '../assets/bull.webp';
import Reveal from './Reveal.jsx';

/** Deterministic stepped (8-bit) chart line so SSR/CSR never differ. */
function stepped(seed, n, w, h) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const step = w / n;
  let y = h * (0.3 + rnd() * 0.4);
  let d = `M0 ${y.toFixed(0)}`;
  for (let i = 1; i <= n; i++) {
    const x = (i * step).toFixed(0);
    d += `H${x}`;
    y = Math.max(8, Math.min(h - 8, y + (rnd() - 0.5) * h * 0.55));
    d += `V${y.toFixed(0)}`;
  }
  return d;
}

const LINES = [
  { d: stepped(7, 16, 600, 400), c: '#ff2a3d', o: 0.9 },
  { d: stepped(21, 14, 600, 400), c: '#8c0f1d', o: 0.9 },
  { d: stepped(33, 18, 600, 400), c: '#f1e8d6', o: 0.35 },
  { d: stepped(48, 12, 600, 400), c: '#37e07a', o: 0.7 },
  { d: stepped(63, 20, 600, 400), c: '#ff2a3d', o: 0.45 },
];

const INDICATORS = ['RSI', 'MACD', 'FIB', 'EMA 200', 'VWAP', 'ICHIMOKU', 'BOLLINGER'];

const QA = [
  { q: 'TA?', a: 'NO.' },
  { q: 'TOKENOMICS?', a: 'NO.' },
  { q: 'FUNDAMENTALS?', a: 'NO.' },
  { q: 'BULLSHIT?', a: 'YES.', yes: true },
];

export default function WhatSection() {
  return (
    <section id="what" className="section what" aria-labelledby="what-title">
      <div className="section__inner what__grid">
        <Reveal className="what__copy">
          <h2 id="what-title" className="h2 glitch" data-text="WHAT THE FUCK IS BULLSHIT?">
            WHAT THE FUCK IS <span className="red">BULLSHIT?</span>
          </h2>
          <p className="lead">BULLSHIT is a stupid bull living in a market full of smart people.</p>
          <p className="stack">
            He doesn&apos;t understand charts.
            <br />
            He doesn&apos;t understand tokenomics.
            <br />
            He doesn&apos;t understand fundamentals.
          </p>
          <p className="lead">But somehow...</p>
          <p className="what__kicker">He&apos;s still bullish.</p>
        </Reveal>

        <Reveal className="what__visual" delay={120}>
          <figure className="panel">
            <div className="panel__screen">
              <svg className="panel__charts" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                <g stroke="#f1e8d6" strokeOpacity=".08" strokeWidth="1">
                  {[50, 100, 150, 200, 250, 300, 350].map((y) => (
                    <path key={y} d={`M0 ${y}H600`} />
                  ))}
                  {[75, 150, 225, 300, 375, 450, 525].map((x) => (
                    <path key={x} d={`M${x} 0V400`} />
                  ))}
                </g>
                {LINES.map((l, i) => (
                  <path key={i} d={l.d} fill="none" stroke={l.c} strokeOpacity={l.o} strokeWidth="3" />
                ))}
              </svg>

              <ul className="panel__tags" aria-hidden="true">
                {INDICATORS.map((t, i) => (
                  <li key={t} style={{ '--i': i }}>
                    {t}
                  </li>
                ))}
              </ul>

              <span className="panel__q panel__q--1" aria-hidden="true">?</span>
              <span className="panel__q panel__q--2" aria-hidden="true">?!</span>
              <span className="panel__q panel__q--3" aria-hidden="true">???</span>

              <div className="panel__bull">
                <img
                  src={bull}
                  width="720"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  alt="BULLSHIT staring blankly at a wall of trading charts"
                />
              </div>
            </div>

            <figcaption>
              <ul className="qa">
                {QA.map(({ q, a, yes }) => (
                  <li key={q} className={yes ? 'qa__yes' : ''}>
                    <span className="qa__q">{q}</span>
                    <b className="qa__a">{a}</b>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
