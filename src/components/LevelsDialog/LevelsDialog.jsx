import { useEffect, useRef } from 'react';
import styles from './LevelsDialog.module.css';

const LevelsDialog = ({ isOpen, onClose, originalImageData }) => {
  const dialogRef = useRef(null);

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
        <h2>Levels Adjustment</h2>
        <div className={styles.content}>
          <p>Здесь будет гистограмма и ползунки</p>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onClose}>Apply</button>
        </div>
      </div>
    </dialog>
  );
};

export default LevelsDialog;