from pathlib import Path
p = Path('/home/ubuntu/mini-erp-bia/client/src/pages/Home.tsx')
s = p.read_text()
first = s.find('function Reports()')
old = s.find('function Reports() { return', first + 1)
if first < 0 or old < 0:
    raise SystemExit(f'boundaries not found: {first}, {old}')
p.write_text(s[:old].rstrip() + '\n')
