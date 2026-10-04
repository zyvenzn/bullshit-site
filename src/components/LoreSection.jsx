import { useRef } from 'react';
import bull from '../assets/bull.webp';
import Reveal from './Reveal.jsx';
import { useScrollProgress } from '../hooks.js';

export default function LoreSection() {
  const ref = useRef(null);
  useScrollProgress(ref);

  return (
    <section id="lore" className="lore" ref={ref} aria-labelledby="lore-title">
      <div className="lore__bg" aria-hidden="true">
        <img className="lore__bull" src={bull} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="lore__vignette" aria-hidden="true" />

      <div className="lore__inner">
        <Reveal>
          <p className="eyebrow">CHAPTER 01</p>
          <h2 id="lore-title" className="h2 h2--xl glitch" data-text="THE LORE">
            THE <span className="red">LORE</span>
          </h2>
        </Reveal>

        <Reveal as="p" className="lore__line lore__line--dim">
          In a market full of analysts, KOLs, charts, whitepapers and people pretending they know what&apos;s going on...
        </Reveal>

        <Reveal as="p" className="lore__line lore__line--big">
          One bull knew nothing.
        </Reveal>

        <Reveal as="p" className="lore__line lore__line--big">
          That bull was <em>BULLSHIT</em>.
        </Reveal>

        <Reveal as="p" className="lore__line">
          He couldn&apos;t read a chart.
          <br />
          He couldn&apos;t understand tokenomics.
          <br />
          He couldn&apos;t explain his thesis.
        </Reveal>

        <Reveal as="p" className="lore__line lore__line--dim">
          But every time the market moved...
        </Reveal>

        <Reveal as="p" className="lore__line lore__line--big">
          He was there.
        </Reveal>

        <div className="lore__beats">
          <Reveal className="beat">
            <span className="beat__q">
              <i className="beat__candle beat__candle--g" aria-hidden="true" />
              Green candle?
            </span>
            <span className="beat__a">BULLISH.</span>
          </Reveal>
          <Reveal className="beat" delay={90}>
            <span className="beat__q">
              <i className="beat__candle" aria-hidden="true" />
              Red candle?
            </span>
            <span className="beat__a">HEALTHY CORRECTION.</span>
          </Reveal>
          <Reveal className="beat beat--doom" delay={180}>
            <span className="beat__q">
              <i className="beat__candle beat__candle--deep" aria-hidden="true" />
              -99%?
            </span>
            <span className="beat__a">
              <span className="beat__dots" aria-hidden="true">...</span>
              BULLSHIT.
            </span>
          </Reveal>
        </div>

        <Reveal as="p" className="lore__final">
          NO MATTER WHAT HAPPENS,
          <br />
          <span className="glitch glitch--red" data-text="BULLSHIT REMAINS BULLSHIT.">
            BULLSHIT REMAINS BULLSHIT.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
