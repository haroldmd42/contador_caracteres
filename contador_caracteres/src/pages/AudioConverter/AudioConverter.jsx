import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AUDIO_FORMATS, getFormatConfig, getCompatibleFormats } from '../../constants/formats';
import { apiAudioConvert } from '../../services/apiService';
import './AudioConverter.css';

/** Static wave bar heights for visualizer styling */
const WAVE_BARS = [
  15, 30, 22, 45, 12, 35, 28, 40, 18, 25, 32, 10, 20, 26, 38,
  14, 22, 30, 18, 42, 16, 28, 34, 12, 24, 20, 36, 14, 26, 30
];

/** PCM WAV Encoder in pure JS */
function bufferToWav(buffer) {
  let numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArr = new ArrayBuffer(length),
      view = new DataView(bufferArr),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  // Write WAV Header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16);         // chunk length
  setUint16(1);          // sample format (PCM)
  setUint16(numOfChan);  // channel count
  setUint32(buffer.sampleRate); // sample rate
  setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16);         // bits per sample
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4); // chunk length

  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write sample
      pos += 2;
    }
    offset++;
  }

  return new Blob([bufferArr], { type: 'audio/wav' });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export default function AudioConverter() {
  const [file, setFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioDetails, setAudioDetails] = useState(null);
  const [targetFormat, setTargetFormat] = useState('wav');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef(null);
  const audioCtxRef = useRef(null);
  const destStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const audioSourceRef = useRef(null);

  /** Clean up resources */
  useEffect(() => {
    return () => {
      if (audioSrc) URL.revokeObjectURL(audioSrc);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [audioSrc, convertedUrl]);

  /** Build dynamic accept attribute for audio input */
  const acceptedExtensions = useMemo(() => {
    return AUDIO_FORMATS.map(f => `.${f.ext}`).join(',');
  }, []);

  /** Resolve compatible output options dynamically based on inputs from central format registry */
  const outputOptions = useMemo(() => {
    if (!file) return [];
    const ext = file.name.split('.').pop().toLowerCase();
    const compatList = getCompatibleFormats(ext);
    
    // Validate if the format can be encoded natively in browser or fallback
    return compatList.map(opt => {
      let isNativelyRecordable = true;
      if (opt.ext !== 'wav' && typeof MediaRecorder !== 'undefined') {
        let testMime = `audio/${opt.ext}`;
        if (opt.ext === 'mp3') testMime = 'audio/mpeg';
        if (opt.ext === 'm4a') testMime = 'audio/mp4';
        isNativelyRecordable = MediaRecorder.isTypeSupported(testMime) || MediaRecorder.isTypeSupported('audio/webm');
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

  /** Load uploaded audio file */
  const handleAudioUpload = useCallback((uploadedFile) => {
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    const config = getFormatConfig(ext);

    if (!config || config.category !== 'audio') {
      alert(`El formato de audio .${ext} no está soportado.`);
      return;
    }

    if (audioSrc) URL.revokeObjectURL(audioSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);
    setConvertedBlob(null);
    setError(null);
    setProgress(0);

    setFile(uploadedFile);

    setAudioDetails({
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type || `audio/${ext}`,
    });

    const objectUrl = URL.createObjectURL(uploadedFile);
    setAudioSrc(objectUrl);

    // Pick first compatible format target
    const compatList = getCompatibleFormats(ext);
    if (compatList.length > 0) {
      setTargetFormat(compatList[0].ext);
    } else {
      setTargetFormat('wav');
    }
  }, [audioSrc, convertedUrl]);

  const handleFileChange = useCallback((e) => {
    handleAudioUpload(e.target.files[0]);
  }, [handleAudioUpload]);

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
      handleAudioUpload(e.dataTransfer.files[0]);
    }
  }, [handleAudioUpload]);

  /** Reset all state */
  const reset = useCallback(() => {
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setAudioSrc(null);
    setAudioDetails(null);
    setTargetFormat('wav');
    setConvertedUrl(null);
    setConvertedBlob(null);
    setError(null);
    setProgress(0);
    setIsConverting(false);
    setIsPlaying(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [audioSrc, convertedUrl]);

  /** Handle output format change */
  const handleTargetFormatChange = (newFormatExt) => {
    setTargetFormat(newFormatExt);
    setConvertedUrl(null);
    setConvertedBlob(null);
    setError(null);
    setProgress(0);
  };

  /** Perform audio conversion using backend API */
  const convertAudio = useCallback(async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(20);
    setError(null);
    setConvertedUrl(null);
    setConvertedBlob(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 15));
    }, 200);

    try {
      const blobResult = await apiAudioConvert(file, targetFormat);
      clearInterval(progressInterval);
      setProgress(100);
      const url = URL.createObjectURL(blobResult);
      setConvertedBlob(blobResult);
      setConvertedUrl(url);
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setError(`Error durante la conversión de audio en el servidor: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [file, targetFormat]);

  /** Download converted file */
  const downloadAudio = useCallback(() => {
    if (!convertedBlob || !file) return;

    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${baseName}_converted.${targetFormat}`;
    link.click();
  }, [convertedBlob, convertedUrl, file, targetFormat]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="audioconv-container">
      {/* Header */}
      <div className="audioconv-header">
        <i className="bi bi-music-note-beamed audioconv-icon-main"></i>
        <h2 className="audioconv-title">Conversor de Formatos de Audio</h2>
        <p className="audioconv-subtitle">
          Carga tus archivos de sonido y conviértelos localmente con excelente calidad de remuestreo.
        </p>
      </div>

      <div className="audioconv-card">
        {/* Upload box */}
        {!file && (
          <div
            className={`audioconv-upload-box ${isDragOver ? 'bg-light border-primary' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="d-none"
              id="audioConvInput"
              accept={acceptedExtensions}
            />
            <label htmlFor="audioConvInput" style={{ cursor: 'pointer', width: '100%' }}>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Haz clic o arrastra tu audio aquí</span>
              <small className="d-block mt-2">
                Soporta MP3, WAV, AAC, M4A, OGG, FLAC, ALAC, AIFF y más.
              </small>
            </label>
          </div>
        )}

        {/* Loaded File view */}
        {file && (
          <div className="audioconv-grid">
            {/* Left: Waveform visualizer & Audio player */}
            <div className="audioconv-preview-panel">
              <span className="badge bg-secondary mb-3">
                {convertedUrl ? 'Audio Convertido' : 'Audio Original'}
              </span>

              {/* Animated waveform visualizer */}
              <div className="audioconv-waveform-mock">
                {WAVE_BARS.map((height, i) => (
                  <div
                    key={i}
                    className={`audioconv-wave-bar ${isPlaying || isConverting ? 'active' : ''}`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${i * 0.03}s`,
                    }}
                  ></div>
                ))}
              </div>

              {audioSrc && (
                <audio
                  src={convertedUrl || audioSrc}
                  className="audioconv-audio-player"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              {audioDetails && (
                <div className="audioconv-preview-info mt-2">
                  Nombre: {audioDetails.name} | Peso: {formatSize(audioDetails.size)}
                </div>
              )}
            </div>

            {/* Right: Controls & Conversion settings */}
            <div>
              <div className="audioconv-form-group">
                <label htmlFor="audio-format-select">Formato destino:</label>
                <select
                  id="audio-format-select"
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
                <div className="audioconv-progress-container my-3">
                  <div className="audioconv-progress-label">
                    <span>Procesando audio localmente...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="audioconv-progress-bar-bg">
                    <div
                      className="audioconv-progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="audioconv-alert audioconv-alert--error">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {convertedUrl && (
                <div className="audioconv-alert audioconv-alert--success">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Conversión de audio completada con éxito. Listo para descargar.</span>
                </div>
              )}

              {/* Actions */}
              <div className="audioconv-buttons">
                {!convertedUrl ? (
                  <button
                    className="audioconv-btn audioconv-btn--convert"
                    onClick={convertAudio}
                    disabled={isConverting}
                  >
                    <i className="bi bi-arrow-repeat"></i> Iniciar conversión
                  </button>
                ) : (
                  <button
                    className="audioconv-btn audioconv-btn--download"
                    onClick={downloadAudio}
                  >
                    <i className="bi bi-download"></i> Descargar audio
                  </button>
                )}

                <button
                  className="audioconv-btn audioconv-btn--clear"
                  onClick={reset}
                  disabled={isConverting}
                >
                  <i className="bi bi-trash"></i> {convertedUrl ? 'Subir otro audio' : 'Limpiar y quitar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
