import { useEffect, useRef, useState } from 'react';
import styles from './KernelDialog.module.css';

const KernelDialog = ({ isOpen, onClose, originalImageData }) => {
  const dialogRef = useRef(null);
  const [kernel, setKernel] = useState([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.container}>
        <h2>Пользовательский фильтр (ядро 3x3)</h2>
        <div className={styles.kernelGrid}>
          {kernel.map((row, i) => (
            <div key={i} className={styles.kernelRow}>
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  step="0.1"
                  value={val}
                  className={styles.kernelInput}
                />
              ))}
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={onClose}>Применить</button>
        </div>
      </div>
    </dialog>
  );
};

export default KernelDialog;