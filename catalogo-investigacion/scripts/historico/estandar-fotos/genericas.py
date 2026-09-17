"""Imágenes genéricas por categoría (1200x1200, fondo blanco): silueta del componente + logo ARMAPC.
Salida: catalogo/imagenes/_generica/<categoria>.png"""
import os, sys
from PIL import Image, ImageDraw
OUT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\imagenes\_generica"
if len(sys.argv) > 1: OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
S = 2                      # supermuestreo para bordes suaves
W = 1200 * S
FILL, EDGE, DARK, LOGO = (228, 230, 234), (196, 200, 207), (206, 210, 216), (150, 156, 165)

# logo ARMAPC: mismos polígonos que src/app/page.tsx (viewBox 1040x100)
LETRAS = [
    (35, [[(0,20),(22,20),(22,100),(0,100)], [(0,0),(130,0),(130,20),(0,20)], [(108,20),(130,20),(130,100),(108,100)], [(22,46),(108,46),(108,66),(22,66)]]),
    (195, [[(0,0),(22,0),(22,100),(0,100)], [(22,0),(130,0),(130,20),(22,20)], [(108,20),(130,20),(130,54),(108,54)], [(22,40),(120,40),(120,58),(22,58)], [(60,56),(82,56),(130,100),(106,100)]]),
    (355, [[(0,0),(22,0),(22,100),(0,100)], [(128,0),(150,0),(150,100),(128,100)], [(22,0),(44,0),(82,62),(64,62)], [(106,0),(128,0),(86,62),(68,62)]]),
    (535, [[(0,20),(22,20),(22,100),(0,100)], [(0,0),(130,0),(130,20),(0,20)], [(108,20),(130,20),(130,100),(108,100)], [(22,46),(108,46),(108,66),(22,66)]]),
    (710, [[(0,0),(22,0),(22,100),(0,100)], [(22,0),(130,0),(130,20),(22,20)], [(108,20),(130,20),(130,58),(108,58)], [(22,42),(120,42),(120,60),(22,60)]]),
    (870, [[(0,0),(22,0),(22,100),(0,100)], [(22,0),(130,0),(130,20),(22,20)], [(22,80),(130,80),(130,100),(22,100)], [(108,20),(130,20),(130,36),(108,36)], [(108,64),(130,64),(130,80),(108,80)]]),
]
def logo(d, cx, y, ancho):
    k = ancho / 970; x0 = cx - ancho / 2 - 35 * k
    for tx, polys in LETRAS:
        for pl in polys:
            d.polygon([(x0 + (tx + px) * k, y + py * k) for px, py in pl], fill=LOGO)

def R(d, box, r=18, fill=FILL, outline=EDGE, w=6):
    d.rounded_rectangle([v * S for v in box], radius=r * S, fill=fill, outline=outline, width=w * S)
def C(d, cx, cy, r, fill=FILL, outline=EDGE, w=6):
    d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=fill, outline=outline, width=w * S)
def ventilador(d, cx, cy, r):
    C(d, cx, cy, r); C(d, cx, cy, r * 0.82, fill=(238, 240, 243)); C(d, cx, cy, r * 0.22, fill=DARK)
    for a in range(0, 360, 45):
        import math
        t = math.radians(a)
        d.line([(cx + math.cos(t) * r * 0.25) * S, (cy + math.sin(t) * r * 0.25) * S,
                (cx + math.cos(t + 0.5) * r * 0.78) * S, (cy + math.sin(t + 0.5) * r * 0.78) * S], fill=EDGE, width=10 * S)

def placa(d):
    R(d, (300, 220, 900, 900), 14)
    R(d, (430, 330, 590, 490), 10, fill=DARK)                     # zócalo
    for x in (660, 700, 740, 780): R(d, (x, 300, x + 22, 620), 6, fill=DARK, w=3)   # RAM
    for y in (680, 760, 830): R(d, (340, y, 820, y + 24), 6, fill=DARK, w=3)      # PCIe
    R(d, (320, 240, 400, 620), 10, fill=DARK, w=3)                # I/O
def gpu(d):
    R(d, (170, 360, 1030, 700), 30)
    for cx in (330, 600, 870): ventilador(d, cx, 530, 120)
    R(d, (240, 700, 700, 730), 4, fill=DARK, w=3)                 # conector PCIe
    R(d, (130, 340, 170, 760), 6, fill=DARK, w=3)                 # bracket
def ram(d):
    for dy in (0, 150):
        R(d, (190, 380 + dy, 1010, 500 + dy), 12)
        for x in range(250, 960, 90): R(d, (x, 405 + dy, x + 60, 475 + dy), 4, fill=DARK, w=2)
        R(d, (190, 500 + dy, 1010, 520 + dy), 2, fill=DARK, w=2)
def cpu(d):
    R(d, (330, 330, 870, 870), 24, fill=(205, 210, 200))
    R(d, (410, 410, 790, 790), 30)
    for i in range(12):
        for x, y in ((360 + i * 42, 345), (360 + i * 42, 845), (345, 360 + i * 42), (845, 360 + i * 42)):
            d.rectangle([x * S, y * S, (x + 12) * S, (y + 12) * S], fill=(190, 172, 120))
def m2(d):
    R(d, (170, 500, 1030, 700), 14)
    for x in (260, 470, 680): R(d, (x, 540, x + 170, 660), 8, fill=DARK, w=3)
    R(d, (1030, 520, 1060, 680), 4, fill=(215, 200, 150), w=2)   # conector
    C(d, 190, 600, 18, fill=(255, 255, 255))
def fuente(d):
    R(d, (250, 330, 950, 870), 26)
    ventilador(d, 600, 600, 220)
def gabinete(d):
    R(d, (380, 180, 820, 950), 22)
    R(d, (420, 230, 780, 820), 14, fill=(236, 238, 241))
    for cy in (360, 560): ventilador(d, 600, cy, 80)
    R(d, (420, 860, 780, 900), 6, fill=DARK, w=3)
def refrigeracion(d):
    R(d, (360, 230, 840, 820), 16, fill=(236, 238, 241))
    for y in range(260, 800, 34): d.line([380 * S, y * S, 820 * S, y * S], fill=EDGE, width=5 * S)
    ventilador(d, 600, 520, 230)
    for x in (470, 540, 660, 730): R(d, (x, 820, x + 30, 930), 8, fill=(215, 190, 160), w=3)

for nombre, fn in [("placas", placa), ("gpus", gpu), ("ram", ram), ("procesadores", cpu), ("almacenamiento", m2),
                   ("fuentes-poder", fuente), ("gabinetes", gabinete), ("refrigeracion", refrigeracion)]:
    im = Image.new("RGB", (W, W), "white"); d = ImageDraw.Draw(im)
    fn(d)
    logo(d, W / 2, 1040 * S, 300 * S)
    im.resize((1200, 1200), Image.LANCZOS).save(os.path.join(OUT, f"{nombre}.png"), optimize=True)
    print(os.path.join(OUT, f"{nombre}.png"))
