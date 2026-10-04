// ─────────────────────────────────────────────────────────────
//  BULLSHIT — single place to configure the live details.
//  Nothing here is invented. Fill these in when they exist.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: 'BULLSHIT',
  ticker: '$BULLSHIT',
  network: 'Solana',

  // Paste the real Solana contract address here once it exists.
  // While empty: the token section shows "[CA COMING SOON]"
  // and the COPY CA button stays disabled.
  contractAddress: '',

  // Official trading / purchase link (e.g. the token's page on the DEX
  // you launch on). While empty: BUY buttons scroll to the token section.
  buyUrl: '',

  xHandle: '@BullShit_Solana',
  xUrl: 'https://x.com/BullShit_Solana',
};

export const CA_PLACEHOLDER = '[CA COMING SOON]';
export const hasContract = () => SITE.contractAddress.trim().length > 0;
export const hasBuyUrl = () => SITE.buyUrl.trim().length > 0;
