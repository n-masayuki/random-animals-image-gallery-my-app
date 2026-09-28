# Random Animals Image Gallery

Unsplash API からランダムな動物の写真を取得し、画面いっぱいに表示するギャラリーアプリです。React・TypeScript・Vite で構築しています。

## 表示と機能

- `cute-animal` を検索条件に、ランダムな写真を 20 枚取得します。
- 写真を 3 列に振り分け、左右の列は上方向、中央の列は下方向へ自動スクロールします。
- 取得済みの写真を各列で 3 セット描画し、CSS アニメーションで繰り返し表示します。スクロールによる追加取得はありません。
- BlurHash から生成したぼかし画像を背景に表示し、写真の読み込み完了時にフェードインします。
- 画像の遅延読み込み（`loading="lazy"`）と非同期デコードを使用します。
- 写真の縦横比を維持し、撮影者名とプロフィールへのリンクを表示します。
- 別の写真を見る場合はブラウザを再読み込みします。アプリ内に再取得ボタンはありません。

レイアウトは画面幅に応じて伸縮しますが、列数は常に 3 列です（ギャラリーの最小幅は 320px）。

## セットアップ

### 1. Node.js と npm の確認

プロジェクトのディレクトリで実行します。

```bash
node -v
npm -v
```

Node.js と npm は互換性のある組み合わせを使用してください。バージョン指定は [package.json](./package.json) の `volta` と `packageManager` にあります。

現在の `volta` 設定は Node.js `22.14.0` / npm `12.1.0` で、npm 実行時に Node.js のサポート範囲外という警告が出る組み合わせです。Volta を使用する場合は、インストール前に対応するバージョンへ設定を更新してください。npm の警告に表示される Node.js の対応範囲を確認できます。

### 2. 依存パッケージのインストール

```bash
npm install
```

`package.json` と `package-lock.json` が同期済みの環境で、ロックファイルの依存関係を再現する場合は `npm ci` を使用します。依存関係の更新後は、両方のファイルを一緒にコミットしてください。

### 3. Unsplash の Access Key を設定

[Unsplash の開発者向けドキュメント](https://unsplash.com/documentation#creating-a-developer-account) に従ってアプリケーションを登録し、Access Key を取得します。

プロジェクトルートに `.env` を作成してください。

```env
VITE_UNSPLASH_API_KEY=your_unsplash_access_key
```

設定するのは **Access Key** です。Secret Key は使用しません。`.env` は `.gitignore` で除外されています。

現在の実装はブラウザから Unsplash API に直接アクセスします。`VITE_` で始まる環境変数はクライアントのコードに含まれるため、この設定値はブラウザから確認できます。環境変数の変更後は開発サーバーを再起動し、ビルド済みのアプリに反映する場合は再ビルドしてください。詳細は [Vite の環境変数の説明](https://vite.dev/guide/env-and-mode) を参照してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ターミナルに表示されるローカル URL をブラウザで開きます。

## 開発用コマンド

| コマンド          | 内容                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Vite の開発サーバーを起動                   |
| `npm run lint`    | ESLint でコードを検査                       |
| `npm run build`   | TypeScript の型チェック後、`dist/` にビルド |
| `npm run preview` | ビルド済みの `dist/` をローカルで確認       |

ビルド結果の確認は次の順序で実行します。

```bash
npm run lint
npm run build
npm run preview
```

プレビューサーバーはビルドを実行しません。コードや環境変数を変更した場合は、先に `npm run build` を実行してください。

## 技術構成

| 技術                          | 用途                               |
| ----------------------------- | ---------------------------------- |
| React / React DOM             | コンポーネントの描画と状態管理     |
| TypeScript                    | 型チェック                         |
| Vite / `@vitejs/plugin-react` | 開発サーバーとビルド               |
| Sass（`sass-embedded`）       | SCSS のコンパイル                  |
| `modern-normalize`            | ブラウザ間の基本スタイルの差を調整 |
| `fast-blurhash` / Canvas API  | ぼかしプレースホルダーの生成       |
| ESLint / `typescript-eslint`  | TypeScript・React コードの静的解析 |

依存バージョンの指定は [package.json](./package.json)、解決済みのバージョンは [package-lock.json](./package-lock.json) を参照してください。Prettier も開発依存に含まれますが、整形用の npm スクリプトは定義されていません。

## 主なファイル

| ファイル                       | 役割                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| `src/main.tsx`                 | React の起動、StrictMode と共通 CSS の適用                    |
| `src/App.tsx`                  | API 呼び出し、読み込み状態、BlurHash の変換、3 列への画像配置 |
| `src/components/ImageCard.tsx` | 写真・プレースホルダー・撮影者クレジットの表示                |
| `src/_App.scss`                | ギャラリーのレイアウトとスクロール・フェードのアニメーション  |
| `src/index.css`                | normalize と共通スタイル                                      |
| `src/vite-env.d.ts`            | Vite のクライアント用型定義の参照                             |
| `index.html`                   | HTML のエントリーポイント                                     |
| `vite.config.ts`               | Vite と React プラグインの設定                                |
| `tsconfig*.json`               | アプリとビルド設定用の TypeScript 設定                        |
| `eslint.config.js`             | ESLint のルール設定                                           |

## 依存関係の更新

```bash
npm outdated
```

メジャーバージョンを更新する場合は、関連ツールの対応範囲も確認してください。TypeScript と `typescript-eslint` は組み合わせて更新を判断します。

今回確認した `typescript-eslint@8.70.1` の TypeScript 対応範囲は `>=4.8.4 <6.1.0` です。TypeScript 7.0.2 との組み合わせでは `ERESOLVE` が発生しました。`--force` や `--legacy-peer-deps` で回避せず、対応範囲内のバージョンを指定してください。将来 `typescript-eslint` を更新する際は、そのバージョンの対応範囲を改めて確認します。

更新後は `npm run lint` と `npm run build` を実行し、ブラウザで写真の取得・表示・アニメーションを確認します。

## 画像が表示されない場合

- `.env` の変数名と Access Key を確認し、開発サーバーを再起動してください。
- ブラウザの開発者ツールで Console と Network を開き、Unsplash API の応答を確認してください。
- 現在の実装では API エラーのメッセージが画面に表示されません。エラー時はギャラリーの代わりに、外部サービス `picsum.photos` の画像を背景にした表示へ切り替わります。原因は Console に出力されます。
- 開発時は React StrictMode によって Effect が再実行され、API リクエストが複数回発生することがあります。

## ライセンス

All rights reserved. 詳細は [LICENSE.md](LICENSE.md) を参照してください。
