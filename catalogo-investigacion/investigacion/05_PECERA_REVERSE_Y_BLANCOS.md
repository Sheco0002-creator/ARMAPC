# Estilo pecera: ventiladores reverse y versiones blancas (investigación 16-09-2026)

Pedido del usuario (16-09-2026): builds estilo "pecera" (fishbowl), muy populares en EE.UU. Investigar
**ventiladores reverse** y **versiones blancas**. Aprobó también las dos ideas de refrigeración líquida:
**AIO (circuito cerrado) en el configurador** y **circuito abierto (custom loop) como guía educativa**.
Esto es sólo investigación: **no se ha tocado la web ni el catálogo**.

- **Fuente:** PCPartPicker (EE.UU.), leída con el navegador. Cada producto se comprobó en su propia
  página: tiendas, precio y stock. `curl` directo recibe el bloqueo antibots ("Just a moment…", 429).
- **Datos en bruto** (JORGE, verificados por SHA-256):
  `catalogo-investigacion-ARCHIVO/PECERA_pcpartpicker_2026-09-16/`
  - `PECERA_ventiladores-reverse_pcpartpicker_2026-09-16.json`: 45 fichas.
  - `PECERA_versiones-blancas_pcpartpicker_2026-09-16.json`: 63 fichas.
- **Precio de referencia:** el menor precio con stock en una tienda americana (Amazon, Newegg, B&H,
  Best Buy o la tienda del fabricante).
  - **MemoryC** infla los precios (hasta +60 %). Sólo se usa si no hay otra tienda, y se marca.
  - **"Newegg Sellers"** es el marketplace de Newegg.
- **Fotos:** PCPartPicker da la miniatura `…/<hash>.256p.jpg`; quitando `.256p` sale la grande
  (comprobado: 200 OK, ~150 KB). La URL de cada una está en los JSON. Sigue haciendo falta revisarlas
  a ojo con el estándar de siempre (≥ 900 px, sin sellos).

## 1. Qué es un ventilador reverse y por qué lo pide una pecera

- **Qué es:** un ventilador reverse tiene las aspas y el marco invertidos. Empuja el aire en el mismo
  sentido que uno normal, pero enseña la cara "bonita" (aspas, RGB, logo) hacia el lado por donde entra
  el aire.
- **Dónde va en una pecera** (O11 Dynamic, HYTE Y60/Y70, NZXT H6/H9, Phanteks NV…): el aire entra por
  **abajo** y por el **lateral**. Con ventiladores normales ahí se vería la parte fea (cruceta y
  pegatina) a través del cristal. Con reverse se ve el RGB.
- **Arriba** (salida de aire) se usan ventiladores normales.
- **Reparto típico:** 3 abajo + 3 al lateral (reverse) y 3 arriba (normales o radiador del AIO). Es
  decir, **1 o 2 packs de 3 reverse** por build.
- **PCPartPicker:** lo indica en la ficha como `Flow Direction: Reverse`. Los 45 del JSON lo tienen
  confirmado.

**Ecosistemas de control (clave para la compatibilidad):**

| Tipo | Ejemplos | Qué necesita |
|---|---|---|
| Estándar | Corsair RS120-R, Phanteks D30/M25 G2, Thermalright, ARCTIC, Thermaltake CT | 4 pines PWM + 3 pines 5V ARGB: van a la placa (hacen falta cabezales o un splitter) |
| Lian Li FLEX | UNI FAN CL/SL/SL-INF/TL FLEX | Mismo cableado estándar, en cadena; control opcional por USB (L-Connect) |
| Lian Li Wireless | UNI FAN SL/SL-INF/TL Wireless y TL LCD Wireless | Controlador inalámbrico 2,4 GHz incluido en el pack |
| Corsair iCUE LINK | LX120-R, LX140-R | **iCUE LINK System Hub** (no viene en el 3-pack) |
| ASUS ROG Eurux | GR120 ARGB Reverse | Controlador USB propio |

