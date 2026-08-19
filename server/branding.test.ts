import { describe, expect, it } from "vitest";
import { normalizeBrandingCopy } from "./routers";

describe("Branding copy validation", () => {
  it("trims company name and tagline before persistence", () => {
    expect(normalizeBrandingCopy({ companyName: "  Công ty Bia ABC  ", tagline: "  Uống có trách nhiệm  " })).toEqual({ companyName: "Công ty Bia ABC", tagline: "Uống có trách nhiệm" });
  });

  it("rejects blank branding fields", () => {
    expect(() => normalizeBrandingCopy({ companyName: "   ", tagline: "Slogan" })).toThrow("Tên công ty không được để trống");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "   " })).toThrow("Slogan không được để trống");
  });

  it("rejects values exceeding database limits", () => {
    expect(() => normalizeBrandingCopy({ companyName: "x".repeat(161), tagline: "Slogan" })).toThrow("160 ký tự");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "x".repeat(241) })).toThrow("240 ký tự");
  });
});

