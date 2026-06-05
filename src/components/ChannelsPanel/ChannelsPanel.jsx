import { useEffect, useRef } from 'react';
import { applyColorMode } from '../../utils/colorModes';
import styles from './ChannelsPanel.module.css';

const ChannelsPanel = ({ originalImageData, currentMode, setMode, availableModes }) => {
  const thumbRefs = {
    rgb: useRef(null),
    rgba: useRef(null),
    grayscale: useRef(null),
    grayscaleAlpha: useRef(null),
  };

  useEffect(() => {
    if (!originalImageData) return;

    const modes = ['rgb', 'rgba', 'grayscale', 'grayscaleAlpha'];
    const thumbWidth = 70;
    const thumbHeight = (originalImageData.height / originalImageData.width) * thumbWidth;

    modes.forEach((mode) => {
      const canvas = thumbRefs[mode].current;
      if (!canvas) return;
      const modeImageData = applyColorMode(originalImageData, mode);
      canvas.width = thumbWidth;
      canvas.height = thumbHeight;
      const ctx = canvas.getContext('2d');
      const tempCanvas = new OffscreenCanvas(modeImageData.width, modeImageData.height);
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.putImageData(modeImageData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, modeImageData.width, modeImageData.height, 0, 0, thumbWidth, thumbHeight);
    });
  }, [originalImageData]);

  const getLabel = (mode) => {
    switch (mode) {
      case 'rgb': return 'RGB';
      case 'rgba': return 'RGBA';
      case 'grayscale': return 'Grayscale';
      case 'grayscaleAlpha': return 'Grayscale + Alpha';
      default: return mode;
    }
  };

  if (!originalImageData) return null;

  return (
    <div className={styles.panel}>
      <h3>Color modes</h3>
      <div className={styles.modes}>
        {availableModes.map((mode) => (
          <div
            key={mode}
            className={`${styles.modeCard} ${currentMode === mode ? styles.active : ''}`}
            onClick={() => setMode(mode)}
          >
            <canvas ref={thumbRefs[mode]} className={styles.thumbnail} />
            <span>{getLabel(mode)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelsPanel;