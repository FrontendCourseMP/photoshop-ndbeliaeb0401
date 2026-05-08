import { FiMaximize2, FiMinimize2, FiEye } from 'react-icons/fi';
import styles from './StatusBar.module.css';

const StatusBar = ({ width, height, colorDepth }) => {
  return (
    <div className={styles.statusBar}>
      <div className={styles.item}>
        <FiMaximize2 className={styles.icon} />
        <span>Ширина: {width ?? '—'} px</span>
      </div>
      <div className={styles.item}>
        <FiMinimize2 className={styles.icon} />
        <span>Высота: {height ?? '—'} px</span>
      </div>
      <div className={styles.item}>
        <FiEye className={styles.icon} />
        <span>Глубина цвета: {colorDepth ?? '—'} бит</span>
      </div>
    </div>
  );
};

export default StatusBar;