// GET /api/scan?ca=<solana token mint>
// Vercel serverless function. Needs no API keys: DexScreener and RugCheck have public endpoints.
import { analyze, extractCreatorMints, isValidMint, toPairs } from './_lib/analyze.js';

const HEADERS = { accept: 'application/json', 'user-agent': 'bullshit-detector/1.0' };

// TEMPORARY diagnostics: /api/scan?ca=...&debug=2 tries candidate sources for the creator's
// token history and reports status + shape only. Remove once a source is chosen.
async function probeCreator(creator) {
  const out = {};
  const timed = async (name, url, init, summarize) => {
    const t0 = Date.now();
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    try {
      const r = await fetch(url, { ...init, signal: ctl.signal });
      const text = await r.text();
      let extra = null;
      try {
        extra = summarize ? summarize(JSON.parse(text)) : null;
      } catch {
        extra = null;
      }
      out[name] = { status: r.status, ms: Date.now() - t0, bytes: text.length, head: text.slice(0, 220), ...(extra ? { summary: extra } : {}) };
    } catch (e) {
      out[name] = { error: String(e?.message || e).slice(0, 120), ms: Date.now() - t0 };
    } finally {
      clearTimeout(timer);
    }
  };
  const key = process.env.HELIUS_API_KEY;
  const jobs = [
    timed('pumpfun', `https://frontend-api-v3.pump.fun/coins/user-created-coins/${creator}?offset=0&limit=50&includeNsfw=true`, { headers: HEADERS }, (j) => ({
      isArray: Array.isArray(j),
      count: Array.isArray(j) ? j.length : j?.coins?.length ?? null,
      keys: Array.isArray(j) ? Object.keys(j[0] || {}).slice(0, 12) : Object.keys(j || {}).slice(0, 12),
    })),
    timed(
      'solanaRpc',
      'https://api.mainnet-beta.solana.com',
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getSignaturesForAddress', params: [creator, { limit: 20 }] }) },
      (j) => ({ signatures: j?.result?.length ?? null, error: j?.error?.message ?? null })
    ),
  ];
  if (key) {
    jobs.push(
      timed('helius', `https://api.helius.xyz/v0/addresses/${creator}/transactions?api-key=${key}&limit=50`, { headers: HEADERS }, (j) => {
        const types = {};
        const sources = {};
        for (const x of Array.isArray(j) ? j : []) {
          types[x?.type] = (types[x?.type] || 0) + 1;
          sources[x?.source] = (sources[x?.source] || 0) + 1;
        }
        // Compact samples of pump.fun transactions so we can see how a token creation looks.
        const compact = (x) => ({
          sig: String(x?.signature || '').slice(0, 14),
          ts: x?.timestamp,
          type: x?.type,
          desc: String(x?.description || '').slice(0, 90),
          keys: Object.keys(x || {}),
          ix: (x?.instructions || []).slice(0, 6).map((i) => ({
            program: i?.programId,
            data: String(i?.data || '').slice(0, 24),
            nAccounts: (i?.accounts || []).length,
            first: (i?.accounts || []).slice(0, 3),
            inner: (i?.innerInstructions || []).length,
          })),
          tokenTransfers: (x?.tokenTransfers || []).slice(0, 3).map((tt) => ({ mint: tt?.mint, from: String(tt?.fromUserAccount || '').slice(0, 6), to: String(tt?.toUserAccount || '').slice(0, 6) })),
          events: Object.keys(x?.events || {}),
        });
        const list = Array.isArray(j) ? j : [];
        const unknownPump = list.filter((x) => x?.source === 'PUMP_FUN' && x?.type === 'UNKNOWN').slice(0, 3).map(compact);
        const swapPump = list.filter((x) => x?.source === 'PUMP_FUN' && x?.type === 'SWAP').slice(0, 1).map(compact);
        return { count: Array.isArray(j) ? j.length : null, types, sources, samples: { unknownPump, swapPump } };
      })
    );
  } else {
    out.helius = 'no HELIUS_API_KEY set';
  }
  await Promise.all(jobs);
  return out;
}

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
  let probe = false;
  try {
    const q = new URL(req.url, 'http://x').searchParams;
    ca = String(req.query?.ca ?? q.get('ca') ?? '').trim();
    const dv = req.query?.debug ?? q.get('debug');
    debug = dv === '1' || dv === '2';
    probe = dv === '2';
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
    if (probe && result.creator?.address) result.debug.probe = await probeCreator(result.creator.address);
    return send(200, result);
  }
  return send(200, result, 'public, s-maxage=30, stale-while-revalidate=120');
}
