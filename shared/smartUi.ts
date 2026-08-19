export type SmartUiMeta = { group: string; icon: string; accent: "amber" | "teal" | "red" | "violet" };

const rules: Array<[RegExp, SmartUiMeta]> = [
  [/kho|nguyên liệu|tồn/i, { group: "Kho bãi", icon: "boxes", accent: "teal" }],
  [/bia|nấu|lô|sản xuất/i, { group: "Sản xuất", icon: "factory", accent: "amber" }],
  [/qc|kcs|lab|kiểm định/i, { group: "KCS / QC", icon: "flask", accent: "red" }],
  [/bán|đơn|pos|doanh thu/i, { group: "Bán hàng", icon: "cart", accent: "violet" }],
  [/nhân sự|người dùng|phân quyền/i, { group: "Nhân sự & hệ thống", icon: "users", accent: "teal" }],
];

export function inferSmartUiMeta(label: string): SmartUiMeta { return rules.find(([pattern]) => pattern.test(label))?.[1] ?? { group: "Tổng quan", icon: "layout-dashboard", accent: "amber" }; }
export function decorateNavItems<T extends { label: string }>(items: T[]) { return items.map(item => ({ ...item, smart: inferSmartUiMeta(item.label) })); }
