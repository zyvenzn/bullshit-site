import { SITE, hasBuyUrl } from '../config/site.js';

export default function Footer() {
  const buyHref = hasBuyUrl() ? SITE.buyUrl : '#token';
  const buyExternal = hasBuyUrl() ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a className="footer__logo" href="#hero" aria-label="BULLSHIT, back to top">
            BULL<span>SHIT</span>
          </a>
          <p>No utility. Just bullshit.</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href={SITE.xUrl} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href={buyHref} {...buyExternal}>
            Buy
          </a>
          <a href="#token">Token</a>
        </nav>
      </div>

      <p className="footer__disclaimer">
        $BULLSHIT is a meme project created for entertainment and community culture. Crypto assets are volatile and
        speculative. Do your own research.
      </p>
    </footer>
  );
}
