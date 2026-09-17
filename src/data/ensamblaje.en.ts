// Versión inglesa de los 10 pasos de GuiaEnsamblajeStepByStep.tsx (17-09-2026). El español (ASSEMBLY_STEPS)
// sigue siendo la fuente: aquí van los MISMOS pasos (mismo id) y las mismas subinstrucciones en el mismo
// orden, sólo con el texto; imágenes, iconos y nivel de riesgo se toman del español. Si se añade o cambia
// una instrucción allí, hay que reflejarla aquí (si faltan, el paso se enseña en español).
import type { AssemblyStep, SubInstruction } from "@/components/GuiaEnsamblajeStepByStep";
import type { Lang } from "@/i18n/rutas";

type TextosPaso = {
  fase: string;
  titulo: string;
  descripcion: string;
  instrucciones: { texto: string; tituloVisual?: string; pieDeFoto?: string }[];
  alertaNovato?: string;
  herramientas: string[];
};

const FASE_1 = "Phase 1: On the Table (Outside the Case)";
const FASE_2 = "Phase 2: In the Case (Structure & Power)";
const FASE_5 = "Phase 5: Advanced - AIO & Fish-Tanks";

const EN: Record<number, TextosPaso> = {
  1: {
    fase: FASE_1,
    titulo: "Preparing the workspace and the motherboard",
    descripcion:
      "Never build directly inside a cramped case. 80% of the parts are installed comfortably on the workbench, on top of the motherboard's own cardboard box.",
    instrucciones: [
      {
        texto: "Clear a large, flat, well-lit table. Discharge static by touching a large unpainted metal object.",
        tituloVisual: "Step 1.1: Discharging Static Electricity (ESD)",
        pieDeFoto:
          "Touch an unpainted metal surface (like the case chassis or a radiator) to drain static charge before handling delicate electronics.",
      },
      {
        texto: "Take the motherboard out of its packaging and place it directly on its cardboard box.",
        tituloVisual: "Step 1.2: A Safe Base on the Cardboard Box",
        pieDeFoto:
          "The motherboard box is a rigid, non-conductive surface, ideal for resting the board while you install the CPU, RAM and SSD comfortably.",
      },
      {
        texto:
          "WATCH OUT FOR THE BAG!: Never rest the board on the outside of the anti-static bag: the outer surface conducts static electricity and can cause shorts when testing components.",
        tituloVisual: "Step 1.3: Anti-Static Bag Warning",
        pieDeFoto:
          "Danger!: The outside of metallic anti-static bags drains static by conduction. Resting the board's circuits on top of it can cause short circuits.",
      },
    ],
    alertaNovato:
      "Keep all screws and boxes; the serial numbers on the boxes are essential for warranty claims with the manufacturers.",
    herramientas: ["Clear table", "Motherboard cardboard box"],
  },
  2: {
    fase: FASE_1,
    titulo: "Installing the Processor (CPU)",
    descripcion:
      "The most precise step of the whole build. Modern sockets (AM5 on AMD and LGA1700/1851 on Intel) have more than 1,700 microscopic gold pins on the motherboard that bend at the slightest touch.",
    instrucciones: [
      {
        texto: "Press and push the socket's metal retention lever outward, then lift it all the way up.",
        tituloVisual: "Step 2.1: Releasing and Opening the Socket Lever",
        pieDeFoto:
          "Push the metal lever slightly outward to free it from the retention hook and lift it all the way to open the socket frame.",
      },
      {
        texto: "Hold the processor only by its side edges with two fingers; never touch the gold contacts underneath.",
        tituloVisual: "Step 2.2: Holding It Safely by the PCB Edges",
        pieDeFoto:
          "Hold the chip only by the sides with your thumb and index finger. Skin oil or direct contact can damage the microscopic pins or gold contact pads.",
      },
      {
        texto: "Find the gold triangle on one corner of the processor and match it exactly with the triangle marked on the corner of the socket.",
        tituloVisual: "Step 2.3: Lining Up the Guide Triangles",
        pieDeFoto:
          "There is only one correct orientation: the gold triangle printed on the processor must match the arrow or triangle marked on one corner of the motherboard socket.",
      },
      {
        texto: "Lower the processor gently into the socket: it should drop in under its own weight without any downward force.",
        tituloVisual: "Step 2.4: Seating It Flat with Zero Pressure",
        pieDeFoto:
          "The processor should settle under its own weight. If it sits tilted or doesn't drop in right away, don't press: take it out and check the orientation.",
      },
      {
        texto:
          "Lower the metal lever until it locks. You'll feel normal firm resistance while the black plastic cover pops off on its own (keep it).",
        tituloVisual: "Step 2.5: Closing the Lever and Popping Off the Cover",
        pieDeFoto:
          "As you lower the lever you'll feel firm mechanical tension. The black plastic cover pops off by itself; keep it in the motherboard box to protect the pins.",
      },
    ],
    alertaNovato: "ZERO PRESSURE!: If the processor doesn't sit flat right away, don't force it. Take it out and check the triangle's orientation.",
    herramientas: ["None (done by hand only)"],
  },
  3: {
    fase: FASE_1,
    titulo: "Installing the NVMe M.2 SSD",
    descripcion:
      "High-speed storage mounts directly on the motherboard, using the PCIe lanes wired straight to the processor.",
    instrucciones: [
      {
        texto: "Unscrew the metal heatsink from the main M.2 slot (M2_1, the one closest to the processor socket).",
        tituloVisual: "Step 3.1: Removing the M.2 Metal Heatsink",
        pieDeFoto:
          "Use a magnetic precision screwdriver to remove the screws from the metal shield over the main M.2 slot, which connects directly to the CPU.",
      },
      {
        texto: "GOLDEN RULE!: Peel the clear or blue protective film off the thermal pad stuck to the metal heatsink.",
        tituloVisual: "Step 3.2: Removing the Plastic from the Thermal Pad",
        pieDeFoto:
          "Rookie alert!: Peel off the plastic sheet covering the silicone thermal pad. If you leave it on, it acts as an insulator and the SSD will overheat.",
      },
      {
        texto: "Insert the M.2 SSD into the slot at a 30-degree angle until the gold contacts are no longer visible.",
        tituloVisual: "Step 3.3: Inserting the SSD at a 30° Angle",
        pieDeFoto:
          "Push the SSD in at a diagonal angle until it seats firmly in the M.2 Key M slot. Don't try to slide it in flat, or you could break the connector.",
      },
      {
        texto: "Lower the back end of the SSD flat onto the post and secure it with the M2 screw, or turn the tool-free EZ-Latch / Q-Latch plastic clip.",
        tituloVisual: "Step 3.4: Securing the SSD (M2 Screw / EZ-Latch)",
        pieDeFoto:
          "Gently press the end of the SSD against the standoff and tighten the tiny M2 screw with a magnetic precision screwdriver, without stripping the thread.",
      },
      {
        texto: "Put the metal heatsink back on and screw it down firmly without overtightening.",
        tituloVisual: "Step 3.5: Mounting and Securing the M.2 Heatsink",
        pieDeFoto:
          "Line up the metal heatsink over the installed SSD and screw it down to ensure even thermal contact and maximum heat dissipation.",
      },
    ],
    alertaNovato:
      "If you leave the plastic on the thermal pad, the SSD will run above 85°C, throttling and losing a lot of speed.",
    herramientas: ["Phillips #1 / precision screwdriver"],
  },
  4: {
    fase: FASE_1,
    titulo: "Installing the RAM (Dual Channel)",
    descripcion: "Using the right slots doubles your processor's effective memory bandwidth.",
    instrucciones: [
      {
        texto:
          "Open the hinged latches on RAM slots 2 and 4 (counting left to right from the CPU socket, labeled A2 and B2).",
        tituloVisual: "Step 4.1: Opening the Latches on Slots 2 and 4 (A2 and B2)",
        pieDeFoto:
          "Push the retention latches on slots A2 and B2 outward to enable Dual Channel bandwidth. Slots 1 and 3 stay untouched.",
      },
      {
        texto: "Look at the off-center notch on the RAM's gold edge and match it with the ridge in the motherboard slot.",
        tituloVisual: "Step 4.2: Checking the Off-Center Guide Notch",
        pieDeFoto:
          "The notch on a DDR5 module isn't in the middle. Check visually that it lines up with the ridge in the slot before pushing, so you don't damage the pins.",
      },
      {
        texto:
          "Rest the module in place and press firmly and evenly on both ends until you hear a clear 'click' and see the latches close on their own.",
        tituloVisual: "Step 4.3: Pressing It In and Locking the Latches",
        pieDeFoto:
          "Line up the guide notch and push straight down on both ends of the module until the latches lock the memory in place automatically.",
      },
      {
        texto: "Repeat the same steps in the second recommended slot to complete the Dual Channel setup.",
        tituloVisual: "Step 4.4: Second Module Installed and Dual Channel Confirmed",
        pieDeFoto:
          "Both modules are firmly locked into A2 and B2 with the latches closed. This gives you double the bandwidth and maximum stability in games.",
      },
    ],
    alertaNovato:
      "Don't use side-by-side slots (1 and 2)! Installing in 2 and 4 is essential to enable Dual Channel and avoid losing up to 20% in minimum frame rates.",
    herramientas: ["Bare hands"],
  },
  5: {
    fase: FASE_1,
    titulo: "Mounting the CPU Cooler and Thermal Paste",
    descripcion: "The vital part that keeps the processor from shutting down from overheating within seconds.",
    instrucciones: [
      {
        texto: "Install the cooler's mounting bars or standoff screws following the instructions for your socket (AM5 or Intel).",
        tituloVisual: "Step 5.1: Installing the Cooler Brackets and Standoffs",
        pieDeFoto:
          "Screw in the threaded standoffs and metal mounting bars at the four corners around the CPU socket, following the standard for your processor.",
      },
      {
        texto: "VITAL WARNING!: Check the cooler's copper base and remove the clear plastic sticker that says 'PEEL OFF BEFORE USE'.",
        tituloVisual: "Step 5.2: Removing the Protective Plastic from the Copper Base",
        pieDeFoto:
          "Critical danger!: If you forget to peel off this clear protective film, the processor will reach 100°C in seconds and shut down to protect itself.",
      },
      {
        texto: "Apply a pea-sized amount of thermal paste (or a thin 1 mm cross) to the exact center of the processor's IHS.",
        tituloVisual: "Step 5.3: Applying Thermal Paste (Pea Method)",
        pieDeFoto:
          "Put a 4 to 5 mm dot of thermal paste in the center of the processor. The cooler's pressure will spread it evenly without spilling over.",
      },
      {
        texto:
          "Place the cooler tower lined up over the screws and tighten the mounting screws in a cross pattern (half a turn each) so the pressure is perfectly even.",
        tituloVisual: "Step 5.4: Tightening in an Alternating Cross Pattern",
        pieDeFoto:
          "Tighten each screw half a turn diagonally (X pattern) to spread the pressure evenly over the IHS and avoid uneven pressure on the chip.",
      },
      {
        texto: "Plug the fan cable into the header labeled 'CPU_FAN' on the motherboard; no other header will do.",
        tituloVisual: "Step 5.5: Connecting the PWM Cable to the CPU_FAN Header",
        pieDeFoto:
          "Line up the plastic guide and insert the 4-pin connector into the 'CPU_FAN' header. If you plug it into CHA_FAN or SYS_FAN, the board will show a boot error.",
      },
    ],
    alertaNovato:
      "If you plug the fan into the 'CHA_FAN' or 'SYS_FAN' header, the motherboard will show a 'CPU Fan Error' at startup and won't adjust fan speed to the processor's heat.",
    herramientas: ["Phillips #2 screwdriver", "Quality thermal paste"],
  },
  6: {
    fase: FASE_2,
    titulo: "Preparing the Case and Power Supply",
    descripcion: "Installing the electrical heart in the isolated bottom compartment (PSU shroud).",
    instrucciones: [
      {
        texto: "Remove both side panels of the case (tempered glass and the rear metal panel). Put them somewhere safe.",
        tituloVisual: "Step 6.1: Removing the Case Side Panels",
        pieDeFoto:
          "Loosen the rear thumbscrews and remove the tempered glass panel, resting it on a padded surface so it doesn't break.",
      },
      {
        texto:
          "If your power supply is modular, first plug the cables you'll need into it: the 24-pin ATX, two 8-pin EPS for the CPU and the PCIe or 12V-2x6 cable for the graphics card.",
        tituloVisual: "Step 6.2: Pre-Connecting Cables on a Modular PSU",
        pieDeFoto:
          "Firmly connect the main 24-pin cable, the two 8-pin EPS CPU connectors and the PCIe or 12V-2x6 cable to the PSU before sliding it into the tunnel.",
      },
      {
        texto: "Slide the power supply into the bottom tunnel with its fan facing down (toward the dust-filtered vent on the case floor).",
        tituloVisual: "Step 6.3: Sliding the PSU into the Bottom Tunnel",
        pieDeFoto:
          "Point the PSU fan downward so it pulls in fresh outside air through the dust filter on the chassis floor.",
      },
      {
        texto: "Secure the power supply from the back with the 4 thick hex screws included.",
        tituloVisual: "Step 6.4: Securing the Back with 4 Hex Screws",
        pieDeFoto:
          "Drive the 4 coarse-thread (6-32) hex screws into the four rear corners of the PSU bracket with a Phillips #2 screwdriver.",
      },
      {
        texto:
          "Check the gold standoffs on the motherboard tray: they must line up exactly with the holes on your ATX or Micro-ATX board.",
        tituloVisual: "Step 6.5: Checking the Standoffs",
        pieDeFoto:
          "Check the 9-standoff pattern for ATX. Rookie alert!: Remove any extra standoff that doesn't match a hole in the board to avoid a fatal short circuit.",
      },
    ],
    alertaNovato:
      "Never leave a brass standoff screwed in where the board has no hole; it would touch the copper traces on the back of the board and cause a fatal short circuit.",
    herramientas: ["Phillips #2 screwdriver"],
  },
  7: {
    fase: FASE_2,
    titulo: "Installing the Motherboard in the Case",
    descripcion: "Moving the main combo (board + CPU + RAM + SSD + cooler) into the chassis.",
    instrucciones: [
      {
        texto:
          "If your motherboard doesn't have a built-in rear I/O shield, place it in the rectangle at the back of the case and press until it snaps firmly in place.",
        tituloVisual: "Step 7.1: Installing the I/O Shield",
        pieDeFoto:
          "Push the rear metal plate (I/O shield) from inside the case outward until every edge snaps firmly into place.",
      },
      {
        texto:
          "Hold the board by the CPU cooler's metal tower and its edges, and lower it in at an angle toward the back until the rear ports line up with the I/O shield.",
        tituloVisual: "Step 7.2: Inserting the Board at an Angle",
        pieDeFoto:
          "Hold the motherboard firmly by its edges and the cooler, and lower it in at an angle so the ports fit into the rear I/O shield without hitting the standoffs.",
      },
      {
        texto: "Line up the center hole of the board with the case's central guide post.",
        tituloVisual: "Step 7.3: Lining Up with the Center Post",
        pieDeFoto:
          "Match the motherboard's center hole exactly with the case's center standoff. This automatically lines up all the other holes.",
      },
      {
        texto:
          "Drive in the board screws (usually 8 or 9 on ATX boards) with a magnetic screwdriver, snug but not overtightened, so you don't crack the fiberglass layers.",
        tituloVisual: "Step 7.4: Final Motherboard Mounting",
        pieDeFoto:
          "Use a magnetic screwdriver to place the 8 or 9 mounting screws. Tighten until you feel light resistance; too much force can damage the PCB's inner circuits.",
      },
    ],
    alertaNovato:
      "Don't drag the motherboard roughly across the metal standoffs, or you could scratch the printed circuit traces on the back.",
    herramientas: ["Magnetic Phillips #2 screwdriver"],
  },
  8: {
    fase: FASE_2,
    titulo: "Connecting Front Panel and Power Cables",
    descripcion: "Routing the internal cables that bring the buttons to life and deliver clean power.",
    instrucciones: [
      {
        texto: "Plug the 24-pin ATX cable into the right side of the board until the plastic latch clicks firmly into place.",
        tituloVisual: "Step 8.1: Main ATX Cable (24-pin)",
        pieDeFoto:
          "Line up the connector's safety clip and press it straight down. This thick bundle of wires delivers the main power to the motherboard.",
      },
      {
        texto: "Plug the 8-pin (4+4) EPS cables into the top left corner of the board to power the processor.",
        tituloVisual: "Step 8.2: EPS Power for the Processor (CPU)",
        pieDeFoto:
          "Route the EPS cables along the top back of the case. They deliver clean, dedicated power to the processor socket. It's normal for it to come split into a 4+4-pin connector.",
      },
      {
        texto:
          "Find the case's front panel cables: 'POWER SW' (power), 'RESET SW', 'POWER LED', and plug them into the F_PANEL header following the diagram printed on the board.",
        tituloVisual: "Step 8.3: Front Panel Headers (F_PANEL)",
        pieDeFoto:
          "Connect the delicate pins for the case's power button and lights. The positive (+) pin usually goes on the left. Follow the diagram printed below the pins.",
      },
      {
        texto: "Plug in the blue/black USB 3.0 connector (19-pin) very carefully so you don't bend any pins.",
        tituloVisual: "Step 8.4: Connecting Front USB 3.0",
        pieDeFoto:
          "Line up the plastic guide perfectly. Don't push sideways: if a pin bends, the case's high-speed front USB ports will stop working.",
      },
      {
        texto: "Plug the HD_AUDIO front audio connector into the bottom left corner.",
        tituloVisual: "Step 8.5: Front Audio (HD_AUDIO)",
        pieDeFoto:
          "Look for the header labeled AAFP or HD_AUDIO, almost always at the bottom left edge. It has a blocked (empty) pin that guides you so you don't plug it in backwards.",
      },
    ],
    alertaNovato:
      "The 19-pin USB 3.0 connector has a guide slot: don't force it in backwards, because its pins are extremely fragile.",
    herramientas: ["Phillips #2 screwdriver", "Velcro / plastic cable ties"],
  },
  9: {
    fase: "Phase 3: The Graphics Muscle",
    titulo: "Installing the Graphics Card (GPU)",
    descripcion: "The biggest and most expensive component of the PC, installed in the fastest PCIe slot.",
    instrucciones: [
      {
        texto:
          "Remove the metal PCIe slot covers at the back of the case that line up with the top PCIe x16 slot (usually the 2nd and 3rd covers).",
        tituloVisual: "Step 9.1: Removing the PCIe Covers",
        pieDeFoto:
          "Make sure you remove the right covers so the graphics card's video outputs (HDMI, DisplayPort) can be reached from outside the case.",
      },
      {
        texto: "Open the hinged plastic latch on the motherboard's top PCIe x16 slot.",
        tituloVisual: "Step 9.2: Preparing the PCIe Slot",
        pieDeFoto: "The latch should be pushed down or to the side, just like on the RAM slots.",
      },
      {
        texto: "Line up the graphics card and push it straight down with even pressure until you hear the latch 'click' shut.",
        tituloVisual: "Step 9.3: Inserting the Graphics Card",
        pieDeFoto:
          "The card should go down straight and level. Never insert it at an angle. The 'click' means it's fully seated and the lock has closed on its own.",
      },
      {
        texto: "Screw the GPU's metal bracket to the chassis with two screws to support its weight.",
        tituloVisual: "Step 9.4: Securing It to the Chassis",
        pieDeFoto:
          "Use the same screws from the covers you removed. This is vital so the card doesn't pull on the slot with its own weight.",
      },
      {
        texto:
          "Connect the dedicated power cable (native 12V-2x6 connector or separate 8-pin PCIe cables; avoid using a single 'daisy-chained' cable).",
        tituloVisual: "Step 9.5: Powering the Graphics Card",
        pieDeFoto:
          "The 12V-2x6 / 12VHPWR connector (NVIDIA RTX 40 and 50 series) must go in all the way, with no sharp bend within 3.5 cm of the connector. With traditional 8-pin cables, run a separate cable from the PSU to each connector on the card.",
      },
      {
        texto:
          "If your graphics card is longer than 28 cm or weighs more than 1 kg, install the included anti-sag bracket so it doesn't bend the slot.",
        tituloVisual: "Step 9.6: Anti-Sag Bracket",
        pieDeFoto:
          "These supports rest on the case floor or screw in under the card itself. They extend the life of your motherboard and the GPU.",
      },
    ],
    alertaNovato:
      "Make sure the 12V-2x6 / 12VHPWR connector goes in all the way with no visible gap; half-seated cables can overheat.",
    herramientas: ["Phillips #2 screwdriver"],
  },
  10: {
    fase: "Phase 4: First Boot & Setup",
    titulo: "The Moment of Truth and BIOS Setup",
    descripcion: "The first power-on test, entering the BIOS to enable the memory profile, and getting the system running.",
    instrucciones: [
      {
        texto:
          "MISTAKE NUMBER ONE!: Plug your monitor's HDMI or DisplayPort cable into the GRAPHICS CARD port, NEVER into the motherboard.",
        tituloVisual: "Step 10.1: Connecting the Monitor",
        pieDeFoto:
          "If you plug the monitor into the motherboard with a graphics card installed, you'll get no picture or you'll be using very weak integrated graphics.",
      },
      {
        texto: "Plug the power cable into the PSU and flip the switch on the back of the PSU to the on position 'I'.",
        tituloVisual: "Step 10.2: Main Power",
        pieDeFoto: "'I' means On, 'O' means Off. When you switch it on, some motherboards light up a small standby LED.",
      },
      {
        texto:
          "Press the case power button. The fans will spin and the LEDs will light up. (On AM5 platforms the first boot can take up to 60-90 seconds for memory training.)",
        tituloVisual: "Step 10.3: The Power Button",
        pieDeFoto:
          "Don't panic if the PC restarts a couple of times on its own the first time. It's normal while the board calibrates the memory.",
      },
      {
        texto: "Repeatedly press the 'DEL' (Delete) or 'F2' key on your keyboard during startup to enter the BIOS.",
        tituloVisual: "Step 10.4: Entering the BIOS",
        pieDeFoto:
          "Your motherboard brand's splash screen shows which key to press. Tap it repeatedly as soon as you turn on the PC.",
      },
      {
        texto:
          "In the BIOS, find and enable the 'XMP' (Intel) or 'EXPO' (AMD) high-speed profile so your RAM runs at its rated speed (e.g. 6000 MHz instead of 4800 MHz).",
        tituloVisual: "Step 10.5: Enabling XMP/EXPO",
        pieDeFoto:
          "This is usually easy to spot on the 'Easy Mode' or basic screen of any modern BIOS. Without it, you're losing 10-15% of performance.",
      },
      {
        texto: "Save changes with F10 and restart to do a clean install of Windows from a USB flash drive.",
        tituloVisual: "Step 10.6: Save and Restart",
        pieDeFoto:
          "Make sure your USB drive with the Windows installer is plugged in before restarting, so the BIOS detects it and boots from it automatically.",
      },
    ],
    alertaNovato:
      "If the screen stays black on first boot, look at the motherboard's diagnostic LEDs (Boot, VGA, DRAM, CPU): they'll tell you exactly which part needs attention.",
    herramientas: ["Monitor + USB keyboard", "USB flash drive with Windows"],
  },
  11: {
    fase: FASE_5,
    titulo: "Installing Liquid Cooling (AIO)",
    descripcion: "Golden rules for mounting All-in-One systems and preventing the pump from sucking air or failing prematurely.",
    instrucciones: [
      {
        texto: "Mount the pump block on the CPU (applying cross-pattern pressure, just like an air cooler).",
        tituloVisual: "Step 11.1: The Pump Block",
        pieDeFoto: "Pressure must be even across the processor to maximize thermal contact."
      },
      {
        texto: "Ideal radiator position: Mount it at the top (roof) of the case, exhausting hot air upwards.",
        tituloVisual: "Step 11.2: Top-Mounted Radiator (Recommended)",
        pieDeFoto: "This is the safest position because it ensures any air bubbles stay in the radiator and never reach the pump."
      },
      {
        texto: "If you mount it on the front or side, the tubes should ideally point down, OR the highest point of the radiator must ALWAYS be above the pump.",
        tituloVisual: "Step 11.3: Front/Side Radiator",
        pieDeFoto: "If the pump is the highest point in the loop, it will trap air bubbles, causing noise and killing the internal motor from running dry."
      },
      {
        texto: "Connect the pump cable to the motherboard header labeled 'AIO_PUMP' or 'W_PUMP', and the radiator fans to 'CPU_FAN'.",
        tituloVisual: "Step 11.4: Pump and Fan Cables",
        pieDeFoto: "The AIO_PUMP header always delivers 100% power so the water flow never stops. CPU_FAN regulates the fan speed according to heat."
      }
    ],
    alertaNovato:
      "NEVER mount the pump on the CPU so that it physically sits higher than all parts of the radiator. Air rises, and if it accumulates in the pump, it will burn it out.",
    herramientas: ["Phillips #2 screwdriver"],
  },
  12: {
    fase: FASE_5,
    titulo: "Panoramic Case (Fish-Tank) Setup",
    descripcion: "Mastering airflow and cable management in dual-chamber cases with lots of glass.",
    instrucciones: [
      {
        texto: "Airflow for 'fish-tanks': Mount fans at the bottom and on the side bringing in fresh air (intake).",
        tituloVisual: "Step 12.1: Intake Fans",
        pieDeFoto: "Without a mesh front, cold air must come in from below, pushing hot air upwards for the GPU and CPU."
      },
      {
        texto: "Mount exhaust fans at the rear and top (or the AIO radiator at the top).",
        tituloVisual: "Step 12.2: Exhaust Fans",
        pieDeFoto: "This creates positive air pressure that flows through all components and extracts heat efficiently."
      },
      {
        texto: "Take advantage of the rear dual chamber: Hide the power supply, excess cables, and ARGB hubs there.",
        tituloVisual: "Step 12.3: Rear Chamber & Cable Management",
        pieDeFoto: "Use velcro straps to group cables by destination (power, fans, RGB) to leave the main compartment looking spotless."
      },
      {
        texto: "Handling Tempered Glass: Remove ALL glass panels before building and place them on a soft surface.",
        tituloVisual: "Step 12.4: Tempered Glass Warning",
        pieDeFoto: "Tempered glass can shatter if its corner or edge touches ceramic or tile. Don't reinstall the glass until the PC has successfully booted."
      }
    ],
    alertaNovato:
      "If you install all fans as exhaust just to see their lights, the PC will suffocate. Make sure you have an equal number of intake and exhaust fans. (Reverse-blade fans are highly recommended).",
    herramientas: ["Velcro / plastic cable ties", "Phillips #2 screwdriver"],
  },
  13: {
    fase: FASE_5,
    titulo: "Custom Liquid Cooling (Custom Loop)",
    descripcion: "The pinnacle of modding: design your own cooling loop for CPU and GPU with custom tubing and coolant.",
    instrucciones: [
      {
        texto: "Installing Components: Mount the Water Blocks on the CPU and GPU. Secure the pump/reservoir combo firmly in the chassis.",
        tituloVisual: "Step 13.1: Blocks and Pump",
        pieDeFoto: "Make sure to remove the factory GPU cooler with extreme care. Use thermal pads on the GPU's memory and VRMs."
      },
      {
        texto: "Tubing and Fittings: Measure, cut, and bend the tubes (PETG/Acrylic requires a heat gun) and secure them with compression fittings.",
        tituloVisual: "Step 13.2: Hard or Soft Tubing",
        pieDeFoto: "Soft tubes are easier for beginners. Hard tubes offer a professional aesthetic but require precise measuring and bending."
      },
      {
        texto: "Filling the Loop (Fill): Use a squeeze bottle to slowly fill the reservoir with the coolant liquid (never use tap water).",
        tituloVisual: "Step 13.3: Filling the Reservoir",
        pieDeFoto: "Use paper towels around all fittings. If a drop spills, nothing will happen because the motherboard is NOT powered yet."
      },
      {
        texto: "Bleeding the Loop (Bleed): Bridge the 24-pin cable (ATX Jumper) so the PSU only powers the pump, without turning on the rest of the PC.",
        tituloVisual: "Step 13.4: Jumping and Bleeding",
        pieDeFoto: "Turn the pump on and off iteratively so the water travels through the loop and pushes air out. NEVER let the pump run dry without liquid!"
      }
    ],
    alertaNovato:
      "A leak in a Custom Loop with the PC powered on will destroy components. Always perform a 24-hour leak test with ONLY the pump powered on, leaving the motherboard, GPU, and CPU completely disconnected from power.",
    herramientas: ["Custom Loop Kit", "Heat Gun (Hard Tubing)", "Squeeze Bottle", "ATX 24-pin Jumper", "Paper towels"],
  }
};

/** Paso de montaje en el idioma de la página (si la traducción no cuadra con el español, queda en español). */
export function pasoEnIdioma(paso: AssemblyStep, lang: Lang): AssemblyStep {
  if (lang !== "en") return paso;
  const t = EN[paso.id];
  if (!t || t.instrucciones.length !== paso.instrucciones.length) return paso;
  return {
    ...paso,
    fase: t.fase,
    titulo: t.titulo,
    descripcion: t.descripcion,
    alertaNovato: t.alertaNovato ?? paso.alertaNovato,
    herramientas: t.herramientas,
    instrucciones: paso.instrucciones.map((orig, i): string | SubInstruction =>
      typeof orig === "string" ? t.instrucciones[i].texto : { ...orig, ...t.instrucciones[i] }
    ),
  };
}
