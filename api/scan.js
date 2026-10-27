// GET /api/scan?ca=<solana token mint>
// Vercel serverless function. Needs no API keys: DexScreener and RugCheck have public endpoints.
import { analyze, extractCreatorMints, isValidMint, toPairs } from './_lib/analyze.js';

const HEADERS = { accept: 'application/json', 'user-agent': 'bullshit-detector/1.0' };

async function getJson(url, ms = 4500) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { headers: HEADERS, signal: ctl.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  const send = (code, body, cache) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', cache || 'no-store');
    res.end(JSON.stringify(body));
  };

  let ca = '';
  let debug = false;
  try {
    const q = new URL(req.url, 'http://x').searchParams;
    ca = String(req.query?.ca ?? q.get('ca') ?? '').trim();
    debug = (req.query?.debug ?? q.get('debug')) === '1';
  } catch {
    ca = '';
  }
  if (!isValidMint(ca)) return send(400, { error: 'That does not look like a Solana contract address.' });

  const [dex, rug] = await Promise.all([
    getJson(`https://api.dexscreener.com/tokens/v1/solana/${ca}`),
    getJson(`https://api.rugcheck.xyz/v1/tokens/${ca}/report`),
  ]);
  const pairs = toPairs(dex);

  if (!pairs.length && !rug) {
    return send(404, { error: 'Bull found nothing. Wrong address, no pair yet, or the data sources are down.' });
  }

  // Earlier tokens by the same creator, checked for liquidity on DexScreener.
  let creatorPairs = null;
  const mints = extractCreatorMints(rug, ca);
  if (mints.length) {
    const prevDex = await getJson(`https://api.dexscreener.com/tokens/v1/solana/${mints.join(',')}`);
    if (prevDex) creatorPairs = toPairs(prevDex);
  }

  const result = analyze({ ca, pairs, rug, creatorPairs });
  if (debug) {
    // /api/scan?ca=...&debug=1 shows the shape of the RugCheck data (no secrets, all public) to help diagnose.
    const ct = rug?.creatorTokens;
    result.debug = {
      rugKeys: rug ? Object.keys(rug) : null,
      creatorTokens: {
        type: Array.isArray(ct) ? 'array' : typeof ct,
        length: Array.isArray(ct) ? ct.length : Array.isArray(ct?.tokens) ? ct.tokens.length : null,
        sample: JSON.stringify(Array.isArray(ct) ? ct[0] ?? null : ct ?? null)?.slice(0, 400) ?? null,
      },
      mintsFound: mints.length,
    };
    return send(200, result);
  }
  return send(200, result, 'public, s-maxage=30, stale-while-revalidate=120');
}
