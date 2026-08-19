import { describe, expect, it } from "vitest";
import { summarizeMaintenance } from "./db";

describe("maintenance summaries", () => {
  it("cảnh báo lịch quá hạn và phiếu sự cố ưu tiên cao", () => {
    const now = new Date("2026-08-19T00:00:00Z");
    expect(summarizeMaintenance([
      { nextDueAt: new Date("2026-08-18T00:00:00Z"), status: "active" },
      { nextDueAt: new Date("2026-08-20T00:00:00Z"), status: "active" },
      { nextDueAt: new Date("2026-08-10T00:00:00Z"), status: "paused" },
    ], [
      { status: "open", priority: "critical", cost: "100000" },
      { status: "in_progress", priority: "high", cost: 50000 },
      { status: "cancelled", priority: "critical", cost: 90000 },
    ], now)).toEqual({ overdue: 1, openTickets: 2, criticalTickets: 1, totalCost: 150000 });
  });
});
