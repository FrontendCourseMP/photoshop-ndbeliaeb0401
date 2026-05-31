import { useState, useEffect, useCallback } from 'react';

const createLookupTable = (black, gamma, white, max = 255) => {
  const table = new Uint8Array(max + 1);
  const range = white - black;
  for (let i = 0; i <= max; i++) {
    let value = (i - black) / range;
    value = Math.min(1, Math.max(0, value));
    value = Math.pow(value, 1 / gamma);
    table[i] = Math.round(value * max);
  }
  return table;
};

const applyLevelsToChannel = (imageData, channel, black, gamma, white) => {
  const lut = createLookupTable(black, gamma, white);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data.length);
  const channelIdx = channel === 'red' ? 0 : channel === 'green' ? 1 : channel === 'blue' ? 2 : 3;
  const isMaster = channel === 'master';

  for (let i = 0; i < data.length; i += 4) {
    if (isMaster) {
      newData[i] = lut[data[i]];
      newData[i+1] = lut[data[i+1]];
      newData[i+2] = lut[data[i+2]];
      newData[i+3] = data[i+3];
    } else {
      for (let c = 0; c < 3; c++) {
        newData[i+c] = data[i+c];
      }
      newData[i+channelIdx] = lut[data[i+channelIdx]];
      newData[i+3] = data[i+3];
    }
  }
  return new ImageData(newData, imageData.width, imageData.height);
};

export const useLevels = (originalImageData) => {
  const [currentChannel, setCurrentChannel] = useState('master');
  const [settings, setSettings] = useState({
    master: { black: 0, gamma: 1, white: 255 },
    red: { black: 0, gamma: 1, white: 255 },
    green: { black: 0, gamma: 1, white: 255 },
    blue: { black: 0, gamma: 1, white: 255 },
    alpha: { black: 0, gamma: 1, white: 255 }
  });
  const [adjustedImageData, setAdjustedImageData] = useState(null);

  const updateSettings = useCallback((newValues) => {
    setSettings(prev => ({
      ...prev,
      [currentChannel]: { ...prev[currentChannel], ...newValues }
    }));
  }, [currentChannel]);

  const resetSettings = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      [currentChannel]: { black: 0, gamma: 1, white: 255 }
    }));
  }, [currentChannel]);

  const computeAdjustedImage = useCallback(() => {
    if (!originalImageData) return null;
    let result = originalImageData;
    for (const channel of ['master', 'red', 'green', 'blue', 'alpha']) {
      const { black, gamma, white } = settings[channel];
      if (black !== 0 || gamma !== 1 || white !== 255) {
        result = applyLevelsToChannel(result, channel, black, gamma, white);
      }
    }
    return result;
  }, [originalImageData, settings]);

  useEffect(() => {
    if (!originalImageData) return;
    const adjusted = computeAdjustedImage();
    setAdjustedImageData(adjusted);
  }, [originalImageData, settings, computeAdjustedImage]);

  const preview = (channel, black, gamma, white) => {
    if (!originalImageData) return;
    const previewSettings = { ...settings };
    previewSettings[channel] = { black, gamma, white };
    let result = originalImageData;
    for (const ch of ['master', 'red', 'green', 'blue', 'alpha']) {
      const { black: b, gamma: g, white: w } = previewSettings[ch];
      if (b !== 0 || g !== 1 || w !== 255) {
        result = applyLevelsToChannel(result, ch, b, g, w);
      }
    }
    return result;
  };

  return {
    currentChannel,
    setCurrentChannel,
    settings: settings[currentChannel],
    updateSettings,
    resetSettings,
    adjustedImageData,
    preview
  };
};