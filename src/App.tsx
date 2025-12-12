// Unsplash API の管理画面: https://unsplash.com/oauth/applications/738210
import { useState, useEffect } from 'react';
import { decodeBlurHash } from 'fast-blurhash';
import { ImageCard } from './components/ImageCard';
import './_App.scss';

// 環境変数からUnsplash APIキーを取得
// ビルド時にコード内に埋め込まれる（.envファイルから読み込み）
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

/**
 * Unsplash APIから取得する画像データの型定義
 */
interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  width: number;
  height: number;
  blur_hash: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

function App() {
  // Unsplash APIから取得した画像データの配列
  const [images, setImages] = useState<UnsplashImage[]>([]);

  // ローディング状態（画像取得中かどうか）
  const [loading, setLoading] = useState<boolean>(true);

  // エラーメッセージ（エラー発生時のみ値が入る）
  const [error, setError] = useState<string | null>(null);

  // BlurHashから生成したプレースホルダー画像のマップ（キー: 画像ID、値: Data URL）
  const [blurhashImages, setBlurhashImages] = useState<Record<string, string>>(
    {}
  );

  // UI トランジション用の状態管理
  const [isLoadingFadeOut, setIsLoadingFadeOut] = useState<boolean>(false); // ローディング表示のフェードアウト制御
  const [isGalleryVisible, setIsGalleryVisible] = useState<boolean>(false); // ギャラリーのフェードイン制御

  /**
   * BlurHashからプレースホルダー画像のData URLを生成する関数
   *
   * BlurHashは画像をぼかした状態の文字列表現で、実際の画像が読み込まれる前に
   * プレースホルダーとして表示することで、UXを向上させる
   *
   * @param blurHash - Unsplash APIから取得したBlurHash文字列
   * @param width - 生成する画像の幅（ピクセル）
   * @param height - 生成する画像の高さ（ピクセル）
   * @returns Data URL形式の画像文字列（canvas.toDataURL()の結果）
   */
  const generateBlurDataUrl = (
    blurHash: string,
    width: number,
    height: number
  ): string => {
    if (!blurHash) return '';

    try {
      // BlurHashをデコードしてピクセルデータ配列を取得
      const pixels = decodeBlurHash(blurHash, width, height);

      // Canvas要素を作成してピクセルデータを描画
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return '';

      // ImageDataオブジェクトを作成し、デコードしたピクセルデータをセット
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      // CanvasをData URL形式（base64エンコードされた画像）に変換して返す
      return canvas.toDataURL();
    } catch (e) {
      console.error('BlurHash変換エラー:', e);
      return '';
    }
  };

  /**
   * コンポーネントのマウント時にUnsplash APIから画像を取得する
   * 依存配列が空なので、初回レンダリング時に1回だけ実行される
   */
  useEffect(() => {
    const fetchRandomAnimalImages = async () => {
      try {
        // 状態を初期化してローディング表示を開始
        setLoading(true);
        setIsLoadingFadeOut(false);
        setIsGalleryVisible(false);
        setError(null);

        // Unsplash APIを使用してランダムな動物の画像を20枚取得
        // query: cute-animal でかわいい動物の画像に絞り込み
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=cute-animal&count=20&client_id=${UNSPLASH_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`APIリクエストエラー: ${response.status}`);
        }

        const data = await response.json();
        setImages(data);

        // 画像データの取得が完了したら、スムーズなトランジションを開始
        setIsLoadingFadeOut(true); // ローディング表示をフェードアウト開始

        // トランジション用のタイムアウト処理
        // CSSアニメーションのタイミングと合わせて、段階的に状態を変更
        setTimeout(() => {
          setIsGalleryVisible(true); // ギャラリーのフェードイン開始

          // さらに少し遅延させてローディング表示を完全に削除
          setTimeout(() => {
            setLoading(false);
          }, 100);
        }, 500); // CSSのフェードアウトアニメーション時間に合わせる
      } catch (err) {
        console.error('画像の取得に失敗しました:', err);
        setError('画像の取得に失敗しました。もう一度お試しください。');
        setLoading(false);
      }
    };

    fetchRandomAnimalImages();
  }, []); // 依存配列が空 = マウント時のみ実行

  /**
   * 画像データが取得されたら、BlurHashを事前に変換してプレースホルダー画像を生成
   *
   * 実際の画像が読み込まれる前にぼかし画像を表示することで、
   * ローディング中のUXを向上させる
   */
  useEffect(() => {
    if (images.length > 0) {
      const blurImages: Record<string, string> = {};

      images.forEach((image) => {
        if (image.blur_hash) {
          // 小さいサイズ（32x32）でBlurHashをデコードして効率化
          // 背景として引き伸ばされるので、小さいサイズで十分
          blurImages[image.id] = generateBlurDataUrl(image.blur_hash, 32, 32);
        }
      });

      // 生成したプレースホルダー画像をステートに保存
      setBlurhashImages(blurImages);
    }
  }, [images]); // imagesが変更されたら再実行

  return (
    <div className="container">
      {/* ローディング表示（loading=trueの間だけ表示、フェードアウトアニメーション対応） */}
      {loading && (
        <p className={`loading ${isLoadingFadeOut ? 'loading--fade-out' : ''}`}>
          画像を読み込み中...
        </p>
      )}

      {/* エラー表示エリア（現在はコメントアウト） */}
      {error && <div className="error">{/* <p>{error}</p> */}</div>}

      {/* 画像ギャラリー本体（エラーがない場合のみ表示） */}
      {!error && (
        <div
          className={`image-gallery ${isGalleryVisible ? 'image-gallery--fade-in' : 'image-gallery--hidden'}`}
        >
          {/* 
            3カラムレイアウトで画像を表示
            - 各カラムは自動的に上下にスクロール（CSSアニメーション）
            - 画像を2回ずつ配置して無限スクロール風の演出を実現
            - 奇数カラム（1,3列目）は上方向、偶数カラム（2列目）は下方向に移動
          */}

          {/* 1カラム目 - 上へ移動するアニメーション */}
          <div className="column column--up">
            {/* インデックスが0, 3, 6, 9... の画像を3セット表示し、-50%移動で完全なループを実現 */}
            {[...Array(3)].map((_, repeatIndex) =>
              images
                .filter((_, i) => i % 3 === 0)
                .map((image) => (
                  <ImageCard
                    key={
                      repeatIndex === 0
                        ? image.id
                        : `dup${repeatIndex}-${image.id}`
                    }
                    image={image}
                    blurDataUrl={blurhashImages[image.id]}
                    isDuplicate={repeatIndex > 0}
                  />
                ))
            )}
          </div>

          {/* 2カラム目 - 下へ移動するアニメーション */}
          <div className="column column--down">
            {/* インデックスが1, 4, 7, 10... の画像を3セット表示 */}
            {[...Array(3)].map((_, repeatIndex) =>
              images
                .filter((_, i) => i % 3 === 1)
                .map((image) => (
                  <ImageCard
                    key={
                      repeatIndex === 0
                        ? image.id
                        : `dup${repeatIndex}-${image.id}`
                    }
                    image={image}
                    blurDataUrl={blurhashImages[image.id]}
                    isDuplicate={repeatIndex > 0}
                  />
                ))
            )}
          </div>

          {/* 3カラム目 - 上へ移動するアニメーション */}
          <div className="column column--up">
            {/* インデックスが2, 5, 8, 11... の画像を3セット表示 */}
            {[...Array(3)].map((_, repeatIndex) =>
              images
                .filter((_, i) => i % 3 === 2)
                .map((image) => (
                  <ImageCard
                    key={
                      repeatIndex === 0
                        ? image.id
                        : `dup${repeatIndex}-${image.id}`
                    }
                    image={image}
                    blurDataUrl={blurhashImages[image.id]}
                    isDuplicate={repeatIndex > 0}
                  />
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
