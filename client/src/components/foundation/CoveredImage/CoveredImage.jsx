import classNames from 'classnames';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} src
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, src }) => {

  const [containerSize, setContainerSize] = React.useState({ height: 0, width: 0 });
  /** @type {React.RefCallback<HTMLDivElement>} */
  const callbackRef = React.useCallback((el) => {
    setContainerSize({
      height: el?.clientHeight ?? 0,
      width: el?.clientWidth ?? 0,
    });
  }, []);

  const [imgSize, setImageSize] = React.useState({ height: 0, width: 0, ratio: 1 });
  /** @type {React.RefCallback<HTMLDivElement>} */
  const onImageLoaded = React.useCallback(({target:img}) => {
    setImageSize({
      height: img?.offsetHeight ?? 0,
      width: img?.offsetWidth ?? 0,
      ratio: (img?.offsetHeight / img?.offsetWidth ) ?? 1
    });
  }, []);
  
  const containerRatio = containerSize.height / containerSize.width;

  return (
    <div ref={callbackRef} className="relative w-full h-full overflow-hidden">
      <LazyLoadImage
        alt={alt}
        className={classNames('absolute left-1/2 top-1/2 max-w-none transform -translate-x-1/2 -translate-y-1/2', {
          'w-auto h-full': containerRatio > imgSize.ratio,
          'w-full h-auto': containerRatio <= imgSize.ratio,
        })}
        loading="lazy"
        src={src}
        onLoad={onImageLoaded}
      />
    </div>
  );
};

export { CoveredImage };
