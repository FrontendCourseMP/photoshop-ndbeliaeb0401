import { encodeGB7 } from '../utils/gb7Encoder';

export const useImageExport = (canvasRef) => {
  const exportAs = (format, mimeType, extension) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `image.${extension}`;
    link.href = canvas.toDataURL(mimeType);
    link.click();
  };

  const exportPNG = () => exportAs('png', 'image/png', 'png');
  const exportJPG = () => exportAs('jpg', 'image/jpeg', 'jpg');

  const exportGB7 = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buffer = encodeGB7(imageData, false, null);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'image.gb7';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return { exportPNG, exportJPG, exportGB7 };
};