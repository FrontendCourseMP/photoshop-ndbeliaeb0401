import { useCallback } from 'react';
import { decodeGB7 } from '../utils/gb7Decoder';

export const useImageLoader = (setOriginalImageData, setImageInfo) => {
  const loadImageFromUrl = useCallback(async ({ url, file }) => {
    const ext = file.name.split('.').pop().toLowerCase();

    const processImageData = (imageData, width, height, colorDepth) => {
      setOriginalImageData(imageData);
      setImageInfo({ width, height, colorDepth });
    };

    if (ext === 'gb7') {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const { width, height, hasMask, grayValues } = decodeGB7(arrayBuffer);
        const imageData = new ImageData(width, height);
        for (let i = 0; i < width * height; i++) {
          const gray = Math.round(grayValues[i] / 127 * 255);
          imageData.data[i * 4] = gray;
          imageData.data[i * 4 + 1] = gray;
          imageData.data[i * 4 + 2] = gray;
          imageData.data[i * 4 + 3] = 255;
        }
        const colorDepth = hasMask ? 8 : 7;
        processImageData(imageData, width, height, colorDepth);
      } catch (err) {
        console.error('GB7 decode error', err);
        alert('Failed to load GB7 file');
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      let colorDepth = 24;
      const data = imageData.data;
      let hasAlpha = false;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 255) {
          hasAlpha = true;
          break;
        }
      }
      if (hasAlpha) colorDepth = 32;
      processImageData(imageData, img.width, img.height, colorDepth);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [setOriginalImageData, setImageInfo]);

  return { loadImageFromUrl };
};