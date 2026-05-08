import styles from './EyedropperInfo.module.css';

const EyedropperInfo = ({ colorInfo, onClose }) => {
  if (!colorInfo) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h3>Информация о пикселе</h3>
        <p>Координаты: X={colorInfo.x}, Y={colorInfo.y}</p>
        <p>RGB: ({colorInfo.r}, {colorInfo.g}, {colorInfo.b})</p>
        <p>CIELAB: L={colorInfo.lab.L}, a={colorInfo.lab.a}, b={colorInfo.lab.b}</p>
      </div>
    </div>
  );
};

export default EyedropperInfo;