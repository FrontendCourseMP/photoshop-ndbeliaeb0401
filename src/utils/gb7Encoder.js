export const encodeGB7 = (imageData, hasMask = false, maskPixels = null) => {
  const width = imageData.width;
  const height = imageData.height;
  const rgba = imageData.data;
  const pixelCount = width * height;

  const gray7 = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    const luminance = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    gray7[i] = Math.floor(luminance / 2);
  }

  const pixelBytes = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    let byte = gray7[i] & 0x7F;
    if (hasMask && maskPixels) byte |= (maskPixels[i] & 0x01) << 7;
    pixelBytes[i] = byte;
  }

  const headerSize = 12;
  const buffer = new ArrayBuffer(headerSize + pixelCount);
  const view = new DataView(buffer);

  view.setUint8(0, 0x47);
  view.setUint8(1, 0x42);
  view.setUint8(2, 0x37);
  view.setUint8(3, 0x1D);
  view.setUint8(4, 0x01);
  view.setUint8(5, hasMask ? 0x01 : 0x00);
  view.setUint16(6, width, false);
  view.setUint16(8, height, false);
  view.setUint16(10, 0x0000, false);

  const dataView = new Uint8Array(buffer, headerSize, pixelCount);
  dataView.set(pixelBytes);

  return buffer;
};