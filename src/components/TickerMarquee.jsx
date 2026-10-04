const ITEMS = [
  '$BULLSHIT',
  'NO UTILITY',
  'JUST BULLSHIT',
  'STAY STUPID',
  'STAY BULLISH',
  '$BULLSHIT',
  'NO UTILITY',
  'JUST BULLSHIT',
];

function Run({ hidden }) {
  return (
    <ul className="marquee__run" aria-hidden={hidden || undefined}>
      {ITEMS.map((t, i) => (
        <li key={i} className={t.startsWith('$') ? 'is-ticker' : ''}>
          {t}
          <span className="marquee__sep" aria-hidden="true">
            ■
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TickerMarquee() {
  return (
    <div className="marquee" role="marquee" aria-label="NO UTILITY. JUST BULLSHIT.">
      <div className="marquee__track">
        <Run />
        <Run hidden />
        <Run hidden />
      </div>
    </div>
  );
}
