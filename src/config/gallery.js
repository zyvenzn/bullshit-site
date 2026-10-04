// ─────────────────────────────────────────────────────────────
//  MULTIVERSE GALLERY DATA
//
//  To add a new meme later, just add one object to this array.
//  No layout changes needed.
//
//    id      unique string
//    title   caption shown on hover
//    shape   'tall' | 'square' | 'wide'  (masonry rhythm)
//    image   OPTIONAL path/URL to a real meme image, e.g. '/memes/cowboy.webp'
//            (lazy-loaded). If omitted, the built-in SVG mascot is
//            drawn using `variant`.
//    variant built-in costume (see components/Mascot.jsx)
//    alt     OPTIONAL alt text for `image`
// ─────────────────────────────────────────────────────────────
export const GALLERY = [
  { id: 'cyberpunk', title: 'CYBERPUNK BULLSHIT', shape: 'tall', variant: 'cyberpunk' },
  { id: 'medieval', title: 'MEDIEVAL BULLSHIT', shape: 'square', variant: 'medieval' },
  { id: 'trader', title: 'TRADER BULLSHIT', shape: 'wide', variant: 'trader' },
  { id: 'anime', title: 'ANIME BULLSHIT', shape: 'tall', variant: 'anime' },
  { id: 'cowboy', title: 'COWBOY BULLSHIT', shape: 'square', variant: 'cowboy' },
  { id: 'astronaut', title: 'ASTRONAUT BULLSHIT', shape: 'tall', variant: 'astronaut' },
  { id: 'ceo', title: 'OFFICE CEO BULLSHIT', shape: 'wide', variant: 'ceo' },
  { id: 'casino', title: 'CASINO BULLSHIT', shape: 'square', variant: 'casino' },
  { id: 'goblin', title: 'GOBLIN BULLSHIT', shape: 'tall', variant: 'goblin' },
  { id: 'doom', title: 'DOOMPOSTING BULLSHIT', shape: 'square', variant: 'doom' },
];
