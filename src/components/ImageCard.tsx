import { FC } from 'react';

interface ImageCardProps {
  image: {
    id: string;
    urls: {
      regular: string;
      small: string;
      thumb: string;
    };
    alt_description?: string;
    width: number;
    height: number;
    user: {
      name: string;
      links: {
        html: string;
      };
    };
  };
  blurDataUrl?: string;
  isDuplicate?: boolean;
}

export const ImageCard: FC<ImageCardProps> = ({
  image,
  blurDataUrl,
  isDuplicate = false,
}) => {
  return (
    <div
      key={isDuplicate ? `dup-${image.id}` : image.id}
      className="image-card"
    >
      <div
        className="image-container"
        style={{
          backgroundColor: '#f0f0f0',
          aspectRatio: `${image.width}/${image.height}`,
          backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={image.urls.small}
          alt={image.alt_description || 'ランダムな動物の画像'}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={(e) => {
            // 画像が読み込まれたらフェードイン
            e.currentTarget.style.opacity = '1';
          }}
        />
      </div>
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
