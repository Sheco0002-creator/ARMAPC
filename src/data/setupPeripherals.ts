import { TierType } from "@/store/useConfiguratorStore";

export interface PeripheralChapter {
  id: string;
  chapterNumber: string;
  categoryLabel: string;
  name: string;
  recommendations: Record<
    TierType,
    {
      title: string;
      subtitle: string;
      targetModel: string;
      priceRange: string;
      synergyNotice: string;
      didacticExplanation: string;
      keySpecs: { label: string; value: string }[];
      image: string;
    }
  >;
}

export const setupPeripheralsData: PeripheralChapter[] = [
  {
    id: "monitor",
    chapterNumber: "01",
    categoryLabel: "PANTALLA & FRECUENCIA",
    name: "Monitor Gamer de Alta Tasa de Refresco",
    recommendations: {
      entrada: {
        title: "24\" - 25\" Fast IPS 1080p // 180Hz eSports",
        subtitle: "Resolución FHD y Máxima Fluidez Competitiva",
        targetModel: "Fast IPS 1080p 180Hz 0.5ms (FreeSync / G-Sync Compatible)",
        priceRange: "$130 - $160 USD",
        synergyNotice: "Sinergia Perfecta: La RTX 5060 o la RX 9060 XT de 8 GB están pensadas para 1080p, donde los juegos competitivos aprovechan un monitor de 180 Hz. Un monitor 4K aquí ahogaría tu GPU innecesariamente.",
        didacticExplanation: "Para jugar títulos competitivos (Valorant, CS2, Fortnite, Warzone), la densidad de píxeles en 24 pulgadas mantiene cada detalle enfocado en tu campo de visión central sin forzar la vista.",
        keySpecs: [
          { label: "Panel & Color", value: "Fast IPS / 99% sRGB" },
          { label: "Tiempo de Respuesta", value: "0.5ms MPRT / 1ms GtG" },
          { label: "Tasa de Refresco", value: "180Hz Nativo con VRR" },
        ],
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      },
      media: {
        title: "27\" Fast IPS 1440p // 180Hz - 240Hz Sweet Spot",
        subtitle: "Resolución Quad HD (2K) y Densidad Óptima",
        targetModel: "27\" QHD 2560x1440 180Hz-240Hz Nano-IPS HDR400",
        priceRange: "$260 - $340 USD",
        synergyNotice: "Sinergia Sweet Spot: La RTX 5070 o la RX 9070 están pensadas para exprimir 1440p. Mantenerte en 1080p generaría cuello de botella de procesador.",
        didacticExplanation: "2560x1440 en 27 pulgadas entrega un 77% más de espacio de trabajo y nitidez que 1080p, permitiendo distinguir siluetas a larga distancia con máxima fidelidad.",
        keySpecs: [
          { label: "Resolución", value: "2560 x 1440 (2K QHD)" },
          { label: "Tecnología Panel", value: "Nano IPS / DCI-P3 98%" },
          { label: "Sincronización", value: "NVIDIA G-Sync & AMD FreeSync Premium" },
        ],
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      },
      alta: {
        title: "27\" - 32\" QD-OLED 1440p 360Hz / 4K 165Hz",
        subtitle: "Contraste Infinito & 0.03ms de Respuesta Real",
        targetModel: "QD-OLED Gen 3 0.03ms GtG HDR True Black 400",
        priceRange: "$650 - $850 USD",
        synergyNotice: "Sinergia de Grado eSports / Entusiasta: La RTX 5070 Ti o la RX 9070 XT de 16 GB mueven 1440p a alta tasa de cuadros, y un panel OLED de 360 Hz lo muestra sin ghosting ni desenfoque de movimiento.",
        didacticExplanation: "Los píxeles auto-emisivos del panel OLED se apagan por completo logrando negros puros y una claridad de movimiento inalcanzable para cualquier tecnología LCD convencional.",
        keySpecs: [
          { label: "Tipo de Panel", value: "Quantum Dot OLED (QD-OLED)" },
          { label: "Latencia Real", value: "0.03ms GtG Ultra-Instantáneo" },
          { label: "HDR Real", value: "HDR True Black 400 / 1000 nits Peak" },
        ],
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      },
      extrema: {
        title: "32\" 4K QD-OLED 240Hz o Ultrawide 49\" 240Hz",
        subtitle: "El Máximo Pináculo Visual de la Industria",
        targetModel: "32\" 3840x2160 QD-OLED 240Hz Dual-Mode o 49\" 5120x1440",
        priceRange: "$1,100 - $1,450 USD",
        synergyNotice: "Sinergia Extrema: La RTX 5080 de 16 GB es la gráfica para jugar en 4K; con DLSS y generación de fotogramas se acerca a los 240 Hz de este panel en muchos juegos.",
        didacticExplanation: "Densidad de 140 PPI en resolución 4K nativa combinada con 240Hz de refresco: nitidez de imagen fija y fluidez de monitor competitivo en la misma pantalla.",
        keySpecs: [
          { label: "Resolución & Tasa", value: "4K 3840x2160 a 240Hz Nativo" },
          { label: "Puertos de Entrada", value: "DisplayPort 2.1 UHBR20 + HDMI 2.1" },
          { label: "Gama de Color", value: "99.3% DCI-P3 / Calibración Delta E < 1" },
        ],
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
  {
    id: "keyboard",
    chapterNumber: "02",
    categoryLabel: "INTERFAZ DE ENTRADA MECÁNICA",
    name: "Teclado Mecánico / Magnético de Alto Desempeño",
    recommendations: {
      entrada: {
        title: "Mecánico Compacto 75% // Switches Lineales Hot-Swap",
        subtitle: "Factor de Forma Eficiente con Espacio Libre de Mousepad",
        targetModel: "Teclado Mecánico 75% con Switches Lineales Red pre-lubricados",
        priceRange: "$50 - $75 USD",
        synergyNotice: "Sinergia Práctica: El formato TKL conserva flechas y teclas de función, y al quitar el teclado numérico libera espacio de escritorio para no chocar el ratón.",
        didacticExplanation: "Los switches mecánicos lineales ofrecen una pulsación suave sin salto táctil, reduciendo la fatiga de los dedos al correr o agacharte repetidamente en partidas.",
        keySpecs: [
          { label: "Distribución", value: "Compacto 75% o TKL 80%" },
          { label: "Tipo de Switch", value: "Lineal Mecánico 45g Hot-Swap" },
          { label: "Keycaps", value: "PBT Double-Shot anti-desgaste" },
        ],
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
      },
      media: {
        title: "Custom Inalámbrico Gasket-Mount // Tri-Mode 2.4GHz",
        subtitle: "Amortiguación Acústica de 5 Capas y Cero Latencia",
        targetModel: "Teclado Gasket Mount 75% con Espuma Poron y Placa de Policarbonato",
        priceRange: "$95 - $130 USD",
        synergyNotice: "Sinergia Tecnológica: Conexión inalámbrica por dongle 2.4GHz con 1000Hz de polling rate. Igual de rápido que cable, pero con escritorio 100% limpio.",
        didacticExplanation: "La montura tipo Gasket aísla la placa del teclado con almohadillas elásticas, absorbiendo vibraciones bruscas y produciendo un sonido grave ('thock') sumamente placentero.",
        keySpecs: [
          { label: "Estructura Interna", value: "Gasket Mount con Poron & IXPE" },
          { label: "Conectividad", value: "2.4GHz Wireless / BT 5.2 / USB-C" },
          { label: "Batería", value: "4000mAh (Hasta 200h continuas)" },
        ],
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
      },
      alta: {
        title: "Teclado Magnético Hall Effect // Rapid Trigger Regulable",
        subtitle: "Activación Magnética Milimétrica Continua (0.1mm - 4.0mm)",
        targetModel: "Wooting / Apex Pro / HE Magnetic Switch Keyboard 8000Hz",
        priceRange: "$160 - $220 USD",
        synergyNotice: "Sinergia Competitiva: En juegos como CS2 o Valorant permite el frenado perfecto instantáneo ('counter-strafing') sin depender del recorrido mecánico.",
        didacticExplanation: "Utiliza sensores de efecto Hall para medir la posición exacta de cada imán dentro del switch. Puedes disparar la habilidad apenas hundes 0.2mm y resetearla inmediatamente al soltar.",
        keySpecs: [
          { label: "Sensores", value: "Efecto Hall Magnético sin contacto físico" },
          { label: "Rapid Trigger", value: "Sensibilidad regulable de 0.1 a 4.0mm" },
          { label: "Tasa de Sondeo", value: "8000Hz (0.125ms de latencia)" },
        ],
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
      },
      extrema: {
        title: "Custom CNC de Aluminio Puro 6063 // Hall Effect & Latón",
        subtitle: "Chasis Sólido de 2.2kg Mecanizado por Bloque Único",
        targetModel: "Custom Anodized CNC Aluminium Hall Effect Premium Edition",
        priceRange: "$280 - $380 USD",
        synergyNotice: "Sinergia de Lujo: Chasis rígido de aluminio y switches de actuación ajustable desde 0,1 mm: la precisión de un teclado competitivo con acabado de gama alta.",
        didacticExplanation: "Cada pieza del chasis es cortada con precisión milimétrica mediante control numérico en aluminio aeroespacial. La combinación de switches magnéticos lubricados artesanalmente brinda precisión absoluta.",
        keySpecs: [
          { label: "Material Chasis", value: "Aluminio Anodizado 6063 CNC + Pesa de Latón" },
          { label: "Montaje", value: "Leaf Spring Gasket Mount Aislado" },
          { label: "PCB", value: "Hot-Swap Magnética con Firmware Web Abierto" },
        ],
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
  {
    id: "mouse",
    chapterNumber: "03",
    categoryLabel: "PRECISIÓN MILIMÉTRICA & SEGUIMIENTO",
    name: "Ratón Gamer Ultra-Ligero de Grado Torneo",
    recommendations: {
      entrada: {
        title: "Ultra-Ligero Simétrico (<55g) // Sensor PixArt 3395",
        subtitle: "Sensor Óptico de 26,000 DPI y Cero Aceleración",
        targetModel: "Ratón Óptico Inalámbrico o Cable Paracord 53g con Switches Ópticos",
        priceRange: "$45 - $65 USD",
        synergyNotice: "Sinergia sin Derroche: Un sensor preciso sin aceleración y conexión inalámbrica de 1 ms cubren todo lo que necesita quien empieza, sin pagar por extras de torneo.",
        didacticExplanation: "Menos peso significa menor inercia al mover la mano. Cambiar de un mouse pesado de 100g a uno de 50g reduce instantáneamente la sobre-tensión muscular en la muñeca.",
        keySpecs: [
          { label: "Peso", value: "52g a 55g Peso Pluma" },
          { label: "Sensor Óptico", value: "PixArt PAW3395 (26,000 DPI)" },
          { label: "Switches", value: "Huano Blue Pink Dot / Ópticos 80M clics" },
        ],
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop",
      },
      media: {
        title: "Inalámbrico 4KHz / 8KHz Polling // <50g Ergonómico",
        subtitle: "Velocidad de Transmisión Cuadruplicada y Skates 100% PTFE",
        targetModel: "Mouse Inalámbrico 4000Hz Dongle Incluido / MCU Nórdic 52840",
        priceRange: "$80 - $110 USD",
        synergyNotice: "Sinergia con Monitor QHD: Un ratón de unos 55 g reduce la inercia en los giros rápidos, y la conexión inalámbrica de baja latencia se siente igual que un cable.",
        didacticExplanation: "El chip Nordic optimiza el consumo de batería mientras envía 4,000 reportes de posición por segundo a tu PC, reduciendo la latencia de entrada a solo 0.25 milisegundos.",
        keySpecs: [
          { label: "Frecuencia Sondeo", value: "4KHz / 8KHz Wireless Nativo" },
          { label: "Velocidad y Aceleración", value: "650 IPS / 50G" },
          { label: "Pies / Skates", value: "100% Virgen PTFE Bordes Curvos" },
        ],
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop",
      },
      alta: {
        title: "Fibra de Carbono / Aleación de Magnesio // <42g Ultra-Rígido",
        subtitle: "Exoesqueleto Perforado de Alta Resistencia Mecánica",
        targetModel: "Magnesium Alloy 8KHz Wireless Gaming Mouse",
        priceRange: "$140 - $180 USD",
        synergyNotice: "Sinergia de Micropuntería: Combina a la perfección con el panel OLED de 360Hz. Permite micro-ajustes instantáneos con la punta de los dedos.",
        didacticExplanation: "El magnesio fundido permite paredes estructurales ultradelgadas que no flexan ni crujen bajo agarre fuerte, manteniendo un peso inferior a 42 gramos con batería recargable.",
        keySpecs: [
          { label: "Material Chasis", value: "Aleación de Magnesio Aeronáutico" },
          { label: "Peso Neto", value: "39g a 42g Real" },
          { label: "Polling Rate", value: "8000Hz (0.125ms de retardo)" },
        ],
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop",
      },
      extrema: {
        title: "Custom Magnesio + Skates de Cristal de Zafiro & Pad de Vidrio",
        subtitle: "Deslizamiento con Coeficiente de Fricción Prácticamente Cero",
        targetModel: "Limited Magnesium 8K + Glasspad Templado Silencioso",
        priceRange: "$180 - $240 USD",
        synergyNotice: "Sinergia Definitiva: Diseñado para competir al máximo nivel. La superficie de vidrio templado nunca se desgasta ni cambia de velocidad con la humedad.",
        didacticExplanation: "Al eliminar los skates de teflón tradicionales y usar patines de zafiro pulido sobre un mousepad de vidrio endurecido, la resistencia estática desaparece por completo.",
        keySpecs: [
          { label: "Patinadores", value: "Zafiro Sintético / Cerámica Pulida" },
          { label: "Superficie Recomendada", value: "Mousepad de Vidrio Templado 490x420" },
          { label: "Batería / Autonomía", value: "Carga Rápida USB-C / MCU Nordic High-End" },
        ],
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
  {
    id: "audio",
    chapterNumber: "04",
    categoryLabel: "PAISAJE SONORO & COMUNICACIÓN",
    name: "Sistema de Audio Espacial & Micrófono de Estudio",
    recommendations: {
      entrada: {
        title: "Auriculares Estéreo 50mm // Micrófono Cardioide Desmontable",
        subtitle: "Aislamiento Pasivo con Drivers de Neodimio Calibrados",
        targetModel: "Headset Cerrado 50mm con Almohadillas Memory Foam Transpirables",
        priceRange: "$45 - $70 USD",
        synergyNotice: "Sinergia Balanceada: Se conecta por USB o 3,5 mm y suena a pleno volumen sin amplificador externo; el micrófono se quita cuando no lo usas.",
        didacticExplanation: "Una curva de ecualización balanceada permite escuchar pisadas y recargas sin que los bajos exagerados de explosiones enmascaren los detalles acústicos del enemigo.",
        keySpecs: [
          { label: "Diámetro Drivers", value: "50mm Neodimio Dinámico" },
          { label: "Impedancia", value: "32 Ohmios (Conexión Plug & Play 3.5mm)" },
          { label: "Micrófono", value: "Patrón Cardioide con Filtro Pop" },
        ],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      },
      media: {
        title: "Auriculares Inalámbricos 2.4GHz // Dolby Atmos / DTS:X Spatial",
        subtitle: "Libertad de Movimiento sin Retardo & Transductores de Grafeno",
        targetModel: "Wireless 2.4GHz Dongle + Bluetooth Dual-Stream Headset",
        priceRange: "$110 - $150 USD",
        synergyNotice: "Sinergia de Inmersión: La tarjeta gráfica y CPU de gama media procesan el audio 3D posicional en tiempo real, entregando espacialidad fidedigna.",
        didacticExplanation: "La conexión de radiofrecuencia a 2.4GHz garantiza que el sonido de los disparos coincida exactamente con lo que ves en tu pantalla sin el desfase habitual de Bluetooth.",
        keySpecs: [
          { label: "Latencia de Audio", value: "<15ms (Transmisión 2.4GHz)" },
          { label: "Batería", value: "Hasta 50 horas continuas por carga" },
          { label: "Licencia de Audio", value: "Spatial Sound Dolby Atmos / DTS Headphone:X" },
        ],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      },
      alta: {
        title: "Audífonos Abiertos de Audiófilo + DAC/Amp USB Dedicado",
        subtitle: "Escena Sonora Tridimensional sin Fatiga de Presión Acústica",
        targetModel: "Open-Back Dynamic / Planar 250 Ohm + DAC ESS Sabre Hi-Res",
        priceRange: "$240 - $350 USD",
        synergyNotice: "Sinergia Acústica Pura: Al tener diseño abierto, el aire circula libremente creando una sensación de que los sonidos provienen de la habitación física y no dentro de tu cabeza.",
        didacticExplanation: "El DAC externo limpia el ruido electromagnético de la placa base y GPU, mientras el amplificador dedicado proporciona la corriente exacta para graves secos y agudos cristalinos.",
        keySpecs: [
          { label: "Diseño Acústico", value: "Open-Back (Espalda Abierta) Hi-Fi" },
          { label: "DAC / Amplificador", value: "Chip ESS Sabre 32-bit / 384kHz PCM" },
          { label: "Distorsión Armónica", value: "THD < 0.0005% Ultra-Limpio" },
        ],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      },
      extrema: {
        title: "Cadena Hi-Fi Balanceada + Micrófono Dinámico XLR Broadcast",
        subtitle: "Audífonos Planar Magnéticos + Brazo de Micrófono con Interfaz",
        targetModel: "Planar Magnetic Audiophile + Shure/Rode XLR + Interfaz GoXLR/Elgato",
        priceRange: "$600 - $950 USD",
        synergyNotice: "Sinergia de Estudio de Grabación: Ideal para creadores de contenido, streaming profesional y entusiastas que no toleran compresión de audio ni ruido de fondo.",
        didacticExplanation: "Las membranas de los transductores planares miden micrómetros de espesor y se mueven en un campo magnético plano simétrico, logrando una velocidad de respuesta que reproduce cada textura del sonido.",
        keySpecs: [
          { label: "Drivers", value: "Planar Magnéticos Neodimio Doble Cara" },
          { label: "Cápsula Micrófono", value: "Dinámica XLR con Rechazo Fuera de Eje" },
          { label: "Procesamiento", value: "DSP de Hardware (Compresor, Gate, EQ en tiempo real)" },
        ],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
  {
    id: "ergonomics",
    chapterNumber: "05",
    categoryLabel: "SOPORTE POSTURAL & ESPACIO DE TRABAJO",
    name: "Estación Ergonómica, Escritorio & Asiento Activo",
    recommendations: {
      entrada: {
        title: "Brazo de Monitor a Gas VESA + Alfombrilla XXL 900x400",
        subtitle: "Alineación Cervical Correcta y Cobertura Total de Mesa",
        targetModel: "Brazo Mecánico de Gas VESA 75/100 + Mousepad Cordura o Microfibra",
        priceRange: "$60 - $90 USD",
        synergyNotice: "Sinergia Fisiológica: Una silla de malla con soporte lumbar mantiene la espalda en su curva natural durante sesiones largas y no acumula calor como las sillas 'gamer' de cuero sintético.",
        didacticExplanation: "El soporte de gas elimina las patas gigantes del monitor liberando el 40% del área de tu mesa para que el teclado y mouse reposen en la postura natural de tus brazos.",
        keySpecs: [
          { label: "Soporte de Carga", value: "Hasta 9kg con Ajuste de Tensión VESA" },
          { label: "Superficie Pad", value: "900 x 400 x 4mm Base de Caucho Natural" },
          { label: "Bordes Pad", value: "Costura Reforzada Anti-Deshilachado" },
        ],
        image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop",
      },
      media: {
        title: "Silla Ergonómica de Malla Transpirable // Soporte Lumbar 3D",
        subtitle: "Disipación de Calor Corporal y Ajuste Multi-Punto",
        targetModel: "Silla de Malla Polimérica Integral con Mecanismo Sincrónico",
        priceRange: "$180 - $260 USD",
        synergyNotice: "Sinergia con el Jugador: Las sillas 'gamer' de cuero sintético retienen el calor y carecen de soporte lumbar regulable; la malla permite flujo de aire 100% fresco.",
        didacticExplanation: "El mecanismo sincrónico reclina el respaldo mientras inclina el asiento suavemente, manteniendo la columna vertebral en una curva neutra sin ejercer presión sobre los muslos.",
        keySpecs: [
          { label: "Material Tapizado", value: "Malla Elástica Alemana Transpirable" },
          { label: "Soporte Lumbar", value: "Ajuste Biomecánico Dinámico en Altura y Profundidad" },
          { label: "Reposabrazos", value: "Ajuste 3D (Altura, Ángulo y Desplazamiento)" },
        ],
        image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop",
      },
      alta: {
        title: "Escritorio Motorizado Sit-Stand Dual Motor // Tapa de Madera Maciza",
        subtitle: "Alternancia de Postura Sentado / De Pie con Memoria Digital",
        targetModel: "Estructura de Acero de 3 Etapas con Dos Motores y Panel Táctil",
        priceRange: "$320 - $480 USD",
        synergyNotice: "Sinergia de Salud & Enfoque: Trabajar o jugar 20 minutos de pie por cada hora sentado activa el flujo sanguíneo y eleva los reflejos visuales.",
        didacticExplanation: "El sistema con dos motores independientes en cada pata eleva el setup de forma silenciosa (<45dB) incluso cargando 100kg de torres pesadas y múltiples pantallas.",
        keySpecs: [
          { label: "Rango de Altura", value: "62cm a 128cm (Adecuado para cualquier estatura)" },
          { label: "Capacidad de Carga", value: "120kg Estables con Sistema Anti-Colisión" },
          { label: "Controlador", value: "4 Memorias Pre-Programables + Recordatorio Activo" },
        ],
        image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop",
      },
      extrema: {
        title: "Estación Herman Miller Embody / Gesture + Lightbar Circadiana",
        subtitle: "Ingeniería Médica de Distribución de Presión y Ergonomía Total",
        targetModel: "Herman Miller x Logitech G Embody / Steelcase Gesture + BenQ ScreenBar",
        priceRange: "$1,200 - $1,750 USD",
        synergyNotice: "Sinergia con la Rig Extrema: Para quienes pasan más de 8 horas creando o compitiendo, cuida tu salud articular al nivel de atletas profesionales.",
        didacticExplanation: "La matriz de soporte pixelado del respaldo se amolda automáticamente a los micro-movimientos de tu columna, distribuyendo el peso para evitar puntos focales de presión.",
        keySpecs: [
          { label: "Garantía & Vida Útil", value: "12 años de Garantía 24/7 de Grado Médico" },
          { label: "Iluminación Monitor", value: "Lámpara de Barra Asimétrica sin Reflejo en Pantalla" },
          { label: "Gestión de Cables", value: "Canalización Oculta Magnética para Cero Cables a la Vista" },
        ],
        image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
];
