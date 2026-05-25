import { useEffect, useRef, useState } from 'react';
import { useHistogram } from '../../hooks/useHistogram';
import HistogramCanvas from './HistogramCanvas';
import styles from './LevelsDialog.module.css';

const LevelsDialog = ({ isOpen, onClose, originalImageData }) => {
  const dialogRef = useRef(null);
  const [histogramMode, setHistogramMode] = useState('linear');
  const { histogram, currentChannel, updateChannel } = useHistogram(originalImageData);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const channels = [
    { id: 'luminance', label: 'Master' },
    { id: 'red', label: 'Red' },
    { id: 'green', label: 'Green' },
    { id: 'blue', label: 'Blue' },
    { id: 'alpha', label: 'Alpha' },
  ];

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.container}>
        <h2>Levels Adjustment</h2>

        <div className={styles.channelSelector}>
          {channels.map(ch => (
            <button
              key={ch.id}
              className={`${styles.channelBtn} ${currentChannel === ch.id ? styles.active : ''}`}
              onClick={() => updateChannel(ch.id)}
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

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onClose}>Apply</button>
        </div>
      </div>
    </dialog>
  );
};

export default LevelsDialog;