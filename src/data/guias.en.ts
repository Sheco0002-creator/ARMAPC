// Versión inglesa de la biblioteca de Guías (17-09-2026): tarjetas de guides.json y artículos de
// GUIDE_FULL_ARTICLES (GuiasView.tsx). El español sigue siendo la fuente; aquí van los mismos slugs.
// Si se añade o cambia una guía allí, hay que reflejarlo aquí (si falta, se enseña en español).

export type ArticuloGuia = {
  keyPoints: string[];
  sections: { title: string; body: string }[];
};

export const TARJETAS_EN: Record<string, { title: string; summary: string }> = {
  glosario: {
    title: "Beginner's Glossary",
    summary: "What each part of a PC is, explained in plain words: CPU, GPU, RAM, motherboard and the rest, without jargon.",
  },
  compatibilidad: {
    title: "Component Compatibility",
    summary:
      "The rules that make parts fit together: socket, RAM type, case size and power supply wattage. The same things the configurator checks.",
  },
  "elegir-gpu": {
    title: "How to Choose Your Graphics Card",
    summary: "The part that shapes your gaming experience the most. How to pick it for the resolution you play at, without overpaying or falling short.",
  },
  "errores-comunes": {
    title: "Common Mistakes When Building Your First PC",
    summary: "The most frequent slip-ups on a first build — a cheap PSU, a bad budget, forgetting about cooling — and how to avoid all of them.",
  },
  "cuanta-ram": {
    title: "How Much RAM Do I Need?",
    summary: "16 GB, 32 GB or more: how much memory you really need for what you do with your PC, without overspending or falling short.",
  },
  "fuente-de-poder": {
    title: "Power Supply Guide",
    summary: "How many watts you need, what 80+ certification means and why the power supply is the one part not to cheap out on.",
  },
  "elegir-cpu": {
    title: "How to Choose Your Processor",
    summary: "Cores, cache and socket: what really matters when choosing your PC's brain, and why the most expensive one isn't always best for gaming.",
  },
  almacenamiento: {
    title: "Storage Guide (SSD)",
    summary: "NVMe vs SATA, how many GB or TB you need and why speed matters more for loading games than for your FPS.",
  },
  "liquidos-pecera": {
    title: "Coolants for Fishbowl PCs",
    summary:
      "Which coolant to use in a custom loop for a fishbowl PC: clear, tinted, pastel or shimmer. Which one gets dirty least, what to never use and how often to change it.",
  },
  "gabinete-refrigeracion": {
    title: "Case & Cooling Guide",
    summary: "Form factor, airflow, and air vs liquid (AIO) cooling: how to choose without overcomplicating it.",
  },
};

/** Etiquetas de las guías y de los filtros (las claves son las españolas de guides.json y GuiasView). */
export const ETIQUETAS_EN: Record<string, string> = {
  FUNDAMENTALES: "ESSENTIALS",
  TODAS: "ALL",
  "BÁSICOS": "BASICS",
  "GUÍA": "GUIDE",
  CONSEJOS: "TIPS",
  FUENTE: "PSU",
  GABINETE: "CASE",
  "LÍQUIDA": "LIQUID",
};

