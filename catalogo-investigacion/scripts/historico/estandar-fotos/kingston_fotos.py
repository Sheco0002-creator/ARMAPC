"""Fotos de las 4 Kingston FURY Beast con 1 foto (2026-09-13).

kingston.com da 403 por curl, pero su CDN media.kingston.com no. Los nombres de galería salieron del
navegador (ficha de producto): FURY_Beast_<Color>[_EXPO]_<DDR>_<n>[_angle|_pkg]-zm-lg.jpg (2048 px), con
<n> = módulos del kit (1, 2, 4). La ficha no enlaza part number -> galería, así que se asigna por la
nomenclatura del part number: BB = Beast Black, BBE = Beast Black EXPO, K2 = kit de 2. Se bajan la vista
del kit (_2) y la del módulo suelto (_1), y se revisa a ojo en hoja de contactos.
Descarga a JORGE; NO toca el catálogo.
python kingston_fotos.py
"""
import io, json, os, subprocess, sys, urllib.request
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
B = "https://media.kingston.com/kingston/product/"
CAT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json"
VISTAS = ["2", "2_angle", "2_pkg", "1", "1_angle"]
GALERIA = {81: "FURY_Beast_Black_EXPO_DDR5", 85: "FURY_Beast_Black_EXPO_DDR5",
           94: "FURY_Beast_Black_DDR5", 97: "FURY_Beast_Black_DDR4"}

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado: no se descarga nada.")
DEST = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "RAM_fotos-kingston_2026-09-13")
cat = json.load(open(CAT, encoding="utf-8"))

registro, miniaturas = {}, []
for idx, gal in GALERIA.items():
    p = cat[idx]
    carp = os.path.join(DEST, p["mpn"].replace("/", "_"))
    os.makedirs(carp, exist_ok=True)
    registro[idx] = {"mpn": p["mpn"], "modelo": p["modelo"], "fotos": []}
    for n, v in enumerate(VISTAS, 1):
        u = f"{B}{gal}_{v}-zm-lg.jpg"
        try:
            b = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40).read()
            im = Image.open(io.BytesIO(b)).convert("RGB")
            ruta = os.path.join(carp, f"{n:02d}.jpg")
            im.save(ruta, quality=92)
            registro[idx]["fotos"].append({"n": n, "origen": u, "w": im.size[0], "h": im.size[1], "archivo": ruta})
            miniaturas.append((f"{idx}.{n} {v}", im))
            print(f"  {idx}.{n} {v:8} {im.size[0]}x{im.size[1]}")
        except Exception as e:
            print(f"  {idx}.{n} {v:8} no existe ({e})")

json.dump(registro, open(os.path.join(DEST, "fotos_kingston.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
font = ImageFont.truetype("arial.ttf", 22)
COL, T = 5, 320
filas = (len(miniaturas) + COL - 1) // COL
hoja = Image.new("RGB", (COL * T, filas * (T + 34)), "white")
d = ImageDraw.Draw(hoja)
for k, (etq, im) in enumerate(miniaturas):
    im = im.copy(); im.thumbnail((T - 10, T - 10))
    x, y = (k % COL) * T, (k // COL) * (T + 34)
    hoja.paste(im, (x + (T - im.size[0]) // 2, y + 5))
    d.text((x + 8, y + T + 4), etq, fill="black", font=font)
salida = os.path.join(DEST, "HOJA_kingston.jpg")
hoja.save(salida, quality=85)
print(f"\n{len(miniaturas)} fotos | hoja: {salida}")
