const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://contador-back-xeq3.onrender.com');

/**
 * Helper to execute backend requests and handle errors cleanly
 */
async function handleFetch(url, options) {
  const response = await fetch(url, options);

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    if (response.status === 504 || response.status === 502) {
      throw new Error(
        'El servidor tardó demasiado en responder (Timeout 504/502). El video puede ser demasiado grande para el servidor o este está reiniciando.'
      );
    }
    if (contentType.includes('application/json')) {
      const errData = await response.json();
      throw new Error(errData.message || 'Error en la solicitud al servidor');
    } else {
      throw new Error(`Error en el servidor (${response.status} ${response.statusText})`);
    }
  }

  if (contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.blob();
}

/** 1. Encoder / Decoder */
export async function apiEncoder(input, type, action) {
  const data = await handleFetch(`${API_BASE_URL}/api/tools/encoder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, type, action }),
  });
  return data.data;
}

/** 2. Imagen Base64 */
export async function apiImageBase64(fileOrBase64) {
  if (fileOrBase64 instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    const data = await handleFetch(`${API_BASE_URL}/api/tools/image-base64`, {
      method: 'POST',
      body: formData,
    });
    return data.base64;
  } else {
    const data = await handleFetch(`${API_BASE_URL}/api/tools/image-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: fileOrBase64 }),
    });
    return data.base64;
  }
}

/** 3. Redimensionar imagen */
export async function apiImageResize(fileOrBase64, width, height, format, quality, lockRatio) {
  const formData = new FormData();
  if (fileOrBase64 instanceof File) {
    formData.append('file', fileOrBase64);
  } else {
    formData.append('base64', fileOrBase64);
  }
  if (width) formData.append('width', width);
  if (height) formData.append('height', height);
  if (format) formData.append('format', format);
  if (quality !== undefined) formData.append('quality', quality);
  if (lockRatio !== undefined) formData.append('lockRatio', lockRatio);

  const blob = await handleFetch(`${API_BASE_URL}/api/tools/image-resize`, {
    method: 'POST',
    body: formData,
  });
  return blob;
}

/** 4. Convertidor de archivos */
export async function apiFileConvert(file, targetFormat) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  const blob = await handleFetch(`${API_BASE_URL}/api/tools/file-convert`, {
    method: 'POST',
    body: formData,
  });
  return blob;
}

/** 5. Convertidor de imagen */
export async function apiImageConvert(file, targetFormat, quality) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);
  if (quality !== undefined) formData.append('quality', quality);

  const blob = await handleFetch(`${API_BASE_URL}/api/tools/image-convert`, {
    method: 'POST',
    body: formData,
  });
  return blob;
}

/** 6. Convertidor de video */
export async function apiVideoConvert(file, targetFormat, speed) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);
  if (speed !== undefined) formData.append('speed', speed);

  const blob = await handleFetch(`${API_BASE_URL}/api/tools/video-convert`, {
    method: 'POST',
    body: formData,
  });
  return blob;
}

/** 7. Convertidor de audio */
export async function apiAudioConvert(file, targetFormat) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  const blob = await handleFetch(`${API_BASE_URL}/api/tools/audio-convert`, {
    method: 'POST',
    body: formData,
  });
  return blob;
}

/** 8. Proxy frame URL generator */
export function getProxyFrameUrl(targetUrl, colorScheme = 'light', scrollbar = 'hidden') {
  if (!targetUrl) return '';
  const cleanUrl = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
    ? targetUrl
    : `https://${targetUrl}`;
  return `${API_BASE_URL}/api/tools/proxy-frame?url=${encodeURIComponent(cleanUrl)}&colorScheme=${encodeURIComponent(colorScheme)}&scrollbar=${encodeURIComponent(scrollbar)}`;
}


