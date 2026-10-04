// Optional helper: bundles the app into ONE self-contained HTML file
// (JS + CSS inlined) with esbuild. Useful for quick previews / hosting
// anywhere. The normal production path is `npm run build` (Vite).
//
// usage: node scripts/build-single.mjs [outFile]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || path.join(root, 'dist', 'index.single.html'));

const candidates = [root, '/opt/npm-tools', path.join(execSync('npm root -g').toString().trim(), '..')];
let esbuild;
for (const c of candidates) {
  try {
    esbuild = createRequire(path.join(c, 'x.js'))('esbuild');
    break;
  } catch {}
}
if (!esbuild) throw new Error('esbuild not found. Run npm install first.');

const nodePaths = [path.join(root, 'node_modules'), execSync('npm root -g').toString().trim()];

const result = await esbuild.build({
  entryPoints: [path.join(root, 'src/main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  loader: { '.jsx': 'jsx', '.webp': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths,
  outdir: path.join(root, 'dist-tmp'),
  write: false,
  legalComments: 'none',
});

let js = '';
let css = '';
for (const f of result.outputFiles) {
  if (f.path.endsWith('.js')) js = f.text;
  if (f.path.endsWith('.css')) css = f.text;
}

let html = readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace('<script type="module" src="/src/main.jsx"></script>', '');
html = html.replace('href="/favicon.png"', 'href="data:,"');
// function replacers: the bundle contains "$&"-style sequences that
// String.replace would otherwise expand.
html = html.replace('</head>', () => `<style>${css}</style>\n</head>`);
html = html.replace('</body>', () => `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`);

mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, html);
console.log('wrote', out, (html.length / 1024).toFixed(0) + ' KB');
