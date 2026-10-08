// ─────────────────────────────────────────────────────────────
//  BULLSHIT — single place to configure the live details.
//  Nothing here is invented. Fill these in when they exist.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'BULLSHIT',
  ticker: '$BULLSHIT',
  network: 'Solana',

  // 21:00 WIB = 14:00 UTC, Minggu 1 Nov 2026
  launchAt: '2026-11-01T14:00:00Z',
  // Paste the real Solana contract address here once it exists.
  // While empty: the token section shows "[CA COMING SOON]"
  // and the COPY CA button stays disabled.
  contractAddress: '',

  // Official trading / purchase link (e.g. the token's page on the DEX
  // you launch on). While empty: BUY buttons scroll to the token section.
  buyUrl: '',

  xHandle: '@BullShit_Solana',
  xUrl: 'https://x.com/BullShit_Solana',

  // Official community group.
  telegramUrl: 'https://t.me/bullshit_sol',
};

export const CA_PLACEHOLDER = '[CA COMING SOON]';
export const hasContract = () => SITE.contractAddress.trim().length > 0;
export const hasBuyUrl = () => SITE.buyUrl.trim().length > 0;
