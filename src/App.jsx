import { useRef, useState } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import StatusBar from './components/StatusBar/StatusBar';
import ChannelsPanel from './components/ChannelsPanel/ChannelsPanel';
import InfoPanel from './components/InfoPanel/InfoPanel';
import LevelsDialog from './components/LevelsDialog/LevelsDialog';
import { useImageLoader } from './hooks/useImageLoader';
import { useImageExport } from './hooks/useImageExport';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useChannels } from './hooks/useChannels';
import { useEyedropper } from './hooks/useEyedropper';
import { useLevels } from './hooks/useLevels';
import styles from './App.module.css';

function App() {
  const canvasRef = useRef(null);
  const [originalImageData, setOriginalImageData] = useState(null);
  const [displayImageData, setDisplayImageData] = useState(null);
  const [imageInfo, setImageInfo] = useState({ width: null, height: null, colorDepth: null });
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);
  const [pickedColor, setPickedColor] = useState(null);
  const [isLevelsOpen, setIsLevelsOpen] = useState(false);

  const { loadImageFromUrl } = useImageLoader(setOriginalImageData, setImageInfo);
  const { exportPNG, exportJPG, exportGB7 } = useImageExport(canvasRef);
  useCanvasResize(canvasRef, displayImageData);
  const { activeChannels, toggleChannel, hasAlpha } = useChannels(originalImageData, setDisplayImageData);
  const { pickedColor: eyedropperColor } = useEyedropper(canvasRef, isEyedropperActive, setPickedColor);
  const { levelsState, updateLevels, resetLevels, applyLevels, previewLevels } = useLevels(originalImageData, setDisplayImageData);

  const handleActivateEyedropper = () => {
    setIsEyedropperActive(!isEyedropperActive);
    if (!isEyedropperActive) setPickedColor(null);
  };

  const handleOpenLevels = () => setIsLevelsOpen(true);
  const handleCloseLevels = () => setIsLevelsOpen(false);

  const handleLevelsApply = () => {
    applyLevels();
    handleCloseLevels();
  };

  const handleLevelsReset = () => {
    resetLevels();
  };

  const handleLevelsPreview = (channelId, black, gamma, white) => {
    previewLevels(channelId, black, gamma, white);
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
        activeChannels={activeChannels}
        toggleChannel={toggleChannel}
        hasAlpha={hasAlpha}
      />
      <InfoPanel colorInfo={pickedColor} isActive={isEyedropperActive} />

      <LevelsDialog
  isOpen={isLevelsOpen}
  onClose={handleCloseLevels}
  onApplyLevels={(imageData) => {
    setDisplayImageData(imageData);
    setOriginalImageData(imageData); // если нужно сохранить изменения
  }}
  onPreview={handleLevelsPreview}
  originalImageData={originalImageData}
  levelsState={levelsState}
/>
    </div>
  );
}

export default App;