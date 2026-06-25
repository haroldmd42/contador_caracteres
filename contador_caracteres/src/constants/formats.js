/**
 * Centralized format definitions for all converters.
 * Single source of truth for supported file types across the application.
 */

/* ─── Category constants ─── */
export const CATEGORY = {
  DOCUMENT: 'document',
  SPREADSHEET: 'spreadsheet',
  PRESENTATION: 'presentation',
  PUBLISHING: 'publishing',
  ARCHIVE: 'archive',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
};

/* ─── Subcategory constants ─── */
export const SUBCATEGORY = {
  // Documents
  TEXT_DOC: 'Documentos de texto',
  // Spreadsheets
  SPREADSHEET: 'Hojas de cálculo',
  // Presentations
  PRESENTATION: 'Presentaciones',
  // Publishing
  PUBLISHING: 'Publicación y diseño',
  // Archives
  ARCHIVE: 'Archivos comprimidos',
  // Images
  IMG_COMMON: 'Formatos comunes',
  IMG_ADVANCED: 'Formatos avanzados',
  IMG_VECTOR: 'Vectoriales y profesionales',
  IMG_RAW: 'RAW de cámaras',
  // Video
  VID_GENERAL: 'Uso general',
  VID_PRO: 'Profesional',
  VID_LEGACY: 'Especiales y heredados',
  VID_STREAMING: 'Streaming',
  // Audio
  AUD_STANDARD: 'Compresión estándar',
  AUD_LOSSLESS: 'Alta calidad sin pérdida',
  AUD_PRO: 'Producción profesional',
  AUD_OTHER: 'Otros formatos',
};

// Common compatibilities
const DOC_COMPAT = ['pdf', 'docx', 'txt', 'md', 'html', 'xml', 'epub', 'tex', 'odt', 'rtf'];
const SHEET_COMPAT = ['xlsx', 'xls', 'ods', 'csv', 'tsv', 'json'];
const PRES_COMPAT = ['pptx', 'pdf', 'png', 'jpg', 'odp'];
const IMG_COMPAT = ['png', 'jpg', 'webp', 'gif', 'bmp', 'ico', 'pdf'];
const VID_COMPAT = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
const AUD_COMPAT = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'];
const ARCHIVE_COMPAT = ['zip', 'tar', 'gz'];

/* ══════════════════════════════════════════════════════════════
   DOCUMENT / SPREADSHEET / PRESENTATION / ARCHIVE FORMATS
   ══════════════════════════════════════════════════════════════ */
