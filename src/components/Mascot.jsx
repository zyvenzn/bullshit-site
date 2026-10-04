import { useId } from 'react';

/**
 * The BULLSHIT mascot, drawn in SVG so it stays sharp, tiny and themeable.
 * Identity (always present): dark brown bull, huge goofy eyes, pink/orange
 * muzzle, big horns, open dumb mouth, toilet paper roll on its head.
 *
 * Props
 *  variant  costume key (see COSTUMES below)
 *  pixel    render with an 8-bit pixelate filter
 *  className
 *  title    accessible label (omit for decorative use)
 *
 * Pupils follow the CSS variables --lx / --ly set by useParallax().
 */
const INK = '#0a0605';

const SKIN = {
  default: ['#2a1812', '#41271b'],
  goblin: ['#3d4a22', '#566a31'],
  doom: ['#231612', '#33201a'],
};

function Costume({ variant, layer }) {
  const back = layer === 'back';
  switch (variant) {
    case 'cyberpunk':
      return back ? null : (
        <g>
          <rect x="88" y="158" width="226" height="62" rx="14" fill="#ff1f3d" fillOpacity=".38" stroke="#ff1f3d" strokeWidth="5" />
          <path d="M96 176h210M96 190h210M96 204h210" stroke="#ff7a88" strokeOpacity=".5" strokeWidth="2" />
          <path d="M326 150l26-48M338 150l30-30" stroke="#ff1f3d" strokeWidth="5" strokeLinecap="round" />
          <circle cx="352" cy="102" r="7" fill="#ff1f3d" />
          <path d="M70 300h40l12 14h40" fill="none" stroke="#ff1f3d" strokeWidth="4" />
        </g>
      );
    case 'medieval':
      return !back ? null : (
        <g>
          <path d="M138 70l8-52 34 30 20-44 20 44 34-30 8 52z" fill="#e0a82e" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <circle cx="200" cy="52" r="8" fill="#ff2a3d" stroke={INK} strokeWidth="3" />
          <path d="M150 360q50 30 100 0l20 50H130z" fill="#6b0f1a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        </g>
      );
    case 'trader':
      return back ? (
        <g opacity=".9">
          <path d="M20 330l60-40 40 20 60-70 50 30 70-90" fill="none" stroke="#ff2a3d" strokeWidth="6" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <path d="M78 215C60 80 340 80 322 215" fill="none" stroke="#161010" strokeWidth="14" strokeLinecap="round" />
          <rect x="62" y="195" width="32" height="56" rx="12" fill="#161010" stroke="#ff2a3d" strokeWidth="4" />
          <rect x="306" y="195" width="32" height="56" rx="12" fill="#161010" stroke="#ff2a3d" strokeWidth="4" />
          <path d="M72 248q10 66 80 60" fill="none" stroke="#161010" strokeWidth="8" strokeLinecap="round" />
          <circle cx="156" cy="308" r="9" fill="#ff2a3d" />
        </g>
      );
    case 'anime':
      return back ? null : (
        <g>
          <ellipse cx="108" cy="262" rx="28" ry="14" fill="#ff6b8a" opacity=".65" />
          <ellipse cx="294" cy="262" rx="28" ry="14" fill="#ff6b8a" opacity=".65" />
          <g fill="#fff" stroke={INK} strokeWidth="2">
            <path d="M138 176l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" />
            <path d="M262 168l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
          </g>
          <path d="M338 120q14 20 0 34q-14-14 0-34z" fill="#fff" fillOpacity=".8" stroke={INK} strokeWidth="3" />
        </g>
      );
    case 'cowboy':
      return back ? (
        <g>
          <ellipse cx="200" cy="100" rx="150" ry="24" fill="#8a5a2b" stroke={INK} strokeWidth="6" />
          <path d="M132 98C128 36 272 36 268 98z" fill="#9c6933" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M134 86q66 16 132 0" fill="none" stroke="#ff2a3d" strokeWidth="9" />
        </g>
      ) : (
        <g>
          <path d="M150 340l50 30 50-30" fill="none" stroke="#ff2a3d" strokeWidth="9" strokeLinejoin="round" />
          <circle cx="200" cy="372" r="9" fill="#e0a82e" stroke={INK} strokeWidth="3" />
        </g>
      );
    case 'astronaut':
      return back ? null : (
        <g>
          <circle cx="200" cy="218" r="182" fill="#fff" fillOpacity=".09" stroke="#e8e0d0" strokeWidth="12" />
          <path d="M92 130a150 150 0 0 1 70-52" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="10" strokeLinecap="round" />
          <rect x="120" y="386" width="160" height="30" rx="8" fill="#e8e0d0" stroke={INK} strokeWidth="6" />
          <circle cx="342" cy="52" r="16" fill="#f1e8d6" stroke={INK} strokeWidth="4" />
          <circle cx="336" cy="48" r="4" fill="#cfc4ac" />
        </g>
      );
    case 'ceo':
      return back ? null : (
        <g>
          <path d="M120 352l80 40 80-40 30 60H90z" fill="#161010" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M150 352l50 54 50-54-20-8-30 20-30-20z" fill="#f1e8d6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M188 372h24l10 36-22 14-22-14z" fill="#ff2a3d" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x="222" y="312" width="70" height="12" rx="6" fill="#b88a4a" stroke={INK} strokeWidth="3" transform="rotate(-12 222 312)" />
          <circle cx="294" cy="300" r="5" fill="#ff7a2a" />
        </g>
      );
    case 'casino':
      return back ? null : (
        <g>
          {[[56, 360], [344, 360], [70, 108]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="30" fill="#c8102e" stroke="#f1e8d6" strokeWidth="4" />
              <circle cx={x} cy={y} r="19" fill="none" stroke="#f1e8d6" strokeWidth="4" strokeDasharray="6 7" />
              <circle cx={x} cy={y} r="7" fill="#f1e8d6" />
            </g>
          ))}
          <g stroke={INK} strokeWidth="5">
            <rect x="302" y="64" width="54" height="54" rx="9" fill="#f1e8d6" transform="rotate(14 329 91)" />
          </g>
          <g fill={INK} transform="rotate(14 329 91)">
            <circle cx="316" cy="78" r="5" /><circle cx="342" cy="78" r="5" />
            <circle cx="329" cy="91" r="5" />
            <circle cx="316" cy="104" r="5" /><circle cx="342" cy="104" r="5" />
          </g>
        </g>
      );
    case 'goblin':
      return back ? (
        <g fill="#3d4a22" stroke={INK} strokeWidth="6" strokeLinejoin="round">
          <path d="M82 196L6 130l16 100 66 24z" />
          <path d="M318 196l76-66-16 100-66 24z" />
        </g>
      ) : (
        <g fill="#f1e8d6" stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path d="M172 298l8 30 8-30z" />
          <path d="M212 298l8 30 8-30z" />
        </g>
      );
    case 'doom':
      return back ? null : (
        <g>
          <path d="M52 270C28 90 130 30 200 30s172 60 148 240l-26 12C326 150 284 84 200 84S74 150 78 282z" fill="#0f0b0a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M146 232q-6 30 0 52M258 232q-6 30 0 52" fill="none" stroke="#cfd8e0" strokeOpacity=".75" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 360l60 20 50-30 60 50 60-40 60 30 70-60" fill="none" stroke="#ff2a3d" strokeWidth="5" strokeLinejoin="round" />
        </g>
      );
    default:
      return null;
  }
}

