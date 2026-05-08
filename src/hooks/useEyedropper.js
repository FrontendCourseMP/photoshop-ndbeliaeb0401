import { useState, useCallback, useEffect } from 'react';
import { rgbToLab } from '../utils/colorUtils';

export const useEyedropper = (canvasRef, isActive, onPick) => {
  const [pickedColor, setPickedColor] = useState(null);

  const getPixelFromClick = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const x = Math.floor(mouseX);
    const y = Math.floor(mouseY);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = imageData.data;

    const lab = rgbToLab(r, g, b);
    const colorInfo = { x, y, r, g, b, a, lab };
    setPickedColor(colorInfo);
    if (onPick) onPick(colorInfo);
  }, [canvasRef, onPick]);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e) => getPixelFromClick(e);
    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [isActive, canvasRef, getPixelFromClick]);

  return { pickedColor, setPickedColor };
};