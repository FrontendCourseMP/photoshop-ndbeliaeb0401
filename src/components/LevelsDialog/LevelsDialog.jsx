import { useEffect, useRef, useState, useCallback } from 'react';
import { useHistogram } from '../../hooks/useHistogram';
import { useLevels } from '../../hooks/useLevels';
import { useDraggable } from '../../hooks/useDraggable';
import HistogramCanvas from './HistogramCanvas';
import InputLevels from './InputLevels';
import styles from './LevelsDialog.module.css';

const LevelsDialog = ({ isOpen, onClose, onApply, onPreview, originalImageData }) => {
  const { dialogRef, style, handleMouseDown } = useDraggable({ x: 20, y: 80 });
  const [histogramMode, setHistogramMode] = useState('linear');
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const { histogram, currentChannel: histChannel, updateChannel: updateHistChannel } = useHistogram(originalImageData);
  const {
    currentChannel,
    setCurrentChannel,
    settings,
    updateSettings,
    resetSettings,
    adjustedImageData,
    preview
  } = useLevels(originalImageData);

  const debounceTimer = useRef(null);
  const lastSettings = useRef({ black: 0, gamma: 1, white: 255 });
  const isDialogOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !isDialogOpenRef.current) {
      dialogRef.current?.showModal();
      isDialogOpenRef.current = true;
      if (dialogRef.current && style) {
        dialogRef.current.style.left = style.left;
        dialogRef.current.style.top = style.top;
      }
    } else if (!isOpen && isDialogOpenRef.current) {
      dialogRef.current?.close();
      isDialogOpenRef.current = false;
    }
  }, [isOpen, dialogRef, style]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
    updateHistChannel(channelId);
  };

  const handleSettingsChange = useCallback((newValues) => {
    const updated = { ...settings, ...newValues };
    updateSettings(newValues);
    
    if (updated.black === lastSettings.current.black &&
        updated.gamma === lastSettings.current.gamma &&
        updated.white === lastSettings.current.white) {
      return;
    }
    lastSettings.current = { black: updated.black, gamma: updated.gamma, white: updated.white };
    
    if (previewEnabled && onPreview) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const previewData = preview(currentChannel, updated.black, updated.gamma, updated.white);
        if (previewData) onPreview(previewData);
      }, 50);
    }
  }, [updateSettings, settings, previewEnabled, onPreview, preview, currentChannel]);

  const handleReset = () => {
    resetSettings();
    lastSettings.current = { black: 0, gamma: 1, white: 255 };
    if (previewEnabled && onPreview) {
      const previewData = preview(currentChannel, 0, 1, 255);
      if (previewData) onPreview(previewData);
    }
  };

  const handleApply = async () => {
    if (isApplying) return;
    setIsApplying(true);
    if (adjustedImageData && onApply) {
      await onApply(adjustedImageData);
    }
    setIsApplying(false);
    onClose();
  };

  const handleCancel = () => {
    resetSettings();
    lastSettings.current = { black: 0, gamma: 1, white: 255 };
    onClose();
  };

  const channels = [
    { id: 'master', label: 'Master' },
    { id: 'red', label: 'Red' },
    { id: 'green', label: 'Green' },
    { id: 'blue', label: 'Blue' },
    { id: 'alpha', label: 'Alpha' },
  ];

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={handleCancel} style={style}>
      <div className={styles.draggableHeader} onMouseDown={handleMouseDown}>
        <h2>Levels Adjustment</h2>
        <button className={styles.closeBtn} onClick={handleCancel}>✕</button>
      </div>
      <div className={styles.container}>
        <div className={styles.channelSelector}>
          {channels.map(ch => (
            <button
              key={ch.id}
              className={`${styles.channelBtn} ${currentChannel === ch.id ? styles.active : ''}`}
              onClick={() => handleChannelChange(ch.id)}
            >
              {ch.label}
            </button>
          ))}
        </div>

        <div className={styles.histogramControls}>
          <label className={styles.modeToggle}>
            <input
              type="checkbox"
              checked={histogramMode === 'log'}
              onChange={(e) => setHistogramMode(e.target.checked ? 'log' : 'linear')}
            />
            Logarithmic view
          </label>
        </div>

        <HistogramCanvas histogram={histogram} mode={histogramMode} />

        <InputLevels
          black={settings.black}
          gamma={settings.gamma}
          white={settings.white}
          onChange={handleSettingsChange}
          min={0}
          max={255}
        />

        <div className={styles.previewCheck}>
          <label>
            <input
              type="checkbox"
              checked={previewEnabled}
              onChange={(e) => setPreviewEnabled(e.target.checked)}
            />
            Live Preview
          </label>
        </div>

        <div className={styles.actions}>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleApply} disabled={isApplying}>Apply</button>
        </div>
      </div>
    </dialog>
  );
};

export default LevelsDialog;