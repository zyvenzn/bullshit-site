// ─────────────────────────────────────────────────────────────
//  BULLSHIT — single place to configure the live details.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'BULLSHIT',
  ticker: '$BULLSHIT',
  network: 'Solana',

  // Launch time: 29 Oct 2026, 17:18 WIB
  launchAt: '2026-10-29T10:18:00Z',
  contractAddress: 'BFFQuP2arzsxAGppkfuPgFwmQtoS1XoEF4Gqu6zdpump',

  // Official Pump.fun token page
  buyUrl: 'https://pump.fun/BFFQuP2arzsxAGppkfuPgFwmQtoS1XoEF4Gqu6zdpump',

  xHandle: '@BullShit_Ofc',
  xUrl: 'https://x.com/BullShit_Ofc',

  // Official community group.
  telegramUrl: 'https://t.me/bullshit_ofc',
};

export const CA_PLACEHOLDER = '[CA COMING SOON]';
export const hasContract = () => SITE.contractAddress.trim().length > 0;
export const hasBuyUrl = () => SITE.buyUrl.trim().length > 0;
