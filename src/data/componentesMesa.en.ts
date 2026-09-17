// Versión inglesa de componentesMesa.ts y de los textos de escenaLayers.json (17-09-2026). El español
// sigue siendo la fuente: aquí van las MISMAS fichas (mismo id) sólo con el texto traducido; posiciones,
// polígonos e imágenes se toman del español. Si se añade o cambia una ficha allí, hay que reflejarlo aquí.
import type { ComponenteMesa } from "@/data/componentesMesa";
import type { Lang } from "@/i18n/rutas";

type TextosFicha = Pick<
  ComponenteMesa,
  | "nombre"
  | "subtitulo"
  | "categoria"
  | "resumenRapido"
  | "queEs"
  | "queFuncionTiene"
  | "medidas"
  | "conectores"
  | "conQueSeConecta"
  | "tamanoYPeso"
  | "consejoTecnico"
>;

const EN: Record<string, TextosFicha> = {
  "placa-madre": {
    nombre: "Motherboard",
    subtitulo: "The backbone and central nervous system of the build",
    categoria: "Main Circuit Board",
    resumenRapido:
      "The central platform that links and powers the CPU, GPU, RAM and storage. It decides socket compatibility and electrical stability.",
    queEs:
      "The motherboard is the multi-layer fiberglass-and-copper printed circuit board that physically holds and connects every component of the computer. It is the base that decides which processors, RAM generations and cards you can install.",
    queFuncionTiene:
      "It works as a clean power distributor and a data highway. It carries millions of signals per second between the processor, RAM, graphics card and storage drives through microscopic high-frequency copper traces. Its power phases (VRM) regulate voltage, stepping the PSU's 12V down to the fine voltages the processor needs (about 1.1V to 1.35V); a board with a good VRM heatsink avoids frequency drops from overheating.",
    medidas: {
      estandar: "ATX, Micro-ATX (mATX) and Mini-ITX form factors",
      dimensiones: "ATX: 305 × 244 mm | mATX: 244 × 244 mm | Mini-ITX: 170 × 170 mm",
      descripcion: "Standard ATX is the most popular because it offers more ports and heatsink-covered M.2 slots.",
    },
    conectores: [
      "CPU socket (AM5 for AMD Ryzen or LGA1851/1700 for Intel)",
      "2 to 4 DIMM slots for DDR5 or DDR4 RAM (not interchangeable)",
      "1 to 3 steel-reinforced PCIe x16 slots for graphics cards",
      "2 to 5 M.2 NVMe slots (PCIe 4.0 / PCIe 5.0) for ultra-fast storage",
      "Main 24-pin ATX power connector",
      "8+8-pin EPS connectors (extra power for the CPU)",
      "Headers for fans (4-pin PWM), AIO pumps, ARGB (3-pin 5V) and front-panel USB-C",
    ],
    conQueSeConecta: [
      {
        componente: "Processor (CPU)",
        tipoConexion: "Central socket with ILM lever",
        explicacion: "It sits flat on the gold pin field and is locked with the retention bracket, without forcing it.",
      },
      {
        componente: "Graphics Card (GPU)",
        tipoConexion: "Main PCIe x16 slot (steel-reinforced)",
        explicacion: "It plugs straight into the first PCIe slot for full speed with no added latency.",
      },
      {
        componente: "RAM",
        tipoConexion: "DIMM slots with latches",
        explicacion: "Modules go in vertically in alternating slots (channels A2 and B2) to enable Dual Channel.",
      },
      {
        componente: "M.2 SSD Storage",
        tipoConexion: "M.2 Key-M slot + screw/latch",
        explicacion: "It goes in at a 30-degree angle and is held down under the aluminum heatsinks.",
      },
      {
        componente: "Power Supply (PSU)",
        tipoConexion: "24-pin ATX + 8-pin EPS cables",
        explicacion: "Delivers regulated power to every trace and power phase on the board.",
      },
      {
        componente: "Case (Chassis)",
        tipoConexion: "Screws on brass standoffs",
        explicacion: "Holds the board to the chassis while keeping it from shorting against the metal tray.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "30.5 cm long × 24.4 cm wide × 4.5 cm tall (with VRM heatsinks)",
      pesoPromedio: "1.2 kg to 2.2 kg",
      detalle: "High-end boards with full metal armor, a backplate and solid copper heatsinks are noticeably heavier.",
    },
    consejoTecnico:
      "1) COMPATIBILITY RULE: The physical socket must match your CPU 100% (AMD Ryzen 9000/7000 needs Socket AM5; Intel Core Ultra 200 series needs Socket LGA1851). There are no adapters. 2) Always install the processor, RAM and M.2 SSD with the motherboard sitting on its box, before screwing it into the case: you'll have plenty of room to work comfortably.",
  },
  procesador: {
    nombre: "Processor (CPU)",
    subtitulo: "The Central Processing Unit, the math brain of the PC",
    categoria: "Computing & Logic",
    resumenRapido:
      "The brain of your PC: it runs game logic, collision physics and AI. For gaming, per-core speed and 3D V-Cache matter far more than having 24 office-grade cores.",
    queEs:
      "The CPU (Central Processing Unit) is a nanometer-scale silicon chip that packs billions of microscopic transistors into an area smaller than a matchbox. It is the sequential computing engine that coordinates all the hardware.",
    queFuncionTiene:
      "It reads and runs every instruction from the operating system, calculates game physics (trajectories, collisions, non-player character logic), syncs your peripherals and sends each frame to the graphics card. [THE CORE-COUNT TRAP]: For gaming, a modern high-frequency 6- to 8-core processor with a large L3 cache (like AMD's 3D V-Cache in the Ryzen X3D series) easily beats 16- to 24-core processors designed for productivity and office work.",
    medidas: {
      estandar: "LGA (Land Grid Array) or BGA package",
      dimensiones: "About 45 × 37.5 mm (Intel) / 40 × 40 mm (AMD AM5)",
      descripcion: "The PCB substrate plus the metal heat spreader (IHS) is about 4.5 mm thick in total.",
    },
    conectores: [
      "Field of gold contact pads on the underside (1718 pads on AM5, 1851 or 1700 on Intel)",
      "No external cables; all power and PCIe/DDR data flow through the socket pins.",
    ],
    conQueSeConecta: [
      {
        componente: "Motherboard",
        tipoConexion: "LGA socket with a retention lever",
        explicacion: "It makes precise contact with the socket's spring pins, with no soldering needed.",
      },
      {
        componente: "Heatsink / Cooler",
        tipoConexion: "Surface thermal contact through thermal paste",
        explicacion: "Its nickel-plated copper spreader (IHS) passes heat straight to the air cooler or liquid block.",
      },
      {
        componente: "RAM and GPU",
        tipoConexion: "PCIe lanes and integrated memory controller (IMC)",
        explicacion: "The processor talks directly to the RAM modules and the first PCIe x16 slot at huge speeds.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "4.5 cm × 3.75 cm × 0.45 cm",
      pesoPromedio: "28 g to 42 g",
      detalle: "Very dense and rigid thanks to its solid copper heat spreader, soldered to the silicon with indium.",
    },
    consejoTecnico:
      "1) Careful when inserting!: Line up the gold triangle on one corner of the processor with the socket mark before lowering the lever, without forcing it; socket pins are microscopic and must never be touched with your fingers. 2) Check whether your CPU comes with a stock cooler (boxed) or needs a separate one: processors above 65W-105W TDP need a dual-tower air cooler or liquid cooling to avoid thermal throttling.",
  },
  "tarjeta-grafica": {
    nombre: "Dedicated Graphics Card (GPU)",
    subtitulo: "The engine for 3D visuals, ray tracing and AI",
    categoria: "Graphics Processing",
    resumenRapido:
      "The most important part for gaming: it renders the frames on screen (FPS), textures, reflections and ray tracing in real time.",
    queEs:
      "It is a complete computer inside your PC: a parallel graphics processor with thousands of shader cores, high-bandwidth VRAM (GDDR6/GDDR7) and a large heatsink with axial fans.",
    queFuncionTiene:
      "It calculates and displays the 3D worlds of your games. It runs ray tracing, AI upscaling and frame generation (DLSS 3.5/4.0 or FSR) and handles video rendering. [VRAM GUIDE BY RESOLUTION]: 8 GB to 12 GB is enough for competitive 1080p; 12 GB to 16 GB is recommended for 1440p (the gaming sweet spot in 2026); and 4K with ultra textures and ray tracing needs 16 GB to 24 GB of VRAM to avoid stutter.",
    medidas: {
      estandar: "PCIe card, 2, 2.5 or 3.5 slots thick",
      dimensiones: "Compact models: 200 - 245 mm | Triple-fan models: 300 - 345 mm long",
      descripcion: "Thickness ranges from 40 mm to 72 mm; width is usually 125 to 150 mm.",
    },
    conectores: [
      "Gold PCIe x16 edge connector, Gen 4 or Gen 5 (interface with the motherboard)",
      "High-power 12V-2x6 connector (16-pin) or traditional 8-pin PCIe connectors",
      "Video outputs: 3x DisplayPort 2.1 / 1.4a and 1x HDMI 2.1a for high refresh rate monitors (144Hz to 540Hz)",
    ],
    conQueSeConecta: [
      {
        componente: "Motherboard",
        tipoConexion: "Reinforced main PCIe x16 slot",
        explicacion: "Push it in firmly until the rear safety latch locks the card.",
      },
      {
        componente: "Case (Chassis)",
        tipoConexion: "Screws in the rear expansion bay",
        explicacion: "It is screwed to the rear metal slots to hold the card's weight.",
      },
      {
        componente: "Power Supply (PSU)",
        tipoConexion: "Dedicated PCIe cable or direct 450W/600W 12V-2x6 connector",
        explicacion: "Receives direct power for the GPU's VRM circuits and VRAM.",
      },
      {
        componente: "Monitor(s)",
        tipoConexion: "DisplayPort or HDMI cables",
        explicacion: "Always plug the video cable into the graphics card, not the motherboard!",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "31.0 cm long × 13.5 cm wide × 6.2 cm thick",
      pesoPromedio: "1.2 kg to 2.4 kg",
      detalle: "Vapor chamber coolers and dense fin stacks push high-end cards past 2 kilograms.",
    },
    consejoTecnico:
      "1) ROOKIE MISTAKE NUMBER ONE!: ALWAYS plug the HDMI or DisplayPort cable into the graphics card's ports and NEVER into the motherboard; otherwise you'll be gaming on slow integrated graphics instead of your GPU. 2) If your GPU is longer than 28 cm or weighs more than 1.2 kg, always use an anti-sag bracket so it doesn't strain the PCIe slot. 3) Don't buy a $1,000 GPU if you have a 60Hz office monitor.",
  },
  "memoria-ram": {
    nombre: "RAM (DDR5 / DDR4)",
    subtitulo: "The ultra-fast, low-latency workbench",
    categoria: "Volatile Memory",
    resumenRapido:
      "An ultra-fast workbench. It holds textures and immediate data so they can be reached in nanoseconds, avoiding stutter.",
    queEs:
      "Random access memory (RAM) is made of semiconductor chips that temporarily hold the data the processor is actively working on while the computer is on.",
    queFuncionTiene:
      "It removes waiting times by moving data between the SSD and the CPU/GPU in nanoseconds. [HOW MUCH RAM IN 2026?]: 32 GB (2x16GB) in Dual Channel is the must-have standard; modern games like Cyberpunk or Starfield easily use 14-16 GB on their own, so 16 GB causes freezes from disk paging (swap) if Discord or a browser is open. 64 GB only makes sense for 4K/8K editing or 3D work. DDR5 and DDR4 are physically incompatible.",
    medidas: {
      estandar: "288-pin DIMM module (for desktop computers)",
      dimensiones: "133.35 mm long × 31.25 to 44 mm tall (depending on heatsink and RGB diffuser)",
      descripcion: "Each module is about 6.5 to 8 mm thick with an aluminum heatsink.",
    },
    conectores: [
      "288-pin gold edge connector with an off-center safety notch",
      "No external cables; it takes power (1.1V to 1.45V) and clock signals directly from the motherboard slot.",
    ],
    conQueSeConecta: [
      {
        componente: "Motherboard",
        tipoConexion: "DIMM slots with hinged latches",
        explicacion: "Press it straight down into the recommended alternating slots (usually slots 2 and 4) to enable Dual Channel.",
      },
      {
        componente: "CPU Cooler",
        tipoConexion: "Physical clearance (RAM clearance)",
        explicacion: "Make sure the module height doesn't hit the front fan of a large air cooler.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "13.3 cm × 4.2 cm × 0.7 cm per module",
      pesoPromedio: "45 g to 70 g per module",
      detalle: "Anodized aluminum heatsinks with RGB LED light bars give them their typical weight.",
    },
    consejoTecnico:
      "1) Always install in slots 2 and 4 (A2 and B2)! Using side-by-side slots disables Dual Channel and cuts bandwidth in half. 2) TURN ON XMP/EXPO IN THE BIOS!: The first time you power on your PC, enter the BIOS and enable the XMP (Intel) or EXPO (AMD) profile; otherwise the RAM runs at its minimum base speed and you lose up to 15-20% performance.",
  },
  "disipador-cpu": {
    nombre: "CPU Cooler (Air Cooler / AIO)",
    subtitulo: "Removes heat so the CPU stays at full speed",
    categoria: "Thermal Cooling",
    resumenRapido: "Absorbs the 80W-250W+ of heat from the processor and pushes it out with axial fans.",
    queEs:
      "It is a heat radiator made of a polished copper base, several sintered heat pipes (filled with capillary fluid) and a large tower with dozens of ultra-thin aluminum fins.",
    queFuncionTiene:
      "It prevents thermal throttling and processor wear. [AIR VS LIQUID AIO]: A dual-tower air cooler (like the Thermalright Peerless Assassin or Noctua NH-D15) lasts forever: there's no mechanical pump to fail and no liquid to evaporate after 4-5 years, which makes it ideal for CPUs up to 180W. Liquid coolers (240/360mm AIOs) are recommended for extreme CPUs (>200W, like i9 / Ryzen 9) or compact cases where a 160 mm cooler would hit the glass.",
    medidas: {
      estandar: "Single tower or dual tower with 120 mm or 140 mm fans",
      dimensiones: "Height: 154 to 165 mm | Width: 125 to 140 mm | Depth: 110 to 145 mm",
      descripcion: "Height is the critical measurement: it must fit comfortably within the width of the case.",
    },
    conectores: [
      "1 or 2 4-pin PWM fan connectors (plug into CPU_FAN and CPU_OPT)",
      "1 standard 3-pin (5V) ARGB connector for lighting synced with the motherboard",
    ],
    conQueSeConecta: [
      {
        componente: "Processor (CPU)",
        tipoConexion: "Pressure-mounted copper base with thermal paste in between",
        explicacion: "Thermal paste fills the microscopic imperfections in the metal so no air is trapped.",
      },
      {
        componente: "Motherboard",
        tipoConexion: "Rear metal backplate and threaded mounting bars",
        explicacion: "Spreads the clamping force evenly across the four corners of the socket.",
      },
      {
        componente: "Fan headers",
        tipoConexion: "4-pin PWM connector",
        explicacion: "Lets the motherboard change fan speed (RPM) from silent to maximum depending on temperature.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "16.0 cm tall × 13.0 cm wide × 13.5 cm deep",
      pesoPromedio: "850 g to 1,450 g",
      detalle: "Dual-tower coolers with 6 to 8 copper heat pipes and two fans weigh more than a kilogram.",
    },
    consejoTecnico:
      "1) THE CLEAR 'PEEL OFF' FILM!: Always check the copper base before screwing it down; coolers ship with a plastic sheet that says to remove it. If you leave it on, the CPU will hit 100°C in seconds. 2) Apply a pea-sized dot (or a thin cross) of thermal paste to the center of the processor; don't spread it with your fingers, to avoid air bubbles.",
  },
  "almacenamiento-ssd": {
    nombre: "NVMe M.2 PCIe 4.0 / PCIe 5.0 SSD (Storage)",
    subtitulo: "Ultra-fast solid-state storage (5,000 to 14,700 MB/s) with no moving parts",
    categoria: "Permanent Storage",
    resumenRapido:
      "Extreme read/write speeds (5,000 to 7,450 MB/s on Gen4 drives like the Samsung 990 PRO and WD_BLACK SN850X, up to 14,700 MB/s on Gen5). Boots Windows in 4 seconds and loads game maps instantly with DirectStorage.",
    queEs:
      "It is an ultra-compact permanent storage drive in M.2 format, built from 3D NAND flash memory (176- to 232-layer TLC) and a multi-core controller with dedicated DRAM cache (or HMB: Host Memory Buffer). Unlike traditional hard drives (HDD), limited to 150 MB/s with spinning magnetic platters and vibration-sensitive read heads, or older SATA SSDs limited to 560 MB/s, an NVMe SSD talks directly to the processor's PCI Express lanes and reaches huge bandwidth.",
    queFuncionTiene:
      "It permanently stores Windows, heavy applications and your whole game library. In modern games it uses the Microsoft DirectStorage API to decompress high-resolution assets and textures directly on the graphics card (VRAM) without overloading the CPU, removing loading screens and annoying texture 'pop-in' in open worlds. Its endurance is measured in TBW (Total Bytes Written): 1TB to 4TB models handle between 600 and 2,400 terabytes of writes.",
    medidas: {
      estandar: "M.2 2280 form factor (22 mm wide × 80 mm long, the universal standard in gaming PCs)",
      dimensiones: "22 mm wide × 80 mm long × 2.38 mm thick (single-sided) or up to 12 - 15 mm (with a finned heatsink)",
      descripcion:
        "The 2280 size works with practically 100% of desktop motherboards. Shorter sizes like 2230 (30 mm) and 2242 (42 mm) are meant for handheld consoles (Steam Deck, ROG Ally) and thin laptops.",
    },
    conectores: [
      "M.2 'Key M' edge connector with a notch at pins 59-66 and 75 gold pins over a PCIe 4.0/5.0 x4 interface",
      "Half-moon mounting point at the end for a tiny M2 × 3mm screw or a tool-free EZ-Latch / Q-Latch clip",
      "High-conductivity silicone thermal pad (5 to 8 W/mK) that touches the motherboard's metal heatsink",
      "No power or SATA cables: it gets clean 3.3V power and all data lines straight from the motherboard slot",
    ],
    conQueSeConecta: [
      {
        componente: "Motherboard",
        tipoConexion: "Primary M.2 PCIe Gen4 / Gen5 x4 slot",
        explicacion: "It goes in at a 30-degree angle until it seats firmly on the gold contacts, then is lowered flat to be secured.",
      },
      {
        componente: "Motherboard Heatsink (M.2 Shield / Armor)",
        tipoConexion: "Aluminum alloy heatsink with a pre-applied thermal pad",
        explicacion:
          "Draws heat from the controller chip (which can pass 75°C during long transfers) into the case airflow to avoid thermal throttling.",
      },
      {
        componente: "Processor (CPU)",
        tipoConexion: "4 dedicated point-to-point PCIe lanes",
        explicacion: "The main M2_1 slot talks directly to the CPU with just microseconds of latency, without going through the chipset.",
      },
      {
        componente: "Graphics Card (GPU)",
        tipoConexion: "Direct data path through Microsoft DirectStorage",
        explicacion: "Sends textures and 3D models straight to the graphics card's VRAM in real time.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "8.0 cm long × 2.2 cm wide × 0.24 cm tall (without heatsink)",
      pesoPromedio: "8 grams (up to 45 grams with a passive metal heatsink)",
      detalle: "Incredibly light and compact: it weighs about 1% of a traditional 3.5-inch mechanical hard drive (700 grams).",
    },
    consejoTecnico:
      "1) GOLDEN RULE WHEN MOUNTING!: Before screwing your motherboard's metal heatsink onto the M.2 SSD, ALWAYS remove the clear or blue protective film on the thermal pad. If you leave it on, the plastic acts as an insulator and the SSD will go past 85°C, throttling and losing a lot of speed. 2) Always install the main SSD with the operating system in the top M.2 slot (M2_1, closest to the socket): it has 4 PCIe lanes wired directly to the CPU.",
  },
  "fuente-poder": {
    nombre: "Power Supply (Corsair PSU)",
    subtitulo: "The electrical heart that delivers clean, protected voltages",
    categoria: "Power Delivery",
    resumenRapido: "Turns wall power into safe 12V, 5V and 3.3V rails for every part.",
    queEs:
      "It is your PC's high-efficiency power converter. It turns the alternating current (110V/220V AC) from your wall outlet into several perfectly filtered and regulated direct current (DC) lines.",
    queFuncionTiene:
      "It feeds every circuit in the computer with stable power. [80+ GOLD AND HOW MANY WATTS]: 80 Plus Gold guarantees that at least 90% of the energy becomes usable power (less than 10% is lost as heat). To size your PSU: add the max TDP of your CPU + GPU + 100W for fans/drives, and always leave a 150W to 200W margin (or 25%) to absorb microsecond transient spikes without shutdowns. Modern ATX 3.1 / PCIe 5.1 power supplies include a native 12V-2x6 connector for GPUs.",
    medidas: {
      estandar: "Standard ATX format (fits 95% of cases)",
      dimensiones: "150 mm wide × 86 mm tall × 140 to 160 mm deep (or 180 mm on 1000W+ models)",
      descripcion: "Modular power supplies let you connect only the cables you use, keeping the inside of the case clean.",
    },
    conectores: [
      "1x main 24-pin ATX connector (for the motherboard)",
      "1 or 2x 8-pin (4+4) EPS 12V connectors for CPU power",
      "1x native 12V-2x6 / 12VHPWR (PCIe Gen 5) connector for modern graphics cards",
      "Several traditional 6+2-pin PCIe connectors",
      "SATA and Molex peripheral cables for fans and RGB controllers",
      "External C14 power inlet with a physical I/O switch",
    ],
    conQueSeConecta: [
      {
        componente: "Case (Chassis)",
        tipoConexion: "4 standard hex screws at the lower rear",
        explicacion: "It sits in the bottom tunnel (PSU shroud) with its fan facing the bottom dust filter.",
      },
      {
        componente: "Motherboard and Components",
        tipoConexion: "Modular power cable set",
        explicacion: "Runs each cable neatly behind the case's motherboard tray.",
      },
      {
        componente: "Home Power Grid",
        tipoConexion: "Grounded C13 wall power cable",
        explicacion: "We always recommend plugging the PSU into a surge protector or a UPS with voltage regulation.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "15.0 cm wide × 14.0 cm deep × 8.6 cm tall",
      pesoPromedio: "1.7 kg to 2.6 kg",
      detalle: "Heavy copper transformers, choke coils and internal aluminum heatsinks give it its solid build.",
    },
    consejoTecnico:
      "1) DANGER WITH MODULAR CABLES!: Never use modular cables from one power supply on a different brand or model, even if the connector fits. The internal pinouts vary between brands and you would instantly fry the motherboard or GPU. 2) Always insist on certified protections: OVP (over-voltage), UVP (under-voltage), OCP (over-current), SCP (short circuit) and OTP (over-temperature).",
  },
  gabinete: {
    nombre: "Case (White Chassis)",
    subtitulo: "The structure, support and airflow tunnel",
    categoria: "Chassis & Structure",
    resumenRapido: "A steel and tempered glass structure that protects the components and guides airflow.",
    queEs:
      "It is the structural box, built from electro-galvanized steel (SPCC), aluminum alloys and panoramic tempered glass panels, that holds and protects all the internal parts of the PC.",
    queFuncionTiene:
      "It defines the cooling airflow tunnel. The front fans pull fresh air toward the graphics card and processor, while the top and rear fans push the hot air out. [POSITIVE PRESSURE]: Always set up more filtered intake fans than exhaust fans; this creates overpressure that pushes air out through the gaps and keeps dust from getting in passively.",
    medidas: {
      estandar: "Mid-Tower (ATX) or Full-Tower",
      dimensiones: "Height: 450 to 490 mm | Width: 215 to 235 mm | Depth: 440 to 480 mm",
      descripcion: "Leaves enough room for CPU coolers up to 170 mm tall and GPUs up to 380 mm long.",
    },
    conectores: [
      "F_PANEL cable (Power SW, Reset SW, Power LED, HDD LED) for the front power button",
      "Internal USB 3.0 (19-pin) connector and high-speed USB-C Type-E connector",
      "Internal HD_AUDIO cable for the combined headphone and microphone jack",
      "PWM/ARGB controller or splitter for the pre-installed fans",
    ],
    conQueSeConecta: [
      {
        componente: "Motherboard",
        tipoConexion: "Brass standoffs with M3 / 6-32 screws",
        explicacion: "Electrically isolates the board from the chassis to prevent any grounding or short circuit.",
      },
      {
        componente: "Power Supply (PSU)",
        tipoConexion: "Bottom compartment with anti-vibration pads",
        explicacion: "Separates it from the main compartment so its heat doesn't affect the GPU.",
      },
      {
        componente: "Fans and Radiators",
        tipoConexion: "Rails with several mounting positions for 120 mm and 140 mm fans",
        explicacion: "Lets you set up positive air pressure to keep dust from getting in passively.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "46.5 cm tall × 22.0 cm wide × 45.0 cm deep",
      pesoPromedio: "6.8 kg to 11.5 kg (empty, with a tempered glass panel)",
      detalle: "Once all the components are installed, the complete computer usually weighs between 12 and 16 kilograms.",
    },
    consejoTecnico:
      "1) Always choose a perforated mesh front over sealed glass: the GPU can run 15°C to 20°C cooler with mesh. 2) Check GPU clearance!: If you install a liquid cooling radiator at the front, subtract 52 to 55 mm from the maximum GPU length so they don't collide.",
  },
  "asistente-felino": {
    nombre: "Ranbisho the Supervisor (Easter Egg)",
    subtitulo: "The most demanding QA inspector in the lab",
    categoria: "Moral Support",
    resumenRapido: "Makes sure no screws get lost on the table and naps on the empty boxes.",
    queEs: "An orange tabby cat, expert in quality control, thermal comfort and keeping hardware builders company.",
    queFuncionTiene:
      "Offers moral support during tense moments when the PC doesn't turn on the first time. Makes sure every component box is inspected as a comfy bed.",
    medidas: {
      estandar: "Fluffy Domestic Cat format",
      dimensiones: "About 45 cm long + a 25 cm tail",
      descripcion: "Can fit into any cardboard box, no matter its size.",
    },
    conectores: [
      "Ultra-sensitive touch sensors behind the ears and under the chin",
      "Wireless link to food cans and catnip toys",
    ],
    conQueSeConecta: [
      {
        componente: "Component Boxes",
        tipoConexion: "Immediate occupation by cat law ('If it fits, I sits')",
        explicacion: "No empty graphics card or motherboard box goes untested.",
      },
      {
        componente: "Small screws",
        tipoConexion: "Playful paw swats",
        explicacion: "Careful! Keep your M.2 screws in a magnetic bowl so they don't roll under the table.",
      },
    ],
    tamanoYPeso: {
      tamanoPromedio: "45 cm long × 20 cm tall",
      pesoPromedio: "4.2 kg of pure charm",
      detalle: "Purrs at 40 decibels when the build passes its stress test.",
    },
    consejoTecnico:
      "Keep Ranbisho and other pets away from the PC while you build so static electricity from their fur doesn't jump to the delicate circuits, and clean your case's dust filters often.",
  },
};

/** Ficha de la mesa en el idioma de la página (en inglés, si falta la traducción, queda en español). */
export function fichaEnIdioma(ficha: ComponenteMesa, lang: Lang): ComponenteMesa {
  if (lang !== "en") return ficha;
  const t = EN[ficha.id];
  return t ? { ...ficha, ...t } : ficha;
}

// Textos de las piezas de la escena (escenaLayers.json), por id de capa.
const CAPAS_EN: Record<string, { title: string; category: string; description: string }> = {
  cat: {
    title: "Ranbisho the Supervisor (Easter Egg)",
    category: "Pet",
    description: "Makes sure no screws get lost on the table and naps on the empty boxes.",
  },
  cup: { title: "Metal Pencil Cup", category: "Decoration", description: "Metal cup with workshop markers and pencils." },
  case: {
    title: "White RGB Case",
    category: "Case",
    description: "A steel and tempered glass structure that protects the components and guides airflow.",
  },
  cooler: {
    title: "Dual-Tower CPU Cooler",
    category: "Cooling",
    description: "Heat dissipation system that keeps the processor at safe temperatures.",
  },
  motherboard: {
    title: "ATX Gaming Motherboard",
    category: "Motherboard",
    description: "The central platform that links and powers the CPU, GPU, RAM and storage.",
  },
  ssd: {
    title: "WD_BLACK Gen4 NVMe SSD",
    category: "Storage",
    description: "Ultra-fast NVMe solid-state storage drive with no moving parts.",
  },
  gpu: {
    title: "Dedicated Graphics Card (GPU)",
    category: "GPU",
    description: "The engine for 3D visuals, ray tracing and AI acceleration.",
  },
  psu: {
    title: "Power Supply (PSU)",
    category: "PSU",
    description: "Converts and stabilizes electrical current to deliver clean power to the PC.",
  },
  ram: {
    title: "Kingston FURY DDR5 RGB RAM Kit (4x)",
    category: "RAM",
    description: "Very high-speed volatile memory that holds textures and immediate game data.",
  },
  cpu: {
    title: "Processor (Intel Core CPU)",
    category: "CPU",
    description: "The Central Processing Unit, the math brain that coordinates the whole system.",
  },
};

/** Título, categoría y descripción de una capa de la escena en el idioma de la página. */
export function capaEnIdioma<T extends { id: string; title: string; category: string; description: string }>(
  capa: T,
  lang: Lang
): T {
  if (lang !== "en") return capa;
  const t = CAPAS_EN[capa.id];
  return t ? { ...capa, ...t } : capa;
}
