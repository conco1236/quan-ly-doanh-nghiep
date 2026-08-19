import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("application title configuration", () => {
  it("publishes the configured Quản Lý Doanh Nghiệp title", () => {
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(html).toContain("<title>Quản Lý Doanh Nghiệp</title>");
    expect(html).toContain('name="description" content="Quản Lý Doanh Nghiệp - Hệ thống quản trị doanh nghiệp"');
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain("Quản Lý Doanh Nghiệp");
    expect(home).toContain("HÓA ĐƠN THANH TOÁN");
    expect(home).toContain("Thanh toan ${branding.data?.companyName");
    expect(home).not.toContain("breweryos-bill");
    expect(home).not.toContain("Thanh toan POS BreweryOS");
  });
});

