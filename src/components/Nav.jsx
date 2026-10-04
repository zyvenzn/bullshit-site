import { useEffect, useState } from 'react';
import { SITE, hasBuyUrl } from '../config/site.js';

const LINKS = [
  { href: '#what', label: 'WTF' },
  { href: '#lore', label: 'LORE' },
  { href: '#multiverse', label: 'MEMES' },
  { href: '#x', label: 'X' },
  { href: '#token', label: 'TOKEN' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const buyHref = hasBuyUrl() ? SITE.buyUrl : '#token';
  const buyExternal = hasBuyUrl() ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar">
        <a className="nav__logo" href="#hero" aria-label="BULLSHIT home" onClick={() => setOpen(false)}>
          <span className="nav__dot" aria-hidden="true" />
          BULLSHIT
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className="nav__buy" href={buyHref} {...buyExternal}>
          BUY
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav id="mobile-menu" className="nav__menu" aria-label="Mobile" hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="nav__menu-buy" href={buyHref} {...buyExternal} onClick={() => setOpen(false)}>
          BUY $BULLSHIT
        </a>
      </nav>
    </header>
  );
}
