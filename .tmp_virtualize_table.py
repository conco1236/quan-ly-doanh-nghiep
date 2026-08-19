from pathlib import Path
import re
path = Path('/home/ubuntu/mini-erp-bia/client/src/pages/Home.tsx')
text = path.read_text()
marker = 'function ModuleTable('
component = r'''function VirtualizedTable({ rows, columns }: { rows: any[]; columns: string[] }) {
  const [scrollTop, setScrollTop] = useState(0);
  const rowHeight = 56;
  const viewportRows = 70;
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 4);
  const visibleRows = rows.slice(start, start + viewportRows);
  const topSpace = start * rowHeight;
  const bottomSpace = Math.max(0, (rows.length - start - visibleRows.length) * rowHeight);
  return <div className="max-h-[520px] overflow-auto" onScroll={event => setScrollTop(event.currentTarget.scrollTop)}><table className="w-full min-w-[760px] text-left text-xs"><thead className="sticky top-0 z-10 bg-[#101c2f] text-[10px] uppercase tracking-wider text-slate-500"><tr>{columns.map(column => <th key={column} className="px-5 py-3">{column}</th>)}<th className="px-5 py-3 text-right">Thao tác</th></tr></thead><tbody>{topSpace > 0 && <tr aria-hidden="true"><td colSpan={columns.length + 1} style={{ height: topSpace }} /></tr>}{visibleRows.map(row => <tr key={row.sku || row.name} className="border-t border-white/5 transition hover:bg-white/[.025]"><td className="px-5 py-4 font-semibold text-slate-200">{row.name}</td><td className="px-5 py-4 text-slate-400">{row.sku}</td><td className="px-5 py-4 font-semibold text-slate-200">{row.qty}</td><td className="px-5 py-4 text-slate-400">{row.unit}</td><td className="px-5 py-4 text-slate-400">{row.threshold}</td><td className="px-5 py-4"><StatusPill tone={row.color}>{row.status}</StatusPill></td><td className="px-5 py-4 text-right"><button onClick={() => toast.info("Mở chi tiết bản ghi")} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-amber-300"><MoreHorizontal size={17} /></button></td></tr>)}{bottomSpace > 0 && <tr aria-hidden="true"><td colSpan={columns.length + 1} style={{ height: bottomSpace }} /></tr>}</tbody></table></div>;
}

'''
if 'function VirtualizedTable(' not in text:
    text = text.replace(marker, component + marker, 1)
pattern = re.compile(r'<div className="overflow-x-auto"><table className="w-full min-w-\[760px\].*?</table></div>', re.S)
text, count = pattern.subn('<VirtualizedTable rows={rows.filter((row: any) => Object.values(row).some(value => String(value).toLowerCase().includes(search.toLowerCase())))} columns={columns} />', text, count=1)
if count != 1:
    raise SystemExit(f'expected one ModuleTable table replacement, got {count}')
path.write_text(text)
