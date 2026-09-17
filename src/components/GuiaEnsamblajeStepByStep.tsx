"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldAlert,
  Cpu,
  HardDrive,
  Binary,
  Fan,
  Zap,
  Box,
  Monitor,
  Check,
  RotateCcw,
  Eye,
  ImageIcon,
  X,
  Maximize2,
  Droplet,
} from "lucide-react";
import { useIdioma } from "@/i18n/Idioma";
import { pasoEnIdioma } from "@/data/ensamblaje.en";

export interface SubInstruction {
  texto: string;
  imagen?: string;
  tituloVisual?: string;
  pieDeFoto?: string;
}

export interface AssemblyStep {
  id: number;
  fase: string;
  faseIndex: number;
  titulo: string;
  tiempoEstimado: string;
  nivelRiesgo: "Bajo" | "Medio" | "Crítico";
  icono: React.ElementType;
  descripcion: string;
  instrucciones: (string | SubInstruction)[];
  alertaNovato?: string;
  herramientas: string[];
}

export function getInstructionData(item: string | SubInstruction): SubInstruction {
  if (typeof item === "string") {
    return { texto: item };
  }
  return item;
}

export const ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    id: 1,
    fase: "Fase 1: En la Mesa (Fuera del Gabinete)",
    faseIndex: 1,
    titulo: "Preparación del área y la Placa Madre",
    tiempoEstimado: "5 min",
    nivelRiesgo: "Bajo",
    icono: Box,
    descripcion:
      "Nunca ensambles directamente dentro del gabinete estrecho. El 80% de las piezas se instalan cómodamente en la mesa de trabajo sobre la propia caja de cartón de la placa base.",
    instrucciones: [
      {
        texto: "Limpia una mesa amplia, plana y bien iluminada. Descárgate de estática tocando un objeto metálico grande sin pintar.",
        imagen: "/images/ensamblaje/paso-1-1.webp",
        tituloVisual: "Paso 1.1: Descarga de Electricidad Estática (ESD)",
        pieDeFoto: "Toca una superficie metálica sin pintar (como el chasis del gabinete o un radiador) para drenar la carga estática antes de manipular los delicados componentes electrónicos.",
      },
      {
        texto: "Saca la placa madre de su envoltorio y colócala directamente sobre su caja de cartón.",
        imagen: "/images/ensamblaje/paso-1-2.webp",
        tituloVisual: "Paso 1.2: Base Segura sobre la Caja de Cartón",
        pieDeFoto: "La caja de cartón de la placa madre es una superficie rígida, no conductora e ideal para apoyar la placa mientras instalas CPU, RAM y SSD cómodamente.",
      },
      {
        texto: "¡OJO CON LA BOLSA!: Nunca apoyes la placa sobre la bolsa antiestática por fuera: la cara externa es conductora de electricidad estática y puede provocar cortos al probar componentes.",
        imagen: "/images/ensamblaje/paso-1-3.webp",
        tituloVisual: "Paso 1.3: Advertencia de la Bolsa Antiestática",
        pieDeFoto: "¡Peligro!: La cara externa de las bolsas antiestáticas metálicas disipa la estática por conducción. Apoyar los circuitos de la placa encima puede causar cortocircuitos.",
      },
    ],
    alertaNovato:
      "Conserva todos los tornillos y cajas; los números de serie de las cajas son indispensables para tramitar garantías con los fabricantes.",
    herramientas: ["Mesa despejada", "Caja de cartón de la placa base"],
  },
  {
    id: 2,
    fase: "Fase 1: En la Mesa (Fuera del Gabinete)",
    faseIndex: 1,
    titulo: "Instalación del Procesador (CPU)",
    tiempoEstimado: "5 min",
    nivelRiesgo: "Crítico",
    icono: Cpu,
    descripcion:
      "El paso de mayor precisión de todo el ensamble. Los sockets modernos (AM5 en AMD y LGA1700/1851 en Intel) tienen más de 1,700 pines microscópicos dorados en la placa base que se doblan con solo rozarlos.",
    instrucciones: [
      {
        texto: "Presiona y abre la palanca metálica de retención del socket hacia afuera y levántala por completo.",
        imagen: "/images/ensamblaje/paso-2-1.webp",
        tituloVisual: "Paso 2.1: Liberación y Apertura de la Palanca del Socket",
        pieDeFoto: "Empuja la palanca metálica ligeramente hacia afuera para desencajarla del gancho de retención y levántala completamente hasta abrir el marco del socket.",
      },
      {
        texto: "Sujeta el procesador únicamente por los bordes laterales con dos dedos; nunca toques los contactos dorados inferiores.",
        imagen: "/images/ensamblaje/paso-2-2.webp",
        tituloVisual: "Paso 2.2: Sujeción Segura por los Bordes del PCB",
        pieDeFoto: "Sujeta el silicio solo por los costados con el pulgar y el índice. La grasa de la piel o el contacto directo pueden dañar los pines microscópicos o pines de contacto dorados.",
      },
      {
        texto: "Ubica el triángulo dorado en una esquina del procesador y hazlo coincidir exactamente con el triángulo grabado en la esquina del socket.",
        imagen: "/images/ensamblaje/paso-2-3.webp",
        tituloVisual: "Paso 2.3: Alineación de Triángulos Guía",
        pieDeFoto: "La orientación es única: el triángulo dorado serigrafiado en el procesador debe coincidir con la flecha o triángulo grabado en una de las esquinas del socket de la placa.",
      },
      {
        texto: "Deposita el procesador suavemente en el socket: debe caer por su propio peso sin ejercer ninguna fuerza vertical.",
        imagen: "/images/ensamblaje/paso-2-4.webp",
        tituloVisual: "Paso 2.4: Asentamiento Plano sin Fuerza (Zero Pressure)",
        pieDeFoto: "El procesador debe asentarse por su propia gravedad. Si queda inclinado o no calza al instante, no hagas presión: retíralo y verifica la orientación.",
      },
      {
        texto: "Baja la palanca metálica hasta trabarla. Sentirás una resistencia firme normal mientras el protector de plástico negro salta automáticamente hacia afuera (guárdalo).",
        imagen: "/images/ensamblaje/paso-2-5.webp",
        tituloVisual: "Paso 2.5: Cierre de Palanca y Expulsión del Protector",
        pieDeFoto: "Al bajar la palanca sentirás una tensión mecánica firme. El cobertor plástico negro saltará solo para proteger los pines; guárdalo en la caja de la placa madre.",
      },
    ],
    alertaNovato:
      "¡CERO PRESIÓN!: Si el procesador no asienta plano al instante, no lo fuerces. Retíralo y verifica la orientación del triángulo.",
    herramientas: ["Ninguna (se hace exclusivamente con las manos)"],
  },
  {
    id: 3,
    fase: "Fase 1: En la Mesa (Fuera del Gabinete)",
    faseIndex: 1,
    titulo: "Instalación del SSD NVMe M.2",
    tiempoEstimado: "4 min",
    nivelRiesgo: "Medio",
    icono: HardDrive,
    descripcion:
      "El almacenamiento de alta velocidad se fija directamente sobre la placa madre aprovechando los carriles PCIe directos al procesador.",
    instrucciones: [
      {
        texto: "Desatornilla el disipador metálico de la ranura M.2 principal (M2_1, la más cercana al socket del procesador).",
        imagen: "/images/ensamblaje/paso-3-1.webp",
        tituloVisual: "Paso 3.1: Retirada del Disipador Metálico M.2",
        pieDeFoto: "Usa un destornillador de precisión imantado para retirar los tornillos del escudo metálico protector de la ranura M.2 principal conectada directamente a la CPU.",
      },
      {
        texto: "¡REGLA DE ORO!: Retira la película plástica protectora transparente o azul de la almohadilla térmica (Thermal Pad) adherida al disipador metálico.",
        imagen: "/images/ensamblaje/paso-3-2.webp",
        tituloVisual: "Paso 3.2: Retirar Plástico del Thermal Pad",
        pieDeFoto: "¡Alerta novato!: Despega la lámina de plástico protectora que cubre la almohadilla de silicona térmica. Si la dejas puesta, actuará como aislante y el SSD se sobrecalentará.",
      },
      {
        texto: "Inserta el SSD M.2 en la ranura en un ángulo inclinado de 30 grados hasta que los contactos dorados no se vean.",
        imagen: "/images/ensamblaje/paso-3-3.webp",
        tituloVisual: "Paso 3.3: Inserción del SSD en Ángulo de 30°",
        pieDeFoto: "Empuja el SSD en ángulo diagonal hasta que calce firmemente en la ranura M.2 Key M. No intentes meterlo plano horizontalmente para no quebrar el conector.",
      },
      {
        texto: "Baja el extremo posterior del SSD plano hacia el poste y asegúralo con el tornillo M2 o gira el pestillo de plástico EZ-Latch / Q-Latch sin herramientas.",
        imagen: "/images/ensamblaje/paso-3-4.webp",
        tituloVisual: "Paso 3.4: Fijación del SSD (Tornillo M2 / EZ-Latch)",
        pieDeFoto: "Presiona suavemente el extremo del SSD contra el soporte elevador y ajusta el microtornillo M2 con destornillador imantado de precisión sin forzar la rosca.",
      },
      {
        texto: "Vuelve a colocar el disipador metálico y atorníllalo firmemente sin pasarte de rosca.",
        imagen: "/images/ensamblaje/paso-3-5.webp",
        tituloVisual: "Paso 3.5: Montaje y Fijación del Disipador Térmico M.2",
        pieDeFoto: "Alinea el disipador metálico sobre el SSD instalado y atorníllalo para garantizar contacto térmico uniforme y máxima disipación de calor.",
      },
    ],
    alertaNovato:
      "Si dejas el plástico del Thermal Pad puesto, el SSD funcionará a más de 85°C sufriendo estrangulamiento térmico y caídas drásticas de velocidad.",
    herramientas: ["Destornillador de estrella Philips #1 / de precisión"],
  },
  {
    id: 4,
    fase: "Fase 1: En la Mesa (Fuera del Gabinete)",
    faseIndex: 1,
    titulo: "Instalación de la Memoria RAM (Dual Channel)",
    tiempoEstimado: "3 min",
    nivelRiesgo: "Bajo",
    icono: Binary,
    descripcion:
      "La colocación en los bancos correctos duplica el ancho de banda efectivo de tu procesador.",
    instrucciones: [
      {
        texto: "Abre los pestillos basculantes de las ranuras de RAM 2 y 4 (contando de izquierda a derecha desde el socket de la CPU, identificadas como A2 y B2).",
        imagen: "/images/ensamblaje/paso-4-1.webp",
        tituloVisual: "Paso 4.1: Apertura de Pestillos en Ranuras 2 y 4 (A2 y B2)",
        pieDeFoto: "Empuja hacia afuera los pestillos de retención de las ranuras A2 y B2 para habilitar el ancho de banda Dual Channel. Las ranuras 1 y 3 permanecen intactas.",
      },
      {
        texto: "Observa la muesca asimétrica en el conector dorado de la RAM y hazla coincidir con la protuberancia de la ranura de la placa.",
        imagen: "/images/ensamblaje/paso-4-2.webp",
        tituloVisual: "Paso 4.2: Verificación de la Muesca Guía Asimétrica",
        pieDeFoto: "La muesca del módulo DDR5 no está en el centro. Comprueba visualmente que encaje con la división física del zócalo antes de aplicar fuerza para no dañar los pines.",
      },
      {
        texto: "Apoya el módulo y presiona con firmeza y de manera uniforme en ambos extremos hasta escuchar un 'clic' metálico claro y ver que los pestillos se cierran solos.",
        imagen: "/images/ensamblaje/paso-4-3.webp",
        tituloVisual: "Paso 4.3: Inserción Firme y Bloqueo de Pestillos",
        pieDeFoto: "Alinea la muesca guía y empuja verticalmente desde ambos extremos del módulo hasta que las pestañas traben la memoria automáticamente.",
      },
      {
        texto: "Repite el mismo procedimiento en la segunda ranura recomendada para completar la configuración Dual Channel.",
        imagen: "/images/ensamblaje/paso-4-4.webp",
        tituloVisual: "Paso 4.4: Segundo Módulo Instalado y Dual Channel Verificado",
        pieDeFoto: "Ambos módulos quedan firmemente anclados en A2 y B2 con los pestillos bloqueados. Esto garantiza el doble de ancho de banda y máxima estabilidad en juegos.",
      },
    ],
    alertaNovato:
      "¡No uses ranuras contiguas (1 y 2)! Instalar en 2 y 4 es indispensable para activar el Dual Channel y evitar pérdidas de hasta el 20% en tasas de fotogramas mínimos.",
    herramientas: ["Manos libres"],
  },
  {
    id: 5,
    fase: "Fase 1: En la Mesa (Fuera del Gabinete)",
    faseIndex: 1,
    titulo: "Montaje del Disipador de CPU y Pasta Térmica",
    tiempoEstimado: "8 min",
    nivelRiesgo: "Crítico",
    icono: Fan,
    descripcion:
      "El elemento vital para que el procesador no se apague por sobrecalentamiento en cuestión de segundos.",
    instrucciones: [
      {
        texto: "Instala los puentes de fijación o tornillos espaciadores del disipador según las instrucciones de tu socket (AM5 o Intel).",
        imagen: "/images/ensamblaje/paso-5-1.webp",
        tituloVisual: "Paso 5.1: Instalación de Soportes y Espaciadores del Disipador",
        pieDeFoto: "Atornilla los espaciadores roscados y barras de anclaje metálicas en las cuatro esquinas alrededor del socket de la CPU siguiendo el estándar de tu procesador.",
      },
      {
        texto: "¡ADVERTENCIA VITAL!: Revisa la base de cobre del disipador y retira la pegatina plástica transparente 'PEEL OFF BEFORE USE'.",
        imagen: "/images/ensamblaje/paso-5-2.webp",
        tituloVisual: "Paso 5.2: Retirar el Plástico Protector de la Base de Cobre",
        pieDeFoto: "¡Peligro crítico!: Si olvidas despegar esta película protectora transparente, el procesador alcanzará los 100°C en segundos y se apagará por protección térmica.",
      },
      {
        texto: "Aplica una cantidad de pasta térmica del tamaño de un guisante (o una cruz fina de 1 mm) en el centro exacto del IHS del procesador.",
        imagen: "/images/ensamblaje/paso-5-3.webp",
        tituloVisual: "Paso 5.3: Aplicación de Pasta Térmica (Método del Guisante)",
        pieDeFoto: "Aplica una gota de pasta térmica de 4 a 5 mm en el centro del procesador. La presión del disipador se encargará de esparcirla de forma uniforme sin desbordar.",
      },
      {
        texto: "Coloca la torre del disipador alineada sobre los tornillos y aprieta los tornillos de fijación alternando en cruz (media vuelta cada uno) para que la presión sea totalmente simétrica.",
        imagen: "/images/ensamblaje/paso-5-4.webp",
        tituloVisual: "Paso 5.4: Apriete en Patrón Cruzado Alternado",
        pieDeFoto: "Aprieta media vuelta cada tornillo en diagonal (patrón en X) para distribuir la presión por igual sobre el IHS y evitar aplastamientos asimétricos del silicio.",
      },
      {
        texto: "Conecta el cable del ventilador al cabezal etiquetado obligatoriamente como 'CPU_FAN' en la placa madre.",
        imagen: "/images/ensamblaje/paso-5-5.webp",
        tituloVisual: "Paso 5.5: Conexión del Cable PWM al Cabezal CPU_FAN",
        pieDeFoto: "Alinea la guía plástica e inserta el conector de 4 pines en el puerto 'CPU_FAN'. Si lo conectas a CHA_FAN o SYS_FAN, la placa dará error de inicio.",
      },
    ],
    alertaNovato:
      "Si conectas el ventilador al cabezal 'CHA_FAN' o 'SYS_FAN', la placa madre mostrará el error 'CPU Fan Error' al encender y no regulará las revoluciones según el calor del procesador.",
    herramientas: ["Destornillador Philips #2", "Pasta térmica de calidad"],
  },
  {
    id: 6,
    fase: "Fase 2: En el Gabinete (Estructura y Alimentación)",
    faseIndex: 2,
    titulo: "Preparación del Gabinete y Fuente de Poder",
    tiempoEstimado: "10 min",
    nivelRiesgo: "Medio",
    icono: Zap,
    descripcion:
      "Instalación del corazón eléctrico en el compartimento inferior aislado (PSU Shroud).",
    instrucciones: [
      {
        texto: "Retira ambos paneles laterales del gabinete (vidrio templado y chapa metálica trasera). Guárdalos en una superficie segura.",
        imagen: "/images/ensamblaje/paso-6-1.webp",
        tituloVisual: "Paso 6.1: Retirar Paneles Laterales del Gabinete",
        pieDeFoto: "Afloja los tornillos manuales traseros y retira el panel de vidrio templado apoyándolo sobre una superficie acolchada para evitar roturas.",
      },
      {
        texto: "Si tu fuente es modular, conecta previamente en la fuente los cables que vas a necesitar: el ATX de 24 pines, dos EPS de 8 pines para CPU y el cable PCIe o 12V-2x6 para la tarjeta de video.",
        imagen: "/images/ensamblaje/paso-6-2.webp",
        tituloVisual: "Paso 6.2: Preconexión de Cables en Fuente Modular",
        pieDeFoto: "Conecta firmemente en la fuente el cable principal de 24 pines, los dos conectores EPS de 8 pines para CPU y el cable PCIe o 12V-2x6 antes de introducirla al túnel.",
      },
      {
        texto: "Desliza la fuente en el túnel inferior con su ventilador apuntando hacia abajo (hacia la rejilla con filtro antipolvo del suelo del gabinete).",
        imagen: "/images/ensamblaje/paso-6-3.webp",
        tituloVisual: "Paso 6.3: Deslizar la Fuente en el Túnel Inferior",
        pieDeFoto: "Orienta el ventilador de la fuente hacia abajo para que tome aire fresco del exterior a través del filtro antipolvo del suelo del chasis.",
      },
      {
        texto: "Asegura la fuente desde la parte trasera con los 4 tornillos hexagonales gruesos suministrados.",
        imagen: "/images/ensamblaje/paso-6-4.webp",
        tituloVisual: "Paso 6.4: Fijación Trasera con 4 Tornillos Hexagonales",
        pieDeFoto: "Atornilla los 4 tornillos hexagonales de rosca gruesa (6-32) en las cuatro esquinas traseras del soporte de la fuente con destornillador Philips #2.",
      },
      {
        texto: "Verifica los postes elevadores dorados (standoffs) en la bandeja de la placa: deben coincidir exactamente con los agujeros de tu placa ATX o Micro-ATX.",
        imagen: "/images/ensamblaje/paso-6-5.webp",
        tituloVisual: "Paso 6.5: Verificación de Postes Separadores (Standoffs)",
        pieDeFoto: "Comprueba el patrón de 9 postes para ATX. ¡Alerta novato!: Retira cualquier poste sobrante que no coincida con un orificio de la placa para evitar un cortocircuito mortal.",
      },
    ],
    alertaNovato:
      "Nunca dejes un poste separador (standoff) de latón atornillado en una posición donde la placa no tenga orificio; tocaría las pistas de cobre traseras de la placa provocando un cortocircuito mortal.",
    herramientas: ["Destornillador Philips #2"],
  },
  {
    id: 7,
    fase: "Fase 2: En el Gabinete (Estructura y Alimentación)",
    faseIndex: 2,
    titulo: "Instalación de la Placa Madre en el Gabinete",
    tiempoEstimado: "7 min",
    nivelRiesgo: "Medio",
    icono: Box,
    descripcion:
      "Traslado del combo principal (Placa + CPU + RAM + SSD + Cooler) al interior del chasis.",
    instrucciones: [
      {
        texto: "Si tu placa base no tiene el protector de puertos traseros (I/O Shield) integrado, colócalo en el rectángulo trasero del gabinete presionando hasta que encaje firmemente.",
        imagen: "/images/ensamblaje/paso-7.1.webp",
        tituloVisual: "Paso 7.1: Instalación del I/O Shield",
        pieDeFoto: "Empuja la chapa metálica trasera (I/O Shield) desde el interior del gabinete hacia afuera hasta que todos los bordes encajen con un clic firme.",
      },
      {
        texto: "Sujeta la placa por la torre metálica del disipador de CPU y sus bordes, e introdúcela en ángulo hacia el fondo hasta que los puertos traseros coincidan con el I/O Shield.",
        imagen: "/images/ensamblaje/paso-7-2.webp",
        tituloVisual: "Paso 7.2: Inserción Diagonal de la Placa",
        pieDeFoto: "Sujeta la placa madre firmemente por los bordes y el bloque del disipador, introduciéndola en ángulo para que los puertos encajen en el I/O Shield trasero sin chocar con los postes.",
      },
      {
        texto: "Alinea el agujero central de la placa con el pivote guía central del gabinete.",
        imagen: "/images/ensamblaje/paso-7-3.webp",
        tituloVisual: "Paso 7.3: Alineación con el Pivote Central",
        pieDeFoto: "Haz que el agujero central de la placa madre coincida exactamente con el poste separador central del gabinete. Esto asegurará automáticamente que los demás orificios estén alineados.",
      },
      {
        texto: "Atornilla los tornillos de la placa (normalmente 8 o 9 en placas ATX) con un destornillador magnético, ajustando sin apretar con fuerza excesiva para no fracturar las capas de fibra de vidrio.",
        imagen: "/images/ensamblaje/paso-7-4.webp",
        tituloVisual: "Paso 7.4: Fijación Final de la Placa",
        pieDeFoto: "Utiliza un destornillador imantado para colocar los 8 o 9 tornillos de montaje. Aprieta hasta sentir resistencia suave; el exceso de fuerza puede dañar los circuitos internos del PCB.",
      },
    ],
    alertaNovato:
      "No arrastres la placa madre bruscamente contra los postes metálicos para no rayar las pistas de circuitos impresos traseros.",
    herramientas: ["Destornillador Philips #2 imantado"],
  },
  {
    id: 8,
    fase: "Fase 2: En el Gabinete (Estructura y Alimentación)",
    faseIndex: 2,
    titulo: "Conexión de Cables Frontales y Alimentación",
    tiempoEstimado: "12 min",
    nivelRiesgo: "Medio",
    icono: Wrench,
    descripcion:
      "El enrutamiento del cableado interno para dar vida a los botones y suministrar voltajes limpios.",
    instrucciones: [
      {
        texto: "Conecta el cable ATX de 24 pines en el costado derecho de la placa hasta que la traba plástica calce con un clic firme.",
        imagen: "/images/ensamblaje/paso-8-1.webp",
        tituloVisual: "Paso 8.1: Cable Principal ATX (24 pines)",
        pieDeFoto: "Alinea la pestaña de seguridad del conector y presiónalo rectamente hacia abajo. Este grueso mazo de cables proporciona la alimentación principal a la placa base.",
      },
      {
        texto: "Conecta los cables EPS de 8 pines (4+4) en la esquina superior izquierda de la placa para alimentar el procesador.",
        imagen: "/images/ensamblaje/paso-8-2.webp",
        tituloVisual: "Paso 8.2: Alimentación EPS del Procesador (CPU)",
        pieDeFoto: "Enruta los cables EPS por la parte trasera superior. Entregarán energía limpia y dedicada al socket del procesador. Es normal que venga dividido en un conector de 4+4 pines.",
      },
      {
        texto: "Localiza los cables del frontal del gabinete: 'POWER SW' (encendido), 'RESET SW', 'POWER LED' y conéctalos en el cabezal F_PANEL según el diagrama impreso en la placa.",
        imagen: "/images/ensamblaje/paso-8-3.webp",
        tituloVisual: "Paso 8.3: Cabezales del Panel Frontal (F_PANEL)",
        pieDeFoto: "Conecta los delicados pines del botón de encendido y luces del chasis. El polo positivo (+) suele ir a la izquierda. Guíate con el esquema serigrafiado debajo de los pines.",
      },
      {
        texto: "Conecta el conector USB 3.0 azul/negro (19 pines) con sumo cuidado para no doblar ningún pin.",
        imagen: "/images/ensamblaje/paso-8-4.webp",
        tituloVisual: "Paso 8.4: Conexión del Frontal USB 3.0",
        pieDeFoto: "Alinea perfectamente la guía plástica. No apliques fuerza lateral, si un pin se dobla inutilizarás los puertos USB frontales de alta velocidad del gabinete.",
      },
      {
        texto: "Conecta el conector de audio frontal HD_AUDIO en la esquina inferior izquierda.",
        imagen: "/images/ensamblaje/paso-8-5.webp",
        tituloVisual: "Paso 8.5: Audio Frontal (HD_AUDIO)",
        pieDeFoto: "Busca el cabezal etiquetado como AAFP o HD_AUDIO, casi siempre al extremo inferior izquierdo. Tiene un pin ciego (vacío) que te servirá de guía para no conectarlo al revés.",
      },
    ],
    alertaNovato:
      "El conector USB 3.0 de 19 pines tiene una ranura guía: no intentes forzarlo al revés porque sus pines son extremadamente frágiles.",
    herramientas: ["Destornillador Philips #2", "Bridas de velcro / plástico"],
  },
  {
    id: 9,
    fase: "Fase 3: El Músculo Gráfico",
    faseIndex: 3,
    titulo: "Instalación de la Tarjeta Gráfica (GPU)",
    tiempoEstimado: "6 min",
    nivelRiesgo: "Medio",
    icono: Monitor,
    descripcion:
      "El componente de mayor volumen e inversión del equipo, instalado en la ranura PCIe de máxima velocidad.",
    instrucciones: [
      {
        texto: "Retira las tapas metálicas de las ranuras PCIe de la parte trasera del gabinete correspondientes a la ranura PCIe x16 superior (normalmente la 2da y 3ra tapa).",
        imagen: "/images/ensamblaje/paso-9-1.webp",
        tituloVisual: "Paso 9.1: Retiro de Tapas PCIe",
        pieDeFoto: "Asegúrate de retirar las tapas correctas para que las salidas de video de la gráfica (HDMI, DisplayPort) queden accesibles desde el exterior del gabinete."
      },
      {
        texto: "Abre la pestaña basculante plástica de la ranura PCIe x16 superior de la placa madre.",
        imagen: "/images/ensamblaje/paso-9-2.webp",
        tituloVisual: "Paso 9.2: Preparación del Slot PCIe",
        pieDeFoto: "La pestaña debe quedar presionada hacia abajo o a un lado, igual que ocurre con las ranuras de la memoria RAM."
      },
      {
        texto: "Alinea la tarjeta de video e introdúcela verticalmente con una presión uniforme hasta escuchar el 'clic' de la pestaña trabándose.",
        imagen: "/images/ensamblaje/paso-9-3.webp",
        tituloVisual: "Paso 9.3: Inserción de la Tarjeta Gráfica",
        pieDeFoto: "La tarjeta debe bajar recta y pareja. Nunca la insertes en ángulo. El 'clic' indicará que ha llegado al fondo y el seguro se ha cerrado solo."
      },
      {
        texto: "Atornilla la chapa metálica de la GPU al chasis con dos tornillos para fijar su peso.",
        imagen: "/images/ensamblaje/paso-9-4.webp",
        tituloVisual: "Paso 9.4: Fijación al Chasis",
        pieDeFoto: "Usa los mismos tornillos de las tapas que retiraste previamente. Esto es vital para que la tarjeta no arranque la ranura por su propio peso."
      },
      {
        texto: "Conecta el cable de corriente dedicado (conector nativo 12V-2x6 o cables PCIe independientes de 8 pines; evita usar un solo cable en 'daisy-chain').",
        imagen: "/images/ensamblaje/paso-9-5.webp",
        tituloVisual: "Paso 9.5: Energía de la Tarjeta Gráfica",
        pieDeFoto: "El conector 12VHPWR (si usas NVIDIA Serie 40) debe introducirse hasta el fondo sin forzar curvas a menos de 3.5 cm del conector. Si usas cables de 8 pines tradicionales, utiliza un cable desde la fuente para cada conector de la gráfica."
      },
      {
        texto: "Si tu gráfica mide más de 28 cm o pesa más de 1 kg, coloca el soporte antidescolgamiento (bracket) suministrado para que no venza la ranura.",
        imagen: "/images/ensamblaje/paso-9-6.webp",
        tituloVisual: "Paso 9.6: Bracket Antidescolgamiento",
        pieDeFoto: "Estos soportes se apoyan en el suelo del gabinete o se atornillan debajo de la propia gráfica. Prolongarán la vida útil de tu placa madre y de la propia GPU."
      }
    ],
    alertaNovato:
      "Asegúrate de que el conector 12V-2x6 / 12VHPWR entre completamente a fondo sin dejar ninguna holgura visible; los cables a medio conectar pueden sobrecalentarse.",
    herramientas: ["Destornillador Philips #2"],
  },
  {
    id: 10,
    fase: "Fase 4: Primer Encendido y Configuración",
    faseIndex: 4,
    titulo: "El Momento de la Verdad y Configuración BIOS",
    tiempoEstimado: "10 min",
    nivelRiesgo: "Crítico",
    icono: Sparkles,
    descripcion:
      "La primera prueba de encendido, acceso a la BIOS para activar el perfil de memoria y puesta en marcha del sistema.",
    instrucciones: [
      {
        texto: "¡EL ERROR NÚMERO UNO!: Conecta el cable HDMI o DisplayPort de tu monitor al puerto de la TARJETA GRÁFICA, NUNCA al de la placa base.",
        imagen: "/images/ensamblaje/paso-10-1.webp",
        tituloVisual: "Paso 10.1: Conexión del Monitor",
        pieDeFoto: "Si conectas el monitor a la placa base teniendo una tarjeta gráfica instalada, no dará video o usarás gráficos integrados muy débiles."
      },
      {
        texto: "Enchufa el cable de corriente a la fuente y pon el interruptor trasero de la fuente en posición encendido 'I' (On).",
        imagen: "/images/ensamblaje/paso-10-2.webp",
        tituloVisual: "Paso 10.2: Alimentación General",
        pieDeFoto: "El 'I' es Encendido, el 'O' es Apagado. Al encenderlo, algunas placas madres iluminarán un pequeño LED de standby."
      },
      {
        texto: "Presiona el botón de encendido del gabinete. Los ventiladores girarán y los LEDs se encenderán. (En plataformas AM5 el primer encendido puede tardar hasta 60-90 segundos por el entrenamiento de memoria).",
        imagen: "/images/ensamblaje/paso-10-3.webp",
        tituloVisual: "Paso 10.3: El Botón de Encendido",
        pieDeFoto: "No te asustes si el equipo se reinicia un par de veces solo la primera vez. Es normal mientras la placa calibra las memorias."
      },
      {
        texto: "Presiona repetidamente la tecla 'SUPR' (Delete) o 'F2' en tu teclado al arrancar para ingresar a la BIOS.",
        imagen: "/images/ensamblaje/paso-10-4.webp",
        tituloVisual: "Paso 10.4: Ingreso a la BIOS",
        pieDeFoto: "La pantalla de presentación de la marca de tu placa madre te indicará qué tecla pulsar. Hazlo repetidamente ni bien enciendas la PC."
      },
      {
        texto: "En la BIOS, busca y activa el perfil de alta velocidad 'XMP' (Intel) o 'EXPO' (AMD) para que tu memoria RAM funcione a su velocidad contratada (ej. 6000 MHz en lugar de 4800 MHz).",
        imagen: "/images/ensamblaje/paso-10-5.webp",
        tituloVisual: "Paso 10.5: Activación XMP/EXPO",
        pieDeFoto: "Esto suele estar muy visible en la pantalla 'Easy Mode' o modo básico de cualquier BIOS moderna. Sin esto, estarás perdiendo un 10-15% de rendimiento."
      },
      {
        texto: "Guarda cambios con F10 y reinicia para proceder a la instalación limpia de Windows mediante pendrive USB.",
        imagen: "/images/ensamblaje/paso-10-6.webp",
        tituloVisual: "Paso 10.6: Guardado y Reinicio",
        pieDeFoto: "Asegúrate de tener conectado tu pendrive con el instalador de Windows antes de reiniciar, así la BIOS lo detectará y arrancará desde ahí automáticamente."
      }
    ],
    alertaNovato:
      "Si la pantalla queda negra en el primer arranque, observa los LEDs de diagnóstico de la placa (Boot, VGA, DRAM, CPU): te indicarán exactamente qué pieza requiere ajuste.",
    herramientas: ["Monitor + Teclado USB", "Pendrive USB con Windows"],
  },
  {
    id: 11,
    fase: "Fase 5: Avanzado - Peceras & Líquida",
    faseIndex: 5,
    titulo: "Instalación de Refrigeración Líquida (AIO)",
    tiempoEstimado: "15 min",
    nivelRiesgo: "Alto",
    icono: Droplet,
    descripcion: "Reglas de oro para montar sistemas All-in-One y evitar que la bomba trague aire o falle prematuramente.",
    instrucciones: [
      {
        texto: "Montar el bloque de la bomba en la CPU (aplicando presión en forma de cruz, igual que el disipador de aire).",
        imagen: "/images/ensamblaje/paso_11_1_1789638296052.jpg",
        tituloVisual: "Paso 11.1: Bloque de la Bomba",
        pieDeFoto: "La presión debe ser pareja sobre el procesador para maximizar el contacto térmico."
      },
      {
        texto: "Posición ideal del radiador: Montarlo en la parte superior (techo) de la caja expulsando el aire caliente hacia arriba.",
        imagen: "/images/ensamblaje/paso_11_2_1789638319113.jpg",
        tituloVisual: "Paso 11.2: Radiador en el Techo (Recomendado)",
        pieDeFoto: "Esta es la posición más segura porque garantiza que cualquier burbuja de aire se quede en el radiador y nunca llegue a la bomba."
      },
      {
        texto: "Si lo montas en el frontal o lateral, los tubos idealmente deben quedar hacia abajo, O el punto más alto del radiador debe estar SIEMPRE por encima de la bomba.",
        imagen: "/images/ensamblaje/paso_11_3_1789638329159.jpg",
        tituloVisual: "Paso 11.3: Radiador Frontal/Lateral",
        pieDeFoto: "Si la bomba es el punto más alto del circuito, atrapará burbujas de aire, provocando ruido y rompiendo el motor interno por funcionar en seco."
      },
      {
        texto: "Conectar el cable de la bomba al conector de la placa base marcado como 'AIO_PUMP' o 'W_PUMP', y los ventiladores del radiador al 'CPU_FAN'.",
        imagen: "/images/ensamblaje/paso_11_4_1789638339989.jpg",
        tituloVisual: "Paso 11.4: Cables de Bomba y Ventiladores",
        pieDeFoto: "El conector AIO_PUMP siempre entrega el 100% de la energía para que el flujo de agua no se detenga. CPU_FAN regula la velocidad de los ventiladores según el calor."
      }
    ],
    alertaNovato:
      "NUNCA montes la bomba en la CPU de manera que quede físicamente más alta que todas las partes del radiador. El aire sube, y si se acumula en la bomba, la quemará.",
    herramientas: ["Destornillador Phillips #2"],
  },
  {
    id: 12,
    fase: "Fase 5: Avanzado - Peceras & Líquida",
    faseIndex: 5,
    titulo: "Configuración en Gabinete Panorámico (Pecera)",
    tiempoEstimado: "25 min",
    nivelRiesgo: "Medio",
    icono: Box,
    descripcion: "Dominando el flujo de aire y el enrutamiento de cables en cajas de doble cámara con mucho cristal.",
    instrucciones: [
      {
        texto: "Flujo de aire para 'peceras': Monta ventiladores en la base y en el lateral metiendo aire fresco (intake).",
        imagen: "/images/ensamblaje/paso_12_1_1789638374982.jpg",
        tituloVisual: "Paso 12.1: Ventiladores de Entrada (Intake)",
        pieDeFoto: "Al no tener frontal de malla, el aire frío debe entrar por debajo, empujando el aire caliente hacia arriba para la GPU y CPU."
      },
      {
        texto: "Monta ventiladores de salida (exhaust) en la parte trasera y superior (o el radiador AIO en la parte superior).",
        imagen: "/images/ensamblaje/paso_12_2_1789638385745.jpg",
        tituloVisual: "Paso 12.2: Escape de Aire (Exhaust)",
        pieDeFoto: "Esto crea una presión de aire que atraviesa todos los componentes y saca el calor eficientemente."
      },
      {
        texto: "Aprovecha la doble cámara trasera: Oculta allí la fuente de alimentación, el exceso de cables y los controladores (hubs) ARGB.",
        imagen: "/images/ensamblaje/paso_12_3_1789638397221.jpg",
        tituloVisual: "Paso 12.3: Cámara Trasera y Gestión de Cables",
        pieDeFoto: "Usa tiras de velcro para agrupar los cables por su destino (poder, ventiladores, RGB) y así dejar el compartimento principal impecable."
      },
      {
        texto: "Manejo del Cristal Templado: Retira TODOS los paneles de cristal antes de ensamblar y colócalos en una superficie suave.",
        imagen: "/images/ensamblaje/paso_12_4_1789638408014.jpg",
        tituloVisual: "Paso 12.4: Riesgo del Cristal Templado",
        pieDeFoto: "El cristal templado puede estallar si su esquina o borde toca cerámica o baldosas. No instales los cristales hasta que el PC haya encendido exitosamente."
      }
    ],
    alertaNovato:
      "Si instalas todos los ventiladores sacando aire para ver sus luces, el PC se asfixiará. Asegúrate de tener la misma cantidad de ventiladores metiendo aire que sacando. (Se recomiendan ventiladores con palas reversas).",
    herramientas: ["Tiras de velcro / Bridas de plástico", "Destornillador Phillips #2"],
  },
  {
    id: 13,
    fase: "Fase 5: Avanzado - Peceras & Líquida",
    faseIndex: 5,
    titulo: "Refrigeración Líquida Custom (Custom Loop)",
    tiempoEstimado: "4+ horas",
    nivelRiesgo: "Muy Alto",
    icono: Droplet,
    descripcion: "El pináculo del modding: diseña tu propio circuito de refrigeración para CPU y GPU con tubos a medida y líquido refrigerante.",
    instrucciones: [
      {
        texto: "Instalación de Componentes: Monta los bloques de agua (Water Blocks) en la CPU y la GPU. Fija la bomba/depósito firmemente en el chasis.",
        imagen: "/images/ensamblaje/paso_13_1_1789638938853.jpg",
        tituloVisual: "Paso 13.1: Bloques y Bomba",
        pieDeFoto: "Asegúrate de remover los disipadores de fábrica de la GPU con extremo cuidado. Usa thermal pads en las memorias y VRMs de la GPU."
      },
      {
        texto: "Tuberías y Racores (Fittings): Corta y dobla los tubos (PETG/Acrílico requiere pistola de calor) y asegúralos con los fittings de compresión.",
        imagen: "/images/ensamblaje/paso_13_2_1789638951156.jpg",
        tituloVisual: "Paso 13.2: Tuberías Rígidas o Blandas",
        pieDeFoto: "Los tubos blandos son fáciles para principiantes. Los tubos rígidos ofrecen una estética profesional pero requieren medir y doblar con precisión milimétrica."
      },
      {
        texto: "Llenado del Circuito (Fill): Utiliza una botella dosificadora para llenar poco a poco el depósito con el líquido refrigerante (nunca agua del grifo).",
        imagen: "/images/ensamblaje/paso_13_3_1789638961982.jpg",
        tituloVisual: "Paso 13.3: Llenado del Depósito",
        pieDeFoto: "Usa toallas de papel alrededor de todos los fittings. Si cae una gota, no pasará nada porque la placa base aún NO tiene energía."
      },
      {
        texto: "Purgado (Bleed): Puentea el cable de 24 pines (ATX Jumper) para que la fuente solo alimente la bomba, sin encender el resto del PC.",
        imagen: "/images/ensamblaje/paso_13_4_1789639010276.jpg",
        tituloVisual: "Paso 13.4: Puenteo y Purgado",
        pieDeFoto: "Enciende y apaga la bomba iterativamente para que el agua recorra el circuito y saque el aire. ¡NUNCA dejes que la bomba funcione en seco sin líquido!"
      }
    ],
    alertaNovato:
      "Una fuga en un Custom Loop con el PC encendido destruirá los componentes. Siempre haz la prueba de purgado (Leak Test) de 24 horas solo con la bomba encendida, dejando la placa base, GPU y CPU completamente desconectadas de la corriente.",
    herramientas: ["Kit de Custom Loop", "Pistola de Calor (Tubos Rígidos)", "Botella Dosificadora", "ATX 24-pin Jumper", "Toallas de papel"],
  }
];