export const FILE_FORMATS = [
  // ── Text Documents ──
  {
    name: 'PDF',
    ext: 'pdf',
    mime: 'application/pdf',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: ['docx', 'txt', 'html', 'png', 'jpg'],
    restrictions: 'La conversión a DOCX/TXT extrae el texto disponible. Las imágenes del PDF no se digitalizan como texto editable (requiere OCR externo).',
    additionalInfo: 'Formato estándar universal para visualización e impresión estable.'
  },
  {
    name: 'DOCX',
    ext: 'docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'El formato de salida respeta el flujo de texto básico y párrafos.',
    additionalInfo: 'Formato de Microsoft Word moderno basado en XML abierto.'
  },
  {
    name: 'DOC',
    ext: 'doc',
    mime: 'application/msword',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Formato heredado. Se procesa extrayendo el texto plano principal.',
    additionalInfo: 'Formato binario de Microsoft Word clásico (versiones 97-2003).'
  },
  {
    name: 'ODT',
    ext: 'odt',
    mime: 'application/vnd.oasis.opendocument.text',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Conversión de contenido estructural y textos principales.',
    additionalInfo: 'Documento de texto de formato abierto (LibreOffice / OpenOffice).'
  },
  {
    name: 'RTF',
    ext: 'rtf',
    mime: 'application/rtf',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Se eliminan comandos de marcado complejos y se preserva el texto plano enriquecido.',
    additionalInfo: 'Formato de Texto Enriquecido estándar compatible con múltiples sistemas.'
  },
  {
    name: 'TXT',
    ext: 'txt',
    mime: 'text/plain',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'No admite estilos de letra, colores ni tablas (solo texto plano).',
    additionalInfo: 'Texto plano sin formato, codificado en UTF-8.'
  },
  {
    name: 'Markdown',
    ext: 'md',
    mime: 'text/markdown',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Se interpreta sintaxis básica de títulos, listas y negritas.',
    additionalInfo: 'Formato ligero de marcado para redacción web estructurada.'
  },
  {
    name: 'HTML',
    ext: 'html',
    mime: 'text/html',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Se eliminan scripts dinámicos y estilos CSS complejos para la conversión de texto limpio.',
    additionalInfo: 'Página web estándar basada en hipertexto.'
  },
  {
    name: 'HTML (Heredado)',
    ext: 'htm',
    mime: 'text/html',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Mismas restricciones que .html.',
    additionalInfo: 'Extensión alternativa de páginas web.'
  },
  {
    name: 'XML',
    ext: 'xml',
    mime: 'application/xml',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Debe contener estructuras legibles por etiquetas para su parseo correcto.',
    additionalInfo: 'Lenguaje de marcado extensible para almacenamiento e intercambio de datos.'
  },
  {
    name: 'EPUB',
    ext: 'epub',
    mime: 'application/epub+zip',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Se extrae el texto limpio de los capítulos XHTML internos.',
    additionalInfo: 'Formato estándar abierto para libros electrónicos.'
  },
  {
    name: 'LaTeX',
    ext: 'tex',
    mime: 'application/x-latex',
    category: CATEGORY.DOCUMENT,
    subcategory: SUBCATEGORY.TEXT_DOC,
    compatibilities: DOC_COMPAT,
    restrictions: 'Se extraen los bloques de texto plano de los comandos \\begin y \\end.',
    additionalInfo: 'Sistema de composición tipográfica científica y académica.'
  },

  // ── Spreadsheets ──
  {
    name: 'XLSX',
    ext: 'xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Las macros (VBA) y los gráficos interactivos complejos no se exportan.',
    additionalInfo: 'Libro de Excel de Microsoft moderno basado en XML.'
  },
  {
    name: 'XLS',
    ext: 'xls',
    mime: 'application/vnd.ms-excel',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Formato binario antiguo de Excel. Puede haber límites de filas.',
    additionalInfo: 'Libro de Excel clásico de Microsoft (versión 97-2003).'
  },
  {
    name: 'ODS',
    ext: 'ods',
    mime: 'application/vnd.oasis.opendocument.spreadsheet',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Fórmulas propietarias complejas de LibreOffice se evalúan como texto o valores calculados.',
    additionalInfo: 'Hoja de cálculo de formato abierto estándar (OpenDocument).'
  },
  {
    name: 'CSV',
    ext: 'csv',
    mime: 'text/csv',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Solo soporta una única hoja de datos. Sin fórmulas ni formato de celdas.',
    additionalInfo: 'Valores separados por comas para bases de datos sencillas.'
  },
  {
    name: 'TSV',
    ext: 'tsv',
    mime: 'text/tab-separated-values',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Solo soporta una hoja. Sin colores, celdas fusionadas ni fórmulas.',
    additionalInfo: 'Valores separados por tabuladores.'
  },
  {
    name: 'JSON',
    ext: 'json',
    mime: 'application/json',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: SHEET_COMPAT,
    restrictions: 'Estructuras jerárquicas complejas se aplanan en filas para exportar a XLSX/CSV.',
    additionalInfo: 'Formato estándar liviano de intercambio de objetos estructurados.'
  },
  {
    name: 'Numbers',
    ext: 'numbers',
    mime: 'application/x-iwork-numbers-sffnumbers',
    category: CATEGORY.SPREADSHEET,
    subcategory: SUBCATEGORY.SPREADSHEET,
    compatibilities: ['xlsx', 'csv', 'ods'],
    restrictions: 'Formato propietario de Apple. Para su conversión, se recomienda exportar a XLSX desde la app original.',
    additionalInfo: 'Hoja de cálculo exclusiva del ecosistema Apple iWork.'
  },

  // ── Presentations ──
  {
    name: 'PPTX',
    ext: 'pptx',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    category: CATEGORY.PRESENTATION,
    subcategory: SUBCATEGORY.PRESENTATION,
    compatibilities: PRES_COMPAT,
    restrictions: 'Las animaciones de diapositivas y las transiciones no se transfieren.',
    additionalInfo: 'Presentación de PowerPoint de Microsoft basada en XML.'
  },
  {
    name: 'PPT',
    ext: 'ppt',
    mime: 'application/vnd.ms-powerpoint',
    category: CATEGORY.PRESENTATION,
    subcategory: SUBCATEGORY.PRESENTATION,
    compatibilities: PRES_COMPAT,
    restrictions: 'Las diapositivas binarias antiguas se procesan extrayendo la estructura del texto principal.',
    additionalInfo: 'Presentación de PowerPoint heredada de Microsoft.'
  },
  {
    name: 'ODP',
    ext: 'odp',
    mime: 'application/vnd.oasis.opendocument.presentation',
    category: CATEGORY.PRESENTATION,
    subcategory: SUBCATEGORY.PRESENTATION,
    compatibilities: PRES_COMPAT,
    restrictions: 'Conversión de textos y diseños básicos de diapositivas.',
    additionalInfo: 'Presentación de OpenDocument para LibreOffice Impress.'
  },
  {
    name: 'KEY',
    ext: 'key',
    mime: 'application/x-iwork-keynote-sffkey',
    category: CATEGORY.PRESENTATION,
    subcategory: SUBCATEGORY.PRESENTATION,
    compatibilities: ['pptx', 'pdf'],
    restrictions: 'Formato propietario de Apple. Requiere exportarse a PPTX desde Keynote para una lectura completa.',
    additionalInfo: 'Presentación de diapositivas nativa de Apple Keynote.'
  },

  // ── Publishing & Design ──
  {
    name: 'SVG',
    ext: 'svg',
    mime: 'image/svg+xml',
    category: CATEGORY.PUBLISHING,
    subcategory: SUBCATEGORY.PUBLISHING,
    compatibilities: ['pdf', 'png', 'jpg'],
    restrictions: 'Mantiene gráficos vectoriales. Efectos interactivos complejos y filtros SVG no nativos se aplanan.',
    additionalInfo: 'Gráficos vectoriales escalables basados en código XML.'
  },
  {
    name: 'EPS',
    ext: 'eps',
    mime: 'application/postscript',
    category: CATEGORY.PUBLISHING,
    subcategory: SUBCATEGORY.PUBLISHING,
    compatibilities: ['pdf', 'png', 'jpg'],
    restrictions: 'Requiere aplanamiento ráster. Degradados complejos PostScript pueden presentar bandas de color.',
    additionalInfo: 'Encapsulated PostScript para impresión y diseño vectorial.'
  },
  {
    name: 'PS',
    ext: 'ps',
    mime: 'application/postscript',
    category: CATEGORY.PUBLISHING,
    subcategory: SUBCATEGORY.PUBLISHING,
    compatibilities: ['pdf'],
    restrictions: 'Conversión directa a PDF conservando los comandos de marcado PostScript vectoriales.',
    additionalInfo: 'Archivo de lenguaje de descripción de páginas PostScript.'
  },
  {
    name: 'InDesign',
    ext: 'indd',
    mime: 'application/x-indesign',
    category: CATEGORY.PUBLISHING,
    subcategory: SUBCATEGORY.PUBLISHING,
    compatibilities: ['pdf'],
    restrictions: 'Formato altamente propietario de Adobe. Se requiere exportar a PDF / IDML en InDesign.',
    additionalInfo: 'Proyecto editorial nativo de Adobe InDesign.'
  },

  // ── Archives ──
  {
    name: 'ZIP',
    ext: 'zip',
    mime: 'application/zip',
    category: CATEGORY.ARCHIVE,
    subcategory: SUBCATEGORY.ARCHIVE,
    compatibilities: ARCHIVE_COMPAT,
    restrictions: 'Archivos cifrados con contraseña de seguridad pesada no se pueden extraer localmente.',
    additionalInfo: 'Formato de compresión estándar universal que empaqueta múltiples archivos.'
  },
  {
    name: 'RAR',
    ext: 'rar',
    mime: 'application/x-rar-compressed',
    category: CATEGORY.ARCHIVE,
    subcategory: SUBCATEGORY.ARCHIVE,
    compatibilities: ['zip', 'tar'],
    restrictions: 'Formatos RAR5 con cifrado fuerte o archivos divididos en partes no son compatibles localmente.',
    additionalInfo: 'Archivo comprimido propietario de alta tasa WinRAR.'
  },
  {
    name: '7Z',
    ext: '7z',
    mime: 'application/x-7z-compressed',
    category: CATEGORY.ARCHIVE,
    subcategory: SUBCATEGORY.ARCHIVE,
    compatibilities: ['zip', 'tar'],
    restrictions: 'Compresión LZMA/LZMA2 con altos requerimientos de memoria en descompresión local.',
    additionalInfo: 'Archivo comprimido libre con algoritmo abierto de alta eficiencia.'
  },
  {
    name: 'TAR',
    ext: 'tar',
    mime: 'application/x-tar',
    category: CATEGORY.ARCHIVE,
    subcategory: SUBCATEGORY.ARCHIVE,
    compatibilities: ARCHIVE_COMPAT,
    restrictions: 'Un TAR empaqueta archivos pero no los comprime (pesa igual que la suma de sus componentes).',
    additionalInfo: 'Colección de archivos (Tape Archive) común en Unix/Linux.'
  },
  {
    name: 'GZ',
    ext: 'gz',
    mime: 'application/gzip',
    category: CATEGORY.ARCHIVE,
    subcategory: SUBCATEGORY.ARCHIVE,
    compatibilities: ['zip', 'tar'],
    restrictions: 'Comprime solo un único archivo a la vez. Común usarlo sobre un TAR (.tar.gz).',
    additionalInfo: 'Archivo comprimido mediante el algoritmo deflate (GNU Gzip).'
  },
];

