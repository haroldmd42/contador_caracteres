import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { VIDEO_FORMATS, getFormatConfig, getCompatibleFormats } from '../../constants/formats';
import { apiVideoConvert } from '../../services/apiService';
import './VideoConverter.css';

export default function VideoConverter() {
  const [file, setFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoDetails, setVideoDetails] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webm');
  const [playbackSpeed, setPlaybackSpeed] = useState(2.0); // 2x speed for faster conversion
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const recorderRef = useRef(null);
  const audioCtxRef = useRef(null);
  const streamDestRef = useRef(null);
  const audioSourceNodeRef = useRef(null);

  const HTML5_PREVIEW_EXTS = useMemo(() => ['mp4', 'webm', 'ogv', 'm4v'], []);
  const [previewError, setPreviewError] = useState(false);

  const activeExt = useMemo(() => {
    if (convertedUrl) return targetFormat.toLowerCase();
    if (file) return file.name.split('.').pop().toLowerCase();
    return '';
  }, [convertedUrl, targetFormat, file]);

  const isHtml5Playable = useMemo(() => {
    return HTML5_PREVIEW_EXTS.includes(activeExt) && !previewError;
  }, [HTML5_PREVIEW_EXTS, activeExt, previewError]);

  /** Clean up object URLs when file changes or unmounts */
  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [videoSrc, convertedUrl]);

  /** Build dynamic accept attribute for video input */
  const acceptedExtensions = useMemo(() => {
    return VIDEO_FORMATS.map(f => `.${f.ext}`).join(',');
  }, []);

  /** Resolve compatible output options dynamically based on inputs from central formats registry */
  const outputOptions = useMemo(() => {
    if (!file) return [];
    const ext = file.name.split('.').pop().toLowerCase();
    const compatList = getCompatibleFormats(ext);

    return compatList.map(opt => {
      let isNativelyRecordable = true;
      if (typeof MediaRecorder !== 'undefined') {
        const testMime = `video/${opt.ext}`;
        isNativelyRecordable = MediaRecorder.isTypeSupported(testMime) || MediaRecorder.isTypeSupported('video/webm');
      }
      return {
        ...opt,
        recordable: isNativelyRecordable
      };
    });
  }, [file]);

  /** Selected target format configuration */
  const selectedTargetConfig = useMemo(() => {
    return getFormatConfig(targetFormat);
  }, [targetFormat]);

  /** Process uploaded video file */
  const handleVideoUpload = useCallback((uploadedFile) => {
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    const config = getFormatConfig(ext);

    if (!config || config.category !== 'video') {
      alert(`El formato de video .${ext} no está soportado.`);
      return;
    }

    if (videoSrc) URL.revokeObjectURL(videoSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);
    setError(null);
    setProgress(0);
    setPreviewError(false);

    const objectUrl = URL.createObjectURL(uploadedFile);
    setFile(uploadedFile);
    setVideoSrc(objectUrl);

    const compatList = getCompatibleFormats(ext);
    if (compatList.length > 0) {
      setTargetFormat(compatList[0].ext);
    } else {
      setTargetFormat('webm');
    }
  }, [videoSrc, convertedUrl]);

  const handleFileChange = useCallback((e) => {
    handleVideoUpload(e.target.files[0]);
  }, [handleVideoUpload]);

  /* Drag and Drop events */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleVideoUpload(e.dataTransfer.files[0]);
    }
  }, [handleVideoUpload]);

  /** Read video dimensions once metadata loads */
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video || !file) return;

    setVideoDetails({
      width: video.videoWidth || 0,
      height: video.videoHeight || 0,
      duration: video.duration || 0,
      size: file.size,
      name: file.name,
    });
  }, [file]);

  /** Reset all states */
  const reset = useCallback(() => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setVideoSrc(null);
    setVideoDetails(null);
    setTargetFormat('webm');
    setPlaybackSpeed(2.0);
    setConvertedUrl(null);
    setError(null);
    setProgress(0);
    setIsConverting(false);
    setPreviewError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [videoSrc, convertedUrl]);

  /** Handle output format selection change */
  const handleTargetFormatChange = (newFormatExt) => {
    setTargetFormat(newFormatExt);
    setConvertedUrl(null);
    setError(null);
    setProgress(0);
    setPreviewError(false);
  };

  /** Perform conversion using backend API */
  const convertVideo = useCallback(async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(10);
    setError(null);
    setConvertedUrl(null);
    setPreviewError(false);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 5));
    }, 600);

    try {
      const blobResult = await apiVideoConvert(file, targetFormat, playbackSpeed);
      clearInterval(progressInterval);
      setProgress(100);
      const url = URL.createObjectURL(blobResult);
      setConvertedUrl(url);
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setError(`Error durante la conversión de video en el servidor: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [file, targetFormat, playbackSpeed]);

  /** Force stop recording if user aborts */
  const cancelConversion = useCallback(() => {
    const video = videoRef.current;
    if (video) video.pause();
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsConverting(false);
    setProgress(0);
  }, []);

  /** Download converted video file */
  const downloadVideo = useCallback(() => {
    if (!convertedUrl || !file) return;

    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${baseName}_converted.${targetFormat}`;
    link.click();
  }, [convertedUrl, file, targetFormat]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="videoconv-container">
      {/* Header */}
      <div className="videoconv-header">
        <i className="bi bi-film videoconv-icon-main"></i>
        <h2 className="videoconv-title">Conversor de Formatos de Video</h2>
        <p className="videoconv-subtitle">
          Carga tus clips de video y conviértelos localmente con control de velocidad en la tasa de transcodificación.
        </p>
      </div>

      <div className="videoconv-card">
        {/* Upload box */}
        {!file && (
          <div
            className={`videoconv-upload-box ${isDragOver ? 'bg-light border-primary' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
              id="videoConvInput"
              accept={acceptedExtensions}
            />
            <label htmlFor="videoConvInput" style={{ cursor: 'pointer', width: '100%' }}>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Haz clic o arrastra tu video aquí</span>
              <small className="d-block mt-2">
                Soporta video en MP4, WEBM, MOV, AVI, MKV, OGV y más.
              </small>
            </label>
          </div>
        )}

        {/* Uploaded File Grid */}
        {file && (
          <div className="videoconv-grid">
            {/* Left: Video Preview */}
            <div className="videoconv-preview-panel">
              <span className="badge bg-secondary mb-2">
                {convertedUrl ? 'Video Convertido' : 'Vista Previa'}
              </span>
              {videoSrc && isHtml5Playable ? (
                <video
                  ref={videoRef}
                  key={convertedUrl || videoSrc}
                  src={convertedUrl || videoSrc}
                  className="videoconv-preview-video"
                  controls
                  muted
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="videoconv-unsupported-preview">
                  <div className="videoconv-unsupported-icon">
                    <i className="bi bi-file-earmark-play-fill"></i>
                  </div>
                  <div className="videoconv-unsupported-title">
                    Vista previa no disponible para .{activeExt.toUpperCase()}
                  </div>
                  <p className="videoconv-unsupported-text">
                    {convertedUrl
                      ? `El video fue convertido a .${activeExt} exitosamente. Los navegadores web no pueden reproducir archivos .${activeExt} nativamente, pero el archivo descargado funcionará en reproductores multimedia como VLC.`
                      : `Los navegadores web no admiten la reproducción directa de archivos .${activeExt}. La conversión funcionará y podrás descargar tu video normalmente.`}
                  </p>
                </div>
              )}
              {videoDetails && (
                <div className="videoconv-preview-info">
                  {videoDetails.width > 0 ? `Dimensión: ${videoDetails.width} × ${videoDetails.height}px | ` : ''}
                  {videoDetails.duration > 0 ? `Duración: ${videoDetails.duration.toFixed(1)}s | ` : ''}
                  Peso: {formatSize(videoDetails.size)}
                </div>
              )}
            </div>

            {/* Right: Controls & Conversion Settings */}
            <div>
              <div className="videoconv-form-group">
                <label htmlFor="video-format-select">Formato de salida:</label>
                <select
                  id="video-format-select"
                  className="form-select"
                  value={targetFormat}
                  onChange={(e) => handleTargetFormatChange(e.target.value)}
                  disabled={isConverting}
                >
                  {outputOptions.map((f) => (
                    <option key={f.ext} value={f.ext}>
                      {f.name} (.{f.ext})
                    </option>
                  ))}
                </select>
              </div>

              {/* Playback speed slider to speed up transcoding */}
              <div className="videoconv-form-group">
                <label htmlFor="video-speed-select">Velocidad de conversión (Grabar a):</label>
                <select
                  id="video-speed-select"
                  className="form-select"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  disabled={isConverting}
                >
                  <option value="1.0">1.0x (Tiempo Real)</option>
                  <option value="1.5">1.5x (Rápido)</option>
                  <option value="2.0">2.0x (Súper Rápido - Recomendado)</option>
                  <option value="3.0">3.0x (Ultra Rápido)</option>
                </select>
                <small className="text-muted d-block mt-1">
                  Acelerar la reproducción reduce notablemente el tiempo necesario para la conversión.
                </small>
              </div>

              {/* Dynamic metadata info box from CENTRAL formats.js config */}
              {targetFormat && selectedTargetConfig && (
                <div className="alert bg-light border-light-subtle p-3 my-3" style={{ fontSize: '0.85rem' }}>
                  <h6 className="mb-1 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill text-primary"></i> 
                    <span>Sobre el formato {selectedTargetConfig.name}</span>
                  </h6>
                  <p className="mb-2 text-secondary">{selectedTargetConfig.additionalInfo}</p>
                  {selectedTargetConfig.restrictions && (
                    <div className="text-warning-emphasis d-flex gap-1 align-items-start mt-2 pt-2 border-top border-light-subtle">
                      <i className="bi bi-exclamation-triangle-fill flex-shrink-0 mt-0.5"></i>
                      <span><strong>Restricciones:</strong> {selectedTargetConfig.restrictions}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Bar */}
              {isConverting && (
                <div className="videoconv-progress-container">
                  <div className="videoconv-progress-label">
                    <span>Grabando y procesando video...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="videoconv-progress-bar-bg">
                    <div
                      className="videoconv-progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="videoconv-alert videoconv-alert--error">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {convertedUrl && (
                <div className="videoconv-alert videoconv-alert--success">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Conversión de video completada con éxito. Listo para descargar.</span>
                </div>
              )}

              {/* Actions */}
              <div className="videoconv-buttons">
                {!convertedUrl ? (
                  isConverting ? (
                    <button
                      className="videoconv-btn btn-danger text-white border-0"
                      onClick={cancelConversion}
                    >
                      <i className="bi bi-x-circle"></i> Cancelar conversión
                    </button>
                  ) : (
                    <button
                      className="videoconv-btn videoconv-btn--convert"
                      onClick={convertVideo}
                      disabled={isConverting}
                    >
                      <i className="bi bi-arrow-repeat"></i> Iniciar conversión
                    </button>
                  )
                ) : (
                  <button
                    className="videoconv-btn videoconv-btn--download"
                    onClick={downloadVideo}
                  >
                    <i className="bi bi-download"></i> Descargar video
                  </button>
                )}

                <button
                  className="videoconv-btn videoconv-btn--clear"
                  onClick={reset}
                  disabled={isConverting}
                >
                  <i className="bi bi-arrow-left"></i> {convertedUrl ? 'Subir otro video' : 'Limpiar y quitar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