// Nombre corto de cada paso para los botones de la barra (la primera palabra del título se repetía).
const PASO_CORTO: Record<number, [string, string]> = {
  1: ["Preparación", "Prep"],
  2: ["CPU", "CPU"],
  3: ["SSD", "SSD"],
  4: ["RAM", "RAM"],
  5: ["Disipador", "Cooler"],
  6: ["Fuente", "PSU"],
  7: ["Placa", "Motherboard"],
  8: ["Cables", "Cables"],
  9: ["GPU", "GPU"],
  10: ["Windows", "Windows"],
  11: ["Líquida AIO", "AIO Cooler"],
  12: ["Pecera (Flujo)", "Fish-Tank Airflow"],
  13: ["Líquida Custom", "Custom Loop"]
};

// Hook personalizado para permitir el desplazamiento (scroll) arrastrando el ratón horizontalmente
function useDraggableScroll() {
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      ele.style.cursor = 'grabbing';
      startX = e.pageX - ele.offsetLeft;
      scrollLeft = ele.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      ele.style.cursor = '';
    };

    const onMouseUp = () => {
      isDown = false;
      ele.style.cursor = '';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ele.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      ele.scrollLeft = scrollLeft - walk;
    };

    ele.addEventListener('mousedown', onMouseDown);
    ele.addEventListener('mouseleave', onMouseLeave);
    ele.addEventListener('mouseup', onMouseUp);
    ele.addEventListener('mousemove', onMouseMove);

    return () => {
      ele.removeEventListener('mousedown', onMouseDown);
      ele.removeEventListener('mouseleave', onMouseLeave);
      ele.removeEventListener('mouseup', onMouseUp);
      ele.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return ref;
}

