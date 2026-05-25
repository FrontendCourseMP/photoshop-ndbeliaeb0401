import { useState, useEffect, useCallback } from 'react';

const computeLuminance = (r, g, b) => {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
};

const computeChannelHistogram = (imageData, channel) => {
  const { width, height, data } = imageData;
  const hist = new Array(256).fill(0);
  const totalPixels = width * height;

  if (channel === 'luminance') {
    for (let i = 0; i < totalPixels; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const lum = computeLuminance(r, g, b);
      hist[lum]++;
    }
  } else if (channel === 'red') {
    for (let i = 0; i < totalPixels; i++) {
      const val = data[i * 4];
      hist[val]++;
    }
  } else if (channel === 'green') {
    for (let i = 0; i < totalPixels; i++) {
      const val = data[i * 4 + 1];
      hist[val]++;
    }
  } else if (channel === 'blue') {
    for (let i = 0; i < totalPixels; i++) {
      const val = data[i * 4 + 2];
      hist[val]++;
    }
  } else if (channel === 'alpha') {
    for (let i = 0; i < totalPixels; i++) {
      const val = data[i * 4 + 3];
      hist[val]++;
    }
  }
  return hist;
};

export const useHistogram = (imageData) => {
  const [histogram, setHistogram] = useState(null);
  const [currentChannel, setCurrentChannel] = useState('luminance');

  useEffect(() => {
    if (!imageData) return;
    const hist = computeChannelHistogram(imageData, currentChannel);
    setHistogram(hist);
  }, [imageData, currentChannel]);

  const updateChannel = (channel) => {
    setCurrentChannel(channel);
  };

  return { histogram, currentChannel, updateChannel };
};