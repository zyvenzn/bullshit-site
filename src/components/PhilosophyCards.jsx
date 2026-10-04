import Reveal from './Reveal.jsx';

const CARDS = [
  { n: '01', title: 'NO UTILITY', text: "We're not pretending to reinvent finance.", icon: 'void' },
  { n: '02', title: 'NO PROMISES', text: 'No fake guarantees. No magic 100x promises.', icon: 'no' },
  { n: '03', title: 'JUST MEMES', text: 'Memes, community and absolute bullshit.', icon: 'meme' },
];

function Icon({ kind }) {
  const common = { width: 56, height: 56, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, focusable: false };
  if (kind === 'void')
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M3 3h18v18H3z" />
        <path d="M3 3l18 18M21 3L3 21" />
      </svg>
    );
  if (kind === 'no')
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6l12.8 12.8" />
      </svg>
    );
  return (
    <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 5h18v11H9l-5 4v-4H3z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" />
    </svg>
  );
}

function Card({ card, delay }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
  };
  const reset = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <Reveal as="li" delay={delay} className="card-wrap">
      <article className="card" tabIndex={0} onPointerMove={onMove} onPointerLeave={reset} onBlur={reset}>
        <span className="card__n">{card.n}</span>
        <div className="card__icon">
          <Icon kind={card.icon} />
        </div>
        <h3 className="card__title glitch" data-text={card.title}>
          {card.title}
        </h3>
        <p className="card__text">{card.text}</p>
        <span className="card__corner" aria-hidden="true" />
      </article>
    </Reveal>
  );
}

export default function PhilosophyCards() {
  return (
    <section id="philosophy" className="section philosophy" aria-labelledby="philo-title">
      <div className="section__inner">
        <Reveal>
          <p className="eyebrow">THE BULLSHIT PHILOSOPHY</p>
          <h2 id="philo-title" className="h2">
            THREE RULES. <span className="red">ZERO BRAINS.</span>
          </h2>
        </Reveal>
        <ul className="cards">
          {CARDS.map((c, i) => (
            <Card key={c.n} card={c} delay={i * 110} />
          ))}
        </ul>
      </div>
    </section>
  );
}
