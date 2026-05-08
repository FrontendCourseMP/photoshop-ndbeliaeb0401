import { useEffect, useRef } from 'react';
import styles from './ChannelsPanel.module.css';

const ChannelsPanel = ({ originalImageData, activeChannels, toggleChannel, hasAlpha }) => {
  const canvasRefs = {
    red: useRef(null),
    green: useRef(null),
    blue: useRef(null),
    alpha: useRef(null),
  };

  useEffect(() => {
    if (!originalImageData) return;
    const { width, height, data } = originalImageData;
    const thumbWidth = 80;
    const thumbHeight = (height / width) * thumbWidth;

    const drawChannelThumb = (ref, getValue) => {
      const canvas = ref.current;
      if (!canvas) return;
      canvas.width = thumbWidth;
      canvas.height = thumbHeight;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(thumbWidth, thumbHeight);
      const stepX = width / thumbWidth;
      const stepY = height / thumbHeight;
      for (let y = 0; y < thumbHeight; y++) {
        for (let x = 0; x < thumbWidth; x++) {
          const srcX = Math.floor(x * stepX);
          const srcY = Math.floor(y * stepY);
          const idx = (srcY * width + srcX) * 4;
          const value = getValue(data[idx], data[idx+1], data[idx+2], data[idx+3]);
          const gray = Math.min(255, Math.max(0, value));
          const pixelIdx = (y * thumbWidth + x) * 4;
          imgData.data[pixelIdx] = gray;
          imgData.data[pixelIdx+1] = gray;
          imgData.data[pixelIdx+2] = gray;
          imgData.data[pixelIdx+3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    drawChannelThumb(canvasRefs.red, (r) => r);
    drawChannelThumb(canvasRefs.green, (_, g) => g);
    drawChannelThumb(canvasRefs.blue, (_, __, b) => b);
    drawChannelThumb(canvasRefs.alpha, (_, __, ___, a) => a);
  }, [originalImageData]);

  if (!originalImageData) return null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Каналы</h3>
      <div className={styles.channels}>
        <div
          className={`${styles.channel} ${activeChannels.red ? styles.active : ''}`}
          onClick={() => toggleChannel('red')}
        >
          <canvas ref={canvasRefs.red} className={styles.thumbnail} />
          <span>Красный</span>
        </div>
        <div
          className={`${styles.channel} ${activeChannels.green ? styles.active : ''}`}
          onClick={() => toggleChannel('green')}
        >
          <canvas ref={canvasRefs.green} className={styles.thumbnail} />
          <span>Зелёный</span>
        </div>
        <div
          className={`${styles.channel} ${activeChannels.blue ? styles.active : ''}`}
          onClick={() => toggleChannel('blue')}
        >
          <canvas ref={canvasRefs.blue} className={styles.thumbnail} />
          <span>Синий</span>
        </div>
        <div
          className={`${styles.channel} ${activeChannels.alpha ? styles.active : ''} ${!hasAlpha ? styles.disabled : ''}`}
          onClick={() => hasAlpha && toggleChannel('alpha')}
          title={!hasAlpha ? "Изображение не содержит альфа-канала (прозрачности)" : ""}
        >
          <canvas ref={canvasRefs.alpha} className={styles.thumbnail} />
          <span>Альфа</span>
          {!hasAlpha && <span className={styles.note}>нет данных</span>}
        </div>
      </div>
    </div>
  );
};

export default ChannelsPanel;