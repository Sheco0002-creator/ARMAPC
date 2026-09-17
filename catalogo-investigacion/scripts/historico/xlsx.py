"""Lector mínimo de .xlsx sin dependencias: devuelve filas (listas de str) de la primera hoja."""
import re, sys, zipfile, xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def col_idx(ref):
    letters = re.match(r'[A-Z]+', ref).group()
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n - 1


def read_xlsx(path):
    z = zipfile.ZipFile(path)
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('m:si', NS):
            shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
    sheet = sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet'))[0]
    root = ET.fromstring(z.read(sheet))
    rows = []
    for r in root.iter('{%s}row' % NS['m']):
        row = {}
        for c in r.findall('m:c', NS):
            t = c.get('t')
            v = c.find('m:v', NS)
            if t == 's' and v is not None:
                val = shared[int(v.text)]
            elif t == 'inlineStr':
                val = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
            else:
                val = v.text if v is not None else ''
            row[col_idx(c.get('r'))] = val
        if row:
            rows.append([row.get(i, '') for i in range(max(row) + 1)])
    return rows


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    rows = read_xlsx(sys.argv[1])
    print(len(rows), 'filas;', 'columnas:', len(rows[0]))
    for r in rows[:int(sys.argv[2]) if len(sys.argv) > 2 else 3]:
        print(r)