/* ══════════════════════════════════════════════════════════════
   IMAGE FORMATS
   ══════════════════════════════════════════════════════════════ */
export const IMAGE_FORMATS = [
  // ── Common ──
  {
    name: 'JPG',
    ext: 'jpg',
    mime: 'image/jpeg',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'No admite transparencias. Los fondos transparentes se rellenan con fondo blanco por defecto.',
    additionalInfo: 'Formato de imagen comprimida con pérdida ideal para fotografías.'
  },
  {
    name: 'JPEG',
    ext: 'jpeg',
    mime: 'image/jpeg',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Mismas restricciones que .jpg.',
    additionalInfo: 'Formato idéntico a JPG.'
  },
  {
    name: 'PNG',
    ext: 'png',
    mime: 'image/png',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Compresión sin pérdida. Produce archivos de mayor tamaño que JPG en fotos.',
    additionalInfo: 'Soporta transparencias completas (canal Alfa) y es ideal para gráficos web.'
  },
  {
    name: 'GIF',
    ext: 'gif',
    mime: 'image/gif',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Admite máximo 256 colores. La conversión de un GIF animado solo captura el primer fotograma en salidas estáticas.',
    additionalInfo: 'Formato clásico ideal para gráficos pequeños y animaciones sencillas.'
  },
  {
    name: 'WEBP',
    ext: 'webp',
    mime: 'image/webp',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Excelente compresión, aunque versiones muy antiguas de navegadores o visores pueden no soportarlo.',
    additionalInfo: 'Formato moderno desarrollado por Google que soporta transparencias y compresión de alta calidad.'
  },
  {
    name: 'BMP',
    ext: 'bmp',
    mime: 'image/bmp',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Sin compresión por defecto, lo que produce archivos extremadamente pesados.',
    additionalInfo: 'Mapa de bits estándar nativo de Windows.'
  },
  {
    name: 'TIFF',
    ext: 'tiff',
    mime: 'image/tiff',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_COMMON,
    compatibilities: IMG_COMPAT,
    restrictions: 'Archivos pesados de múltiples capas. La conversión en el navegador unifica las capas en una sola imagen.',
    additionalInfo: 'Tag Image File Format utilizado ampliamente en la industria de impresión y escaneo profesional.'
  },

  // ── Advanced ──
  {
    name: 'HEIC',
    ext: 'heic',
    mime: 'image/heic',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Conversión local mediante decodificador heic2any. Archivos de más de 10MB pueden demorar unos segundos.',
    additionalInfo: 'High Efficiency Image Format utilizado por Apple en dispositivos iOS.'
  },
  {
    name: 'HEIF',
    ext: 'heif',
    mime: 'image/heif',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Mismas restricciones que HEIC.',
    additionalInfo: 'Formato base de alta eficiencia equivalente a HEIC.'
  },
  {
    name: 'AVIF',
    ext: 'avif',
    mime: 'image/avif',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Requiere soporte nativo del navegador para renderizar y decodificar.',
    additionalInfo: 'Formato de compresión de nueva generación de código abierto basado en AV1.'
  },
  {
    name: 'JPEG 2000',
    ext: 'jp2',
    mime: 'image/jp2',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Soporte limitado en navegadores. Se convierte utilizando renderizado alternativo.',
    additionalInfo: 'Evolución de JPEG con compresión wavelet.'
  },
  {
    name: 'JPEG XR',
    ext: 'jxr',
    mime: 'image/vnd.ms-photo',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Formato desarrollado por Microsoft, compatibilidad reducida en navegadores no IE/Edge.',
    additionalInfo: 'Windows Media Photo optimizado para alto rango dinámico.'
  },
  {
    name: 'ICO',
    ext: 'ico',
    mime: 'image/x-icon',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_ADVANCED,
    compatibilities: IMG_COMPAT,
    restrictions: 'Adecuado para tamaños pequeños (16x16, 32x32, 64x64px). Imágenes grandes se reducen para encajar.',
    additionalInfo: 'Formato de icono de Windows que almacena múltiples tamaños.'
  },

  // ── Vector & Professional ──
  {
    name: 'SVG',
    ext: 'svg',
    mime: 'image/svg+xml',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_VECTOR,
    compatibilities: IMG_COMPAT,
    restrictions: 'Gráfico vectorial. La conversión a JPG/PNG rasteriza la imagen a una resolución estática.',
    additionalInfo: 'Gráfico vectorial basado en texto XML infinitamente escalable.'
  },
  {
    name: 'EPS',
    ext: 'eps',
    mime: 'application/postscript',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_VECTOR,
    compatibilities: ['png', 'jpg', 'pdf'],
    restrictions: 'Se extrae el canal vectorial principal o el preview TIFF incrustado.',
    additionalInfo: 'Encapsulated PostScript para gráficos vectoriales en imprenta.'
  },
  {
    name: 'PDF (Imagen)',
    ext: 'pdf',
    mime: 'application/pdf',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_VECTOR,
    compatibilities: IMG_COMPAT,
    restrictions: 'Se renderiza la primera página del documento PDF como imagen ráster.',
    additionalInfo: 'PDF utilizado para empaquetar imágenes y vectores vectoriales.'
  },
  {
    name: 'AI (Adobe Illustrator)',
    ext: 'ai',
    mime: 'application/illustrator',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_VECTOR,
    compatibilities: ['pdf', 'png', 'jpg'],
    restrictions: 'Los archivos .ai guardados sin compatibilidad PDF no podrán convertirse en el navegador.',
    additionalInfo: 'Gráfico vectorial nativo de Adobe Illustrator.'
  },

  // ── Camera RAW ──
  {
    name: 'CR2 (Canon RAW)',
    ext: 'cr2',
    mime: 'image/x-canon-cr2',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Se extrae directamente en milisegundos la imagen JPEG incrustada a máxima resolución grabada por la cámara.',
    additionalInfo: 'Imagen RAW cruda de cámaras reflex Canon.'
  },
  {
    name: 'CR3 (Canon RAW)',
    ext: 'cr3',
    mime: 'image/x-canon-cr3',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Se extrae la previsualización JPEG incrustada en el contenedor HEVC/RAW.',
    additionalInfo: 'Formato RAW más nuevo de Canon basado en ISO base.'
  },
  {
    name: 'NEF (Nikon RAW)',
    ext: 'nef',
    mime: 'image/x-nikon-nef',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Extracción local de la vista previa JPEG integrada de alta calidad.',
    additionalInfo: 'Formato de imagen cruda de cámaras Nikon.'
  },
  {
    name: 'ARW (Sony RAW)',
    ext: 'arw',
    mime: 'image/x-sony-arw',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Extracción instantánea de la previsualización JPEG interna.',
    additionalInfo: 'Sony Alpha Raw format.'
  },
  {
    name: 'DNG (Adobe Digital Negative)',
    ext: 'dng',
    mime: 'image/x-adobe-dng',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Extracción del preview JPEG. El mapeo de color DNG de 16 bits nativo se reduce a 8 bits estándar.',
    additionalInfo: 'Estándar de negativo digital universal desarrollado por Adobe.'
  },
  {
    name: 'RAF (Fujifilm RAW)',
    ext: 'raf',
    mime: 'image/x-fuji-raf',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Extracción de la imagen JPEG de previsualización incrustada por la cámara.',
    additionalInfo: 'Imagen RAW de cámaras Fujifilm.'
  },
  {
    name: 'RW2 (Panasonic RAW)',
    ext: 'rw2',
    mime: 'image/x-panasonic-rw2',
    category: CATEGORY.IMAGE,
    subcategory: SUBCATEGORY.IMG_RAW,
    compatibilities: ['jpg', 'png', 'webp'],
    restrictions: 'Extracción del preview JPEG integrado por Panasonic.',
    additionalInfo: 'Imagen sin comprimir de cámaras Panasonic Lumix.'
  },
];

