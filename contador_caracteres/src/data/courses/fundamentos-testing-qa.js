/**
 * Curso Completo y Avanzado: Fundamentos de Testing y Aseguramiento de Calidad
 * Contenido exhaustivo alineado al estándar internacional ISTQB Foundation Level (CTFL 4.0).
 * 
 * Diseñado para estudiantes, testers junior y profesionales que buscan consolidar
 * su base técnica y metodológica con pedagogía rigurosa y simulacros oficiales.
 */

export const fundamentosTestingCourse = {
  id: 'fundamentos-testing-qa',
  title: 'Fundamentos de Testing y Aseguramiento de Calidad',
  subtitle: 'Contenido exhaustivo alineado al estándar ISTQB Foundation Level (CTFL 4.0)',
  shortDescription: 'Domina los conceptos nucleares del testing: diferencia entre QA, QC y Pruebas, interioriza los 7 principios universales, aplica niveles y tipos de prueba, diseña casos con técnicas de caja negra y blanca, gestiona defectos con trazabilidad y selecciona herramientas de automatización modernas.',
  level: 'Certificación Oficial & Fundamentos',
  duration: '6 horas de contenido práctico y simulacros',
  badge: 'ISTQB® CTFL 4.0',
  category: 'fundamentos',
  icon: 'bi-patch-check-fill',
  accentColor: '#0284c7',
  bannerGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
  rating: 4.98,
  author: 'Comité Académico ISTQB & QATOOLS Education',
  updatedAt: '2026',
  highlights: [
    'QA vs QC vs Testing: Enfoque proactivo vs reactivo',
    'Los 7 Principios Fundamentales del Testing con casos reales',
    'Pirámide de pruebas: Unitarias, Integración, Sistema, UAT',
    'Caja Negra: Partición de Equivalencia y Valores Límite',
    'Gestión del defecto: Azure DevOps, Jira y sintaxis Gherkin',
    'Ecosistema: Selenium vs Cypress vs Playwright y pruebas de API',
    '10 preguntas tipo examen oficial con razonamiento técnico'
  ],

  // Prólogo y Filosofía de Calidad
  prologue: {
    title: 'Prólogo: La Esencia del Aseguramiento de Calidad en el Software Moderno',
    lead: 'En una sociedad digital donde infraestructuras críticas, transacciones bancarias y vidas humanas dependen del código, la calidad no es un añadido superficial: es el pilar de la confianza.',
    body: 'Durante años, el rol del analista de pruebas fue reducido erróneamente a un "filtro tardío" al final de la cascada de desarrollo. El estándar ISTQB Foundation Level (CTFL 4.0) transforma esta perspectiva: probar software es una disciplina de ingeniería rigurosa, orientada a la prevención temprana de defectos (Shift-Left), la optimización matemática de coberturas y la comunicación empática dentro de equipos multidisciplinarios ágiles.',
    transitionPoints: [
      {
        title: 'De la Corrección Tardía a la Prevención Proactiva (Shift-Left)',
        desc: 'El costo de subsanar un defecto descubierto en producción puede ser hasta 100 veces superior al de corregirlo durante la fase de requerimientos. QA interviene desde el día cero para impedir que los fallos nazcan.'
      },
      {
        title: 'Del Ensayo y Error a Técnicas Formales de Diseño',
        desc: 'El testing exhaustivo es físicamente imposible. Técnicas como la Partición de Equivalencia y el Análisis de Valores Límite permiten maximizar la detección de fallos con el menor número de casos de prueba posible.'
      },
      {
        title: 'De la Confrontación a la Calidad Compartida',
        desc: 'Un buen tester combina curiosidad destructiva para explorar fallos con empatía constructiva para comunicar hallazgos, promoviendo una cultura de responsabilidad colectiva por la calidad del producto.'
      }
    ]
  },

  // Resumen curricular de módulos
  modulesSummary: [
    { number: 1, title: 'Fundamentos de las Pruebas de Software (QA vs QC, 7 Principios y Psicología)' },
    { number: 2, title: 'Pruebas a lo Largo del Ciclo de Vida (SDLC, Pirámide de Niveles y Tipos de Prueba)' },
    { number: 3, title: 'Pruebas Estáticas (Análisis sin Ejecución, Walkthroughs e Inspecciones)' },
    { number: 4, title: 'Técnicas de Análisis y Diseño (Caja Negra, Caja Blanca y Pruebas Exploratorias)' },
    { number: 5, title: 'Gestión de Pruebas y Reporte de Defectos (Criterios, Jira/Azure DevOps, Gherkin y Ciclo del Bug)' },
    { number: 6, title: 'Ecosistema de Herramientas y Automatización (Selenium vs Cypress vs Playwright y APIs)' },
    { number: 7, title: 'Glosario Técnico de Términos ISTQB® (25 Términos Esenciales)' },
    { number: 8, title: 'Simulador de Certificación Oficial ISTQB® (10 Preguntas Razonadas con Justificación)' }
  ],

  // Módulos detallados del curso
  modules: [
    {
      id: 'modulo-1',
      number: 1,
      title: 'Módulo 1: Fundamentos de las Pruebas de Software',
      shortTitle: '1. Fundamentos & Principios',
      duration: '50 min',
      icon: 'bi-shield-check',
      topics: [
        {
          id: '1-1-diferencia-qa-qc-testing',
          title: '1.1 La diferencia esencial entre QA, QC y Testing',
          speechText: 'Módulo 1, Lección 1.1: La diferencia esencial entre QA, QC y Testing. En la ingeniería de software existe una confusión habitual entre estos tres conceptos. El Aseguramiento de la Calidad, o QA, abarca todo el proceso de desarrollo; es una actividad proactiva orientada al proceso cuyo fin es definir metodologías, estándares y auditorías para prevenir que los defectos ocurran. Por otro lado, el Control de Calidad y el Testing son actividades reactivas orientadas al producto. El Testing es el acto sistemático de ejecutar el software para detectar discrepancias entre el comportamiento esperado y el comportamiento real, actuando como la última línea de defensa antes de que el software llegue a los usuarios.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Desmitificando la Tríada de la Calidad',
                body: 'En muchas empresas se utiliza el término "QA" de manera intercambiable con "tester" o "control de calidad". Sin embargo, según el estándar internacional ISTQB® CTFL 4.0, cada uno cumple una función estratégica distinta y complementaria.',
                impactQA: 'Si un equipo solo ejecuta pruebas al final del desarrollo sin mejorar los procesos de especificación, cometerá los mismos errores ciclo tras ciclo. La madurez de un equipo de calidad se mide por su capacidad de transicionar de un testing puramente reactivo hacia un aseguramiento integral de calidad.'
              },
              {
                subtitle: 'Comparativa Estructural: QA vs QC vs Testing',
                cards: [
                  {
                    title: 'Aseguramiento de la Calidad (QA)',
                    badge: 'Proactivo & Proceso',
                    description: 'Enfoque integral en el proceso de desarrollo para asegurar que los métodos y estándares eviten la introducción de fallos.',
                    bullets: [
                      '**Orientación:** Enfocado en el proceso de ingeniería y metodologías de trabajo.',
                      '**Naturaleza:** Proactiva (previene que el error ocurra en primer lugar).',
                      '**Metáfora:** El diseño de las reglas de seguridad, señalizaciones y protocolos de una fábrica moderna.',
                      '**Actividades:** Auditorías de procesos, definición de estándares de codificación, mejora continua y retrospectivas.'
                    ]
                  },
                  {
                    title: 'Control de Calidad (QC)',
                    badge: 'Reactivo & Producto',
                    description: 'Conjunto de actividades orientadas a verificar si el artefacto o producto final cumple con los requisitos especificados.',
                    bullets: [
                      '**Orientación:** Enfocado en el producto terminado o entregable intermedio.',
                      '**Naturaleza:** Reactiva (detecta defectos una vez que el software ha sido construido).',
                      '**Metáfora:** La inspección visual y técnica en la línea de ensamble para separar piezas defectuosas.',
                      '**Actividades:** Revisiones de entregables, verificación de criterios de aceptación y aprobación de builds.'
                    ]
                  },
                  {
                    title: 'Pruebas de Software (Testing)',
                    badge: 'Ejecución & Evidencia',
                    description: 'El acto empírico y sistemático de diseñar y ejecutar casos de prueba para medir la calidad real del sistema.',
                    bullets: [
                      '**Orientación:** Ejecución técnica directa sobre el sistema bajo prueba (SUT).',
                      '**Objetivo principal:** Hallar discrepancias entre el resultado esperado y el resultado real (identificar defectos).',
                      '**Metáfora:** Someter un automóvil a pruebas de choque, aceleración y frenado para certificar su seguridad real.',
                      '**Actividades:** Análisis de requerimientos, diseño de casos de prueba, ejecución manual/automatizada y reporte de bugs.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '1-2-los-7-principios-fundamentales',
          title: '1.2 Los 7 Principios Fundamentales del Testing',
          speechText: 'Lección 1.2: Los 7 Principios Fundamentales del Testing. Para comprender el testing con madurez profesional, es indispensable interiorizar los siete principios universales del estándar ISTQB. Primero: el testing muestra la presencia de defectos, no su ausencia. Segundo: el testing exhaustivo es imposible; debemos usar análisis de riesgos. Tercero: el testing temprano ahorra tiempo y dinero, conocido como enfoque Shift-Left. Cuarto: agrupamiento de defectos o Principio de Pareto, donde el ochenta por ciento de los errores se ubica en el veinte por ciento de los módulos. Quinto: la paradoja del pesticida, que indica que si repetimos las mismas pruebas el sistema se inmuniza. Sexto: el testing depende del contexto. Y séptimo: la falacia de la ausencia de errores, pues un software libre de bugs técnicos no tiene valor si no resuelve la necesidad real del usuario.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'El Decálogo Ético y Operativo del Analista de Pruebas',
                body: 'Estos siete principios no son simples reglas teóricas: son axiomas de ingeniería que guían la toma de decisiones, previenen expectativas irreales por parte del negocio y optimizan el presupuesto de calidad.',
                impactQA: 'Conocer estos principios permite defender profesionalmente por qué no se puede garantizar software 100% libre de errores y por qué las pruebas deben comenzar desde la etapa de definición de requerimientos.'
              },
              {
                subtitle: 'Desglose Exhaustivo de los 7 Principios ISTQB®',
                cards: [
                  {
                    title: '1. El testing muestra la presencia de defectos, no su ausencia',
                    badge: 'Principio #1',
                    description: 'Las pruebas pueden demostrar que existen defectos en el software, pero jamás pueden probar matemáticamente que no queda ninguno oculto.',
                    bullets: [
                      '**Significado:** Ejecutar miles de pruebas exitosas reduce la probabilidad de fallos no detectados, pero no constituye una garantía de perfección absoluta.',
                      '**Regla de Oro:** Nunca asegures a un cliente que un software está 100% libre de bugs; certifica los escenarios probados y los riesgos mitigados.'
                    ]
                  },
                  {
                    title: '2. El testing exhaustivo es imposible',
                    badge: 'Principio #2',
                    description: 'Probar todas las combinaciones posibles de datos, entradas y caminos lógicos requeriría un tiempo infinito.',
                    bullets: [
                      '**Significado:** Un simple formulario de 5 campos numéricos genera billones de combinaciones posibles.',
                      '**Solución QA:** Aplicar análisis de riesgos, priorización basada en criticidad y técnicas formales de diseño (como Valores Límite).'
                    ]
                  },
                  {
                    title: '3. El testing temprano ahorra tiempo y dinero (Shift-Left)',
                    badge: 'Principio #3',
                    description: 'Las actividades de prueba deben comenzar lo antes posible en el ciclo de vida del desarrollo.',
                    bullets: [
                      '**Curva de Boehm:** Arreglar un defecto en fase de requerimientos cuesta 1x; en diseño 5x; en desarrollo 10x; y en producción entre 50x y 100x.',
                      '**Aplicación:** Revisar historias de usuario y criterios de aceptación antes de escribir la primera línea de código.'
                    ]
                  },
                  {
                    title: '4. Agrupamiento de defectos (Defect Clustering)',
                    badge: 'Principio #4',
                    description: 'Aproximadamente el 80% de los defectos se concentra en el 20% de los módulos del sistema (Principio de Pareto).',
                    bullets: [
                      '**Causas:** Módulos con alta complejidad algorítmica, integraciones con sistemas legados o componentes modificados frecuentemente.',
                      '**Estrategia:** Identificar los módulos problemáticos mediante métricas históricas y concentrar allí el esfuerzo de prueba profunda.'
                    ]
                  },
                  {
                    title: '5. La paradoja del pesticida',
                    badge: 'Principio #5',
                    description: 'Si se repiten las mismas pruebas una y otra vez, eventualmente dejarán de encontrar nuevos defectos.',
                    bullets: [
                      '**Analogía:** Igual que los insectos desarrollan resistencia a un insecticida, el software se "inmuniza" contra una suite estática de pruebas.',
                      '**Solución:** Los casos de prueba deben revisarse, actualizarse periódicamente y complementarse con pruebas exploratorias.'
                    ]
                  },
                  {
                    title: '6. El testing depende del contexto',
                    badge: 'Principio #6',
                    description: 'No existe una estrategia única de testing aplicable a todos los proyectos por igual.',
                    bullets: [
                      '**Variabilidad:** La rigurosidad y técnicas para probar una aplicación de comercio electrónico difieren radicalmente de las de un marcapasos médico o un sistema de frenos automotriz.',
                      '**Enfoque:** Diseñar la estrategia considerando el modelo de desarrollo (Ágil vs Cascada), normativas legales y el impacto ante fallos.'
                    ]
                  },
                  {
                    title: '7. La falacia de la ausencia de errores',
                    badge: 'Principio #7',
                    description: 'Construir un software con cero defectos técnicos no garantiza el éxito del producto.',
                    bullets: [
                      '**La Trampa:** Un sistema puede superar todas las pruebas funcionales sin un solo fallo técnico, pero si no resuelve la necesidad real del usuario o es imposible de usar, el proyecto ha fracasado.',
                      '**Enfoque:** Validar tanto la verificación ("¿construimos el producto correctamente?") como la validación ("¿construimos el producto correcto?").'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '1-3-psicologia-de-las-pruebas',
          title: '1.3 La Psicología de las Pruebas',
          speechText: 'Lección 1.3: La Psicología de las Pruebas. Existe una diferencia psicológica natural entre construir y evaluar software. Los desarrolladores tienden a tener un sesgo optimista sobre su código, asumiendo caminos felices. En cambio, el analista de pruebas debe cultivar una mentalidad de curiosidad destructiva, preguntándose constantemente qué ocurre si se ingresan datos erróneos o se ejecutan acciones no previstas. Dado que el objetivo del tester es encontrar fallos en el trabajo de otros, la comunicación empática es esencial: los defectos deben reportarse como hallazgos objetivos orientados a mejorar el producto, nunca como críticas personales.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Mentalidades en Contrapunto: Desarrollador vs Tester',
                body: 'Construir software y verificar software requieren estados cognitivos distintos. Mientras el desarrollador se enfoca en la síntesis y en hacer que las cosas funcionen bajo condiciones normales (sesgo de confirmación), el tester aplica análisis crítico para descubrir bajo qué condiciones el sistema colapsa.',
                impactQA: 'El testing no busca destruir el software, sino exponer sus límites antes de que el usuario final los sufra. Ambos roles son socios estratégicos con un objetivo común: entregar valor sin fisuras.'
              },
              {
                subtitle: 'Estrategias de Comunicación Asertiva en QA',
                cards: [
                  {
                    title: 'Separar el Producto de la Persona',
                    badge: 'Comunicación Empática',
                    description: 'La calidad del código es una métrica técnica del artefacto, no un juicio sobre la inteligencia o capacidad del programador.',
                    bullets: [
                      '**Evita:** "Tu código tiene un error grave en el login".',
                      '**Aplica:** "Al ingresar caracteres especiales en el campo de contraseña, el servicio devuelve un código 500 no controlado".',
                      '**Objetivo:** Centrarse en los hechos reproducibles y datos de prueba objetivos.'
                    ]
                  },
                  {
                    title: 'Aporte de Valor Constructivo',
                    badge: 'Colaboración Activa',
                    description: 'Un reporte de bug debe ser un regalo de información detallada, no una queja.',
                    bullets: [
                      '**Buenas prácticas:** Incluir capturas de pantalla, registros de red (archivos HAR), datos exactos de prueba y pasos enumerados.',
                      '**Actitud:** Reconocer cuando un problema fue resuelto con éxito y agradecer la colaboración en el triage de defectos.'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modulo-2',
      number: 2,
      title: 'Módulo 2: Pruebas a lo Largo del Ciclo de Vida (SDLC)',
      shortTitle: '2. Ciclo de Vida & Niveles',
      duration: '45 min',
      icon: 'bi-diagram-3-fill',
      topics: [
        {
          id: '2-1-modelos-desarrollo-testing',
          title: '2.1 Modelos de Desarrollo y el Testing',
          speechText: 'Módulo 2, Lección 2.1: Modelos de Desarrollo y el Testing. En metodologías secuenciales tradicionales como el modelo en Cascada, el testing quedaba relegado a la última fase del proyecto, generando enormes cuellos de botella y costos elevados cuando se descubrían defectos estructurales. En cambio, en metodologías ágiles como Scrum o Kanban, las pruebas se integran de manera continua en cada sprint. Cada funcionalidad debe contar con criterios de aceptación claros antes de comenzar el desarrollo, y solo se considera terminada cuando todas las pruebas asociadas se ejecutan con éxito.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Evolución de los Modelos de Desarrollo',
                body: 'La forma en que se concibe y ejecuta el testing está directamente condicionada por el modelo de ciclo de vida del software (SDLC). En modelos tradicionales, el tiempo para probar solía comprimirse cuando los plazos de desarrollo se retrasaban. En entornos modernos, el testing es una actividad diaria continua.',
                impactQA: 'En metodologías ágiles, el tester participa desde el refinamiento de la Historia de Usuario ayudando a definir los Criterios de Aceptación (Gherkin) y garantizando el cumplimiento del Definition of Done (DoD).'
              },
              {
                subtitle: 'Contraste entre Enfoques Tradicionales y Ágiles',
                cards: [
                  {
                    title: 'Modelo en Cascada (Waterfall)',
                    badge: 'Secuencial Rígido',
                    description: 'Fases estrictas y lineales donde cada etapa debe concluir antes de que inicie la siguiente.',
                    bullets: [
                      '**Testing:** Ubicado al final, después de la codificación completa.',
                      '**Riesgo:** Los defectos en requerimientos descubiertos meses después exigen reescribir grandes porciones de código.',
                      '**Feedback:** Extremadamente tardío para el cliente y los desarrolladores.'
                    ]
                  },
                  {
                    title: 'Modelo Ágil e Iterativo (Scrum/Kanban)',
                    badge: 'Iterativo & Continuo',
                    description: 'Ciclos cortos (sprints de 1 a 4 semanas) con entregables potencialmente desplegables.',
                    bullets: [
                      '**Testing:** Paralelo al desarrollo en cada historia de usuario.',
                      '**Automatización:** Indispensable para ejecutar suites de regresión rápidas en cada build.',
                      '**Colaboración:** Triángulo ágil (Product Owner, Desarrollador, QA) definiendo criterios juntos.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '2-2-niveles-de-prueba',
          title: '2.2 Los Niveles de Prueba',
          speechText: 'Lección 2.2: Los Niveles de Prueba. El software se construye por capas modulares y de la misma manera debe evaluarse. Existen cuatro niveles fundamentales según ISTQB: Pruebas de Componente o Unitarias, que verifican el bloque de código más pequeño e indivisible de forma aislada; Pruebas de Integración, que validan la comunicación e intercambio de datos entre módulos, APIs y bases de datos; Pruebas de Sistema, que evalúan el producto completo de principio a fin en un entorno que simula producción; y Pruebas de Aceptación o UAT, realizadas por clientes o dueños de producto para validar que el sistema cumple con las necesidades reales de negocio.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'La Pirámide de Pruebas de Software',
                body: 'Cada nivel de prueba posee un objetivo específico, un entorno de ejecución particular, un sujeto bajo prueba determinado y tipos de defectos propios. Comprenderlos evita duplicar esfuerzos innecesarios.',
                impactQA: 'Intentar probar toda la lógica de negocio únicamente en la interfaz gráfica (pruebas E2E de sistema) genera suites lentas, costosas y frágiles. La estrategia óptima sigue la pirámide: muchas unitarias en la base, un bloque sólido de integración en el medio y pruebas de sistema enfocadas en los flujos críticos de usuario.'
              },
              {
                subtitle: 'Los Cuatro Niveles Canónicos de ISTQB®',
                cards: [
                  {
                    title: '1. Pruebas de Componente (Unitarias)',
                    badge: 'Nivel 1 - Base',
                    description: 'Validación del bloque individual más pequeño de código (funciones, clases, métodos) en completo aislamiento.',
                    bullets: [
                      '**Responsable habitual:** Desarrolladores.',
                      '**Herramientas:** JUnit, NUnit, Jest, Vitest, PyTest.',
                      '**Técnica:** Se utilizan mocks y stubs para aislar dependencias externas (bases de datos, APIs).',
                      '**Velocidad:** Extremadamente rápidas (milisegundos) y económicas de corregir.'
                    ]
                  },
                  {
                    title: '2. Pruebas de Integración',
                    badge: 'Nivel 2 - Conexión',
                    description: 'Verifican la interacción y contratos de datos entre dos o más unidades o subsistemas comunicados.',
                    bullets: [
                      '**Variantes:** Integración de componentes (código) e Integración de sistemas (APIs REST, colas de mensajería, bases de datos).',
                      '**Foco de defectos:** Incompatibilidad de tipos de datos, errores en esquemas JSON, protocolos HTTP y fallos de timeout.',
                      '**Herramientas:** Postman, Supertest, RestAssured.'
                    ]
                  },
                  {
                    title: '3. Pruebas de Sistema (End-to-End)',
                    badge: 'Nivel 3 - Holístico',
                    description: 'Evalúan el comportamiento global del producto integrado en un entorno lo más fiel posible a producción.',
                    bullets: [
                      '**Foco:** Flujos completos de negocio, desempeño, seguridad y reglas operacionales de extremo a extremo.',
                      '**Sujeto bajo prueba:** La aplicación completa como una caja negra.',
                      '**Herramientas:** Selenium, Playwright, Cypress, JMeter.'
                    ]
                  },
                  {
                    title: '4. Pruebas de Aceptación (UAT)',
                    badge: 'Nivel 4 - Negocio',
                    description: 'Validación final realizada por usuarios de negocio, clientes o Product Owners para autorizar el paso a producción.',
                    bullets: [
                      '**Objetivo:** Establecer confianza en que el sistema está listo para ser utilizado en el mundo real.',
                      '**Variantes:** Alpha Testing (en las instalaciones del proveedor) y Beta Testing (con usuarios reales en su entorno operativo).',
                      '**Criterio:** Cumplimiento de contratos comerciales y satisfacción del usuario final.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '2-3-tipos-de-prueba',
          title: '2.3 Tipos de Prueba',
          speechText: 'Lección 2.3: Tipos de Prueba. Dentro de los distintos niveles de prueba, podemos clasificar las pruebas según su objetivo técnico. Las Pruebas Funcionales responden a la pregunta de qué hace el sistema, validando reglas de negocio y casos de uso. Las Pruebas No Funcionales responden a cómo de bien lo hace, abarcando rendimiento, seguridad, usabilidad y consumo de recursos. Además, cuando un defecto es corregido, realizamos Pruebas de Confirmación o Re-testing para verificar que el bug fue solucionado, seguido de Pruebas de Regresión para asegurar que dicho arreglo no rompió funcionalidades previas.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Clasificación por Naturaleza y Propósito',
                body: 'Un sistema no solo debe calcular correctamente un resultado, también debe responder en tiempos aceptables, resistir intentos de vulneración y mantener su estabilidad tras cada actualización.',
                impactQA: 'Confundir Re-testing con Regresión es un error frecuente en entrevistas y certificaciones. El Re-testing es puntual (reprobar el bug corregido); la Regresión es amplia (verificar que el resto del sistema sigue intacto).'
              },
              {
                subtitle: 'Matriz de Tipos de Prueba Esenciales',
                cards: [
                  {
                    title: 'Pruebas Funcionales',
                    badge: '¿Qué hace?',
                    description: 'Evalúan las funciones específicas que el sistema debe ejecutar de acuerdo a los requerimientos de negocio.',
                    bullets: [
                      '**Ejemplos:** Cálculo de impuestos en un carrito de compras, validación de contraseñas seguras, exportación de reportes a PDF.',
                      '**Base:** Historias de usuario, especificaciones de requisitos, casos de uso.'
                    ]
                  },
                  {
                    title: 'Pruebas No Funcionales',
                    badge: '¿Cómo lo hace?',
                    description: 'Miden atributos de calidad y características operacionales del sistema bajo diversas condiciones.',
                    bullets: [
                      '**Rendimiento:** Tiempos de respuesta (latencia), p95, p99 bajo carga.',
                      '**Estrés:** Comportamiento ante picos extremos que superan la capacidad planificada.',
                      '**Usabilidad:** Facilidad de navegación, accesibilidad WCAG y claridad de mensajes.',
                      '**Seguridad:** Detección de inyecciones SQL, XSS, gestión de tokens y cifrado.'
                    ]
                  },
                  {
                    title: 'Pruebas de Confirmación (Re-testing)',
                    badge: 'Validación de Fix',
                    description: 'Ejecución exacta del mismo caso de prueba que falló previamente para certificar que el bug fue resuelto.',
                    bullets: [
                      '**Ámbito:** Restringido al defecto reportado.',
                      '**Resultado esperado:** El caso de prueba pasa sin fallos tras el despliegue del fix.'
                    ]
                  },
                  {
                    title: 'Pruebas de Regresión',
                    badge: 'Protección Integral',
                    description: 'Ejecución de un conjunto de pruebas sobre áreas no modificadas para detectar efectos secundarios indeseados.',
                    bullets: [
                      '**Riesgo mitigado:** Código nuevo o correcciones que rompen funcionalidades previamente estables.',
                      '**Candidato ideal:** Máxima prioridad para automatización en pipelines de CI/CD.'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modulo-3',
      number: 3,
      title: 'Módulo 3: Pruebas Estáticas',
      shortTitle: '3. Pruebas Estáticas',
      duration: '40 min',
      icon: 'bi-file-earmark-check-fill',
      topics: [
        {
          id: '3-1-valor-pruebas-estaticas',
          title: '3.1 El valor de las Pruebas Estáticas',
          speechText: 'Módulo 3, Lección 3.1: El valor de las Pruebas Estáticas. A diferencia de las pruebas dinámicas que requieren ejecutar el software en una computadora, las pruebas estáticas se realizan mediante el examen minucioso de artefactos sin ejecutar código. Esto incluye el análisis de requerimientos, especificaciones de arquitectura, contratos de interfaces y el análisis estático del código fuente con herramientas automatizadas. Son extremadamente valiosas porque detectan defectos de diseño, ambigüedades y omisiones antes de que se escriba una sola línea de código, evitando retrabajos masivos.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Prevenir Defectos antes de la Compilación',
                body: 'Un porcentaje abrumador de los fallos que se descubren en producción tienen su origen en requerimientos mal redactados, ambiguos o contradictorios. Probar de forma estática es el núcleo del principio Shift-Left.',
                impactQA: 'Una hora invertida por un tester revisando requerimientos y diagramas de flujo puede ahorrar decenas de horas de desarrollo y testing dinámico posterior.'
              },
              {
                subtitle: 'Artefactos Evaluables y Beneficios Clave',
                cards: [
                  {
                    title: 'Artefactos Sujetos a Prueba Estática',
                    badge: 'Entregables de Trabajo',
                    description: 'Cualquier producto de trabajo humano o generado por máquina puede revisarse estáticamente.',
                    bullets: [
                      'Historias de usuario, Criterios de Aceptación y mockups de diseño UI/UX.',
                      'Diagramas de arquitectura, esquemas de bases de datos y especificaciones OpenAPI.',
                      'Código fuente (evaluado con linters como ESLint, SonarQube, SAST).'
                    ]
                  },
                  {
                    title: 'Ventajas Competitivas de las Pruebas Estáticas',
                    badge: 'Máximo ROI',
                    description: 'Impacto económico y técnico en la calidad del proyecto.',
                    bullets: [
                      '**Detección de causa raíz:** Encuentra el defecto directo en el texto o código, en lugar de observar un síntoma o fallo en ejecución.',
                      '**Menor costo:** Modificar una frase en una historia de usuario cuesta minutos; corregir una arquitectura en producción cuesta semanas.',
                      '**Alineación:** Asegura que todo el equipo interprete el mismo comportamiento antes de codificar.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '3-2-revisiones-y-sus-tipos',
          title: '3.2 Revisiones y sus Tipos',
          speechText: 'Lección 3.2: Revisiones y sus Tipos. El proceso de revisión estática abarca desde dinámicas informales hasta ceremonias altamente estructuradas. Según el estándar ISTQB, existen tres tipos fundamentales: Revisiones Informales, como la programación en pares o la lectura rápida entre colegas sin registro formal; Walkthroughs o recorridos guiados, donde el autor del documento guía a los participantes paso a paso para recopilar observaciones y validar la lógica; e Inspecciones, que representan el método más formal y riguroso, con roles estrictos como moderador, lector y revisores, apoyados en listas de verificación y métricas de calidad.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Espectro de Formalidad en Revisiones',
                body: 'La elección del tipo de revisión depende de la criticidad del sistema, la cultura del equipo, el presupuesto y las exigencias regulatorias de la industria.',
                impactQA: 'En una inspección formal, el autor del artefacto nunca debe actuar como moderador ni como lector; esto garantiza objetividad y evita que el sesgo del creador oculte fallos evidentes.'
              },
              {
                subtitle: 'Los Tres Tipos Oficiales de Revisión ISTQB®',
                cards: [
                  {
                    title: '1. Revisiones Informales',
                    badge: 'Baja Formalidad',
                    description: 'Lecturas rápidas o revisiones de pares sin protocolo ni documentación obligatoria.',
                    bullets: [
                      '**Objetivo:** Forma rápida y económica de detectar fallos obvios.',
                      '**Ejemplos:** Pair programming, revisión rápida de un criterio de aceptación por chat o videollamada.',
                      '**Documentación:** No genera actas ni reportes formales de defectos.'
                    ]
                  },
                  {
                    title: '2. Walkthroughs (Recorridos Guiados)',
                    badge: 'Formalidad Media',
                    description: 'Sesión liderada por el autor del artefacto para guiar a los colegas a través del documento.',
                    bullets: [
                      '**Objetivos:** Educación del equipo sobre una nueva funcionalidad, recopilación de feedback y construcción de consenso.',
                      '**Dinámica:** El autor expone el flujo y los participantes cuestionan casos de borde o inconsistencias.',
                      '**Roles:** Autor como expositor, participantes como revisores, y opcionalmente un secretario para tomar notas.'
                    ]
                  },
                  {
                    title: '3. Inspecciones Técnicas',
                    badge: 'Máxima Formalidad',
                    description: 'Proceso formal basado en reglas documentadas, listas de chequeo y medición estricta de defectos.',
                    bullets: [
                      '**Roles clave:**',
                      '• **Moderador:** Lidera la sesión, asegura la disciplina y gestiona el tiempo.',
                      '• **Autor:** Escucha observaciones sin justificar defensivamente su trabajo.',
                      '• **Lector:** Lee y parafrasea el documento paso a paso.',
                      '• **Revisores:** Expertos técnicos que detectan defectos mediante checklists.',
                      '**Métricas:** Tasa de defectos por página, tiempo invertido y criterios formales de salida.'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modulo-4',
      number: 4,
      title: 'Módulo 4: Técnicas de Análisis y Diseño',
      shortTitle: '4. Técnicas de Diseño',
      duration: '55 min',
      icon: 'bi-grid-3x3-gap-fill',
      topics: [
        {
          id: '4-1-tecnicas-de-caja-negra',
          title: '4.1 Técnicas de Caja Negra',
          speechText: 'Módulo 4, Lección 4.1: Técnicas de Caja Negra. Las técnicas de caja negra o basadas en especificaciones se centran en las entradas y salidas del sistema, sin importar cómo está estructurado el código internamente. Entre las más potentes destacan: Partición de Equivalencia, donde agrupamos los datos en conjuntos válidos e inválidos para probar un solo representativo de cada grupo; Análisis de Valores Límite, enfocado en los extremos donde estadísticamente ocurren la mayoría de errores de programación; Tablas de Decisión, ideales para mapear reglas complejas con múltiples condiciones de verdadero y falso; y Transición de Estados, para sistemas cuyo comportamiento depende de su estado previo, como un carrito de compras que pasa de vacío a lleno y luego a pagado.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'El Arte de Reducir Infinitos Casos a Mínimos Críticos',
                body: 'Un tester aficionado prueba datos al azar con la esperanza de toparse con un fallo. Un tester profesional utiliza técnicas de caja negra para garantizar cobertura matemática con el menor número posible de casos de prueba.',
                impactQA: 'Dominar la Partición de Equivalencia y los Valores Límite es la habilidad técnica más evaluada en entrevistas de QA y en el examen de certificación ISTQB CTFL 4.0.'
              },
              {
                subtitle: 'Las Cuatro Técnicas de Caja Negra Fundamentales',
                cards: [
                  {
                    title: 'Partición de Equivalencia (Equivalence Partitioning)',
                    badge: 'Clases de Datos',
                    description: 'Divide el dominio de entrada en clases donde todos los valores se comportan teóricamente de la misma forma.',
                    bullets: [
                      '**Concepto:** Si un valor de una partición funciona, se asume que todos los demás de esa misma partición también funcionarán.',
                      '**Ejemplo:** Si un campo de edad acepta de 18 a 60 años:',
                      '• Partición Inválida Inferior: < 18 (ej. probar con 12).',
                      '• Partición Válida: 18 a 60 (ej. probar con 35).',
                      '• Partición Inválida Superior: > 60 (ej. probar con 75).',
                      '**Resultado:** 3 casos de prueba representan a millones de entradas posibles.'
                    ]
                  },
                  {
                    title: 'Análisis de Valores Límite (Boundary Value Analysis - BVA)',
                    badge: 'Extremos Críticos',
                    description: 'Los desarrolladores suelen equivocarse en los bordes de las condiciones (escribir > en vez de >=).',
                    bullets: [
                      '**Concepto:** Se prueban los valores exactamente en los límites y justo a los lados del límite.',
                      '**Ejemplo (Regla de edad >= 18 años):**',
                      '• Borde crítico: 18.',
                      '• Valor justo antes del límite (inválido): 17.',
                      '• Valor en el límite (válido): 18.',
                      '• Valor justo después del límite (válido): 19.',
                      '**Potencia:** Es donde se descubren la mayor cantidad de defectos lógicos por omisión o error de operador.'
                    ]
                  },
                  {
                    title: 'Tablas de Decisión (Decision Tables)',
                    badge: 'Lógica Combinatoria',
                    description: 'Matriz estructurada para capturar combinaciones complejas de condiciones de negocio.',
                    bullets: [
                      '**Estructura:** Condiciones (entradas) arriba, Acciones (salidas esperadas) abajo.',
                      '**Utilidad:** Reglas bancarias, cálculos de seguros o validaciones con múltiples variables (ej: "¿Es cliente premium?", "¿Saldo > $1000?", "¿Tarjeta vigente?").',
                      '**Ventaja:** Evita que combinaciones críticas queden sin cobertura accidentalmente.'
                    ]
                  },
                  {
                    title: 'Pruebas de Transición de Estados',
                    badge: 'Máquinas de Estado',
                    description: 'Modelan el sistema como un conjunto de estados por los que transita según eventos y acciones.',
                    bullets: [
                      '**Concepto:** Una misma entrada puede provocar una salida diferente dependiendo del estado actual del sistema.',
                      '**Ejemplo:** Carrito de compras: Vacío → (agrega item) → Con Productos → (paga exitosamente) → Pagado / Despachado.',
                      '**Casos a probar:** Transiciones válidas previstas y transiciones inválidas (ej. intentar pagar un carrito ya pagado o vacío).'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '4-2-caja-blanca-y-experiencia',
          title: '4.2 Técnicas de Caja Blanca y de Experiencia',
          speechText: 'Lección 4.2: Técnicas de Caja Blanca y de Experiencia. En las técnicas de caja blanca, el tester tiene acceso directo al código fuente y a la arquitectura interna, buscando medir qué porcentaje de sentencias o decisiones lógicas fueron recorridas durante las pruebas. Por otro lado, las técnicas basadas en la experiencia aprovechan el conocimiento acumulado y la intuición del evaluador. Destacan las pruebas exploratorias, donde el tester diseña, ejecuta y aprende simultáneamente en sesiones estructuradas con objetivos claros, permitiendo descubrir defectos imprevistos que las pruebas formales predefinidas jamás hubieran imaginado.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Auditoría Estructural y Agilidad Humana',
                body: 'Mientras la caja blanca proporciona métricas científicas de cobertura de código, las pruebas exploratorias inyectan adaptabilidad e intuición humana frente a flujos no documentados.',
                impactQA: 'Las pruebas exploratorias no son "hacer clic a lo loco sin plan". Se basan en Cartas de Prueba (Charters) y sesiones delimitadas por tiempo (Time-boxed Sessions de 45 a 90 minutos) con bitácoras detalladas.'
              },
              {
                subtitle: 'Enfoques de Cobertura y Exploración',
                cards: [
                  {
                    title: 'Caja Blanca: Cobertura de Sentencias y Decisiones',
                    badge: 'Estructural',
                    description: 'Mide la exhaustividad con la que los casos de prueba ejercitan el código fuente.',
                    bullets: [
                      '**Cobertura de Sentencias (Statement Coverage):** Porcentaje de líneas de código ejecutadas por las pruebas.',
                      '**Cobertura de Decisiones/Ramas (Branch Coverage):** Evalúa si tanto la rama Verdadera como la Falsa de cada condicional (if/else) fueron ejecutadas.',
                      '**Regla ISTQB:** Lograr 100% de cobertura de decisiones garantiza automáticamente 100% de cobertura de sentencias, pero lo inverso no es cierto.'
                    ]
                  },
                  {
                    title: 'Técnicas Basadas en Experiencia: Pruebas Exploratorias',
                    badge: 'Heurístico & Dinámico',
                    description: 'Diseño, ejecución y aprendizaje simultáneos conducidos por la creatividad del tester.',
                    bullets: [
                      '**Estructura (Session-Based Testing):** Se define un objetivo (Charter), un límite de tiempo (ej. 60 min) y se registra un diario de hallazgos.',
                      '**Aporte:** Descubre defectos imprevistos surgidos de la interacción real que las especificaciones omitieron.',
                      '**Error Guessing:** Conjeturar qué errores comunes cometen los desarrolladores en una tecnología específica (ej. concurrencia, pérdida de foco, pérdida de conexión a internet).'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modulo-5',
      number: 5,
      title: 'Módulo 5: Gestión de Pruebas y Reporte de Defectos',
      shortTitle: '5. Gestión & Defectos',
      duration: '50 min',
      icon: 'bi-bug-fill',
      topics: [
        {
          id: '5-1-planificacion-riesgos-estrategia',
          title: '5.1 Planificación, Riesgos y Estrategia',
          speechText: 'Módulo 5, Lección 5.1: Planificación, Riesgos y Estrategia. Un proceso de pruebas ordenado requiere fijar condiciones claras para comenzar y concluir las actividades. Los Criterios de Entrada definen los requisitos previos que deben cumplirse antes de iniciar las pruebas, como contar con un entorno estable y código desplegado. Los Criterios de Salida establecen cuándo se considera que el testing ha terminado y el software está listo para liberarse, como alcanzar cierta cobertura o no tener bugs críticos abiertos. Además, plataformas de gestión como Jira o Azure DevOps permiten llevar la trazabilidad completa desde la historia de usuario hasta el caso de prueba, utilizando a menudo el lenguaje estructurado Gherkin con su formato Dado, Cuando y Entonces.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Gobernanza y Trazabilidad en QA',
                body: 'La gestión de pruebas asegura que el esfuerzo del equipo esté alineado con los objetivos del negocio y los riesgos más críticos. Sin trazabilidad, es imposible saber qué requerimientos quedaron desprotegidos.',
                impactQA: 'El uso de Gherkin (BDD) rompe la barrera entre negocio y técnica: un mismo escenario escrito en lenguaje natural sirve como especificación, caso de prueba y script de automatización ejecutable.'
              },
              {
                subtitle: 'Pilares de la Gestión de Pruebas',
                cards: [
                  {
                    title: 'Criterios de Entrada y Salida (Entry & Exit Criteria)',
                    badge: 'Control de Puertas',
                    description: 'Condiciones de frontera para autorizar el flujo del proceso de testing.',
                    bullets: [
                      '**Criterios de Entrada:** Entorno de pruebas disponible y configurado, build desplegada exitosamente (Smoke Test aprobado), historias de usuario con criterios definidos.',
                      '**Criterios de Salida:** 100% de casos críticos ejecutados, tasa de aprobación >= 95%, cero defectos bloqueantes o de severidad crítica sin resolver.'
                    ]
                  },
                  {
                    title: 'Trazabilidad y Lenguaje Gherkin (Given-When-Then)',
                    badge: 'Comunicación BDD',
                    description: 'Conectar cada requerimiento con sus pruebas y defectos asociados.',
                    bullets: [
                      '**Trazabilidad:** Saber exactamente qué historias de usuario fallan cuando un bug es descubierto en Jira o Azure DevOps.',
                      '**Formato Gherkin:**',
                      '• **Dado (Given):** El contexto o estado inicial previo.',
                      '• **Cuando (When):** La acción realizada por el usuario o evento.',
                      '• **Entonces (Then):** El resultado o cambio de estado observable esperado.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '5-2-ciclo-vida-del-defecto',
          title: '5.2 El Ciclo de Vida del Defecto',
          speechText: 'Lección 5.2: El Ciclo de Vida del Defecto. Un hallazgo pasa por diferentes estados de madurez a lo largo de su resolución. Comienza en estado Nuevo; tras ser evaluado pasa a Asignado a un desarrollador. Mientras se trabaja en su solución se encuentra En Progreso. Una vez corregido, se marca como Resuelto y vuelve al equipo de QA para su validación mediante pruebas de confirmación. Si el bug fue efectivamente eliminado, se marca como Cerrado; pero si el fallo persiste, debe marcarse como Reabierto. Un reporte de defecto profesional debe ser completamente replicable, con título descriptivo, precondiciones claras, pasos exactos, resultado esperado, resultado actual y evidencias gráficas.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'La Máquina de Estados del Bug',
                body: 'Cada defecto descubierto en el software debe documentarse con suficiente rigor para que cualquier integrante del equipo pueda reproducirlo en su máquina sin ambigüedades.',
                impactQA: 'Un bug mal documentado genera fricción, demoras y el temido veredicto "No se puede reproducir" (Cannot Reproduce). Redactar reportes impecables es la firma de un tester senior.'
              },
              {
                subtitle: 'Estados Canónicos y Estructura del Reporte',
                cards: [
                  {
                    title: 'Flujo de Estados del Defecto (Bug Lifecycle)',
                    badge: 'Máquina de Estados',
                    description: 'Transición formal del reporte desde su descubrimiento hasta su cierre.',
                    bullets: [
                      '**1. Nuevo (New):** Registrado por el tester con toda la información inicial.',
                      '**2. Asignado (Assigned):** Asignado a un desarrollador tras el triage de prioridades.',
                      '**3. En Progreso (In Progress):** El desarrollador está analizando la causa raíz y codificando la solución.',
                      '**4. Resuelto (Resolved):** El arreglo fue desplegado en el entorno de pruebas.',
                      '**5. Cerrado (Closed):** El tester ejecuta el Re-testing y confirma que el defecto no existe.',
                      '**6. Reabierto (Reopened):** La falla continúa manifestándose o el arreglo fue incompleto.'
                    ]
                  },
                  {
                    title: 'Anatomía de un Bug Report Replicable',
                    badge: 'Estructura Obligatoria',
                    description: 'Elementos que componen un reporte de defecto de clase mundial.',
                    bullets: [
                      '**Título conciso y descriptivo:** [Módulo] + Comportamiento fallido + Bajo condición específica.',
                      '**Precondiciones:** Rol del usuario autenticado, datos previos requeridos y configuración de cuenta.',
                      '**Pasos exactos para reproducir:** Lista numerada secuencial del paso 1 al paso N.',
                      '**Resultado Esperado vs Resultado Actual:** Contraste claro entre lo que debía ocurrir y lo que ocurrió.',
                      '**Severidad vs Prioridad:** Severidad (impacto técnico en el sistema) vs Prioridad (urgencia de negocio para resolverlo).',
                      '**Evidencias:** Capturas de pantalla con recuadros señalando el fallo, videos cortos y logs de consola o red.'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'modulo-6',
      number: 6,
      title: 'Módulo 6: Ecosistema de Herramientas y Automatización',
      shortTitle: '6. Herramientas & Automatización',
      duration: '45 min',
      icon: 'bi-cpu-fill',
      topics: [
        {
          id: '6-1-rol-de-la-automatizacion-qa',
          title: '6.1 El Rol de la Automatización en QA',
          speechText: 'Módulo 6, Lección 6.1: El Rol de la Automatización en QA. Las pruebas manuales son excelentes para evaluar la usabilidad, explorar comportamientos inesperados y validar casos de prueba nuevos o altamente complejos. Sin embargo, las pruebas repetitivas de regresión deben automatizarse. La automatización permite que los equipos liberen software de forma rápida y constante sin sacrificar la calidad, ejecutando cientos de pruebas en minutos dentro de pipelines de integración continua. Automatizar no reemplaza al tester humano: lo libera de tareas mecánicas para enfocarse en análisis de mayor valor.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Sinergia Estratégica: Manual + Automatizado',
                body: 'Un error común es creer que la meta de un equipo es "automatizar el 100% de todo". Existen pruebas donde el costo de construir y mantener el script automatizado supera con creces el beneficio.',
                impactQA: 'El criterio para decidir qué automatizar incluye: pruebas de regresión críticas, pruebas que se ejecutan frecuentemente, casos con múltiples combinaciones de datos (Data-Driven) y pruebas de rendimiento o estrés imposibles de simular manualmente.'
              },
              {
                subtitle: 'Cuándo Automatizar y Cuándo Mantener Pruebas Manuales',
                cards: [
                  {
                    title: 'Candidatos Ideales para Automatización',
                    badge: 'Alto Retorno de Inversión (ROI)',
                    description: 'Escenarios donde la máquina supera ampliamente la velocidad y precisión humana.',
                    bullets: [
                      'Smoke tests (pruebas de humo) ejecutadas tras cada despliegue de build.',
                      'Suites de regresión completas que deben correr antes de cada liberación.',
                      'Flujos de cálculo complejos con múltiples conjuntos de datos masivos.',
                      'Pruebas de APIs y servicios backend con contratos estables.'
                    ]
                  },
                  {
                    title: 'Casos que Exigen Testing Manual y Humano',
                    badge: 'Juicio Crítico Humano',
                    description: 'Áreas donde la sensibilidad, empatía y criterio humano son irreemplazables.',
                    bullets: [
                      'Pruebas de usabilidad y experiencia de usuario (UX/UI).',
                      'Pruebas exploratorias guiadas por la intuición y el descubrimiento continuo.',
                      'Validaciones visuales preliminares de nuevas interfaces en rediseño activo.',
                      'Funcionalidades que cambian de requerimientos con altísima frecuencia.'
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          id: '6-2-seleccion-herramientas-web-apis',
          title: '6.2 Selección de Herramientas para Web y APIs',
          speechText: 'Lección 6.2: Selección de Herramientas para Web y APIs. Existen distintas alternativas en el mercado para implementar marcos de automatización modernos. Mientras Selenium ha sido el estándar clásico para interactuar con navegadores de forma general mediante su arquitectura WebDriver, frameworks más recientes como Cypress y Playwright ofrecen ventajas significativas. Estos marcos modernos se ejecutan más cerca de la aplicación y permiten interceptar peticiones de red de forma nativa, lo que los hace extremadamente estables y veloces, reduciendo notablemente las pruebas intermitentes o flaky tests. Al diseñar una estrategia, es vital estructurar los proyectos buscando siempre la mantenibilidad a largo plazo y la fácil lectura de los escenarios.',
          content: {
            type: 'concepts',
            subsections: [
              {
                subtitle: 'Evolución Arquitectural: Del WebDriver a DevTools Protocol',
                body: 'La fragilidad y lentitud histórica de las pruebas automatizadas (flaky tests) solía deberse a la latencia de comandos entre el script, el driver externo y el navegador. Los frameworks modernos resuelven este problema comunicándose directamente mediante protocolos nativos o dentro del mismo proceso del navegador.',
                impactQA: 'Playwright se ha consolidado como la herramienta líder para automatización web multiplataforma, gracias a su auto-espera inteligente (elimina la necesidad de sleeps arbitrarios), ejecución paralela nativa, soporte de múltiples pestañas y dominios, y captura automática de trazas de ejecución con video y red.'
              },
              {
                subtitle: 'Comparativa de Herramientas Líderes en la Industria',
                cards: [
                  {
                    title: 'Playwright (Microsoft)',
                    badge: 'Recomendado Moderno',
                    description: 'Framework de automatización de última generación para aplicaciones web y APIs.',
                    bullets: [
                      '**Arquitectura:** Conexión directa mediante Chrome DevTools Protocol (CDP) y WebSockets.',
                      '**Ventajas:** Auto-waiting nativo (cero esperas forzadas), soporte de Chromium, Firefox y WebKit (Safari), multi-pestaña, multi-dominio, interceptación de red ultra-rápida.',
                      '**Lenguajes:** TypeScript, JavaScript, Python, Java, C#.'
                    ]
                  },
                  {
                    title: 'Cypress',
                    badge: 'Popular en Frontend',
                    description: 'Herramienta pensada para desarrolladores y testers frontend trabajando en aplicaciones web modernas.',
                    bullets: [
                      '**Arquitectura:** Se ejecuta dentro del mismo bucle de eventos del navegador junto con la aplicación.',
                      '**Ventajas:** Depuración interactiva paso a paso en tiempo real, recarga automática de pruebas, control visual fácil.',
                      '**Limitaciones:** Soporte multi-pestaña y multi-dominio más complejo; orientado primariamente a JavaScript/TypeScript.'
                    ]
                  },
                  {
                    title: 'Selenium WebDriver',
                    badge: 'Estándar Histórico',
                    description: 'El estándar W3C con más de dos décadas de soporte en toda la industria.',
                    bullets: [
                      '**Arquitectura:** Cliente-servidor mediante drivers específicos de cada navegador a través de peticiones HTTP.',
                      '**Ventajas:** Ecosistema gigantesco de librerías, soporte de casi todos los navegadores y lenguajes imaginables.',
                      '**Desventajas:** Requiere mayor configuración manual de esperas explícitas para evitar fallos intermitentes.'
                    ]
                  },
                  {
                    title: 'Pruebas de APIs: Postman & Playwright API',
                    badge: 'Capa Backend',
                    description: 'Validar la capa de datos antes de interactuar con la interfaz gráfica.',
                    bullets: [
                      '**Velocidad:** Las pruebas de API se ejecutan hasta 10 veces más rápido que las pruebas de interfaz gráfica.',
                      '**Estabilidad:** No dependen de selectores CSS ni cambios en el diseño visual.',
                      '**Estrategia:** Probar todas las reglas de negocio a nivel de API REST/GraphQL y reservar la UI para flujos de usuario visuales.'
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],

  // Glosario Técnico Exhaustivo (25 Términos Canónicos ISTQB)
  glossary: [
    {
      term: 'Aseguramiento de la Calidad (QA)',
      enTerm: 'Quality Assurance',
      category: 'Procesos',
      definition: 'Parte de la gestión de la calidad orientada a proporcionar confianza en que se cumplirán los requisitos de calidad mediante la definición, auditoría y mejora proactiva de los procesos de desarrollo.'
    },
    {
      term: 'Control de Calidad (QC)',
      enTerm: 'Quality Control',
      category: 'Procesos',
      definition: 'Conjunto de actividades operacionales reactivas que evalúan la calidad de un artefacto o producto de trabajo para determinar si cumple con los requerimientos especificados.'
    },
    {
      term: 'Pruebas de Software (Testing)',
      enTerm: 'Software Testing',
      category: 'Fundamentos',
      definition: 'Conjunto de actividades sistemáticas y técnicas para evaluar un producto de software y determinar que satisface las necesidades del negocio y detectar defectos mediante su ejecución o análisis.'
    },
    {
      term: 'Defecto (Bug / Falta)',
      enTerm: 'Defect / Bug',
      category: 'Defectos',
      definition: 'Imperfección o deficiencia en un producto de trabajo (código, requerimiento o diseño) que puede hacer que no cumpla sus especificaciones o cause un fallo durante la ejecución.'
    },
    {
      term: 'Fallo',
      enTerm: 'Failure',
      category: 'Defectos',
      definition: 'Manifestación externa o discrepancia perceptible entre el comportamiento real exhibido por el software en ejecución y el comportamiento esperado por el usuario o especificación.'
    },
    {
      term: 'Error (Equivocación)',
      enTerm: 'Error / Mistake',
      category: 'Defectos',
      definition: 'Acción humana incorrecta que produce un resultado erróneo, por ejemplo una mala interpretación de un requerimiento que conduce a introducir un defecto en el código fuente.'
    },
    {
      term: 'Shift-Left (Testing Temprano)',
      enTerm: 'Shift-Left Testing',
      category: 'Metodología',
      definition: 'Enfoque metodológico que adelanta las actividades de prueba a las etapas iniciales del ciclo de vida (como el análisis de historias de usuario) para prevenir defectos en lugar de detectarlos al final.'
    },
    {
      term: 'Paradoja del Pesticida',
      enTerm: 'Pesticide Paradox',
      category: 'Principios',
      definition: 'Principio que establece que si se repiten las mismas pruebas continuamente, dejan de encontrar nuevos defectos; los casos de prueba deben evolucionar constantemente para ser efectivos.'
    },
    {
      term: 'Pruebas de Componente (Unitarias)',
      enTerm: 'Component / Unit Testing',
      category: 'Niveles',
      definition: 'Pruebas que evalúan componentes individuales de software (funciones, clases, métodos) de forma aislada, utilizando stubs y mocks para dependencias externas.'
    },
    {
      term: 'Pruebas de Integración',
      enTerm: 'Integration Testing',
      category: 'Niveles',
      definition: 'Nivel de prueba enfocado en verificar las interacciones, intercambio de datos y contratos entre componentes, servicios externos, bases de datos o subsistemas comunicados.'
    },
    {
      term: 'Pruebas de Sistema',
      enTerm: 'System Testing',
      category: 'Niveles',
      definition: 'Pruebas holísticas que evalúan el producto completo e integrado en un entorno que simula producción para validar los flujos de negocio de extremo a extremo (End-to-End).'
    },
    {
      term: 'Pruebas de Aceptación (UAT)',
      enTerm: 'User Acceptance Testing',
      category: 'Niveles',
      definition: 'Pruebas formales ejecutadas por clientes, usuarios de negocio o Product Owners para determinar si aceptan el sistema y autorizan su pase a producción.'
    },
    {
      term: 'Pruebas Funcionales',
      enTerm: 'Functional Testing',
      category: 'Tipos',
      definition: 'Pruebas basadas en la evaluación de las funciones que el sistema debe ejecutar de acuerdo a las especificaciones y reglas de negocio ("¿qué hace el sistema?").'
    },
    {
      term: 'Pruebas No Funcionales',
      enTerm: 'Non-Functional Testing',
      category: 'Tipos',
      definition: 'Pruebas que evalúan atributos de calidad del sistema, tales como rendimiento, escalabilidad, usabilidad, seguridad, accesibilidad y eficiencia de recursos ("¿cómo de bien lo hace?").'
    },
    {
      term: 'Pruebas de Regresión',
      enTerm: 'Regression Testing',
      category: 'Tipos',
      definition: 'Pruebas que verifican que modificaciones recientes en el código (nuevas funciones o corrección de defectos) no hayan provocado efectos secundarios indeseados en áreas previamente funcionales.'
    },
    {
      term: 'Pruebas de Confirmación (Re-testing)',
      enTerm: 'Confirmation Testing (Re-testing)',
      category: 'Tipos',
      definition: 'Ejecución del caso de prueba específico que falló anteriormente para confirmar que la corrección de un defecto implementada por el desarrollador resolvió el problema satisfactoriamente.'
    },
    {
      term: 'Pruebas Estáticas',
      enTerm: 'Static Testing',
      category: 'Técnicas',
      definition: 'Evaluación de productos de trabajo (requerimientos, código, diseños) realizada sin ejecutar el software, mediante revisiones humanas o herramientas de análisis estático (SAST).'
    },
    {
      term: 'Inspección Formal',
      enTerm: 'Formal Inspection',
      category: 'Técnicas',
      definition: 'El tipo más formal de revisión estática, basado en roles bien definidos (moderador, autor, lector, revisores), listas de comprobación estructuradas, reglas y métricas cuantitativas.'
    },
    {
      term: 'Walkthrough (Recorrido Guiado)',
      enTerm: 'Walkthrough',
      category: 'Técnicas',
      definition: 'Revisión técnica guiada por el autor del artefacto para explicar su lógica al equipo, recibir observaciones constructivas y llegar a un consenso sobre su contenido.'
    },
    {
      term: 'Partición de Equivalencia (EP)',
      enTerm: 'Equivalence Partitioning',
      category: 'Caja Negra',
      definition: 'Técnica de diseño de caja negra que divide el dominio de datos de entrada en clases válidas e inválidas, asumiendo que un valor de prueba representativo evalúa toda la partición.'
    },
    {
      term: 'Análisis de Valores Límite (BVA)',
      enTerm: 'Boundary Value Analysis',
      category: 'Caja Negra',
      definition: 'Técnica de diseño de caja negra que selecciona valores de prueba en los extremos de las clases de equivalencia (en el límite y justo antes o después) para maximizar la detección de errores de operador.'
    },
    {
      term: 'Tabla de Decisión',
      enTerm: 'Decision Table',
      category: 'Caja Negra',
      definition: 'Herramienta de diseño de pruebas estructurada en forma de matriz que mapea combinaciones lógicas complejas de condiciones (entradas) con sus acciones asociadas (salidas esperadas).'
    },
    {
      term: 'Pruebas de Transición de Estado',
      enTerm: 'State Transition Testing',
      category: 'Caja Negra',
      definition: 'Técnica de caja negra basada en un modelo de estados del sistema que evalúa cómo transita el software de un estado a otro ante eventos y entradas válidas e inválidas.'
    },
    {
      term: 'Pruebas Exploratorias',
      enTerm: 'Exploratory Testing',
      category: 'Experiencia',
      definition: 'Enfoque de prueba simultáneo donde el diseño, la ejecución y el aprendizaje ocurren en tiempo real, guiados por cartas de prueba (Charters) y la heurística del evaluador en sesiones delimitadas.'
    },
    {
      term: 'Criterios de Aceptación / Gherkin',
      enTerm: 'Acceptance Criteria / Gherkin',
      category: 'Metodología',
      definition: 'Condiciones que una historia de usuario debe satisfacer para ser aceptada por el Product Owner, comúnmente formuladas en sintaxis Dado/Cuando/Entonces (Given/When/Then).'
    }
  ],

  // Simulacro Oficial de Examen (10 Preguntas Razonadas ISTQB CTFL 4.0)
  exam: [
    {
      id: 1,
      questionNumber: 1,
      question: '¿Cuál es la diferencia fundamental entre el Aseguramiento de la Calidad (QA) y el Testing según el estándar ISTQB® CTFL 4.0?',
      options: [
        { key: 'A', text: 'QA es una actividad técnica que ejecutan los desarrolladores, mientras que el Testing lo ejecutan exclusivamente los usuarios finales.' },
        { key: 'B', text: 'QA es una disciplina proactiva orientada a procesos para prevenir defectos, mientras que el Testing es una actividad técnica orientada a encontrar discrepancias en el producto.' },
        { key: 'C', text: 'Testing y QA son términos perfectamente sinónimos que representan exactamente las mismas actividades operacionales.' },
        { key: 'D', text: 'QA se aplica únicamente al código fuente mediante compilación, mientras que el Testing evalúa solo la interfaz gráfica.' }
      ],
      correctAnswer: 'B',
      justification: 'Según ISTQB CTFL 4.0, el Aseguramiento de Calidad (QA) se enfoca de manera proactiva en los procesos de ingeniería para evitar la introducción de defectos, mientras que el Testing evalúa directamente los productos de trabajo para identificar discrepancias entre lo esperado y lo real.'
    },
    {
      id: 2,
      questionNumber: 2,
      question: 'Un equipo de desarrollo encuentra un defecto de ambigüedad en los requerimientos durante la primera semana del proyecto y lo corrige de inmediato en el texto de la historia de usuario. ¿Qué principio fundamental del testing se está aplicando con mayor claridad?',
      options: [
        { key: 'A', text: 'La paradoja del pesticida.' },
        { key: 'B', text: 'El testing exhaustivo es imposible.' },
        { key: 'C', text: 'El testing temprano ahorra tiempo y dinero (Shift-Left).' },
        { key: 'D', text: 'La falacia de la ausencia de errores.' }
      ],
      correctAnswer: 'C',
      justification: 'El principio de testing temprano (Shift-Left) establece que detectar y corregir defectos en fases tempranas (como en requerimientos) previene que se propaguen al código, ahorrando costos exponenciales en comparación con resolverlos en producción.'
    },
    {
      id: 3,
      questionNumber: 3,
      question: 'Durante seis meses consecutivos, un equipo ejecuta exactamente la misma suite automatizada de 200 casos de prueba sin modificar ni un solo paso. Aunque el software sigue evolucionando, la suite ya no descubre nuevos defectos. ¿Qué fenómeno o principio explica esta situación?',
      options: [
        { key: 'A', text: 'La falacia de la ausencia de errores.' },
        { key: 'B', text: 'La paradoja del pesticida.' },
        { key: 'C', text: 'El principio de agrupamiento de defectos de Pareto.' },
        { key: 'D', text: 'La imposibilidad del testing de caja blanca.' }
      ],
      correctAnswer: 'B',
      justification: 'La paradoja del pesticida postula que si se ejecutan siempre las mismas pruebas, el sistema se "inmuniza" contra ellas y dejarán de encontrar nuevos fallos. Los casos de prueba deben revisarse, modificarse y complementarse con nuevas pruebas periódicamente.'
    },
    {
      id: 4,
      questionNumber: 4,
      question: 'Un desarrollador corrige un bug reportado en el cálculo de impuestos de una factura. El tester ejecuta de inmediato el caso de prueba que originalmente falló para certificar que el cálculo ahora es correcto, y posteriormente ejecuta toda la suite de facturación para asegurar que otros cálculos no se vieron afectados. ¿Qué tipos de prueba ejecutó el tester en ese orden?',
      options: [
        { key: 'A', text: 'Pruebas Estáticas seguido de Pruebas de Estrés.' },
        { key: 'B', text: 'Pruebas de Aceptación (UAT) seguido de Pruebas de Integración.' },
        { key: 'C', text: 'Pruebas de Confirmación (Re-testing) seguido de Pruebas de Regresión.' },
        { key: 'D', text: 'Pruebas de Sistema seguido de Pruebas Unitarias.' }
      ],
      correctAnswer: 'C',
      justification: 'El Re-testing (prueba de confirmación) valida específicamente que el defecto corregido ya no ocurre. La prueba de regresión posterior verifica que los cambios introducidos no rompieron funcionalidades existentes en el resto del módulo.'
    },
    {
      id: 5,
      questionNumber: 5,
      question: '¿En cuál de los siguientes niveles de prueba se evalúa el comportamiento global del software completo de extremo a extremo, en un entorno que simula las condiciones reales de producción?',
      options: [
        { key: 'A', text: 'Pruebas de Componente (Unitarias).' },
        { key: 'B', text: 'Pruebas de Integración.' },
        { key: 'C', text: 'Pruebas de Sistema.' },
        { key: 'D', text: 'Pruebas Estáticas de Requerimientos.' }
      ],
      correctAnswer: 'C',
      justification: 'Las Pruebas de Sistema evalúan el producto completo e integrado para validar los flujos de negocio End-to-End bajo condiciones y configuraciones lo más parecidas posible a producción.'
    },
    {
      id: 6,
      questionNumber: 6,
      question: 'Un sistema bancario estipula la siguiente regla de negocio: "Un usuario debe tener una edad mayor o igual a 18 años para solicitar un crédito personal". Aplicando la técnica de Análisis de Valores Límite (BVA) de 2 o 3 valores, ¿cuáles son los valores numéricos críticos más adecuados para probar el límite inferior?',
      options: [
        { key: 'A', text: '0, 18 y 100.' },
        { key: 'B', text: '17, 18 y 19.' },
        { key: 'C', text: '10, 20 y 30.' },
        { key: 'D', text: '-1, 0 y 1.' }
      ],
      correctAnswer: 'B',
      justification: 'En Análisis de Valores Límite para la condición edad >= 18, el borde es 18. Los valores críticos adyacentes son 17 (justo antes, inválido), 18 (en el límite, válido) y 19 (justo después, válido). Es allí donde estadísticamente ocurren los errores de programación.'
    },
    {
      id: 7,
      questionNumber: 7,
      question: '¿Cuál es el tipo de revisión estática más formal y riguroso, caracterizado por contar con roles bien definidos como Moderador, Autor, Lector y Revisores, y que utiliza listas de comprobación y métricas de defectos obligatorias?',
      options: [
        { key: 'A', text: 'Revisión Informal entre pares.' },
        { key: 'B', text: 'Walkthrough (Recorrido Guiado).' },
        { key: 'C', text: 'Inspección Técnica.' },
        { key: 'D', text: 'Prueba Exploratoria en Time-box.' }
      ],
      correctAnswer: 'C',
      justification: 'La Inspección es el proceso de revisión estática de máxima formalidad según ISTQB, con roles establecidos, moderación independiente, listas de verificación formales y recolección de métricas de calidad.'
    },
    {
      id: 8,
      questionNumber: 8,
      question: 'En el ciclo de vida del defecto, un desarrollador soluciona un bug y lo mueve a estado "Resuelto". El analista de QA despliega la build y vuelve a ejecutar el caso de prueba, encontrando que la falla persiste exactamente igual. ¿A qué estado debe cambiar el defecto?',
      options: [
        { key: 'A', text: 'Cerrado (Closed).' },
        { key: 'B', text: 'Reabierto (Reopened).' },
        { key: 'C', text: 'Nuevo (New).' },
        { key: 'D', text: 'Descartado (Rejected).' }
      ],
      correctAnswer: 'B',
      justification: 'Cuando la prueba de confirmación falla porque el defecto continúa manifestándose, el flujo formal del ciclo de vida del bug exige transicionar su estado a Reabierto (Reopened), documentando la evidencia del fallo.'
    },
    {
      id: 9,
      questionNumber: 9,
      question: '¿Cuál es una ventaja arquitectónica fundamental de frameworks modernos de automatización como Playwright y Cypress en comparación con la arquitectura tradicional de Selenium WebDriver?',
      options: [
        { key: 'A', text: 'Eliminan por completo la necesidad de tener casos de prueba diseñados.' },
        { key: 'B', text: 'Se ejecutan más cerca del motor del navegador y pueden interceptar el tráfico de red de forma nativa, lo que reduce sustancialmente los flaky tests.' },
        { key: 'C', text: 'Funcionan únicamente en computadoras de alto rendimiento sin conexión a internet.' },
        { key: 'D', text: 'Garantizan matemáticamente que el software estará 100% libre de defectos en producción.' }
      ],
      correctAnswer: 'B',
      justification: 'Cypress y Playwright se integran a menor distancia del ciclo de eventos del navegador o usan protocolos directos (CDP/WebSockets), permitiendo control de red nativo, auto-waiting inteligente y eliminando la latencia HTTP de WebDriver que solía causar falsos positivos o pruebas intermitentes.'
    },
    {
      id: 10,
      questionNumber: 10,
      question: 'Un analista de pruebas descubre un defecto crítico provocado por un descuido evidente del programador líder. Considerando la psicología de las pruebas y la comunicación empática, ¿cuál es la mejor forma de actuar?',
      options: [
        { key: 'A', text: 'Publicar el error en un canal general de la empresa para evidenciar la falta de atención del programador.' },
        { key: 'B', text: 'Redactar un reporte de bug objetivo, neutro y detallado con pasos reproducibles y evidencias técnicas, enfocándose en la calidad del producto y no en la persona.' },
        { key: 'C', text: 'Ocultar el defecto para no crear tensión interpersonal con el equipo de desarrollo.' },
        { key: 'D', text: 'Corregir el código fuente directamente sin avisar al equipo de desarrollo.' }
      ],
      correctAnswer: 'B',
      justification: 'La psicología del testing enseña que los defectos deben comunicarse con objetividad y empatía, documentando hechos comprobables y sin emitir juicios sobre la persona. Esto construye confianza y fomenta la corresponsabilidad en la calidad del producto.'
    }
  ]
};
