import banner from '../assets/banner.webp';
import Candles from './Candles.jsx';
import Reveal from './Reveal.jsx';
import { BuyButton, XButton } from './Buttons.jsx';

export default function BuySection() {
  return (
    <section id="buy" className="buy" aria-labelledby="buy-title">
      <div className="buy__light buy__light--l" aria-hidden="true" />
      <div className="buy__light buy__light--r" aria-hidden="true" />
      <div className="buy__floor" aria-hidden="true">
        <Candles count={18} />
      </div>

      <div className="buy__inner">
        <Reveal className="buy__copy">
          <h2 id="buy-title" className="h2 h2--mega glitch" data-text="READY TO BUY SOME BULLSHIT?">
            READY TO BUY SOME <span className="red">BULLSHIT?</span>
          </h2>
          <p className="buy__sub">You probably shouldn&apos;t.</p>
          <div className="cta-row cta-row--center">
            <BuyButton />
            <XButton>FOLLOW ON X</XButton>
          </div>
        </Reveal>

        <figure className="buy__banner">
          <img
            src={banner}
            width="1600"
            height="533"
            loading="lazy"
            decoding="async"
            alt="BULLSHIT screaming in front of a collapsing red chart"
          />
        </figure>
      </div>
    </section>
  );
}
