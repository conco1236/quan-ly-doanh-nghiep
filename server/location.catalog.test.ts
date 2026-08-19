import { describe, expect, it } from "vitest";
import { LOCATION_CATALOG, getDistricts, getDefaultDistrictName, buildCustomerLocationPayload, buildCustomerCreatePayload } from "../shared/locationCatalog";

describe("location catalog", () => {
  it("returns districts for a selected province", () => {
    expect(getDistricts("HN").map(item => item.code)).toContain("DD");
    expect(getDistricts("HCM").map(item => item.code)).toContain("Q1");
  });

  it("keeps province and district codes stable", () => {
    expect(LOCATION_CATALOG.find(item => item.name === "Hà Nội")?.code).toBe("HN");
  });

  it("resets dependent districts and creates a structured save payload", () => {
    const hanoiDistricts = getDistricts("HN");
    const danangDistricts = getDistricts("DNG");
    expect(hanoiDistricts).not.toEqual(danangDistricts);
    expect(buildCustomerLocationPayload("Đà Nẵng", "Hải Châu")).toEqual({ provinceCode: "DNG", districtCode: "HC", address: "Đà Nẵng, Hải Châu" });
    expect(getDefaultDistrictName("Đà Nẵng")).toBe("Hải Châu");
    expect(buildCustomerCreatePayload("Nhà hàng Bia", "0900000000", "Đà Nẵng", "Hải Châu")).toEqual({ name: "Nhà hàng Bia", phone: "0900000000", provinceCode: "DNG", districtCode: "HC", address: "Đà Nẵng, Hải Châu" });
  });
});