## 2. Ventiladores reverse: selección por gama (packs de 3, 120 mm salvo que se indique)

| Gama | Modelo | Negro (MPN · US$) | Blanco (MPN · US$) | Notas |
|---|---|---|---|---|
| Entrada | **Corsair RS120-R ARGB** | CO-9050196-WW · **34.99** (Amazon; Best Buy, B&H, Corsair) | CO-9050197-WW · **34.99** (Amazon; Best Buy, Corsair) | La mejor relación precio/stock: 4 tiendas y los dos colores |
| Entrada | Phanteks M25G2-120 D-RGB Reverse | PH-F120M25R_G2_DBK01_3P · **38.98** (Newegg) | — | 39 dB a tope: el más ruidoso de la lista |
| Entrada | Thermalright TL-S12RW X3 | — | TL-S12RW X3 · **14.90** (Amazon) | Barato; 47,6 CFM, sólo Amazon |
| Entrada | Thermalright TL-M12QRW-S X3 | — (TL-M12QR X3, sin precio) | TL-M12QRW-S X3 · **25.99** (Amazon) | |
| Media | Lian Li UNI FAN CL FLEX | 12RCL1F3B · **54.99** (Amazon, Newegg Sellers) | — | |
| Media | Lian Li UNI FAN SL FLEX | — | 12RSL1F3W · **69.98** (Amazon) | |
| Media | **Phanteks D30-120 Reversed D-RGB** | PH-F120D30R_DRGB_PWM_BK01_3P · **79.99** (Newegg) | PH-F120D30R_DRGB_PWM_WT01_3P · **79.99** (Newegg) | Grosor 30 mm: comprobar holgura bajo la placa y el radiador |
| Media (140 mm) | Thermaltake CT140 EX Reverse ARGB | — | CL-F195-PL14SW-A · **59.99** (Newegg Sellers; B&H 69.99) | Para cajas con huecos de 140 mm |
| Alta | Corsair iCUE LINK LX120-R RGB | CO-9051050-WW · **84.99** (Amazon, B&H) | CO-9051054-WW · agotado (Best Buy 139.99) | Hace falta el System Hub aparte |
| Alta | **Lian Li UNI FAN TL FLEX** | 12RTL1F3B · **99.99** (Amazon, Newegg Sellers) | 12RTL1F3W · **99.99** (Amazon, Newegg Sellers) | 83,4 CFM, el que más mueve |
| Alta | **Lian Li UNI FAN SL-INF FLEX** | 12RSLIN1F3B · **104.99** | 12RSLIN1F3W · **104.99** | Espejo infinito |
| Alta | Lian Li UNI FAN SL-INF Wireless | 12RSLIN1W3B · **104.99** (Amazon) | 12RSLIN1W3W · sin tienda | Inalámbrico: menos cables a la vista |
| Extrema | ASUS ROG Eurux GR120 ARGB Reverse | 90DA00K0-B08020 · **119.99** (Amazon) | — | Controlador propio de ASUS |
| Extrema | **Lian Li UNI FAN TL LCD FLEX** | 12RTLLCD1F3B · **134.99** (Amazon) | — | Pantalla LCD en cada ventilador |
| Extrema | Lian Li UNI FAN TL LCD Wireless | 12RTLLCD1W3B · 217.10 (**sólo MemoryC**) | 12RTLLCD1W3W · 224.78 (**sólo MemoryC**) | Precio inflado: revisar Amazon/Newegg antes de usar |

**Descartados o pendientes:**
- **Sin tienda o agotados:** Lian Li SL-Infinity reverse 3-pack (12RSLIN3B/W), TL 120 Reverse Blade
  (12RTL3B), TL LCD 120 Reverse Blade (12RTLLCD3B), TL Wireless reverse (12RTL1W3B), CL Wireless
  (12RCL1W3B), Thermalright TL-M12QR(-S) X3 negro, ASUS TUF TR120 Reverse y ARCTIC P14 Pro Reverse
  A-RGB negro.
