// Tiny base58 decoder (no dependencies). Used only by the diagnostic probe.
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function b58decode(s) {
  if (typeof s !== 'string' || !s.length) return null;
  let n = 0n;
  for (const c of s) {
    const i = ALPHABET.indexOf(c);
    if (i < 0) return null;
    n = n * 58n + BigInt(i);
  }
  const bytes = [];
  while (n > 0n) {
    bytes.push(Number(n & 255n));
    n >>= 8n;
  }
  bytes.reverse();
  for (const c of s) {
    if (c === '1') bytes.unshift(0);
    else break;
  }
  return Uint8Array.from(bytes);
}

export const toHex = (u8, n = 8) =>
  Array.from(u8.slice(0, n))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
