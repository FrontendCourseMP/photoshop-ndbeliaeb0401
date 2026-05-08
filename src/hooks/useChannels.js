import { useState, useEffect, useCallback } from 'react';

export const useChannels = (originalImageData, setDisplayImageData) => {
  const [hasAlpha, setHasAlpha] = useState(false);
  const [activeChannels, setActiveChannels] = useState({
    red: true,
    green: true,
    blue: true,
    alpha: true,
  });

  useEffect(() => {
    if (!originalImageData) return;
    const data = originalImageData.data;
    let alphaExists = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 255) {
        alphaExists = true;
        break;
      }
    }
    setHasAlpha(alphaExists);
    if (!alphaExists && !activeChannels.alpha) {
      setActiveChannels(prev => ({ ...prev, alpha: true }));
    }
  }, [originalImageData]);

  const applyChannels = useCallback((imageData, channels) => {
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      const r = channels.red ? data[i] : 0;
      const g = channels.green ? data[i + 1] : 0;
      const b = channels.blue ? data[i + 2] : 0;
      let a = channels.alpha ? data[i + 3] : 255;
      if (!hasAlpha && !channels.alpha) a = 255;
      newData[i] = r;
      newData[i + 1] = g;
      newData[i + 2] = b;
      newData[i + 3] = a;
    }
    return new ImageData(newData, imageData.width, imageData.height);
  }, [hasAlpha]);

  useEffect(() => {
    if (!originalImageData) return;
    const modified = applyChannels(originalImageData, activeChannels);
    setDisplayImageData(modified);
  }, [originalImageData, activeChannels, applyChannels, setDisplayImageData]);

  const toggleChannel = (channel) => {
    if (channel === 'alpha' && !hasAlpha) return;
    setActiveChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  return { activeChannels, toggleChannel, hasAlpha };
};