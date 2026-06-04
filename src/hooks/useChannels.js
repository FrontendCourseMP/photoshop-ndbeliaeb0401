import { useState, useEffect, useCallback } from 'react';

export const useChannels = (originalImageData, setDisplayImageData) => {
  const [hasAlpha, setHasAlpha] = useState(false);
  const [activeChannels, setActiveChannels] = useState({
    red: true,
    green: true,
    blue: true,
    alpha: true,
  });
  const [isGrayscale, setIsGrayscale] = useState(false);

  useEffect(() => {
    if (!originalImageData) return;
    const data = originalImageData.data;
    let alphaExists = false;
    let gray = true;
    const len = data.length;
    for (let i = 0; i < len; i += 4) {
      if (data[i+3] !== 255) alphaExists = true;
      if (!(data[i] === data[i+1] && data[i+1] === data[i+2])) gray = false;
      if (alphaExists && !gray) break;
    }
    setHasAlpha(alphaExists);
    setIsGrayscale(gray);
    if (gray) {
      setActiveChannels(prev => ({ ...prev, red: true, green: true, blue: true }));
    }
  }, [originalImageData]);

  const applyChannels = useCallback((imageData, channels) => {
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    const isGray = isGrayscale;
    for (let i = 0; i < data.length; i += 4) {
      const r = isGray ? data[i] : (channels.red ? data[i] : 0);
      const g = isGray ? data[i+1] : (channels.green ? data[i+1] : 0);
      const b = isGray ? data[i+2] : (channels.blue ? data[i+2] : 0);
      let a = channels.alpha ? data[i+3] : 255;
      newData[i] = r;
      newData[i+1] = g;
      newData[i+2] = b;
      newData[i+3] = a;
    }
    return new ImageData(newData, imageData.width, imageData.height);
  }, [isGrayscale]);

  useEffect(() => {
    if (!originalImageData) return;
    const modified = applyChannels(originalImageData, activeChannels);
    setDisplayImageData(modified);
  }, [originalImageData, activeChannels, applyChannels, setDisplayImageData]);

  const toggleChannel = (channel) => {
    if (isGrayscale && (channel === 'red' || channel === 'green' || channel === 'blue')) return;
    if (channel === 'alpha' && !hasAlpha) return;
    setActiveChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  return { activeChannels, toggleChannel, hasAlpha, isGrayscale };
};