- **Precio sospechoso:**
  - ARCTIC P14 Pro Reverse A-RGB blanco 3-pack a US$ 25.19 en Amazon: seguramente precio de 1
    ventilador o error del listado.
  - ARCTIC P12 Pro Reverse A-RGB 3-pack (negro 74.74 / blanco 76.34): sólo en MemoryC. El ventilador
    suelto cuesta 25.94.
- **Sin RGB (no pegan con la pecera, pero sirven):** ARCTIC P12 Pro Reverse 3-pack negro 12.79
  (Amazon) y P14 Pro Reverse 3-pack 64.27 (MemoryC).
- **DeepCool FL12R (reverse):** fuera. La marca está sancionada en EE.UU., igual que en el catálogo.

## 3. Versiones blancas (selección verificada)

**Hallazgos importantes:**
- **El catálogo no tiene campo de color.** Hoy sólo una pieza es blanca: la ASRock X870 Steel Legend
  WiFi, que ya usa una build de Media.
- **La Phanteks NV7 y la HYTE Y70:** en el catálogo están como "no disponible en EE.UU.", pero **sus
  versiones blancas sí se venden allí**. NV7 White: 169.99 en Newegg. HYTE Y70 White: 219.99 en Amazon
  y Newegg.
- **El blanco no siempre es más caro:**
  - RX 9070 XT Gigabyte Gaming OC ICE: 749.99, frente a 799 la negra del catálogo.
  - NZXT H6 Flow: 77.99 blanca frente a 80.
  - O11D EVO RGB: 154.99 blanca frente a 168.
  - FRAME 5000D RS ARGB: 104.90 blanca frente a 170.
- **Gráficas que no hay en blanco con stock:** RTX 5070 (Gigabyte ICE y MSI Ventus 2X agotadas) y
  RTX 5070 Ti (MSI Gaming Trio OC White agotada).

### Tarjetas gráficas blancas

| Chip | Modelo | MPN | US$ (tienda) | Negra en catálogo |
|---|---|---|---|---|
| RTX 5060 8 GB | ASUS DUAL OC White | DUAL-RTX5060-O8G-WHITE | 479.99 (B&H) | 470 |
| RX 9060 XT 16 GB | XFX Mercury OC White | RX-96TMERCW9 | 529.99 (Best Buy) · 320 mm | — |
| RX 9060 XT 16 GB | ASUS DUAL White | DUAL-RX9060XT-16G-WHITE | 539.99 (Amazon, B&H) · 202 mm | — |
| RX 9060 XT 16 GB | XFX Swift OC White | RX-96TS316W7 | 559.99 (Best Buy) | — |
| RTX 5070 12 GB | Gigabyte Eagle OC SFF ICE | GV-N5070EAGLEOC-ICE-12GD | **agotada** (809.99 B&H / 849.99 Newegg) | 840–937 |
| RX 9070 16 GB | XFX Swift OC White | RX-97SWFB3W9 | 769.99 (Amazon) · 325 mm, 4 slots | 650–700 |
| RX 9070 XT 16 GB | **Gigabyte Gaming OC ICE** | GV-R907XGAMINGOCICE-16GD | **749.99** (Amazon) | 799 (misma, negra) |
| RX 9070 XT 16 GB | XFX Swift White | RX-97TSWF3W9 | 829.99 (Amazon) | 820 |
| RX 9070 XT 16 GB | ASUS Prime OC White | PRIME-RX9070XT-O16G-WHITE | 849.99 (Newegg) | — |
| RTX 5070 Ti 16 GB | MSI Gaming Trio OC White | G507T-16GTCW | **agotada** (1249.99 MSI) | 1180 |
| RTX 5080 16 GB | MSI Ventus 3X OC White | G5080-16V3CW | 1679.99 (Newegg) | 1600 (misma, negra) |