export const ARTICULOS_EN: Record<string, ArticuloGuia> = {
  glosario: {
    keyPoints: [
      "CPU: The brain that runs the game's logic and physics.",
      "GPU: The muscle that draws the 3D graphics on screen.",
      "RAM: The ultra-fast workbench where the game loads the data it needs right now.",
      "Motherboard: The backbone that connects all the other parts.",
      "Power supply (PSU): The heart that pumps clean power at stable voltages.",
    ],
    sections: [
      {
        title: "1. Central Processing Unit (CPU)",
        body: "It's the main processor. It calculates bullet trajectories, the AI of non-player characters and syncs the commands you give with your keyboard and mouse. For gaming, per-core speed and cache size (like AMD's 3D V-Cache) matter much more than having 24 office-grade cores.",
      },
      {
        title: "2. Graphics Card (GPU)",
        body: "It's responsible for about 70% of your frames per second (FPS). It has thousands of tiny cores designed to calculate geometry, shadows, reflections and lighting in real time, and its own dedicated memory called VRAM.",
      },
      {
        title: "3. Random Access Memory (RAM)",
        body: "It's high-speed temporary memory. When you open a game, maps and textures are loaded from the drive into RAM so the CPU and GPU can reach them in nanoseconds. In 2026, 32 GB in Dual Channel (2x16GB) is the clear standard.",
      },
      {
        title: "4. Motherboard",
        body: "The main circuit board. The processor, memory, graphics card and SSDs plug into it. It decides which processors you can install (based on the socket) and how many USB ports and M.2 slots you'll have.",
      },
    ],
  },
  compatibilidad: {
    keyPoints: [
      "The CPU's physical socket must match the motherboard's socket.",
      "DDR5 memory doesn't fit DDR4 slots, and vice versa.",
      "The GPU's length must not exceed the free space inside the case.",
      "The power supply should have at least 150W of headroom over the combined GPU + CPU draw.",
    ],
    sections: [
      {
        title: "Rule 1: Processor Socket",
        body: "If you buy an AMD Ryzen 9000 you need a motherboard with an AM5 socket. If you buy an Intel Core Ultra 200 series you need a motherboard with an LGA1851 socket. There are no adapters: the pins must match exactly.",
      },
      {
        title: "Rule 2: RAM Generation and Form Factor",
        body: "DDR5 and DDR4 have their safety notch in different places to prevent electrical accidents. Check your motherboard's spec sheet before buying.",
      },
      {
        title: "Rule 3: Case and Cooler Clearance",
        body: "Modern triple-fan graphics cards are longer than 300 mm. Make sure your case supports that length, especially if you mount a liquid cooling radiator at the front.",
      },
    ],
  },
  "elegir-gpu": {
    keyPoints: [
      "Start with your resolution: 1080p (8GB VRAM), 1440p (12-16GB VRAM), 4K (16-32GB VRAM).",
      "Don't buy a $1,000 GPU if you have a 60Hz office monitor.",
      "Check whether your power supply has the new 12V-2x6 cables to avoid stiff adapters.",
    ],
    sections: [
      {
        title: "Resolution Drives Your Choice",
        body: "For high refresh rate 1080p gaming, an RTX 5060 or RX 9060 XT gives the best performance per dollar. If you play at 1440p (the 2026 sweet spot), an RTX 5070 or RX 9070 XT with at least 12-16GB of VRAM gets you ultra textures without stutter.",
      },
      {
        title: "NVIDIA or AMD?",
        body: "NVIDIA leads in power efficiency, ray tracing and upscaling with DLSS Frame Generation. AMD usually offers more VRAM and excellent traditional rasterization performance at a more aggressive price.",
      },
    ],
  },
  "errores-comunes": {
    keyPoints: [
      "Saving money on the power supply and buying uncertified generic brands.",
      "Plugging the HDMI or DisplayPort cable into the motherboard instead of the GPU.",
      "Forgetting to remove the clear protective plastic from the CPU cooler's base.",
      "Installing RAM in single channel without enabling the XMP/EXPO profile.",
    ],
    sections: [
      {
        title: "The Wrong Video Port",
        body: "It's the number one rookie mistake: plugging the monitor into the motherboard's port instead of straight into the dedicated graphics card. This makes the PC use slow integrated graphics instead of your expensive GPU.",
      },
      {
        title: "The 'Invisible' Cooler Plastic",
        body: "Many new coolers come with a protective plastic sheet over the thermal paste or copper base. If you don't remove it, the processor will reach 100°C in seconds and shut down to protect itself.",
      },
    ],
  },
  "cuanta-ram": {
    keyPoints: [
      "16 GB: The acceptable minimum for very tight budgets.",
      "32 GB (2x16GB): The ideal standard in 2026, so you never have to worry.",
      "64 GB: Only worth it for 4K/8K editing, 3D rendering and heavy simulators.",
    ],
    sections: [
      {
        title: "Why 32 GB Is the New King",
        body: "Modern games like Cyberpunk, Starfield or Hogwarts Legacy easily use 14 GB of memory on their own. With 16 GB, any Chrome tab, Discord or music in the background forces the operating system to use the drive as swap memory, causing FPS drops.",
      },
    ],
  },
  "fuente-de-poder": {
    keyPoints: [
      "80 Plus certification measures power efficiency, not component quality.",
      "Always look for OVP, UVP, OCP, SCP and OTP protections.",
      "Choose power supplies that meet the ATX 3.1 standard to handle transient spikes.",
    ],
    sections: [
      {
        title: "What 80+ Gold Means",
        body: "It means at least 90% of the energy the power supply draws from the wall is delivered as usable power to your components, with less than 10% lost as heat.",
      },
    ],
  },
  "elegir-cpu": {
    keyPoints: [
      "Processors with 3D V-Cache memory (like the Ryzen 9850X3D) are the kings of gaming.",
      "You don't need 24 cores to play; 6 to 8 modern cores perform at 100%.",
      "Check whether the processor comes with a stock cooler or needs a separate one.",
    ],
    sections: [
      {
        title: "The Core-Count Trap",
        body: "A modern high-frequency 8-core processor easily beats an older 16-core one in games. Games prefer low memory latency and fast instructions per cycle (IPC).",
      },
    ],
  },
  almacenamiento: {
    keyPoints: [
      "NVMe M.2 PCIe 4.0 is the best balance of price and speed.",
      "SATA SSDs are useful for storing secondary games or files.",
      "A fast SSD speeds up level loading and removes texture pop-in.",
    ],
    sections: [
      {
        title: "SATA vs NVMe Gen4",
        body: "A SATA SSD transfers at about 550 MB/s, while an M.2 NVMe Gen4 drive reaches 7,000 MB/s. Although the difference in game load times is around 2 to 4 seconds, DirectStorage support makes NVMe essential.",
      },
    ],
  },
  "liquidos-pecera": {
    keyPoints: [
      "Use distilled water with an additive or a premixed PC coolant; never tap water or car antifreeze.",
      "Clear coolant (colorless or tinted) needs the least maintenance and is the safest place to start.",
      "Pastel (opaque) and shimmer coolants look amazing in a fishbowl, but they get dirtier and need frequent cleaning.",
      "Don't mix coolant brands or types, and don't mix aluminum and copper in the same loop.",
      "Before turning on the PC, run the filled loop for 24 hours with only the pump to check for leaks.",
    ],
    sections: [
      {
        title: "AIO or custom loop: where coolant comes in",
        body: "An AIO (closed-loop liquid cooler) comes sealed from the factory: you don't refill it or choose its coolant, and it's what the configurator uses. A custom loop is built part by part (CPU or GPU block, radiator, pump, reservoir and tubing) and you pick and change the coolant. In a fishbowl case, with glass on two sides, the coolant is always on show, so its color is part of the design.",
      },
      {
        title: "1. Distilled water with an additive",
        body: "The cheapest option and the one that cools best. The water must be distilled or deionized, never tap or mineral water: their salts leave deposits and cause corrosion. You add a PC additive or concentrate (a biocide against algae and bacteria plus a corrosion inhibitor) at the dose the maker recommends. It's completely clear, so the color comes from the tubing and lighting.",
      },
      {
        title: "2. Clear premixes (colorless or tinted)",
        body: "Ready to pour, with biocide and inhibitor included, in colorless or tinted versions (red, blue, green, purple...). For example: Corsair Hydro X XL8, EK-CryoFuel Clear or Mayhems XT-1. They're the best choice for a first fishbowl build: they leave almost no residue and the tint adds color without the problems of opaque coolants. Under strong UV or LED light, some tints fade over the months.",
      },
      {
        title: "3. Pastel or opaque (solid colors)",
        body: "They carry suspended particles that give a solid, matte color, like Mayhems Pastel or EK-CryoFuel Solid. Pastel white is the favorite for white fishbowl builds. The trade-off: the particles can settle if the PC sits off for a long time and they clog the fine channels in the blocks, so check the loop every few months and flush the parts well when you change it. They cool slightly less than clear coolants.",
      },
      {
        title: "4. Shimmer, pearl or UV-reactive",
        body: "They carry micro-particles that swirl and shine as they flow (like Mayhems Aurora) or glow under UV light. They're the most eye-catching for photos and video, and also the most delicate: they settle, stain tubing and blocks, and need a full clean often. Only choose them if you accept that upkeep; for a daily-use PC, a tinted clear coolant is better.",
      },
      {
        title: "What you should never use",
        body: "Tap water, mineral water, drinks or water with food coloring; car antifreeze or engine coolant, which corrodes and attacks seals and tubing; and mixes of coolants from different brands or types, which can react and turn into gel or sediment. Don't mix metals either: with an aluminum radiator and copper blocks, galvanic corrosion eats away at them. In PCs the norm is copper, brass and nickel throughout the loop.",
      },
      {
        title: "Tubing: hard or soft",
        body: "Hard tubing (PETG or acrylic) is what showpiece fishbowl builds use: clean straight lines, but it has to be bent with heat and cut precisely. Soft tubing is easier and more forgiving; choose good quality, because cheap tubing leaches plasticizer that clouds the coolant. With pastel coolants, clear hard tubing shows off the color best.",
      },
      {
        title: "Filling, leak testing and maintenance",
        body: "Fill the loop from the reservoir with the power supply disconnected from the motherboard and graphics card; a 24-pin jumper turns the PSU on to power only the pump. Run the pump for 24 hours with paper towels under every fitting: if they stay dry, you can connect the rest. Tilt the case gently to bleed out air bubbles. As a rough guide, clear coolant is changed about once a year and pastel or shimmer every few months; always follow the coolant maker's advice and change it sooner if it looks cloudy, has sediment or stains.",
      },
    ],
  },
  "gabinete-refrigeracion": {
    keyPoints: [
      "The front should be perforated mesh so fresh air can get in.",
      "Positive pressure (more fans pulling air in than pushing it out) reduces dust buildup.",
      "A large air cooler is more reliable in the long run than a cheap liquid cooler.",
    ],
    sections: [
      {
        title: "Mesh Front vs Sealed Glass",
        body: "Avoid cases with a glass front and no generous side vents. They may look modern with their lights, but they choke the graphics card and raise its temperature by 15°C to 20°C.",
      },
    ],
  },
};
