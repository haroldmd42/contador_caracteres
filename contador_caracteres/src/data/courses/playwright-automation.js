/**
 * Curso Profesional: Automatización de Pruebas con Playwright (Desde Cero a Pro)
 * Manual Integral, Metodología Práctica, Configuración de Entornos y CLI.
 * 
 * Diseñado con pedagogía rigurosa para formación profesional de testers,
 * ingenieros de automatización (SDETs) y líderes de calidad de software.
 */

export const playwrightAutomationCourse = {
  id: 'playwright-automation',
  title: 'Automatización de Pruebas con Playwright (Desde Cero a Pro)',
  subtitle: 'Guía Integral y Práctica: Node.js, CLI, Selectores Resilientes, Page Object Model y CI/CD',
  shortDescription: 'Domina la automatización moderna de pruebas web desde cero con Playwright y TypeScript. Aprende la configuración hermética de entornos, gestión de navegadores (Chromium, Firefox, WebKit), depuración interactiva con UI Mode y ejecución en pipelines de CI/CD.',
  level: 'Desde Cero a Profesional',
  duration: '5 horas de contenido interactivo y ejercicios',
  badge: 'Playwright Automation',
  category: 'automatizacion',
  icon: 'bi-code-slash',
  accentColor: '#16a34a',
  bannerGradient: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0284c7 100%)',
  rating: 4.98,
  author: 'Comité de Automatización de Pruebas & QATOOLS Education',
  updatedAt: '2026',
  highlights: [
    'Configuración de entorno desde cero: Node.js (LTS v20+), npm y Playwright CLI',
    'Descarga y gestión de binarios herméticos de Chromium, Firefox y WebKit',
    'Diferencias clave entre entornos locales (Win/macOS) y Linux / Docker CI/CD',
    'Anatomía del proyecto: playwright.config.ts, workers y tests de ejemplo',
    'Herramientas de productividad: UI Mode, Inspector, Codegen y Reporte HTML',
    'Simulador oficial con 10 preguntas técnicas con justificación razonada'
  ],

  // Prólogo y Filosofía de Automatización Moderna
  prologue: {
    title: 'Prólogo: El Renacimiento de la Automatización Web con Playwright',
    lead: 'Durante más de una década, la automatización de pruebas de extremo a extremo (E2E) estuvo condicionada por pruebas inestables (flaky tests), esperas artificiales y configuraciones engorrosas de drivers externos.',
    body: 'Bajo la arquitectura tradicional basada en Selenium WebDriver, cada acción del script viajaba a través de múltiples capas de traducción HTTP hacia un binario intermedio (chromedriver, geckodriver) antes de llegar al navegador. Playwright, desarrollado por Microsoft a partir del equipo que creó Puppeteer en Google, transformó definitivamente este paradigma. Al comunicarse directamente con los navegadores a través del protocolo DevTools/CDP mediante sockets nativos bidireccionales, Playwright introduce auto-esperas inteligentes (Auto-waiting), aserciones que reintentan hasta verificar el estado esperado (Web-First Assertions) y aislamiento hermético entre pruebas (BrowserContexts). Probar aplicaciones web complejas dejó de ser una batalla contra la sincronización para convertirse en una disciplina de ingeniería confiable, veloz y escalable.',
    transitionPoints: [
      {
        title: 'De Drivers Externos a Comunicación Directa por Socket',
        desc: 'Playwright elimina la necesidad de instalar o actualizar manualmente chromedriver o geckodriver. Se comunica directamente con los motores del navegador a nivel de protocolo, reduciendo la latencia de ejecución a milisegundos.'
      },
      {
        title: 'Del "Flakiness" y Sleeps Artificiales al Auto-Waiting Nativo',
        desc: 'Las pruebas inestables suelen nacer de sleeps estáticos (`Thread.sleep` o `cy.wait`). Playwright comprueba automáticamente que los elementos sean visibles, estables, habilitados y no estén cubiertos antes de interactuar con ellos.'
      },
      {
        title: 'De Navegadores del Sistema a Binarios Herméticos Gestionados',
        desc: 'En lugar de depender de la versión de Chrome instalada en la computadora personal de cada tester, Playwright descarga y gestiona binarios específicos y reproducibles, garantizando paridad exacta entre máquinas locales y servidores de CI/CD.'
      }
    ]
  },

  // Resumen curricular modular (Roadmap modular desde cero)
  modulesSummary: [
    { number: 1, title: 'Módulo 1: Instalación, Configuración de Entorno y Playwright CLI' },
    { number: 2, title: 'Módulo 2: Selectores Resilientes, Localizadores y Aserciones Web-First' },
    { number: 3, title: 'Módulo 3: Flujos de Interacción, Manejo de Diálogos, Iframes y Pestañas' },
    { number: 4, title: 'Módulo 4: Arquitectura Page Object Model (POM) y Fixtures Personalizados' },
    { number: 5, title: 'Módulo 5: Intercepción de Red, Mocking de APIs y Gestión de Estados de Autenticación' },
    { number: 6, title: 'Módulo 6: Ejecución en Paralelo, Pipelines CI/CD con GitHub Actions y Trace Viewer' },
    { number: 7, title: 'Glosario Técnico de Términos de Automatización con Playwright (20 Términos)' },
    { number: 8, title: 'Banco de Evaluación Final: Simulador de Certificación Práctica (10 Preguntas Razonadas)' }
  ],

  // Módulos detallados
  modules: [
    {
      id: 'modulo-1',
      number: 1,
      title: 'Módulo 1: Instalación, Configuración de Entorno y Playwright CLI',
      shortTitle: '1. Instalación & CLI',
      duration: '50 min',
      icon: 'bi-terminal-fill',
      topics: [
        {
          id: '1-1-instalacion-nodejs-playwright-cli',
          title: '1.1 Instalación de Node.js y Playwright CLI',
          speechText: 'Módulo 1, Lección 1.1: Instalación de Node.js y Playwright CLI. Dominar la configuración de Node.js y Playwright CLI es el primer paso crítico para cualquier ingeniero de automatización frontend. Un entorno correctamente configurado previene errores de compatibilidad en entornos locales y pipelines de integración continua, asegurando que los navegadores headless y las herramientas de depuración funcionen sin fricciones desde el primer día. Playwright requiere Node.js versión 18, 20 o superior, recomendándose siempre la versión LTS más reciente. Mediante el comando oficial npm init playwright arroba latest, el asistente interactivo inicializa el proyecto, descarga los binarios herméticos de Chromium, Firefox y WebKit y genera la estructura base lista para ejecutar pruebas.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Por Qué es Crítica la Configuración del Entorno (Why This Matters)',
                body: 'Dominar la configuración de Node.js y Playwright CLI es el primer paso crítico para cualquier ingeniero de automatización frontend. Un entorno correctamente configurado previene errores de compatibilidad en entornos locales y pipelines de integración continua (CI/CD), asegurando que los navegadores headless y las herramientas de depuración funcionen sin fricciones desde el primer día.',
                impactQA: 'Un entorno de pruebas que dependa del navegador particular instalado en la computadora del desarrollador o de versiones incompatibles de Node.js genera el clásico problema de "funciona en mi máquina, pero falla en el servidor". Establecer un entorno hermético y reproducible desde la primera línea de código ahorra incontables horas de depuración en los pipelines de calidad.'
              },
              {
                subtitle: 'Requisitos del Sistema y Compatibilidad de Versiones (Core Concepts)',
                body: 'Playwright requiere una versión activa o con soporte a largo plazo (LTS) de Node.js (versión 18, 20 o superior). La compatibilidad del sistema operativo incluye distribuciones recientes de Windows 10+, macOS (x86_64 o Apple Silicon M1/M2/M3/M4) y Linux (Ubuntu LTS o Debian).',
                table: {
                  headers: ['Componente', 'Requisito Mínimo', 'Recomendación Práctica'],
                  rows: [
                    ['**Node.js**', 'Node 18+', 'Última versión LTS (v20 o v22)'],
                    ['**Gestor de paquetes**', 'npm v8+', 'npm, pnpm o yarn actualizados'],
                    ['**Arquitectura OS**', '64-bit', 'macOS (Apple Silicon/Intel), Linux x64, Win x64']
                  ]
                },
                quote: {
                  text: 'Playwright requires Node.js version 18 or above. We recommend using the current LTS version.',
                  author: 'Documentación Oficial de Playwright'
                },
                callout: {
                  type: 'tip',
                  icon: 'bi-lightbulb-fill',
                  title: 'Consejo Profesional de QA: Gestión de Versiones con NVM',
                  text: 'En equipos profesionales de ingeniería de pruebas se recomienda utilizar **NVM** (Node Version Manager) o **nvm-windows**. Esto permite cambiar de versión de Node.js al instante (`nvm use 20`) sin alterar la máquina del sistema y garantiza que todo el equipo trabaje exactamente bajo la misma especificación mediante un archivo `.nvmrc` en la raíz del proyecto.'
                }
              },
              {
                subtitle: 'Inicialización de Proyectos con el Asistente Interactivo',
                body: 'El comando oficial `npm init playwright@latest` pone en marcha un asistente interactivo que configura la estructura básica del proyecto, descarga los ejecutables de navegadores gestionados (Chromium, Firefox y WebKit) e instala dependencias de desarrollo.',
                cards: [
                  {
                    title: 'TypeScript o JavaScript',
                    badge: 'Lenguaje Base',
                    description: 'El CLI permite elegir el lenguaje base para el proyecto de pruebas.',
                    bullets: [
                      '**Estándar de facto:** TypeScript es el estándar predilecto en la comunidad de Playwright gracias a su autocompletado y tipado estático.',
                      '**Cero configuración:** Playwright compila y ejecuta TypeScript de manera transparente y nativa sin necesidad de configurar Webpack o Babel.'
                    ]
                  },
                  {
                    title: 'Directorio de Pruebas (tests/)',
                    badge: 'Estructura Modular',
                    description: 'Se configura una carpeta por defecto donde se ubicarán todas las suites de prueba.',
                    bullets: [
                      '**Convención:** Archivos nombrados con el patrón `*.spec.ts` o `*.test.ts`.',
                      '**Separación limpia:** Permite desacoplar código de infraestructura, utilitarios y casos de prueba funcionales.'
                    ]
                  },
                  {
                    title: 'Workflow de GitHub Actions',
                    badge: 'CI/CD Automatizado',
                    description: 'Permite generar automáticamente el archivo YAML para integración continua.',
                    bullets: [
                      '**Ubicación:** `.github/workflows/playwright.yml`.',
                      '**Pipeline listo:** Configura la descarga de dependencias, ejecución en modo headless y almacenamiento de reportes de ejecución ante fallos.'
                    ]
                  },
                  {
                    title: 'Descarga de Binarios Gestionados',
                    badge: 'Aislamiento Hermético',
                    description: 'Descarga Chromium, Firefox y WebKit en un directorio centralizado del sistema.',
                    bullets: [
                      '**Independencia:** Evita depender de navegadores instalados localmente por el usuario.',
                      '**Consistencia:** Asegura que todos los miembros del equipo ejecuten exactamente la misma versión del motor web.'
                    ]
                  }
                ]
              },
              {
                subtitle: 'Ejemplos Prácticos Paso a Paso (Worked Examples)',
                body: 'A continuación se presenta el procedimiento completo para preparar el entorno desde cero y verificar que la herramienta esté lista para ejecutar pruebas tanto en máquinas locales como en servidores de integración continua.',
                workedExamples: [
                  {
                    title: 'Example 1: Inicialización Completa de un Proyecto con Playwright',
                    badge: 'Proyecto Nuevo',
                    description: 'Procedimiento paso a paso para configurar tu entorno local y ejecutar tu primera suite de pruebas generada por Playwright.',
                    steps: [
                      {
                        stepNumber: 1,
                        title: 'Verificar la versión de Node.js y npm',
                        explanation: 'Abra una terminal y ejecute el comando para comprobar que Node.js esté instalado en versión 18 o superior:',
                        command: 'node -v\nnpm -v',
                        note: 'Si Node.js no está instalado o su versión es inferior a v18, descargue el instalador LTS oficial desde nodejs.org.'
                      },
                      {
                        stepNumber: 2,
                        title: 'Ejecutar el asistente interactivo de instalación',
                        explanation: 'Cree un directorio para su proyecto, sitúese en él y ejecute el inicializador oficial de Playwright:',
                        command: 'mkdir qa-playwright-suite\ncd qa-playwright-suite\nnpm init playwright@latest',
                        note: 'El comando descarga la última versión del scaffolding oficial mantenido por Microsoft sin requerir instalación global.'
                      },
                      {
                        stepNumber: 3,
                        title: 'Configurar las opciones del asistente en la terminal',
                        explanation: 'Responda a los prompts interactivos en la terminal conforme a las buenas prácticas de la industria:',
                        options: [
                          'Do you want to use TypeScript or JavaScript? -> Seleccione TypeScript (recomendado)',
                          'Where to put your end-to-end tests? -> Acepte la carpeta por defecto (tests)',
                          'Add a GitHub Actions workflow? -> Elija true (recomendado para CI/CD) o false',
                          'Install Playwright browsers (can be done manually via npx playwright install)? -> Seleccione Yes'
                        ],
                        note: 'Al elegir "Yes" en la instalación de navegadores, Playwright descargará automáticamente los binarios de Chromium, Firefox y WebKit.'
                      },
                      {
                        stepNumber: 4,
                        title: 'Validar la instalación ejecutando las pruebas de ejemplo',
                        explanation: 'Ejecute la suite de prueba que Playwright genera de forma predeterminada para verificar la correcta configuración:',
                        command: 'npx playwright test',
                        note: 'Por defecto, Playwright ejecuta las pruebas en modo headless utilizando múltiples workers en paralelo sobre Chromium, Firefox y WebKit.'
                      }
                    ]
                  },
                  {
                    title: 'Example 2: Instalación de Navegadores y Dependencias del Sistema en Linux / CI/CD',
                    badge: 'Linux & Docker CI/CD',
                    description: 'En entornos Linux, servidores Ubuntu, contenedores Docker o runners donde faltan librerías nativas del sistema operativo, Playwright proporciona comandos dedicados para resolver dependencias faltantes.',
                    steps: [
                      {
                        stepNumber: 1,
                        title: 'Instalar binarios de navegadores explícitamente',
                        explanation: 'Si no se descargaron durante la inicialización, si se clona un repositorio existente, o si solo se requiere un motor específico:',
                        command: 'npx playwright install',
                        note: 'Si deseas descargar únicamente un navegador (ej. solo Chromium) para ahorrar espacio y tiempo en CI: npx playwright install chromium'
                      },
                      {
                        stepNumber: 2,
                        title: 'Instalar dependencias del sistema operativo en Linux',
                        explanation: 'Instala librerías nativas del sistema necesarias para que los navegadores funcionen sin errores en distribuciones Linux:',
                        command: 'npx playwright install-deps',
                        note: 'Requiere permisos administrativos (sudo). Instala librerías como libnss3, libatk, libcups y fuentes del sistema requeridas por Chromium y WebKit.'
                      },
                      {
                        stepNumber: 3,
                        title: 'Comando combinado para pipelines de CI/CD',
                        explanation: 'Playwright permite unificar ambos pasos en una sola instrucción sumamente eficiente para contenedores Docker y runners:',
                        command: 'npx playwright install --with-deps',
                        note: 'Recomendado en Dockerfiles y scripts de GitHub Actions, GitLab CI, Jenkins o Azure DevOps.'
                      }
                    ]
                  }
                ]
              },
              {
                subtitle: 'Herramientas de Productividad y Comandos Esenciales del CLI (Complemento)',
                body: 'El CLI de Playwright no solo sirve para correr pruebas; incluye herramientas avanzadas de depuración visual e inspección que multiplican la velocidad de desarrollo del tester.',
                cards: [
                  {
                    title: 'Modo UI Interactivo (--ui)',
                    badge: 'Time-Travel Debugging',
                    description: 'Lanza una interfaz gráfica de depuración con explorador de pasos y consola en tiempo real.',
                    bullets: [
                      '**Comando:** `npx playwright test --ui`',
                      '**Beneficio:** Permite retroceder en el tiempo, inspeccionar el árbol del DOM en cada clic y ver capturas de pantalla instantáneas.'
                    ]
                  },
                  {
                    title: 'Ejecución Visible (--headed)',
                    badge: 'Inspección Visual',
                    description: 'Abre la ventana física del navegador para observar la interacción humana.',
                    bullets: [
                      '**Comando:** `npx playwright test --headed`',
                      '**Uso en QA:** Indispensable para depurar animaciones, flujos de autenticación o validaciones visuales complejas.'
                    ]
                  },
                  {
                    title: 'Filtrado por Navegador o Proyecto',
                    badge: 'Aislamiento de Pruebas',
                    description: 'Ejecuta únicamente el navegador que te interesa evaluar en un momento dado.',
                    bullets: [
                      '**Comando:** `npx playwright test --project=chromium`',
                      '**Variantes:** `--project=firefox` o `--project=webkit` para validar compatibilidad cross-browser puntual.'
                    ]
                  },
                  {
                    title: 'Visualizador de Reportes HTML',
                    badge: 'Evidencia Completa',
                    description: 'Abre el reporte HTML interactivo con trazas, videos y capturas automáticas.',
                    bullets: [
                      '**Comando:** `npx playwright show-report`',
                      '**Valor:** Ofrece gráficos de resultados, tiempos de ejecución y registro completo de errores para adjuntar a tickets de defectos.'
                    ]
                  }
                ],
                callout: {
                  type: 'warning',
                  icon: 'bi-shield-exclamation',
                  title: 'Solución a Error de Políticas en Windows PowerShell (Troubleshooting)',
                  text: 'En sistemas Windows, al intentar ejecutar comandos con `npx` o scripts de npm, puede aparecer el error: *File cannot be loaded because running scripts is disabled on this system*. Para solucionarlo, abra PowerShell como Administrador y ejecute: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.'
                }
              }
            ]
          }
        },
        {
          id: '1-2-anatomia-proyecto-configuracion',
          title: '1.2 Arquitectura del Proyecto y Configuración en playwright.config.ts',
          speechText: 'Lección 1.2: Arquitectura del Proyecto y Configuración en playwright.config.ts. El archivo playwright.config.ts es el cerebro de Playwright Test. Permite configurar de forma centralizada la ejecución de las pruebas, los navegadores, las URLs base, los reintentos, el paralelismo y la captura de artefactos como capturas de pantalla, videos y trazas. A través de la función auxiliar defineConfig se estructuran cuatro bloques fundamentales: la configuración global de la suite, el objeto use con opciones compartidas, el array projects con la matriz multi-navegador y el bloque webServer para levantar automáticamente la aplicación.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'El Cerebro de Playwright: Estructura General del Archivo',
                body: 'El archivo `playwright.config.ts` es el cerebro de Playwright Test. Permite configurar de forma centralizada la ejecución de las pruebas, los navegadores, las URLs base, los reintentos, el paralelismo y la captura de artefactos (capturas de pantalla, videos y trazas). Se exporta una configuración utilizando la función auxiliar `defineConfig` importada de `@playwright/test`:',
                impactQA: 'Tener una configuración centralizada, fuertemente tipada e inmutable garantiza que cualquier cambio en timeouts, reintentos o URLs base se aplique homogéneamente a toda la suite de pruebas, eliminando configuraciones dispersas en scripts individuales.',
                codeBlock: {
                  title: 'playwright.config.ts (Estructura Canónica Estándar)',
                  language: 'typescript',
                  description: 'Plantilla arquitectural recomendada con los 4 bloques esenciales de configuración.',
                  code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Configuración global de ejecución
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // 2. Opciones compartidas entre todos los proyectos
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // 3. Proyectos por navegador o dispositivo
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // 4. Servidor local de desarrollo (opcional)
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`
                }
              },
              {
                subtitle: '1. Configuración Global de la Suite',
                body: 'Este bloque gobierna los parámetros operativos, el paralelismo, los tiempos de espera y el formato del reporte de resultados para todas las pruebas de la suite:',
                cards: [
                  {
                    title: 'testDir & Timeouts',
                    badge: 'Rutas & Límites',
                    description: 'Establece la ubicación física de las pruebas y los umbrales máximos de espera.',
                    bullets: [
                      '**testDir:** Ruta relativa a la carpeta donde se ubican las pruebas (por defecto `./tests`).',
                      '**timeout:** Tiempo límite máximo por prueba individual en milisegundos (el valor por omisión es 30 000 ms o 30 segundos).',
                      '**expect.timeout:** Tiempo de espera para las aserciones web-first (`expect(locator).toBeVisible()`). Por defecto es 5 000 ms.'
                    ]
                  },
                  {
                    title: 'fullyParallel & forbidOnly',
                    badge: 'Control de Ejecución',
                    description: 'Optimiza la velocidad en paralelo y protege los pipelines contra descuidos humanos.',
                    bullets: [
                      '**fullyParallel:** Cuando es `true`, ejecuta todas las pruebas de todos los archivos en paralelo. Si es `false`, corre archivos en paralelo pero las pruebas dentro del mismo archivo de forma secuencial.',
                      '**forbidOnly:** Si se deja un `test.only(...)` en el código, la ejecución falla. Se activa con `!!process.env.CI` para evitar olvidar filtros de depuración en ramas compartidas.'
                    ]
                  },
                  {
                    title: 'retries & workers',
                    badge: 'Concurrencia & Resiliencia',
                    description: 'Manejo de hilos paralelos y reintentos ante fallos transitorios.',
                    bullets: [
                      '**retries:** Número de veces que se reintentará una prueba en caso de fallo. Práctica recomendada: `0` en local y `2` en CI para mitigar fallos intermitentes (flaky tests).',
                      '**workers:** Cantidad de hilos o procesos paralelos. En local usa por defecto el 50% de los núcleos de la CPU; en CI se suele limitar a `1` o `2` para evitar sobrecargar la memoria del servidor.'
                    ]
                  },
                  {
                    title: 'reporter (Reportes de Resultados)',
                    badge: 'Métricas & Evidencias',
                    description: 'Formato de entrega de los resultados de ejecución.',
                    bullets: [
                      '**Formatos disponibles:** Cadena simple (`"html"`, `"list"`, `"dot"`, `"json"`, `"junit"`).',
                      '**Multi-reporter:** Permite generar simultáneamente reportes HTML para humanos y XML/JUnit para herramientas de integración continua.'
                    ]
                  }
                ],
                codeBlock: {
                  title: 'Configuración de Múltiples Reporteros',
                  language: 'typescript',
                  description: 'Genera simultáneamente el reporte visual HTML y el XML para integración con Azure DevOps, Jira o GitHub Actions.',
                  code: `reporter: [
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'results.xml' }]
]`
                }
              },
              {
                subtitle: '2. El Objeto use (Opciones Compartidas)',
                body: 'Define las propiedades por omisión para el contexto (`BrowserContext`) y la página que reciben todos los casos de prueba:',
                cards: [
                  {
                    title: 'Navegación y Entorno',
                    badge: 'Parámetros Base',
                    description: 'Directivas de conexión y renderizado de la ventana.',
                    bullets: [
                      '**baseURL:** Dirección web principal de la aplicación bajo prueba. Permite usar rutas relativas en los tests (ej. `await page.goto("/login")`).',
                      '**headless:** Indica si el navegador se ejecuta en modo invisible (`true`, por defecto) o con interfaz gráfica abierta (`false`).',
                      '**viewport:** Resolución inicial de la ventana (ej. `{ width: 1280, height: 720 }`).',
                      '**actionTimeout:** Tiempo máximo de espera para acciones atómicas como `page.click()` o `page.fill()`.'
                    ]
                  },
                  {
                    title: 'Artefactos de Depuración',
                    badge: 'Evidencia Automática',
                    description: 'Generación condicional de pruebas forenses en caso de fallo.',
                    bullets: [
                      '**trace:** Controla el visor de trazas (Trace Viewer). Opciones: `"off"`, `"on"`, `"retain-on-failure"`, `"on-first-retry"`.',
                      '**screenshot:** Capturas automáticas de pantalla. Opciones: `"off"`, `"on"`, `"only-on-failure"`.',
                      '**video:** Grabación en video de la ejecución. Opciones: `"off"`, `"on"`, `"retain-on-failure"`.'
                    ]
                  }
                ],
                callout: {
                  type: 'tip',
                  icon: 'bi-lightbulb-fill',
                  title: 'Mejor Práctica de Almacenamiento: trace: "on-first-retry"',
                  text: 'Configurar `trace: "on-first-retry"` es el estándar recomendado para CI/CD: no genera archivos de traza cuando las pruebas pasan a la primera (ahorrando gigabytes de espacio y tiempo de red), pero si una prueba falla, activa automáticamente la grabación detallada en el reintento para que el equipo pueda depurar el error en el Trace Viewer.'
                }
              },
              {
                subtitle: '3. El Array projects (Matriz de Ejecución Multi-Navegador)',
                body: 'Permite segmentar las pruebas para diferentes motores de renderizado, resoluciones o configuraciones de dispositivo:',
                cards: [
                  {
                    title: 'Emulación mediante devices',
                    badge: 'Perfiles Oficiales',
                    description: 'Playwright incluye un catálogo exhaustivo de dispositivos reales preconfigurados.',
                    bullets: [
                      '**Dispositivos soportados:** `Desktop Chrome`, `Desktop Firefox`, `Desktop Safari`, `iPhone 13`, `Pixel 7`, `iPad Pro`, etc.',
                      '**Capacidades emuladas:** Aplica automáticamente el tamaño de viewport, user-agent exacto, densidad de píxeles (DPI) y capacidades touch táctiles.'
                    ]
                  },
                  {
                    title: 'Filtros y Dependencias de Proyectos',
                    badge: 'Orquestación Avanzada',
                    description: 'Permite desacoplar suites y gestionar flujos de autenticación previa.',
                    bullets: [
                      '**Filtros por proyecto:** Cada proyecto puede definir su propio `testMatch` o `testIgnore` (ej. separar pruebas de API backend de pruebas visuales E2E).',
                      '**Dependencias entre proyectos:** Utilizado comúnmente para autenticación previa (Global Setup) mediante la propiedad `dependencies`.'
                    ]
                  }
                ],
                codeBlock: {
                  title: 'Proyectos con Flujo de Autenticación Previa (Global Setup)',
                  language: 'typescript',
                  description: 'El proyecto "setup" inicia sesión una sola vez y guarda las cookies en user.json; el proyecto "chromium" arranca ya autenticado.',
                  code: `projects: [
  { name: 'setup', testMatch: /.*\\.setup\\.ts/ },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json', // Sesión reutilizada
    },
    dependencies: ['setup'],
  },
]`
                }
              },
              {
                subtitle: '4. webServer (Levantamiento Automático de la App)',
                body: 'Evita tener que iniciar manualmente la aplicación en otra pestaña de la terminal antes de correr las pruebas, orquestando el ciclo de vida del servidor web local:',
                cards: [
                  {
                    title: 'command & url',
                    badge: 'Arranque Automático',
                    description: 'Inicia el servidor local y aguarda a que esté listo para recibir peticiones.',
                    bullets: [
                      '**command:** Comando shell que inicia el servidor local de desarrollo (ej. `npm run dev` o `npm run start`).',
                      '**url:** Playwright esperará a que esta URL responda con un código HTTP 200 antes de lanzar la suite de pruebas.',
                      '**timeout:** Tiempo máximo de espera para que el servidor local compile y esté listo (por omisión 120 000 ms o 2 minutos).'
                    ]
                  },
                  {
                    title: 'reuseExistingServer',
                    badge: 'Optimización en Desarrollo',
                    description: 'Evita colisiones de puertos y aceleración del ciclo de trabajo local.',
                    bullets: [
                      '**Comportamiento con !process.env.CI:** Si el servidor de desarrollo ya está corriendo localmente en ese puerto, Playwright no intentará levantarlo de nuevo, ahorrando valiosos segundos.',
                      '**En CI/CD:** Al estar en un runner limpio donde nada corre previamente, Playwright levantará el servidor desde cero y lo apagará al finalizar las pruebas.'
                    ]
                  }
                ],
                callout: {
                  type: 'info',
                  icon: 'bi-rocket-takeoff-fill',
                  title: 'Beneficio Clave para el Flujo de Trabajo',
                  text: 'El bloque `webServer` elimina el error clásico donde un tester o pipeline ejecuta `npx playwright test` y todas las pruebas fallan de inmediato porque olvidaron ejecutar `npm run dev` en otra terminal.'
                }
              }
            ]
          }
        }
      ]
    }
  ],

  // Glosario Técnico de Términos de Playwright
  glossary: [
    {
      term: 'Playwright CLI',
      enTerm: 'Playwright Command Line Interface',
      definition: 'Herramienta de línea de comandos integrada que permite inicializar proyectos, ejecutar suites de pruebas, instalar binarios de navegadores y depurar código.',
      category: 'Herramientas'
    },
    {
      term: 'Modo Headless',
      enTerm: 'Headless Mode',
      definition: 'Modo de ejecución donde el navegador opera en segundo plano sin desplegar una interfaz gráfica visible, optimizando velocidad y consumo de recursos.',
      category: 'Ejecución'
    },
    {
      term: 'Modo Headed',
      enTerm: 'Headed Mode',
      definition: 'Ejecución de pruebas donde la ventana del navegador es visible en pantalla, ideal para depuración y observación de interacciones en tiempo real.',
      category: 'Ejecución'
    },
    {
      term: 'Chromium',
      enTerm: 'Chromium',
      definition: 'Motor de navegación web de código abierto que sirve de base para Google Chrome, Microsoft Edge, Opera y Brave.',
      category: 'Navegadores'
    },
    {
      term: 'WebKit',
      enTerm: 'WebKit',
      definition: 'Motor de renderizado de código abierto desarrollado por Apple, utilizado en Safari en macOS e iOS.',
      category: 'Navegadores'
    },
    {
      term: 'Firefox / Gecko',
      enTerm: 'Firefox / Gecko',
      definition: 'Motor de navegación de Mozilla Foundation soportado de forma nativa por Playwright mediante parches optimizados.',
      category: 'Navegadores'
    },
    {
      term: 'Binarios Herméticos',
      enTerm: 'Hermetic Managed Browsers',
      definition: 'Compilaciones de navegadores descargadas y gestionadas directamente por Playwright en una carpeta de caché centralizada para garantizar paridad absoluta.',
      category: 'Arquitectura'
    },
    {
      term: 'playwright.config.ts',
      enTerm: 'Playwright Configuration File',
      definition: 'Archivo central donde se configuran timeouts, navegadores, reporteros, trabajadores paralelos y opciones globales de ejecución.',
      category: 'Configuración'
    },
    {
      term: 'Time-Travel UI Mode',
      enTerm: 'UI Mode (--ui)',
      definition: 'Entorno interactivo gráfico de Playwright que permite pausar, rebobinar y explorar paso a paso el estado del DOM y de la red.',
      category: 'Depuración'
    },
    {
      term: 'Trace Viewer',
      enTerm: 'Trace Viewer',
      definition: 'Herramienta visual que graba capturas del DOM, llamadas de red, consola y acciones de cada prueba para inspección post-ejecución.',
      category: 'Depuración'
    },
    {
      term: 'Codegen',
      enTerm: 'Test Code Generator',
      definition: 'Herramienta que graba las interacciones del usuario en el navegador y genera automáticamente código de prueba en TypeScript o JavaScript.',
      category: 'Herramientas'
    },
    {
      term: 'Auto-Waiting',
      enTerm: 'Auto-Waiting',
      definition: 'Mecanismo nativo de Playwright que verifica automáticamente que un elemento sea visible, estable, clickeable y habilitado antes de realizar cualquier acción.',
      category: 'Automatización'
    },
    {
      term: 'Web-First Assertions',
      enTerm: 'Web-First Assertions',
      definition: 'Aserciones de Playwright (`expect(locator).toBeVisible()`) que reintentan continuamente hasta que se cumple la condición o expira el timeout.',
      category: 'Aserciones'
    },
    {
      term: 'Workers',
      enTerm: 'Worker Processes',
      definition: 'Procesos de Node.js independientes que ejecutan pruebas en paralelo, compartiendo cero estado entre sí para evitar contaminación.',
      category: 'Ejecución'
    },
    {
      term: 'install-deps',
      enTerm: 'Install OS Dependencies',
      definition: 'Comando de Playwright que instala las dependencias y librerías nativas del sistema operativo necesarias para correr navegadores en distribuciones Linux.',
      category: 'CLI'
    },
    {
      term: 'BrowserContext',
      enTerm: 'Browser Context',
      definition: 'Sesión aislada dentro de una instancia de navegador, equivalente a una ventana de incógnito completamente independiente de cookies y almacenamiento.',
      category: 'Arquitectura'
    },
    {
      term: 'Fixture',
      enTerm: 'Test Fixture',
      definition: 'Mecanismo para preparar el entorno de prueba (como `page`, `browser`, `context`) e inyectar dependencias de forma modular y reutilizable.',
      category: 'Arquitectura'
    },
    {
      term: 'Page Object Model (POM)',
      enTerm: 'Page Object Model',
      definition: 'Patrón de diseño que encapsula la estructura y acciones de una página o componente en una clase para mejorar la mantenibilidad de la suite.',
      category: 'Patrones de Diseño'
    },
    {
      term: 'BaseURL',
      enTerm: 'Base URL',
      definition: 'URL base configurada en playwright.config.ts que permite usar rutas relativas (`page.goto("/login")`) en los casos de prueba.',
      category: 'Configuración'
    },
    {
      term: 'NVM',
      enTerm: 'Node Version Manager',
      definition: 'Herramienta de gestión de versiones de Node.js que permite alternar fácilmente entre versiones LTS y de desarrollo según los requisitos del proyecto.',
      category: 'Entorno'
    }
  ],

  // Banco de Evaluación Final: Simulador de Playwright CLI y Entornos (10 Preguntas Razonadas)
  exam: [
    {
      id: 1,
      questionNumber: 1,
      question: '¿Cuál es la versión mínima de Node.js requerida oficialmente por Playwright y cuál es la recomendación estándar para proyectos profesionales de automatización?',
      options: [
        { key: 'A', text: 'Node.js 14; usar cualquier versión disponible en el sistema.' },
        { key: 'B', text: 'Node.js 16; usar la versión "Current" más experimental.' },
        { key: 'C', text: 'Node.js 18 o superior; usar la versión activa con soporte a largo plazo (LTS, como v20 o v22).' },
        { key: 'D', text: 'Node.js 24 exclusivamente; no se admiten versiones anteriores.' }
      ],
      correctAnswer: 'C',
      justification: 'La documentación oficial de Playwright exige Node.js versión 18 o superior, recomendando enfáticamente el uso de versiones LTS (Long Term Support) para garantizar máxima estabilidad y compatibilidad con paquetes.'
    },
    {
      id: 2,
      questionNumber: 2,
      question: 'Al inicializar un proyecto con el comando `npm init playwright@latest`, ¿cuál es el lenguaje base recomendado por la industria y cuál es la ventaja de utilizarlo en Playwright?',
      options: [
        { key: 'A', text: 'Python; porque es el único que soporta pruebas de API.' },
        { key: 'B', text: 'TypeScript; porque ofrece tipado estático, autocompletado y Playwright lo compila de forma nativa sin configuración adicional.' },
        { key: 'C', text: 'Java; porque requiere compilar archivos .class antes de cada ejecución.' },
        { key: 'D', text: 'Ruby; para mantener compatibilidad con herramientas antiguas.' }
      ],
      correctAnswer: 'B',
      justification: 'TypeScript es el estándar de facto en Playwright. Proporciona autocompletado avanzado para selectores y aserciones, y no requiere herramientas de transpilación adicionales porque Playwright lo procesa internamente.'
    },
    {
      id: 3,
      questionNumber: 3,
      question: 'Un ingeniero clona un repositorio de pruebas en un nuevo equipo y al ejecutar `npx playwright test` obtiene un error indicando que los ejecutables de los navegadores no fueron encontrados. ¿Qué comando resuelve este problema de inmediato?',
      options: [
        { key: 'A', text: 'npm run start' },
        { key: 'B', text: 'npx playwright install' },
        { key: 'C', text: 'git pull origin main' },
        { key: 'D', text: 'npm uninstall playwright' }
      ],
      correctAnswer: 'B',
      justification: 'El comando `npx playwright install` descarga explícitamente los binarios gestionados de Chromium, Firefox y WebKit en el directorio central de caché de Playwright sin necesidad de reinstalar paquetes.'
    },
    {
      id: 4,
      questionNumber: 4,
      question: 'Durante la ejecución de un pipeline de CI/CD en un servidor Ubuntu Linux o contenedor Docker, los navegadores fallan al iniciar debido a librerías nativas del sistema faltantes (.so). ¿Cuál es la instrucción diseñada por Playwright para resolver automáticamente estas dependencias del sistema operativo?',
      options: [
        { key: 'A', text: 'npm install --save-dev' },
        { key: 'B', text: 'npx playwright install-deps' },
        { key: 'C', text: 'node server.js' },
        { key: 'D', text: 'chmod 777 tests/' }
      ],
      correctAnswer: 'B',
      justification: 'El comando `npx playwright install-deps` (o la combinación `npx playwright install --with-deps`) instala las librerías nativas compartidas del sistema operativo Linux (como libnss3, libatk y fuentes) necesarias para renderizar los navegadores.'
    },
    {
      id: 5,
      questionNumber: 5,
      question: '¿Cuál es la diferencia fundamental entre el modo Headless y el modo Headed en la ejecución de pruebas de Playwright?',
      options: [
        { key: 'A', text: 'Headless se ejecuta únicamente en navegadores móviles; Headed solo en navegadores de escritorio.' },
        { key: 'B', text: 'Headless ejecuta el navegador en segundo plano sin ventana gráfica (ideal para CI/CD); Headed abre la ventana visual del navegador para inspección.' },
        { key: 'C', text: 'Headless no permite tomar capturas de pantalla; Headed sí lo permite.' },
        { key: 'D', text: 'Headless solo funciona con JavaScript; Headed solo con TypeScript.' }
      ],
      correctAnswer: 'B',
      justification: 'El modo Headless prescinde de la ventana gráfica para maximizar la velocidad y ahorrar memoria (ideal en pipelines de CI/CD), mientras que el modo Headed muestra la interfaz visual para facilitar la depuración local.'
    },
    {
      id: 6,
      questionNumber: 6,
      question: '¿Qué comando del CLI de Playwright permite abrir el entorno gráfico de depuración interactiva con Time-Travel, inspección del árbol DOM en cada paso y consola en vivo?',
      options: [
        { key: 'A', text: 'npx playwright test --ui' },
        { key: 'B', text: 'npx playwright run --debug-console' },
        { key: 'C', text: 'npm run test:prod' },
        { key: 'D', text: 'npx playwright inspect-only' }
      ],
      correctAnswer: 'A',
      justification: 'El comando `npx playwright test --ui` inicia el modo UI interactivo de Playwright, proporcionando una interfaz rica con exploración de snapshots en el tiempo (Time-Travel), vista de red y consola en tiempo real.'
    },
    {
      id: 7,
      questionNumber: 7,
      question: '¿Dónde almacena Playwright por defecto los binarios de los navegadores gestionados en un sistema operativo Windows?',
      options: [
        { key: 'A', text: 'C:\\Archivos de programa\\Google\\Chrome\\Application' },
        { key: 'B', text: '%USERPROFILE%\\AppData\\Local\\ms-playwright' },
        { key: 'C', text: 'C:\\Windows\\System32\\drivers' },
        { key: 'D', text: 'Dentro de la carpeta node_modules de cada proyecto individualmente' }
      ],
      correctAnswer: 'B',
      justification: 'Playwright guarda los navegadores herméticos de forma compartida en `%USERPROFILE%\\AppData\\Local\\ms-playwright` (en Windows) o `~/.cache/ms-playwright` (en Linux), evitando duplicar gigabytes de descarga en cada proyecto.'
    },
    {
      id: 8,
      questionNumber: 8,
      question: 'En un entorno Windows, al intentar ejecutar comandos con `npx` en PowerShell aparece el error indicando que la ejecución de scripts está deshabilitada en el sistema. ¿Cuál es el procedimiento técnico correcto para autorizar la ejecución?',
      options: [
        { key: 'A', text: 'Desinstalar Node.js y reinstalarlo en el disco D:' },
        { key: 'B', text: 'Ejecutar: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned' },
        { key: 'C', text: 'Borrar el archivo package.json y volver a crearlo' },
        { key: 'D', text: 'Desactivar la conexión a Internet' }
      ],
      correctAnswer: 'B',
      justification: 'Windows PowerShell restringe por defecto la ejecución de scripts sin firmar. Configurar la política `RemoteSigned` en el ámbito `CurrentUser` autoriza la ejecución segura de scripts locales de herramientas de desarrollo sin comprometer la seguridad global del equipo.'
    },
    {
      id: 9,
      questionNumber: 9,
      question: '¿Qué herramienta oficial incluida en el CLI de Playwright permite interactuar manualmente con una página web y grabar el código de prueba en tiempo real?',
      options: [
        { key: 'A', text: 'npx playwright record-session' },
        { key: 'B', text: 'npx playwright codegen <url>' },
        { key: 'C', text: 'npx playwright generate-tests' },
        { key: 'D', text: 'npm test --record' }
      ],
      correctAnswer: 'B',
      justification: 'El comando `npx playwright codegen <url>` abre el generador de código de Playwright, capturando clics, entradas de texto y navegaciones para convertirlos al instante en código de prueba limpio con selectores resilientes.'
    },
    {
      id: 10,
      questionNumber: 10,
      question: 'Una vez finalizada una corrida de pruebas en Playwright, ¿qué comando del CLI abre un servidor local con el reporte HTML interactivo completo que incluye tiempos, pasos y evidencias de fallo?',
      options: [
        { key: 'A', text: 'npx playwright show-report' },
        { key: 'B', text: 'npm run view-results' },
        { key: 'C', text: 'npx playwright open-dashboard' },
        { key: 'D', text: 'node view-report.js' }
      ],
      correctAnswer: 'A',
      justification: 'El comando `npx playwright show-report` inicia un servidor web local y abre en el navegador el reporte HTML enriquecido generado por el reporter oficial de Playwright, con filtros por estado, navegador y trazas adjuntas.'
    }
  ]
};