/* ══════════════════════════════════════════════════════════════
   VIDEO FORMATS
   ══════════════════════════════════════════════════════════════ */
export const VIDEO_FORMATS = [
  // ── General Use ──
  {
    name: 'MP4',
    ext: 'mp4',
    mime: 'video/mp4',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: VID_COMPAT,
    restrictions: 'Estándar recomendado. Su conversión local depende de los codecs soportados por el navegador.',
    additionalInfo: 'Contenedor de video universal compatible con la mayoría de navegadores y dispositivos.'
  },
  {
    name: 'WEBM',
    ext: 'webm',
    mime: 'video/webm',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: VID_COMPAT,
    restrictions: 'Ideal para uso web y HTML5. Admite compresión VP8/VP9 u Opus.',
    additionalInfo: 'Formato libre abierto optimizado para streaming y páginas web.'
  },
  {
    name: 'MOV',
    ext: 'mov',
    mime: 'video/quicktime',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: VID_COMPAT,
    restrictions: 'Si contiene codecs ProRes o de alta fidelidad, la reproducción nativa en navegadores no Apple puede fallar.',
    additionalInfo: 'Formato estándar de Apple QuickTime.'
  },
  {
    name: 'MKV',
    ext: 'mkv',
    mime: 'video/x-matroska',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'No reproducible nativamente en la mayoría de navegadores. Se requiere transcodificador externo o extracción de audio.',
    additionalInfo: 'Contenedor Matroska multipista capaz de almacenar múltiples pistas de audio y subtítulos.'
  },
  {
    name: 'AVI',
    ext: 'avi',
    mime: 'video/x-msvideo',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato sin compresión moderna. Alta tasa de peso. No compatible nativamente con navegadores.',
    additionalInfo: 'Audio Video Interleave, formato de video clásico de Microsoft.'
  },
  {
    name: 'WMV',
    ext: 'wmv',
    mime: 'video/x-ms-wmv',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Requiere plugins o decodificadores de Microsoft para su lectura.',
    additionalInfo: 'Windows Media Video para plataformas Microsoft.'
  },
  {
    name: 'FLV',
    ext: 'flv',
    mime: 'video/x-flv',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato descontinuado tras la salida de Adobe Flash Player. Solo convertible con extractor especializado.',
    additionalInfo: 'Flash Video clásico utilizado para transmisiones antiguas.'
  },
  {
    name: 'MPEG',
    ext: 'mpg',
    mime: 'video/mpeg',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Compresión antigua (MPEG-1/MPEG-2). Archivos de baja resolución y calidad.',
    additionalInfo: 'Moving Picture Experts Group estándar de video analógico y digital.'
  },
  {
    name: 'MPEG (Alt)',
    ext: 'mpeg',
    mime: 'video/mpeg',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Mismas restricciones que .mpg.',
    additionalInfo: 'Extensión alternativa de formato MPEG.'
  },
  {
    name: 'M4V',
    ext: 'm4v',
    mime: 'video/x-m4v',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Archivos M4V con protección DRM (Apple iTunes) no pueden ser convertidos.',
    additionalInfo: 'Contenedor de video desarrollado por Apple, similar a MP4.'
  },
  {
    name: '3GP',
    ext: '3gp',
    mime: 'video/3gpp',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_GENERAL,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Calidad y resolución sumamente bajas. Diseñado para redes móviles antiguas.',
    additionalInfo: 'Formato de video optimizado para teléfonos celulares antiguos.'
  },

  // ── Professional ──
  {
    name: 'MXF',
    ext: 'mxf',
    mime: 'application/mxf',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_PRO,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato de cámara profesional extremadamente pesado. No reproducible en navegadores.',
    additionalInfo: 'Material Exchange Format, estándar para emisoras de televisión y cine.'
  },
  {
    name: 'ProRes',
    ext: 'mov',
    mime: 'video/quicktime',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_PRO,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Alto ancho de banda. Puede causar latencia alta al intentar decodificar en computadores sin hardware dedicado.',
    additionalInfo: 'Codec de video profesional sin pérdida desarrollado por Apple.'
  },
  {
    name: 'DNxHD',
    ext: 'mxf',
    mime: 'application/mxf',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_PRO,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Optimizado para Avid Media Composer. No apto para reproducción directa en web.',
    additionalInfo: 'Digital Nonlinear Extensible High Definition desarrollado por Avid.'
  },
  {
    name: 'DNxHR',
    ext: 'mxf',
    mime: 'application/mxf',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_PRO,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Archivos gigantescos de resolución 4K o superior. Se recomienda convertir a MP4 comprimido.',
    additionalInfo: 'Evolución de DNxHD para resoluciones UHD y 4K.'
  },
  {
    name: 'CineForm',
    ext: 'avi',
    mime: 'video/x-msvideo',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_PRO,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Codec vectorial. Compatibilidad reducida fuera de suites de edición profesionales (Premiere/GoPro).',
    additionalInfo: 'Codec de adquisición y edición intermedia de alta velocidad.'
  },

  // ── Legacy & Special ──
  {
    name: 'VOB',
    ext: 'vob',
    mime: 'video/dvd',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm', 'mp3'],
    restrictions: 'Formato de discos DVD. Contiene pistas de datos multiplexadas. Requiere demultiplexor.',
    additionalInfo: 'Video Object, contenedor principal de películas en formato físico DVD.'
  },
  {
    name: 'TS (Transport Stream)',
    ext: 'ts',
    mime: 'video/mp2t',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Transport Stream utilizado para radiodifusión televisiva. Puede contener errores de pérdida de sincronización.',
    additionalInfo: 'MPEG-2 Transport Stream para flujos de datos continuos.'
  },
  {
    name: 'MTS',
    ext: 'mts',
    mime: 'video/mp2t',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato de grabación AVCHD de videocámaras domésticas. Se procesa igual que TS.',
    additionalInfo: 'Video de alta definición nativo de videocámaras Sony/Panasonic.'
  },
  {
    name: 'M2TS',
    ext: 'm2ts',
    mime: 'video/mp2t',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Mismas restricciones que MTS.',
    additionalInfo: 'Formato de video AVCHD en discos Blu-ray.'
  },
  {
    name: 'ASF',
    ext: 'asf',
    mime: 'video/x-ms-asf',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato antiguo de Microsoft. Generalmente se prefiere convertir a MP4 moderno.',
    additionalInfo: 'Advanced Systems Format para transmisiones de Windows Media.'
  },
  {
    name: 'OGV',
    ext: 'ogv',
    mime: 'video/ogg',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Soporte nativo limitado a navegadores Firefox y Chrome.',
    additionalInfo: 'Contenedor de video libre que utiliza los codecs Theora y Vorbis.'
  },
  {
    name: 'RM (RealMedia)',
    ext: 'rm',
    mime: 'application/vnd.rn-realmedia',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato obsoleto de RealNetworks. Difícil reproducción en sistemas modernos sin RealPlayer.',
    additionalInfo: 'Contenedor clásico de streaming de Internet de principios de los 2000.'
  },
  {
    name: 'RMVB',
    ext: 'rmvb',
    mime: 'application/vnd.rn-realmedia-vbr',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_LEGACY,
    compatibilities: ['mp4', 'webm'],
    restrictions: 'Formato obsoleto con tasa de bits variable. Mismas restricciones que RM.',
    additionalInfo: 'RealMedia Variable Bitrate para descargas de películas.'
  },

  // ── Streaming ──
  {
    name: 'HLS (M3U8)',
    ext: 'm3u8',
    mime: 'application/vnd.apple.mpegurl',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_STREAMING,
    compatibilities: ['mp4'],
    restrictions: 'Es una lista de reproducción que apunta a microsegmentos de video TS. No contiene video por sí mismo.',
    additionalInfo: 'HTTP Live Streaming desarrollado por Apple para streaming adaptativo.'
  },
  {
    name: 'DASH (MPD)',
    ext: 'mpd',
    mime: 'application/dash+xml',
    category: CATEGORY.VIDEO,
    subcategory: SUBCATEGORY.VID_STREAMING,
    compatibilities: ['mp4'],
    restrictions: 'Es un manifiesto XML de streaming. Requiere un cliente Dash para reproducirse.',
    additionalInfo: 'Dynamic Adaptive Streaming over HTTP, estándar de la industria abierta.'
  },
];