### Gabinetes blancos (peceras y afines)

| Modelo | MPN | US$ (tienda) | GPU máx. | Negro en catálogo |
|---|---|---|---|---|
| NZXT H6 Flow White | CC-H61FW-01 | 77.99 (Newegg; Amazon, B&H, Best Buy) | 365 mm | 80 |
| Corsair 3500X RS-R ARGB White | CC-9011323-WW | 79.98 (Amazon) | 410 mm | 79 (3500X) |
| Lian Li Vector V100R White | V100RW | 79.98 (Amazon) | 415 mm | — |
| Montech XR White | XR-W | 80.36 (Amazon) | 420 mm | — |
| Lian Li O11 Dynamic Mini V2 White | O11DMIV2W | 83.99 (Newegg) | 400 mm | — |
| Corsair FRAME 5000D RS ARGB White | CC-9011310-WW | 104.90 (Newegg) | 450 mm | 170 |
| Lian Li O11 Vision Compact White | O11VPW | 124.99 (Amazon) | 408 mm | — |
| Lian Li O11D EVO RGB White | O11DERGBW | 154.99 (Newegg) | 455 mm | 168 |
| Phanteks NV7 White | PH-NV723TG_DMW01 | 169.99 (Newegg) | 450 mm | naranja (sin precio US) |
| be quiet! Light Base 900 DX White | BGW70 | 169.90 (Newegg Sellers) / 179.90 (Amazon, B&H) | 495 mm | 250 (900 FX) |
| HYTE Y70 White | CS-HYTE-Y70-WW | 219.99 (Amazon, Newegg) | 390 mm | naranja (Touch Infinite) |
| NZXT H9 Flow RGB+ (2025) White | CM-H92FW-P1 | 229.99 (Amazon, Best Buy, Newegg) | 459 mm | 250 |
| HYTE Y60 Snow White | CS-HYTE-Y60-WW | 234.33 (Amazon) | 375 mm | — |
| Lian Li O11 Dynamic EVO XL White | O11DEXL-W | 259.00 (Amazon) | 460 mm | 270 (sin stock) |

### Refrigeración líquida AIO blanca (360 mm)

| Modelo | MPN | US$ (tienda) | Negra en catálogo |
|---|---|---|---|
| Thermalright Frozen Infinity 360 ARGB White | Frozen Infinity 360 WHITE | 52.59 (Amazon) | — |
| Cooler Master MasterLiquid 360L Core ARGB White | MLW-D36M-A18PZ-RW | 59.99 (Amazon; Abt/B&H 99.99) | — |
| ARCTIC Liquid Freezer III Pro A-RGB 360 White | ACFRE00188A | 80.19 (Amazon) | 70 (Pro 360) |
| Corsair NAUTILUS 360 RS ARGB White | CW-9060095-WW | 129.99 (Amazon, B&H) | 110 |
| Lian Li HydroShift LCD 360S White | HSLCD36SW | 142.77 (Amazon) | — |
| NZXT Kraken Plus 360 RGB White | RL-KR360-W2 | 149.99 (Amazon) | 130 |
| Corsair iCUE LINK TITAN 360 RX RGB White | CW-9061021-WW | 159.99 (Best Buy; resto 199.99) | 200 |
| NZXT Kraken Elite 360 RGB White | RL-KR36E-W2 | 299.99 (4 tiendas) | 280 |
| Lian Li HydroShift II OLED Curved 360TL White | GHS2OLDC36TW | 339.99 (Amazon, Newegg) | 340 |
| ASUS ROG Ryujin III 360 ARGB Extreme White | 90RC0132-M0AAY0 | 359.99 (B&H, Newegg) | 360 |
| Lian Li Galahad II Trinity SL-INF White | GA2T36INW | 255.97, **"Available soon"** (sin stock) | — |

