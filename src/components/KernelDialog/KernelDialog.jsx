import { useEffect, useRef, useState } from 'react';
import { useConvolution } from '../../hooks/useConvolution';
import { presets } from '../../hooks/presets';
import styles from './KernelDialog.module.css';

const KernelDialog = ({ isOpen, onClose, onApply, onPreview, originalImageData }) => {
  const dialogRef = useRef(null);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [localKernel, setLocalKernel] = useState(null);
  const [isPreviewApplying, setIsPreviewApplying] = useState(false);

  const {
    kernel: hookKernel,
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
  } = useConvolution();

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      setLocalKernel(hookKernel);
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, hookKernel]);

  useEffect(() => {
    if (!previewEnabled || !originalImageData || !localKernel) return;
    setIsPreviewApplying(true);
    schedulePreview(originalImageData, localKernel, channel, edgeStrategy, (result) => {
      if (result && onPreview) onPreview(result);
      setIsPreviewApplying(false);
    });
  }, [previewEnabled, originalImageData, localKernel, channel, edgeStrategy, schedulePreview, onPreview]);

  const handlePresetChange = (presetName) => {
    updateKernelFromPreset(presetName);
    setLocalKernel(presets[presetName]);
  };

  const handleKernelInputChange = (row, col, value) => {
    const newKernel = localKernel.map((r, i) =>
      r.map((v, j) => (i === row && j === col) ? parseFloat(value) || 0 : v)
    );
    setLocalKernel(newKernel);
    updateKernelManually(newKernel);
  };

  const handleApply = async () => {
    if (!originalImageData) return;
    setIsApplying(true);
    const result = await convolve(originalImageData, localKernel, channel, edgeStrategy);
    setIsApplying(false);
    if (onApply) onApply(result);
    onClose();
  };

  const handleReset = () => {
    updateKernelFromPreset('identity');
    setLocalKernel(presets.identity);
  };

  const presetsList = [
    { id: 'identity', label: 'Тождественное' },
    { id: 'sharpen', label: 'Повышение резкости' },
    { id: 'gaussianBlur', label: 'Фильтр Гаусса' },
    { id: 'boxBlur', label: 'Прямоугольное размытие' },
    { id: 'prewittX', label: 'Прюитт X' },
    { id: 'prewittY', label: 'Прюитт Y' }
  ];

  const channels = [
    { id: 'all', label: 'Все каналы' },
    { id: 'red', label: 'Красный' },
    { id: 'green', label: 'Зелёный' },
    { id: 'blue', label: 'Синий' },
    { id: 'alpha', label: 'Альфа' }
  ];

  const edgeStrategies = [
    { id: 'copy', label: 'Копирование' },
    { id: 'black', label: 'Чёрный' },
    { id: 'white', label: 'Белый' }
  ];

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.container}>
        <h2>Пользовательский фильтр (ядро 3x3)</h2>

        <div className={styles.presetGroup}>
          <label>Предустановки:</label>
          <select value={preset} onChange={(e) => handlePresetChange(e.target.value)}>
            {presetsList.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        <div className={styles.kernelGrid}>
          {localKernel && localKernel.map((row, i) => (
            <div key={i} className={styles.kernelRow}>
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  step="0.1"
                  value={val}
                  onChange={(e) => handleKernelInputChange(i, j, e.target.value)}
                  className={styles.kernelInput}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.optionsGroup}>
          <div className={styles.selectGroup}>
            <label>Применить к:</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              {channels.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label>Обработка краёв:</label>
            <select value={edgeStrategy} onChange={(e) => setEdgeStrategy(e.target.value)}>
              {edgeStrategies.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.previewCheck}>
          <label>
            <input
              type="checkbox"
              checked={previewEnabled}
              onChange={(e) => setPreviewEnabled(e.target.checked)}
            />
            Live Preview
          </label>
          {(isApplying || isPreviewApplying) && <span className={styles.spinner}>Применение...</span>}
        </div>

        <div className={styles.actions}>
          <button onClick={handleReset}>Сброс</button>
          <button onClick={onClose}>Отмена</button>
          <button onClick={handleApply} disabled={isApplying}>Применить</button>
        </div>
      </div>
    </dialog>
  );
};

export default KernelDialog;