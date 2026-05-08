import { useRef, useState } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import StatusBar from './components/StatusBar/StatusBar';
import { useImageLoader } from './hooks/useImageLoader';
import { useImageExport } from './hooks/useImageExport';
import { useCanvasResize } from './hooks/useCanvasResize';
import styles from './App.module.css';

function App() {
  const canvasRef = useRef(null);
  const [imageInfo, setImageInfo] = useState({
    width: null,
    height: null,
    colorDepth: null,
  });

  const { forceResize } = useCanvasResize(canvasRef);
  const { loadImageFromUrl } = useImageLoader(canvasRef, setImageInfo, forceResize);
  const { exportPNG, exportJPG, exportGB7 } = useImageExport(canvasRef);

  return (
    <div className={styles.app}>
      <Toolbar
        onFileLoad={loadImageFromUrl}
        onExportPNG={exportPNG}
        onExportJPG={exportJPG}
        onExportGB7={exportGB7}
      />
      <div className={styles.mainArea}>
        <Canvas ref={canvasRef} />
        <StatusBar
          width={imageInfo.width}
          height={imageInfo.height}
          colorDepth={imageInfo.colorDepth}
        />
      </div>
    </div>
  );
}

export default App;