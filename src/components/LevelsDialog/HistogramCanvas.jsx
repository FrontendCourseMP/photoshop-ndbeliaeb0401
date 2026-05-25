import { useEffect, useRef } from 'react';
import styles from './HistogramCanvas.module.css';

const HistogramCanvas = ({ histogram, mode = 'linear' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!histogram) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, 0, width, height);

    const maxCount = Math.max(...histogram);
    let scaledMax = maxCount;
    if (mode === 'log') {
      scaledMax = Math.log10(maxCount + 1);
    }

    const barWidth = width / 256;
    for (let i = 0; i < 256; i++) {
      let barHeight = (histogram[i] / maxCount) * height;
      if (mode === 'log') {
        barHeight = (Math.log10(histogram[i] + 1) / scaledMax) * height;
      }
      if (barHeight > 0) {
        ctx.fillStyle = '#8ab';
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 0.5, barHeight);
      }
    }
  }, [histogram, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={150}
      className={styles.canvas}
    />
  );
};

export default HistogramCanvas;