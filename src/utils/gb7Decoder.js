export const decodeGB7 = (arrayBuffer) => {
  const view = new DataView(arrayBuffer);

  const signature = String.fromCharCode(view.getUint8(0)) +
                    String.fromCharCode(view.getUint8(1)) +
                    String.fromCharCode(view.getUint8(2)) +
                    String.fromCharCode(view.getUint8(3));
  if (signature !== 'GB7\x1D') throw new Error('Invalid GB7 signature');

  const version = view.getUint8(4);
  if (version !== 1) throw new Error(`Unsupported GB7 version: ${version}`);

  const flags = view.getUint8(5);
  const hasMask = (flags & 0x01) !== 0;

  const width = view.getUint16(6, false);
  const height = view.getUint16(8, false);

  const reserved = view.getUint16(10, false);
  if (reserved !== 0) console.warn('Reserved field not zero');

  const pixelOffset = 12;
  const pixelCount = width * height;
  const rawPixels = new Uint8Array(arrayBuffer, pixelOffset, pixelCount);

  const grayValues = new Uint8Array(pixelCount);
  let maskValues = null;
  if (hasMask) maskValues = new Uint8Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const byte = rawPixels[i];
    grayValues[i] = byte & 0x7F;
    if (hasMask) maskValues[i] = (byte >> 7) & 0x01;
  }

  return { width, height, hasMask, grayValues, maskValues };
};