import { useState, useCallback, useRef, useEffect } from 'react';
import { presets } from './presets';

export const useConvolution = () => {
  const [kernel, setKernel] = useState(presets.identity);
  const [preset, setPreset] = useState('identity');
  const [channel, setChannel] = useState('all');
  const [edgeStrategy, setEdgeStrategy] = useState('copy');
  const [isApplying, setIsApplying] = useState(false);
  const workerRef = useRef(null);
  const lastParamsRef = useRef({ kernel: null, channel: null, strategy: null });
  const previewTimeoutRef = useRef(null);

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
    setIsApplying(true);
    const { width, height, data } = imageData;
    
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    const worker = new Worker(new URL('/convolutionWorker.js', import.meta.url));
    workerRef.current = worker;
    
    return new Promise((resolve) => {
      worker.onmessage = (e) => {
        const { resultData, width: w, height: h } = e.data;
        const newImageData = new ImageData(resultData, w, h);
        worker.terminate();
        workerRef.current = null;
        setIsApplying(false);
        resolve(newImageData);
      };
      worker.postMessage({
        imageData: { width, height, data: data.slice() },
        kernel: convKernel,
        targetChannel,
        strategy
      });
    });
  }, []);

  const schedulePreview = useCallback((imageData, convKernel, targetChannel, strategy, callback) => {
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    
    const last = lastParamsRef.current;
    if (last.kernel === convKernel && last.channel === targetChannel && last.strategy === strategy) {
      return;
    }
    lastParamsRef.current = { kernel: convKernel, channel: targetChannel, strategy };
    
    previewTimeoutRef.current = setTimeout(async () => {
      const result = await convolve(imageData, convKernel, targetChannel, strategy);
      if (callback) callback(result);
    }, 200);
  }, [convolve]);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      if (workerRef.current) workerRef.current.terminate();
    };
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
    schedulePreview,
    isApplying,
    setIsApplying
  };
};