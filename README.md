# Random Animals Image Gallery

Unsplash API からランダムな動物の写真を取得して表示するギャラリーアプリです。React・TypeScript・Vite で構築しています。

## セットアップ

### 1. 依存パッケージをインストール

```bash
npm install
```

### 2. Unsplash の Access Key を設定

[Unsplash の開発者向けドキュメント](https://unsplash.com/documentation#creating-a-developer-account) に従って Access Key を取得し、プロジェクトルートに `.env` を作成します。

```env
VITE_UNSPLASH_API_KEY=your_unsplash_access_key
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

表示されたローカル URL をブラウザで開きます。

## 主な機能

- `cute-animal` を検索条件に、ランダムな写真を 20 枚取得します。
- 写真を 3 列に配置し、列ごとに異なる方向へ自動スクロールします。
- BlurHash のプレースホルダーと画像の遅延読み込みに対応しています。
- 写真の撮影者名とプロフィールへのリンクを表示します。

## 開発用コマンド

| コマンド          | 内容                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Vite の開発サーバーを起動                   |
| `npm run lint`    | ESLint でコードを検査                       |
| `npm run build`   | TypeScript の型チェック後、`dist/` にビルド |
| `npm run preview` | ビルド済みの `dist/` をローカルで確認       |

## ライセンス

All rights reserved. 詳細は [LICENSE.md](LICENSE.md) を参照してください。
