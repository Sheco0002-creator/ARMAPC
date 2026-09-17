"""Guarda ficha e imágenes de los 8 Intel en el USB JORGE.

intel.com da 403 a peticiones directas: las specs se leyeron en el navegador del usuario
(tablas `table.cmp-list-section__table` de /products/sku/<id>/specifications.html) y se
pegan abajo. intel.com no publica fotos del producto; las fotos son las de la ficha de
Best Buy (bbystatic, galería "Zoom" del propio SKU, que confirma también el UPC).

Uso: python cpus_intel.py <carpeta destino en JORGE>
"""
import json, sys, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
DEST = Path(sys.argv[1])
BBY = 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/'
ARK = 'https://www.intel.com/content/www/us/en/products/sku/'
K = ['Code Name', 'Lithography', 'Recommended Customer Price', 'Total Cores', '# of Performance-cores',
     '# of Efficient-cores', 'Total Threads', 'Max Turbo Frequency', 'Performance-core Max Turbo Frequency',
     'Efficient-core Max Turbo Frequency', 'Performance-core Base Frequency', 'Efficient-core Base Frequency',
     'Cache', 'Total L2 Cache', 'Processor Base Power', 'Maximum Turbo Power', 'Launch Date',
     'Max Memory Size', 'Memory Types', 'Max # of Memory Channels', 'GPU Name',
     'Graphics Max Dynamic Frequency', 'Max # of PCI Express Lanes', 'Sockets Supported',
     'Max Operating Temperature', 'Overall Peak TOPS (Int8)', 'NPU Name']
# n|valores en el orden de K (copiado del navegador, 2026-09-11)
FILAS = """
15|Arrow Lake||$309.00-$319.00|14|6|8|14|5.2 GHz|5.2 GHz|4.6 GHz|4.2 GHz|3.6 GHz|24 MB|26 MB|125 W|159 W|Q4'24|256 GB|Up to DDR5 6400 MT/s|2|Intel Graphics|1.9 GHz|24|FCLGA1851|105 °C|30|Intel AI Boost
16|Arrow Lake||$219.00-$229.00|18|6|12|18|5.3 GHz|5.3 GHz|4.6 GHz|4.2 GHz|3.3 GHz|30 MB|30 MB|125 W|159 W|Q1'26|256 GB|Up to DDR5 7200 MT/s|2|Intel Graphics|1.9 GHz|24|FCLGA1851|105 °C|30|Intel AI Boost
17|Arrow Lake||$394.00-$404.00|20|8|12|20|5.5 GHz|5.4 GHz|4.6 GHz|3.9 GHz|3.3 GHz|30 MB|36 MB|125 W|250 W|Q4'24|256 GB|Up to DDR5 6400 MT/s|2|Intel Graphics|2 GHz|24|FCLGA1851|105 °C|33|Intel AI Boost
18|Arrow Lake||$339.00-$349.00|24|8|16|24|5.5 GHz|5.4 GHz|4.7 GHz|3.7 GHz|3.2 GHz|36 MB|40 MB|125 W|250 W|Q1'26|256 GB|Up to DDR5 7200 MT/s|2|Intel Graphics|2 GHz|24|FCLGA1851|105 °C|36|Intel AI Boost
19|Arrow Lake||$589.00-$599.00|24|8|16|24|5.7 GHz|5.5 GHz|4.6 GHz|3.7 GHz|3.2 GHz|36 MB|40 MB|125 W|250 W|Q4'24|256 GB|Up to DDR5 6400 MT/s|2|Intel Graphics|2 GHz|24|FCLGA1851|105 °C|36|Intel AI Boost
20|Raptor Lake|Intel 7|$319.00-$329.00|14|6|8|20|5.3 GHz|5.3 GHz|4 GHz|3.5 GHz|2.6 GHz|24 MB|20 MB|125 W|181 W|Q4'23|192 GB|Up to DDR5 5600 MT/s · Up to DDR4 3200 MT/s|2|Intel UHD Graphics 770|1.55 GHz|20|FCLGA1700|100 °C||
21|Raptor Lake|Intel 7|$409.00-$419.00|20|8|12|28|5.6 GHz|5.5 GHz|4.3 GHz|3.4 GHz|2.5 GHz|33 MB|28 MB|125 W|253 W|Q4'23|192 GB|Up to DDR5 5600 MT/s · Up to DDR4 3200 MT/s|2|Intel UHD Graphics 770|1.6 GHz|20|FCLGA1700|100 °C||
22|Raptor Lake|Intel 7|$589.00-$599.00|24|8|16|32|6 GHz|5.6 GHz|4.4 GHz|3.2 GHz|2.4 GHz|36 MB|32 MB|125 W|253 W|Q4'23|192 GB|Up to DDR5 5600 MT/s · Up to DDR4 3200 MT/s|2|Intel UHD Graphics 770|1.65 GHz|20|FCLGA1700|100 °C||
"""
ARK_ID = {15: '241067/intel-core-ultra-5-processor-245k-24m-cache-up-to-5-20-ghz',
          16: '245694/intel-core-ultra-5-processor-250k-plus-30m-cache-up-to-5-30-ghz',
          17: '241063/intel-core-ultra-7-processor-265k-30m-cache-up-to-5-50-ghz',
          18: '245692/intel-core-ultra-7-processor-270k-plus-36m-cache-up-to-5-50-ghz',
          19: '241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz',
          20: '236799/intel-core-i5-processor-14600k-24m-cache-up-to-5-30-ghz',
          21: '236783/intel-core-i7-processor-14700k-33m-cache-up-to-5-60-ghz',
          22: '236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz'}
