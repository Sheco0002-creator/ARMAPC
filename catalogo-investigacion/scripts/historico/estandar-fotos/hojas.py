"""Hojas de contactos por categoría a partir de medidas2.json (sólo fotos reales).
Cada miniatura lleva: índice de producto . nº de foto  y lado en px (rojo si < 900)."""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hojas")
os.makedirs(OUT, exist_ok=True)
R = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "medidas2.json"), encoding="utf-8"))
T, COLS, LAB, MAXH = 170, 10, 170, 1400
try:
    FONT = ImageFont.truetype("arial.ttf", 14); FB = ImageFont.truetype("arialbd.ttf", 15)
except Exception:
    FONT = FB = ImageFont.load_default()

ABBR = {"Placas base": "placas", "Tarjetas gráficas": "gpus", "Módulos de memoria": "ram", "Procesadores": "cpus",
        "Fuentes de poder": "fuentes", "Almacenamiento": "almac", "Gabinetes": "gabinetes", "Refrigeración": "refrig"}

def miniatura(ruta):
    im = Image.open(os.path.join(BASE, ruta))
    im = im.convert("RGBA")
    bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[3])
    bg.thumbnail((T - 8, T - 22))
    return bg

indice = []
for c, ab in ABBR.items():
    prods = [r for r in R if r["cat"] == c]
    bloques = []  # (producto, filas)
    for p in prods:
        filas = max(1, -(-len(p["fotos"]) // COLS))
        bloques.append((p, filas))
    hoja_n, y, hoja, dr = 0, 0, None, None
    def nueva():
        global hoja_n
        return Image.new("RGB", (LAB + T * COLS, MAXH), "white")
    pendientes = []
    cur, curh = [], 0
    for p, f in bloques:
        h = f * T + 6
        if cur and curh + h > MAXH:
            pendientes.append(cur); cur, curh = [], 0
        cur.append((p, f)); curh += h
    if cur: pendientes.append(cur)
    for k, grupo in enumerate(pendientes, 1):
        alto = sum(f * T + 6 for _, f in grupo)
        hoja = Image.new("RGB", (LAB + T * COLS, alto), "white"); dr = ImageDraw.Draw(hoja)
        y = 0
        for p, f in grupo:
            dr.line((0, y, LAB + T * COLS, y), fill=(120, 120, 120), width=2)
            dr.text((4, y + 6), f"#{p['i']}", fill="black", font=FB)
            dr.text((4, y + 26), p["marca"][:18], fill="black", font=FONT)
            mod = p["modelo"]
            for j in range(0, min(len(mod), 72), 18):
                dr.text((4, y + 44 + j // 18 * 17), mod[j:j + 18], fill=(60, 60, 60), font=FONT)
            for n, fo in enumerate(p["fotos"]):
                cx, cy = LAB + (n % COLS) * T, y + 4 + (n // COLS) * T
                try:
                    th = miniatura(fo["ruta"])
                    hoja.paste(th, (cx + 4 + (T - 8 - th.width) // 2, cy + 20))
                except Exception as e:
                    dr.text((cx + 4, cy + 60), "ERROR", fill="red", font=FB)
                col = "red" if fo["lado"] < 900 or fo["medium"] else (0, 110, 0)
                dr.text((cx + 4, cy + 2), f"{p['i']}.{n + 1}  {fo['lado']}px{' MED' if fo['medium'] else ''}", fill=col, font=FONT)
            y += f * T + 6
        nombre = os.path.join(OUT, f"{ab}_{k:02}.jpg")
        hoja.save(nombre, quality=85)
        indice.append(nombre)
        print(nombre, hoja.size, f"prod {grupo[0][0]['i']}-{grupo[-1][0]['i']}")
