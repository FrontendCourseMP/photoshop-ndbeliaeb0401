import { useEffect, useRef, useCallback } from 'react';

export const useCanvasResize = (canvasRef) => {
  const rafId = useRef(null);

  const resizeAndRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    if (!container) return;

    const maxWidth = container.clientWidth - 32;
    const maxHeight = window.innerHeight - 200;

    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    if (originalWidth === 0 || originalHeight === 0) return;

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

    const imageData = ctx.getImageData(0, 0, originalWidth, originalHeight);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const tempCanvas = new OffscreenCanvas(originalWidth, originalHeight);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);
  }, [canvasRef]);

  useEffect(() => {
    const handleResize = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(resizeAndRedraw);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [resizeAndRedraw]);

  return { forceResize: resizeAndRedraw };
};