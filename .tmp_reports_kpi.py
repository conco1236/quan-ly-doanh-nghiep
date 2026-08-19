from pathlib import Path
import re
p = Path('/home/ubuntu/mini-erp-bia/client/src/pages/Home.tsx')
s = p.read_text()
pattern = r'      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">.*?</div>\n      \{module !== "inventory"'
replacement = '''      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(module !== "inventory") && <><div className="glass rounded-2xl p-5"><p className="text-xs text-slate-500">Tổng số lô sản xuất</p><p className="mt-2 font-display text-3xl font-bold text-amber-300">{productionData?.totalBatches ?? 0}</p><p className="mt-1 text-xs text-slate-500">Trong khoảng đã chọn</p></div><div className="glass rounded-2xl p-5"><p className="text-xs text-slate-500">Sản lượng kế hoạch</p><p className="mt-2 font-display text-3xl font-bold">{(productionData?.plannedQuantity ?? 0).toLocaleString("vi-VN")} kg</p></div>}{(module !== "production") && <><div className="glass rounded-2xl p-5"><p className="text-xs text-slate-500">Tồn kho hiện tại</p><p className="mt-2 font-display text-3xl font-bold text-teal-300">{(inventoryData?.totalStock ?? 0).toLocaleString("vi-VN")} kg</p></div><div className="glass rounded-2xl p-5"><p className="text-xs text-slate-500">Mặt hàng dưới ngưỡng</p><p className="mt-2 font-display text-3xl font-bold text-red-300">{inventoryData?.lowStockCount ?? 0}</p></div>}</div>
      {module !== "inventory"'''
s2, count = re.subn(pattern, replacement, s, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'KPI block not found: {count}')
p.write_text(s2)