export default function Mascot({ variant = 'default', pixel = false, className = '', title }) {
  const uid = useId().replace(/:/g, '');
  const [skin, skinHi] = SKIN[variant] || SKIN.default;
  const filterId = `px-${uid}`;

  return (
    <svg
      className={`mascot ${className}`}
      viewBox="0 0 400 430"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      shapeRendering={pixel ? 'crispEdges' : 'geometricPrecision'}
    >
      {pixel && (
        <defs>
          <filter id={filterId} x="0" y="0" width="100%" height="100%">
            <feFlood x="4" y="4" width="2" height="2" />
            <feComposite width="10" height="10" />
            <feTile result="grid" />
            <feComposite in="SourceGraphic" in2="grid" operator="in" />
            <feMorphology operator="dilate" radius="5" />
          </filter>
        </defs>
      )}

      <g filter={pixel ? `url(#${filterId})` : undefined}>
        <Costume variant={variant} layer="back" />

        {/* horns */}
        <path d="M100 150C34 146 6 86 40 36c10 52 46 70 84 78z" fill="#efe3c8" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M300 150c66-4 94-64 60-114-10 52-46 70-84 78z" fill="#efe3c8" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M52 62c6 26 22 40 44 48M348 62c-6 26-22 40-44 48" fill="none" stroke="#cdbf9d" strokeWidth="5" strokeLinecap="round" />

        {/* ears */}
        <ellipse cx="68" cy="196" rx="40" ry="22" transform="rotate(-18 68 196)" fill={skin} stroke={INK} strokeWidth="6" />
        <ellipse cx="332" cy="196" rx="40" ry="22" transform="rotate(18 332 196)" fill={skin} stroke={INK} strokeWidth="6" />
        <ellipse cx="72" cy="198" rx="20" ry="10" transform="rotate(-18 72 198)" fill="#7a3a33" />
        <ellipse cx="328" cy="198" rx="20" ry="10" transform="rotate(18 328 198)" fill="#7a3a33" />

        {/* head */}
        <path
          d="M200 66c92 0 132 62 128 150-4 86-58 138-128 138S76 302 72 216C68 128 108 66 200 66z"
          fill={skin}
          stroke={INK}
          strokeWidth="6"
        />
        <path d="M140 112q60-26 120 0" fill="none" stroke={skinHi} strokeWidth="12" strokeLinecap="round" />

        {/* brows (angry/confused at once) */}
        <path d="M100 150l84 18" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <path d="M222 156l82-30" stroke={INK} strokeWidth="12" strokeLinecap="round" />

        {/* eyes: mismatched, huge */}
        <circle cx="146" cy="200" r="42" fill="#fff" stroke={INK} strokeWidth="6" />
        <circle cx="254" cy="194" r="50" fill="#fff" stroke={INK} strokeWidth="6" />
        <g className="pupils">
          <g className="pupil">
            <circle cx="142" cy="204" r="16" fill={INK} />
            <circle cx="136" cy="198" r="5" fill="#fff" />
          </g>
          <g className="pupil">
            <circle cx="262" cy="190" r="11" fill={INK} />
            <circle cx="258" cy="186" r="4" fill="#fff" />
          </g>
        </g>

        {/* muzzle */}
        <ellipse cx="200" cy="290" rx="88" ry="60" fill="#ee8a6c" stroke={INK} strokeWidth="6" />
        <ellipse cx="200" cy="270" rx="56" ry="26" fill="#f6a688" opacity=".7" />
        <ellipse cx="168" cy="264" rx="9" ry="14" fill="#5a2a22" />
        <ellipse cx="232" cy="264" rx="9" ry="14" fill="#5a2a22" />

        {/* open, dumb mouth */}
        <g className="jaw">
          <path d="M160 300q40 8 80 0c6 50-18 66-40 66s-46-16-40-66z" fill="#5b0d12" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <ellipse cx="200" cy="350" rx="22" ry="12" fill="#ff5a6e" />
          <rect x="178" y="302" width="18" height="16" rx="3" fill="#f6efe0" stroke={INK} strokeWidth="3" />
          <rect x="204" y="302" width="18" height="16" rx="3" fill="#f6efe0" stroke={INK} strokeWidth="3" />
        </g>

        {/* toilet paper roll: always on the head */}
        <g transform="rotate(-8 200 70)">
          <g className="roll">
            <rect x="150" y="26" width="100" height="74" rx="10" fill="#f2ede0" stroke={INK} strokeWidth="6" />
            <path d="M158 52h84M158 70h84M158 88h84" stroke="#d6cfbd" strokeWidth="3" />
            <ellipse cx="200" cy="26" rx="50" ry="14" fill="#fffaf0" stroke={INK} strokeWidth="6" />
            <ellipse cx="200" cy="26" rx="18" ry="5" fill={INK} />
            <path d="M250 80c26 18 14 52 40 68l-16 8c-26-14-18-46-40-60z" fill="#f2ede0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          </g>
        </g>

        <Costume variant={variant} layer="front" />
      </g>
    </svg>
  );
}