### Placas base blancas

| Socket | Modelo | MPN | US$ (tienda) |
|---|---|---|---|
| AM5 · mATX | ASRock B850M Pro RS WiFi White | 90-MXBT30-A0UAYAZ | 139.99 (Amazon) |
| AM5 · mATX | Gigabyte B850M Eagle WiFi6E ICE | B850M EAGLE WIFI6E ICE | 159.99 (Amazon, Newegg) |
| AM5 · ATX | **ASRock X870 Steel Legend WiFi** (ya en catálogo) | 90-MXBPJ0-A0UAYZ | 169.99 (Amazon, Newegg) |
| AM5 · ATX | Gigabyte B850 Eagle WiFi7 ICE | B850 EAGLE WIFI7 ICE | 181.98 (Newegg) |
| AM5 · ATX | ASUS ROG Strix B850-A Gaming WiFi | 90MB1J50-M0AAY0 | 202.99 Amazon / **289.99** Best Buy y Newegg: confirmar vendedor |
| AM5 · ATX | Gigabyte X870 Aorus Elite WiFi7 ICE | X870 AORUS ELITE WIFI7 ICE | 236.63 (Amazon; 239.99 Best Buy, Newegg) |
| AM5 · ATX | ASUS ROG Strix X870-A Gaming WiFi | 90MB1IF0-M0AAY0 | 239.71 (Amazon; 292.99 Newegg) |
| LGA1851 · ATX | ASRock B860 Challenger WiFi White | 90-MXBUB0-A0UAYZ | 139.99 (Amazon; 159.99 Newegg) |
| LGA1851 · ATX | MSI PRO Z890-S WiFi White | PRO Z890-S WIFI WHITE | 169.99 (sólo tienda MSI) |
| LGA1851 · ATX | ASUS Z890 AYW Gaming WiFi W | 90MB1I60-M0AAY0 | 179.99 (Amazon) |

### Memoria RAM blanca (DDR5-6000, 2 módulos)

| Capacidad | Modelo | MPN | US$ (tienda) |
|---|---|---|---|
| 32 GB | Silicon Power XPOWER Zenith RGB CL30 | SP032GXLWU60AFDH | 479.99 (B&H) |
| 32 GB | Patriot Viper Elite 5 RGB CL30 | PVER532G60C30KW | 489.99 (Amazon, Newegg) |
| 32 GB | TeamGroup T-Force Delta RGB CL38 | FF4D532G6000HC38ADC01 | 499.99 (Amazon) |
| 32 GB | Crucial Pro Overclocking CL36 | CP2K16G60C36U5W | 505.00 (Amazon) |
| 32 GB | G.Skill Ripjaws M5 RGB CL36 | F5-6000J3636F16GX2-RM5RW | 515.99 (Newegg) |
| 32 GB | Corsair Vengeance RGB CL30 | CMH32GX5M2B6000Z30W | 639.00 (Amazon, Corsair, Newegg) |
| 64 GB | Kingston FURY Beast CL36 | KF560C36BWEK2-64 | 967.99 (Amazon) |
| 64 GB | TeamGroup T-Force Delta RGB CL38 | FF4D564G6000HC38ADC01 | 989.99 (Amazon) |

Referencia: la RAM negra del catálogo a 6000 MT/s y 32 GB va de 450 a 560, así que el blanco no
encarece mucho. Toda la RAM sigue cara en 2026.

### Fuentes de poder blancas (totalmente modulares)

