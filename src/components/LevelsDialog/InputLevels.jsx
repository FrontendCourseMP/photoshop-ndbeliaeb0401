import styles from './InputLevels.module.css';

const InputLevels = ({ black, gamma, white, onChange, min = 0, max = 255 }) => {
  const handleBlackChange = (e) => {
    let val = Number(e.target.value);
    if (val >= white) val = white - 1;
    requestAnimationFrame(() => onChange({ black: val }));
  };
  const handleGammaChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 1;
    requestAnimationFrame(() => onChange({ gamma: val }));
  };
  const handleWhiteChange = (e) => {
    let val = Number(e.target.value);
    if (val <= black) val = black + 1;
    requestAnimationFrame(() => onChange({ white: val }));
  };

  return (
    <div className={styles.inputLevels}>
      <div className={styles.sliderGroup}>
        <label>Black point</label>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={black}
          onChange={handleBlackChange}
        />
        <span>{black}</span>
      </div>
      <div className={styles.sliderGroup}>
        <label>Gamma</label>
        <input
          type="range"
          min={0.1}
          max={9.9}
          step={0.01}
          value={gamma}
          onChange={handleGammaChange}
        />
        <span>{gamma.toFixed(2)}</span>
      </div>
      <div className={styles.sliderGroup}>
        <label>White point</label>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={white}
          onChange={handleWhiteChange}
        />
        <span>{white}</span>
      </div>
    </div>
  );
};

export default InputLevels;