/* ══════════════════════════════════════════════════════════════
   AUDIO FORMATS
   ══════════════════════════════════════════════════════════════ */
export const AUDIO_FORMATS = [
  // ── Standard Compression ──
  {
    name: 'MP3',
    ext: 'mp3',
    mime: 'audio/mpeg',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'Compresión con pérdida. Elimina frecuencias inaudibles para el oído humano.',
    additionalInfo: 'El formato de audio comprimido más popular y compatible del mundo.'
  },
  {
    name: 'AAC',
    ext: 'aac',
    mime: 'audio/aac',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'Codificación más compleja. Soporte completo en ecosistemas Apple y Android modernos.',
    additionalInfo: 'Advanced Audio Coding, sucesor de MP3 con mejor calidad a igual tasa de bits.'
  },
  {
    name: 'M4A',
    ext: 'm4a',
    mime: 'audio/mp4',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'Equivalente a contenedores MP4 de solo audio. Se procesa nativamente en el navegador.',
    additionalInfo: 'Archivo de audio MPEG-4 común en dispositivos Apple.'
  },
  {
    name: 'OGG',
    ext: 'ogg',
    mime: 'audio/ogg',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'No soportado nativamente en navegadores Safari de Apple.',
    additionalInfo: 'Contenedor de audio abierto de alta calidad con codificación Vorbis.'
  },
  {
    name: 'OPUS',
    ext: 'opus',
    mime: 'audio/opus',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'Optimizado para voz interactiva de baja latencia. No todos los reproductores antiguos lo leen.',
    additionalInfo: 'Codec de audio libre y altamente versátil estandarizado por IETF.'
  },
  {
    name: 'WMA',
    ext: 'wma',
    mime: 'audio/x-ms-wma',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_STANDARD,
    compatibilities: AUD_COMPAT,
    restrictions: 'Requiere componentes de Windows Media Player para reproducción nativa.',
    additionalInfo: 'Windows Media Audio desarrollado por Microsoft.'
  },

  // ── Lossless / Hi-Fi ──
  {
    name: 'FLAC',
    ext: 'flac',
    mime: 'audio/flac',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Reduce el tamaño del archivo a aprox. 50-60% del original conservando fidelidad absoluta.',
    additionalInfo: 'Free Lossless Audio Codec, estándar de compresión de audio sin pérdida.'
  },
  {
    name: 'ALAC',
    ext: 'alac',
    mime: 'audio/alac',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Empaquetado en contenedor M4A. Soporte completo en dispositivos Apple.',
    additionalInfo: 'Apple Lossless Audio Codec para compresión sin pérdida en iTunes.'
  },
  {
    name: 'WAV',
    ext: 'wav',
    mime: 'audio/wav',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Archivos muy grandes sin compresión. La conversión a WAV genera audio PCM puro de 16 bits.',
    additionalInfo: 'Waveform Audio File Format nativo para almacenar audio PCM.'
  },
  {
    name: 'AIFF',
    ext: 'aiff',
    mime: 'audio/aiff',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Equivalente a WAV en peso y calidad. Se procesa convirtiendo los bytes big-endian.',
    additionalInfo: 'Audio Interchange File Format desarrollado por Apple.'
  },
  {
    name: 'APE',
    ext: 'ape',
    mime: 'audio/x-ape',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Tasa de compresión muy alta pero requiere un alto consumo de CPU para su decodificación.',
    additionalInfo: "Monkey's Audio, compresor de audio sin pérdida de alta relación."
  },
  {
    name: 'WEBM (Audio)',
    ext: 'webm',
    mime: 'audio/webm',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_LOSSLESS,
    compatibilities: AUD_COMPAT,
    restrictions: 'Ideal para grabaciones directas de micrófono en la web mediante Opus.',
    additionalInfo: 'Contenedor WebM conteniendo únicamente pistas de audio.'
  },

  // ── Professional ──
  {
    name: 'PCM',
    ext: 'pcm',
    mime: 'audio/L16',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_PRO,
    compatibilities: AUD_COMPAT,
    restrictions: 'Datos de audio digitalizados en bruto sin cabecera de archivo. Dificultad para reproducir en reproductores básicos.',
    additionalInfo: 'Modulación por impulsos codificados, señal digital de audio sin comprimir.'
  },
  {
    name: 'BWF',
    ext: 'bwf',
    mime: 'audio/wav',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_PRO,
    compatibilities: AUD_COMPAT,
    restrictions: 'Contiene metadatos de sincronización de código de tiempo. Se lee igual que un WAV.',
    additionalInfo: 'Broadcast Wave Format utilizado en estaciones de audio profesionales de cine/TV.'
  },
  {
    name: 'DSD (DSF)',
    ext: 'dsf',
    mime: 'audio/x-dsf',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_PRO,
    compatibilities: ['wav', 'flac'],
    restrictions: 'Formato Super Audio CD basado en 1 bit a altísima frecuencia. Requiere decodificador DSD a PCM.',
    additionalInfo: 'Direct Stream Digital utilizado en audiófilos con metadatos ID3.'
  },
  {
    name: 'DSD (DFF)',
    ext: 'dff',
    mime: 'audio/x-dff',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_PRO,
    compatibilities: ['wav', 'flac'],
    restrictions: 'Mismas restricciones que DSF pero carece de soporte estándar para metadatos ID3.',
    additionalInfo: 'Direct Stream Digital Interchange File Format.'
  },

  // ── Other ──
  {
    name: 'AMR',
    ext: 'amr',
    mime: 'audio/amr',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['mp3', 'wav'],
    restrictions: 'Diseñado exclusivamente para compresión de voz hablada. Calidad ínfima para música.',
    additionalInfo: 'Adaptive Multi-Rate codec utilizado en grabaciones de voz de móviles antiguos.'
  },
  {
    name: 'MIDI (Simple)',
    ext: 'mid',
    mime: 'audio/midi',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['wav', 'mp3'],
    restrictions: 'No contiene sonido real, solo notas musicales y comandos para un sintetizador.',
    additionalInfo: 'Musical Instrument Digital Interface para representar notas de instrumentos.'
  },
  {
    name: 'MIDI',
    ext: 'midi',
    mime: 'audio/midi',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['wav', 'mp3'],
    restrictions: 'Mismas restricciones que .mid.',
    additionalInfo: 'Extensión alternativa para archivos MIDI.'
  },
  {
    name: 'AU',
    ext: 'au',
    mime: 'audio/basic',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['wav', 'mp3'],
    restrictions: 'Formato muy antiguo con codificación ley-u o ley-A de 8 bits.',
    additionalInfo: 'Formato de audio desarrollado por Sun Microsystems popular en sistemas Unix.'
  },
  {
    name: 'VOC',
    ext: 'voc',
    mime: 'audio/x-voc',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['wav', 'mp3'],
    restrictions: 'Formato propietario obsoleto de Creative Labs (tarjetas Sound Blaster antiguas).',
    additionalInfo: 'Creative Voice file format.'
  },
  {
    name: 'CAF',
    ext: 'caf',
    mime: 'audio/x-caf',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['wav', 'mp3', 'm4a'],
    restrictions: 'Soporte nativo limitado fuera del sistema operativo Apple macOS/iOS.',
    additionalInfo: 'Core Audio Format diseñado por Apple para superar los límites de tamaño de WAV.'
  },
  {
    name: 'RealAudio',
    ext: 'ra',
    mime: 'audio/x-pn-realaudio',
    category: CATEGORY.AUDIO,
    subcategory: SUBCATEGORY.AUD_OTHER,
    compatibilities: ['mp3', 'wav'],
    restrictions: 'Formato de streaming descontinuado de RealNetworks.',
    additionalInfo: 'Audio en tiempo real popular en los inicios del internet.'
  },
];

