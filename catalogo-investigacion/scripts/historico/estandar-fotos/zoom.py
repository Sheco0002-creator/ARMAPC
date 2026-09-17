"""python zoom.py salida.jpg 12.16 235.1 ...  -> montaje de fotos concretas a 420 px"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
D = os.path.dirname(os.path.abspath(__file__))
R = {r["i"]: r for r in json.load(open(os.path.join(D, "medidas2.json"), encoding="utf-8"))}
T, COLS = 420, 4
ids = sys.argv[2:]
hoja = Image.new("RGB", (T * COLS, T * (-(-len(ids) // COLS))), "white"); dr = ImageDraw.Draw(hoja)
f = ImageFont.truetype("arial.ttf", 18)
for k, s in enumerate(ids):
    p, n = s.split("."); fo = R[int(p)]["fotos"][int(n) - 1]
    im = Image.open(os.path.join(BASE, fo["ruta"])).convert("RGBA"); bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[3])
    bg.thumbnail((T - 10, T - 30)); x, y = (k % COLS) * T, (k // COLS) * T
    hoja.paste(bg, (x + 5, y + 26)); dr.text((x + 5, y + 3), s, fill="red", font=f)
hoja.save(os.path.join(D, "hojas", sys.argv[1]), quality=88)
