"""Recopila las 3 Intel Arc de SPARKLE (2026-09-12): fotos y hoja de specs.

La web de Sparkle pinta la ficha con JavaScript, así que las URLs se sacaron con el navegador
y aquí van fijas. Las fotos son PNG de 2000x2000 en /files/; el .jpg final de cada producto es un
banner largo (1920x7750) y se descarta por el estándar de fotos. Las specs vienen del PDF "Spec Sheet".

Intel Arc NO se vende en Perú (comprobado en Infotec): estas 3 van al catálogo marcadas como
importables bajo riesgo del comprador, sin precio.

Salida en JORGE: ARC_sparkle_2026-09-12/{fichas_sparkle.json, <MPN>/NN.png, specs/<MPN>.pdf}
python arc_sparkle.py [--escribir]
"""
import io, json, os, re, sys, time, urllib.request, subprocess
from PIL import Image
from pypdf import PdfReader

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")
MIN_LADO = 900

PRODUCTOS = [
    {"modelo": "Intel Arc B580 TITAN OC", "chip": "Arc B580", "gama": "entrada",
     "url": "https://www.sparkle.com.tw/en/B580-TITAN",
     "pdf": "https://www.sparkle.com.tw/files/20241203213858182.pdf",
     "fotos": [f"https://www.sparkle.com.tw/files/2024120322{s}.png" for s in
               ("0258912", "0302595", "0310875", "0314452", "0319148", "0322252", "0324232", "0327500")]},
    {"modelo": "Intel Arc B580 ROC Luna OC Ultra", "chip": "Arc B580", "gama": "entrada",
     "url": "https://www.sparkle.com.tw/en/B580-ROC-Luna",
     "pdf": "https://www.sparkle.com.tw/files/20250519101812700.pdf",
     "fotos": [f"https://www.sparkle.com.tw/files/2025051910{s}.png" for s in
               ("1858114", "1906425", "1958913", "2004865", "2011944", "2016351", "2019834", "2023293")]},
    {"modelo": "Intel Arc B570 GUARDIAN OC", "chip": "Arc B570", "gama": "entrada",
     "url": "https://www.sparkle.com.tw/en/B570-GUARDIAN",
     "pdf": "https://www.sparkle.com.tw/files/20241203220702169.pdf",
     "fotos": [f"https://www.sparkle.com.tw/files/2024120322{s}.png" for s in
               ("0710240", "0713244", "0715361", "0718218", "0721159", "0724954", "0725725")]},
]


def baja(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://www.sparkle.com.tw/"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


ES = {"Boost Clock": "Frecuencia turbo", "Xe-Core": "Núcleos Xe", "Ray Tracing Units": "Unidades de trazado de rayos",
      "Intel® XMX Engines": "Motores XMX", "GPU Peak Tops (Int8)": "Rendimiento IA (Int8)",
      "Memory Size": "Memoria", "Graphics Memory Interface": "Interfaz de memoria",
      "Graphics Memory Bandwidth": "Ancho de banda", "Max Res.": "Resolución máxima",
      "PCI Express Configurations": "Interfaz PCI Express", "TBP": "Consumo (TBP)",
      "Lighting": "Iluminación", "Dimension": "Medidas", "Weight": "Peso", "Width": "Ranuras que ocupa"}


def specs_del_pdf(b):
    """La hoja de specs son viñetas '⚫ clave: valor' agrupadas por secciones en mayúsculas."""
    txt = "\n".join((p.extract_text() or "") for p in PdfReader(io.BytesIO(b)).pages)
    mpn = (re.search(r"Part Number:\s*([A-Z0-9\-]+)", txt) or [None, None])[1]
    ean = (re.search(r"EAN:\s*(\d{8,14})", txt) or [None, None])[1]
    specs, seccion, requisitos = {}, "", []
    for linea in txt.splitlines():
        l = linea.strip()
        if re.fullmatch(r"[A-Z&.\s]{6,}", l):
            seccion = l
            continue
        if not l.startswith("⚫"):
            continue
        cuerpo = l.lstrip("⚫ ").strip()
        if seccion.startswith("REQUIREMENTS"):
            requisitos.append(cuerpo)
        elif ":" in cuerpo:
            k, v = cuerpo.split(":", 1)
            k, v = k.strip(), v.strip()
            if k.lower() != "ean" and v:
                specs[k] = v
    resumen = {ES[k]: v for k, v in specs.items() if k in ES}
    return {"resumen_es": resumen, "specs": specs, "requisitos": requisitos}, mpn, ean, txt


def letra_jorge():
    r = subprocess.run(["powershell", "-NoProfile", "-Command",
                        "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                       capture_output=True, text=True).stdout.strip()
    if not r:
        sys.exit("USB JORGE no conectado.")
    return r


fichas = []
destino = os.path.join(f"{letra_jorge()}:\\", "catalogo-investigacion-ARCHIVO", "ARC_sparkle_2026-09-12") if ESCRIBIR else None
for p in PRODUCTOS:
    print(f"\n=== SPARKLE {p['modelo']}")
    ficha, mpn, ean, txt = specs_del_pdf(baja(p["pdf"]))
    print(f"  MPN {mpn} | EAN {ean} | {len(ficha['specs'])} specs | {len(ficha['requisitos'])} requisitos")
    for k, v in ficha["resumen_es"].items():
        print(f"     {k}: {v[:52]}")
    fotos_ok = []
    for n, u in enumerate(p["fotos"], 1):
        try:
            b = baja(u)
            im = Image.open(io.BytesIO(b))
            ok = min(im.size) >= MIN_LADO and im.size[1] / im.size[0] < 3
            print(f"     foto {n}: {im.size[0]}x{im.size[1]} {'OK' if ok else 'DESCARTADA'}")
            if ok:
                fotos_ok.append((u, b, im.size))
        except Exception as e:
            print(f"     foto {n}: error {e}")
        time.sleep(1)
    fichas.append({"marca": "SPARKLE", "modelo": p["modelo"], "chip": p["chip"], "gama": p["gama"],
                   "mpn": mpn, "ean": ean, "url_oficial": p["url"],
                   "resumen_es": ficha["resumen_es"], "specs": ficha["specs"],
                   "requisitos": ficha["requisitos"], "n_fotos": len(fotos_ok),
                   "fotos": [u for u, _, _ in fotos_ok],
                   "disponibilidad_region": "importable",
                   "nota": "Intel Arc no se vende en Perú (comprobado en Infotec). Importable bajo riesgo del comprador."})
    if ESCRIBIR:
        carp = os.path.join(destino, (mpn or p["modelo"]).replace(" ", "_"))
        os.makedirs(carp, exist_ok=True)
        os.makedirs(os.path.join(destino, "specs"), exist_ok=True)
        for n, (u, b, _) in enumerate(fotos_ok, 1):
            open(os.path.join(carp, f"{n:02d}.png"), "wb").write(b)
        open(os.path.join(destino, "specs", f"{(mpn or p['modelo']).replace(' ', '_')}.pdf"), "wb").write(baja(p["pdf"]))

print(f"\n{len(fichas)} fichas | fotos válidas: {sum(f['n_fotos'] for f in fichas)}")
if ESCRIBIR:
    json.dump(fichas, open(os.path.join(destino, "fichas_sparkle.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("Escrito en", destino)
else:
    print("(simulación: no se ha descargado nada a JORGE; añade --escribir)")
