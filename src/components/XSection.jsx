import avatar from '../assets/bull-avatar.webp';
import Reveal from './Reveal.jsx';
import { XButton } from './Buttons.jsx';
import { SITE } from '../config/site.js';

// Illustrative posts written for this page. They are NOT real tweets, and
// intentionally carry no likes / reposts / follower numbers.
const POSTS = [
  {
    id: 'ct',
    lines: [
      'CT is full of geniuses.',
      '',
      'TA.',
      'Alpha.',
      'Tokenomics.',
      '17 indicators.',
      '',
      'Meanwhile, I know nothing.',
      '',
      'NO UTILITY. JUST BULLSHIT. 🐂',
    ],
  },
  {
    id: 'analyst',
    lines: [
      'analyst: the 4H structure is showing a bearish divergence.',
      '',
      'me: what is a 4H',
      '',
      'analyst: ...',
      '',
      'me: bullish',
    ],
  },
  {
    id: 'red',
    lines: ['Red candle.', 'Healthy correction.', '', 'Red candle.', 'Still healthy.', '', 'Red candle.', '...', '', 'BULLSHIT.'],
  },
  {
    id: 'moon',
    lines: ['wen moon?', '', "idk i'm a bull", "not an astronaut", '', 'NO UTILITY. JUST BULLSHIT.'],
  },
];

function Post({ post, delay }) {
  return (
    <Reveal as="li" delay={delay} className="post-wrap">
      <article className="post">
        <header className="post__head">
          <span className="post__avatar" aria-hidden="true">
            <img src={avatar} width="44" height="44" alt="" loading="lazy" decoding="async" />
          </span>
          <span className="post__who">
            <b>BULLSHIT</b>
            <span>{SITE.xHandle}</span>
          </span>
          <span className="post__tag">EXAMPLE</span>
        </header>
        <p className="post__body">
          {post.lines.map((l, i) =>
            l === '' ? <br key={i} /> : (
              <span key={i}>
                {l}
                <br />
              </span>
            )
          )}
        </p>
      </article>
    </Reveal>
  );
}

export default function XSection() {
  return (
    <section id="x" className="section xsec" aria-labelledby="x-title">
      <div className="section__inner xsec__grid">
        <Reveal className="xsec__copy">
          <p className="eyebrow">COMMUNITY</p>
          <h2 id="x-title" className="h2 h2--xl">
            BULLSHIT LIVES
            <br />
            ON <span className="red">X</span>
          </h2>
          <p className="lead">Where the bullshit happens.</p>
          <XButton big>FOLLOW {SITE.xHandle}</XButton>
          <p className="fine">Illustrative posts written for this page. Not real tweets, and no stats on purpose.</p>
        </Reveal>

        <ul className="feed" aria-label="Example posts">
          {POSTS.map((p, i) => (
            <Post key={p.id} post={p} delay={i * 90} />
          ))}
        </ul>
      </div>
    </section>
  );
}
