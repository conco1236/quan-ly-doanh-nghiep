from pathlib import Path
path = Path('/home/ubuntu/mini-erp-bia/client/src/pages/Home.tsx')
text = path.read_text()
text = text.replace('const [saveError, setSaveError] = useState(""); return <div>', 'const [saveError, setSaveError] = useState(""); const [detail, setDetail] = useState<any>(null); return <div>', 1)
text = text.replace('onClick={() => toast.info("Mở chi tiết bản ghi")}', 'onClick={() => setDetail(row)}', 1)
needle = '<div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-slate-500">'
insert = '<Dialog open={Boolean(detail)} onOpenChange={open => !open && setDetail(null)}><DialogContent className="border-white/10 bg-[#101c2f] text-slate-100"><DialogHeader><DialogTitle className="font-display">Chi tiết liên kết chéo</DialogTitle></DialogHeader>{detail && <div className="space-y-3 text-sm"><div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4"><p className="text-xs uppercase tracking-wider text-amber-200/70">Bản ghi nguồn</p><p className="mt-1 font-semibold">{detail.name}</p><p className="mt-1 text-xs text-slate-400">{detail.sku} · {detail.status}</p></div><div className="grid gap-2 sm:grid-cols-2">{Object.entries(detail).filter(([key]) => !["name", "sku", "status", "color"].includes(key)).map(([key, value]) => <div key={key} className="rounded-lg border border-white/10 bg-white/[.03] p-3"><p className="text-[10px] uppercase text-slate-500">{key}</p><p className="mt-1 text-slate-200">{String(value ?? "-")}</p></div>)}</div><p className="text-xs text-slate-500">Popup này là điểm nối chéo giữa Kho, Sản xuất, Bán hàng và Khách hàng; dữ liệu chi tiết được mở từ đúng dòng đang chọn.</p></div>}</DialogContent></Dialog><div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-slate-500">'
if needle not in text:
    raise SystemExit('ModuleTable footer needle not found')
text = text.replace(needle, insert, 1)
path.write_text(text)
