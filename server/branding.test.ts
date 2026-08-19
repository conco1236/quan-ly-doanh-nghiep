import { describe, expect, it } from "vitest";
import { canChangeUserRole, canManageBranding, normalizeBrandingCopy } from "./routers";

describe("Branding access policy", () => {
  it("allows Admin and rejects Nhân viên for branding management", () => {
    expect(canManageBranding("admin")).toBe(true);
    expect(canManageBranding("user")).toBe(false);
  });
});

describe("User role change policy", () => {
  it("allows assigning a role to another user", () => {
    expect(canChangeUserRole({ actorId: 1, targetId: 2, nextRole: "admin", currentRole: "user", adminCount: 1 })).toBe(true);
    expect(canChangeUserRole({ actorId: 1, targetId: 2, nextRole: "user", currentRole: "admin", adminCount: 2 })).toBe(true);
  });

  it("prevents self-demotion and removing the last Admin", () => {
    expect(canChangeUserRole({ actorId: 1, targetId: 1, nextRole: "user", currentRole: "admin", adminCount: 2 })).toBe(false);
    expect(canChangeUserRole({ actorId: 1, targetId: 2, nextRole: "user", currentRole: "admin", adminCount: 1 })).toBe(false);
  });
});

describe("Branding copy validation", () => {
  it("trims company name and tagline before persistence", () => {
    expect(normalizeBrandingCopy({ companyName: "  Công ty Bia ABC  ", tagline: "  Uống có trách nhiệm  ", address: "  123 Đường Bia  ", hotline: "  1900 1234  ", taxCode: "  0123456789  " })).toEqual({ companyName: "Công ty Bia ABC", tagline: "Uống có trách nhiệm", address: "123 Đường Bia", hotline: "1900 1234", taxCode: "0123456789", email: "", website: "" });
  });

  it("rejects blank branding fields", () => {
    expect(() => normalizeBrandingCopy({ companyName: "   ", tagline: "Slogan" })).toThrow("Tên công ty không được để trống");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "   " })).toThrow("Slogan không được để trống");
  });

  it("trims optional contact fields and defaults them to empty strings", () => {
    expect(normalizeBrandingCopy({ companyName: "Công ty", tagline: "Slogan" })).toEqual({ companyName: "Công ty", tagline: "Slogan", address: "", hotline: "", taxCode: "", email: "", website: "" });
  });

  it("rejects values exceeding database limits", () => {
    expect(() => normalizeBrandingCopy({ companyName: "x".repeat(161), tagline: "Slogan" })).toThrow("160 ký tự");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "x".repeat(241) })).toThrow("240 ký tự");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "Slogan", address: "x".repeat(301) })).toThrow("Địa chỉ");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "Slogan", hotline: "x".repeat(41) })).toThrow("Hotline");
    expect(() => normalizeBrandingCopy({ companyName: "Brewery", tagline: "Slogan", taxCode: "x".repeat(41) })).toThrow("Mã số thuế");
  });
});

