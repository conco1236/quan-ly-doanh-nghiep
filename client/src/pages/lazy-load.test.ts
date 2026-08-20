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

  it("loads finance and HR reporting surfaces only after their module is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./FinancePanel"))');
    expect(home).toContain('lazy(() => import("./HRTimePanel"))');
    expect(home).toContain("<LazyFinancePanel />");
    expect(home).toContain("<LazyHRTimePanel");
  });

  it("loads POS and employee management surfaces only after their module is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./POSPanel"))');
    expect(home).toContain('lazy(() => import("./EmployeesPanel"))');
    expect(home).toContain("<LazyPOSPanel");
    expect(home).toContain("<LazyEmployeesPanel");
  });

  it("loads purchasing and maintenance surfaces only after their module is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./PurchasingPanel"))');
    expect(home).toContain('lazy(() => import("./MaintenancePanel"))');
    expect(home).toContain("<LazyPurchasingPanel");
    expect(home).toContain("<LazyMaintenancePanel");
  });

  it("loads inventory, production and QC surfaces only after their module is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./InventoryPanel"))');
    expect(home).toContain('lazy(() => import("./ProductionPanel"))');
    expect(home).toContain('lazy(() => import("./QCPanel"))');
    expect(home).toContain("<LazyInventoryPanel");
    expect(home).toContain("<LazyProductionPanel");
    expect(home).toContain("<LazyQCPanel");
  });

  it("loads the shared table module only when a table-based surface is opened", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./SharedModuleTable"))');
    expect(home).toContain("<LazySharedModuleTable");
  });

  it("loads dashboard KPI and chart surfaces in contextual chunks", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('lazy(() => import("./DashboardKpiPanel"))');
    expect(home).toContain('lazy(() => import("./DashboardChartsPanel"))');
    expect(home).toContain("<LazyDashboardKpiPanel");
    expect(home).toContain("<LazyDashboardChartsPanel");
  });

  it("does not statically import html2canvas into client export helpers", () => {
    const exportSource = readFileSync(resolve(process.cwd(), "client/src/lib/export.ts"), "utf8");
    expect(exportSource).not.toContain('from "html2canvas"');
    expect(exportSource).not.toContain('import("html2canvas")');
    expect(exportSource).toContain('import("jspdf")');
  });
});
