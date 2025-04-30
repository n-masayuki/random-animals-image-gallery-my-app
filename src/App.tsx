// fyi: https://unsplash.com/oauth/applications/738210
import { useState, useEffect } from 'react';
import { decodeBlurHash } from 'fast-blurhash';
import { ImageCard } from './components/ImageCard';
import './_App.scss';

// 環境変数からAPIキーを取得
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

// 画像の型定義
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
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blurhashImages, setBlurhashImages] = useState<Record<string, string>>(
    {}
  );
  // トランジション状態を追加
  const [isLoadingFadeOut, setIsLoadingFadeOut] = useState<boolean>(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState<boolean>(false);

  // BlurHashからデータURLを生成する関数
  const generateBlurDataUrl = (
    blurHash: string,
    width: number,
    height: number
  ): string => {
    if (!blurHash) return '';

    try {
      const pixels = decodeBlurHash(blurHash, width, height);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return '';

      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      return canvas.toDataURL();
    } catch (e) {
      console.error('BlurHash変換エラー:', e);
      return '';
    }
  };

  useEffect(() => {
    const fetchRandomAnimalImages = async () => {
      try {
        setLoading(true);
        setIsLoadingFadeOut(false);
        setIsGalleryVisible(false);
        setError(null);

        // Unsplash APIを使用してランダムな動物の画像を20枚取得
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=cute-animal&count=20&client_id=${UNSPLASH_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`APIリクエストエラー: ${response.status}`);
        }

        const data = await response.json();
        setImages(data);

        // 画像の読み込みが完了したら、トランジションを開始
        setIsLoadingFadeOut(true);

        // フェードアウト完了後にギャラリーを表示、ローディングを非表示に
        setTimeout(() => {
          setIsGalleryVisible(true);
          // ここで loading を false にするのを遅延させる
          setTimeout(() => {
            setLoading(false);
          }, 100);
        }, 500); // フェードアウト時間に合わせる
      } catch (err) {
        console.error('画像の取得に失敗しました:', err);
        setError('画像の取得に失敗しました。もう一度お試しください。');
        setLoading(false);
      }
    };

    fetchRandomAnimalImages();
  }, []);

  // BlurHashを画像のロード前に変換してステートに保存
  useEffect(() => {
    if (images.length > 0) {
      const blurImages: Record<string, string> = {};

      images.forEach((image) => {
        if (image.blur_hash) {
          // 小さいサイズでBlurHashをデコードして効率化
          blurImages[image.id] = generateBlurDataUrl(image.blur_hash, 32, 32);
        }
      });

      setBlurhashImages(blurImages);
    }
  }, [images]);

  return (
    <div className="container">
      {/* loadingがtrueの間だけ表示 */}
      {loading && (
        <p className={`loading ${isLoadingFadeOut ? 'loading--fade-out' : ''}`}>
          画像を読み込み中...
        </p>
      )}
      {error && <div className="error">{/* <p>{error}</p> */}</div>}
      {/* ギャラリーの表示条件を明確に */}
      {!error && (
        <div
          className={`image-gallery ${isGalleryVisible ? 'image-gallery--fade-in' : 'image-gallery--hidden'}`}
        >
          {/* 1カラム目 - 上へ移動 */}
          <div className="column column--up">
            {images
              .filter((_, i) => i % 3 === 0)
              .map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                />
              ))}
            {/* 画像を複製して連続スクロールを実現 */}
            {images
              .filter((_, i) => i % 3 === 0)
              .map((image) => (
                <ImageCard
                  key={`dup-${image.id}`}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                  isDuplicate={true}
                />
              ))}
          </div>

          {/* 2カラム目 - 下へ移動 */}
          <div className="column column--down">
            {images
              .filter((_, i) => i % 3 === 1)
              .map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                />
              ))}
            {/* 画像を複製して連続スクロールを実現 */}
            {images
              .filter((_, i) => i % 3 === 1)
              .map((image) => (
                <ImageCard
                  key={`dup-${image.id}`}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                  isDuplicate={true}
                />
              ))}
          </div>

          {/* 3カラム目 - 上へ移動 */}
          <div className="column column--up">
            {images
              .filter((_, i) => i % 3 === 2)
              .map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                />
              ))}
            {/* 画像を複製して連続スクロールを実現 */}
            {images
              .filter((_, i) => i % 3 === 2)
              .map((image) => (
                <ImageCard
                  key={`dup-${image.id}`}
                  image={image}
                  blurDataUrl={blurhashImages[image.id]}
                  isDuplicate={true}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
