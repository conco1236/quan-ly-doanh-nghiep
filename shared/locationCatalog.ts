export type LocationProvince = { code: string; name: string; districts: { code: string; name: string }[] };

/** Danh mục nền có cấu trúc; có thể mở rộng hoặc thay bằng nguồn đồng bộ quản trị mà không sửa component. */
export const LOCATION_CATALOG: LocationProvince[] = [
  { code: "HN", name: "Hà Nội", districts: [{ code: "DD", name: "Đống Đa" }, { code: "CG", name: "Cầu Giấy" }, { code: "HK", name: "Hoàn Kiếm" }] },
  { code: "HCM", name: "TP. Hồ Chí Minh", districts: [{ code: "Q1", name: "Quận 1" }, { code: "Q3", name: "Quận 3" }, { code: "TD", name: "Thủ Đức" }] },
  { code: "DNG", name: "Đà Nẵng", districts: [{ code: "HC", name: "Hải Châu" }, { code: "TK", name: "Thanh Khê" }, { code: "ST", name: "Sơn Trà" }] },
];

export function getProvince(code: string) { return LOCATION_CATALOG.find(item => item.code === code); }
export function getDistricts(provinceCode: string) { return getProvince(provinceCode)?.districts ?? []; }

export function getDefaultDistrictName(provinceName: string) { return LOCATION_CATALOG.find(item => item.name === provinceName)?.districts[0]?.name ?? ""; }

export function buildCustomerLocationPayload(provinceName: string, districtName: string) {
  const province = LOCATION_CATALOG.find(item => item.name === provinceName);
  const district = province?.districts.find(item => item.name === districtName);
  return { provinceCode: province?.code, districtCode: district?.code, address: province && district ? `${province.name}, ${district.name}` : "" };
}

export function buildCustomerCreatePayload(name: string, phone: string, provinceName: string, districtName: string) { return { name, phone, ...buildCustomerLocationPayload(provinceName, districtName) }; }
