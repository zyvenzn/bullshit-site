// Pure analysis logic for the Bull detector. No network here, so it is easy to test.
// Inputs come from DexScreener (pairs) and RugCheck (report). Every field is read
// defensively because third-party APIs change shape without warning.

const B58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export const isValidMint = (s) => typeof s === 'string' && B58.test(s);

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v) => (typeof v === 'string' && v.length ? v : null);
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const DEAD_LIQ_USD = 2000; // below this a token counts as "no real liquidity"

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const pick = (arr, seed, salt = 0) => arr[(seed + salt) % arr.length];

/** DexScreener answers either [] / [pair...] (new) or { pairs: [...] } (old). */
export function toPairs(x) {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.pairs)) return x.pairs;
  return [];
}

function bestPair(pairs) {
  let best = null;
  for (const p of pairs) {
    const liq = num(p?.liquidity?.usd) ?? 0;
    if (!best || liq > (num(best?.liquidity?.usd) ?? 0)) best = p;
  }
  return best;
}

/** Mints of the creator's earlier tokens, taken from the RugCheck report. */
export function extractCreatorMints(rug, ca) {
  const raw = rug?.creatorTokens;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.tokens) ? raw.tokens : [];
  const out = [];
  for (const t of list) {
    const m = typeof t === 'string' ? t : str(t?.mint) || str(t?.address);
    if (m && m !== ca && isValidMint(m) && !out.includes(m)) out.push(m);
  }
  return out.slice(0, 30);
}

function previousTokens(mints, creatorPairs) {
  if (!mints.length) return { total: 0, known: false, dead: 0, alive: 0, list: [] };
  if (!creatorPairs) return { total: mints.length, known: false, dead: 0, alive: 0, list: [] };
  const byMint = new Map();
  for (const p of creatorPairs) {
    const m = str(p?.baseToken?.address);
    if (!m) continue;
    (byMint.get(m) || byMint.set(m, []).get(m)).push(p);
  }
  let dead = 0;
  const list = mints.map((mint) => {
    const best = bestPair(byMint.get(mint) || []);
    const liq = num(best?.liquidity?.usd) ?? 0;
    const isDead = !best || liq < DEAD_LIQ_USD;
    if (isDead) dead++;
    return {
      mint,
      symbol: str(best?.baseToken?.symbol),
      liquidityUsd: best ? liq : 0,
      status: isDead ? 'dead' : 'alive',
    };
  });
  return { total: mints.length, known: true, dead, alive: mints.length - dead, list };
}

function topHolders(rug, excluded, creator) {
  const raw = Array.isArray(rug?.topHolders) ? rug.topHolders : [];
  let rows = raw.map((h) => ({
    address: str(h?.owner) || str(h?.address),
    account: str(h?.address),
    pct: num(h?.pct),
    insider: !!h?.insider,
  }));
  // Some versions return fractions (0.08) instead of percents (8). A top-20 list that
  // sums to about 1 or less cannot be percents, so scale it.
  const sum = rows.reduce((a, r) => a + (r.pct || 0), 0);
  if (rows.length >= 5 && sum > 0 && sum <= 1.05) rows = rows.map((r) => ({ ...r, pct: (r.pct || 0) * 100 }));
  rows = rows.filter((r) => r.pct !== null && r.address);
  const real = rows.filter((r) => r.pct >= 0.01 && !excluded.has(r.address) && !excluded.has(r.account));
  const top = real.slice(0, 10).map((r) => ({
    address: r.address,
    pct: Math.round(r.pct * 100) / 100,
    insider: r.insider,
    isCreator: !!creator && r.address === creator,
  }));
  const top10Pct = Math.round(top.reduce((a, r) => a + r.pct, 0) * 100) / 100;
  return { top, top10Pct, topPct: top.length ? top[0].pct : 0, hadData: rows.length > 0 };
}

const GRADES = [
  [20, 'NO STRUCTURAL RED FLAGS', [
    "Clean. Rare. Bull is almost impressed. Almost.",
    "Bull found nothing. He is suspicious of that, too.",
  ]],
  [40, 'MILD BULLSHIT', [
    "Not terrible. Not trustworthy either. Bull stays neutral.",
    "A few flags. Bull has seen worse. Bull has seen better.",
  ]],
  [60, 'SUSPICIOUS', [
    "Bull smells something. Read the holders before you read the hype.",
    "Half of this is fine. The other half is why Bull is looking.",
  ]],
  [80, 'HEAVY BULLSHIT', [
    "Plenty of red flags. Bull has seen this movie. It ends the same way.",
    "Bull would think twice. Then a third time.",
  ]],
  [101, 'MAXIMUM BULLSHIT', [
    "Pure bullshit. Bull would not touch this, and Bull has no hands.",
    "Every flag is up. Bull is not even mad. Just disappointed.",
  ]],
];

