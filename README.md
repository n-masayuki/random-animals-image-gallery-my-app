# Random Animals Image Gallery

Unsplash APIを使用してランダムな動物の画像を表示するギャラリーアプリです。

## 機能

- Unsplash APIからかわいい動物の画像を20枚取得
- BlurHash によるプレースホルダー表示
- レスポンシブデザイン
- 画像の再読み込み機能

## セットアップ

1. 依存パッケージのインストール

```bash
npm install
```

1. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、Unsplash API キーを設定してください。

```env
VITE_UNSPLASH_API_KEY=your_api_key_here
```

Unsplash API キーは [Unsplash Developers](https://unsplash.com/developers) で取得できます。

## 開発

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## ファイル構成と役割

### メインファイル

- **`src/App.tsx`** - アプリケーションのメインコンポーネント

  - Unsplash APIからの画像取得処理
  - BlurHashのデコードとプレースホルダー生成
  - 3カラムレイアウトでの画像表示制御
  - ローディング・エラー状態の管理
  - トランジションアニメーションの制御

- **`src/components/ImageCard.tsx`** - 個別の画像カードコンポーネント

  - 1枚の画像とクレジット情報の表示
  - BlurHashプレースホルダーから実画像へのスムーズな切り替え
  - lazy loading による最適化

- **`src/_App.scss`** - メインスタイルシート
  - 3カラムレイアウトのスタイル定義
  - 無限スクロール風のアニメーション設定
  - レスポンシブデザインの実装

### その他の重要なファイル

- **`.env`** - 環境変数（API キー）の管理
- **`vite.config.ts`** - Vite ビルドツールの設定
- **`tsconfig.json`** - TypeScript コンパイラの設定

## 技術スタック

- React 19
- TypeScript
- Vite
- Sass
- fast-blurhash
