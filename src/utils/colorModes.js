export const applyColorMode = (imageData, mode) => {
  const { width, height, data } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  const isGrayscale = (mode === 'grayscale' || mode === 'grayscaleAlpha');
  const includeAlpha = (mode === 'grayscaleAlpha' || mode === 'rgba');

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    let newR, newG, newB, newA;

    if (isGrayscale) {
      const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      newR = newG = newB = luminance;
    } else {
      newR = r;
      newG = g;
      newB = b;
    }

    newA = includeAlpha ? a : 255;

    newData[i] = newR;
    newData[i + 1] = newG;
    newData[i + 2] = newB;
    newData[i + 3] = newA;
  }
  return new ImageData(newData, width, height);
};