export function GuiaEnsamblajeStepByStep() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedFase, setSelectedFase] = useState<number>(0); // 0 = All
  const [mounted, setMounted] = useState<boolean>(false);
  const scrollRefFases = useDraggableScroll();
  const scrollRefPasos = useDraggableScroll();
  const { lang, tr } = useIdioma();
  const pasos = React.useMemo(() => ASSEMBLY_STEPS.map((p) => pasoEnIdioma(p, lang)), [lang]);
  const riesgo = (nivel: AssemblyStep["nivelRiesgo"]) =>
    nivel === "Crítico" ? tr("Crítico", "Critical") : nivel === "Medio" ? tr("Medio", "Medium") : tr("Bajo", "Low");

  // Modal / Lightbox for instruction illustration
  const [modalItem, setModalItem] = useState<{
    stepNum: number;
    subIdx: number;
    data: SubInstruction;
  } | null>(null);

  // Hover state for desktop floating preview
  const [hoveredItem, setHoveredItem] = useState<{
    stepNum: number;
    subIdx: number;
    data: SubInstruction;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentStep = pasos[currentStepIndex]; // Paso que se está mostrando actualmente
  const StepIcon = currentStep.icono;

  // Alterna el estado de completado de un paso. Si ya estaba completado, lo quita; si no, lo agrega a la lista
  const toggleComplete = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Reinicia la lista de pasos completados y vuelve al paso 1, previa confirmación del usuario
  const resetChecklist = () => {
    if (window.confirm(tr("¿Deseas reiniciar la lista de verificación de ensamblaje?", "Reset the assembly checklist?"))) {
      setCompletedSteps([]);
      setCurrentStepIndex(0);
    }
  };

  const progressPercent = Math.round(
    (completedSteps.length / pasos.length) * 100
  );

  const fasesList = [
    { index: 0, label: tr(`Todos los Pasos (${pasos.length})`, `All Steps (${pasos.length})`) },
    { index: 1, label: tr("1. En la Mesa (Fuera)", "1. On the Table (Outside)") },
    { index: 2, label: tr("2. En Gabinete (Estructura)", "2. In the Case (Structure)") },
    { index: 3, label: tr("3. Músculo Gráfico", "3. Graphics Muscle") },
    { index: 4, label: tr("4. Primer Encendido", "4. First Boot") },
    { index: 5, label: tr("5. PC Pecera (Avanzado)", "5. Fish-Tank PC (Advanced)") },
  ];

  // Navega hacia la imagen del paso/sub-paso anterior en el modal
  const handlePrevModalImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Evita que el clic se propague al contenedor y cierre el modal
    if (!modalItem) return;
    
    let stepIdx = modalItem.stepNum - 1;
    let subIdx = modalItem.subIdx - 1;
    
    while (stepIdx >= 0) {
      if (subIdx >= 0) {
        const step = pasos[stepIdx];
        const prevSub = step.instrucciones[subIdx];
        if (prevSub.imagen) {
          setModalItem({ stepNum: step.id, subIdx, data: prevSub });
          setCurrentStepIndex(stepIdx);
          return;
        }
        subIdx--;
      } else {
        stepIdx--;
        if (stepIdx >= 0) {
          subIdx = pasos[stepIdx].instrucciones.length - 1;
        }
      }
    }
  };

  // Navega hacia la imagen del paso/sub-paso siguiente en el modal
  const handleNextModalImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Evita que el clic se propague al contenedor y cierre el modal
    if (!modalItem) return;

    let stepIdx = modalItem.stepNum - 1;
    let subIdx = modalItem.subIdx + 1;

    while (stepIdx < pasos.length) {
      const step = pasos[stepIdx];
      if (subIdx < step.instrucciones.length) {
        const nextSub = step.instrucciones[subIdx];
        if (nextSub.imagen) {
          setModalItem({ stepNum: step.id, subIdx, data: nextSub });
          setCurrentStepIndex(stepIdx);
          return;
        }
        subIdx++;
      } else {
        stepIdx++;
        subIdx = 0;
      }
    }
  };

  return (
    <div className="w-full bg-[#08090a]/70 backdrop-blur-xl border border-white/15 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden mb-16">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-[11px] font-mono tracking-[0.2em] text-red-400 uppercase mb-3">
            <Wrench size={13} className="text-red-400" />
            {tr("[ GUÍA OFICIAL DE ENSAMBLAJE PASO A PASO 2026 ]", "[ OFFICIAL STEP-BY-STEP BUILD GUIDE 2026 ]")}
          </div>
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mb-2">
            {tr("Del Unboxing al Primer Encendido Exitoso", "From Unboxing to a Successful First Boot")}
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl font-sans font-light leading-relaxed">
            {tr(
              "Sigue el orden cronológico riguroso probado en taller. Marca cada paso completado e interactúa con las ilustraciones animadas para aprender visualmente.",
              "Follow the exact order we use in the workshop. Check off each step as you finish it and use the animated illustrations to learn visually."
            )}
          </p>
        </div>

        {/* Progress Card */}
        <div className="flex flex-col items-end shrink-0 p-4 rounded-xl bg-white/[0.04] border border-white/10 min-w-[200px]">
          <div className="flex items-center justify-between w-full text-xs font-mono mb-2">
            <span className="text-gray-400 uppercase">{tr("Progreso Ensamble", "Build Progress")}</span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-gray-400">
            <span>
              {completedSteps.length} {tr("de", "of")} {pasos.length} {tr("completados", "completed")}
            </span>
            {completedSteps.length > 0 && (
              <button
                onClick={resetChecklist}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                title={tr("Reiniciar progreso", "Reset progress")}
              >
                <RotateCcw size={11} /> {tr("Reiniciar", "Reset")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fase Navigation Tabs */}
      <div className="relative mb-6">
        <div ref={scrollRefFases} className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none text-xs font-mono cursor-grab">
          {fasesList.map((fase) => (
            <button
              key={fase.index}
              onClick={() => setSelectedFase(fase.index)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                selectedFase === fase.index
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              {fase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Selector Pills */}
      <div className="relative mb-8">
        <div ref={scrollRefPasos} className="flex overflow-x-auto gap-2 pb-4 scrollbar-none cursor-grab">
          {pasos.map((step, idx) => {
            const isDone = completedSteps.includes(step.id);
            const isCurrent = idx === currentStepIndex;
            const isFilteredOut = selectedFase !== 0 && step.faseIndex !== selectedFase;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border text-center transition-all cursor-pointer relative shrink-0 w-[100px] sm:w-[120px] ${
                  isCurrent
                    ? "bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20"
                    : isDone
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
                    : isFilteredOut
                    ? "opacity-30 bg-white/[0.02] border-white/5 text-gray-500"
                    : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{tr("PASO", "STEP")} {step.id}</span>
                <span className="text-xs truncate w-full px-1">{PASO_CORTO[step.id] ? tr(...PASO_CORTO[step.id]) : step.titulo.split(" ")[0]}</span>
                {isDone && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-black/40 border border-white/15 rounded-xl p-6 md:p-8 relative"
        >
          {/* Top badges & title */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider">
              <span className="px-2.5 py-1 rounded bg-white/10 text-white font-semibold">
                {tr("PASO", "STEP")} {currentStep.id} {tr("DE", "OF")} {pasos.length}
              </span>
              <span className="text-gray-400">{currentStep.fase}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 flex items-center gap-1">
                ⏱ {currentStep.tiempoEstimado}
              </span>
            </div>

            {/* Risk badge */}
            <div
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                currentStep.nivelRiesgo === "Crítico"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : currentStep.nivelRiesgo === "Medio"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              <ShieldAlert size={12} />
              {tr("Riesgo", "Risk")}: {riesgo(currentStep.nivelRiesgo)}
            </div>
          </div>

          {/* Title & Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <StepIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-medium text-white mb-2">
                {currentStep.titulo}
              </h3>
              <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed">
                {currentStep.descripcion}
              </p>
            </div>
          </div>

          {/* Instructions List with Visual Hover & Mobile Click Lightbox */}
          <div className="my-6 space-y-3 relative">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <CheckCircle2 size={13} className="text-red-400" />
                {tr("Instrucciones Detalladas de Montaje", "Detailed Assembly Instructions")}
              </h4>
              <span className="text-[11px] font-mono text-gray-400 hidden sm:inline-flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" />
                {tr("Pasa el ratón o toca una instrucción para ver su ilustración", "Hover over or tap an instruction to see its illustration")}
              </span>
            </div>

            <div className="space-y-3">
              {currentStep.instrucciones.map((rawInstruccion, i) => {
                const data = getInstructionData(rawInstruccion);
                const hasImage = Boolean(data.imagen);

                return (
                  <div
                    key={i}
                    onMouseEnter={() => {
                      if (hasImage) {
                        setHoveredItem({
                          stepNum: currentStep.id,
                          subIdx: i,
                          data,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                      if (hasImage) {
                        setModalItem({
                          stepNum: currentStep.id,
                          subIdx: i,
                          data,
                        });
                      }
                    }}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                      hasImage
                        ? "bg-white/[0.04] border-white/10 hover:border-red-500/50 hover:bg-white/[0.07] cursor-pointer"
                        : "bg-white/[0.03] border-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </span>
                      <div className="space-y-1">
                        <span className="text-xs md:text-sm text-gray-200 leading-relaxed font-sans block group-hover:text-white transition-colors">
                          {data.texto}
                        </span>
                        {hasImage && data.tituloVisual && (
                          <span className="text-[11px] font-mono text-red-400 font-semibold block">
                            • {data.tituloVisual}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action pill / Thumbnail indicator for visual guidance */}
                    {hasImage && (
                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                        {/* Mini thumbnail */}
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-white/20 bg-black/60 shrink-0 hidden sm:block">
                          <Image
                            src={data.imagen!}
                            alt={tr("Miniatura del paso", "Step thumbnail")}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="48px"
                          />
                        </div>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-red-600/20 group-hover:bg-red-600 text-red-300 group-hover:text-white text-[10px] font-mono uppercase tracking-wider font-semibold border border-red-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Eye size={12} />
                          <span>{tr("Ver Imagen", "View Image")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Floating Preview on Hover */}
            <AnimatePresence>
              {hoveredItem && hoveredItem.data.imagen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="hidden lg:flex flex-col absolute right-0 -top-12 z-30 w-80 bg-[#0d0f12]/95 border border-red-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-xl pointer-events-none"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-2">
                    <span className="text-red-400 font-bold uppercase flex items-center gap-1">
                      <ImageIcon size={11} />
                      {tr("PASO", "STEP")} {hoveredItem.stepNum}.{hoveredItem.subIdx + 1}
                    </span>
                    <span className="text-gray-500">{tr("Haz clic para ampliar", "Click to enlarge")}</span>
                  </div>
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-black mb-2">
                    <Image
                      src={hoveredItem.data.imagen}
                      alt={hoveredItem.data.tituloVisual || tr("Vista previa", "Preview")}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                  <span className="text-xs font-medium text-white line-clamp-1">
                    {hoveredItem.data.tituloVisual}
                  </span>
                  {hoveredItem.data.pieDeFoto && (
                    <span className="text-[11px] text-gray-300 font-sans line-clamp-2 mt-1">
                      {hoveredItem.data.pieDeFoto}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rookie Warning Alert */}
          {currentStep.alertaNovato && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 my-6">
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold block mb-1">
                  {tr("¡ALERTA DE ERROR COMÚN DE NOVATO!", "COMMON ROOKIE MISTAKE ALERT!")}
                </span>
                <p className="text-xs md:text-sm text-red-200/90 font-sans leading-relaxed">
                  {currentStep.alertaNovato}
                </p>
              </div>
            </div>
          )}

          {/* Tools required */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="text-gray-500 uppercase">{tr("Herramientas:", "Tools:")}</span>
              <span className="text-gray-300">{currentStep.herramientas.join(" • ")}</span>
            </div>

            {/* Complete step check button */}
            <button
              onClick={() => toggleComplete(currentStep.id)}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                completedSteps.includes(currentStep.id)
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {completedSteps.includes(currentStep.id) ? (
                <>
                  <Check size={14} /> {tr("Paso Completado", "Step Completed")}
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> {tr("Marcar como Completado", "Mark as Completed")}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer (Prev / Next) */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
            currentStepIndex === 0
              ? "opacity-30 cursor-not-allowed text-gray-500"
              : "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
          }`}
        >
          <ChevronLeft size={16} />
          {tr("Paso Anterior", "Previous Step")}
        </button>

        <span className="text-xs font-mono text-gray-400">
          {tr("Paso", "Step")} {currentStepIndex + 1} {tr("de", "of")} {pasos.length}
        </span>

        <button
          onClick={() =>
            setCurrentStepIndex((prev) => Math.min(pasos.length - 1, prev + 1))
          }
          disabled={currentStepIndex === pasos.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
            currentStepIndex === pasos.length - 1
              ? "opacity-30 cursor-not-allowed text-gray-500"
              : "bg-white text-black font-bold hover:bg-gray-200 cursor-pointer"
          }`}
        >
          {tr("Siguiente Paso", "Next Step")}
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Modal / Lightbox para ver la ilustración didáctica ampliada (Móvil y PC con botón 'X') */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {modalItem && modalItem.data.imagen && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6">
                {/* Backdrop oscuro */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setModalItem(null)}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Contenedor del Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 w-full max-w-2xl bg-[#0c0e12] text-white rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                >
                  {/* Barra superior con botón 'X' */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#07080a]">
                    <div className="flex items-center gap-2.5 text-xs font-mono tracking-wider">
                      <span className="px-2.5 py-1 rounded bg-red-600/30 text-red-400 font-bold border border-red-500/40">
                        {tr("PASO", "STEP")} {modalItem.stepNum}.{modalItem.subIdx + 1}
                      </span>
                      <span className="text-gray-200 font-medium truncate max-w-[240px] sm:max-w-md">
                        {modalItem.data.tituloVisual || `${tr("Ilustración Didáctica Paso", "Illustration for Step")} ${modalItem.stepNum}`}
                      </span>
                    </div>

                    {/* Botón 'X' para salir */}
                    <button
                      onClick={() => setModalItem(null)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                      title={tr("Cerrar (Esc)", "Close (Esc)")}
                      aria-label={tr("Cerrar", "Close")}
                    >
                      <X size={18} />
                      <span className="hidden sm:inline">{tr("Cerrar", "Close")}</span>
                    </button>
                  </div>

                  {/* Imagen ilustrativa animada */}
                  <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden group">
                    <Image
                      src={modalItem.data.imagen}
                      alt={modalItem.data.tituloVisual || tr("Ilustración de ensamblaje", "Assembly illustration")}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 720px"
                      priority
                    />
                    
                    {/* Controles de navegación */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <button
                        onClick={handlePrevModalImage}
                        disabled={modalItem.stepNum === 1 && modalItem.subIdx === 0}
                        className={`pointer-events-auto p-2 sm:p-3 rounded-full bg-black/60 text-white backdrop-blur-md transition-all border border-white/10 shadow-xl ${
                          modalItem.stepNum === 1 && modalItem.subIdx === 0
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-red-600 hover:scale-110 cursor-pointer"
                        }`}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNextModalImage}
                        disabled={modalItem.stepNum === pasos.length && modalItem.subIdx === pasos[pasos.length - 1].instrucciones.length - 1}
                        className={`pointer-events-auto p-2 sm:p-3 rounded-full bg-black/60 text-white backdrop-blur-md transition-all border border-white/10 shadow-xl ${
                          modalItem.stepNum === pasos.length && modalItem.subIdx === pasos[pasos.length - 1].instrucciones.length - 1
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-red-600 hover:scale-110 cursor-pointer"
                        }`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Detalle y explicación del paso */}
                  <div className="p-5 bg-[#0a0c10] border-t border-white/10 space-y-2.5 overflow-y-auto">
                    <div className="text-xs font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-red-400" />
                      {tr("Instrucción a seguir:", "What to do:")}
                    </div>
                    <p className="text-xs md:text-sm text-gray-200 font-sans leading-relaxed">
                      {modalItem.data.texto}
                    </p>
                    {modalItem.data.pieDeFoto && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/95 font-sans flex items-start gap-2.5 leading-relaxed">
                        <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{modalItem.data.pieDeFoto}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
