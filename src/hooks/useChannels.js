import { useState, useEffect, useCallback } from 'react';
import { applyColorMode } from '../utils/colorModes';

export const useChannels = (originalImageData, setDisplayImageData) => {
  const [currentMode, setCurrentMode] = useState('rgb');

  const updateDisplay = useCallback((mode) => {
    if (!originalImageData) return;
    const newImageData = applyColorMode(originalImageData, mode);
    setDisplayImageData(newImageData);
  }, [originalImageData, setDisplayImageData]);

  useEffect(() => {
    updateDisplay(currentMode);
  }, [currentMode, updateDisplay]);

  const setMode = (mode) => {
    setCurrentMode(mode);
  };

  const availableModes = ['rgb', 'rgba', 'grayscale', 'grayscaleAlpha'];

  return { currentMode, setMode, availableModes };
};