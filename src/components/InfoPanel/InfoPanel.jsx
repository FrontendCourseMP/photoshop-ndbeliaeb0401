import styles from './InfoPanel.module.css';

const InfoPanel = ({ colorInfo, isActive, scalePercent, onScaleChange, interpolationMethod, onMethodChange }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.dot} data-active={isActive}></span>
        <h3>Пипетка</h3>
      </div>
      <div className={styles.content}>
        {!colorInfo && isActive && <p className={styles.hint}>Кликните на изображение, чтобы получить цвет</p>}
        {!colorInfo && !isActive && <p className={styles.hint}>Активируйте инструмент в панели</p>}
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

      <div className={styles.divider} />

      <div className={styles.controls}>
        <label>Масштаб</label>
        <input
          type="range"
          min={12}
          max={300}
          step={1}
          value={scalePercent}
          onChange={(e) => onScaleChange(Number(e.target.value))}
        />
        <span>{scalePercent}%</span>
      </div>

      <div className={styles.controls}>
        <label>Интерполяция</label>
        <select value={interpolationMethod} onChange={(e) => onMethodChange(e.target.value)}>
          <option value="bilinear">Билинейная</option>
          <option value="nearest">Ближайший сосед</option>
        </select>
      </div>
    </div>
  );
};

export default InfoPanel;