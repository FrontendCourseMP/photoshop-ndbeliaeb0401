const nearestNeighbor = (srcData, srcWidth, srcHeight, dstWidth, dstHeight) => {
  const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4);
  const xRatio = srcWidth / dstWidth;
  const yRatio = srcHeight / dstHeight;

  for (let y = 0; y < dstHeight; y++) {
    const srcY = Math.floor(y * yRatio);
    const srcRow = srcY * srcWidth * 4;
    const dstRow = y * dstWidth * 4;
    for (let x = 0; x < dstWidth; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcIdx = srcRow + srcX * 4;
      const dstIdx = dstRow + x * 4;
      dstData[dstIdx] = srcData[srcIdx];
      dstData[dstIdx + 1] = srcData[srcIdx + 1];
      dstData[dstIdx + 2] = srcData[srcIdx + 2];
      dstData[dstIdx + 3] = srcData[srcIdx + 3];
    }
  }
  return new ImageData(dstData, dstWidth, dstHeight);
};

const bilinear = (srcData, srcWidth, srcHeight, dstWidth, dstHeight) => {
  const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4);
  const xRatio = (srcWidth - 1) / (dstWidth - 1);
  const yRatio = (srcHeight - 1) / (dstHeight - 1);

  for (let y = 0; y < dstHeight; y++) {
    const srcY = y * yRatio;
    const y1 = Math.floor(srcY);
    const y2 = Math.min(y1 + 1, srcHeight - 1);
    const dy = srcY - y1;
    const dstRow = y * dstWidth * 4;

    for (let x = 0; x < dstWidth; x++) {
      const srcX = x * xRatio;
      const x1 = Math.floor(srcX);
      const x2 = Math.min(x1 + 1, srcWidth - 1);
      const dx = srcX - x1;
      const idx11 = (y1 * srcWidth + x1) * 4;
      const idx12 = (y1 * srcWidth + x2) * 4;
      const idx21 = (y2 * srcWidth + x1) * 4;
      const idx22 = (y2 * srcWidth + x2) * 4;
      const dstIdx = dstRow + x * 4;
      for (let c = 0; c < 4; c++) {
        const v11 = srcData[idx11 + c];
        const v12 = srcData[idx12 + c];
        const v21 = srcData[idx21 + c];
        const v22 = srcData[idx22 + c];
        const top = v11 * (1 - dx) + v12 * dx;
        const bottom = v21 * (1 - dx) + v22 * dx;
        const value = top * (1 - dy) + bottom * dy;
        dstData[dstIdx + c] = Math.min(255, Math.max(0, Math.round(value)));
      }
    }
  }
  return new ImageData(dstData, dstWidth, dstHeight);
};

export const resizeImage = (imageData, newWidth, newHeight, method = 'bilinear') => {
  const srcData = imageData.data;
  const srcWidth = imageData.width;
  const srcHeight = imageData.height;
  if (method === 'nearest') {
    return nearestNeighbor(srcData, srcWidth, srcHeight, newWidth, newHeight);
  }
  return bilinear(srcData, srcWidth, srcHeight, newWidth, newHeight);
};