import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Countdown from './components/Countdown.jsx';
import TickerMarquee from './components/TickerMarquee.jsx';
import WhatSection from './components/WhatSection.jsx';
import PhilosophyCards from './components/PhilosophyCards.jsx';
import LoreSection from './components/LoreSection.jsx';
import MemeGallery from './components/MemeGallery.jsx';
import XSection from './components/XSection.jsx';
import TokenSection from './components/TokenSection.jsx';
import BuySection from './components/BuySection.jsx';
import Footer from './components/Footer.jsx';
import CursorSparks from './components/CursorSparks.jsx';

export default function App() {
  return (
    <>
      <a className="skip" href="#what">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <TickerMarquee />
        <WhatSection />
        <PhilosophyCards />
        <LoreSection />
        <MemeGallery />
        <XSection />
        <TokenSection />
        <BuySection />
      </main>
      <Footer />
      <CursorSparks />
    </>
  );
}
