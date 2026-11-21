// expo export -p web の後に実行し、iPhone のホーム画面に追加したとき
// アプリのように全画面で開けるよう index.html を整える。
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const base = (process.env.EXPO_BASE_URL ?? '').replace(/\/$/, '');
const indexPath = join(dist, 'index.html');

const manifest = {
  name: 'AWS SAA学習アプリ',
  short_name: 'SAA学習',
  start_url: `${base}/`,
  scope: `${base}/`,
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#061B42',
  theme_color: '#061B42',
  lang: 'ja',
  icons: [
    { src: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png' },
    { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png' },
  ],
};
writeFileSync(join(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

const head = [
  `<meta name="apple-mobile-web-app-capable" content="yes" />`,
  `<meta name="mobile-web-app-capable" content="yes" />`,
  `<meta name="apple-mobile-web-app-title" content="SAA学習" />`,
  // ステータスバーの裏までページを描画し、ヘッダーの紺色を画面最上部まで伸ばす
  `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`,
  `<meta name="theme-color" content="#061B42" />`,
  `<link rel="apple-touch-icon" href="${base}/apple-touch-icon.png" />`,
  `<link rel="manifest" href="${base}/manifest.webmanifest" />`,
  // ページ外（引っ張ったときなど）に見える背景もヘッダーと同じ色にする
  `<style>html{background-color:#061B42}</style>`,
].join('\n    ');

let html = readFileSync(indexPath, 'utf8');
html = html.replace('<html lang="en">', '<html lang="ja">');
// セーフエリア（ノッチ・ホームインジケーター）まで描画する
html = html.replace(
  /<meta name="viewport" content="([^"]*)"/,
  (m, c) => (c.includes('viewport-fit') ? m : `<meta name="viewport" content="${c}, viewport-fit=cover"`),
);
if (!html.includes('apple-touch-icon')) {
  html = html.replace('</head>', `    ${head}\n  </head>`);
}
writeFileSync(indexPath, html);

// GitHub Pages で /study などを直接開いてもアプリが表示されるようにする
copyFileSync(indexPath, join(dist, '404.html'));
// Jekyll 処理で _expo フォルダが消されないようにする
writeFileSync(join(dist, '.nojekyll'), '');

console.log(`web export finalized (base: "${base || '/'}")`);
