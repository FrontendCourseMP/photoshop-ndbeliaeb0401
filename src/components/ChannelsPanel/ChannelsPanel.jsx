import { useEffect, useRef } from 'react';
import styles from './ChannelsPanel.module.css';

const ChannelsPanel = ({ originalImageData, activeChannels, toggleChannel, hasAlpha, isGrayscale }) => {
  const canvasRefs = {
    red: useRef(null),
    green: useRef(null),
    blue: useRef(null),
    alpha: useRef(null),
  };

  useEffect(() => {
    if (!originalImageData) return;
    const { width, height, data } = originalImageData;
    const thumbWidth = 70;
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

    if (!isGrayscale) {
      drawChannelThumb(canvasRefs.red, (r) => r);
      drawChannelThumb(canvasRefs.green, (_, g) => g);
      drawChannelThumb(canvasRefs.blue, (_, __, b) => b);
      drawChannelThumb(canvasRefs.alpha, (_, __, ___, a) => a);
    } else {
      // Для grayscale показываем один канал (яркость)
      const drawGrayThumb = (ref) => {
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
            const gray = data[idx];
            const pixelIdx = (y * thumbWidth + x) * 4;
            imgData.data[pixelIdx] = gray;
            imgData.data[pixelIdx+1] = gray;
            imgData.data[pixelIdx+2] = gray;
            imgData.data[pixelIdx+3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      };
      drawGrayThumb(canvasRefs.red); // используем ref красного для канала Gray
    }
  }, [originalImageData, isGrayscale]);

  if (!originalImageData) return null;

  if (isGrayscale) {
    return (
      <div className={styles.panel}>
        <h3>Channels</h3>
        <div className={styles.channelList}>
          <div
            className={`${styles.channelCard} ${activeChannels.red ? styles.active : ''}`}
            onClick={() => toggleChannel('red')}
            style={{ cursor: 'default', opacity: 0.7 }}
          >
            <canvas ref={canvasRefs.red} className={styles.thumbnail} />
            <span className={styles.channelLabel}>Gray</span>
          </div>
        </div>
      </div>
    );
  }

  const channels = [
    { id: 'red', label: 'R' },
    { id: 'green', label: 'G' },
    { id: 'blue', label: 'B' },
    { id: 'alpha', label: 'A', disabled: !hasAlpha }
  ];

  return (
    <div className={styles.panel}>
      <h3>Channels</h3>
      <div className={styles.channelList}>
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`${styles.channelCard} ${activeChannels[ch.id] ? styles.active : ''} ${ch.disabled ? styles.disabled : ''}`}
            onClick={() => !ch.disabled && toggleChannel(ch.id)}
          >
            <canvas ref={canvasRefs[ch.id]} className={styles.thumbnail} />
            <span className={styles.channelLabel}>{ch.label}</span>
            {ch.disabled && <span className={styles.badge}>no alpha</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelsPanel;