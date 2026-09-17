export interface ComponenteMesa {
  id: string;
  nombre: string;
  subtitulo: string;
  categoria: string;
  icono: string;
  centro: {
    xPercent: number;
    yPercent: number;
  };
  zoomScale: number;
  svgPolygon: string; // Coordenadas en viewBox 0 0 1024 576
  resumenRapido: string;
  queEs: string;
  queFuncionTiene: string;
  medidas: {
    estandar: string;
    dimensiones: string;
    descripcion: string;
  };
  conectores: string[];
  conQueSeConecta: {
    componente: string;
    tipoConexion: string;
    explicacion: string;
  }[];
  tamanoYPeso: {
    tamanoPromedio: string;
    pesoPromedio: string;
    detalle: string;
  };
  consejoTecnico: string;
}

export const COMPONENTES_MESA: ComponenteMesa[] = [
  {
    id: "placa-madre",
    nombre: "Placa Madre (Motherboard)",
    subtitulo: "La columna vertebral y sistema nervioso central del ensamble",
    categoria: "Circuito Maestro",
    icono: "CircuitBoard",
    centro: {
      xPercent: 46.5,
      yPercent: 57.5,
    },
    zoomScale: 2.3,
    svgPolygon: "348,272 566,260 614,395 348,414",
    resumenRapido: "Plataforma central que interconecta y alimenta la CPU, GPU, RAM y almacenamiento. Define la compatibilidad del socket y la estabilidad eléctrica.",
    queEs: "La placa madre (o motherboard) es el circuito impreso maestro multicapa de fibra de vidrio y cobre que aloja y conecta físicamente todos los componentes del computador entre sí. Es la base que determina qué procesadores, generaciones de memoria RAM y tarjetas puedes instalar.",
    queFuncionTiene: "Actúa como distribuidora de energía limpia y autopista de datos. Transporta millones de señales por segundo entre el procesador, las memorias RAM, la tarjeta de video y las unidades de almacenamiento a través de pistas de cobre microscópicas de alta frecuencia. Sus fases de poder (VRM) regulan los voltajes convirtiendo los 12V de la fuente a voltajes milimétricos (aprox. 1.1V a 1.35V) para el procesador; elegir una placa con buen disipador térmico en los VRM evita caídas de frecuencia por sobrecalentamiento.",
    medidas: {
      estandar: "Formatos ATX, Micro-ATX (mATX) y Mini-ITX",
      dimensiones: "ATX: 305 × 244 mm | mATX: 244 × 244 mm | Mini-ITX: 170 × 170 mm",
      descripcion: "El formato estándar ATX es el más popular por ofrecer mayor cantidad de puertos y ranuras M.2 con disipación.",
    },
    conectores: [
      "Socket del Procesador (AM5 para AMD Ryzen o LGA1851/1700 para Intel)",
      "2 a 4 ranuras DIMM para memoria RAM DDR5 o DDR4 (incompatibles entre sí)",
      "1 a 3 ranuras PCIe x16 blindadas con acero para Tarjetas Gráficas",
      "2 a 5 ranuras M.2 NVMe (PCIe 4.0 / PCIe 5.0) para almacenamiento ultrarrápido",
      "Conector de alimentación ATX principal de 24 pines",
      "Conectores EPS de 8+8 pines (alimentación suplementaria para la CPU)",
      "Cabezales para ventiladores (PWM de 4 pines), bombas AIO, ARGB (3 pines 5V) y panel frontal USB-C",
    ],
    conQueSeConecta: [
      {
        componente: "Procesador (CPU)",
        tipoConexion: "Socket central con palanca ILM",
        explicacion: "Se inserta plano sobre la matriz de pines dorados y se bloquea con el anclaje de tensión sin forzar.",
      },
      {
        componente: "Tarjeta Gráfica (GPU)",
        tipoConexion: "Ranura PCIe x16 principal (blindada con acero)",
        explicacion: "Se encaja directamente en la primera ranura PCIe para máxima velocidad sin latencia añadida.",
      },
      {
        componente: "Memoria RAM",
        tipoConexion: "Ranuras DIMM con pestillos",
        explicacion: "Se instalan verticalmente en las ranuras alternas (canales A2 y B2) para activar Dual Channel.",
      },
      {
        componente: "Almacenamiento SSD M.2",
        tipoConexion: "Ranura M.2 Key-M + tornillo/pestillo",
        explicacion: "Se conecta en ángulo de 30 grados y queda prensado bajo los disipadores de aluminio.",
      },
      {
        componente: "Fuente de Poder (PSU)",
        tipoConexion: "Cable ATX 24 pines + EPS 8 pines",
        explicacion: "Suministra energía regulada a todas las pistas y fases de poder de la placa.",
      },
      {
        componente: "Gabinete (Chasis)",
        tipoConexion: "Tornillos sobre separadores de latón (standoffs)",
        explicacion: "Asegura la placa al chasis evitando cortocircuitos con la lámina metálica trasera.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "30.5 cm de largo × 24.4 cm de ancho × 4.5 cm de alto (con disipadores VRM)",
      pesoPromedio: "1.2 kg a 2.2 kg",
      detalle: "Las placas de gama alta con armaduras metálicas completas, backplate y disipadores de cobre macizo son notablemente más pesadas.",
    },
    consejoTecnico: "1) REGLA DE COMPATIBILIDAD: El socket físico debe coincidir al 100% con tu CPU (AMD Ryzen 9000/7000 requiere Socket AM5; Intel Core Ultra serie 200 requiere Socket LGA1851). No existen adaptadores. 2) Instala siempre el procesador, las memorias RAM y el SSD M.2 sobre la caja de la placa madre antes de atornillarla en el gabinete: trabajarás con total holgura y comodidad.",
  },
  {
    id: "procesador",
    nombre: "Procesador (CPU)",
    subtitulo: "La Unidad Central de Procesamiento y cerebro matemático",
    categoria: "Cálculo y Lógica",
    icono: "Cpu",
    centro: {
      xPercent: 28.0,
      yPercent: 75.5,
    },
    zoomScale: 3.1,
    svgPolygon: "232,420 316,396 342,448 258,474",
    resumenRapido: "El cerebro de tu equipo: ejecuta la lógica, físicas de colisión e IA de juegos. Para jugar, la velocidad por núcleo y el 3D V-Cache importan mucho más que tener 24 núcleos de oficina.",
    queEs: "La CPU (Central Processing Unit) es un chip de silicio de escala nanométrica que concentra miles de millones de transistores microscópicos en un área menor al tamaño de una caja de fósforos. Es el motor de cálculo secuencial que coordina todo el hardware.",
    queFuncionTiene: "Interpreta y ejecuta todas las instrucciones del sistema operativo, calcula la física de los juegos (trayectorias, colisiones, lógica de personajes no jugadores), sincroniza los periféricos y despacha cada fotograma a la tarjeta gráfica. [TRAMPA DE LOS NÚCLEOS]: En gaming, un procesador moderno de 6 a 8 núcleos de alta frecuencia y gran caché L3 (como la tecnología 3D V-Cache de AMD en la serie Ryzen X3D) supera ampliamente a procesadores de 16 a 24 núcleos diseñados para productividad y oficinas.",
    medidas: {
      estandar: "Encapsulado LGA (Land Grid Array) o BGA",
      dimensiones: "Aprox. 45 × 37.5 mm (Intel) / 40 × 40 mm (AMD AM5)",
      descripcion: "El grosor total del sustrato de PCB junto con el difusor térmico metálico (IHS) ronda los 4.5 mm.",
    },
    conectores: [
      "Matriz de contactos dorados en la cara inferior (1718 almohadillas en AM5, 1851 o 1700 en Intel)",
      "No lleva cables externos; toda la energía y los buses de datos PCIe/DDR fluyen por los pines del socket.",
    ],
    conQueSeConecta: [
      {
        componente: "Placa Madre",
        tipoConexion: "Socket LGA mediante mecanismo de palanca de retención",
        explicacion: "Hace contacto milimétrico sobre los pines elásticos del socket sin requerir soldadura.",
      },
      {
        componente: "Disipador / Cooler",
        tipoConexion: "Contacto térmico superficial mediante pasta térmica",
        explicacion: "Su difusor de cobre niquelado (IHS) transfiere directamente el calor al disipador de aire o bloque líquido.",
      },
      {
        componente: "Memoria RAM y GPU",
        tipoConexion: "Líneas de comunicación PCIe y controlador de memoria integrado (IMC)",
        explicacion: "El procesador se comunica de forma directa con los módulos RAM y la primera ranura PCIe x16 a velocidades astronómicas.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "4.5 cm × 3.75 cm × 0.45 cm",
      pesoPromedio: "28 g a 42 g",
      detalle: "Extremadamente denso y rígido gracias a su difusor térmico de cobre sólido soldado con indio al silicio interior.",
    },
    consejoTecnico: "1) ¡Cuidado al insertar!: Alinea con precisión el triángulo dorado marcado en una de las esquinas del procesador con la marca del socket antes de bajar la palanca sin forzar; los pines del socket son microscópicos y jamás deben tocarse con los dedos. 2) Revisa si tu CPU incluye disipador de fábrica (Box) o si requiere disipador dedicado: procesadores con TDP superior a 65W-105W necesitan disipador de doble torre o líquida para evitar Thermal Throttling.",
  },
  {
    id: "tarjeta-grafica",
    nombre: "Tarjeta Gráfica Dedicada (GPU)",
    subtitulo: "El motor de cómputo visual 3D, trazado de rayos e IA",
    categoria: "Procesamiento Gráfico",
    icono: "Layers",
    centro: {
      xPercent: 18.6,
      yPercent: 59.9,
    },
    zoomScale: 2.1,
    svgPolygon: "30,358 266,270 348,318 114,432",
    resumenRapido: "La pieza más determinante para jugar: genera los fotogramas en pantalla (FPS), texturas, reflejos y trazado de rayos (Ray Tracing) en tiempo real.",
    queEs: "Es un subsistema de computación completo dentro de tu PC: cuenta con un procesador gráfico paralelo con miles de núcleos de sombreado, memoria VRAM de ancho de banda masivo (GDDR6/GDDR7) y un masivo radiador de calor con ventiladores axiales.",
    queFuncionTiene: "Calcula y proyecta los mundos tridimensionales de tus videojuegos. Ejecuta trazado de rayos (Ray Tracing), escalado y generación de fotogramas asistida por IA (DLSS 3.5/4.0 o FSR) y procesa renderizado de video. [GUÍA DE VRAM SEGÚN RESOLUCIÓN]: Para 1080p competitivo bastan 8 GB a 12 GB; para 1440p (el sweet spot gamer de 2026) se recomiendan 12 GB a 16 GB; y para 4K con texturas ultra y Ray Tracing se requieren 16 GB a 24 GB de VRAM para evitar micro-tirones.",
    medidas: {
      estandar: "Factor de forma PCIe de 2, 2.5 o 3.5 ranuras de grosor",
      dimensiones: "Modelos compactos: 200 - 245 mm | Modelos triple ventilador: 300 - 345 mm de largo",
      descripcion: "El grosor oscila entre 40 mm y 72 mm; el ancho suele ser de 125 a 150 mm.",
    },
    conectores: [
      "Conector de borde PCIe x16 dorado de 4ª o 5ª generación (interfaz con la placa base)",
      "Conector de alimentación de alta potencia 12V-2x6 (16 pines) o conectores PCIe tradicionales de 8 pines",
      "Salidas de video: 3x DisplayPort 2.1 / 1.4a y 1x HDMI 2.1a para monitores de alta tasa de refresco (144Hz a 540Hz)",
    ],
    conQueSeConecta: [
      {
        componente: "Placa Madre",
        tipoConexion: "Ranura PCIe x16 principal reforzada",
        explicacion: "Se inserta firmemente hasta que la pestaña posterior de seguridad trabe la tarjeta.",
      },
      {
        componente: "Gabinete (Chasis)",
        tipoConexion: "Tornillos en la bahía de expansión trasera",
        explicacion: "Se atornilla en las ranuras metálicas traseras para soportar el peso de la tarjeta.",
      },
      {
        componente: "Fuente de Poder (PSU)",
        tipoConexion: "Cable PCIe dedicado o conector directo 12V-2x6 de 450W/600W",
        explicacion: "Recibe corriente directa para alimentar los circuitos VRM de la GPU y la memoria VRAM.",
      },
      {
        componente: "Monitor(es)",
        tipoConexion: "Cables DisplayPort o HDMI",
        explicacion: "¡Siempre conecta el cable de video a la tarjeta gráfica y no a la placa madre!",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "31.0 cm de largo × 13.5 cm de ancho × 6.2 cm de espesor",
      pesoPromedio: "1.2 kg a 2.4 kg",
      detalle: "Los disipadores de cámara de vapor y aletas densas hacen que las tarjetas de gama alta pesen más de 2 kilogramos.",
    },
    consejoTecnico: "1) ¡ERROR NOVATO NÚMERO UNO!: Conecta SIEMPRE el cable HDMI o DisplayPort a los puertos de la tarjeta gráfica y NUNCA a la placa madre; de lo contrario, jugarás con los gráficos integrados lentos en lugar de tu GPU. 2) Si tu GPU mide más de 28 cm o pesa más de 1.2 kg, usa siempre un soporte antidescolgamiento (bracket) para evitar tensionar la ranura PCIe. 3) No compres una GPU de $1,000 USD si tienes un monitor de 60Hz de oficina.",
  },
  {
    id: "memoria-ram",
    nombre: "Memoria RAM (DDR5 / DDR4)",
    subtitulo: "La mesa de trabajo de ultra-alta velocidad y baja latencia",
    categoria: "Memoria Volátil",
    icono: "Binary",
    centro: {
      xPercent: 50.8,
      yPercent: 81.5,
    },
    zoomScale: 2.7,
    svgPolygon: "398,426 598,406 622,504 406,532",
    resumenRapido: "Mesa de trabajo de ultra-alta velocidad. Carga texturas y datos inmediatos para acceso en nanosegundos evitando micro-tirones.",
    queEs: "La memoria de acceso aleatorio (RAM) está compuesta por chips semiconductores que retienen temporalmente los datos con los que el procesador está trabajando de forma activa mientras el equipo está encendido.",
    queFuncionTiene: "Elimina los tiempos de espera transfiriendo datos entre el SSD y la CPU/GPU en nanosegundos. [¿CUÁNTA RAM EN 2026?]: 32 GB (2x16GB) en Dual Channel es el estándar indispensable; juegos modernos como Cyberpunk o Starfield consumen fácilmente 14-16 GB por sí solos, por lo que 16 GB causa congelamientos por paginación en disco (swap) si tienes Discord o navegador abierto. 64 GB solo se justifica para edición 4K/8K o 3D. Las memorias DDR5 y DDR4 son físicamente incompatibles entre sí.",
    medidas: {
      estandar: "Módulo DIMM de 288 pines (para computadoras de escritorio)",
      dimensiones: "133.35 mm de largo × 31.25 a 44 mm de alto (según disipador y difusor RGB)",
      descripcion: "El grosor es de aproximadamente 6.5 a 8 mm por módulo con disipador de aluminio.",
    },
    conectores: [
      "Conector de borde dorado de 288 pines con muesca asimétrica de seguridad",
      "No lleva ningún cable externo; toma alimentación (1.1V a 1.45V) y reloj directamente de la ranura de la placa.",
    ],
    conQueSeConecta: [
      {
        componente: "Placa Madre",
        tipoConexion: "Ranuras DIMM con pestillos basculantes",
        explicacion: "Se presiona verticalmente en las ranuras alternadas recomendadas (normalmente ranuras 2 y 4) para activar Dual Channel.",
      },
      {
        componente: "Disipador de CPU",
        tipoConexion: "Espacio de despeje físico (RAM Clearance)",
        explicacion: "Verifica que la altura de los módulos no choque con el ventilador delantero de un disipador de aire grande.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "13.3 cm × 4.2 cm × 0.7 cm por módulo",
      pesoPromedio: "45 g a 70 g por módulo",
      detalle: "Los disipadores térmicos de aluminio anodizado con barras difusoras de luz LED RGB aportan el peso característico.",
    },
    consejoTecnico: "1) ¡Instala siempre en las ranuras 2 y 4 (A2 y B2)! Instalar en ranuras contiguas desactiva el Dual Channel reduciendo el ancho de banda a la mitad. 2) ¡ACTIVA XMP/EXPO EN BIOS!: Al encender tu PC por primera vez, entra a la BIOS y activa el perfil XMP (Intel) o EXPO (AMD); de lo contrario, funcionará a la frecuencia mínima base perdiendo hasta un 15-20% de rendimiento.",
  },
  {
    id: "disipador-cpu",
    nombre: "Disipador de CPU (Cooler de Aire / AIO)",
    subtitulo: "Evacuación de calor para mantener la CPU en frecuencias máximas",
    categoria: "Refrigeración Térmica",
    icono: "Fan",
    centro: {
      xPercent: 65.5,
      yPercent: 48.0,
    },
    zoomScale: 2.4,
    svgPolygon: "576,214 728,210 736,342 582,342",
    resumenRapido: "Absorbe los más de 80W-250W de calor del procesador y los expulsa con ventiladores axiales.",
    queEs: "Es un radiador térmico compuesto por una base pulida de cobre, múltiples tuberías de calor sinterizadas (heatpipes rellenas de fluido capilar) y una torre masiva con decenas de aletas ultrafinas de aluminio.",
    queFuncionTiene: "Evita el estrangulamiento térmico (Thermal Throttling) y la degradación del procesador. [AIRE VS LÍQUIDA AIO]: Un disipador de aire de doble torre (como Thermalright Peerless Assassin o Noctua NH-D15) es eterno: no tiene bomba mecánica que pueda fallar ni líquido que se evapore tras 4-5 años, siendo ideal para CPUs de hasta 180W. Las líquidas (AIO de 240/360mm) son recomendables para CPUs de gama extrema (>200W como i9 / Ryzen 9) o gabinetes compactos donde un disipador de 160 mm chocaría con el vidrio.",
    medidas: {
      estandar: "Torre simple o torre doble (Dual Tower) con ventiladores de 120 mm o 140 mm",
      dimensiones: "Altura: 154 a 165 mm | Ancho: 125 a 140 mm | Profundidad: 110 a 145 mm",
      descripcion: "La altura es la medida crítica: debe caber holgadamente dentro del ancho del gabinete.",
    },
    conectores: [
      "1 o 2 conectores de 4 pines PWM para ventilador (se conectan a CPU_FAN y CPU_OPT)",
      "1 conector ARGB estándar de 3 pines (5V) para iluminación sincronizada con la placa",
    ],
    conQueSeConecta: [
      {
        componente: "Procesador (CPU)",
        tipoConexion: "Base de cobre a presión con pasta térmica intermedia",
        explicacion: "La pasta térmica sella las micro-imperfecciones microscópicas del metal para que no quede aire atrapado.",
      },
      {
        componente: "Placa Madre",
        tipoConexion: "Backplate metálico trasero y puentes de fijación roscados",
        explicacion: "Distribuye la fuerza de apriete uniformemente en las cuatro esquinas del socket.",
      },
      {
        componente: "Cabezales de ventilador",
        tipoConexion: "Conector PWM de 4 pines",
        explicacion: "Permite a la placa madre variar las revoluciones por minuto (RPM) de silencioso a máximo según la temperatura.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "16.0 cm de altura × 13.0 cm de ancho × 13.5 cm de fondo",
      pesoPromedio: "850 g a 1,450 g",
      detalle: "Los disipadores de doble torre con 6 a 8 heatpipes de cobre y ventiladores dobles superan el kilogramo de peso.",
    },
    consejoTecnico: "1) ¡PELÍCULA TRANSPARENTE 'PEEL OFF'!: Revisa siempre la base de cobre antes de atornillar; los disipadores traen una lámina plástica de fábrica con la advertencia de quitarla. Si la dejas puesta, la CPU llegará a 100°C en segundos. 2) Aplica pasta térmica del tamaño de un guisante (o cruz fina) en el centro del procesador; no la esparzas con los dedos para evitar burbujas de aire.",
  },
  {
    id: "almacenamiento-ssd",
    nombre: "SSD NVMe M.2 PCIe 4.0 / PCIe 5.0 (Almacenamiento)",
    subtitulo: "Almacenamiento de estado sólido ultrarrápido (5,000 a 14,700 MB/s) sin partes móviles",
    categoria: "Almacenamiento Permanente",
    icono: "HardDrive",
    centro: {
      xPercent: 68.8,
      yPercent: 66.2,
    },
    zoomScale: 3.1,
    svgPolygon: "604,368 766,346 788,382 626,412",
    resumenRapido: "Velocidades extremas de lectura/escritura (5,000 a 7,450 MB/s en Gen4 como Samsung 990 PRO y WD_BLACK SN850X, hasta 14,700 MB/s en Gen5). Inicia Windows en 4 segundos y carga mapas de juegos al instante con DirectStorage.",
    queEs: "Es una unidad de almacenamiento permanente ultracompacta en formato M.2 construida con módulos de memoria flash 3D NAND (TLC de 176 a 232 capas) y un microprocesador controlador multicore con memoria caché DRAM dedicada (o HMB: Host Memory Buffer). A diferencia de los discos duros mecánicos tradicionales (HDD) limitados a 150 MB/s con platos magnéticos giratorios y agujas lectoras sensibles a vibraciones, o los antiguos SSD SATA limitados a 560 MB/s, un SSD NVMe se comunica directamente con las pistas PCI Express del procesador alcanzando anchos de banda colosales.",
    queFuncionTiene: "Alberga de forma permanente el sistema operativo Windows, aplicaciones pesadas y toda tu biblioteca de videojuegos. En juegos modernos aprovecha la API Microsoft DirectStorage para descompresión de assets y texturas de alta resolución directamente en la tarjeta gráfica (VRAM) mediante DMA sin saturar la CPU, eliminando pantallas de carga y el molesto 'pop-in' de texturas en mundos abiertos. Su durabilidad se mide en TBW (Total Bytes Escritos): los modelos de 1TB a 4TB soportan entre 600 y 2,400 Terabytes de escritura continua.",
    medidas: {
      estandar: "Factor de forma M.2 2280 (22 mm de ancho × 80 mm de largo, estándar universal en PC gaming)",
      dimensiones: "22 mm de ancho × 80 mm de largo × 2.38 mm de grosor (simple cara) o hasta 12 - 15 mm (con disipador de aletas)",
      descripcion: "El estándar 2280 es el compatible con prácticamente el 100% de placas base de escritorio. Existen formatos más cortos como 2230 (30 mm) y 2242 (42 mm) reservados para consolas portátiles (Steam Deck, ROG Ally) y ultrabooks ultradelgados.",
    },
    conectores: [
      "Conector de borde M.2 'Key M' con muesca en pines 59-66 y 75 pines dorados sobre interfaz PCIe 4.0/5.0 x4",
      "Punto de anclaje semicircular posterior para tornillo milimétrico M2 × 3mm o cierre rápido giratorio EZ-Latch / Q-Latch sin herramientas",
      "Almohadilla térmica (Thermal Pad) de silicona de alta conductividad (5 a 8 W/mK) que contacta con el disipador metálico de la placa base",
      "No requiere cables de poder ni SATA: recibe la alimentación eléctrica limpia de 3.3V y todas las líneas de datos directo desde la ranura de la placa",
    ],
    conQueSeConecta: [
      {
        componente: "Placa Madre",
        tipoConexion: "Ranura M.2 PCIe Gen4 / Gen5 x4 primaria",
        explicacion: "Se conecta en ángulo inclinado de 30 grados hasta encajar firmemente en los contactos dorados, bajándose plano para ser fijado.",
      },
      {
        componente: "Disipador de la Placa (M.2 Shield / Armor)",
        tipoConexion: "Disipador de aleación de aluminio con Thermal Pad preinstalado",
        explicacion: "Drena el calor del chip controlador (que puede superar los 75°C en transferencias continuas) hacia el flujo de aire del gabinete para evitar Thermal Throttling.",
      },
      {
        componente: "Procesador (CPU)",
        tipoConexion: "4 carriles PCIe dedicados punto a punto",
        explicacion: "La ranura M2_1 principal comunica directamente con el silicio de la CPU con una latencia de apenas unos microsegundos sin pasar por el chipset.",
      },
      {
        componente: "Tarjeta Gráfica (GPU)",
        tipoConexion: "Comunicación de datos directa vía Microsoft DirectStorage",
        explicacion: "Vuelca texturas y modelos 3D directamente a la memoria VRAM de la gráfica en tiempo real.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "8.0 cm de largo × 2.2 cm de ancho × 0.24 cm de alto (sin disipador)",
      pesoPromedio: "8 gramos (hasta 45 gramos con disipador metálico pasivo)",
      detalle: "Increíblemente ligero y compacto: pesa apenas un 1% de lo que pesaba un disco duro mecánico tradicional de 3.5 pulgadas (700 gramos).",
    },
    consejoTecnico: "1) ¡REGLA DE ORO DE MONTAJE!: Antes de atornillar el disipador metálico de tu placa base sobre el SSD M.2, retira SIEMPRE la película plástica protectora transparente o azul que cubre la almohadilla térmica (Thermal Pad). Si la dejas puesta, el plástico actúa como aislante térmico y el SSD superará los 85°C sufriendo estrangulamiento térmico y caídas drásticas de velocidad. 2) Instala siempre el SSD principal con el sistema operativo en la ranura M.2 superior (M2_1 más cercana al socket): es la que cuenta con 4 carriles PCIe directos a la CPU.",
  },
  {
    id: "fuente-poder",
    nombre: "Fuente de Poder (PSU Corsair)",
    subtitulo: "El corazón eléctrico que distribuye voltajes limpios y protegidos",
    categoria: "Suministro Eléctrico",
    icono: "Zap",
    centro: {
      xPercent: 88.5,
      yPercent: 71.5,
    },
    zoomScale: 2.3,
    svgPolygon: "798,348 958,336 996,448 834,488",
    resumenRapido: "Transforma la corriente de la pared en voltajes seguros de 12V, 5V y 3.3V para cada pieza.",
    queEs: "Es el convertidor eléctrico de alta eficiencia de tu equipo. Transforma la corriente alterna (110V/220V AC) del tomacorriente doméstico en múltiples líneas de corriente continua (DC) perfectamente filtradas y reguladas.",
    queFuncionTiene: "Alimenta todos los circuitos de la computadora con energía estable. [80+ GOLD Y CÁLCULO DE WATTS]: 80 Plus Gold garantiza que al menos el 90% de la energía se aprovecha como corriente útil (disipando menos del 10% en calor). Para calcular tu fuente ideal: suma el TDP máximo de tu CPU + GPU + 100W de ventiladores/discos, y añade siempre un margen de 150W a 200W (o 25%) para absorber los picos transitorios (transient spikes) de microsegundos sin apagones. Las fuentes modernas ATX 3.1 / PCIe 5.1 traen conector nativo 12V-2x6 para GPUs.",
    medidas: {
      estandar: "Formato ATX estándar (compatible con el 95% de gabinetes)",
      dimensiones: "150 mm de ancho × 86 mm de alto × 140 a 160 mm de profundidad (o 180 mm en modelos de 1000W+)",
      descripcion: "Las fuentes modulares permiten conectar únicamente los cables que vas a usar, despejando el interior del chasis.",
    },
    conectores: [
      "1x Conector ATX principal de 24 pines (para la placa base)",
      "1 o 2x Conectores EPS 12V de 8 pines (4+4) para la alimentación del CPU",
      "1x Conector nativo 12V-2x6 / 12VHPWR (PCIe Gen 5) para tarjetas gráficas modernas",
      "Varios conectores PCIe tradicionales de 6+2 pines",
      "Líneas de cables SATA y periféricos Molex para ventiladores y controladores RGB",
      "Toma de corriente C14 externa con interruptor de corte físico I/O",
    ],
    conQueSeConecta: [
      {
        componente: "Gabinete (Chasis)",
        tipoConexion: "4 tornillos hexagonales estándar en la parte trasera inferior",
        explicacion: "Queda fijada en el túnel inferior (PSU Shroud) con su ventilador apuntando hacia el filtro antipolvo inferior.",
      },
      {
        componente: "Placa Madre y Componentes",
        tipoConexion: "Mazo de cables modulares de alimentación",
        explicacion: "Distribuye los cables individuales organizados por detrás de la bandeja del gabinete.",
      },
      {
        componente: "Red Eléctrica Doméstica",
        tipoConexion: "Cable de corriente de pared C13 con toma a tierra",
        explicacion: "Recomendamos siempre conectar la fuente a un supresor de picos o UPS/SAI con regulador de voltaje.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "15.0 cm de ancho × 14.0 cm de fondo × 8.6 cm de alto",
      pesoPromedio: "1.7 kg a 2.6 kg",
      detalle: "Los pesados transformadores magnéticos de cobre, bobinas de choque y disipadores internos de aluminio determinan su solidez.",
    },
    consejoTecnico: "1) ¡PELIGRO CON CABLES MODULARES!: Nunca uses cables modulares de una fuente de poder en otra marca o modelo diferente, aunque el conector calce físicamente. Las patillas internas (pinouts) varían entre marcas y quemarías la placa madre o la GPU al instante. 2) Exige siempre protecciones industriales certificadas: OVP (sobrevoltaje), UVP (bajovoltaje), OCP (sobrecorriente), SCP (cortocircuito) y OTP (sobrecalentamiento).",
  },
  {
    id: "gabinete",
    nombre: "Gabinete (Chasis / Case Blanco)",
    subtitulo: "La estructura arquitectónica, soporte y túnel de ventilación",
    categoria: "Chasis y Estructura",
    icono: "Box",
    centro: {
      xPercent: 85.0,
      yPercent: 36.5,
    },
    zoomScale: 2.1,
    svgPolygon: "754,142 872,74 964,152 846,354 756,336",
    resumenRapido: "Estructura de acero y vidrio templado que protege los componentes y dirige el flujo de aire.",
    queEs: "Es la caja estructural construida en acero electrogalvanizado (SPCC), aleaciones de aluminio y paneles panorámicos de vidrio templado que alberga y protege todos los órganos internos del equipo.",
    queFuncionTiene: "Define el túnel de refrigeración aerodinámica ('Airflow'). Sus ventiladores frontales ingresan aire fresco del ambiente hacia la tarjeta de video y el procesador, mientras que los ventiladores superior y trasero expulsan el aire caliente acumulado. [PRESIÓN POSITIVA]: Configura siempre más ventiladores ingresando aire con filtro (intake) que expulsando (exhaust); esto crea una sobrepresión que expulsa el aire por las rendijas e impide que el polvo ingrese pasivamente.",
    medidas: {
      estandar: "Mid-Tower (Semitorre ATX) o Full-Tower",
      dimensiones: "Alto: 450 a 490 mm | Ancho: 215 a 235 mm | Profundidad: 440 a 480 mm",
      descripcion: "Ofrece espacio suficiente para disipadores de CPU de hasta 170 mm de alto y GPUs de hasta 380 mm de largo.",
    },
    conectores: [
      "Cable F_PANEL (Power SW, Reset SW, Power LED, HDD LED) para el botón de encendido frontal",
      "Conector interno USB 3.0 (19 pines) y conector USB-C Type-E de alta velocidad",
      "Cable interno HD_AUDIO para el conector combinado jack de auriculares y micrófono",
      "Controlador o splitter PWM/ARGB para los ventiladores preinstalados",
    ],
    conQueSeConecta: [
      {
        componente: "Placa Madre",
        tipoConexion: "Postes separadores de latón (standoffs) con tornillos M3 / 6-32",
        explicacion: "Aísla eléctricamente la placa del chasis para evitar cualquier masa o cortocircuito.",
      },
      {
        componente: "Fuente de Poder (PSU)",
        tipoConexion: "Compartimento inferior con almohadillas antivibración",
        explicacion: "La aísla del compartimento principal para que su calor no afecte a la GPU.",
      },
      {
        componente: "Ventiladores y Radiadores",
        tipoConexion: "Rieles con múltiples posiciones de montaje para ventiladores de 120 mm y 140 mm",
        explicacion: "Permite instalar configuraciones de presión positiva de aire para evitar la entrada pasiva de polvo.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "46.5 cm de alto × 22.0 cm de ancho × 45.0 cm de fondo",
      pesoPromedio: "6.8 kg a 11.5 kg (vacío, con panel de vidrio templado)",
      detalle: "Una vez ensamblados todos los componentes, el computador completo suele alcanzar entre 12 y 16 kilogramos de peso.",
    },
    consejoTecnico: "1) Prioriza siempre frontales de malla perforada (Mesh) en vez de vidrio sellado: la diferencia en la GPU puede ser de hasta 15°C a 20°C a favor del mesh. 2) ¡Comprueba el espacio libre de GPU!: Si instalas un radiador de refrigeración líquida al frente, resta 52 a 55 mm al largo máximo permitido de GPU para que no choque.",
  },
  {
    id: "asistente-felino",
    nombre: "Ranbisho Supervisor (Easter Egg)",
    subtitulo: "El inspector de calidad más exigente del laboratorio",
    categoria: "Soporte Moral",
    icono: "Cat",
    centro: {
      xPercent: 13.5,
      yPercent: 40.5,
    },
    zoomScale: 2.8,
    svgPolygon: "48,228 132,176 226,236 216,306 72,312",
    resumenRapido: "Supervisa que no se pierdan los tornillos en la mesa y duerme la siesta sobre las cajas vacías.",
    queEs: "Un felino atigrado naranja experto en control de calidad, confort térmico y acompañamiento de ensamblajes de hardware.",
    queFuncionTiene: "Brinda apoyo moral durante los momentos de tensión cuando la PC no enciende al primer intento. Se asegura de inspeccionar que cada caja de componentes sea una cama cómoda para dormir.",
    medidas: {
      estandar: "Formato Felino Doméstico Esponjoso",
      dimensiones: "Aprox. 45 cm de largo + cola de 25 cm",
      descripcion: "Capaz de amoldarse a cualquier caja de cartón sin importar su volumen.",
    },
    conectores: [
      "Sensores táctiles ultrasensibles detrás de las orejas y bajo el mentón",
      "Conexión inalámbrica a latas de comida y juguetes con catnip",
    ],
    conQueSeConecta: [
      {
        componente: "Cajas de Componentes",
        tipoConexion: "Ocupación inmediata por ley felina ('If it fits, I sits')",
        explicacion: "Ninguna caja vacía de tarjeta gráfica o placa madre queda sin estrenar.",
      },
      {
        componente: "Tornillos pequeños",
        tipoConexion: "Bateo juguetón con la patita",
        explicacion: "¡Cuidado! Mantén los tornillos M.2 en un cuenco magnético para que no rueden bajo la mesa.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "45 cm de largo × 20 cm de alto",
      pesoPromedio: "4.2 kg de pura simpatía",
      detalle: "Ronronea a 40 decibelios cuando el ensamble pasa el test de estrés con éxito.",
    },
    consejoTecnico: "Mantén a Ranbisho y a las mascotas alejadas del equipo mientras ensamblas para evitar que la electricidad estática de su pelo salte a los circuitos delicados, y limpia con frecuencia los filtros antipolvo de tu gabinete.",
  },
];
