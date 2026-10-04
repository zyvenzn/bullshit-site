import { useRef } from 'react';
import bull from '../assets/bull.webp';
import Candles from './Candles.jsx';
import { BuyButton, GhostButton } from './Buttons.jsx';
import { useParallax } from '../hooks.js';

const COINS = [
  { x: '3%', y: '16%', size: 56, d: -34, delay: 0 },
  { x: '84%', y: '10%', size: 44, d: 28, delay: 0.8 },
  { x: '90%', y: '58%', size: 60, d: -18, delay: 1.4 },
  { x: '8%', y: '70%', size: 40, d: 22, delay: 2.1 },
];

const FRAGMENTS = [
  { t: '$BULLSHIT', x: '52%', y: '2%', d: -40, r: -8 },
  { t: '$BULLSH', x: '-2%', y: '44%', d: 30, r: 6 },
  { t: '$BULL', x: '76%', y: '88%', d: -26, r: 10 },
  { t: 'SHIT$', x: '28%', y: '92%', d: 20, r: -6 },
];

const GLITCH = [
  [12, 30, 42, 6, 0],
  [78, 22, 30, 5, 0.7],
  [64, 74, 54, 6, 1.3],
  [20, 84, 36, 5, 1.9],
  [90, 40, 24, 5, 2.4],
  [40, 12, 28, 4, 3],
];

export default function Hero() {
  const ref = useRef(null);
  useParallax(ref);

  return (
    <section id="hero" className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">THE MARKET&apos;S STUPIDEST BULL</p>

        <h1 id="hero-title" className="hero__title" aria-label="BULLSHIT">
          <span className="glitch" data-text="BULL" aria-hidden="true">
            BULL
          </span>
          <span className="glitch glitch--red" data-text="SHIT" aria-hidden="true">
            SHIT
          </span>
        </h1>

        <p className="hero__tagline">
          NO UTILITY.
          <br />
          JUST BULLSHIT.
        </p>
        <p className="hero__sub">A stupid bull living in a market full of smart people.</p>

        <div className="cta-row">
          <BuyButton />
          <GhostButton href="#what">ENTER THE BULLSHIT</GhostButton>
        </div>
      </div>

      <div className="hero__stage">
        <div className="hero__glow" aria-hidden="true" />

        <div className="layer hero__candles" style={{ '--d': 14 }} aria-hidden="true">
          <Candles count={12} />
        </div>

        <div className="layer hero__chart" style={{ '--d': -22 }} aria-hidden="true">
          <svg viewBox="0 0 320 140" fill="none">
            <path d="M0 30L40 46L66 38L104 78L132 66L160 104" stroke="#ff2a3d" strokeWidth="4" strokeLinejoin="miter" />
            <path d="M176 112L196 100L220 124L244 96L268 132L320 122" stroke="#ff2a3d" strokeWidth="4" strokeDasharray="6 8" opacity=".6" />
            <path d="M160 104l8 8" stroke="#ff2a3d" strokeWidth="4" />
          </svg>
        </div>

        {COINS.map((c, i) => (
          <div
            key={i}
            className="layer coin-wrap"
            style={{ left: c.x, top: c.y, '--d': c.d, '--s': `${c.size}px` }}
            aria-hidden="true"
          >
            <span className="coin" style={{ animationDelay: `${c.delay}s` }}>
              $
            </span>
          </div>
        ))}

        {FRAGMENTS.map((f, i) => (
          <div key={i} className="layer frag-wrap" style={{ left: f.x, top: f.y, '--d': f.d }} aria-hidden="true">
            <span className="frag" style={{ '--r': `${f.r}deg`, animationDelay: `${i * 0.6}s` }}>
              {f.t}
            </span>
          </div>
        ))}

        {GLITCH.map(([x, y, w, h, delay], i) => (
          <span
            key={i}
            className="glitch-bit"
            style={{ left: `${x}%`, top: `${y}%`, width: w, height: h, animationDelay: `${delay}s` }}
            aria-hidden="true"
          />
        ))}

        <div className="layer hero__bull" style={{ '--d': 10 }}>
          <div className="bounce">
            <figure className="frame">
              <img
                src={bull}
                width="720"
                height="720"
                alt="BULLSHIT, the stupid bull with a toilet paper roll on his head"
                fetchpriority="high"
                decoding="async"
              />
              <span className="frame__scan" aria-hidden="true" />
              <figcaption className="frame__tag" aria-hidden="true">BULLSHIT.PNG</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
