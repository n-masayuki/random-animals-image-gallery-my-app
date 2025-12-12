import { FC } from 'react';

/**
 * ImageCardコンポーネントのプロパティ型定義
 */
interface ImageCardProps {
  /** Unsplash APIから取得した画像データ */
  image: {
    id: string;
    urls: {
      regular: string;
      small: string; // 表示に使用するURL
      thumb: string;
    };
    alt_description?: string; // 画像の説明文（alt属性に使用）
    width: number; // 画像の元の幅
    height: number; // 画像の元の高さ
    user: {
      name: string; // 撮影者の名前
      links: {
        html: string; // Unsplashの撮影者プロフィールURL
      };
    };
  };
  /** BlurHashから生成したプレースホルダー画像のData URL */
  blurDataUrl?: string;
  /** 無限スクロール用の複製画像かどうか */
  isDuplicate?: boolean;
}

/**
 * 画像カードコンポーネント
 *
 * 1枚の画像とその撮影者情報を表示する。
 * BlurHashによるプレースホルダー表示と、画像読み込み完了時のフェードインアニメーションを実装。
 */
export const ImageCard: FC<ImageCardProps> = ({
  image,
  blurDataUrl,
  isDuplicate = false,
}) => {
  return (
    <div
      // 複製画像の場合はキーに "dup-" プレフィックスを付けて区別
      key={isDuplicate ? `dup-${image.id}` : image.id}
      className="image-card"
    >
      {/* 画像コンテナ - BlurHashをbackgroundImageとして表示 */}
      <div
        className="image-container"
        style={{
          backgroundColor: '#f0f0f0', // フォールバック用の背景色
          aspectRatio: `${image.width}/${image.height}`, // 画像の元のアスペクト比を維持
          backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : 'none', // BlurHashプレースホルダー
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 実際の画像 - 読み込み完了時にフェードイン */}
        <img
          src={image.urls.small}
          alt={image.alt_description || 'ランダムな動物の画像'}
          loading="lazy" // 遅延読み込みを有効化（スクロールして表示範囲に入ったら読み込み）
          decoding="async" // 非同期デコードでメインスレッドをブロックしない
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // コンテナに合わせてトリミング
            opacity: 0, // 初期状態は透明（読み込み前）
            transition: 'opacity 0.3s ease-in-out', // フェードインアニメーション
          }}
          onLoad={(e) => {
            // 画像の読み込みが完了したらopacityを1にしてフェードイン
            e.currentTarget.style.opacity = '1';
          }}
        />
      </div>
      {/* 撮影者クレジット表示 - Unsplashのガイドラインに従った表記 */}
      <div className="image-credit">
        Photo by{' '}
        <a
          href={image.user.links.html}
          target="_blank"
          rel="noopener noreferrer"
        >
          {image.user.name}
        </a>{' '}
        on Unsplash
      </div>
    </div>
  );
};
