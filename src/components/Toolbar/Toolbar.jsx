import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiInfo, FiSave, FiImage, FiChevronDown } from 'react-icons/fi';
import styles from './Toolbar.module.css';

const Toolbar = ({ onFileLoad, onExportPNG, onExportJPG, onExportGB7 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const btnRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/octet-stream': ['.gb7']
    },
    onDrop: (files) => {
      if (files.length) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        onFileLoad({ url, file });
      }
    },
  });

  const handleExportClick = (callback) => {
    callback();
    setShowDropdown(false);
  };

  useEffect(() => {
    if (showDropdown && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 120,
        zIndex: 10000,
      });
    }
  }, [showDropdown]);

  return (
    <div className={styles.toolbar}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload className={styles.icon} />
        <span>Загрузить</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.exportDesktop}>
        <button onClick={onExportPNG} className={styles.exportBtn}>
          <FiSave className={styles.icon} />
          <span>PNG</span>
        </button>
        <button onClick={onExportJPG} className={styles.exportBtn}>
          <FiImage className={styles.icon} />
          <span>JPG</span>
        </button>
        <button onClick={onExportGB7} className={styles.exportBtn}>
          <FiSave className={styles.icon} />
          <span>GB7</span>
        </button>
      </div>

      <div className={styles.exportMobile}>
        <button
          ref={btnRef}
          className={styles.exportDropdownBtn}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FiSave className={styles.icon} />
          <span>Экспорт</span>
          <FiChevronDown className={styles.chevron} />
        </button>
        {showDropdown && createPortal(
          <div className={styles.portalDropdown} style={dropdownStyle}>
            <button onClick={() => handleExportClick(onExportPNG)}>PNG</button>
            <button onClick={() => handleExportClick(onExportJPG)}>JPG</button>
            <button onClick={() => handleExportClick(onExportGB7)}>GB7</button>
          </div>,
          document.body
        )}
      </div>

      <div className={styles.info}>
        <FiInfo className={styles.iconSmall} />
        <span>PNG, JPG, GB7</span>
      </div>
    </div>
  );
};

export default Toolbar;