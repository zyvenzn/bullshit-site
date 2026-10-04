import Mascot from './Mascot.jsx';
import Reveal from './Reveal.jsx';
import { useInView } from '../hooks.js';
import { GALLERY } from '../config/gallery.js';

/**
 * One tile. Heavy content (the SVG mascot or an <img>) is only mounted once
 * the tile is near the viewport; real images additionally use native
 * loading="lazy" + async decoding.
 */
function Tile({ item, index }) {
  const [ref, near] = useInView({ rootMargin: '300px 0px', threshold: 0, once: true });
  const custom = Boolean(item.image);

  return (
    <li
      ref={ref}
      className={`tile tile--${item.shape || 'square'} ${custom ? 'tile--custom' : `tile--${item.variant}`}`}
      style={{ '--i': index % 4 }}
    >
      <figure tabIndex={0} aria-label={item.title}>
        <div className="tile__art">
          {near &&
            (custom ? (
              <img
                src={item.image}
                alt={item.alt || item.title}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Mascot variant={item.variant} />
            ))}
        </div>
        <figcaption className="tile__cap">{item.title}</figcaption>
        <span className="tile__scan" aria-hidden="true" />
      </figure>
    </li>
  );
}

export default function MemeGallery() {
  return (
    <section id="multiverse" className="section multiverse" aria-labelledby="multi-title">
      <div className="section__inner">
        <Reveal className="multiverse__head">
          <p className="eyebrow">THE MULTIVERSE</p>
          <h2 id="multi-title" className="h2 h2--xl">
            ONE BULL.
            <br />
            <span className="red">INFINITE BULLSHIT.</span>
          </h2>
          <p className="lead">
            The bull changes.
            <br />
            The bullshit doesn&apos;t.
          </p>
        </Reveal>

        <ul className="masonry">
          {GALLERY.map((item, i) => (
            <Tile key={item.id} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
