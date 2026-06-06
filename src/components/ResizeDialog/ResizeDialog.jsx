import { useEffect, useRef, useState } from 'react';
import styles from './ResizeDialog.module.css';

const ResizeDialog = ({ isOpen, onClose, onResize, originalWidth, originalHeight, currentMethod }) => {
  const dialogRef = useRef(null);
  const [unit, setUnit] = useState('percent');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [keepAspect, setKeepAspect] = useState(true);
  const [method, setMethod] = useState(currentMethod);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      if (unit === 'percent') {
        setWidth(100);
        setHeight(100);
      } else {
        setWidth(originalWidth);
        setHeight(originalHeight);
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, originalWidth, originalHeight, unit]);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    if (newUnit === 'percent') {
      setWidth(100);
      setHeight(100);
    } else {
      setWidth(originalWidth);
      setHeight(originalHeight);
    }
  };

  const handleWidthChange = (val) => {
    let newWidth = parseInt(val) || 0;
    if (unit === 'percent') {
      newWidth = Math.min(300, Math.max(12, newWidth));
    } else {
      newWidth = Math.min(8000, Math.max(1, newWidth));
    }
    setWidth(newWidth);
    if (keepAspect) {
      let newHeight;
      if (unit === 'percent') {
        newHeight = newWidth;
      } else {
        newHeight = Math.round((newWidth / originalWidth) * originalHeight);
        newHeight = Math.min(8000, Math.max(1, newHeight));
      }
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (val) => {
    let newHeight = parseInt(val) || 0;
    if (unit === 'percent') {
      newHeight = Math.min(300, Math.max(12, newHeight));
    } else {
      newHeight = Math.min(8000, Math.max(1, newHeight));
    }
    setHeight(newHeight);
    if (keepAspect) {
      let newWidth;
      if (unit === 'percent') {
        newWidth = newHeight;
      } else {
        newWidth = Math.round((newHeight / originalHeight) * originalWidth);
        newWidth = Math.min(8000, Math.max(1, newWidth));
      }
      setWidth(newWidth);
    }
  };

  const handleSubmit = () => {
    let newWidthPx, newHeightPx;
    if (unit === 'percent') {
      newWidthPx = Math.round(originalWidth * width / 100);
      newHeightPx = Math.round(originalHeight * height / 100);
    } else {
      newWidthPx = width;
      newHeightPx = height;
    }
    if (newWidthPx > 0 && newHeightPx > 0) {
      onResize(newWidthPx, newHeightPx, method);
      onClose();
    }
  };

  const showTooltip = (e, text) => {
    setTooltip({ visible: true, text, x: e.clientX, y: e.clientY - 30 });
  };
  const hideTooltip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 });

  const originalMp = (originalWidth * originalHeight / 1e6).toFixed(2);
  const newWidthPx = unit === 'percent' ? Math.round(originalWidth * width / 100) : width;
  const newHeightPx = unit === 'percent' ? Math.round(originalHeight * height / 100) : height;
  const newMp = (newWidthPx * newHeightPx / 1e6).toFixed(2);

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.container}>
        <h2>Изменить размер изображения</h2>
        <div className={styles.info}>
          <span>Исходный размер: {originalWidth}x{originalHeight} ({originalMp} Мп)</span>
          <span>Новый размер: {newWidthPx}x{newHeightPx} ({newMp} Мп)</span>
        </div>
        <div className={styles.unitSelector}>
          <button className={unit === 'percent' ? styles.active : ''} onClick={() => handleUnitChange('percent')}>%</button>
          <button className={unit === 'px' ? styles.active : ''} onClick={() => handleUnitChange('px')}>px</button>
        </div>
        <div className={styles.inputGroup}>
          <label>Ширина</label>
          <input type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)} min={unit === 'percent' ? 12 : 1} max={unit === 'percent' ? 300 : 8000} />
        </div>
        <div className={styles.inputGroup}>
          <label>Высота</label>
          <input type="number" value={height} onChange={(e) => handleHeightChange(e.target.value)} min={unit === 'percent' ? 12 : 1} max={unit === 'percent' ? 300 : 8000} />
        </div>
        <div className={styles.checkboxGroup}>
          <label>
            <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
            Сохранять пропорции
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label>Интерполяция</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="bilinear">Билинейная</option>
            <option value="nearest">Ближайший сосед</option>
          </select>
          <span className={styles.helpIcon} onMouseMove={(e) => showTooltip(e, 'Билинейная – плавное масштабирование, лучше для фото. Ближайший сосед – резкое, для пиксельной графики.')} onMouseLeave={hideTooltip}>?</span>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={handleSubmit}>Применить</button>
        </div>
      </div>
      {tooltip.visible && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </dialog>
  );
};

export default ResizeDialog;