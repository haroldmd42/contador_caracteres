import { ROUTES } from './routes';

/**
 * Tool card definitions displayed on the Home page.
 * Each tool maps to a route, icon, color variant, and description.
 */
export const TOOLS = [
  {
    title: 'Contador de caracteres',
    description: 'Cuenta caracteres, palabras y analiza tus textos.',
    link: ROUTES.CHARACTER_COUNTER,
    icon: 'bi-textarea-t',
    color: 'blue',
  },
  {
    title: 'Biblioteca de archivos',
    description: 'Encuentra archivos de prueba con diferentes tamaños.',
    link: ROUTES.FILE_LIBRARY,
    icon: 'bi-folder',
    color: 'green',
  },
  {
    title: 'Encoder / Decoder',
    description: 'Codifica y decodifica texto fácilmente.',
    link: ROUTES.ENCODER,
    icon: 'bi-code-slash',
    color: 'red',
  },
  {
    title: 'Imagen → Base64',
    description: 'Convierte imágenes a Base64 y viceversa.',
    link: ROUTES.IMAGE_BASE64,
    icon: 'bi-image',
    color: 'orange',
  },
  {
    title: 'Redimensionar imágenes',
    description: 'Redimensiona tus imágenes de forma rápida y sencilla.',
    link: ROUTES.IMAGE_RESIZER,
    icon: 'bi-aspect-ratio',
    color: 'green',
  },
];
