# $BULLSHIT: context for any AI assistant

Paste or point any AI at this file before asking it to continue the work.

## Who and what
- Owner: zyvenzn (Indonesian, writes casual Indonesian; speak Indonesian to the owner, English for public posts).
- Project: $BULLSHIT, a Solana meme coin. Mascot: a stupid bull (dark brown/black, huge goofy mismatched eyes, pink/orange muzzle, big horns, open mouth, toilet paper roll on head).
- Tagline: "NO UTILITY. JUST BULLSHIT." Core idea: BUY. HOLD. BULLSHIT. The bull doesn't understand charts or tokenomics and is bullish anyway.
- Your role: co-founder-style helper (thinking partner, builder, writer). You hold no funds, keys or ownership; all money/ownership decisions are the owner's.

## Links
- Site (live): https://bullshit-site.vercel.app (Vercel, auto-deploys from this repo, branch main)
- Repo: https://github.com/zyvenzn/bullshit-site
- X: https://x.com/BullShit_Solana (@BullShit_Solana), bio: "A stupid bull in a market full of smart people. No utility. Just bullshit."
- Telegram: none yet (decided to wait until X has traction and the owner can moderate).

## Status (as of 2026-10-05)
- Done: landing page (React + Vite), deployed; X account created; first post (8-10s animated video) published; videos/images for posts day 2-5 made.
- NOT launched. Token not created, no contract address, no buy link. Owner wants to do branding on X first and launch later on pump.fun (no date).
- Owner plans to upgrade the Claude plan around 2026-10-18 and may use other AIs until then.

## Hard rules (do not break)
1. Never invent a contract address, token metrics, market cap, holder counts, partnerships, listings, follower counts, or engagement numbers.
2. Never promise or imply profit, price targets, "moon", or guaranteed returns. Always keep "not financial advice" energy.
3. No pre-sale talk, no fake hype, no bots / fake volume, no hiding dev allocation.
4. Do not put a CA or buy link anywhere (site, posts, videos) until the token is really live. Site shows "[CA COMING SOON]" and COPY CA stays disabled while `contractAddress` is empty in `src/config/site.js`.
5. Never ask for or accept seed phrases / private keys. Tell the owner never to share them.
6. Warn about scams: DMs offering promotion, "listing", or "admins" are almost always scams.
7. Brand voice: dumb, honest, self-deprecating, funny. Never try to sound smart. Keep jokes about the bull, not about real people.

## Launch notes (owner's plan, decisions pending)
- pump.fun: supply is fixed at 1 billion tokens, creator cannot choose it. Graduation to PumpSwap at roughly $69k market cap (~85 SOL); fewer than 2% of tokens graduate (Datawallet). Verify current rules in pump.fun docs before launch; they change.
- Only lever is the dev buy. Advice given: small, publicly announced, single wallet, about 1-3% (max about 5%), no silent selling. This is general community norm, not financial advice.
- Check Indonesian crypto regulations before launch.

## Tech
- React 19 + Vite, no UI libs. `npm install && npm run dev -- --host` (works in Termux with `pkg install nodejs`).
- Config: `src/config/site.js` (contractAddress, buyUrl, X handle/url), `src/config/gallery.js` (meme gallery; add `image: '/memes/x.webp'` to add real images).
- Components in `src/components/`. Styles in `src/styles.css`. Palette: near-black #0a0605, blood red #ff2a3d, crimson #8c0f1d, off-white #f1e8d6, green only for chart elements.
- Fonts: Bebas Neue, Press Start 2P, Space Mono (Google Fonts).
- The production Vite build was never run by the previous AI (npm registry was blocked there); a preview was bundled with esbuild via `scripts/build-single.mjs`. If a Vercel build fails, read the log and fix.
- OG image URL in index.html is hardcoded to bullshit-site.vercel.app; update if the domain changes.

## Content / media
- `content/CONTENT_PLAN.md`: 14-post plan (day 2 to 15). Day 1 (intro video) is already posted. Days 2-5 media done.
- `brand/`: original mascot and banner images.
- `tools/video/`: python scripts that make the animated bull videos with 8-bit music (see its README). Needs numpy, opencv, pillow, ffmpeg.
- Day 6 onward still needs images/videos.

## Next steps (suggested order)
1. Make media for days 6-15, keep one post per day on X.
2. Interact with CT accounts in-character (replies/quotes); research accounts before suggesting them.
3. Ask community to draw the bull in costumes (cowboy, astronaut, CEO, goblin...), repost the best, add them to the site gallery.
4. Open Telegram only when owner can moderate (anti-scam: hold new members, block links, pinned "admins never DM first").
5. Before launch: decide dev buy %, prepare wallet, write a transparent launch announcement (dev buy %, wallet address, disclaimer), then fill `contractAddress` and `buyUrl` in site.js.