/* ─── Helper: Get format details for a given file extension ─── */
export function getFormatConfig(ext) {
  if (!ext) return null;
  const lowerExt = ext.toLowerCase();
  let f = FILE_FORMATS.find(x => x.ext === lowerExt);
  if (!f) f = IMAGE_FORMATS.find(x => x.ext === lowerExt);
  if (!f) f = VIDEO_FORMATS.find(x => x.ext === lowerExt);
  if (!f) f = AUDIO_FORMATS.find(x => x.ext === lowerExt);
  return f || null;
}

/* ─── Helper: Get compatible output formats ─── */
export function getCompatibleFormats(ext) {
  const config = getFormatConfig(ext);
  if (!config) return [];
  
  const outputExts = config.compatibilities || [];
  const results = [];
  
  outputExts.forEach(outExt => {
    const outConfig = getFormatConfig(outExt);
    if (outConfig) {
      // Evitar duplicados por extensiones redundantes en la lista (ej. html vs htm, jpg vs jpeg)
      if (!results.some(r => r.ext === outConfig.ext)) {
        results.push(outConfig);
      }
    }
  });
  
  return results;
}

/* ─── Helper: Group formats by subcategory ─── */
export function groupBySubcategory(formats) {
  const groups = {};
  formats.forEach((f) => {
    if (!groups[f.subcategory]) {
      groups[f.subcategory] = [];
    }
    groups[f.subcategory].push(f);
  });
  return groups;
}

/* ─── Helper: Get native-only output formats from a list ─── */
export function getNativeOutputs(formats) {
  return formats;
}

/* ─── Helper: Build a unique-by-ext output list for <select> ─── */
export function getOutputOptions(formats) {
  const seen = new Set();
  return formats.filter((f) => {
    if (seen.has(f.ext)) return false;
    seen.add(f.ext);
    return true;
  }).map((f) => ({
    value: f.ext,
    label: `${f.name} (.${f.ext})`,
    mime: f.mime,
    subcategory: f.subcategory,
    restrictions: f.restrictions,
    additionalInfo: f.additionalInfo
  }));
}
