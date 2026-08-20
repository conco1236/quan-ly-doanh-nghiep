import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("lazy-loaded report surfaces", () => {
  it("loads ReportsPanel only when the reports screen is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./ReportsPanel"))');
    expect(home).toContain("<LazyReportsPanel />");
  });

  it("does not statically import html2canvas into client export helpers", () => {
    const exportSource = readFileSync(resolve(process.cwd(), "client/src/lib/export.ts"), "utf8");
    expect(exportSource).not.toContain('from "html2canvas"');
    expect(exportSource).not.toContain('import("html2canvas")');
    expect(exportSource).toContain('import("jspdf")');
  });
});
