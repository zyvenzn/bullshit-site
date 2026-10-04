const HEIGHTS = [40, 64, 52, 88, 70, 110, 60, 34, 76, 50, 96, 44];

/** Row of animated candlesticks. Mostly red; the odd green one is the only
 *  green on the site (trading/chart elements only). Purely decorative. */
export default function Candles({ count = 10, className = '' }) {
  return (
    <div className={`candles ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`candle ${i % 7 === 3 ? 'candle--g' : ''}`.trim()}
          style={{ '--h': `${HEIGHTS[i % HEIGHTS.length]}px`, '--i': i }}
        >
          <i />
        </span>
      ))}
    </div>
  );
}
