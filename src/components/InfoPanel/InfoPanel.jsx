import styles from './InfoPanel.module.css';

const InfoPanel = ({ colorInfo, isActive }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.dot} data-active={isActive}></span>
        <h3>Eyedropper</h3>
      </div>
      <div className={styles.content}>
        {!colorInfo && isActive && <p className={styles.hint}>Click on image to pick color</p>}
        {!colorInfo && !isActive && <p className={styles.hint}>Activate tool in toolbar</p>}
        {colorInfo && (
          <>
            <div className={styles.swatch} style={{ backgroundColor: `rgb(${colorInfo.r}, ${colorInfo.g}, ${colorInfo.b})` }}></div>
            <div className={styles.row}>
              <span className={styles.label}>X, Y</span>
              <span className={styles.value}>{colorInfo.x}, {colorInfo.y}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>RGB</span>
              <span className={styles.value}>{colorInfo.r}, {colorInfo.g}, {colorInfo.b}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>CIELAB</span>
              <span className={styles.value}>{colorInfo.lab.L}, {colorInfo.lab.a}, {colorInfo.lab.b}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;