export function analyze({ ca, pairs = [], rug = null, creatorPairs = null, now = Date.now() }) {
  const seed = hash(ca);
  const pair = bestPair(pairs);
  const haveDex = !!pair;
  const haveRug = !!rug && typeof rug === 'object';

  const creator = str(rug?.creator);
  const excluded = new Set();
  if (str(pair?.pairAddress)) excluded.add(pair.pairAddress);
  for (const m of Array.isArray(rug?.markets) ? rug.markets : []) {
    for (const k of ['pubkey', 'liquidityA', 'liquidityB', 'mintLP']) if (str(m?.[k])) excluded.add(m[k]);
    if (str(m?.lp?.lpMint)) excluded.add(m.lp.lpMint);
  }

  const holders = topHolders(rug, excluded, creator);
  const mints = extractCreatorMints(rug, ca);
  const prev = previousTokens(mints, creatorPairs);
  const creatorTokensAvailable = !!rug && rug.creatorTokens !== undefined && rug.creatorTokens !== null;

  const createdAt = num(pair?.pairCreatedAt);
  const market = haveDex
    ? {
        priceUsd: str(pair.priceUsd) ? Number(pair.priceUsd) : null,
        marketCap: num(pair.marketCap) ?? num(pair.fdv),
        fdv: num(pair.fdv),
        liquidityUsd: num(pair?.liquidity?.usd),
        volume24h: num(pair?.volume?.h24),
        buys24h: num(pair?.txns?.h24?.buys),
        sells24h: num(pair?.txns?.h24?.sells),
        change1h: num(pair?.priceChange?.h1),
        change24h: num(pair?.priceChange?.h24),
        ageHours: createdAt ? Math.max(0, (now - createdAt) / 36e5) : null,
        dex: str(pair.dexId),
        url: str(pair.url),
        image: str(pair?.info?.imageUrl),
      }
    : null;

  const mintActive = haveRug ? !!str(rug.mintAuthority) : null;
  const freezeActive = haveRug ? !!str(rug.freezeAuthority) : null;
  const lp0 = Array.isArray(rug?.markets) ? rug.markets.find((m) => num(m?.lp?.lpLockedPct) !== null) : null;
  const lpLockedPct = lp0 ? num(lp0.lp.lpLockedPct) : null;
  const rugged = haveRug ? !!rug.rugged : false;
  const insiders = haveRug ? num(rug.graphInsidersDetected) || 0 : 0;
  const totalHolders = haveRug ? num(rug.totalHolders) : null;
  const creatorHolds = holders.top.find((h) => h.isCreator)?.pct ?? null;

  const rugRisks = (Array.isArray(rug?.risks) ? rug.risks : [])
    .map((r) => ({ name: str(r?.name), level: str(r?.level), description: str(r?.description) }))
    .filter((r) => r.name);

  // ── scoring ─────────────────────────────────────────────
  let score = 0;
  let dead = false;
  const findings = [];
  const add = (id, level, points, text, bullLines) => {
    score += points;
    findings.push({ id, level, text, bull: bullLines && level !== 'ok' ? pick(bullLines, seed, id.length) : null });
  };

  if (rugged) {
    add('rugged', 'bad', 100, 'RugCheck marks this token as rugged.', ['Already dead. Bull is paying respects.']);
  }

  if (mintActive === true) {
    add('mint', 'bad', 20, 'Mint authority is still active. More supply can be created at any time.', [
      'He can print more. Bull wonders what you think happens next.',
    ]);
  } else if (mintActive === false) add('mint', 'ok', 0, 'Mint authority is revoked.');

  if (freezeActive === true) {
    add('freeze', 'bad', 15, 'Freeze authority is still active. Wallets can be frozen.', [
      'Your tokens, his button.',
    ]);
  } else if (freezeActive === false) add('freeze', 'ok', 0, 'Freeze authority is revoked.');

  if (holders.hadData) {
    if (holders.top10Pct >= 50) {
      add('top10', 'bad', 20, `Top 10 holders own ${holders.top10Pct}% (liquidity pools excluded when detected).`, [
        'Ten wallets decide how this ends. You are not one of them.',
      ]);
    } else if (holders.top10Pct >= 30) {
      add('top10', 'warn', 10, `Top 10 holders own ${holders.top10Pct}%.`, ['Concentrated. Bull is watching the big wallets.']);
    } else add('top10', 'ok', 0, `Top 10 holders own ${holders.top10Pct}%.`);

    if (holders.topPct >= 20) {
      add('top1', 'bad', 10, `The biggest holder owns ${holders.topPct}% alone.`, ['One wallet. One button.']);
    }
  }

  if (creatorHolds !== null && creatorHolds >= 10) {
    add('creatorbag', 'warn', 10, `The creator wallet still holds ${creatorHolds}% of supply.`, [
      'The creator is still in the room. Bull would not relax.',
    ]);
  }

  if (insiders > 0) {
    add('insiders', 'warn', 10, `RugCheck detected ${insiders} linked insider wallet${insiders > 1 ? 's' : ''}.`, [
      'Wallets that know each other. Funny coincidence.',
    ]);
  }

  if (lpLockedPct !== null) {
    if (lpLockedPct < 50) {
      add('lp', 'warn', 10, `Only ${Math.round(lpLockedPct)}% of liquidity is locked or burned.`, [
        'Unlocked liquidity is a door. Bull checks where the door leads.',
      ]);
    } else add('lp', 'ok', 0, `${Math.round(lpLockedPct)}% of liquidity is locked or burned.`);
  }

  if (market?.liquidityUsd !== null && market?.liquidityUsd !== undefined) {
    if (market.liquidityUsd < 100) {
      dead = true;
      add('liq', 'bad', 30, 'Liquidity is basically zero. This token looks dead or untradeable.', [
        'Bull checked the pulse. There is none.',
      ]);
    } else if (market.liquidityUsd < 5000) {
      add('liq', 'bad', 10, `Liquidity is only $${Math.round(market.liquidityUsd).toLocaleString('en-US')}.`, [
        'You can get in. Getting out is a different story.',
      ]);
    } else if (market.liquidityUsd < 20000) {
      add('liq', 'warn', 5, `Liquidity is thin ($${Math.round(market.liquidityUsd).toLocaleString('en-US')}).`, [
        'Thin. One decent sell and the chart looks like Bull’s old thesis.',
      ]);
    }
  }

  if (market?.ageHours !== null && market?.ageHours !== undefined) {
    if (market.ageHours < 1) {
      add('age', 'warn', 10, 'This pair is under 1 hour old.', ['Brand new. Nobody knows anything yet, including Bull.']);
    } else if (market.ageHours < 24) {
      add('age', 'warn', 5, 'This pair is under 24 hours old.', ['Young. Bull does not trust anything younger than a day.']);
    }
  }

  const c24 = market?.change24h;
  if (c24 !== null && c24 !== undefined) {
    if (c24 <= -80) {
      add('dump', 'bad', 10, `Price is down ${Math.abs(Math.round(c24))}% in 24h.`, ['That is not a dip. That is a floor falling out.']);
    } else if (Math.abs(c24) >= 500) {
      add('swing', 'warn', 15, `Price moved ${c24 > 0 ? '+' : ''}${Math.round(c24)}% in 24h.`, [
        'Charts like this age badly. Bull keeps the receipts.',
      ]);
    }
  }

  const bu = market?.buys24h;
  const se = market?.sells24h;
  if (bu !== null && bu !== undefined && se !== null && se !== undefined && bu + se >= 50 && se > bu * 1.5) {
    add('sells', 'warn', 5, `Sells outnumber buys ${se} to ${bu} in the last 24h.`, ['More people leaving than arriving. Bull notices.']);
  }

  // creator history
  if (prev.known && prev.total > 0) {
    const ratio = prev.dead / prev.total;
    if (prev.total >= 3 && ratio >= 0.6) {
      add('history', 'bad', 25, `Creator launched ${prev.total} earlier tokens. ${prev.dead} of them have no real liquidity left.`, [
        'Consistency is a virtue. This is the other kind.',
      ]);
    } else if (prev.dead >= 1) {
      add('history', 'warn', 10, `Creator launched ${prev.total} earlier token${prev.total > 1 ? 's' : ''}. ${prev.dead} look dead.`, [
        'Not a pattern yet. Bull is taking notes.',
      ]);
    } else add('history', 'ok', 0, `Creator launched ${prev.total} earlier token${prev.total > 1 ? 's' : ''}. None look dead.`);
  } else if (haveRug && !mints.length) {
    findings.push({
      id: 'history',
      level: 'info',
      text: creatorTokensAvailable
        ? 'No earlier tokens found for this creator.'
        : 'Creator history was not provided by the data source, so Bull could not check it.',
      bull: null,
    });
  }

  // RugCheck's own danger flags that we did not already count
  const covered = /holder|liquidity|\blp\b/i; // already scored above, do not count twice
  const dangers = rugRisks.filter((r) => r.level === 'danger' && !covered.test(r.name));
  if (dangers.length) {
    add('rugcheck', 'warn', clamp(dangers.length * 5, 0, 15), `RugCheck flags: ${dangers.map((d) => d.name).join(', ')}.`, [
      'Even the other detectors are nervous.',
    ]);
  }

  score = clamp(Math.round(score), 0, 100);
  if (rugged) score = 100;
  if (dead) score = Math.max(score, 95);
  const [, grade, verdicts] = GRADES.find(([max]) => score < max);

  const order = { bad: 0, warn: 1, info: 2, ok: 3 };
  findings.sort((a, b) => order[a.level] - order[b.level]);

  return {
    ca,
    name: str(pair?.baseToken?.name) || str(rug?.tokenMeta?.name),
    symbol: str(pair?.baseToken?.symbol) || str(rug?.tokenMeta?.symbol),
    level: score,
    grade,
    verdict: pick(verdicts, seed),
    note: 'A clean structure is not a good investment. Prices can collapse with no warning.',
    confidence: haveDex && haveRug ? 'full' : 'partial',
    market,
    security: { mintActive, freezeActive, lpLockedPct, rugged, totalHolders },
    holders: { top: holders.top, top10Pct: holders.top10Pct },
    creator: creator ? { address: creator, holdsPct: creatorHolds, previous: { ...prev, available: creatorTokensAvailable } } : null,
    findings,
    sources: { dexscreener: haveDex, rugcheck: haveRug },
  };
}
