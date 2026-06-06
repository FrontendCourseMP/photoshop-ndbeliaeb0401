import { useState, useCallback } from 'react';

const presets = {
  identity: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
  gaussianBlur: [[1, 2, 1], [2, 4, 2], [1, 2, 1]].map(row => row.map(v => v / 16)),
  boxBlur: [[1, 1, 1], [1, 1, 1], [1, 1, 1]].map(row => row.map(v => v / 9)),
  prewittX: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
  prewittY: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]
};

const padImage = (imageData, strategy, kernelSize) => {
  const { width, height, data } = imageData;
  const pad = Math.floor(kernelSize / 2);
  const newWidth = width + 2 * pad;
  const newHeight = height + 2 * pad;
  const newData = new Uint8ClampedArray(newWidth * newHeight * 4);
  
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = x - pad;
      const srcY = y - pad;
      let r, g, b, a;
      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const idx = (srcY * width + srcX) * 4;
        r = data[idx];
        g = data[idx + 1];
        b = data[idx + 2];
        a = data[idx + 3];
      } else {
        if (strategy === 'black') {
          r = g = b = a = 0;
        } else if (strategy === 'white') {
          r = g = b = a = 255;
        } else { // copy – отражаем ближайший допустимый пиксель
          const clampX = Math.min(width - 1, Math.max(0, srcX));
          const clampY = Math.min(height - 1, Math.max(0, srcY));
          const idx = (clampY * width + clampX) * 4;
          r = data[idx];
          g = data[idx + 1];
          b = data[idx + 2];
          a = data[idx + 3];
        }
      }
      const idx = (y * newWidth + x) * 4;
      newData[idx] = r;
      newData[idx + 1] = g;
      newData[idx + 2] = b;
      newData[idx + 3] = a;
    }
  }
  return { width: newWidth, height: newHeight, data: newData };
};

const convolveChannel = (padded, kernel, channelOffset, width, height, pad) => {
  const kernelSize = kernel.length;
  const result = new Uint8ClampedArray(width * height);
  for (let y = pad; y < height - pad; y++) {
    for (let x = pad; x < width - pad; x++) {
      let sum = 0;
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const px = x + (kx - pad);
          const py = y + (ky - pad);
          const idx = (py * width + px) * 4 + channelOffset;
          sum += padded.data[idx] * kernel[ky][kx];
        }
      }
      const resultIdx = (y - pad) * (width - 2 * pad) + (x - pad);
      result[resultIdx] = Math.min(255, Math.max(0, Math.round(sum)));
    }
  }
  return result;
};

export const useConvolution = () => {
  const [kernel, setKernel] = useState(presets.identity);
  const [preset, setPreset] = useState('identity');
  const [channel, setChannel] = useState('all');
  const [edgeStrategy, setEdgeStrategy] = useState('copy');
  const [isApplying, setIsApplying] = useState(false);

  const updateKernelFromPreset = useCallback((presetName) => {
    const newKernel = presets[presetName];
    if (newKernel) {
      setKernel(newKernel);
      setPreset(presetName);
    }
  }, []);

  const updateKernelManually = useCallback((newKernel) => {
    setKernel(newKernel);
    setPreset('custom');
  }, []);

  const convolve = useCallback(async (imageData, convKernel, targetChannel, strategy) => {
    if (!imageData) return null;
    const start = performance.now();
    const pad = 1;
    const padded = padImage(imageData, strategy, 3);
    const { width, height, data: paddedData } = padded;
    const resultData = new Uint8ClampedArray(imageData.width * imageData.height * 4);
    
    const channelOffsets = targetChannel === 'all' ? [0,1,2,3] : 
      targetChannel === 'red' ? [0] : targetChannel === 'green' ? [1] : targetChannel === 'blue' ? [2] : [3];
    
    for (let ch of channelOffsets) {
      const convResult = convolveChannel(padded, convKernel, ch, width, height, pad);
      const outWidth = imageData.width;
      const outHeight = imageData.height;
      for (let y = 0; y < outHeight; y++) {
        for (let x = 0; x < outWidth; x++) {
          const srcIdx = (y * outWidth + x);
          const dstIdx = srcIdx * 4 + ch;
          resultData[dstIdx] = convResult[srcIdx];
        }
      }
    }
    if (targetChannel !== 'all') {
      for (let i = 0; i < imageData.data.length; i += 4) {
        for (let c = 0; c < 4; c++) {
          if (!channelOffsets.includes(c)) {
            resultData[i + c] = imageData.data[i + c];
          }
        }
      }
    }
    const newImageData = new ImageData(resultData, imageData.width, imageData.height);
    const end = performance.now();
    console.log(`Convolution took ${end - start} ms`);
    return newImageData;
  }, []);

  return {
    kernel,
    preset,
    channel,
    edgeStrategy,
    updateKernelFromPreset,
    updateKernelManually,
    setChannel,
    setEdgeStrategy,
    convolve,
    isApplying,
    setIsApplying
  };
};