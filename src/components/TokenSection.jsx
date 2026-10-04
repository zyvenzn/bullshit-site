import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { SITE, CA_PLACEHOLDER, hasContract } from '../config/site.js';

export default function TokenSection() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const live = hasContract();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(SITE.contractAddress.trim());
    } catch {
      const ta = document.createElement('textarea');
      ta.value = SITE.contractAddress.trim();
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const rows = [
    ['NAME', SITE.name],
    ['TICKER', SITE.ticker],
    ['NETWORK', SITE.network],
  ];

  return (
    <section id="token" className="section token" aria-labelledby="token-title">
      <div className="section__inner">
        <Reveal>
          <p className="eyebrow">TOKEN</p>
          <h2 id="token-title" className="h2 h2--xl">
            THE <span className="red">BULLSHIT</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="term">
            <div className="term__bar" aria-hidden="true">
              <i /><i /><i />
              <span>bullshit.sol ~ token.info</span>
            </div>

            <dl className="term__body">
              {rows.map(([k, v]) => (
                <div className="term__row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}

              <div className="term__row term__row--ca">
                <dt>CONTRACT ADDRESS</dt>
                <dd>
                  {live ? (
                    <code className="ca">{SITE.contractAddress}</code>
                  ) : (
                    <span className="ca ca--soon">
                      {CA_PLACEHOLDER}
                      <span className="caret" aria-hidden="true" />
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="term__actions">
              <button
                type="button"
                className="btn btn--copy"
                onClick={copy}
                disabled={!live}
                aria-disabled={!live}
                title={live ? 'Copy contract address' : 'No contract address yet'}
              >
                <span>{copied ? 'COPIED!' : 'COPY CA'}</span>
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Contract address copied' : ''}
              </span>
              {!live && <span className="term__hint">Disabled until a real contract address is published.</span>}
            </div>
          </div>
        </Reveal>

        <p className="disclaimer">
          $BULLSHIT is a meme token. Nothing on this website should be interpreted as financial advice or a promise of
          profit.
        </p>
      </div>
    </section>
  );
}
