"""Aplica la revisión a ojo (EXC) y la resolución (<900) -> fotos válidas por producto."""
import json, os, sys, collections
sys.stdout.reconfigure(encoding="utf-8")
D = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(D, "medidas2.json"), encoding="utf-8"))

def rng(p, a, b, m): return {f"{p}.{k}": m for k in range(a, b + 1)}
EXC = {}
def add(m, *ids):
    for s in ids: EXC[s] = m
# --- placas
add("CAJA", "0.1", "1.1", "2.1", "3.1", "4.1", "5.1", "6.1", "7.12", "8.1", "9.1", "10.1", "11.1", "12.1", "12.7", "13.4",
    *[f"{i}.1" for i in range(14, 30)])
add("ACC", "3.7", "6.7", "7.13", "8.14", "9.14", "10.15", "11.13", "20.5")
add("QR", "8.2", "9.2", "11.14", "12.2")
add("OTRO", "12.16")
# --- GPUs
add("CAJA", "30.1", "31.1", "32.1", "33.1", "34.1", "35.1", "36.10", "36.11", "37.5", "38.1", "38.2", "39.1", "40.1", "41.2", "41.9",
    "42.8", "43.1", "44.2", "44.3", "45.1", "46.8", "47.1", "48.1", "49.1", "50.1", "51.1", "51.2", "52.1", "52.2", "53.8", "54.1",
    "55.8", "56.1", "58.8", "59.6", "60.8", "61.6", "62.6", "64.4", "65.2", "65.6", "72.8", "77.2", "79.1", "79.8", "80.1", "80.8",
    "81.1", "81.8", "82.1", "82.8", "83.1", "83.7", "84.1", "84.7", *[f"{i}.1" for i in range(85, 91)],
    *[f"{i}.{k}" for i in range(66, 72) for k in (2, 3)])
add("SELLO", "33.2", "38.4", "44.4", "72.1", "73.1", "74.1", "75.1", "76.1", *[f"{i}.1" for i in range(66, 72)])
add("ACC", "43.6", "44.11", "54.6", "79.7", "80.7", "81.7", "82.7")
add("DIAG", "57.3", "58.2", "59.2", "77.4", "78.4")
# --- RAM
add("SELLO", "97.1", "111.1", "112.1")
add("CAJA", "113.4", "114.4", "118.6", "119.3", "120.3")
# --- CPUs
add("CAJA", "121.1", "122.1", "123.1", "124.1", "125.1", "126.1", "127.1", "128.1", "129.1", "129.2", "129.3", "130.1", "130.2",
    "131.1", "132.1", "133.1", "134.1", "134.2", "135.1", "135.2", "136.1", "137.1", "137.2", "138.1", "139.1", "139.2",
    "140.1", "140.2", "140.3", "141.1", "141.2", "141.3", "142.1", "142.2")
add("BANNER", "135.3", "136.2")
# --- fuentes
add("SELLO", "143.1", "144.1", "147.1", "148.1", "149.1", "150.1", "159.1", "162.1", "166.1", "174.1")
add("CAJA", "144.5", "145.1", "146.1", "151.1", "152.1", "153.1", "154.1", "155.1", "156.1", "157.1", "158.1", "160.1", "161.1",
    "167.1", "168.1", "169.1")
# --- almacenamiento
add("CAJA", "177.6", "178.5", "179.5", "179.6", "180.5", "181.5", "181.6", "182.3", "183.5", "188.4", "189.4", "193.5", "195.2",
    "195.3", "196.3", "197.3", "199.3", "200.4", "200.5", "200.6", "202.3", "207.2", "207.3", "207.4", "207.5")
add("SELLO", "199.1")
add("DIAG", "192.5", "193.6")
add("INUTIL", "188.3", "189.3")
add("AMB", "184.3", "185.6", "186.3", "198.3", "201.3")
# --- refrigeración (ambientadas: instaladas dentro de un PC / placa)
add("AMB", "240.4", "255.4", "256.6", "257.4", "258.4", "263.6", "263.7", "263.8", "263.9", "265.7", "265.8", "266.4", "266.5", "266.6")

filas = []
for r in R:
    val, motivos, amb = [], collections.Counter(), 0
    for n, fo in enumerate(r["fotos"], 1):
        k = f"{r['i']}.{n}"
        m = EXC.get(k)
        if m == "AMB":
            amb += 1
        if m and m != "AMB":
            motivos[m] += 1; continue
        if fo["lado"] < 900 or fo["medium"]:
            motivos["BAJA"] += 1; continue
        val.append(k)
    estricto = [k for k in val if EXC.get(k) != "AMB"]
    filas.append(dict(i=r["i"], cat=r["cat"], marca=r["marca"], modelo=r["modelo"], total=r["n"],
                      validas=len(val), estricto=len(estricto), amb=amb, motivos=dict(motivos), principal_ok=r["fotos"] and f"{r['i']}.1" in val))
json.dump(dict(EXC=EXC, filas=filas), open(os.path.join(D, "clasificacion.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print("=== fotos a quitar por motivo ===")
print(collections.Counter(EXC.values()), "  BAJA extra:", sum(f["motivos"].get("BAJA", 0) for f in filas))
por = collections.OrderedDict()
for f in filas: por.setdefault(f["cat"], []).append(f)
print("\n=== POR CATEGORÍA (válidas sin contar ambientadas) ===")
for c, fs in por.items():
    b = lambda lo, hi: sum(1 for f in fs if lo <= f["estricto"] <= hi)
    print(f"{c:20} prod={len(fs):3}  0 fotos={b(0,0):3}  1-2 fotos={b(1,2):3}  3+={b(3,99):3}  principal a cambiar={sum(1 for f in fs if not f['principal_ok']):3}")
print("\n=== PRODUCTOS CON 0-2 FOTOS VÁLIDAS (estricto) ===")
for f in filas:
    if f["estricto"] <= 2:
        print(f"[{f['i']:3}] {f['cat'][:12]:12} | {f['marca'][:12]:12} | {f['modelo'][:42]:42} | válidas {f['estricto']} (con ambientadas {f['validas']}) de {f['total']} | {f['motivos']}")
