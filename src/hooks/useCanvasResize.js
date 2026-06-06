import { useEffect, useCallback } from 'react';

export const useCanvasResize = (canvasRef, imageData) => {
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    if (!container) return;
    const maxWidth = container.clientWidth - 32;
    const maxHeight = window.innerHeight - 200;
    let targetWidth = imageData.width;
    let targetHeight = imageData.height;
    if (targetWidth > maxWidth) {
      const ratio = maxWidth / targetWidth;
      targetWidth = maxWidth;
      targetHeight = targetHeight * ratio;
    }
    if (targetHeight > maxHeight) {
      const ratio = maxHeight / targetHeight;
      targetHeight = maxHeight;
      targetWidth = targetWidth * ratio;
    }
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  }, [canvasRef, imageData]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);
};