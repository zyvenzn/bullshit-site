// Bull Detector page (/scan). Written with createElement (no JSX) on purpose,
// so the file can be syntax-checked with plain Node.
import { createElement as h, useEffect, useRef, useState } from 'react';
import avatar from '../assets/bull-avatar.webp';
import { SITE } from '../config/site.js';
import './Scan.css';

const B58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const LOADING = [
  'Bull is staring at the wallet...',
  'Bull is reading the creator\u2019s history...',
  'Bull is counting the holders...',
  'Bull is judging silently...',
];

const usd = (n) => {
  if (n === null || n === undefined) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};
const price = (n) => {
  if (n === null || n === undefined) return null;
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${Number(n.toPrecision(3)).toString()}`;
};
const pct = (n) => (n === null || n === undefined ? null : `${n > 0 ? '+' : ''}${n.toFixed(1)}%`);
const age = (hrs) => {
  if (hrs === null || hrs === undefined) return null;
  if (hrs < 1) return `${Math.max(1, Math.round(hrs * 60))} min`;
  if (hrs < 48) return `${Math.round(hrs)} hrs`;
  return `${Math.round(hrs / 24)} days`;
};
const short = (a) => (a && a.length > 10 ? `${a.slice(0, 4)}\u2026${a.slice(-4)}` : a || '');
const tone = (lvl) => (lvl < 20 ? 0 : lvl < 40 ? 1 : lvl < 60 ? 2 : lvl < 80 ? 3 : 4);

const Ext = (props, ...kids) => h('a', { target: '_blank', rel: 'noopener noreferrer', ...props }, ...kids);
const wallet = (a) => Ext({ className: 'sc__addr', href: `https://solscan.io/account/${a}` }, short(a));

function Stat(label, value, cls) {
  if (value === null || value === undefined) return null;
  return h('div', { className: 'sc__stat', key: label }, h('span', { className: 'sc__stat-l' }, label), h('b', { className: cls || '' }, value));
}

function Meter(r) {
  const t = tone(r.level);
  return h(
    'section',
    { className: `sc__meter sc__t${t}`, 'aria-label': 'Bullshit level' },
    h('div', { className: 'sc__meter-top' },
      h('div', { className: 'sc__score' }, h('b', null, r.level), h('span', null, '/100')),
      h('div', { className: 'sc__grade' }, h('small', null, 'BULLSHIT LEVEL'), h('strong', null, r.grade))
    ),
    h('div', { className: 'sc__gauge', role: 'img', 'aria-label': `${r.level} out of 100` }, h('i', { style: { width: `${Math.max(3, r.level)}%` } })),
    h('div', { className: 'sc__verdict' },
      h('img', { src: avatar, width: 44, height: 44, alt: '', decoding: 'async' }),
      h('p', null, '\u201C', r.verdict, '\u201D')
    ),
    r.note ? h('p', { className: 'sc__note' }, r.note) : null
  );
}

function Findings(r) {
  const icon = { bad: '\u2715', warn: '!', ok: '\u2713', info: 'i' };
  return h('section', { className: 'sc__card' },
    h('h3', null, 'WHAT BULL FOUND'),
    h('ul', { className: 'sc__finds' },
      r.findings.map((f) =>
        h('li', { key: f.id, className: `sc__f sc__f--${f.level}` },
          h('span', { className: 'sc__ico', 'aria-hidden': 'true' }, icon[f.level] || '?'),
          h('div', null,
            h('p', null, f.text),
            f.bull ? h('em', null, f.bull) : null
          )
        )
      )
    )
  );
}

function Holders(r) {
  const rows = r.holders.top;
  if (!rows.length) return null;
  return h('section', { className: 'sc__card' },
    h('h3', null, 'TOP HOLDERS'),
    h('p', { className: 'sc__muted' }, `Top 10 together: ${r.holders.top10Pct}%. Liquidity pools are excluded when detected.`),
    h('ol', { className: 'sc__holders' },
      rows.map((x, i) =>
        h('li', { key: x.address },
          h('span', { className: 'sc__rank' }, i + 1),
          wallet(x.address),
          x.isCreator ? h('span', { className: 'sc__tag sc__tag--c' }, 'CREATOR') : null,
          x.insider ? h('span', { className: 'sc__tag sc__tag--i' }, 'INSIDER') : null,
          h('b', null, `${x.pct}%`)
        )
      )
    )
  );
}

function Creator(r) {
  const c = r.creator;
  if (!c) return null;
  const p = c.previous;
  let line = 'Bull could not load this creator\u2019s history.';
  if (p.total === 0) line = p.available ? 'No earlier tokens found for this creator.' : 'The data source did not provide this creator\u2019s history, so Bull could not check it.';
  else if (p.known) line = `${p.total} earlier token${p.total > 1 ? 's' : ''}: ${p.alive} alive, ${p.dead} dead (under $2K liquidity).`;
  else line = `${p.total} earlier token${p.total > 1 ? 's' : ''} found, status unknown.`;
  return h('section', { className: 'sc__card' },
    h('h3', null, 'THE CREATOR'),
    h('p', { className: 'sc__creator' }, 'Wallet ', wallet(c.address), c.holdsPct !== null && c.holdsPct !== undefined ? ` \u2022 holds ${c.holdsPct}% of supply` : ''),
    h('p', { className: 'sc__muted' }, line),
    p.list.length
      ? h('ul', { className: 'sc__prev' },
          p.list.slice(0, 12).map((t) =>
            h('li', { key: t.mint, className: `sc__prev-${t.status}` },
              Ext({ href: `https://dexscreener.com/solana/${t.mint}` }, t.symbol ? `$${t.symbol}` : short(t.mint)),
              h('span', null, t.status === 'dead' ? 'DEAD' : usd(t.liquidityUsd) + ' liq')
            )
          )
        )
      : null
  );
}

function Result(r, onCopy, copied) {
  const m = r.market;
  const buys = m && m.buys24h !== null && m.sells24h !== null ? `${m.buys24h} / ${m.sells24h}` : null;
  return h('div', { className: 'sc__result' },
    h('header', { className: 'sc__head' },
      h('div', { className: 'sc__id' },
        m && m.image
          ? h('img', {
              className: 'sc__logo-img',
              src: m.image,
              alt: '',
              width: 56,
              height: 56,
              referrerPolicy: 'no-referrer',
              onError: (e) => { e.currentTarget.style.display = 'none'; },
            })
          : null,
        h('div', null,
          h('h2', null, r.symbol ? `$${r.symbol}` : 'UNKNOWN TOKEN'),
          h('p', { className: 'sc__muted' }, r.name || '', r.name ? ' \u2022 ' : '', short(r.ca))
        )
      ),
      h('div', { className: 'sc__links' },
        m && m.url ? Ext({ href: m.url }, 'DEXSCREENER') : null,
        Ext({ href: `https://solscan.io/token/${r.ca}` }, 'SOLSCAN'),
        h('button', { type: 'button', onClick: onCopy }, copied ? 'COPIED' : 'COPY LINK')
      )
    ),
    r.confidence === 'partial'
      ? h('p', { className: 'sc__warn' }, 'Only one data source answered. Treat this score with extra suspicion.')
      : null,
    Meter(r),
    m
      ? h('section', { className: 'sc__stats' },
          Stat('PRICE', price(m.priceUsd)),
          Stat('MARKET CAP', usd(m.marketCap)),
          Stat('LIQUIDITY', usd(m.liquidityUsd)),
          Stat('VOLUME 24H', usd(m.volume24h)),
          Stat('BUYS / SELLS 24H', buys),
          Stat('PAIR AGE', age(m.ageHours)),
          Stat('CHANGE 1H', pct(m.change1h), m.change1h < 0 ? 'neg' : 'pos'),
          Stat('CHANGE 24H', pct(m.change24h), m.change24h < 0 ? 'neg' : 'pos')
        )
      : null,
    Findings(r),
    Creator(r),
    Holders(r)
  );
}

export default function ScanPage() {
  const [ca, setCa] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    if (state !== 'loading') return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, [state]);

  async function run(value) {
    const addr = value.trim();
    if (!B58.test(addr)) {
      setState('error');
      setErr('That does not look like a Solana contract address.');
      return;
    }
    const mine = ++seq.current;
    setState('loading');
    setTick(0);
    setErr('');
    try {
      const res = await fetch(`/api/scan?ca=${encodeURIComponent(addr)}`);
      const body = await res.json().catch(() => ({}));
      if (mine !== seq.current) return;
      if (!res.ok) {
        setState('error');
        setErr(body.error || 'Bull tripped over something. Try again.');
        return;
      }
      setData(body);
      setState('done');
      try {
        window.history.replaceState(null, '', `/scan?ca=${addr}`);
      } catch {
        /* ignore */
      }
    } catch {
      if (mine !== seq.current) return;
      setState('error');
      setErr('Could not reach the detector. Check your connection and try again.');
    }
  }

  useEffect(() => {
    let q = '';
    try {
      q = new URLSearchParams(window.location.search).get('ca') || '';
    } catch {
      q = '';
    }
    if (q) {
      setCa(q);
      run(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyLink() {
    try {
      const url = `${window.location.origin}/scan?ca=${data.ca}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } catch {
      /* clipboard blocked */
    }
  }

  return h('div', { className: 'sc' },
    h('header', { className: 'sc__bar' },
      h('a', { className: 'sc__logo', href: '/' }, h('span', { className: 'nav__dot', 'aria-hidden': 'true' }), 'BULLSHIT'),
      h('a', { className: 'sc__back', href: '/' }, '\u2190 BACK TO THE BULLSHIT')
    ),
    h('main', { className: 'sc__main' },
      h('p', { className: 'eyebrow' }, 'BULL DETECTOR'),
      h('h1', { className: 'sc__title' }, 'PASTE A CA.', h('br'), h('span', { className: 'red' }, 'BULL WILL JUDGE IT.')),
      h('p', { className: 'sc__lead' }, 'Bull reads the creator\u2019s history, the holders and the liquidity. Then he tells you exactly what he thinks of it.'),
      h('form', { className: 'sc__form', onSubmit: (e) => { e.preventDefault(); run(ca); } },
        h('input', {
          type: 'text',
          value: ca,
          onChange: (e) => setCa(e.target.value),
          placeholder: 'Solana contract address',
          'aria-label': 'Solana contract address',
          autoComplete: 'off',
          autoCapitalize: 'off',
          spellCheck: false,
        }),
        h('button', { type: 'submit', disabled: state === 'loading' }, state === 'loading' ? 'SCANNING...' : 'SCAN')
      ),
      state === 'loading' ? h('p', { className: 'sc__loading', role: 'status' }, LOADING[tick % LOADING.length]) : null,
      state === 'error' ? h('p', { className: 'sc__error', role: 'alert' }, err) : null,
      state === 'done' && data ? Result(data, copyLink, copied) : null,
      h('p', { className: 'sc__disclaimer' },
        'Bull\u2019s opinion comes from public on-chain data and rule-based checks (DexScreener, RugCheck). It can be wrong. It flags patterns, not people. Not financial advice. Do your own research.'
      )
    ),
    h('footer', { className: 'sc__foot' },
      Ext({ href: SITE.xUrl }, 'X'),
      Ext({ href: SITE.telegramUrl }, 'TELEGRAM'),
      h('a', { href: '/' }, 'HOME')
    )
  );
}
