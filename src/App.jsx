import { useRef, useState, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import StatusBar from './components/StatusBar/StatusBar';
import KernelDialog from './components/KernelDialog/KernelDialog';
import ChannelsPanel from './components/ChannelsPanel/ChannelsPanel';
import InfoPanel from './components/InfoPanel/InfoPanel';
import LevelsDialog from './components/LevelsDialog/LevelsDialog';
import { useImageLoader } from './hooks/useImageLoader';
import { useImageExport } from './hooks/useImageExport';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useChannels } from './hooks/useChannels';
import { useEyedropper } from './hooks/useEyedropper';
import { resizeImage } from './utils/imageResize';
import ResizeDialog from './components/ResizeDialog/ResizeDialog';
import styles from './App.module.css';

function App() {
  const canvasRef = useRef(null);
  const [originalImageData, setOriginalImageData] = useState(null);
  const [displayImageData, setDisplayImageData] = useState(null);
  const [imageInfo, setImageInfo] = useState({ width: null, height: null, colorDepth: null });
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);
  const [pickedColor, setPickedColor] = useState(null);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);
  const [levelsOriginalData, setLevelsOriginalData] = useState(null);
  const [scalePercent, setScalePercent] = useState(100);
  const [isResizeOpen, setIsResizeOpen] = useState(false);
  const [interpolationMethod, setInterpolationMethod] = useState('bilinear');
  const [isKernelOpen, setIsKernelOpen] = useState(false);

  const handleOpenKernel = () => setIsKernelOpen(true);
  const handleCloseKernel = () => setIsKernelOpen(false);

  const { loadImageFromUrl } = useImageLoader(setOriginalImageData, setImageInfo);
  const { exportPNG, exportJPG, exportGB7 } = useImageExport(canvasRef);
  useCanvasResize(canvasRef, displayImageData);
  const { currentMode, setMode, availableModes } = useChannels(originalImageData, setDisplayImageData);
  useEyedropper(canvasRef, isEyedropperActive, setPickedColor);

  const updateDisplayWithScale = useCallback((baseImage, percent, method) => {
    if (!baseImage) return null;
    const scale = percent / 100;
    const newWidth = Math.round(baseImage.width * scale);
    const newHeight = Math.round(baseImage.height * scale);
    if (newWidth <= 0 || newHeight <= 0) return baseImage;
    return resizeImage(baseImage, newWidth, newHeight, method);
  }, []);

  useEffect(() => {
    if (!originalImageData) return;
    const newDisplay = updateDisplayWithScale(originalImageData, scalePercent, interpolationMethod);
    setDisplayImageData(newDisplay);
  }, [originalImageData, scalePercent, interpolationMethod, updateDisplayWithScale]);

  useEffect(() => {
    if (!originalImageData) return;
    const container = canvasRef.current?.parentElement;
    if (container) {
      const maxWidth = container.clientWidth - 50;
      const maxHeight = window.innerHeight - 200 - 50;
      const scaleX = maxWidth / originalImageData.width;
      const scaleY = maxHeight / originalImageData.height;
      let initialScale = Math.min(scaleX, scaleY) * 100;
      initialScale = Math.min(300, Math.max(12, initialScale));
      setScalePercent(Math.round(initialScale));
    } else {
      setScalePercent(100);
    }
  }, [originalImageData]);

  const handleActivateEyedropper = () => {
    setIsEyedropperActive(!isEyedropperActive);
    if (!isEyedropperActive) setPickedColor(null);
  };

  const handleOpenLevels = () => {
    setLevelsOriginalData(displayImageData);
    setIsLevelsOpen(true);
  };

  const handleCloseLevels = () => {
    setIsLevelsOpen(false);
    if (levelsOriginalData) {
      setDisplayImageData(levelsOriginalData);
    }
    setLevelsOriginalData(null);
  };

  const handleApplyLevels = (newImageData) => {
    setOriginalImageData(newImageData);
    setDisplayImageData(newImageData);
    setIsLevelsOpen(false);
    setLevelsOriginalData(null);
    setScalePercent(100);
  };

  const handlePreviewLevels = (previewData) => {
    setDisplayImageData(previewData);
  };

  const handleScaleChange = (percent) => {
     requestAnimationFrame(() => setScalePercent(percent));
  };

  const handleMethodChange = (method) => {
    setInterpolationMethod(method);
  };

  const handleOpenResize = () => setIsResizeOpen(true);
  const handleCloseResize = () => setIsResizeOpen(false);

  const handleResizeImage = (newWidth, newHeight, method) => {
    if (!originalImageData) return;
    const resizedImageData = resizeImage(originalImageData, newWidth, newHeight, method);
    setOriginalImageData(resizedImageData);
    setDisplayImageData(resizedImageData);
    setScalePercent(100);
  };

  return (
    <div className={styles.app}>
      <Toolbar
        onFileLoad={loadImageFromUrl}
        onExportPNG={exportPNG}
        onExportJPG={exportJPG}
        onExportGB7={exportGB7}
        onActivateEyedropper={handleActivateEyedropper}
        isEyedropperActive={isEyedropperActive}
        onOpenLevels={handleOpenLevels}
        onOpenResize={handleOpenResize} 
      />
      <div className={styles.mainArea}>
        <Canvas ref={canvasRef} imageData={displayImageData} isEyedropperActive={isEyedropperActive} />
        <StatusBar
          width={imageInfo.width}
          height={imageInfo.height}
          colorDepth={imageInfo.colorDepth}
        />
      </div>
    <ChannelsPanel
  originalImageData={originalImageData}
  currentMode={currentMode}
  setMode={setMode}
  availableModes={availableModes}
/>
      <InfoPanel
        colorInfo={pickedColor}
        isActive={isEyedropperActive}
        scalePercent={scalePercent}
        onScaleChange={handleScaleChange}
        interpolationMethod={interpolationMethod}
        onMethodChange={handleMethodChange}
      />
      <LevelsDialog
        isOpen={isLevelsOpen}
        onClose={handleCloseLevels}
        onApply={handleApplyLevels}
        onPreview={handlePreviewLevels}
        originalImageData={levelsOriginalData}
      />
      <ResizeDialog
        isOpen={isResizeOpen}
        onClose={handleCloseResize}
        onResize={handleResizeImage}
        originalWidth={originalImageData?.width || 0}
        originalHeight={originalImageData?.height || 0}
        currentMethod={interpolationMethod}
      />
      <KernelDialog
  isOpen={isKernelOpen}
  onClose={handleCloseKernel}
  originalImageData={originalImageData}
/>
    </div>
  );
}

export default App;