import json, sys, collections, statistics
sys.stdout.reconfigure(encoding="utf-8")
cat = json.load(open(r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json", encoding="utf-8"))
B = json.load(open(r"D:\catalogo-investigacion-ARCHIVO\PRECIOS_pcpartpicker_2026-09-12.json", encoding="utf-8"))["precios"]
P = {int(k): v for k, v in B.items()}

print("=== cobertura por categoría ===")
por = collections.OrderedDict()
for i, p in enumerate(cat): por.setdefault(p["categoria"], []).append(i)
for c, ids in por.items():
    con = [i for i in ids if P[i]["usd"] is not None]
    print(f"{c:20} {len(con):3}/{len(ids):3} con precio")

print("\n=== GPUs: precio vs el más barato del mismo chip ===")
chips = collections.defaultdict(list)
for i, p in enumerate(cat):
    if p["categoria"] == "Tarjetas gráficas" and P[i]["usd"]: chips[p["chip"]].append((P[i]["usd"], i))
for ch, l in sorted(chips.items()):
    m = min(x[0] for x in l)
    print(f"{ch:18} " + "  ".join(f"#{i} {cat[i]['marca'][:7]} {u:.0f}{' <<'+format(u/m,'.2f')+'x' if u/m > 1.35 else ''}" for u, i in sorted(l)))

print("\n=== sin precio ===")
for c, ids in por.items():
    sin = [i for i in ids if P[i]["usd"] is None]
    if sin: print(f"{c}: " + "; ".join(f"#{i} {cat[i]['marca']} {cat[i]['modelo']}" for i in sin))

RANGOS = {"Placas base": [(0, 200, "entrada"), (200, 300, "media"), (300, 450, "alta"), (450, 1e9, "extrema")],
          "Procesadores": [(0, 200, "entrada"), (200, 350, "media"), (350, 500, "alta"), (500, 1e9, "extrema")],
          "Almacenamiento": [(0, 80, "entrada"), (80, 150, "media"), (150, 250, "alta"), (250, 1e9, "extrema")],
          "Fuentes de poder": [(0, 80, "entrada"), (80, 130, "media"), (130, 200, "alta"), (200, 1e9, "extrema")]}
print("\n=== gama según precio real (sólo categorías cuya gama sale del precio) ===")
for c, r in RANGOS.items():
    dif = []
    for i in por[c]:
        u = P[i]["usd"]
        if u is None: continue
        g = next(n for a, b, n in r if a <= u < b)
        if g != cat[i]["gama"]: dif.append(f"#{i} {cat[i]['modelo'][:22]} {cat[i]['gama']}→{g} (${u:.0f})")
    print(f"{c}: {len(dif)} cambiarían de gama" + ("" if not dif else "\n   " + "\n   ".join(dif)))
