# AWS SAA学習アプリ

AWS Certified Solutions Architect – Associate（SAA-C03）の対策用スマホアプリ（MVP）。
Expo（React Native）+ TypeScript + Expo Router + Zustand で作っています。

## 実装済みの機能（仕様書 F-01〜F-06）

| 機能 | 画面 |
| --- | --- |
| 教材（4 分野 × 4 単元の読み物。読了管理、単元ごとの問題演習） | 教材タブ → 単元 |
| 問題演習（分野・難易度・問題数・出題範囲を選ぶ、単一／複数選択） | 演習タブ → 問題 |
| 即時解説（正誤、解説、各誤答の理由、参考ドキュメント） | 問題 |
| 自信度入力（自信あり／なしで回答） | 問題 |
| 弱点復習（SM-2 方式の間隔反復） | ホーム → 今日の復習 |
| 進捗（分野別正答率、合格予測、苦手サービス、連続学習日数） | 進捗タブ |
| ブックマーク・メモ | 問題 / ブックマーク |
| 受験日・1日の目標・データ書き出し・リセット | 設定タブ |

学習データは端末内（AsyncStorage）に保存します。

## 起動方法

Node.js 20 以上が入った PC で実行します。

```bash
npm install
npx expo start
```

表示された QR コードをスマホの **Expo Go** アプリで読み取ると実機で動きます。
ブラウザで確認する場合は `npx expo start --web`。

## Web版（GitHub Pages）

main に push すると GitHub Actions（`.github/workflows/deploy-pages.yml`）が Web 版をビルドし、
`https://neon-magnet.github.io/aws-saa-study/` に公開します。

- 初回のみ、リポジトリの Settings → Pages → Source を「GitHub Actions」にする
- iPhone の Safari で開き、共有 → 「ホーム画面に追加」でアプリのように使える
- ローカルで同じものを作る場合：`EXPO_BASE_URL=/aws-saa-study npm run export:pages`

## 教材の追加・編集

`src/data/lessons/*.ts` に分野ごとの単元があります。本文は簡易 Markdown（`##` 見出し、`- ` 箇条書き、`> ` ポイント枠、`|` 表、`**太字**`）。
`questionIds` に書いた問題が「この単元の問題を解く」で出題され、その問題の解説から単元へ戻れます。

## 問題の追加

分野ごとのファイル `src/data/bank/*.ts` に問題を追加します（現在はオリジナル問題 56 問：4 分野 × 基礎 7 問・応用 7 問）。難易度は `difficulty: 1`（基礎）か `2`（応用）。
型は `src/types.ts` の `Question` を参照。

```ts
{
  id: 'Q-SEC-0003',
  domain: 'secure',            // secure / resilient / performance / cost
  services: ['KMS', 'S3'],
  type: 'single',              // 複数選択は 'multiple'
  stem: '問題文',
  choices: [
    { id: 'A', text: '選択肢', why_wrong: '誤りの理由' },
    { id: 'B', text: '正解の選択肢' },
  ],
  answer_ids: ['B'],
  explanation: '解説（**太字** と `コード` が使えます）',
  references: ['https://docs.aws.amazon.com/...'],
  difficulty: 1,
  version: 1,
}
```

## フォルダ構成

```
src/
  app/                 画面（Expo Router のファイルベースルーティング）
    (tabs)/            ホーム・教材・演習・進捗・設定タブ
    lesson/[id].tsx    教材の単元
    quiz.tsx           問題・解説
    result.tsx         結果
    bookmarks.tsx      ブックマーク
  components/          共通 UI、教材本文の表示（Markdown.tsx）
  data/questions.ts    問題データ（分野別の本体は data/bank/）
  data/lessons/        教材データ
  lib/                 SM-2、統計、日付、定数
  store/               Zustand ストア（端末内に保存）
  types.ts             型定義
```

## 次の段階（仕様書の第2段階）

模擬試験（65問・130分）、フラッシュカード、通知、ログインと端末間同期。

## 注意

アイコンに AWS のロゴが含まれています。個人利用は問題ありませんが、ストアで公開する場合は AWS の商標ガイドラインに沿ったアイコンへの差し替えが必要です。
