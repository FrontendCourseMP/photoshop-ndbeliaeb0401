import { useEffect, useRef, useCallback } from 'react';

export const useCanvasResize = (canvasRef, imageData) => {
  const rafId = useRef(null);

  const resizeAndRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    const ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    if (!container) return;

    const maxWidth = container.clientWidth - 32;
    const maxHeight = window.innerHeight - 200;

    const originalWidth = imageData.width;
    const originalHeight = imageData.height;

    let targetWidth = originalWidth;
    let targetHeight = originalHeight;

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
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const tempCanvas = new OffscreenCanvas(originalWidth, originalHeight);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);
  }, [canvasRef, imageData]);

  useEffect(() => {
    const handleResize = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(resizeAndRedraw);
    };
    window.addEventListener('resize', handleResize);
    resizeAndRedraw(); // первая отрисовка
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [resizeAndRedraw]);
};