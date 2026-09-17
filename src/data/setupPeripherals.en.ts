// Versión inglesa de setupPeripherals.ts (15-09-2026). El archivo español sigue siendo la fuente:
// aquí van los MISMOS capítulos y gamas, sólo con el texto traducido (los modelos, precios e
// imágenes se toman del español). Si se añade o cambia un capítulo allí, hay que reflejarlo aquí.
import type { PeripheralChapter } from "@/data/setupPeripherals";
import type { TierType } from "@/store/useConfiguratorStore";
import type { Lang } from "@/i18n/rutas";

type TextosGama = {
  title: string;
  subtitle: string;
  targetModel: string;
  synergyNotice: string;
  didacticExplanation: string;
  keySpecs: { label: string; value: string }[];
};
type TextosCapitulo = {
  categoryLabel: string;
  name: string;
  recommendations: Record<TierType, TextosGama>;
};

const EN: Record<string, TextosCapitulo> = {
  monitor: {
    categoryLabel: "DISPLAY & REFRESH RATE",
    name: "High Refresh Rate Gaming Monitor",
    recommendations: {
      entrada: {
        title: '24" - 25" Fast IPS 1080p // 180Hz eSports',
        subtitle: "FHD Resolution and Maximum Competitive Smoothness",
        targetModel: "Fast IPS 1080p 180Hz 0.5ms (FreeSync / G-Sync Compatible)",
        synergyNotice:
          "Perfect match: the RTX 5060 or the 8 GB RX 9060 XT are built for 1080p, where competitive games make the most of a 180 Hz monitor. A 4K screen here would choke your GPU for nothing.",
        didacticExplanation:
          "For competitive titles (Valorant, CS2, Fortnite, Warzone), the pixel density of a 24-inch screen keeps every detail inside your central field of view without straining your eyes.",
        keySpecs: [
          { label: "Panel & Color", value: "Fast IPS / 99% sRGB" },
          { label: "Response Time", value: "0.5ms MPRT / 1ms GtG" },
          { label: "Refresh Rate", value: "180Hz native with VRR" },
        ],
      },
      media: {
        title: '27" Fast IPS 1440p // 180Hz - 240Hz sweet spot',
        subtitle: "Quad HD (2K) Resolution and Optimal Density",
        targetModel: '27" QHD 2560x1440 180Hz-240Hz Nano-IPS HDR400',
        synergyNotice:
          "Sweet spot match: the RTX 5070 or the RX 9070 are built to push 1440p. Staying at 1080p would leave you CPU-bound.",
        didacticExplanation:
          "2560x1440 on 27 inches gives you 77% more working space and sharpness than 1080p, letting you pick out distant silhouettes with maximum fidelity.",
        keySpecs: [
          { label: "Resolution", value: "2560 x 1440 (2K QHD)" },
          { label: "Panel Technology", value: "Nano IPS / 98% DCI-P3" },
          { label: "Sync", value: "NVIDIA G-Sync & AMD FreeSync Premium" },
        ],
      },
      alta: {
        title: '27" - 32" QD-OLED 1440p 360Hz / 4K 165Hz',
        subtitle: "Infinite Contrast & a Real 0.03ms Response",
        targetModel: "QD-OLED Gen 3 0.03ms GtG HDR True Black 400",
        synergyNotice:
          "eSports / enthusiast-grade match: the RTX 5070 Ti or the 16 GB RX 9070 XT push 1440p at high frame rates, and a 360 Hz OLED panel shows it with no ghosting or motion blur.",
        didacticExplanation:
          "The self-emissive pixels of an OLED panel switch off completely, giving pure blacks and motion clarity no conventional LCD can reach.",
        keySpecs: [
          { label: "Panel Type", value: "Quantum Dot OLED (QD-OLED)" },
          { label: "Real Latency", value: "0.03ms GtG, near-instant" },
          { label: "True HDR", value: "HDR True Black 400 / 1000 nits peak" },
        ],
      },
      extrema: {
        title: '32" 4K QD-OLED 240Hz or 49" Ultrawide 240Hz',
        subtitle: "The Industry's Visual Peak",
        targetModel: '32" 3840x2160 QD-OLED 240Hz Dual-Mode or 49" 5120x1440',
        synergyNotice:
          "Extreme match: the 16 GB RTX 5080 is the card for 4K gaming; with DLSS and frame generation it gets close to this panel's 240 Hz in many games.",
        didacticExplanation:
          "140 PPI at native 4K combined with a 240Hz refresh rate: still-image sharpness and competitive-monitor smoothness on the same screen.",
        keySpecs: [
          { label: "Resolution & Rate", value: "4K 3840x2160 at native 240Hz" },
          { label: "Inputs", value: "DisplayPort 2.1 UHBR20 + HDMI 2.1" },
          { label: "Color Gamut", value: "99.3% DCI-P3 / Delta E < 1 calibration" },
        ],
      },
    },
  },
  keyboard: {
    categoryLabel: "MECHANICAL INPUT",
    name: "High-Performance Mechanical / Magnetic Keyboard",
    recommendations: {
      entrada: {
        title: "75% Compact Mechanical // Hot-Swap Linear Switches",
        subtitle: "Efficient Form Factor That Leaves Room for the Mousepad",
        targetModel: "75% mechanical keyboard with pre-lubed linear Red switches",
        synergyNotice:
          "Practical match: the TKL layout keeps the arrows and function keys, and dropping the numpad frees desk space so you don't bump into your mouse.",
        didacticExplanation:
          "Linear mechanical switches give a smooth keypress with no tactile bump, reducing finger fatigue when you strafe or crouch over and over in a match.",
        keySpecs: [
          { label: "Layout", value: "75% compact or 80% TKL" },
          { label: "Switch Type", value: "45g linear mechanical, hot-swap" },
          { label: "Keycaps", value: "PBT double-shot, wear-resistant" },
        ],
      },
      media: {
        title: "Wireless Gasket-Mount Custom // Tri-Mode 2.4GHz",
        subtitle: "Five Layers of Acoustic Damping and Zero Latency",
        targetModel: "75% gasket-mount keyboard with Poron foam and polycarbonate plate",
        synergyNotice:
          "Technology match: a 2.4GHz dongle with a 1000Hz polling rate. As fast as a cable, but with a 100% clean desk.",
        didacticExplanation:
          "A gasket mount isolates the plate with elastic pads, absorbing harsh vibration and producing the deep, satisfying 'thock' sound.",
        keySpecs: [
          { label: "Internal Structure", value: "Gasket mount with Poron & IXPE" },
          { label: "Connectivity", value: "2.4GHz wireless / BT 5.2 / USB-C" },
          { label: "Battery", value: "4000mAh (up to 200h continuous)" },
        ],
      },
      alta: {
        title: "Hall Effect Magnetic Keyboard // Adjustable Rapid Trigger",
        subtitle: "Continuous Magnetic Actuation (0.1mm - 4.0mm)",
        targetModel: "Wooting / Apex Pro / HE magnetic switch keyboard, 8000Hz",
        synergyNotice:
          "Competitive match: in games like CS2 or Valorant it allows instant, perfect counter-strafing without depending on mechanical travel.",
        didacticExplanation:
          "It uses Hall effect sensors to measure the exact position of each magnet inside the switch. You can fire an ability at 0.2mm of travel and reset it the moment you let go.",
        keySpecs: [
          { label: "Sensors", value: "Magnetic Hall effect, no physical contact" },
          { label: "Rapid Trigger", value: "Sensitivity adjustable from 0.1 to 4.0mm" },
          { label: "Polling Rate", value: "8000Hz (0.125ms latency)" },
        ],
      },
      extrema: {
        title: "CNC 6063 Aluminum Custom // Hall Effect & Brass",
        subtitle: "Solid 2.2kg Chassis Machined From a Single Block",
        targetModel: "Custom anodized CNC aluminum Hall effect, premium edition",
        synergyNotice:
          "Luxury match: a rigid aluminum chassis and switches that actuate from 0.1 mm — competitive keyboard precision with a high-end finish.",
        didacticExplanation:
          "Every part of the chassis is CNC-cut from aerospace aluminum to within a fraction of a millimeter. Hand-lubed magnetic switches complete the package with absolute precision.",
        keySpecs: [
          { label: "Chassis Material", value: "CNC anodized 6063 aluminum + brass weight" },
          { label: "Mounting", value: "Isolated leaf-spring gasket mount" },
          { label: "PCB", value: "Magnetic hot-swap with open web firmware" },
        ],
      },
    },
  },
  mouse: {
    categoryLabel: "PRECISION & TRACKING",
    name: "Tournament-Grade Ultra-Light Gaming Mouse",
    recommendations: {
      entrada: {
        title: "Symmetrical Ultra-Light (<55g) // PixArt 3395 Sensor",
        subtitle: "26,000 DPI Optical Sensor and Zero Acceleration",
        targetModel: "53g wireless or paracord-cable optical mouse with optical switches",
        synergyNotice:
          "No-waste match: an accurate sensor with no acceleration and a 1 ms wireless link cover everything a beginner needs, without paying for tournament extras.",
        didacticExplanation:
          "Less weight means less inertia when you move your hand. Going from a 100g mouse to a 50g one instantly reduces strain on your wrist.",
        keySpecs: [
          { label: "Weight", value: "52g to 55g, featherweight" },
          { label: "Optical Sensor", value: "PixArt PAW3395 (26,000 DPI)" },
          { label: "Switches", value: "Huano Blue Pink Dot / optical, 80M clicks" },
        ],
      },
      media: {
        title: "Wireless 4KHz / 8KHz Polling // <50g Ergonomic",
        subtitle: "Four Times the Report Rate and 100% PTFE Skates",
        targetModel: "4000Hz wireless mouse, dongle included / Nordic 52840 MCU",
        synergyNotice:
          "QHD monitor match: a ~55 g mouse cuts inertia on fast flicks, and the low-latency wireless link feels exactly like a cable.",
        didacticExplanation:
          "The Nordic chip keeps battery use low while sending 4,000 position reports per second to your PC, cutting input latency to just 0.25 milliseconds.",
        keySpecs: [
          { label: "Polling Rate", value: "Native 4KHz / 8KHz wireless" },
          { label: "Speed and Acceleration", value: "650 IPS / 50G" },
          { label: "Feet / Skates", value: "100% virgin PTFE with rounded edges" },
        ],
      },
      alta: {
        title: "Carbon Fiber / Magnesium Alloy // <42g Ultra-Rigid",
        subtitle: "Perforated Exoskeleton With High Mechanical Strength",
        targetModel: "Magnesium alloy 8KHz wireless gaming mouse",
        synergyNotice:
          "Micro-aim match: a perfect partner for the 360Hz OLED panel. It allows instant micro-adjustments with your fingertips.",
        didacticExplanation:
          "Cast magnesium allows ultra-thin structural walls that don't flex or creak under a firm grip, keeping the weight under 42 grams with a rechargeable battery.",
        keySpecs: [
          { label: "Chassis Material", value: "Aerospace magnesium alloy" },
          { label: "Net Weight", value: "39g to 42g, real" },
          { label: "Polling Rate", value: "8000Hz (0.125ms delay)" },
        ],
      },
      extrema: {
        title: "Custom Magnesium + Sapphire Skates & Glass Pad",
        subtitle: "Glide With Practically Zero Friction",
        targetModel: "Limited magnesium 8K + tempered silent glass pad",
        synergyNotice:
          "The ultimate match: built to compete at the highest level. A tempered glass surface never wears out or changes speed with humidity.",
        didacticExplanation:
          "By replacing traditional PTFE skates with polished sapphire feet on a hardened glass pad, static friction disappears entirely.",
        keySpecs: [
          { label: "Skates", value: "Synthetic sapphire / polished ceramic" },
          { label: "Recommended Surface", value: "490x420 tempered glass mousepad" },
          { label: "Battery / Runtime", value: "USB-C fast charging / high-end Nordic MCU" },
        ],
      },
    },
  },
  audio: {
    categoryLabel: "SOUNDSCAPE & VOICE",
    name: "Spatial Audio System & Studio Microphone",
    recommendations: {
      entrada: {
        title: "50mm Stereo Headset // Detachable Cardioid Mic",
        subtitle: "Passive Isolation With Calibrated Neodymium Drivers",
        targetModel: "Closed 50mm headset with breathable memory foam earpads",
        synergyNotice:
          "Balanced match: it connects over USB or 3.5 mm and plays loud with no external amp; the mic comes off when you don't need it.",
        didacticExplanation:
          "A balanced EQ curve lets you hear footsteps and reloads without exaggerated explosion bass masking the details that give an enemy away.",
        keySpecs: [
          { label: "Driver Size", value: "50mm dynamic neodymium" },
          { label: "Impedance", value: "32 Ohm (plug & play 3.5mm)" },
          { label: "Microphone", value: "Cardioid pattern with pop filter" },
        ],
      },
      media: {
        title: "2.4GHz Wireless Headset // Dolby Atmos / DTS:X Spatial",
        subtitle: "Lag-Free Freedom of Movement & Graphene Drivers",
        targetModel: "2.4GHz wireless dongle + Bluetooth dual-stream headset",
        synergyNotice:
          "Immersion match: a mid-range GPU and CPU handle positional 3D audio in real time, delivering believable spatial sound.",
        didacticExplanation:
          "A 2.4GHz radio link makes sure gunfire lines up exactly with what's on your screen, without the usual Bluetooth delay.",
        keySpecs: [
          { label: "Audio Latency", value: "<15ms (2.4GHz link)" },
          { label: "Battery", value: "Up to 50 hours per charge" },
          { label: "Audio License", value: "Spatial Sound Dolby Atmos / DTS Headphone:X" },
        ],
      },
      alta: {
        title: "Open-Back Audiophile Headphones + Dedicated USB DAC/Amp",
        subtitle: "Three-Dimensional Soundstage With No Pressure Fatigue",
        targetModel: "Open-back dynamic / planar 250 Ohm + ESS Sabre Hi-Res DAC",
        synergyNotice:
          "Pure acoustic match: with an open design, air flows freely and sounds seem to come from the room around you instead of inside your head.",
        didacticExplanation:
          "The external DAC cleans up electromagnetic noise from the motherboard and GPU, while the dedicated amp supplies exactly the current needed for tight bass and crystal-clear highs.",
        keySpecs: [
          { label: "Acoustic Design", value: "Open-back Hi-Fi" },
          { label: "DAC / Amplifier", value: "ESS Sabre 32-bit / 384kHz PCM chip" },
          { label: "Harmonic Distortion", value: "THD < 0.0005%, ultra-clean" },
        ],
      },
      extrema: {
        title: "Balanced Hi-Fi Chain + XLR Broadcast Dynamic Mic",
        subtitle: "Planar Magnetic Headphones + Mic Arm With Interface",
        targetModel: "Planar magnetic audiophile + Shure/Rode XLR + GoXLR/Elgato interface",
        synergyNotice:
          "Recording studio match: ideal for content creators, professional streaming and anyone who won't put up with audio compression or background noise.",
        didacticExplanation:
          "Planar driver membranes are micrometers thick and move in a flat, symmetrical magnetic field, reaching a response speed that reproduces every texture of the sound.",
        keySpecs: [
          { label: "Drivers", value: "Double-sided neodymium planar magnetic" },
          { label: "Mic Capsule", value: "Dynamic XLR with off-axis rejection" },
          { label: "Processing", value: "Hardware DSP (compressor, gate, real-time EQ)" },
        ],
      },
    },
  },
  ergonomics: {
    categoryLabel: "POSTURE SUPPORT & WORKSPACE",
    name: "Ergonomic Station, Desk & Active Seating",
    recommendations: {
      entrada: {
        title: "VESA Gas Monitor Arm + XXL 900x400 Mousepad",
        subtitle: "Correct Neck Alignment and Full Desk Coverage",
        targetModel: "VESA 75/100 gas monitor arm + Cordura or microfiber mousepad",
        synergyNotice:
          "Physiological match: a mesh chair with lumbar support keeps your back in its natural curve during long sessions and doesn't trap heat like faux-leather 'gamer' chairs.",
        didacticExplanation:
          "A gas arm removes the monitor's bulky stand and frees up 40% of your desk, so keyboard and mouse sit where your arms naturally rest.",
        keySpecs: [
          { label: "Load Capacity", value: "Up to 9kg with VESA tension adjustment" },
          { label: "Pad Surface", value: "900 x 400 x 4mm, natural rubber base" },
          { label: "Pad Edges", value: "Reinforced anti-fray stitching" },
        ],
      },
      media: {
        title: "Breathable Mesh Ergonomic Chair // 3D Lumbar Support",
        subtitle: "Body Heat Dissipation and Multi-Point Adjustment",
        targetModel: "Full polymer mesh chair with synchro-tilt mechanism",
        synergyNotice:
          "Player match: faux-leather 'gamer' chairs trap heat and lack adjustable lumbar support; mesh keeps the air flowing.",
        didacticExplanation:
          "The synchro-tilt mechanism reclines the backrest while gently tilting the seat, keeping your spine in a neutral curve without pressing on your thighs.",
        keySpecs: [
          { label: "Upholstery", value: "Breathable German elastic mesh" },
          { label: "Lumbar Support", value: "Dynamic biomechanical height and depth adjustment" },
          { label: "Armrests", value: "3D adjustment (height, angle and depth)" },
        ],
      },
      alta: {
        title: "Dual-Motor Sit-Stand Desk // Solid Wood Top",
        subtitle: "Switch Between Sitting and Standing With Digital Memory",
        targetModel: "Three-stage steel frame with two motors and touch panel",
        synergyNotice:
          "Health & focus match: working or playing 20 minutes standing for every hour seated gets your blood flowing and sharpens your reflexes.",
        didacticExplanation:
          "Two independent leg motors raise the setup quietly (<45dB) even with 100kg of heavy towers and several screens on top.",
        keySpecs: [
          { label: "Height Range", value: "62cm to 128cm (fits any height)" },
          { label: "Load Capacity", value: "120kg stable with anti-collision system" },
          { label: "Controller", value: "4 memory presets + activity reminder" },
        ],
      },
      extrema: {
        title: "Herman Miller Embody / Gesture Station + Circadian Light Bar",
        subtitle: "Medical-Grade Pressure Distribution and Full Ergonomics",
        targetModel: "Herman Miller x Logitech G Embody / Steelcase Gesture + BenQ ScreenBar",
        synergyNotice:
          "Extreme rig match: if you spend more than 8 hours a day creating or competing, this treats your joints the way pro athletes treat theirs.",
        didacticExplanation:
          "The backrest's pixelated support matrix adapts automatically to the micro-movements of your spine, spreading your weight to avoid pressure points.",
        keySpecs: [
          { label: "Warranty & Lifespan", value: "12-year 24/7 medical-grade warranty" },
          { label: "Monitor Lighting", value: "Asymmetric light bar with no screen glare" },
          { label: "Cable Management", value: "Hidden magnetic channel, no cables in sight" },
        ],
      },
    },
  },
};

/** El capítulo con sus textos en el idioma de la página (el español es el original). */
export function capituloEnIdioma(chapter: PeripheralChapter, lang: Lang): PeripheralChapter {
  const en = EN[chapter.id];
  if (lang !== "en" || !en) return chapter;
  const gamas = Object.fromEntries(
    (Object.keys(chapter.recommendations) as TierType[]).map((tier) => [
      tier,
      { ...chapter.recommendations[tier], ...en.recommendations[tier] },
    ])
  ) as PeripheralChapter["recommendations"];
  return { ...chapter, categoryLabel: en.categoryLabel, name: en.name, recommendations: gamas };
}