| W | Modelo | MPN | US$ (tienda) | Largo |
|---|---|---|---|---|
| 850 | ASRock Steel Legend SL-850GW (Gold) | 90-UXS085-GFEABA | 84.99 (Amazon, Newegg) | 150 mm |
| 750 | Corsair RM750e (2025) | CP-9020292-NA | 89.99 (B&H, Corsair, Newegg) | 140 mm |
| 1000 | ASRock Steel Legend SL-1000GW (Gold) | 90-UXS100-GFEABA | 104.99 (Amazon, Newegg) | 150 mm |
| 850 | Corsair RM850e (2025) | CP-9020293-NA | 123.99 (Amazon, Best Buy) | 140 mm |
| 850 | NZXT C850 (2024) Gold | PA-8G2BW-US | 124.99 (Best Buy, Newegg) | 160 mm |
| 850 | MSI MAG A850GL PCIE5 White (Gold) | 306-7ZP8A24-CE0 | 133.99 (Amazon, Newegg) | 140 mm |
| 1000 | Lian Li EDGE Gold 1000 White | EG1000G White | 147.99 (Amazon) | **182 mm** |
| 1000 | Corsair RM1000e (2025) | CP-9020294-NA | 151.99 (Amazon, B&H, Newegg) | 140 mm |

**Duda sobre los Corsair RMe (2025):** PCPartPicker los marca "White", pero el RM750e del catálogo es
el CP-9020295-NA (negro). Hay que confirmar el color en corsair.com antes de darlos por blancos.

## 4. Siguiente paso propuesto (pendiente de decisión del usuario)

1. **Campo `color` en el catálogo:** `negro` / `blanco` / `mixto`, con filtro en el configurador y
   selector "Estilo: Estándar / Pecera / Pecera blanca" en presupuestos.
2. **Categoría nueva "Ventiladores"** (fuera de las 8 de hoy), con reglas de compatibilidad:
   - huecos de 120/140 mm del gabinete (abajo, lateral, arriba);
   - grosor 25/30 mm;
   - ecosistema de control: Corsair iCUE LINK pide hub y ASUS Eurux, su controlador.
3. **Datos nuevos en los gabinetes:** posiciones de radiador y ventilador, soporte de GPU vertical y
   largo de fuente en la cámara trasera.
4. **Refrigeración líquida** (aprobada):
   - **AIO en el configurador:** ya existe (19 modelos). Falta sumar las versiones blancas y validar
     el radiador por posición.
   - **Circuito abierto como guía educativa**, no como pieza: líquidos (premezclados o agua destilada
     con aditivo, nunca del grifo, no mezclar aluminio con cobre), piezas del circuito, prueba de fugas
     de 24 h y mantenimiento.
5. **Fotos:** descargar las grandes a JORGE y revisarlas a ojo con el estándar de siempre.
6. **Precios:** como todo el catálogo, caducan a los 15 días (la próxima revisión, antes del 01-10-2026).

## 5. Implementado (16-09-2026, "Impleméntalos")

Los puntos 1, 2 y 3 de §4 y la mitad AIO del punto 4 están en la web; detalle en ESTADO-DEL-PROYECTO.md,
sección "Estilo pecera". Diferencias con las tablas de arriba al dar de alta (datos en bruto de JORGE):
- **Phanteks D30-120 Reversed:** el JSON dice US$ 89,94 (Amazon) / 89,99 (Newegg), no 79,99: se usa el del JSON.
- **Phanteks NV7 White:** US$ 189,99 (Newegg) en el JSON.
- **ASUS ROG Strix B850-A:** se toma Best Buy/Newegg (US$ 289,99), no Amazon sin vendedor confirmado.
- **Thermaltake CT140 EX White:** B&H US$ 69,99 (se evita el marketplace de Newegg).
- **Fuera:** fuentes blancas, gabinetes sin hermano en el catálogo, RTX 5070/5070 Ti blancas, lo de sólo
  MemoryC, ARCTIC P12 Pro Reverse (US$ 12,79) y P14 Pro Reverse A-RGB (US$ 25,19): precios sospechosos.
- **Pendiente:** fotos ≥ 900 px de 44 altas. La guía de circuito abierto está en Guías desde el 17-09-2026 (`liquidos-pecera`, etiqueta LÍQUIDA, en inglés y español).