FOTOS = {
    15: ['816f0dc1-2ae6-4907-8618-36db376d3bd0.jpg', '141bdd34-fdd4-4f4a-adde-bf8bffed9cde.jpg', 'de36f180-e048-4200-9bf3-9da509b15962.jpg'],
    16: ['351d6d9c-7915-4906-9e83-7800fc757f88.jpg', '4198fba5-97d8-4b2f-a57f-5c106a035c55.jpg'],
    17: ['6860eb92-0e32-4684-a69b-7880b09d0b00.jpg', '4adf1b23-1893-486e-9a01-3bb6fcce0d89.jpg'],
    18: ['aee62347-cee4-4ef3-854f-32916096ee2c.jpg'],
    19: ['0224860a-6519-429e-b610-38285cc3d33f.jpg', '3ae80d3d-c425-43e0-96cd-be9a6e614957.jpg'],
    20: ['6560/6560423_sd.jpg', '6560/6560423cv1d.jpg', '6560/6560423cv11d.jpg'],
    21: ['6560/6560420_sd.jpg', '6560/6560420cv1d.jpg', '6560/6560420cv11d.jpg'],
    22: ['6560/6560418_sd.jpg', '6560/6560418cv1d.jpg'],
}

codigos = {c['n']: c for c in json.loads((DEST / 'cpu_codigos.json').read_text(encoding='utf-8'))}
salida = []
for linea in FILAS.strip().splitlines():
    n, *vals = linea.split('|')
    n = int(n)
    specs = {k: v for k, v in zip(K, vals) if v}
    carpeta = DEST / 'INTEL' / codigos[n]['mpn']
    carpeta.mkdir(parents=True, exist_ok=True)
    urls = [BBY + f for f in FOTOS[n]]
    for k, u in enumerate(urls, 1):
        destino = carpeta / f'{k:02d}.jpg'
        if not destino.exists():
            # ;maxHeight/maxWidth pide a bbystatic la versión grande
            req = urllib.request.Request(u + ';maxHeight=2000;maxWidth=2000', headers={'User-Agent': 'Mozilla/5.0'})
            destino.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    salida.append({**codigos[n], 'url': ARK + ARK_ID[n] + '/specifications.html', 'specs': specs,
                   'imgs': urls, 'fuente_imagenes': 'bestbuy.com'})
    print(n, codigos[n]['modelo'], 'specs', len(specs), [(p.name, p.stat().st_size // 1024) for p in sorted(carpeta.iterdir())])
(DEST / 'intel_fichas.json').write_text(json.dumps(salida, indent=1, ensure_ascii=False), encoding='utf-8')
