import { useEffect, useRef, useState } from 'react';
import { useHistogram } from '../../hooks/useHistogram';
import { useLevels } from '../../hooks/useLevels';
import HistogramCanvas from './HistogramCanvas';
import InputLevels from './InputLevels';
import styles from './LevelsDialog.module.css';

const LevelsDialog = ({ 
  isOpen, 
  onClose, 
  originalImageData, 
  onApplyLevels, 
  onPreview    // новый проп
}) => {
  const dialogRef = useRef(null);
  const [histogramMode, setHistogramMode] = useState('linear');
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const { histogram, currentChannel: histChannel, updateChannel: updateHistChannel } = useHistogram(originalImageData);
  const { 
    currentChannel, 
    setCurrentChannel, 
    settings, 
    updateSettings, 
    resetSettings, 
    adjustedImageData 
  } = useLevels(originalImageData);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleChannelChange = (channelId) => {
    setCurrentChannel(channelId);
    updateHistChannel(channelId);
  };

  const handleSettingsChange = (newValues) => {
    updateSettings(newValues);
    // Если предпросмотр включён – вызываем onPreview
    if (previewEnabled && onPreview) {
      const current = { ...settings, ...newValues };
      onPreview(currentChannel, current.black, current.gamma, current.white);
    }
  };

  const handleReset = () => {
    resetSettings();
    if (previewEnabled && onPreview) {
      const defaultSettings = { black: 0, gamma: 1, white: 255 };
      onPreview(currentChannel, defaultSettings.black, defaultSettings.gamma, defaultSettings.white);
    }
  };

  const handleApply = () => {
    if (adjustedImageData && onApplyLevels) {
      onApplyLevels(adjustedImageData);
    }
    onClose();
  };

  const handleCancel = () => {
    resetSettings();
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
    <dialog ref={dialogRef} className={styles.dialog} onClose={handleCancel}>
      <div className={styles.container}>
        <h2>Levels Adjustment</h2>

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
          <button onClick={handleApply}>Apply</button>
        </div>
      </div>
    </dialog>
  );
};

export default LevelsDialog;