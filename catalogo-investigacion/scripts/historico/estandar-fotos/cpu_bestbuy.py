"""Fotos nuevas de CPU AMD desde la galería Zoom de Best Buy (2026-09-13).

17 de 21 CPUs tenían 1-2 fotos (amd.com sólo publica la caja). Las URLs se sacaron con el navegador:
búsqueda por nombre -> ficha -> `piscesHref` con `rel` Zoom, y SÓLO si el UPC de la ficha coincide con
nuestro EAN (el 9600X se descartó: su ficha era de un revendedor con otro UPC).

Este script descarga a JORGE, mide y arma una hoja de contactos numerada `cpu.foto` para revisar a ojo
con el estándar de fotos. NO toca el catálogo: la integración va aparte, tras la revisión.
python cpu_bestbuy.py
"""
import io, json, os, subprocess, sys, time, urllib.request
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
BASE_URL = "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/"
TAM = ";maxHeight=2000;maxWidth=2000"

# indice del catálogo -> (mpn, fotos Zoom verificadas por UPC)
FOTOS = {
    110: ("100-100000927BOX", ["b88ba52a-215c-4bbd-9e72-20eaa23809a7.jpg", "6deeef8a-ea94-4826-ac4c-b0c7f68a9075.jpg"]),
    111: ("100-100000065BOX", ["6438/6438943_sd.jpg", "6438/6438943cv1d.jpg", "6438/6438943cv11d.jpg", "6438/6438943cv12d.jpg"]),
    113: ("100-100000593WOF", ["6519/6519479cv11d.jpg", "6519/6519479cv12d.jpg", "6519/6519479_sd.jpg", "6519/6519479cv1d.jpg"]),
    115: ("100-100000591WOF", ["6519/6519477cv11d.jpg", "6519/6519477_sd.jpg", "6519/6519477cv1d.jpg", "6519/6519477cv12d.jpg"]),
    116: ("100-100001404WOF", ["db6178ce-dd3b-40e5-a3de-0f551f1ea180.jpg", "ab774d91-db4a-4a46-94c6-1469b2bf8e9f.jpg"]),
    117: ("100-100000910WOF", ["6537/6537139_sd.jpg", "6537/6537139cv11d.jpg", "6537/6537139cv12d.jpg", "6537/6537139cv13d.jpg"]),
    118: ("100-100001084WOF", ["43526f44-592b-47fe-bd57-c9be5a7c16e9.jpg", "013d0d58-d1ce-4ec3-9674-4966640c44b5.jpg",
                             "00787a59-5280-4823-840b-cb700841e91f.jpg", "095945fc-4dd9-4cbd-8288-ff902a9f5516.jpg"]),
    120: ("100-100000662WOF", ["f37b0687-5358-4366-92e3-7f629d7f7250.jpg", "fccd4599-a195-422c-96bc-d338fa5a56e1.jpg"]),
    121: ("100-100001277WOF", ["46458eb7-6eac-4c25-b61c-c7a38f597038.jpg", "1179f72a-912a-4e9f-ae8b-17f0e0712ba3.jpg"]),
    122: ("100-100000719WOF", ["bda50e8a-6009-42b8-9f21-9e44c1d0b8e0.jpg", "332e81a6-9cc2-46b0-8889-0492d356bd9f.jpg",
                             "0b333552-27a3-44d1-8180-92c649663e00.jpg"]),
}

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado: no se descarga nada.")
DEST = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "CPU_fotos-bestbuy_2026-09-13")
CAT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json"
cat = json.load(open(CAT, encoding="utf-8"))

registro, miniaturas = {}, []
for idx, (mpn, fotos) in FOTOS.items():
    carp = os.path.join(DEST, mpn)
    os.makedirs(carp, exist_ok=True)
    registro[idx] = {"mpn": mpn, "modelo": cat[idx]["modelo"], "fotos": []}
    for n, f in enumerate(fotos, 1):
        try:
            b = urllib.request.urlopen(urllib.request.Request(BASE_URL + f + TAM, headers={"User-Agent": UA}),
                                       timeout=40).read()
            im = Image.open(io.BytesIO(b))
            ruta = os.path.join(carp, f"{n:02d}.jpg")
            open(ruta, "wb").write(b)
            registro[idx]["fotos"].append({"n": n, "origen": f, "w": im.size[0], "h": im.size[1], "archivo": ruta})
            miniaturas.append((f"{idx}.{n}", im.convert("RGB"), min(im.size) >= 900))
            print(f"  {idx}.{n}  {im.size[0]}x{im.size[1]}  {cat[idx]['modelo']}")
        except Exception as e:
            print(f"  {idx}.{n}  ERROR {e}")
        time.sleep(0.8)

json.dump(registro, open(os.path.join(DEST, "fotos_cpu.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# hoja de contactos: 6 por fila, 260 px, número y tamaño debajo
COL, T = 6, 260
filas = (len(miniaturas) + COL - 1) // COL
hoja = Image.new("RGB", (COL * T, filas * (T + 28)), "white")
d = ImageDraw.Draw(hoja)
for k, (etq, im, ok) in enumerate(miniaturas):
    im.thumbnail((T - 10, T - 10))
    x, y = (k % COL) * T, (k // COL) * (T + 28)
    hoja.paste(im, (x + (T - im.size[0]) // 2, y + 5))
    d.text((x + 8, y + T + 4), f"{etq}  {'ok' if ok else '<900'}", fill="black" if ok else "red")
salida = os.path.join(DEST, "HOJA_cpu_bestbuy.jpg")
hoja.save(salida, quality=85)
print(f"\n{len(miniaturas)} fotos | hoja de contactos: {salida}")
