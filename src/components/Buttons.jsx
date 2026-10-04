import { SITE, hasBuyUrl } from '../config/site.js';

export function XGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
    </svg>
  );
}

/** Primary CTA. Points at the official buy link once configured,
 *  otherwise scrolls to the token section (where the CA placeholder lives). */
export function BuyButton({ children = 'BUY $BULLSHIT', className = '' }) {
  const live = hasBuyUrl();
  const external = live ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a
      className={`btn btn--primary ${className}`.trim()}
      href={live ? SITE.buyUrl : '#token'}
      data-text={children}
      {...external}
    >
      <span>{children}</span>
    </a>
  );
}

export function GhostButton({ href, children, className = '' }) {
  return (
    <a className={`btn btn--ghost ${className}`.trim()} href={href} data-text={children}>
      <span>{children}</span>
    </a>
  );
}

export function XButton({ children, className = '', big = false }) {
  return (
    <a
      className={`btn btn--x ${big ? 'btn--big' : ''} ${className}`.trim()}
      href={SITE.xUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-text={children}
    >
      <XGlyph />
      <span>{children}</span>
    </a>
  );
}
