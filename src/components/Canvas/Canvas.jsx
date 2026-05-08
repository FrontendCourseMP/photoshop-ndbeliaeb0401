import { forwardRef } from 'react';
import styles from './Canvas.module.css';

const Canvas = forwardRef((props, ref) => {
  return (
    <div className={styles.container}>
      <canvas ref={ref} className={styles.canvas} {...props} />
    </div>
  );
});

export default Canvas;