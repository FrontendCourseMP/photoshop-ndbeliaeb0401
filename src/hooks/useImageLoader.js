import { useCallback } from 'react';
import { decodeGB7 } from '../utils/gb7Decoder';

export const useImageLoader = (canvasRef, setImageInfo, onAfterLoad) => {
  const drawImageData = useCallback((imageData, width, height, colorDepth) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    setImageInfo({ width, height, colorDepth });
    if (onAfterLoad) onAfterLoad();
  }, [canvasRef, setImageInfo, onAfterLoad]);

  const loadImageFromUrl = useCallback(async ({ url, file }) => {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'gb7') {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const { width, height, hasMask, grayValues } = decodeGB7(arrayBuffer);
        const imageData = new ImageData(width, height);
        for (let i = 0; i < width * height; i++) {
          const gray = Math.round(grayValues[i] * 2);
          imageData.data[i * 4] = gray;
          imageData.data[i * 4 + 1] = gray;
          imageData.data[i * 4 + 2] = gray;
          imageData.data[i * 4 + 3] = 255;
        }
        const colorDepth = hasMask ? 8 : 7;
        drawImageData(imageData, width, height, colorDepth);
      } catch (err) {
        console.error('GB7 decode error', err);
        alert('Failed to load GB7 file');
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setImageInfo({
        width: img.width,
        height: img.height,
        colorDepth: 24,
      });
      if (onAfterLoad) onAfterLoad();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [canvasRef, setImageInfo, onAfterLoad, drawImageData]);

  return { loadImageFromUrl };
};