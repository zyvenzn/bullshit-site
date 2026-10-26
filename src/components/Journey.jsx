import Reveal from './Reveal.jsx';
import oldBull from '../assets/bull-old.webp';
import midnight from '../assets/bull-midnight.webp';
import robot from '../assets/bull.webp';
import './Journey.css';

const STEPS = [
  {
    id: 'before',
    tag: 'BEFORE',
    time: 'ALWAYS',
    title: 'THE STUPID BULL',
    img: oldBull,
    pos: '50% 50%',
    alt: 'The original BULLSHIT, a dumb bull with a toilet paper roll on his head',
    text: ['He couldn’t read a chart.', 'He didn’t need to.', 'He was just bullish.'],
  },
  {
    id: 'midnight',
    tag: 'THE EVENT',
    time: '00:00',
    title: 'THE LIGHT',
    img: midnight,
    pos: '30% 50%',
    alt: 'A beam of red and white light at midnight turning the bull into pixels and metal plates',
    text: ['At exactly 00:00 a light found him.', 'It didn’t ask.', 'It just took him.'],
  },
  {
    id: 'now',
    tag: 'NOW',
    time: 'FOREVER',
    title: 'BULL. THE ROBOT.',
    img: robot,
    pos: '50% 40%',
    alt: 'BULL, the robot bull with glowing red eyes and a smug look',
    text: ['Still bullshit.', 'Now he sees every wallet and every transaction.', 'He is not impressed.'],
    quote: '“Your history is public. Bull read all of it.”',
  },
];

export default function Journey() {
  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="section__inner">
        <Reveal className="journey__head">
          <p className="eyebrow">CHAPTER 02</p>
          <h2 id="journey-title" className="h2 h2--xl glitch" data-text="THE UPGRADE">
            THE <span className="red">UPGRADE</span>
          </h2>
          <p className="lead">The bull changed. The bullshit didn&apos;t.</p>
        </Reveal>

        <ol className="journey__track">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.id} className={`jstep jstep--${s.id}`} delay={i * 120}>
              <figure className="jstep__fig">
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: s.pos }}
                />
                <figcaption className="jstep__time">{s.time}</figcaption>
              </figure>
              <p className="jstep__tag">
                <span>0{i + 1}</span> {s.tag}
              </p>
              <h3 className="jstep__title">{s.title}</h3>
              <p className="jstep__text">
                {s.text.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </p>
              {s.quote && <p className="jstep__quote">{s.quote}</p>}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
