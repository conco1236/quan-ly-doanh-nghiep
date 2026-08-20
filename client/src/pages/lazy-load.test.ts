import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("lazy-loaded report surfaces", () => {
  it("loads ReportsPanel only when the reports screen is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./ReportsPanel"))');
    expect(home).toContain("<LazyReportsPanel />");
  });

  it("loads admin panels only after an admin opens the relevant screen", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./AdminUsersPanel"))');
    expect(home).toContain('lazy(() => import("./BrandingPanel"))');
    expect(home).toContain("<LazyAdminUsersPanel />");
    expect(home).toContain("<LazyBrandingPanel />");
  });

  it("does not statically import html2canvas into client export helpers", () => {
    const exportSource = readFileSync(resolve(process.cwd(), "client/src/lib/export.ts"), "utf8");
    expect(exportSource).not.toContain('from "html2canvas"');
    expect(exportSource).not.toContain('import("html2canvas")');
    expect(exportSource).toContain('import("jspdf")');
  });
});
