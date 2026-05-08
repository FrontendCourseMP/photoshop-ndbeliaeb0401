import { forwardRef, useEffect, useRef } from 'react';
import styles from './Canvas.module.css';

const Canvas = forwardRef(({ imageData, isEyedropperActive, ...props }, ref) => {
  const canvasRef = useRef(null);
  const setRefs = (node) => {
    canvasRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  }, [imageData]);

  return (
    <div className={styles.container}>
      <canvas
        ref={setRefs}
        className={`${styles.canvas} ${isEyedropperActive ? styles.eyedropperCursor : ''}`}
        {...props}
      />
    </div>
  );
});

export default Canvas;